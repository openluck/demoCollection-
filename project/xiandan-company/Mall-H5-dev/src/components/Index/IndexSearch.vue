<template>
    <div class="index-search">
        <router-link tag="div" to="search">
            <van-icon class-prefix="iconfont" name="sousuotubiao" color="#B3B3B3"/>
            <span>搜索闲蛋商品</span>
        </router-link>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Icon } from 'vant'

    Vue.use(Icon)

    export default {
        name: 'Search',
        components: {
            Icon
        }
    }
</script>

<style type="text/scss">
    .index-search {
        width: 100%;
        background: rgba(255, 255, 255, 10);
        padding: 6px 16px;

        box-sizing: border-box;

        div {
            width: 100%;
            height: 32px;

            margin: auto;

            text-align: center;
            line-height: 32px;
            border-radius: 18px;
            background: #f8fafc;

            .iconfont {
                display: inline-block;
                font-size: 25px;
                position: relative;
                top: 2px;
                left: 2px;
                color: #B3B3B3;

            }

            span {
                color: #B3B3B3;
                font-size: 16px;
                letter-spacing: 1px;

            }
        }
    }
</style>
