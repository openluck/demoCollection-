<template>
    <div class="body" :style="{minHeight:this.clientHeight}">
        <div class="title">
            <img src="/images/img/bar.png" />
            <p> 邀请好友免费获得好礼 </p>
            <img src="/images/img/bar.png" />
        </div>
        <div class="wait-scroll-loading" v-if="wait">
            <van-loading type="spinner" color="#09bb07" :size="25"/>
        </div>
        <activities-home/>
    </div>
</template>

<script>
    import Home from './home';
    import Vue from 'vue';
    import { Loading } from 'vant';

    Vue.use(Loading);

    export default {
        name: 'national',
        data() {
            return {
                clientHeight: '1000px',
                wait: true
            }
        },
        components: {
            'activities-home': Home
        },
        created() {
            this.clientHeight = `${document.documentElement.clientHeight}px`
        }
    }
</script>

<style  type="text/scss">
    .body{
        background: #F13232;
        background-image: url("/images/img/national_bg.png");
        background-position: center top;
        background-repeat: no-repeat;
        .title{
            display: flex;
            justify-content: center;
            align-items: center;
            color:#fff;
            margin: 0;
            text-align: center;
            font-weight: bolder;
            font-size: 26px;
            padding-top: 70px;
            img{
                width: 20px;
                height: 2px;
                margin: 0 8px;
            }
        }
    }
</style>
