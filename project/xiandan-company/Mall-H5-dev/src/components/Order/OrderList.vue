<template>
    <div>
        <van-sticky>
            <order-top @selected="transmit" :navigation="topInfo"/>
        </van-sticky>
        <van-list class="order-list-part"
                  @load="loadPageData"
                  :finished="loadFinished"
                  v-model="isLoading"
                  finished-text="没有更多订单了:)"
                  v-if="!isEmpty">
            <div class="order-list-container" v-for="order in orders" :key="order.id">
                <span :class="[{orderClose:order.pay_status === 3}]">{{order.pay_status | transformStatus(order.ship_status)}}</span>
                <div class="order-list-item" v-for="detail in order.details" :key="detail.id"
                     v-on:click="$router.push({name:'order-detail',params:{'hashid':order.id}})">
                    <div class="order-list-img">
                        <img :src="detail.commodity_img"/>
                    </div>
                    <div class="order-list-title">
                        <p>
                            <van-tag round color="#F10D0D" size="medium">{{detail.commodity_country}}</van-tag>
                            <van-tag round color="#FF6C00" size="medium">{{detail.source|storageMode}}</van-tag>
                        </p>
                        <p>{{detail.commodity_name}}</p>
                        <p v-if="order.details.length >1">
                            <span><span>数量：</span>{{detail.buy_number}}</span>
                            <span> <span>单价：</span>&yen;{{detail.commodity_current_price | transformPrice}}</span>
                        </p>
                    </div>
                </div>
                <div class="order-line" v-if="order.details.length>1"></div>
                <div class="total-price" :class="{orderPrice:order.details.length === 1}">
                    <p class="order-num">
                        <span><span>合计：</span>&yen;{{order.order_amount | transformPrice}}</span>
                        <span><span>数量：</span>{{order.total_count}}</span>
                    </p>
                    <div>
                        <a v-if="order.ship_status === 2" href="tel:02867649839">联系客服</a>
                        <p v-show="order.pay_status === 1 && order.ship_status === 3"
                           @click="receiving(order)">确认收货</p>
                        <p v-show="order.pay_status === 0 && order.ship_status !==1" @click="pay(order)">付款</p>
                        <p v-if="(order.pay_status === 0 || order.pay_status === 1) && order.ship_status <1"
                           @click="cancel(order)">取消订单</p>
                        <p v-show="order.is_deletable" @click="remove(order.id)">删除订单</p>
                        <router-link
                                :to="{name:'Tracking', query:{'expNo': order.ship_number, 'expCode':getShippingCode(order.ship_name)}}"
                                v-if="order.ship_status> 2">查看物流
                        </router-link>
                        <!--                        <a :href="shippingUrl(order)"-->
                        <!--                           v-if="order.ship_status> 2" >查看物流</a>-->
                    </div>
                </div>
            </div>
        </van-list>
        <div class="order-recommend" v-else>
            <empty-data :is-show="{empty:orders.length === 0 && !isLoading, center:'no', stroll:false}"
                        class="order-no">
                <van-icon class-prefix="iconfont" name="tubiao7" slot="img"/>
                <h4 slot="header">没有相关数据···</h4>
            </empty-data>
            <order-title/>
            <commodity-list :code="noOrder.table"/>
        </div>
    </div>
</template>
<style>

</style>
<script>
    'use strict';
    import '@/sass/OrderList.scss';
    import Vue from 'vue';
    import { Toast, List, Dialog, Sticky, Tag } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';
    import OrderTop from './Navigation'
    import { getPlatform, getShippingCode } from '@/common/js/tools';
    import OrderTitle from './OrderTitle'
    import CommodityList from '../Countries/CommodityList'

    Vue.use(List).use(Toast).use(Sticky).use(Tag);

    export default {
        data() {
            return {
                selected: this.$route.params.type,
                current_page: 0, // eslint-disable-line camelcase
                orders: [],
                isLoading: false,
                isEmpty: false,
                loadFinished: false,
                type: ['all', 'unpay', 'unreceived'],
                topInfo: {
                    top: ['全部订单', '待付款', '待收货'],
                    action: 0
                },
                noOrder: {
                    isLoading: false,
                    loadFinished: false,
                    current_page: 0, // eslint-disable-line camelcase
                    table: []
                },
                clock: null,
                codeUrl: '',
                codePay: false
            }
        },
        components: {
            OrderTop,
            EmptyData,
            OrderTitle,
            CommodityList
        },
        filters: {
            transformStatus: function (payStatus, shipStatus) {
                if (payStatus === 0 && shipStatus === 0) {
                    return '未支付'
                } else if (payStatus === 3) {
                    return '已关闭'
                } else if (payStatus === 2 || shipStatus === 1) {
                    return '已取消'
                } else if (shipStatus === 0) {
                    return '已支付'
                } else if (shipStatus === 2) {
                    return '已确认'
                } else if (shipStatus === 3) {
                    return '已发货'
                } else if (shipStatus === 4) {
                    return '订单已确认收货'
                }
                return '未知状态';
            }
        },
        created() {
            this.topInfo.action = this.type.indexOf(this.selected)
        },
        watch: {
            selected: function (val) {
                this.$router.replace({
                    name: 'order-list',
                    params: { 'type': val }
                });
                this.initialization();
                this.loadPageData();
            }
        },
        beforeDestroy: function () {
            if (this.clock != null) {
                clearInterval(this.clock);
            }
        },
        methods: {
            shippingUrl(order) {
                let conname = order.ship_name;
                switch (order.ship_name) {
                    case '中通快递':
                        conname = 'ZTO'
                        break;
                    case '圆通快递':
                        conname = 'YTO'
                        break;
                    case '申通快递':
                        conname = 'STO'
                        break;
                    case '韵达速递':
                        conname = 'YD'
                        break;
                    case '顺丰速运':
                        conname = 'SF'
                        break
                    case '百世快递':
                        conname = 'HTKY'
                        break
                    case 'EMS':
                        conname = 'EMS'
                        break
                    case '天天快递':
                        conname = 'HHTT'
                        break;
                    case '京东快递':
                        conname = 'JD'
                        break;
                    case '优速快递':
                        conname = 'UC'
                        break;
                    case '德邦快递':
                        conname = 'DBL'
                        break;
                    case '宅急送':
                        conname = 'ZJS'
                        break;
                }
                return `https://www.kdniao.com/JSInvoke/MSearchResult.aspx?expCode=${conname}&expNo=${order.ship_number}&sortType=DESC&color=rgb(46,114,251)&backUrl="javascript:WeixinJSBridge.invoke('closeWindow')"`;
                // return `https://m.kuaidi100.com/app/query/?com=${conname}&coname=xiandanmall&nu=${order.ship_number}&callbackurl=${encodeURIComponent(location.href)}`;
            },
            getShippingCode: getShippingCode,
            loadPageData: function () {
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/order?status=${this.selected}&page=${this.current_page}`).then(response => {
                    this.isLoading = false;
                    this.isEmpty = response.data.meta.total === 0
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                    this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                    if (response.data.data.length === 0) {
                        this.loadCommodities()
                    } else {
                        this.orders = this.orders.concat(response.data.data);
                    }
                });
            },
            // 删除订单
            remove: function (id) {
                Dialog.confirm({ message: '您确定要删除订单吗?' }).then(() => {
                    Toast.loading({ message: '删除中...', forbidClick: true })
                    this.$http.delete(`/api/order/${id}`).then(response => {
                        Toast.clear()
                        if (response.data.code === 0) {
                            Toast({ message: '订单已删除！' });
                            this.orders.forEach((item, index) => {
                                if (item.id === id) {
                                    this.orders.splice(index, 1)
                                }
                            })
                            if (this.orders.length === 0) {
                                this.initialization();
                                this.loadPageData();
                            }
                        } else {
                            Toast({
                                message: response.data.message
                            });
                        }
                    });
                });
            },
            // 立即支付
            pay: function (order) {
                Toast.loading({ message: '微信下单中……', forbidClick: true })
                const platform = getPlatform();
                this.$http.get(`/api/order/${order.id}/order`,
                    {
                        params: { platform: platform }
                    }).then(response => {
                    Toast.clear();
                    if (response.data.code === 0) {
                        if (platform === 'WECHAT') {
                            wx.chooseWXPay({
                                timestamp: response.data.message.timestamp,
                                nonceStr: response.data.message.nonceStr,
                                package: response.data.message.package,
                                signType: response.data.message.signType,
                                paySign: response.data.message.paySign,
                                success: res => {
                                    this.$set(order, 'pay_status', 1);
                                    if(this.selected === 'unpay'){ //未支付栏需要取消移除列表
                                        this.orders.splice(this.orders.indexOf(order), 1);
                                    }
                                },
                                cancel: res => {
                                    Toast('微信支付失败！');
                                }
                            });
                        } else if (platform === 'MOBILE') {
                            location.href = response.data.message;
                        } else {
                            this.codeUrl = response.data.message;
                            this.codePay = true;
                            // 轮训检查账单是否支付
                            this.clock = window.setInterval(() => {
                                this.$http.get(`/api/order/${order.id}/check`).then(response => {
                                    if (response.data.code !== 0) {
                                        clearInterval(this.clock);
                                        this.codePay = false;
                                        Toast(response.data.message);
                                        return;
                                    }
                                    if (response.data.message === '1') { // 支付成功
                                        clearInterval(this.clock);
                                        this.codePay = false;
                                        this.$set(order, 'pay_status', 1);
                                        if(this.selected === 'unpay'){ //未支付栏需要取消移除列表
                                            this.orders.splice(this.orders.indexOf(order), 1);
                                        }
                                    }
                                })
                            }, 1000)
                        }
                    } else {
                        Toast(response.data.message);
                    }
                });
            },
            // 确认收货
            receiving: function (order) {
                Dialog.confirm({
                    message: '是否确认收货？',
                    title: '温馨提示',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '暂不'
                }).then(action => {
                    Toast.loading({ message: '请稍等……', forbidClick: true })
                    this.$http.put(`/api/order/${order.id}/confirm`).then(response => {
                        Toast.clear()
                        if (response.data.code === 0) {
                            Toast({
                                message: '确认收货成功!'
                            });
                            this.orders.forEach((item, index) => {
                                if (item.id === order.id) {
                                    this.orders.splice(index, 1);
                                }
                            });
                            if (this.orders.length === 0) {
                                this.initialization();
                                this.loadPageData();
                            }
                            this.$set(order, 'ship_status', 4);
                        } else {
                            Toast({
                                message: response.data.message
                            });
                        }
                    })
                });
            },
            // 取消订单
            cancel: function (order) {
                Dialog.confirm({ message: '您确定要取消订单吗?' }).then(action => {
                    Toast.loading({ message: '取消中……', forbidClick: true })
                    this.$http.post(`/api/order/${order.id}/cancel`).then(response => {
                        Toast.clear();
                        if (response.data.code === 0) {
                            // 更新咸蛋和红包数据
                            this.$store.commit('updateSaltEggs', response.data.message.user.salt_eggs);
                            this.$store.commit('updateRedPack', response.data.message.user.red_pack);
                            Toast({ message: '订单已取消！' });
                            if (order.pay_status === 1) {
                                order.pay_status = 2;// 已支付，变成已退款取消
                            } else { // 未支付，普通取消
                                order.ship_status = 1;
                            }
                            order.is_deletable = true;
                            if(this.selected === 'unpay'){ //未支付栏需要取消移除列表
                                this.orders.splice(this.orders.indexOf(order), 1);
                            }

                        } else {
                            Toast({
                                message: response.data.message
                            });
                        }
                    });
                });
            },
            transmit(msg) {
                this.selected = this.type[msg];
            },
            initialization() {
                this.current_page = 0;// eslint-disable-line camelcase
                this.orders = [];
                this.isLoading = false;
                this.loadFinished = false;
            },
            loadCommodities() {
                if (!this.noOrder.isLoading && !this.noOrder.loadFinished) {
                    this.noOrder.isLoading = true;
                    this.noOrder.current_page += 1; // eslint-disable-line camelcase
                    this.$http.get(`/api/commodities/RECOMMEND`, {
                        params: {
                            page: this.noOrder.current_page
                        }
                    }).then(response => {
                        this.noOrder.isLoading = false;
                        this.noOrder.table = this.noOrder.table.concat(response.data.data);
                        this.noOrder.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                        this.noOrder.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                    });
                }
            }
        }
    }
</script>

<style type="text/scss">

    .close {
        color: #636566 !important;
    }

    .order-line {
        width: 100%;
        height: 1px !important;
        padding: 0px !important;
        background: #F0F3F5;
    }

    .order-no {
        margin-top: 45px;
        margin-bottom: 30px;

        h4 {
            font-size: 12px !important;
        }
    }
</style>
