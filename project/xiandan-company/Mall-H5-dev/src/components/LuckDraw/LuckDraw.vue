<template>
    <div>
        <div class="container" v-if="!isLoading">
            <div class="lucky-wheel">
                <div class="lucky-title">
                    <img src="/images/img/lucky_title.png" alt="">
                </div>
                <div class="wheel-main">
                    <div class="wheel-pointer-box">
                        <div class="wheel-pointer" @click.prevent="rotateHandle()">
                            <img src="/images/img/draw_btn.png" alt="">
                        </div>
                    </div>
                    <div class="wheel-bg" :style="{transform:rotateAngle,transition:rotateTransition}">
                        <div class="wheel-img">
                            <img src="/images/img/draw_wheel.png" alt="">
                            <div class="prize-list">
                                <div class="prize-item" v-for="(item,index) in prizeList" :key="index"
                                     :class="{img:item.type === 4}">
                                    <div class="prize-pic">
                                        <img :src="item.img_url" v-if="Boolean(item.img_url)" class="luck-draw-img">
                                    </div>
                                    <div class="prize-type">
                                        {{item.name}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lucky-content">
                    <div class="lottery_ticket">每次抽奖消耗100咸蛋<br>剩下咸蛋<span>{{user.salt_eggs}}</span>，每天 <span>3</span> 次抽奖
                    </div>
                </div>
                <div class="lucky-list"><p @click="myPrize(true)">我的奖励</p></div>
                <div class="lucky-tip">
                    <div class="tip-title">活动规则</div>
                    <div class="tip-content">
                        <p> 1.每100颗咸蛋可以抽一次奖。</p>
                        <p> 2.每位用户一天最多抽3次奖。</p>
                        <p> 3.实物奖品不包邮，不包税，最少支付0.01元。</p>
                    </div>
                </div>
            </div>
            <div class="toast" v-show="toastControl">
                <div class="toast-container">
                    <div>
                        <img :src="toastInfo.msg.status_code === 0 ? (toastInfo.msg.lucky ? toastInfo.img[0] : toastInfo.img[1]) : toastInfo.img[1]">
                    </div>
                    <div>
                        <van-icon class-prefix="iconfont" name="zhongfuwangge1"
                                  v-if="!toastInfo.msg.lucky || toastInfo.msg.prize_info.type === 0"/>
                        <img :src="toastInfo.msg.prize_info.img_url" v-else-if="toastInfo.msg.prize_info.type === 4">
                        <img :src="toastInfo.icon[toastInfo.msg.prize_info.type]" v-else>
                    </div>
                    <div class="toast-title">
                        {{toastInfo.msg.status_code === 0 ? toastInfo.toastTitle : toastInfo.msg.msg}}
                    </div>
                    <div>
                        <p @click="myPrize(true)">查看奖品</p>
                        <p @click.prevent="rotateHandle()" v-if="toastInfo.msg.status_code >= 0">再抽一次</p>
                    </div>
                </div>
            </div>
            <div class="toast-mask" v-show="toastControl" @click="closeToast"></div>
        </div>
        <div class="wait-scroll-loading" v-if="isLoading">
            <van-loading color="#09bb07" :size="25"/>
        </div>
        <van-popup v-model="popupVisible"
                   position="bottom"
                   class="luck-draw-popup"
                   closeable>
            <van-list v-model="dataLoading"
                      :finished="loadFinished"
                      finished-text="没有更多奖品信息了:)"
                      @load="myPrize"
                      v-if="!isEmpty"
                      immediate-check>
                <div class="luck-draw-popup-top collapse" v-for="(item,index) in list" :key="index">
                    <p>{{item.name}}</p>
                    <p>时间：{{item.datetime}}</p>
                </div>
            </van-list>
            <empty-data :is-show="{empty:isEmpty, stroll:false}" style="margin-left: -16px">
                <van-icon class-prefix="iconfont" name="tubiao12" slot="img"/>
                <h4 slot="header">暂无奖励，快去抽奖吧</h4>
            </empty-data>
        </van-popup>
    </div>
</template>
<script>
    'use strict';
    import '@/sass/LuckDraw.scss';
    import Vue from 'vue';
    import { Toast, Popup, List, Loading } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';
    import Icon from '@/components/_layouts/Icon.vue'
    import { fixed } from '@/common/js/tools';

    Vue.use(List).use(Toast).use(Loading).use(Popup);

    export default {
        data() {
            return {
                prizeList: [], // 奖品列表
                toastControl: false, // 抽奖结果弹出框控制器
                hasPrize: false, // 是否中奖
                startRotatingDegree: 0, // 初始旋转角度
                rotateAngle: 0, // 将要旋转的角度
                startRotatingDegreePointer: 0, // 指针初始旋转角度
                rotateAnglePointer: 0, // 指针将要旋转的度数
                rotateTransition: 'transform 6s ease-in-out', // 初始化选中的过度属性控制
                rotateTransitionPointer: 'transform 12s ease-in-out', // 初始化指针过度属性控制
                clickFlag: true, // 是否可以旋转抽奖
                index: 0,
                toastInfo: {
                    toastTitle: '',
                    toastPicture: '',
                    img: ['/images/img/congratulations.png', '/images/img/sorry.png'],
                    msg: '',
                    icon: ['', '/images/img/egg.png', '/images/img/coupon.png', '/images/img/red.png']
                },
                list: [],
                call: true,
                isLoading: true,
                msg: '',
                popupVisible: false,
                loadFinished: false,
                isEmpty: false,
                dataLoading: false,
                current_page: 0, // eslint-disable-line camelcase
                firstDel: false
            };
        },
        watch: {
            popupVisible(val) {
                fixed(val)
            },
            toastControl(val) {
                fixed(val)
            }
        },
        created() {
            this.luckDrawData();// 请求奖品数据，初始化抽奖圆盘
        },
        components: {
            EmptyData,
            Icon
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        methods: {
            rotateHandle() {
                this.addPrize()
                this.toastControl = false;
                if (this.call) {
                    this.call = false;
                    this.$http.get(`/api/lottery/daily`).then(response => {
                        if (response.data.code === 0) {
                            this.toastInfo.msg = response.data.message;
                            if (response.data.message.status_code === 0) {
                                if (response.data.message.lucky === false) {
                                    this.index = response.data.message.index;// 指定每次旋转到的奖品下标
                                    this.hasPrize = false;
                                    this.toastInfo.toastTitle = '谢谢参与';
                                    this.toastInfo.toastPicture = '/images/img/NoChance.png';
                                    this.rotating();
                                } else if (response.data.message.lucky === true) {
                                    this.index = response.data.message.index;// 指定每次旋转到的奖品下标
                                    this.firstDel = true;
                                    this.hasPrize = true;
                                    this.msg = response.data.message;
                                    this.toastInfo.toastTitle = `恭喜您，获得${response.data.message.prize_info.name}`;
                                    this.rotating();
                                    this.clearPrize();// 清除奖品数据，点击我的奖品之后重新加载数据（数据有变化）
                                }
                            } else if (
                                response.data.message.status_code === -1 ||
                                response.data.message.status_code === -2 ||
                                response.data.message.status_code === -3) {
                                this.toastInfo.toastTitle = response.data.message.msg;
                                this.call = true;
                                this.toastControl = true;
                            }
                        }
                    })
                }
            },
            // 请求服务器数据
            luckDrawData() {
                this.$http.get(`/api/lottery/queryDaily/`).then(response => {
                    if (response.data.code === 0) {
                        this.prizeList = response.data.message.prize_items;
                        this.isLoading = false;
                    } else {
                        Toast({
                            message: response.data.message
                        });
                    }
                })
            },
            rotating() {
                if (!this.clickFlag) return;
                const duringTime = 5; // 默认为1s
                const resultIndex = this.index; // 最终要旋转到哪一块，对应prize_list的下标
                const resultAngle = [315, 270, 225, 180, 135, 90, 45, 360]; // 最终会旋转到下标的位置所需要的度数
                const randCircle = 6; // 附加多转几圈，2-3
                this.clickFlag = false; // 旋转结束前，不允许再次触发
                // 转动盘子
                const rotateAngle = this.startRotatingDegree + randCircle * 360 + resultAngle[resultIndex] - this.startRotatingDegree % 360;
                this.startRotatingDegree = rotateAngle;
                this.rotateAngle = 'rotate(' + rotateAngle + 'deg)';
                // 旋转结束后，允许再次触发
                setTimeout(() => {
                    this.clickFlag = true;
                    this.gameOver();
                    this.$set(this.$data, 'call', true);
                    this.firstDel = false;
                }, duringTime * 1000 + 1500); // 延时，保证转盘转完
                this.$store.commit('minusUserSaltEggs', 100);
            },
            gameOver() {
                this.toastControl = true;
            },
            closeToast() { // 关闭弹窗
                this.toastControl = false;
                this.addPrize()
            },
            addPrize() {
                if (this.msg.lucky === true) {
                    if (this.msg.prize_info.type === 1) {
                        this.$store.commit('addUserSaltEggs', parseInt(this.msg.prize_info.value));
                        this.msg.lucky = false;
                    } else if (this.msg.prize_info.type === 3) {
                        this.$store.commit('addUserRedPack', this.msg.prize_info.value);
                        this.msg.lucky = false;
                    }
                }
            },
            clearPrize() { // 清除奖品数据
                this.$set(this.$data, 'list', []);
                this.dataLoading = false;
                this.loadFinished = false;
                this.isEmpty = false;
                this.current_page = 0 // eslint-disable-line camelcase
            },
            // 奖品详情
            myPrize(num) {
                this.addPrize()
                this.toastControl = false;
                if (num) {
                    this.popupVisible = true;
                    this.clearPrize();
                }
                this.current_page += 1; // eslint-disable-line camelcase
                this.dataLoading = true
                this.$http.get(`/api/lottery/history?page=${this.current_page}`).then(response => {
                    if (response.data.code === 0) {
                        this.dataLoading = false;
                        this.list = this.list.concat(response.data.data);
                        if (this.firstDel) {
                            this.list.shift();
                        }
                        this.loadFinished = response.data.meta.last_page === response.data.meta.current_page;
                        this.isEmpty = response.data.meta.total === 0;
                        this.paginate = response.data.message;
                    }
                });
            }
        }
    };
</script>
<style>
</style>

