<template>
    <div>
        <van-address-list
                :list="list"
                v-model="addressId"
                :switchable="$route.query.mode === 'choose'"
                default-tag-text="默认"
                add-button-text="添加收货地址"
                @add="onAdd"
                @edit="onEdit"
                @select="onChoose"/>
        <empty-data :is-show="{empty:addressList.length<=0, center:true, stroll:false}" class="address-empty">
            <van-icon class-prefix="iconfont" name="xiangguandizhi" slot="img"/>
            <h4 slot="header">还没有相关地址···</h4>
        </empty-data>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import { Toast, Icon, AddressList } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';

    Vue.use(Toast).use(Icon).use(AddressList);

    export default {
        data() {
            return {
                addressList: [],
                addressId: 0
            };
        },
        components: {
            EmptyData
        },
        computed: {
            address() {
                return this.$store.state.chooseAddress;
            },
            list() {
                return this.addressList.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        tel: item.phone,
                        isDefault: item.defaulted === 1,
                        address: `${item.province} ${item.city} ${item.district} ${item.address}`
                    }
                });
            }
        },
        filters: {
            fullAddress: function (addressInfo) {
                return `${addressInfo.province} ${addressInfo.city} ${addressInfo.district} ${addressInfo.address}`
            }
        },
        created() {
            if (this.address) {
                this.addressId = this.address.id
            }
            this.fetchAddress();
        },
        methods: {
            fetchAddress: function () {
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true
                });
                this.$http.get('/api/address').then(response => {
                    if (response.data.code === -1) {
                        Toast.clear();
                        Toast(response.data.code);
                    } else {
                        if (this.chooseMode) {
                            let chooseAdd = response.data.message.find(item => item.id === this.addressId);
                            if (chooseAdd) { //把当前选择的地址放在最前面
                                let pos = response.data.message.indexOf(chooseAdd);
                                response.data.message.splice(pos, 1);
                                response.data.message.unshift(chooseAdd)
                            }
                        } else {
                            let defaultAdd = response.data.message.find(item => item.defaulted === 1);
                            if (defaultAdd) { //把默认地址放在最前面
                                let pos = response.data.message.indexOf(defaultAdd);
                                response.data.message.splice(pos, 1);
                                response.data.message.unshift(defaultAdd)
                            }
                        }

                        this.addressList = response.data.message
                        this.$nextTick(function () {
                            Toast.clear();
                        });
                    }
                });
            },
            onAdd: function () {
                this.$router.push({ name: 'add-address' });
            },
            onEdit(item) {
                this.$router.push({ name: 'edit-address', params: { 'hashid': item.id } });
            },
            onChoose: function (AddressInfo) {
                let address = this.addressList.find(item => item.id === AddressInfo.id);
                this.$store.commit('updateChooseAddress', address);
                this.$router.back();
            }
        }
    };
</script>

<style type="text/scss">
    .address-empty {
        h4 {
            font-size: 14px !important;
        }
    }
    .van-address-list {
        .van-radio-group {
            .van-address-item {
                .van-cell {

                    .van-address-item__name {
                        .van-address-item__tag {
                            font-size: 12px;
                        }
                    }

                    .van-address-item__edit {
                        position: absolute;
                    }
                }
            }
        }
    }
</style>
