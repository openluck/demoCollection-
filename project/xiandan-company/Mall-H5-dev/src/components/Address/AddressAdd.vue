<template>
    <div>
        <van-address-edit
                :area-list="areaList"
                show-set-default
                show-search-result
                save-button-text="确定"
                detail-rows="2"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"/>

        <van-popup v-model="popupVisible"
                   popup-transition="popup-fade"
                   class="address-popup">
            <span>请输入真实姓名及有效收货地址，以便海关清关查验！</span>
            <div @click="popupVisible = !popupVisible">我知道了</div>
        </van-popup>
    </div>
</template>
<script>
    'use strict';
    import Vue from 'vue';
    import {Toast, Popup, Icon, AddressEdit} from 'vant';
    import area from '../../common/js/area'

    Vue.use(Toast).use(Popup).use(Icon).use(AddressEdit);

    export default {
        data() {
            return {
                areaList: area,
                popupVisible: true
            };
        },
        components: {},
        methods: {
            onSave: function (AddressInfo) {
                Toast.loading({message: '请求中...', forbidClick: true})
                let {name, tel, province, city, county, addressDetail, isDefault} = AddressInfo
                this.$http.post('/api/address', {
                    name: name,
                    phone: tel,
                    province: province,
                    city: city,
                    district: county,
                    address: addressDetail,
                    defaulted: isDefault
                }).then(response => {
                    Toast.clear();
                    Toast({message: response.data.message});
                    if (response.data.code === 0) {
                        this.$router.back();
                    }

                    //解决添加新的地址为默认地址返回下单节面之前选择的地址还显示"默认"问题
                    if (isDefault && this.$store.state.chooseAddress) {
                        this.$store.state.chooseAddress.defaulted = false
                        this.$store.commit('updateChooseAddress', this.$store.state.chooseAddress);
                    }
                });
            }
        }
    }
    ;
</script>

<style type="text/scss">
    .address-popup {
        padding: 16px;
        border-radius: 16px;
        width: calc(100% - 128px);

        span {
            line-height: 30px;
        }

        .iconfont {
            font-size: 17px;
            position: absolute;
            top: 6px;
            right: 6px;
        }

        div {
            width: 90px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            background: #f84848;
            color: white;
            border-radius: 16px;
            font-size: 14px;
            margin: 30px auto auto;
        }
    }
</style>
