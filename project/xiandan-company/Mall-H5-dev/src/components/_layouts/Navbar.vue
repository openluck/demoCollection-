<template>
    <van-tabbar v-show="active"
                active-color="#F63737"
                v-model="selected"
                @change="onChange">
        <van-tabbar-item name="index" icon-prefix="iconfont" :icon="selected !== 'index' ? 'wei3' : 'tubiao1'">
            首页
        </van-tabbar-item>
        <van-tabbar-item name="countries" icon-prefix="iconfont" :icon="selected !== 'countries' ? 'wei2' : 'quan1'">
            全部产品
        </van-tabbar-item>
        <van-tabbar-item name="cart" icon-prefix="iconfont" :icon="selected !== 'cart' ? 'wei1' : 'gou'" :info="cartNum > 0 ? cartNum : null">
            购物车
        </van-tabbar-item>
        <van-tabbar-item name="usercenter" icon-prefix="iconfont" :icon="selected !== 'usercenter' ? 'zu' : 'wo' ">
            我的闲蛋
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
    'use strict';
    // import '@/sass/navbar.scss'
    import Vue from 'vue';
    import { Tabbar, TabbarItem, Icon } from 'vant';

    Vue.use(Tabbar).use(TabbarItem).use(Icon);

    export default {
        data: () => ({
            selected: 'index',
            active: true
        }),
        components: {},
        computed: {
            user() {
                return this.$store.state.user
            },
            cartNum() {
                return this.$store.state.cartNum
            }
        },
        created() {
            this.initCartCount();
        },
        watch: {
            '$route.name': {
                handler: function (val) {
                    this.routeHandler(val);
                }
            }
        },
        methods: {
            initCartCount: function () {
                this.$http.get('/api/cart/count').then(response => {
                    if (response.data.code === 0) {
                        this.$store.commit('updateCart', {
                            empty: '=',
                            num: response.data.message
                        });
                    }
                });
            },
            onChange: function (val) {
                this.$router.replace({ name: val });
            },
            routeHandler: function (val) {
                const activeRouteNames = ['home', 'index', 'countries', 'cart', 'usercenter'];
                this.active = (activeRouteNames.indexOf(val) !== -1);
                this.selected = val === 'home' ? 'index' : val;
            }
        }
    };
</script>
