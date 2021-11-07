<template>
    <div class="activity-code">
        <div class="activity-top">
            <img src="/images/icon/activityCode.svg">
        </div>
        <div class="activity-center">
            <div>
                <img src="/images/icon/Invitation.png" alt="">
            </div>
            <div>
                <div>
                <span v-for="(item,index) in activityData.message.count.toString().split('')" :key="index">
                    {{item}}
                    <span/>
                </span>
                </div>
                <div>
                    <p @click="popup">活动规则</p>
                    <router-link tag="p" :to="{name:'qrCode'}">生成海报</router-link>
                </div>
                <div>
                    <p>活动时间</p>
                    <p><span>{{activityData.message.invitation.start | timeFormat}}</span>-<span>{{activityData.message.invitation.end | timeFormat}}</span>
                    </p>
                </div>
                <div>
                    <p>
                        <label v-for="(item,index) in activityTop" :key="index"
                               :class="{activityAction:activityAction === index}" @click="activityAction = index">
                            {{item}}
                            <span/>
                        </label>
                    </p>
                    <p v-if="activityAction === 0">
                    <span v-for="(item,index) in activityData.message.invitation.rewards" :key="index">
                        <span/>
                        {{item.from-item.to == 0 ? `第${item.from}名` : `第${item.from}-${item.to}名`}}：
                        {{item.name}}
                    </span>
                    </p>
                    <div v-if="activityAction === 1">
                        <div>
                            <p>
                                <img :src="user.avatar" alt="">
                            </p>
                            <p>
                                <span>{{user.nickname}}</span><br>
                                <span><van-icon class-prefix="iconfont" name="tuoyuan" style="fill: #D8DADB;margin-right: 5px"/> 排名：{{activityData.message.count?activityData.message.rank:`暂无排名`}}</span>
                            </p>
                            <p class="rankingSurplus">
                                已邀请{{activityData.message.count}}人
                            </p>
                        </div>
                        <p v-for="(item,index) in activityData.message.invitation.ranks" :key="index"
                           :class="{rankingOne:item.rank === 1,rankingTwo:item.rank>1&&item.rank<4,rankingSurplus:item.rank>3}">
                            <span>{{item.rank}}</span>
                            <span>
                                <img :src="item.avatar" v-if="item.avatar">
                                <van-icon class-prefix="iconfont" name="dan" style="font-size: 40px;position: relative;top: 10px" v-else/>
                                {{item.nickname}}
                            </span>
                            <span>已邀请{{item.count}}人</span>
                            <van-icon class-prefix="iconfont" name="zu4" class="ranking"/>
                            <span v-if="index < 9"/>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div>
                <div class="qrcode-img">
                    <qrcode :url="value"
                            iconurl="/images/icon/logoCode.png"
                            :wid="100"
                            :hei="100"
                            :imgwid="20"
                            :imghei="20"/>
                </div>
                <div>
                    <p>长按识别二维码</p>
                    <p>邀请好友后，好友识别二维码,获得好礼。</p>
                </div>
            </div>
        </div>
        <van-popup v-model="popupVisible" class="popup">
            <div>活动规则</div>
            <p>活动时间</p>
            <span>1.本期活动时间为{{activityData.message.invitation.start | timeFormat}}00:00:00-{{activityData.message.invitation.end | timeFormat}}23:59:59。(本期活动结束后，闲蛋商城将根据
            实际活动情况，在闲蛋电商公众号公布新的活动时间和具体活动规则)</span>
            <p>活动内容</p>
            <span>1.本期活动时间为{{activityData.message.invitation.start | timeFormat}}00:00:00-{{activityData.message.invitation.end | timeFormat}}23:59:59。(本期活动结束后，闲蛋商城将根据
            实际活动情况，在闲蛋电商公众号公布新的活动时间和具体活动规则)<br>
            2.活动期间，邀请者通过使用活动海报、微信、朋友圈、二维码、链接等途径，将活动页面分享给好友，
            并邀请好友，被邀请者关注闲蛋电商公众号并通过手机号码成功注册，即邀请成功。<br>
            3.活动期间邀请者可根据邀请成功的人数获得排名，排名可在“邀请好友”活动页面进行查看。<br>
            4.同一名被邀请者，只能被成功邀请1次。</span>
            <p>参与资格</p>
            <span>1.用户(邀请者和被邀请者)须关注闲蛋电商公众号并成功注册。<br>
            2.同一微信号、身份证、手机号、手机设备，符合以上任一条件，均视为同一用户。<br>
            3.如用户出现违规行为(如虚假交易、作弊、恶意套取现金、刷信等)，闲蛋商城将撤销用户的活动参与
            资格，并有权撤销违规奖励，回收用户已经获得的奖品，必要时追究法律责任。<br>
            4.本活动最终解释权归闲蛋电商所有。</span>
            <p>其它说明</p>
            <span>1.本次活动奖品，均由闲蛋商城出资提供，用户无需承担任何费用，所以奖品均包邮寄出。<br>
            2.活动结束后，中奖名单将在闲蛋电商公众号公布，工作人员将在活动结束后5个工作日内联系中奖者，
            确认邮寄信息。</span>
            <div @click="popupVisible = !popupVisible" class="cancel">我已了解</div>
        </van-popup>
    </div>
</template>

<script>
    'use strict';

    import Vue from 'vue';
    import { Popup } from 'vant';
    import Icon from '@/components/_layouts/Icon';
    import { fixed } from '@/common/js/tools';
    import qrcode from 'vue_qrcodes'

    Vue.use(Popup);

    export default {
        name: 'activityCode',
        data() {
            return {
                value: `${this.$http.defaults.baseURL}/public/register/wechat?inviter=${this.$store.state.user.uid}`,
                logo: '/images/icon/logoCode.png',
                num: 20,
                activityTop: ['活动奖品', '排行榜'],
                activityAction: 0,
                activityData: '',
                popupVisible: false
            }
        },
        components: {
            Icon,
            qrcode,
            fixed
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        watch: {
            popupVisible(val) {
                fixed(val)
            }
        },
        created() {
            this.activity();
        },
        methods: {
            activity() {
                this.$http.get('/api/events/invite').then(response => {
                    this.activityData = response.data;
                })
            },
            popup() {
                this.popupVisible = true
            }
        }
    }
</script>

<style type="text/scss">
    .activity-code {
        background: linear-gradient(to top, #FE5D68, #FF825C);
        box-sizing: border-box;
        overflow: hidden;
        padding-bottom: 10%;

        .activity-top {
            position: relative;

            img {
                width: 100%;
            }
        }

        .activity-center {
            width: calc(100% - 32px);
            background: white;
            border-radius: 16px;
            margin: -16% auto auto;
            position: relative;

            & > div:nth-of-type(1) {
                width: 150px;
                margin: auto;

                img {
                    width: 150px;
                    margin-top: 25px;
                }
            }

            & > div:nth-of-type(2) {
                & > div:nth-of-type(1) {
                    font-size: 60px;
                    color: #FD656F;
                    font-weight: 800;
                    width: 100%;
                    text-align: center;
                    padding-top: 5%;

                    span {
                        position: relative;
                        display: inline-block;

                        span {
                            display: inline-block;
                            width: 20px;
                            height: 2px;
                            background: #BF4850;
                            position: absolute;
                            bottom: 0px;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                }

                & > div:nth-of-type(2) {
                    display: flex;
                    width: calc(100% - 62px);
                    justify-content: center;
                    margin: auto;
                    margin-top: 10px;

                    p {
                        width: 50%;
                        height: 40px;
                        text-align: center;
                        line-height: 36px;
                    }

                    p:nth-of-type(1) {
                        margin-right: 10px;
                        background: url("/images/icon/buttonActivity.png") no-repeat center center;
                        background-size: 100%;
                    }

                    p:nth-of-type(2) {
                        background: url("/images/icon/buttonPoster.png") no-repeat center center;
                        background-size: 100%;
                    }
                }

                & > div:nth-of-type(3) {
                    margin: auto;
                    text-align: center;
                    font-size: 14px;
                    margin-top: 6%;
                    line-height: 20px;
                }

                & > div:nth-of-type(4) {
                    margin-top: 6%;

                    & > p:nth-of-type(1) {
                        font-size: 16px;
                        color: #636566;
                        display: flex;
                        justify-content: center;

                        label:nth-of-type(1) {
                            margin-right: 100px;
                        }

                        .activityAction {
                            font-weight: bold;
                            color: #313233;
                            position: relative;

                            span {
                                width: 48px;
                                height: 7px;
                                background: #FE5D68;
                                position: absolute;
                                bottom: -3px;
                                left: 50%;
                                display: inline-block;
                                transform: translateX(-50%);
                                opacity: 0.3;
                            }
                        }
                    }

                    & > p:nth-of-type(2) {
                        margin: auto;
                        margin-top: 2%;
                        font-size: 14px;
                        display: inline-block;
                        position: relative;
                        left: 50%;
                        transform: translateX(-50%);

                        & > span {
                            margin-top: 7%;
                            display: block;

                            span {
                                position: relative;
                                top: -2px;
                                display: inline-block;
                                width: 5px;
                                height: 5px;
                                border-radius: 5px;
                                background: #FD656F;
                                margin-right: 15px;
                            }
                        }
                    }

                    & > div {
                        margin-top: 30px;

                        & > div {
                            width: calc(100% - 32px);
                            margin: auto;
                            padding: 0 10px;
                            box-sizing: border-box;
                            display: flex;
                            align-items: center;
                            height: 50px;
                            border: 1px solid #F0F3F5;
                            border-radius: 25px;
                            position: relative;

                            & > p:nth-of-type(1) {
                                width: 40px;
                                height: 40px;
                                border-radius: 20px;
                                box-sizing: border-box;

                                img {
                                    width: 100%;
                                    border: 2px solid rgba(201, 205, 207, 1);
                                    border-radius: 40px;
                                    box-sizing: border-box;
                                }
                            }

                            & > p:nth-of-type(2) {
                                margin-left: 16px;

                                span:nth-of-type(1) {
                                    font-size: 14px;
                                }

                                span:nth-of-type(2) {
                                    font-size: 12px;
                                    color: #636566;
                                }
                            }

                            & > p:nth-of-type(3) {
                                font-size: 12px;
                                color: #F10D0D;
                                position: absolute;
                                right: 10px;
                            }
                        }

                        & > p {
                            width: 100%;
                            padding: 0 16px;
                            box-sizing: border-box;
                            position: relative;
                            height: 60px;
                            line-height: 60px;
                            position: relative;

                            .ranking {
                                position: absolute;
                                left: 15px;
                                top: 31px;
                                font-size: 19px;
                            }

                            span:nth-of-type(1) {
                                min-width: 13px;
                                min-height: 13px;
                                padding: 2px;
                                display: inline-block;
                                border-radius: 50%;
                                line-height: 13px;
                                text-align: center;
                                color: white;
                                font-size: 10px;
                                position: relative;
                                top: -2px;
                                background: #F7AB08;
                            }

                            span:nth-of-type(2) {
                                margin-left: 15px;
                                font-size: 14px;

                                img {
                                    width: 40px;
                                    border-radius: 40px;
                                    vertical-align: middle;
                                    margin-right: 10px;
                                    border: 2px solid rgba(201, 205, 207, 1);
                                    box-sizing: border-box;
                                    height: 40px;
                                }
                            }

                            span:nth-of-type(3) {
                                float: right;
                                color: #F10D0D;
                                font-size: 12px;
                            }

                            span:nth-of-type(4) {
                                height: 1px;
                                background: #F0F3F5;
                                width: calc(100% - 70px);
                                display: inline-block;
                                position: absolute;
                                bottom: -2px;
                                right: 16px;
                            }
                        }

                        .rankingOne {
                            span:nth-of-type(1) {
                                background: #F10D0D;
                            }

                            .ranking {
                                fill: #F10D0D;
                            }
                        }

                        .rankingTwo {
                            span:nth-of-type(1) {
                                background: #F75108;
                            }

                            .ranking {
                                fill: #F75108;
                            }
                        }

                        .rankingSurplus {
                            span:nth-of-type(1) {
                                top: 0px;
                            }

                            .ranking {
                                display: none;
                            }
                        }
                    }
                }
            }

            & > div:nth-of-type(3) {
                width: calc(100% - 32px);
                height: 2px;
                background: url("/images/icon/border.png") center center repeat-x;
                margin: 7% auto auto;
                position: relative;

                .dot {
                    width: 30px;
                    height: 30px;
                    background: #FF795F;
                    border-radius: 50%;
                    position: absolute;
                }

                .dot:nth-of-type(1) {
                    top: -15px;
                    left: -34px;
                }

                .dot:nth-of-type(2) {
                    top: -15px;
                    right: -34px;
                }
            }

            & > div:nth-of-type(4) {
                display: flex;
                align-items: center;
                width: calc(100% - 32px);
                margin: 6% auto auto;
                padding-bottom: 6%;

                .qrcode-img {
                    padding: 10px;
                    border: 1px solid #EAEEF1;
                    box-sizing: border-box;

                    /deep/ img {
                        pointer-events: auto !important;
                    }
                }

                div:nth-of-type(2) {
                    margin-left: 10px;
                    color: #313233;

                    p:nth-of-type(1) {
                        font-size: 18px;
                    }

                    p:nth-of-type(2) {
                        font-size: 12px;
                        margin-top: 10px;
                    }
                }
            }
        }

        .popup {
            width: calc(100% - 64px);
            margin: auto;
            height: 70%;
            border-radius: 16px;
            overflow: auto;
            padding: 16px;
            box-sizing: border-box;

            .icon {
                font-size: 20px;
                position: absolute;
                right: 10px;
                top: 10px;
            }

            & > div:first-of-type {
                text-align: center;
                line-height: 40px;
                height: 40px;
                font-weight: bold;
            }

            & > p {
                font-size: 15px;
                height: 30px;
                line-height: 30px;
                font-weight: bold;
            }

            & > span {
                font-size: 14px;
                line-height: 20px;
            }

            .cancel {
                width: 90px;
                height: 25px;
                text-align: center;
                line-height: 25px;
                background: #FE5D68;
                color: white;
                border-radius: 16px;
                font-size: 14px;
                margin: 20px auto auto;
            }
        }
    }
</style>
