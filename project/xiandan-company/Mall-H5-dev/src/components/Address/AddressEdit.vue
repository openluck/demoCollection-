<template>
    <van-address-edit
            :area-list="areaList"
            show-delete
            show-set-default
            :address-info="address"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
            v-if="address!= null"
    />
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import { Toast, AddressEdit } from 'vant';
    import area from '../../common/js/area'

    Vue.use(Toast).use(AddressEdit);

    export default {
        data() {
            return {
                address: null,
                areaList: area,
                popupVisible: false
            };
        },
        components: {},
        created() {
            this.fetchAddress();
        },
        computed: {
            address() {
                return this.$store.state.chooseAddress;
            }
        },
        methods: {
            fetchAddress: function () {
                Toast.loading({ message: '加载中...', forbidClick: true })
                this.$http.get(`/api/address/${this.$route.params.hashid}`).then(response => {
                    Toast.clear();
                    if (response.data.code === 0) {
                        let { id, name, phone, province, city, district, address, defaulted } = response.data.message;
                        this.address = {
                            id: id,
                            name: name,
                            tel: phone,
                            province: province,
                            city: city,
                            county: district,
                            addressDetail: address,
                            isDefault: defaulted === 1,
                            areaCode: this.calcAreaCode(province, city, district)
                        };
                    } else {
                        Toast(response.data.message);
                        this.$router.back();
                    }
                });
            },
            calcAreaCode: function (province, city, district) {
                let provinceCode = '';
                Object.keys(area.province_list).forEach(key => {
                    if (area.province_list[key] === province) {
                        provinceCode = key.substr(0, 2);
                    }
                });
                if (province === '') {
                    return '';
                }

                let cityCode = ''
                Object.keys(area.city_list).forEach(key => {
                    if (area.city_list[key] === city && key.startsWith(provinceCode)) {
                        cityCode = key.substr(0, 4);
                    }
                });
                if (cityCode === '') {
                    return province;
                }
                let districtCode = '';
                Object.keys(area.county_list).forEach(key => {
                    if (area.county_list[key] === district && key.startsWith(cityCode)) {
                        districtCode = key.substr(0, 6);
                    }
                });
                if (districtCode === '') {
                    return cityCode;
                }

                return districtCode

            },
            onSave: function (AddressInfo) {
                Toast.loading({ message: '加载中...', forbidClick: true })
                let { id, name, tel, province, city, county, addressDetail, isDefault } = AddressInfo
                let address = {
                    id: id,
                    name: name,
                    phone: tel,
                    province: province,
                    city: city,
                    district: county,
                    address: addressDetail,
                    defaulted: isDefault
                }
                this.$store.commit('updateChooseAddress', address);
                this.$http.put('/api/address/' + address.id, address).then(response => {
                    Toast.clear();
                    Toast({
                        message: response.data.message
                    });
                    if (response.data.code === 0) {
                        this.$router.back();
                    }
                });
            },
            onDelete: function (AddressInfo) {
                Toast.loading({ message: '加载中...', forbidClick: true })
                this.$http.delete('/api/address/' + AddressInfo.id).then(response => {
                    Toast.clear();
                    Toast({
                        message: response.data.message
                    });
                    this.$store.commit('updateChooseAddress', '');
                    if (response.data.code === 0) {
                        window.history.go(-1);
                    }
                });
            }
        }
    };
</script>

<style type="text/scss">

</style>
