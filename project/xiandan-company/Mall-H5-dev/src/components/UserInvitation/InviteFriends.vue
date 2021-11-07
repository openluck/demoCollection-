<template>
    <div class="invite-friends" ref="div">
        <div class="invite-friends-top">
            <img src="/images/icon/InviteFriendsTop.png" alt="">
        </div>
        <div class="invite-friends-center">
            <div class="invite-friends-content">
                <div class="invite-title">
                    <div class="border"></div>
                    <div class="border"></div>
                    <div class="title" @click="mask">有钱，有闲，有生活</div>
                </div>
                <div class="invite-content">
                    <p><span/><span>主营护肤品、日用品、保健品、母婴产品原产地直采，保税仓直发，杜绝假货。</span></p>
                    <p><span/><span>邀请好友 <br>邀请好友注册闲蛋商城，获得5元无门槛优惠券</span></p>
                </div>
                <div class="dividing"></div>
                <div class="invite-code">
                    <div class="qrcode-img">
                        <qrcode :url="value" iconurl="/images/icon/logoCode.png"
                                :wid="160"
                                :hei="160"
                                :imgwid="30"
                                :imghei="30"/>
                    </div>
                </div>
                <div class="invite-button">
                    <router-link tag="p" :to="{name:'national'}" v-if="code === 2">查看中奖</router-link>
                    <router-link tag="p" :to="{name:'qrCode'}">生成海报</router-link>
                </div>
            </div>
        </div>
        <div class="invite-mask" @click="mask" v-if="black" @touchmove.prevent>
        </div>
        <div class="guide-arrow" v-if="black">
            <van-icon class-prefix="iconfont" name="zu5"/>
            <p>点击右上角分享</p>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { Icon } from 'vant'
    import qrcode from 'vue_qrcodes'

    Vue.use(Icon)

    export default {
        name: 'InviteFriends',
        data() {
            return {
                value: `${this.$http.defaults.baseURL}/public/register/wechat?inviter=${this.$store.state.user.uid}`,
                logo: '/images/icon/logoCode.png',
                height: window.innerHeight,
                black: true,
                pageHeight: 0
            }
        },
        props: ['code'],
        components: {
            qrcode
        },
        mounted() {
            setTimeout(() => {
                this.pageHeight = document.body.clientHeight;
                if (this.height > this.pageHeight) {
                    this.$refs.div.style.height = this.height + 'px'
                }
            }, 200)
        },
        methods: {
            mask() {
                this.black = false
            }
        }
    }
</script>

<style type="text/scss">
    .invite-friends {
        width: 100%;
        background: url("/images/icon/InviteFriendsCenter.png") no-repeat center center;

        .invite-friends-top {
            width: 100%;
            display: grid;
            background: #F2F5F7;

            img {
                width: 100%;
            }
        }

        .invite-friends-center {
            width: 100%;
            padding-bottom: 18%;

            .invite-friends-content {
                width: calc(100% - 32px);
                margin: auto;
                background: white;
                border-radius: 16px;
                position: relative;
                top: -38px;
                padding-bottom: 50px;
                padding: 16px;
                box-sizing: border-box;

                .invite-title {
                    margin-top: 10%;
                    position: relative;

                    .border {
                        width: 32px;
                        height: 15px;
                        box-sizing: border-box;
                        position: absolute;
                    }

                    .border:nth-of-type(1) {
                        border-top: 5px solid #FE6570;
                        border-left: 5px solid #FE6570;
                        top: -12px;
                    }

                    .border:nth-of-type(2) {
                        border-bottom: 5px solid #FE6570;
                        border-right: 5px solid #FE6570;
                        bottom: -15px;
                        right: 0px;
                    }

                    .title {
                        font-size: 26px;
                        font-weight: bold;
                        color: #413E3E;
                        text-align: center;
                    }
                }

                .invite-content {
                    margin-top: 13%;

                    p {
                        position: relative;

                        span:nth-of-type(1) {
                            width: 8px;
                            height: 8px;
                            background: #FE6570;
                            border-radius: 8px;
                            display: inline-block;
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        span:nth-of-type(2) {
                            font-size: 14px;
                            color: #313233;
                            margin-left: 22px;
                            display: inline-block;
                            line-height: 20px;
                        }
                    }

                    p:nth-of-type(2) {
                        margin-top: 6%;
                    }
                }

                .dividing {
                    height: 16px;
                    width: 100%;
                    background-image: radial-gradient(#CCA9AB 25%, #fff 0);
                    background-size: 20px 20px;
                    background-position: 0 0;
                    background-repeat: repeat-X;
                    margin-top: 7%;
                }

                .invite-code {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: auto;
                    margin-top: 11%;

                    .qrcode-img {
                        padding: 10px;
                        border: 1px solid #EAEEF1;
                    }

                    div:nth-of-type(2) {
                        margin-left: 10px;
                        color: #313233;
                        width: calc(100% - 194px);
                        text-align: center;

                        div {
                            p {
                                display: inline-block;
                                font-size: 13px;
                                color: #484A4A;
                                padding: 0 8px;
                                line-height: 20px;
                                box-sizing: border-box;
                                border: 1px solid #484A4A;
                                border-radius: 10px;
                            }

                            p:nth-of-type(2) {
                                margin-top: 8px;
                            }
                        }
                    }
                }

                .invite-button {
                    display: flex;
                    justify-content: center;

                    p {
                        width: 50%;
                        height: 50px;
                        text-align: center;
                        line-height: 45px;
                        margin-top: 5%;
                        color: white;
                        font-weight: 600;
                    }

                    p:nth-of-type(1) {
                        background: url("/images/icon/buttonPoster.png") no-repeat center center;
                        background-size: 100%;
                    }

                    p:nth-of-type(2) {
                        background: url("/images/icon/buttonActivity.png") no-repeat center center;
                        background-size: 100%;
                        margin-left: 10px;
                    }
                }
            }
        }

        .invite-mask {
            width: 100%;
            height: 100%;
            background: black;
            opacity: 0.5;
            overflow: hidden;
            position: absolute;
            top: 0px;
            left: 0px;
        }

        .guide-arrow {
            position: absolute;
            z-index: 2;
            top: 99px;
            width: calc(100% - 108px);
            height: 40px;
            line-height: 40px;
            border: 2px solid white;
            color: white;
            text-align: center;
            border-radius: 4px;
            left: 50%;
            transform: translateX(-50%);

            .iconfont {
                font-size: 99px;
                position: absolute;
                top: -99px;
                right: -15%;
            }
        }
    }
</style>
