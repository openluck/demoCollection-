<template>
    <div class="invite-friends">
        <div class="imageWrapper" style="overflow: hidden" ref="imageWrapper">
            <img class="real_pic" ref="img"
                 style="width: 100%;position: absolute; top: 0px; z-index: 999;pointer-events: auto;" :src="dataURL"
                 v-if="!rank"/>
            <slot v-if="rank">
                <img src="/images/icon/poster.jpg" alt="" class="poster">
                <div class="code-center">
                    <div class="invite-friends-content">
                        <div class="top">
                            <div class="top-img">
                                <img :src="user.avatar" alt="head">
                            </div>
                            <div class="top-title">
                                <p>{{user.nickname}}</p>
                                <p>邀请你加入闲蛋商城</p>
                            </div>
                        </div>
                        <div class="invite-title">
                            <div class="border">
                                <div></div><!--
                                -->
                                <div></div>
                            </div>
                            <div class="border">
                                <div></div><!--
                                -->
                                <div></div>
                            </div>
                            <div class="title">有钱，有闲，有生活</div>
                        </div>
                        <div class="invite-content">
                            <p><span/><span>主营护肤品、日用品、保健品、母婴产品原产地直采，保税仓直发，杜绝假货。</span></p>
                            <p><span/><span>注册闲蛋商城 <label>新人注册闲蛋商城即可获得丰富的新人大礼包。</label></span></p>
                        </div>
                        <div class="dividing"></div>
                        <div class="invite-code">
                            <div class="qrcode-img">
                                <qrcode :url="value"
                                        iconurl="/images/icon/logoCode.png"
                                        :wid="160"
                                        :hei="160"
                                        :imgwid="30"
                                        imghei="30"/>
                            </div>
                            <div>
                                <p>长按识别二维码</p>
                            </div>
                        </div>
                    </div>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import { Toast } from 'vant';
    import html2canvas from 'html2canvas';
    import qrcode from 'vue_qrcodes'

    Vue.use(Toast);

    export default {
        name: 'MyCode',
        data() {
            return {
                height: window.innerHeight,
                value: `${this.$http.defaults.baseURL}/public/register/wechat?inviter=${this.$store.state.user.uid}`,
                logo: '/images/icon/logoCode.png',
                dataURL: '',
                rank: true
            }
        },
        components: {
            qrcode
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        created() {
            this.toImage();
            window.scrollTo(0, 0);
        },
        methods: {
            toImage() {
                Toast.loading({
                    message: '海报生成中...',
                    forbidClick: true
                });
                setTimeout(() => {
                    html2canvas(this.$refs.imageWrapper, {
                        backgroundColor: null,
                        useCORS: true,
                        // logging: true,
                        removeContainer: true
                    }).then((canvas) => {
                        Toast.clear()
                        this.dataURL = canvas.toDataURL('image/png');
                        this.rank = false
                    });
                }, 1000)
            }
        }
    }
</script>

<style type="text/scss">
    .invite-friends {
        width: 100%;
        position: relative;

        .poster {
            width: 100%;
        }

        .code-center {
            width: 100%;

            .invite-friends-content {
                width: calc(100% - 32px);
                margin: auto;
                background: white;
                border-radius: 16px;
                padding: 16px;
                box-sizing: border-box;
                border: 1px solid #8AB773;
                position: absolute;
                top: 12%;
                left: 16px;

                .top {
                    box-sizing: border-box;
                    display: flex;

                    .top-img {
                        width: 40px;
                        height: 40px;

                        img {
                            width: 100%;
                            border-radius: 50%;
                        }
                    }

                    .top-title {
                        margin-left: 10px;

                        p:nth-of-type(1) {
                            font-size: 14px;
                        }

                        p:nth-of-type(2) {
                            font-size: 12px;
                            color: #666666;
                            margin-top: 10px;
                        }
                    }
                }

                .invite-title {
                    margin-top: 13%;
                    position: relative;

                    .border {
                        div {
                            background: #8ABC73;
                        }

                        div:nth-of-type(1) {
                            width: 33px;
                            height: 5px;
                        }

                        div:nth-of-type(2) {
                            width: 5px;
                            height: 11px;
                        }
                    }

                    .border:nth-of-type(1) {
                        div:nth-of-type(2) {
                            position: relative;
                            top: -1px;
                        }
                    }

                    .border:nth-of-type(2) {
                        bottom: -15px;
                        right: 0px;
                        position: absolute;

                        div:nth-of-type(1) {
                            position: relative;
                            top: 15px;
                        }

                        div:nth-of-type(2) {
                            position: relative;
                            left: 28px;
                            top: 1px;
                        }
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

                            label {
                                display: block;
                            }
                        }
                    }

                    p:nth-of-type(2) {
                        margin-top: 5%;
                    }
                }

                .dividing {
                    height: 10px;
                    width: 100%;
                    background: url("/images/icon/posterBorder.png") repeat-x center center;
                    margin-top: 7%;
                }

                .invite-code {
                    margin: auto;
                    margin-top: 11%;
                    text-align: center;

                    .qrcode-img {
                        padding: 14px;
                        border: 1px solid #EAEEF1;
                        margin: auto;
                        display: inline-block;
                    }

                    div:nth-of-type(2) {
                        color: #313233;
                        margin-top: 5%;

                        div {
                            display: flex;

                            p {
                                display: inline-block;
                                font-size: 12px;
                                color: #484A4A;
                                padding: 0 8px;
                                line-height: 20px;
                                box-sizing: border-box;
                                border: 1px solid #484A4A;
                                border-radius: 10px;
                            }

                            p:nth-of-type(2) {
                                margin-left: 8px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
