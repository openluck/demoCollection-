<template>
    <section class="empty-data-container" v-if="isShow.empty" :class="{center:isShow.center !=='no'}">
        <div class="empty-data-wrapper">
            <slot name="img"><img src="/images/icon/wu.png"/></slot>
            <slot name="header"><h4>商品上架中，敬请期待···</h4></slot>
            <slot name="explain"/>
            <router-link :to="{name:'index'}" v-if="isShow.stroll">去逛逛</router-link>
            <div v-if="isShow.agent === 0" @click="$router.replace({name:'index'})" class="agent">去推荐</div>
            <div v-else-if="isShow.agent === 1" @click="applyAgent" class="agent">申请代理</div>
        </div>
    </section>
</template>

<script>
    'use strict';
    import '@/sass/commodity.scss';
    import Vue from 'vue';

    export default {
        props: {
            isShow: {
                type: Object,
                default: false
            }
        },
        methods: {
            applyAgent() {
                window.location.replace(Vue.prototype.$http.defaults.baseURL + '/public/shop/manager/apply')
            }
        }
    }
</script>

<style type="text/scss">
    .empty-data-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: Center;

        .empty-data-wrapper {
            margin: auto;
            text-align: center;

            .iconfont {
                font-size: 90px;
                color: rgb(99, 101, 102);
            }

            img {
                width: 200px;
            }

            h4 {
                color: #313233;
                margin-top: 26px;
                font-size: 16px;
                font-weight: 500;
            }

            p {
                font-size: 12px;
                color: #636566;
                margin-top: 12px;
            }

            a, .agent {
                text-decoration: none;
                border-radius: 20px;
                width: 170px;
                height: 32px;
                background: #F10D0D;
                font-size: 16px;
                font-weight: bold;
                display: block;
                color: white;
                text-align: center;
                line-height: 32px;
                margin: 10px auto auto;
            }
        }
    }

    .data-scroll-loading {
        width: 15px;
        height: 15px;
        padding: 10px;
        margin: 0 auto;
    }

    .data-scroll-end {
        padding: 10px;
        text-align: center;
        color: #09bb07;
    }

    .center {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
