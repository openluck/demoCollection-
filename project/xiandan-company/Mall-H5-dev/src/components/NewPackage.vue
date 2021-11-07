<template>
    <div class="new-package" v-if="visible">
        <div class="new-mask"></div>
        <div class="new-popup">
            <van-icon class-prefix="iconfont" name="zu1" @click="cancel"/>
            <p class="new-title">新用户专享</p>
            <div>
                <coupon-list :table="shopConfig.new_user_rewards"/>
            </div>
            <p class="new-coupon-button" @click="onLogin">
                立即领取
            </p>
        </div>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/NewPackage.scss';
    import Vue from 'vue';
    import { Icon } from 'vant'
    import { login, fixed } from '@/common/js/tools';
    import CouponList from './User/CouponList'

    Vue.use(Icon)

    export default {
        name: 'NewPackage',
        data: () => {
            return {
                canceled: false
            }
        },
        props: ['msg'],
        components: {
            CouponList,
            Icon
        },
        computed: {
            shopConfig() {
                return this.$store.state.shopConfig;
            },
            visible() {
                const reg = new RegExp('anniversary').test(this.$route.fullPath);
                return (!this.$store.getters.isLogin && this.$route.name !== 'login' && this.shopConfig.new_user_rewards.length > 0 && !this.canceled && !reg)
            }
        },
        watch: {
            visible(val) {
                fixed(val)
            }
        },
        methods: {
            onLogin() {
                this.canceled = true;
                login(this.$router);
            },
            cancel() {
                this.canceled = true;
            }
        }
    }
</script>

<style>

</style>
