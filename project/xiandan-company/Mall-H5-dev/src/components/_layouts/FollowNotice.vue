<template>
    <div v-if="!subscribed &&$route.name !== 'login'">
        <transition name="code">
            <van-popup v-model="switchEnable" style="background: transparent; overflow-y: visible ">
                <div class="follow-notice-panel">
                    <img class="icon" src="/favicon.png">
                    <p class="title">关注闲蛋商城送好礼</p>
                    <img src="/images/img/qrcode.png" class="code" alt="长按关注微信公众号" style="pointer-events:auto">
                    <p class="note">{{note}}</p>
                    <van-icon name="cross" class="close" @click="shadow"/>
                </div>
            </van-popup>
        </transition>
        <transition name="icon">
            <div class="follow-notice-float-button"
                 :class="{adsorbent:xPum<0 || xPum>screenWidth,animation:animation,right:right}" id="moveDiv"
                 @click="codeShow" v-show="!switchEnable" @touchstart="touchBegin" @touchend="clearTimes"
                 @touchmove.prevent="touchMove" ref="moveDiv">
                <img src="/favicon.png">
                <transition name="title">
                    <p v-show="title" :class="{right:right}">请关注闲蛋<br>公众号</p>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Popup, Icon } from 'vant';
    import { isWechat, fixed } from '../../common/js/tools';

    Vue.use(Popup).use(Icon);

    export default {
        name: 'FollowNote',
        data: () => {
            return {
                switchEnable: false,
                subscribed: true,
                timer: null,
                flags: false,
                position: { x: 0, y: 0 },
                screenWidth: window.outerWidth - 104,
                screenHeight: window.innerHeight - 90,
                dx: '',
                dy: '',
                xPum: '',
                yPum: '',
                animation: false,
                title: true,
                time: null,
                right: false
            }
        },
        computed: {
            note: () => {
                if (isWechat()) {
                    return '长按二维码关注"闲蛋电商"'
                }

                return '扫描二维码或搜索"闲蛋电商"';
            }
        },
        watch: {
            switchEnable: function (value) {
                fixed(value);
                if (value) {
                    this.checkSubscribed();
                } else {
                    clearTimeout(this.timer);
                }
            },
            '$store.getters.isLogin': function (value) {
                if (value) {
                    this.$http.get('/api/public/mall/is_subscribed').then(response => {
                        if (response.data.code === 0) {
                            this.subscribed = response.data.message;
                            if (!this.subscribed) {
                                this.switchEnable = true; // 强制弹出界面
                            }
                        }
                    });
                }
            },
            'xPum': function (val) {
                if (val < 0 || val > this.screenWidth + 55) {
                    this.title = true;
                    clearTimeout(this.time)
                    this.time = setTimeout(() => {
                        this.title = false
                    }, 2000)
                }
                if (val > this.screenWidth + 55) {
                    this.right = true
                } else {
                    this.right = false
                }
            }
        },
        created: function () {
            this.$http.get('/api/public/mall/is_subscribed').then(response => {
                if (response.data.code === 0) {
                    this.subscribed = response.data.message;
                }
            });
        },
        methods: {
            checkSubscribed: function () {
                this.$http.get('/api/public/mall/is_subscribed').then(response => {
                    if (response.data.code === 0) {
                        this.subscribed = response.data.message;
                        if (!this.subscribed && this.switchEnable) {
                            this.timer = setTimeout(() => {
                                this.checkSubscribed();
                            }, 2000);
                        }
                    }
                });
            },
            codeShow() {
                this.switchEnable = true;
            },
            shadow() {
                this.switchEnable = false;
                this.$refs.moveDiv.style.left = this.xPum + 'px';
                this.$refs.moveDiv.style.top = this.yPum + 'px';
            },
            touchBegin(e) {
                this.flags = true;
                this.animation = false;
                this.title = false;
                let touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                this.position.x = touch.clientX;
                this.position.y = touch.clientY;
                this.dx = this.$refs.moveDiv.offsetLeft;
                this.dy = this.$refs.moveDiv.offsetTop;
            },
            touchMove(e) {
                if (this.flags) {
                    let touch;
                    if (event.touches) {
                        touch = event.touches[0];
                    } else {
                        touch = event;
                    }
                    let nx = touch.clientX - this.position.x;
                    let ny = touch.clientY - this.position.y;
                    this.xPum = this.dx + nx;
                    this.yPum = this.dy + ny;
                    if (this.xPum < 0) {
                        this.xPum = 0
                    } else if (this.xPum > this.screenWidth + 55) {
                        this.xPum = this.screenWidth + 55
                    }
                    if (this.yPum < 0) {
                        this.yPum = 0
                    } else if (this.yPum > this.screenHeight) {
                        this.yPum = this.screenHeight
                    }
                    ;
                    this.$refs.moveDiv.style.left = this.xPum + 'px';
                    this.$refs.moveDiv.style.top = this.yPum + 'px';
                }
            },
            clearTimes() {
                if (this.xPum < (this.screenWidth + 65) / 2) {
                    this.xPum = -8;
                } else {
                    this.xPum = this.screenWidth + 65
                }
                this.$refs.moveDiv.style.left = this.xPum + 'px';
                this.flags = false;
                this.animation = true;
                this.title = false
            }
        }
    }
</script>

<style type="text/scss">

    .follow-notice-panel {
        background: white;
        text-align: center;
        padding-bottom: 35px;
        border-radius: 16px;

        img.icon {
            width: 82px;
            height: 82px;
            padding: 5px;
            background: rgba(255, 255, 255, 1);
            transform: translate3d(0, -41px, 0);
            box-shadow: 0 9px 46px 0 rgba(57, 59, 61, 0.13);
            border-radius: 50%;
            box-sizing: border-box;
        }

        p.title {
            font-size: 18px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(49, 50, 51, 1);
            line-height: 16px;
        }

        img.code {
            width: 172px;
            height: 172px;
            margin: 16px 65px 14px 70px;
            border: 1px solid rgba(234, 238, 241, 1);
            box-sizing: border-box;
            pointer-events: auto !important;
        }

        p.note {
            font-size: 14px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(49, 50, 51, 1);
        }

        i.close {
            width: 20px;
            height: 20px;
            /*border: 2px solid rgba(77, 77, 77, 1);*/
            /*border-radius: 50%;*/
            top: 10px;
            right: 10px;
            position: fixed;
        }
    }

    .follow-notice-float-button {
        text-align: center;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 18px 92px 0px rgba(57, 59, 61, 0.13);
        position: fixed;
        border-radius: 8px;
        left: -8px;
        top: 108px;
        display: flex;
        z-index: 999;

        img {
            width: 30px;
            height: 30px;
            margin: 6px 8px;
            border-radius: 50%;
        }

        p {
            height: 28px;
            font-size: 10px;
            margin: auto;
            font-weight: bold;
            color: rgba(49, 50, 51, 1);
            line-height: 16px;
            margin-right: 8px;
            width: 60px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 7px 8px;
            left: 38px;
            border-bottom-right-radius: 16px;
            border-top-right-radius: 16px;
            z-index: 999;
        }

        .right {
            right: 30px;
            border-radius: 0px;
            border-bottom-left-radius: 16px;
            border-top-left-radius: 16px;
        }

    }

    .adsorbent {
        height: 42px !important;
    }

    .animation {
        transition: all ease 0.4s;
    }

    .code-enter-active, .code-leave-active {
        transition: opacity .5s
    }

    .title-enter, .title-leave-to {
        opacity: 0;
    }

    .title-enter-active, .title-leave-active {
        transition: all ease 0.3s;
    }
</style>
