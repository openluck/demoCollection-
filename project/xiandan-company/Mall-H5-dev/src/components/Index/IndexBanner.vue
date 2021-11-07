<template>
    <div class="swipe-container">
        <van-swipe
                :autoplay="3000"
                :height="bannerWidth * (9 / 16)"
                indicator-color="white">
            <van-swipe-item v-for="banner in banners" :key="banner.id">
                <a :href="banner.redirect_url" class="banner-link">
                    <img :src="banner.img_url" class="banner-img"/>
                </a>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>
<script>
    'use strict';
    import Vue from 'vue';
    import { Swipe, SwipeItem } from 'vant';

    Vue.use(Swipe).use(SwipeItem)

    export default {
        data() {
            return {
                banners: [],
                bannerWidth: 0
            }
        },
        created() {
            if (!process.env.isMiniprogram) {
                this.bannerWidth = (window.document.body.clientWidth || window.document.body.clientHeight) - 32;
            } else {
                // console.log(wx.getSystemInfoSync().screenWidth);
                this.bannerWidth = wx.getSystemInfoSync().screenWidth - 32;
            }
            this.fetchBanner();
        },
        computed: {},
        methods: {
            fetchBanner: function () {
                this.$http.get('/api/banners').then(response => {
                    this.$set(this.$data, 'banners', response.data);
                });
            }
        }
    }
</script>

<style type="text/scss">
    .banner-img {
        width: 100%;
        border-radius: 16px;
    }

    .banner-link {
        width: 100%;
        display: inline-block
    }

    .swipe-container {
        width: 100%;
        padding: 0 16px;
        margin: 10px auto auto;
        border-radius: 16px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

</style>
