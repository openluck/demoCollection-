<template>
    <div class="login-container">
        <div class="login">
            <div class="img"/>
            <div class="logo"/>
            <div class="field">
                <p>手机号</p>
                <input type="tel" name="number" placeholder="请输入手机号" v-model.trim="phone" maxlength="11">
            </div>
            <div class="field">
                <p>验证码</p>
                <input type="tel" name="number" @blur="inpBlur" placeholder="请输入验证码" v-model.trim="code"
                       :disabled="logining" :maxlength="6">
                <span class="verification " :disabled="verifyButtonDisabled" @click="getVerifyCode"
                      :class="{landing:verifyButtonDisabled}"> {{verifyButtonText}}</span>
            </div>
            <div class="agreement">注册/登录即代表您已同意并接受
                <a href="https://mp.weixin.qq.com/s/Y-RWA6X3SXT7VOCS9OEqIw">《闲蛋商城服务协议》</a>及<a
                        href="https://mp.weixin.qq.com/s/Eo2n2Lbr28qGbW-vovprNA">《闲蛋商城隐私政策》</a></div>
            <div class="land" @click="login">
                登录
            </div>
            <p class="later" @click="$router.replace({ name: 'home' })">稍后登录</p>
        </div>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import {Toast} from 'vant';

    Vue.use(Toast);

    export default {
        name: 'Login',
        data() {
            return {
                phone: '',
                code: '',
                inviter: '',
                clock: null,
                logining: false,
                verifyButtonText: '获取验证码',
                verifyButtonDisabled: false
            };
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.fromRoute = from;
            })
        },
        created: function () {
            if (this.$store.getters.isLogin) {
                Toast('已登录！');
                this.$router.replace('Index');
                return;
            }
            if (this.$route.query['inviter']) {
                this.inviter = this.$route.query['inviter']
            }
        },
        beforeDestroy: function () {
            if (this.clock != null) {
                clearInterval(this.clock);
            }
        },
        methods: {
            getVerifyCode: function () {
                if (this.phone.length === 0) {
                    Toast('请输入手机号');
                    return;
                }

                if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone))) {
                    Toast('您输入的手机格式错误');
                    return;
                }

                this.verifyButtonDisabled = true;
                this.verifyButtonText = '获取中...';
                this.$http.get('/api/public/verify/code', {
                    params: {
                        'phone': this.phone,
                        'type': 0
                    }
                }).then((response) => {
                    if (response.data.code === 0) {
                        let timeCount = 0;
                        this.clock = window.setInterval(() => {
                            timeCount++;
                            if (timeCount > 59) {
                                clearInterval(this.clock);
                                this.verifyButtonText = '获取验证码';
                                this.verifyButtonDisabled = false;
                                return
                            }

                            this.verifyButtonText = `重新发送(${60 - timeCount})`;
                        }, 1000)
                    } else {
                        this.verifyButtonDisabled = false;
                        this.verifyButtonText = '获取验证码';
                        Toast(response.data.message)
                    }
                })
            },

            login: function () {
                if (this.logining) {
                    return;
                }

                if (this.phone.length === 0) {
                    Toast('请输入手机号');
                    return;
                }

                if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone))) {
                    Toast('您输入的手机格式错误');
                    return;
                }

                if (this.code.length === 0) {
                    Toast('请输入验证码');
                    return;
                }

                if (!(/^\d{6}$/.test(this.code))) {
                    Toast('验证码格式错误');
                    return;
                }

                Toast.loading({message: '登录中...', forbidClick: true});
                this.logining = true;
                let params = {
                    'phone': this.phone,
                    'code': this.code
                }
                if (this.inviter) {
                    params['inviter'] = this.inviter;
                }
                this.$http.get('/api/register/login', {params: params}).then((response) => {
                    if (response.data.code === 0) {
                        this.$store.commit('initUser', response.data.message);
                        this.handleBack();
                    } else {
                        this.logining = false;
                        Toast(response.data.message)
                    }
                }).finally(() => {
                    Toast.clear()
                })
            },
            /**
             * Handle Back
             * @desc Extends default router back functionality
             * @param {string} fallback - The fallback path if there is no history to use with $router.back(). This is usually the case if the page was visited directly or from another site
             **/
            handleBack() {
                if (this.$route.query.redirect) {
                    window.location.href = this.$route.query.redirect;
                } else if (!this.fromRoute.name) {
                    this.$router.replace({name: 'home'});
                } else {
                    this.$router.back();
                }
            },
            inpBlur() {
                window.scrollTo(0, 0)
            }
        }

    }
    ;
</script>

<style type="text/scss">
    .login {
        width: 100%;
        padding: 30px 16px;
        margin: auto;
        box-sizing: border-box;
        background: white;
        border-radius: 16px;

        .img {
            width: 99px;
            height: 99px;
            margin: auto;
            background: url("/favicon.png") no-repeat center center;
            background-size: cover;
        }

        .logo {
            width: 48px;
            height: 33px;
            margin: auto;
            background: url("/images/icon/logo.png") no-repeat center center;
            background-size: cover;
            margin-top: 16px;
        }

        .field {
            width: 100%;
            margin-top: 30px;
            padding-bottom: 10px;
            border-bottom: solid 1px #dee0e3;
            position: relative;

            p {
                font-size: 14px;
                color: #BAC3C7;
            }

            input {
                padding-top: 18px;
                height: 20px;
                width: 100%;
                border: none;
                font-size: 16px;
            }

            input::-webkit-input-placeholder {
                color: #BAC3C7;
            }

            input:-webkit-autofill {
                box-shadow: 0 0 0px 1000px white inset !important;
            }

            .verification {
                width: 100px;
                height: 30px;
                border-radius: 15px;
                display: inline-block;
                font-size: 16px;
                text-align: center;
                line-height: 30px;
                position: absolute;
                right: 0;
                top: 28px;
                color: #4395FF;
            }

            .landing {
                border: 1px solid #ABB0B2;
                color: #BAC3C7;
            }
        }

        .land {
            width: 250px;
            height: 44px;
            text-align: center;
            line-height: 44px;
            background: #F10D0D;
            border-radius: 22px;
            color: white;
            font-weight: bold;
            font-size: 16px;
            margin: 40px auto auto;
            box-shadow: 0px 6px 21px 0px rgba(237, 37, 37, 0.24);
        }
    }

    .later {
        text-align: center;
        font-size: 14px;
        margin-top: 10px;
        color: #666666;

    }

    .agreement {
        margin-top: 10px;
        font-size: 9px;
        line-height: 15px;
        color: black;
        font-weight: bold;

        a {
            color: red;
            text-decoration: none;
        }
    }

    .login-container {
        width: calc(100% - 32px);
        margin: 16px;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
