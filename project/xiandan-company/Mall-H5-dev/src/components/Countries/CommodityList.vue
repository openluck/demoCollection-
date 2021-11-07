<template>
    <div>
        <div class="category-list">
            <div class="category-details" v-for="(item,index) in list " :key="index">
                <div class="category-column" v-on:click="$router.push({name:'commodity',params:{hashid:item.id}})">
                    <van-tag mark color="#F10D0D" size="medium">{{item.source|storageMode}}</van-tag>
                    <div class="category-img">
                        <img :src="item.commodity_img" alt="">
                    </div>
                    <div class="category-bottom">
                        <div style="display: none">
                            <span>{{item.commodity_country}}</span>
                            <span>{{item.source|storageMode}}</span>
                            <span><label>剩余：</label><label>{{item.commodity_stock_number}}</label></span>
                        </div>
                        <p>
                            {{item.commodity_name}}
                        </p>
                        <p v-show="code.msg === 'all'">
                            <span v-if="!item.commodity_country">闲蛋好货</span>
                            <slot v-else>
                                <span>进口国：</span>
                                <span>【{{item.commodity_country}}】</span>
                            </slot>

                        </p>
                        <p>
                            <span>¥{{item.commodity_current_price | transformPrice}}</span>
                            <span>¥{{item.commodity_original_price | transformPrice}}</span>
                        </p>
                        <p>
                            {{item.commodity_sold_number}}人购买
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue'
    import {Tag} from 'vant'

    Vue.use(Tag);

    export default {
        data() {
            return {};
        },
        props: ['code'],
        computed: {
            list: function () {
                return this.code.table ?  this.code.table :  this.code;
            }
        }
    };
</script>

<style type="text/scss">
    .category-list {
        width: 100%;
        padding: 0 16px;
        box-sizing: border-box;
        margin: 16px auto auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .category-details {
            width: 50%;
            box-sizing: border-box;

            .category-column {
                width: 100%;
                background: #FFFFFF;
                margin-bottom: 12px;
                position: relative;
                box-sizing: border-box;
                border-radius: 8px;

                .category-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px 8px 0 0;
                    box-sizing: border-box;

                    img {
                        max-width: 100%;
                        max-height: 100%;
                        border-radius: 8px 8px 0 0;
                    }
                }

                .category-bottom {
                    margin: 0 8px;

                    p:nth-of-type(2) {
                        margin-top: 10px;
                        font-size: 12px;

                        span:nth-of-type(1) {
                            color: #969899;
                        }

                        span:nth-of-type(2) {
                            color: #F10D0D;
                        }
                    }

                    p:nth-of-type(1) {
                        margin-top: 9px;
                        font-size: 14px;
                        color: #313233;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        line-height: 20px;
                        font-weight: bold;
                    }

                    p:nth-of-type(3) {
                        margin-top: 10px;

                        span:nth-of-type(1) {
                            color: #F10D0D;
                            font-weight: bold;
                            font-size: 18px;
                            position: relative;
                            left: -3px;
                        }

                        span:nth-of-type(2) {
                            margin-left: 7px;
                            color: #636566;
                            font-size: 12px;
                            text-decoration: line-through;
                        }
                    }

                    p:nth-of-type(4) {
                        margin-top: 10px;
                        font-size: 10px;
                        color: #969899;
                        padding-bottom: 16px;
                    }
                }
            }
        }
    }

    .category-list > div:nth-child(odd) {
        padding-right: 5px;
    }

    .category-list > div:nth-child(even) {
        padding-left: 5px;
    }
</style>
