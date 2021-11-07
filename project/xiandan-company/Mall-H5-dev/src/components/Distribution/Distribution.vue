<template>
    <div class="distribution">
        <van-list @load="loadMore"
                  :finished="loadFinished"
                  :v-model="isLoading"
                  finished-text="没有更多佣金了:)"
                  v-if="list.code === 0 && list.data.length > 0">
            <div v-for="(item,index) in list.data" :key="index">
                <div class="distribution-top">
                    <div>
                        <img :src="item.avatar">
                    </div>
                    <div>
                        <p>{{item.nickname}}</p>
                        <p>订单号:{{item.number}}</p>
                    </div>
                    <div>
                        <p>订单金额</p>
                        <p>￥{{item.amount}}</p>
                    </div>
                </div>
                <div class="distribution-bottom">
                    <p>佣金：<span>￥{{item.brokerage}}</span></p>
                    <p>{{commissionStatus[item.status]}}</p>
                </div>
            </div>
        </van-list>
        <empty-data v-show="!isLoading" :is-show="{empty:(list.code === 1 || list.data.length <= 0), stroll:false, agent: list.code}">
            <van-icon class-prefix="iconfont" name="tubiao5" slot="img"/>
            <h4 slot="header" v-if="list.code === 0">~~~暂无佣金~~~</h4>
            <h4 slot="header" v-else>赶快去闲蛋商城申请成为代理吧</h4>
        </empty-data>
    </div>
</template>

<script>
    'use strict';

    import Vue from 'vue'
    import { List } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';

    Vue.use(List);

    export default {
        data() {
            return {
                commissionStatus: ['未结算', '已结算'],
                list: {
                    data: []
                },
                current_page: 0,
                isLoading: false,
                loadFinished: false
            }
        },
        created() {
            this.isLoading = true
            this.loadPageData();
        },
        components: {
            EmptyData
        },
        methods: {
            loadPageData: function () {
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/shop/manager/order`).then(response => {
                    this.isLoading = false;
                    if (response.data.code === 0) {
                        this.$set(this.$data.list, 'code', response.data.code)
                        this.list.data = this.list.data.concat(response.data.data);
                        this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                        this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                    } else if (response.data.code === 1) {
                        this.$set(this.$data.list, 'code', 1)
                    }
                });
            },
            //    上拉加载
            loadMore() {
                this.loadPageData();
            }
        }
    }
</script>

<style  type="text/scss">
    .distribution {
        width: 100%;
        margin: auto;

        & > div {
            box-sizing: border-box;

            & > div {
                margin-top: 16px;
                background: white;
            }

            .distribution-top {
                display: flex;
                padding: 16px 16px 0 16px;

                div:nth-of-type(1) {
                    width: 50px;
                    height: 50px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                div:nth-of-type(2) {
                    width: calc(100% - 150px);
                    padding-left: 12px;
                    box-sizing: border-box;

                    p:nth-of-type(1) {
                        margin-top: 5px;
                        font-size: 15px;
                        font-weight: bold;
                    }

                    p:nth-of-type(2) {
                        margin-top: 8px;
                        color: #636566;
                        font-size: 12px;
                    }
                }

                div:nth-of-type(3) {
                    width: 100px;
                    text-align: center;
                    font-size: 14px;

                    p {
                        text-align: right;
                        font-size: 12px;
                        color: #333333;
                        margin-top: 3px;
                    }

                    p:nth-of-type(1) {
                        margin-top: 10px;
                    }
                }
            }

            .distribution-bottom {
                margin-top: 10px;
                font-size: 15px;
                border-top: 1px solid #F0F3F5;
                height: 40px;
                line-height: 40px;
                display: flex;
                box-sizing: border-box;

                p:nth-of-type(1) {
                    background: #EF3939;
                    color: white;
                    font-size: 14px;
                    width: 100px;
                    text-align: center;

                    span {
                        font-size: 16px;
                    }
                }

                p:nth-of-type(2) {
                    text-align: center;
                    margin: auto;
                    font-size: 14px;
                }
            }
        }
    }
</style>
