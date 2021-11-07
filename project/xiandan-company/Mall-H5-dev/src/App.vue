<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="this.$route.meta.keepAlive"/>
        </keep-alive>
        <router-view v-if="!this.$route.meta.keepAlive"/>
        <navbar/>
        <new-package/>
        <follow-notice/>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import Navbar from './components/_layouts/Navbar';
    import NewPackage from './components/NewPackage';
    import FollowNotice from './components/_layouts/FollowNotice'
    import { weixinShare } from '@/common/js/tools';
    import { Toast } from 'vant';

    Vue.use(Toast);

    export default {
        name: 'App',
        components: {
            Navbar,
            NewPackage,
            FollowNotice
        },
        created() {
            this.fetchShopConfig();
            if (this.$store.getters.isLogin) {
                this.orderQuantity();
            }
        },
        beforeDestroy() {

        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            orderNum() {
                return this.$store.state.orderNum
            }
        },
        watch: {
            '$route.path': function (newVal) {
                const reg = /\/\d+\/commodity/;
                if (!reg.test(newVal) && !process.env.isMiniprogram) {
                    if (['mallInvitation', 'qrCode', 'activityCode', 'poster'].concat(newVal)) {
                        weixinShare('闲蛋（跨境）商城', '点击注册即可领取新人大礼包哦！', this.$http.defaults.baseURL + '/public/register/wechat?inviter=' + this.$store.state.user.uid, 'https://s.xiandanmall.com/ICON-500.png')
                    } else {
                        weixinShare('闲蛋（跨境）商城', '欢迎关注闲蛋（跨境）电商，闲蛋商城全程海关监管，阳光清关，保税仓直发，杜绝假货！', this.$http.defaults.baseURL + '/mall/', 'https://s.xiandanmall.com/ICON-500.png')
                    }
                }
            }
        },
        mounted() {
            // remove loading
            const loading = document.getElementsByClassName('loading');
            if (loading.length > 0 && loading[0].parentNode) {
                loading[0].parentNode.removeChild(loading[0])
            }
        },
        methods: {
            fetchShopConfig: function () {
                this.$http.get('/api/shopconfig').then((response) => {
                    this.$store.commit('initShopConfig', response.data);
                })
            },
            // 获取订单数量
            orderQuantity() {
                this.$http.get('api/order?status=info').then(response => {
                    if (response.data.code === 0) {
                        this.$store.commit('updateUserNum', response.data.message);
                    } else {
                        Toast('订单数量获取失败')
                    }
                })
            }
        }
    }
</script>
