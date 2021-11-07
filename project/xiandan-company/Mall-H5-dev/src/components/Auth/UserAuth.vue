<template>
    <div class="user-auth-container">
        <div class="wait-scroll-loading" v-if="isLoading">
            <van-loading color="#09bb07" :size="25"/>
        </div>
        <div class="panel" v-show="user.is_auth !== 2">
            <div class="auth-img">
                <div class="auth-mask"></div>
                <div class="auth-title">
                    <p>领取实名新人大礼包</p>
                    <p>仅限首次在闲蛋商城完成实名认证的用户</p>
                </div>
            </div>
            <div class="auth-warning">
                <van-icon class-prefix="iconfont" name="gantanhao1"/>
                <span>
                    请填写您的真实信息，通过实名认证的信息不能修改!
                </span>
            </div>
            <div class="panel-top">
                <van-field label="真实姓名：" placeholder="请输入身份证姓名" type="text" v-model="name"/>
                <van-field label="身份证号：" placeholder="请输入身份证号码" type="text" v-model="idcard" clearable/>
                <van-button type="primary" size="large" @click="submit">提交</van-button>
            </div>

            <div class="auth-equity" v-show="authEquity">
                <div class="auth-equity-title">实名认证优势</div>
                <div>
                    <p>
                        <van-icon class-prefix="iconfont" name="anquan1"/>
                        <span>保障账户安全</span>
                    </p>
                    <p>
                        <van-icon class-prefix="iconfont" name="daizi1"/>
                        <span>专属优惠</span>
                    </p>
                    <p>
                        <van-icon class-prefix="iconfont" name="yinhangqiazhifuzhangdanfukuanjinqianchucunqia"/>
                        <span>支付更便捷</span>
                    </p>
                </div>
            </div>
            <van-popup v-model="warning" class="warning-popup" closeable>
                <div class="auth-tips">
                    <p><span/><label>温馨提示</label><span/></p>
                    <p>1.根据中国海关要求，从自贸区保税仓购买的保税商品需要消费者提供真实、有效的收货人身份证信息进行个人物品入境申报，是正常流程，请您放心。</p>
                    <p>
                        2.我们需要您支付一分钱的实名认证押金来与您支付的实名信息做对比，请输入和你支付方式一样的身份信息并确保您的支付方式已通过实名认证;您的押金会在接收到实名认证结果之后退还到您支付的账户里。</p>
                    <p class="button" @click="warning = false"><span>我已了解</span></p>
                </div>
            </van-popup>
        </div>
        <div class="identity-card" v-show="user.is_auth === 2 && !isLoading">
            <p>姓名：{{name}}</p>
            <p>证件类型：身份证</p>
            <p>身份证号：{{idcard}}</p>
            <van-icon class-prefix="iconfont" name="zhongfuwangge"/>
        </div>
        <van-popup v-model="codePay">
            <div class="img" style="text-align: center">
                <qrcode :url="codeUrl" :wid="200" :hei="200"/>
                <p style="color: #0f9d58">微信扫一扫，立即支付</p>
            </div>
        </van-popup>

    </div>
</template>

<script>
    'use strict';
    import '@/sass/UserAuth.scss';
    import Vue from 'vue';
    import { Toast, Field, Button, Popup, Loading } from 'vant';
    import { getPlatform } from '@/common/js/tools';
    import qrcode from 'vue_qrcodes'
    import Icon from '@/components/_layouts/Icon.vue'

    Vue.use(Toast).use(Field).use(Popup).use(Popup).use(Loading).use(Button);

    export default {
        name: 'UserAuth',
        data() {
            return {
                name: '',
                idcard: '',
                codeUrl: '',
                codePay: false,
                timer: null,
                warning: true,
                screenHeight: document.documentElement.clientHeight,
                fullHeight: 0,
                authEquity: true,
                isLoading: true
            }
        },
        components: {
            qrcode,
            Icon
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        created: function () {
            this.$http.get('/api/user/auth').then(response => {
                this.$store.commit('updateUserAuth', response.data.message.is_auth);
                this.$set(this.$data, 'name', response.data.message.name);
                this.$set(this.$data, 'idcard', response.data.message.idcard);
                this.isLoading = false;
            });
        },
        beforeDestroy: function () {
            if (this.timer != null) {
                clearTimeout(this.timer)
            }
        },
        watch: {
            'fullHeight': function (newVal) {
                if (this.fullHeight < this.screenHeight) {
                    this.authEquity = false;
                } else {
                    this.authEquity = true
                }
            }
        },
        methods: {
            submit: function () {
                if (!(/^[\u4e00-\u9fa5]{2,4}$/.test(this.name))) {
                    Toast({ message: '姓名未填写或填写错误' });
                    return;
                }

                if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/.test(this.idcard))) {
                    Toast({ message: '身份证未填写或填写错误' });
                    return;
                }

                Toast.loading({ message: '提交中...', forbidClick: true })

                const platform = getPlatform();
                this.$http.post('/api/user/auth', {
                    name: this.name,
                    idcard: this.idcard,
                    platform: platform
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
                                success: () => {
                                    Toast.loading({ message: '请不要关闭当前窗口,正在等待验证结果……', forbidClick: true })
                                    this.timer = setTimeout(() => {
                                        this.checkResult();
                                    }, 1000);
                                },
                                cancel: res => {
                                    Toast({ message: '微信支付失败！' });
                                }
                            });
                        } else if (platform === 'MOBILE') {
                            window.location.href = response.data.message;
                            this.timer = setTimeout(() => {
                                this.checkResult();
                            }, 1000);
                        } else {
                            this.codeUrl = response.data.message;
                            this.codePay = true;
                            this.timer = setTimeout(() => {
                                this.checkResult();
                            }, 1000);
                        }
                    } else {
                        Toast({
                            message: response.data.message
                        });
                    }
                })
            },
            checkResult: function () {
                this.$http.get('/api/user/auth').then(response => {
                    if (response.data.code === 0) {
                        if (response.data.message.is_auth === 0) {
                            this.timer = setTimeout(() => {
                                this.checkResult();
                            }, 1000);
                        } else if (response.data.message.is_auth === 1) {
                            Toast.fail('实名验证失败！请提交正确的信息');
                            this.codePay = false;
                            this.$router.back();
                        } else if (response.data.message.is_auth === 2) {
                            this.codePay = false;
                            Toast.success('您已通过实名验证！')
                            this.$store.commit('updateUserAuth', 2);
                            this.name = response.data.message.name;
                            this.idcard = response.data.message.idcard;
                            this.$http.get('/api/userinfo', { params: { t: new Date().getTime() } }).then(response => {
                                this.$store.commit('initUser', response.data.data);
                            })
                        }
                    } else {
                        Toast.fail(response.data.message);
                    }
                })
            }
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight;
                    this.fullHeight = window.fullHeight;
                })()
            }
        }
    }
</script>

<style >

</style>
