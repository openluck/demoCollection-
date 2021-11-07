<template>
    <div>
        <div class="wait-scroll-loading" v-if="isLoading">
            <van-loading type="spinner" color="#09bb07" :size="25"/>
        </div>
        <div class="order-detail-container" v-else>
            <div class="order-detail-top">
                <div style="width: 100%; margin-right: 10px">
                    <p>{{order.pay_status|transformStatus(order.ship_status)}}</p>
                    <p v-if="order.ship_status === 4 && order.pay_status === 1">收货时间：{{order.received_at|formatDate}}</p>
                    <p v-if="order.pay_status === 2 || order.ship_status === 2 || order.ship_status === 3">
                        {{order.pay_status === 2 ? title[0]: (order.ship_status === 2 ? title[1] : title[2])}}
                    </p>
                    <p v-else-if="order.pay_status === 0 && order.ship_status === 0">
                        <van-count-down :time="createdTime + 1800000 - new Date().getTime()"
                                        format="订单将在mm 分 ss 秒关闭!"/>
                    </p>
                    <p v-else-if="order.ship_status === 3 ">
                        <van-count-down :time="shipTime + 3600000*24*15 - new Date().getTime()"
                                        format="订单将在DD天HH小时将自动收货!"/>
                    </p>
                </div>
                <van-icon class-prefix="iconfont" name="weizhifu"
                          v-if="order.pay_status ===  0 && order.ship_status !== 1"/>
                <van-icon class-prefix="iconfont" name="guanbi" v-if="order.pay_status > 1 || order.ship_status === 1"/>
                <van-icon class-prefix="iconfont" name="yuanjiaojuxing"
                          v-if="order.pay_status === 1 && (order.ship_status === 2 || order.ship_status === 0)"/>
                <van-icon class-prefix="iconfont" name="icon-test"
                          v-if="order.pay_status === 1 && order.ship_status === 3"/>
                <van-icon class-prefix="iconfont" name="juxing"
                          v-if="order.pay_status === 1 && order.ship_status === 4"/>
            </div>
            <div class="order-detail-address">
                <div class="order-detail-logistics" v-if="order.ship_status > 2">
                    <div>
                        <van-icon class-prefix="iconfont" name="tubiaokaobei" color="white"/>
                    </div>
                    <p/>
                    <div>
<!--                        <a :href="shippingUrl">-->
<!--                            <span>物流信息：</span>{{order.ship_name}}{{order.ship_number}}-->
<!--                        </a>-->
                        <router-link
                                :to="{name:'Tracking', query:{'expNo': order.ship_number, 'expCode':getShippingCode(order.ship_name)}}"
                                v-if="order.ship_status> 2"><span>物流信息：</span>{{order.ship_name}}{{order.ship_number}}
                        </router-link>
                    </div>
                </div>
                <p v-if="order.ship_status > 2"/>
                <order-address :address="order"/>
                <p/>
                <div class="order-detail-logistics">
                    <div>
                        <van-icon class-prefix="iconfont" name="dingdan" color="white"/>
                    </div>
                    <div>
                        <p><span>订单编号：</span><span>{{order.order_number}}</span></p>
                        <p><span>下单时间：</span><span>{{order.created_at}}</span></p>
                        <p v-if="(order.ship_status === 3 || order.ship_status === 4) && order.pay_status === 1"><span>发货时间：</span><span>{{order.shipping_at}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <order-inventory :goods="order.details"/>
            <order-transaction :payment="order" style="margin-bottom: 60px"/>
            <div class="order-detail-wrapper">
                <div v-if="order.pay_status === 0 && order.ship_status === 0">
                <span @click="remove"
                      v-if="order.pay_status === 2 || order.pay_status === 3 || order.ship_status === 1 || order.ship_status === 6">删除订单</span>
                    <span @click="cancel">取消订单</span>
                    <span @click="pay" class="order-detail-right">立即支付</span>
                </div>
                <div v-else-if="order.pay_status === 1 && order.ship_status === 0">
                <span @click="remove"
                      v-if="order.pay_status === 2 || order.pay_status === 3 || order.ship_status === 1 || order.ship_status === 6">删除订单</span>
                    <span @click="cancel">取消订单</span>
                    <a href="tel:02867649839">联系客服</a>
                </div>
                <div>
                <span @click="remove"
                      v-if="order.pay_status === 2 || order.pay_status === 3 || order.ship_status === 1 || order.ship_status === 6">删除订单</span>
                    <span @click="receiving"
                          v-if="order.pay_status === 1 && order.ship_status === 3 ">确认收货</span>
                    <a href="tel:02867649839"
                       v-if="order.ship_status === 4 || order.ship_status === 3 || order.ship_status === 1 ||  order.ship_status === 2">联系客服</a>
                </div>
            </div>
            <van-popup v-model="codePay">
                <div class="img" style="text-align: center">
                    <qrcode :url="codeUrl" :wid="200" :hei="200"/>
                    <p style="color: #0f9d58">微信扫一扫，立即支付</p>
                </div>
            </van-popup>
        </div>
        <van-popup v-model="popupExist"
                   class="exist-order"
                   v-else-if="popupExist">
            <van-icon class-prefix="iconfont" name="chacha"/>
            <p>您的订单不存在！</p>
            <van-button :to="{ name:'index' }">确定</van-button>
        </van-popup>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/OrderDetail.scss';
    import Vue from 'vue';
    import { Toast, Dialog, Popup, Loading, Icon, CountDown, Button } from 'vant';
    import qrcode from 'vue_qrcodes'
    import { getPlatform, getShippingCode } from '@/common/js/tools';
    import OrderAddress from './OrderAddress'
    import OrderInventory from '@/components/Order/OrderInventory';
    import OrderTransaction from './OrderTransaction'

    Vue.use(Toast).use(Popup).use(Loading).use(Icon).use(CountDown).use(Button);

    export default {
        data() {
            return {
                order: {
                    discount_details: { coupon: 0, redpack: 0, score: 0 } // eslint-disable-line camelcase
                },
                coupon: false,
                redpack: false,
                score: false,
                codeUrl: '',
                codePay: false,
                popupExist: false,
                clock: null,
                isLoading: true,
                title: ['退款将在三个工作日以内原路返回你所选择的支付方式里!', '订单将在1-2个工作日内完成清关，清关后宝贝将在3-5个工作日送到您手中！', '宝贝将在3-5个工作日送到您手中！']
            }
        },
        components: {
            OrderInventory,
            CountDown,
            qrcode,
            Icon,
            OrderAddress,
            OrderTransaction
        },
        computed: {
            shipTime() {
                const time = this.order.shipping_at;
                const date = new Date(time.replace('-', '/'));
                return date.getTime();
            },
            createdTime() {
                const time = this.order.created_at;
                const date = new Date(time.replace('-', '/'));
                return date.getTime();
            },
            shippingUrl(){
                let conname = 'unkown';
                switch (this.order.ship_name) {
                    case '中通快递':
                        conname = 'zhongtong'
                        break;
                    case '圆通快递':
                        conname = 'yuantong'
                        break;
                    case '申通快递':
                        conname = 'shentong'
                        break;
                    case '韵达速递':
                        conname = 'yunda'
                        break;
                    case '顺丰快递':
                        conname = 'shunfeng'
                        break;
                }
                return `https://m.kuaidi100.com/app/query/?com=${conname}&coname=xiandanmall&nu=${this.order.ship_number}&callbackurl=${encodeURIComponent(location.href)}`;
            }
        },
        filters: {
            transformStatus: function (payStatus, shipStatus) {
                if (shipStatus === 1) {
                    return '已取消';
                }
                /* eslint-disable */
                switch (payStatus) {
                    case 0:
                        return '未支付';
                    case 2:
                        return '已取消';
                    case 3:
                        return '已关闭，订单超时未支付!';
                }

                switch (shipStatus) {
                    case 0:
                        return '订单已支付，等待平台确认';
                    case 2:
                        return '订单已确认，等待发货';
                    case 3:
                        return '订单已发货';
                    case 4:
                        return '订单已确认收货';
                    case 6:
                        return '已取消';
                }
                /* eslint-enable */
                return '已完成'
            },
            formatDate: function (value) {
                const date = new Date(value);
                const y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? (`0${MM}`) : MM;
                let d = date.getDate();
                d = d < 10 ? (`0${d}`) : d;
                let h = date.getHours();
                h = h < 10 ? (`0${h}`) : h;
                let m = date.getMinutes();
                m = m < 10 ? (`0${m}`) : m;
                let s = date.getSeconds();
                s = s < 10 ? (`0${s}`) : s;
                return `${y}-${MM}-${d} ${h}:${m}:${s}`
            }
        },
        created() {
            this.fetchDetails();
        },
        beforeDestroy: function () {
            if (this.clock != null) {
                clearInterval(this.clock);
            }
        },
        methods: {
            fetchDetails: function () {
                const itemId = this.$route.params.hashid;
                this.$http.get(`/api/order/${itemId}`).then(response => {
                    this.isLoading = false;
                    if (response.data.code === -1) {
                        this.popupExist = true;
                    }
                    if (response.data.code === 0) {
                        this.order = response.data.message;
                        this.moneyShow();
                    }
                });
            },
            getShippingCode: getShippingCode,
            // 立即支付
            pay: function () {
                Toast.loading({
                    message: '微信下单中……',
                    forbidClick: true
                });
                const itemId = this.$route.params['hashid'];
                const platform = getPlatform();
                this.$http.get(`/api/order/${itemId}/order`,
                    {
                        params: { platform: platform }
                    }).then(response => {
                    Toast.clear()
                    if (response.data.code === 0) {
                        if (platform === 'WECHAT') {
                            wx.chooseWXPay({
                                timestamp: response.data.message.timestamp,
                                nonceStr: response.data.message.nonceStr,
                                package: response.data.message.package,
                                signType: response.data.message.signType,
                                paySign: response.data.message.paySign,
                                success: res => {
                                    this.$set(this.order, 'pay_status', 1);
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
                                this.$http.get(`/api/order/${itemId}/check`).then(response => {
                                    if (response.data.code !== 0) {
                                        clearInterval(this.clock);
                                        this.codePay = false;
                                        Toast(response.data.message);
                                        return;
                                    }
                                    if (response.data.message === '1') { // 支付成功
                                        clearInterval(this.clock);
                                        this.codePay = false;
                                        this.$set(this.order, 'pay_status', 1);
                                    }
                                })
                            }, 1000)
                        }
                    } else {
                        Toast(response.data.message);
                    }
                });
            },

            // 取消订单
            cancel: function () {
                Dialog.confirm({ message: '您确定要取消订单吗?' }).then(action => {
                    Toast.loading({
                        message: '取消中...',
                        forbidClick: true
                    });
                    const itemId = this.$route.params['hashid'];
                    this.$http.post(`/api/order/${itemId}/cancel`).then(response => {
                        Toast.clear()
                        if (response.data.code === 0) {
                            // 更新咸蛋和红包数据
                            this.$store.commit('updateSaltEggs', response.data.message.user.salt_eggs);
                            this.$store.commit('updateRedPack', response.data.message.user.red_pack);
                            Toast({ message: '订单已取消！' });
                            if (this.order.pay_status === 1) { // 已支付，变成已退款取消
                                this.$set(this.order, 'pay_status', 2);
                            } else { // 未支付，普通取消
                                this.$set(this.order, 'ship_status', 1);// 普通取消
                            }
                        } else {
                            Toast({
                                message: response.data.message
                            });
                        }
                    });
                });
            },
            // 确认收货
            receiving: function () {
                Dialog.confirm({
                    message: '是否确认收货？',
                    title: '温馨提示',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '暂不'
                }).then(() => {
                    Toast.loading({
                        message: '加载中...',
                        forbidClick: true
                    });
                    this.$http.put(`/api/order/${this.order.id}/confirm`).then(response => {
                        Toast.clear()
                        if (response.data.code === 0) {
                            Toast({
                                message: '确认收货成功!'
                            });
                            if (this.order.received_at === '' || this.order.received_at == null) {
                                this.$set(this.$data.order, 'received_at', (new Date()).getTime());
                            }
                            this.$set(this.order, 'ship_status', 4);
                        } else {
                            Toast({
                                message: response.data.message
                            });
                        }
                    })
                });
            },
            // 删除订单
            remove: function () {
                Dialog.confirm({ message: '您确定要删除订单吗?' }).then(action => {
                    Toast.loading({
                        message: '删除中...',
                        forbidClick: true
                    });
                    const itemId = this.$route.params['hashid'];
                    this.$http.delete(`/api/order/${itemId}`).then(response => {
                        Toast.clear()
                        if (response.data.code === 0) {
                            Toast({ message: '订单已删除！' });
                            this.$router.back();
                        } else {
                            Toast({
                                message: response.data.message
                            });
                        }
                    });
                });
            },
            // 金额详情显示和影藏
            moneyShow: function () {
                if (this.order.discount_details == null) {
                    /* eslint-disable-next-line camelcase */
                    this.order.discount_details = [];
                }
                if (Number(this.order.discount_details.coupon) > 0) {
                    this.coupon = true;
                }
                if (Number(this.order.discount_details.redpack) > 0) {
                    this.redpack = true;
                }
                if (Number(this.order.discount_details.score) > 0) {
                    this.score = true;
                }
            },
            // 联系客服
            contact: function () {
                // this.$set(this.$data, 'popupVisible', true);
            },
            // 倒计时
            counterStart: function () {

            },
            counterEnd: function () {
                this.$set(this.order, 'ship_status', 4);
                this.$http.put(`/api/order/${this.order.id}`)
            }
        }
    }
</script>
<style type="text/scss">
</style>
