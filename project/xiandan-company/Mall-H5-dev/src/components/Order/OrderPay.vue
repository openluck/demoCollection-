<template>
    <div>
        <div class="page" v-if="!loading">
            <div class="page__hd">
                <img src="/favicon.png"/>
            </div>
            <div class="page__bd">
                <div>
                    <label>订单总金额</label>
                    <span>&yen;{{order.order_amount | transformPrice}}</span>
                    <p/>
                </div>
                <div>
                    <p>
                        <label>所需运费</label>
                        <span>&yen;{{order.freight_amount | transformPrice}}</span>
                    </p>
                    <p>
                        <label>商品总价</label>
                        <span>&yen;{{order.commodity_amount | transformPrice}}</span>
                    </p>
                    <p>
                        <label>订单优惠</label>
                        <span>-&yen;{{order.discount | transformPrice}}</span>
                    </p>
                    <p>
                        <label>税费</label>
                        <span>&yen;{{order.total_tax | transformPrice}}</span>
                    </p>
                </div>
            </div>
            <div @click="onWeChatPay" class="btn-pay-wechat">
                <a href="javascript:">微信支付</a>
            </div>
            <div @click="onAlipay" class="btn-pay-alipay">
                <a href="javascript:">支付宝</a>
            </div>
            <p class="pay-node">支付宝支持成都消费券</p>

        </div>
        <div class="wait-scroll-loading" v-if="loading">
            <van-loading color="#09bb07" :size="25"/>
        </div>
        <van-dialog v-model="showPayCode"
                    title="扫码支付"
                    show-cancel-button
                    @confirm="checkPayResult"
                    confirm-button-text="已付款">
            <div class="qr-content" style="text-align: center; margin-top: 10px;margin-bottom: 10px">
                <img src="/images/icon/logo.png" style="width: 80px" alt="logo">
                <div>
                    <qrcode class="qrcode" :url="codeUrl" :wid="200" :hei="200"/>
                </div>
                <p>
                    <span v-if="codeType === 0">微信扫一扫</span>
                    <span v-else>支付宝扫一扫</span>
                    <br>
                    <van-button v-if="codeType === 1 && platform !== 'WECHAT' && false"
                                type="primary"
                                size="small"
                                plain hairline
                                style="margin: 10px"
                                round>保存到相册
                    </van-button>
                    <span v-else>立即支付</span>
                </p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import {Toast, Dialog, Popup, Loading, Button} from 'vant';
    import qrcode from 'vue_qrcodes'
    import {getPlatform} from '@/common/js/tools';

    Vue.use(Toast).use(Popup).use(Loading).use(Dialog).use(Button);
    const platform = getPlatform();
    let checkTimeOut = null;
    export default {
        data() {
            return {
                order: {},
                orderId: '',
                codeUrl: '',
                showPayCode: false,
                codeType: 1,
                platform,
                loading: true
            }
        },
        components: {
            qrcode
        },
        created() {
            this.orderId = this.$route.params['hashid'];
            this.fetchOrder();
            this.$http.get(`/api/order/${this.orderId}/check`).then(response => {
                if (response.data.code === 0 && response.data.message === '1') { // 支付成功
                    this.showPayCode = false;
                    this.$router.back();
                    Toast('已支付!');
                }
                if (response.data.code === 0 && response.data.message === '0') { // 支付中加入检测是否已支付
                    // 轮训检查账单是否支付
                   checkTimeOut =  setTimeout(this.checkPayResult, 3000);
                }
            })
        },
        beforeDestroy() {
            checkTimeOut && clearTimeout(checkTimeOut)
        },
        methods: {
            fetchOrder: function () {
                const itemId = this.$route.params['hashid'];
                this.$http.get(`/api/order/${itemId}`).then(response => {
                    if (response.data.code === 0) {
                        this.order = response.data.message;
                        this.loading = false;
                    } else {
                        Toast({
                            message: response.data.message
                        });
                    }
                });
            },
            onWeChatPay: function () {
                // 发起支付请求
                Toast.loading({message: '微信下单中……', forbidClick: true});
                this.$http.get(`/api/order/${this.orderId}/order`,
                    {
                        params: {platform: platform}
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
                                    this.$http.get(`/api/order/${this.orderId}/check`).then(response => {
                                        if (response.data.message === '1') { // 支付成功
                                            clearInterval(this.clock);
                                            this.showPayCode = false;
                                            Dialog.alert({message: '支付成功，等待服务器处理结果！'}).then(action => {
                                                this.$router.back();
                                            });
                                        } else {
                                            this.$router.back();
                                        }
                                    })
                                },
                                cancel: res => {
                                    Toast('微信支付失败！');
                                }
                            });
                        } else if (platform === 'MOBILE') {
                            location.href = response.data.message;
                        } else {
                            this.codeUrl = response.data.message;
                            this.codeType = 0;
                            this.showPayCode = true;
                            // 轮训检查账单是否支付
                            //setTimeout(this.checkPayResult, 3000);
                        }
                    } else {
                        Toast(response.data.message);
                    }
                });
            },
            onAlipay: function () {
                Toast.loading({message: '支付宝下单中……', forbidClick: true});
                this.$http.get(`/api/order/${this.orderId}/order`,
                    {
                        params: {platform: 'FTF'}
                    }).then(response => {
                    Toast.clear();
                    if (response.data.code === 0) {
                        if (platform === 'MOBILE') {
                            location.href = response.data.message;
                        } else {
                            this.codeUrl = response.data.message;
                            this.showPayCode = true;
                            this.codeType = 1;
                            // 轮训检查账单是否支付
                            // setTimeout(this.checkPayResult, 3000)
                        }
                    } else {
                        Toast(response.data.message);
                    }
                });
            },
            checkPayResult: function () {
                this.$http.get(`/api/order/${this.orderId}/check`)
                    .then(response => {
                        if (response.data.code !== 0) {
                            Toast(response.data.message);
                        } else if (response.data.message === '0') { //支付中
                            checkTimeOut && clearTimeout(checkTimeOut)
                            checkTimeOut = setTimeout(this.checkPayResult, 1000);
                        } else if (response.data.message === '1') { // 支付成功
                            Dialog.alert({message: '支付成功，等待服务器处理结果！'}).then(() => {
                                Toast.loading({message: '正在跳转……', forbidClick: true});
                                checkTimeOut && clearTimeout(checkTimeOut)
                                checkTimeOut =  setTimeout(() => {
                                    this.$router.replace({name: 'order-detail', params: {id: this.orderId}});
                                    Toast.clear()
                                }, 3000)
                            });
                        }
                    })
            }
        }
    }
</script>

<style type="text/scss">
    .page {
        .page__hd {
            margin: 30px auto;
            width: 100px;
            height: 100px;

            img {
                width: 100px;
                height: 100px;
            }
        }

        .page__bd {
            width: calc(100% - 32px);
            margin: auto;
            padding: 16px;
            box-sizing: border-box;
            background: white;
            border-radius: 16px;

            div:first-of-type {
                label {
                    font-size: 14px;
                }

                span {
                    color: #F10D0D;
                    font-size: 17px;
                    float: right;
                }

                p {
                    background: #F0F3F5;
                    width: 100%;
                    height: 1px;
                    margin-top: 10px;
                }
            }

            div:nth-of-type(2) {
                P {
                    margin-top: 12px;
                    font-size: 12px;
                    color: #636566;

                    span {
                        float: right;
                    }
                }
            }
        }

        .btn-pay-wechat {
            width: calc(100% - 32px);
            height: 50px;
            background: white;
            text-align: center;
            line-height: 50px;
            font-weight: bold;
            margin: 30px auto auto;
            border-radius: 8px;

            a {
                color: #09BB07;
                text-decoration: none;
                letter-spacing: 1px;
            }
        }

        .btn-pay-alipay {
            width: calc(100% - 32px);
            height: 50px;
            background: white;
            text-align: center;
            line-height: 50px;
            font-weight: bold;
            margin: 10px auto auto;
            border-radius: 8px;

            a {
                color: #108ee9;
                text-decoration: none;
                letter-spacing: 1px;
            }
        }

        .pay-node {
            font-size: 10px;
            color: red;
            width: 100%;
            margin-top: 5px;
            text-align: center;
        }

        .qr-content {
            margin-top: 30px;

            p {
                line-height: 20px;
                font-size: 16px;
                margin-top: 16px;
                text-align: center;
                margin-bottom: 30px;
            }

            .logo {
                width: 100px;
            }

            & > div:nth-of-type(2) {
                border: 1px solid #EAEEF1;
                padding: 12px;
                display: inline-block;
            }
        }
    }
</style>

























