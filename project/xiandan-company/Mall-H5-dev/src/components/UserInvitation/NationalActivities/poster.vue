<template>
    <div>
        <div style="position: absolute;left: 0;top: 0;width: 100%;background: rgba(100,100,100,0.5);z-index: 1000"
             :style="{height:this.clientHeight}" v-show="share"
             @click="()=>{this.share = false}">
            <img src="/images/img/share.png" style="margin-left: 100%;transform: translateX(-100%)"/>
            <div
                style="width: 80%;height: 50px;color: #fff;border: 1px solid #fff;border-radius: 10px;text-align: center;line-height: 50px;margin: auto">
                <span>点击右上角分享</span>
            </div>
        </div>
        <div ref="imageWrapper" class="body" :style="{minHeight:this.clientHeight}">
            <img class="real_pic" ref="img"
                 style="width: 100%;position: absolute; top: 0px; z-index: 999;pointer-events: auto;" :src="dataURL"
                 v-show="showSharePicture"/>
            <div v-show="!showSharePicture" class="poster">
                <div class="title">
                    <img src="/images/img/bar.png"/>
                    <p> 邀请好友免费获得好礼 </p>
                    <img src="/images/img/bar.png"/>
                </div>
                <img :src="user.avatar == '' ?'/images/img/user_head.png':user.avatar" class="head-portrait"/>
                <div class="poster-body">
                    <p class='user-name'>{{user.nickname}}</p>
                    <p class="tag-line">"<span>老铁,我和SK小灯泡之间只差一个你了!</span>"</p>
                    <div style="position: relative">
                        <img src="/images/img/border.png" alt=""
                             style="width:160px;height: 160px;position: absolute;left: 50%;top: 50%;transform: translateY(-79px);margin-left: -80px"/>
                        <qrcode :url="value" :iconurl="logo" wid="140" hei="140" imgwid="30"
                                imghei="30" class="qr-code"></qrcode>
                    </div>
                    <p class="qr-hint">请长按识别二维码</p>
                    <div class="text-flex">
                        <p class="text-decoration"></p>
                        <p class="text">活动奖品</p>
                        <p class="text-decoration"></p>
                    </div>
                    <img src="/images/img/crown.png" class="crown"/>
                    <p class="highest">{{higherPrize.name}}</p>
                    <div class="prize-flex">
                        <div class="prize-item" v-for="(item,index) of prizeList"><span
                            class="serial-num">{{index+2}}</span><span class="serial-text">{{item.name}}</span></div>
                    </div>
                </div>
                <div class="wait-scroll-loading" v-if="wait">
                    <van-loading color="#09bb07" :size="25"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    'use strict';
    import Vue from 'vue';
    import { Loading, Toast } from 'vant';
    import html2canvas from 'html2canvas';
    import qrcode from 'vue_qrcodes';

    Vue.use(Loading).use(Toast);

    export default {
        name: 'poster',
        data() {
            return {
                value: `${this.$http.defaults.baseURL}/public/register/wechat?inviter=${this.$store.state.user.uid}`,
                wait: true,
                prizeList: [],
                higherPrize: {},
                user: this.$store.state.user,
                dataURL: '',
                logo: '/images/icon/logoCode.png',
                clientHeight: '1000px',
                showSharePicture: false,
                share: true
            }
        },
        components: {
            qrcode
        },
        created() {
            this.getUserData();
            this.toImage();
            window.scrollTo(0, 0);
            this.clientHeight = `${document.documentElement.clientHeight}px`
        },

        methods: {
            getUserData() {
                this.$http.get('/api/events/invite').then(res => {
                    // console.log(res.data.message.invitation);
                    // if (res.data.code == 2 || res.data.code == 0) {
                    //     this.$router.push({ path: 'mallInvitation' });
                    // } else {
                    let prizeList = res.data.message.invitation.rewards;
                    console.log(prizeList);
                    this.higherPrize = prizeList.pop();
                    this.prizeList = prizeList;
                    // }
                    this.wait = false;
                }).catch(err => {
                    // vConsole.log(err)
                    console.log(err);
                })
            },
            toImage() {
                Toast.loading({ message: '正在生成您的专属海报...', forbidClick: true });
                setTimeout(() => {
                    html2canvas(this.$refs.imageWrapper, {
                        backgroundColor: null,
                        useCORS: true,
                        // logging: true,
                        removeContainer: true
                    }).then((canvas) => {
                        Toast.clear();
                        this.dataURL = canvas.toDataURL('image/png');
                        this.showSharePicture = true
                    });
                }, 1000)
            }
        }
    }
</script>

<style  type="text/scss">
    .body {
        overflow: hidden;
        zoom: 1;
        background: #F13232 url("/images/img/national_bg.png") no-repeat center top;

        .poster {
            position: relative;
            margin-top: 50px;

            .title {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                margin: 0;
                text-align: center;
                font-size: 26px;
                font-weight: bolder;
                padding: 10px 0 60px;

                img {
                    width: 20px;
                    height: 2px;
                    margin: 0 8px;
                }
            }

            .head-portrait {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                border: 1px solid #fff;
                background: #fff;
                position: absolute;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
            }

            .poster-body {
                text-align: center;
                width: 342px;
                height: 490px;
                background: #fff;
                margin: auto;
                border-radius: 20px;

                .user-name {
                    font-size: 13px;
                    text-align: center;
                    padding: 40px 0 16px;
                }

                .tag-line {
                    color: #999;
                    font-size: 16px;
                    text-align: center;
                    font-weight: bolder;

                    span {
                        color: #F13232;
                        padding: 0 10px;
                    }
                }

                .qr-code {
                    margin: 20px auto 14px;
                }

                .qr-hint {
                    text-align: center;
                    font-size: 13px;
                    color: #333;
                    margin-bottom: 10px;
                }

                .text-flex {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .text-decoration {
                        width: 50px;
                        height: 1px;
                        background: #F13232;
                    }

                    .text {
                        color: #F13232;
                        border: 1px solid #F13232;
                        border-radius: 10px;
                        font-size: 13px;
                        width: 88px;
                        height: 22px;
                        text-align: center;
                        line-height: 22px;
                        margin: 12px;
                    }
                }

                .crown {
                    width: 27px;
                    height: 22px;
                }

                .highest {
                    color: #F13232;
                    font-weight: bolder;
                    line-height: 30px;
                    padding-bottom: 10px;
                }

                .prize-flex {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: left;

                    .prize-item {
                        width: 50%;
                        height: 40px;
                        font-size: 11px;
                        display: flex;
                        justify-content: left;
                        align-items: flex-start;

                        .serial-num {
                            display: inline-block;
                            color: #fff;
                            width: 9%;
                            height: 16px;
                            background: #FF6B5D;
                            border-radius: 50%;
                            margin: 0 6px;
                            line-height: 16px;
                        }

                        .serial-text {
                            width: 80%;
                            text-align: left;
                        }
                    }
                }
            }
        }
    }
</style>
