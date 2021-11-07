<template>
    <router-link :tag="tag" :to="to">
        <slot name="icon">
            <van-icon class-prefix="iconfont" :name="icon"/>
        </slot>
        <span>{{name}}</span>
        <van-icon class-prefix="iconfont" name="yuanjiaojuxingkaobei" v-if="arrow"/>
    </router-link>
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import { Icon } from 'vant';
    Vue.use(Icon);

    export default {
        name: 'MenuItem',
        props: {
            tag: {
                type: String,
                default: 'p'
            },
            to: {
                type: [String, Object],
                required: true
            },
            icon: {
                type: String
            },
            name: {
                type: String,
                required: true
            },
            arrow: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style>

</style>
