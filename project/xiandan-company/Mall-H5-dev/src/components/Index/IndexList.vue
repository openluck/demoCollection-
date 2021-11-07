<template>
    <van-list
            v-if="!isEmpty"
            v-model="isLoading"
            @load="loadCommodities"
            :finished="loadFinished"
            finished-text="没有更多推荐商品了:)">
        <div class="index-list">
            <div class="index-commodity" v-for="(item,index) in commodities" :key="index">
                <div class="spacing" v-on:click="$router.push({name:'commodity',params:{hashid:item.id}})">
                    <div class="index-img">
                        <img :src="item.commodity_img">
                    </div>
                    <div class="details">
                        <p>
                            <span>[{{item.commodity_country}}]</span>
                            <!--<span>{{item.warehouse}}</span>-->
                        </p>
                        <p>{{item.commodity_name}}</p>
                        <p>¥{{item.commodity_current_price | transformPrice}}</p>
                    </div>
                </div>
            </div>
        </div>
    </van-list>
</template>

<script>
    'use strict';

    import Vue from 'vue'
    import { List } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';

    Vue.use(List);

    export default {
        name: 'IndexList',
        data() {
            return {
                current_page: 0, // eslint-disable-line camelcase
                commodities: [],
                isLoading: false,
                isEmpty: false,
                loadFinished: false
            }
        },
        components: {
            EmptyData
        },
        methods: {
            loadCommodities() {
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/commodities/RECOMMEND`, {
                    params: {
                        page: this.current_page
                    }
                }).then(response => {
                    this.isLoading = false;
                    this.isEmpty = response.data.meta.total === 0;
                    this.commodities = this.commodities.concat(response.data.data);
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                    this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                    this.last_page = response.data.meta.last_page;// eslint-disable-line camelcase
                });
            }
        }
    }
</script>

<style type="text/scss">
    .index-list {
        font-family: PingFang-SC-Bold;
        width: 100%;
        padding: 0 16px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 16px auto auto;

        .index-commodity {
            width: 50%;
            margin-bottom: 12px;
            padding-top: 0px !important;
            box-sizing: border-box;

            .spacing {
                width: 100%;
                background: white;
                text-align: center;
                box-sizing: border-box;
                padding-bottom: 14px;
                border-radius: 8px;

                .index-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px 8px 0px 0px;
                    box-sizing: border-box;

                    img {
                        max-width: 100%;
                        max-height: 100%;
                        border-radius: 8px 8px 0px 0px;
                    }
                }

                .details {
                    text-align: left;
                    width: 100%;
                    margin: auto;
                    padding: 0 17px;
                    box-sizing: border-box;

                    p:first-of-type {
                        margin-top: 9px;
                        font-size: 12px;
                        color: #636566;
                        font-weight: 500;
                        position: relative;

                        span:first-of-type {
                            color: #F75108;
                        }

                        span:nth-child(2) {
                            background: rgba(255, 245, 240, 1);
                            border-radius: 17px;
                            font-size: 11px;
                            padding: 2px;
                            font-family: PingFang SC;
                            font-weight: 500;
                            color: rgba(241, 13, 13, 1);
                            line-height: 16px;
                        }
                    }

                    p:nth-of-type(2) {
                        margin-top: 5px;
                        color: #313233;
                        font-weight: bold;
                        font-size: 15px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        line-height: 18px;
                    }

                    p:nth-of-type(3) {
                        margin-top: 8px;
                        font-size: 18px;
                        color: #F10D0D;
                        font-weight: bold;
                        position: relative;
                        left: -2%;
                    }
                }
            }
        }
    }

    .index-list > div:nth-child(odd) {
        padding-right: 5px;
    }

    .index-list > div:nth-child(even) {
        padding-left: 5px;
    }
</style>
