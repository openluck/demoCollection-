<template>
    <div class="history-search" :style="{height: screenHeight + 'px'}">
        <p v-show="show">搜索历史<van-icon class-prefix="iconfont" name="yuanjiaojuxingkaobei5" @click="eliminate"/></p>
        <ul class="history">
            <li v-for="(item,index) in history" :key="index" @click="commodity1(index)" ref="historyValue">{{item}}</li>
        </ul>
        <empty-data :is-show="{empty:history.length===0,stroll:false}" class="no-history">
            <van-icon class-prefix="iconfont" name="wujilu" slot="img"/>
            <h4 slot="header">暂无搜索记录</h4>
        </empty-data>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue'
    import { Icon } from 'vant'
    import EmptyData from '../Commodity/CommodityEmpty';

    Vue.use(Icon)

    export default {
        data() {
            return {
                history: [],
                show: true,
                num: 1,
                screenHeight: window.innerHeight - 44
            }
        },
        components: {
            EmptyData
        },
        watch: {
            'history': function (newValue) {
                this.show = newValue != null && newValue.length > 0;
            }
        },
        created() {
            this.$set(this.$data, 'history', JSON.parse(localStorage.getItem('cmts') || '[]'));
        },
        props: ['parentValue'],
        methods: {
            // 点击历史
            commodity1(index) {
                this.$emit('historyValue', this.$refs.historyValue[index].innerText);
            },
            // 点击历史栏清除功能
            eliminate() {
                localStorage.clear();
                this.history = '';
            }
        },
        mounted() {
            if (this.parentValue != null && this.parentValue.length > 0) {
                this.history = this.parentValue;
            }
        }
    }
</script>

<style  type="text/scss">
    .history-search{
        background: white;
        padding: 30px 16px 0 16px;
        box-sizing: border-box;
        margin-top: 44px;
        position: absolute;
        width: 100%;
        p{
            font-size: 23px;
            font-weight: bold;
            line-height: 23px;
            .iconfont{
                font-size: 20px;
                float: right;
                position: relative;
                top: 2px;
            }
        }
        ul{
            margin-top: 30px;
            li{
                font-size: 18px;
                margin-bottom: 22px;
            }
        }
        .no-history{
            margin-left: -16px!important;
            h4{
                font-size: 14px!important;
            }
        }
    }
</style>
