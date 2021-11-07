<template>
    <div>
        <p class="sub-title">邀请关注闲蛋商城公众号，并注册完成实名认证</p>
        <div class="invited">
            <div class="invited-box">
                <div class="invited-title">已邀请</div>
                <div class="invited-num">
                    <div>{{invitee.length>99?inviteeNum[inviteeNum.length-3]:0}}</div>
                    <div>{{invitee.length>9?inviteeNum[inviteeNum.length-2]:0}}</div>
                    <div>{{invitee.length>0?inviteeNum[inviteeNum.length-1]:0}}</div>
                </div>
                <p class="time-title">活动时间</p>
                <p class="time-body">{{startTime[0]}}年{{startTime[1]}}月{{startTime[2]}}日 -
                    {{endTime[0]}}年{{endTime[1]}}月{{endTime[2]}}日</p>
            </div>
            <div class="invited-base"></div>
            <div class="invited-footer">
                <router-link :to="{name:code == 0 ||　code==2?'qrCode':'poster'}" style="text-decoration: none">
                    <div class="invited-btn">
                        活动已结束
                    </div>
                </router-link>
            </div>
        </div>
        <div class="wheel-bg-two">
            <p class="text-title"><img src="/images/img/text_decorate.png" class="left-decorate">我已邀请<img
                src="/images/img/text_decorate.png" class="right-decorate"></p>
            <div class="details-list">
                <div class="details-item">
                    <div class="invite-user" v-for="(item,index) of invitee" v-if="index<6">
                        <img :src="item.avatar == ''?'/images/img/user_head.png':item.avatar" alt="">
                        <p>{{item.nickname }}</p>
                    </div>
                    <p style="color: #333;text-align: center;margin: auto;line-height: 50px"
                       v-show="invitee.length == 0">暂未邀请</p>
                </div>
                <router-link :to="{name:'invitedlist'}" class="more" v-show="invitee.length>=6">
                    查看更多<span>>></span>
                </router-link>
            </div>
        </div>
        <div class="wheel-bg-three">
            <img src="/images/img/red_twill_three.png" class="wheel-img-one"/>
            <p class="text-title"><img src="/images/img/text_decorate.png" class="left-decorate">活动奖品<img
                src="/images/img/text_decorate.png" class="right-decorate"></p>
            <div class="details-list">
                <div
                    class="prize-list" v-for="(item,index) of prizeList"><img :src="item.img" class="prize-img"/>
                    <div
                        class="prize-title"><p>{{item.name}}</p>
                        <p class="prize-subTitle" v-if="invitee.length<item.count">还差<span class="prize-count">{{item.count-invitee
                    .length}}</span>人
                        </p>
                        <p v-else-if="invitee.length>=item.count && invitee.length< prizeList[index+1].count"
                           style="color: #F13232;">已满足</p></div>
                    <div
                        class="prize-btn"
                        :style="{background:invitee.length<item.count?'#AEAEAE':invitee.length>=item.count && invitee.length>= prizeList[index+1].count?'#333':'#F13232'}">
                        邀请{{item
                        .count}}人
                    </div>
                </div>
            </div>
        </div>
        <div class="wheel-bg-four">
            <img src="/images/img/red_twill_four.png" class="wheel-img-two"/>
            <p class="text-title"><img src="/images/img/text_decorate.png" class="left-decorate">活动规则<img
                src="/images/img/text_decorate.png" class="right-decorate"></p>
            <div class="details-list">
                <p class="activity-rules">《闲蛋商城活动规则》</p>
                <router-link :to="{name:'activityrules'}" class="activity-btn">
                    点击查看
                </router-link>
            </div>
        </div>
        <div style="height: 20px"></div>
    </div>
</template>

<script>

    export default {
        name: 'home',
        data() {
            return {
                prizeList: [],
                startTime: [],
                endTime: '',
                invitee: [],
                inviteeNum: [],
                code: 0
            }
        },
        created() {
            this.getUserData();
        },
        methods: {
            // generate() {
            //     this.$emit('click', true);
            // },
            getUserData() {
                this.$http.get('/api/events/invite').then(res => {
                    // console.log(res.data.message.invitation);
                    this.code = res.data.code;
                    // if (res.data.code == 2 || res.data.code == 0) {
                    //     this.$router.push({ path: 'national' });
                    // } else {
                    this.prizeList = res.data.message.invitation.rewards;
                    this.startTime = res.data.message.invitation.start.split('-');
                    this.endTime = res.data.message.invitation.end.split('-');
                    this.invitee = res.data.message.user_list;
                    this.inviteeNum = this.invitee.length.toString().split('');
                    // }
                    this.wait = false;
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style  type="text/scss">
    .sub-title {
        font-size: 12px;
        color: #fff;
        text-align: center;
        margin: 14px auto;
    }

    .invited {
        position: relative;
        background: url("/images/img/red_twill_one.png");
        background-repeat: no-repeat;
        background-position: -110px 10px;

        .invited-base {
            width: 313px;
            height: 134px;
            background: rgba(255, 255, 255, 0.4);
            position: absolute;
            top: 51px;
            left: 50%;
            transform: translateX(-50%);
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
        }

        .invited-box {
            position: relative;
            z-index: 10;
            overflow: hidden;
            zoom: 1;
            height: 185px;
            width: 293px;
            background: #fff;
            margin: auto;
            border-top-right-radius: 20px;
            border-top-left-radius: 20px;

            .invited-title {
                width: 83px;
                height: 26px;
                border-radius: 15px;
                line-height: 26px;
                background: #F13232;
                color: #fff;
                margin: 16px auto 0;
                text-align: center;
                box-shadow: 0 0 5px #F45348;
                font-size: 16px;

            }

            .invited-num {
                display: flex;
                justify-content: center;
                margin-top: 14px;

                div {
                    width: 53px;
                    height: 41px;
                    border-radius: 5px;
                    background: #fff;
                    border: 1px solid #F13232;
                    border-top-width: 6px;
                    border-bottom-width: 6px;
                    margin: 0 5px;
                    font-size: 38px;
                    font-weight: bold;
                    text-align: center;
                    line-height: 41px;
                }
            }

            .time-title {
                text-align: center;
                margin: 16px auto 10px;
                font-size: 13px;
            }

            .time-body {
                border: 1px solid #F13232;
                border-radius: 14px;
                text-align: center;
                width: 237px;
                margin: 0 auto;
                font-size: 13px;
                color: #F13232;
                line-height: 23px;
            }
        }

        .invited-footer {
            zoom: 1;
            overflow: hidden;
            width: 313px;
            height: 76px;
            background: #FEF3F1;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            margin: auto;

            .invited-btn {
                display: block;
                width: 180px;
                height: 37px;
                color: #fff;
                background: #5d5d5d;
                border-radius: 20px;
                text-align: center;
                line-height: 37px;
                text-decoration: none;
                margin: 20px auto;
                font-size: 14px;
            }
        }
    }

    .wheel-bg-two {
        background: url("/images/img/red_twill_two.png") no-repeat;
        background-position: 150% top;
    }

    .wheel-bg-three {
        position: relative;

        .wheel-img-one {
            position: absolute;
            top: -80px;
            left: -15px;
            z-index: 10;
        }
    }

    .wheel-bg-four {
        position: relative;

        .wheel-img-two {
            position: absolute;
            top: -80px;
            right: 0;
            z-index: 10;
        }
    }

    .text-title {
        color: #fff;
        letter-spacing: 5px;
        font-weight: bold;
        text-align: center;
        line-height: 50px;
        font-size: 16px;

        .right-decorate {
            transform: rotateZ(180deg);
        }

        .left-decorate {
            margin-right: 5px;
        }
    }

    .details-list {
        position: relative;
        z-index: 20;
        width: 343px;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0px -5px 0 rgba(255, 255, 255, 0.4);
        margin: 0 auto;
        border: 0;
        padding: 20px 0;
        /*display: flex;*/
        /*flex-direction: row;*/
        /*flex-wrap: wrap;*/
        .activity-rules {
            text-align: center;
            line-height: 40px;
        }

        .activity-btn {
            display: inline-block;
            width: 165px;
            height: 30px;
            line-height: 30px;
            border-radius: 20px;
            text-align: center;
            color: #fff;
            text-decoration: none;
            background: #e4393c;
            margin: 10px auto;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
        }

        .rule-item {
            font-size: 13px;
            margin: 0 14px;
            line-height: 30px;
        }

        .prize-list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            height: 40px;

            .prize-img {
                width: 50px;
                height: 50px;
            }

            .prize-title {
                width: 153px;
                height: 100%;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .prize-subTitle {
                    .prize-count {
                        color: #F13232;
                    }
                }
            }

            .prize-btn {
                width: 80px;
                height: 24px;
                border-radius: 15px;
                color: #fff;
                line-height: 24px;
                text-align: center;
                font-size: 13px;
            }
        }

        .details-item {
            display: flex;
            flex-wrap: wrap;
            min-height: 50px;

            .invite-user {
                width: 50%;
                height: 50px;
                display: flex;
                align-items: center;

                img {
                    width: 16%;
                    height: 26px;
                    border-radius: 50%;
                    /*border: 1px solid red;*/
                    margin: 12px;
                }
            }
        }

        .more {
            font-size: 12px;
            /*margin:auto;*/
            color: #333;
            line-height: 50px;
            text-decoration: none;
            margin-left: 40%;

            span {
                color: #F13232;
            }
        }
    }
</style>
