<template>
    <van-collapse v-model="activeNames">
        <div class="coupon-list"
             v-for="(item,index) in table.list ? table.list : table"
             :key="index"
             @click="choose(index, item.code)"
             :class="{used:(table.selected === 'used' || table.action === index), expired:table.selected === 'expired'}">
            <div class="coupon-list-left">
                <div>
                    <p>
                        <span v-if="item.category !== 2">¥</span>
                        <span v-else>个</span>
                        <span>{{item.denomination ? item.denomination : item.amount%1===0?parseInt(item.amount):item.amount}}</span>
                    </p>
                    <p v-if="item.lower_limit">满{{item.lower_limit}}可使用</p>
                    <p v-else>{{item.subtitle}}</p>
                </div>
            </div>
            <div class="coupon-list-right">
                <div class="coupon-line">
                    <div/>
                </div>
                <div class="coupon-list-title">
                    <p>
                        <span v-if="!item.coupon_type">{{couponType[item.type]}}</span>
                        <span v-else-if="item.coupon_type>=0">{{couponType[item.coupon_type]}}</span>
                        <span v-else-if="item.category ===1">红包</span>
                        <span v-else>咸蛋</span>
                        <span>{{item.name?item.name:(item.category ===1 || item.category ===2)?'实名认证后领取':item.subtitle}}</span>
                    </p>
                    <p v-if="item.expire">有效期至{{item.expire}}</p>
                    <P v-else>{{item.valid}}</P>
                    <van-collapse-item title="详情信息"
                                       :name="item.id"
                                        title-class="title"
                                        wx:if="item.desc">{{item.desc}}</van-collapse-item >
                </div>
            </div>
            <div class="coupon-used" v-if="item.desc">
                <van-icon class-prefix="iconfont"
                          :name="table.selected === 'available' ? 'weishiyong' : (table.selected === 'used' ? 'yishiyong' : 'yiguoqi')"
                          v-if="table.action !== index"/>
                <van-icon class-prefix="iconfont" name="zu2" v-else/>
            </div>
        </div>
    </van-collapse>
</template>

<script>
    import Vue from 'vue';
    import { Icon, Collapse, CollapseItem } from 'vant'

    Vue.use(Icon).use(Collapse).use(CollapseItem)

    export default {
        name: 'CouponList',
        props: ['table', 'selectCoupon'],
        components: {
            Icon
        },
        data() {
            return {
                couponType: ['全场券', '单场券'],
                activeNames: [],
                couponAction: -1
            }
        },
        methods: {
            choose(index, code) {
                if(this.selectCoupon){
                    this.selectCoupon(index, code)
                }
            }
        }
    }
</script>

<style type="text/scss">
    .coupon-list {
        width: 100%;
        overflow: hidden;
        border-radius: 16px;
        margin-top: 16px;
        background: white;
        background-image: radial-gradient(#F10D0D 70%, #fff 0);
        background-size: 14px 14px;
        background-position: -7px 0;
        background-repeat: repeat-y;
        position: relative;

        & > div {
            float: left;
        }

        .coupon-list-left {
            width: 38%;
            position: relative;
            height: 106px;
            display: flex;
            justify-content: center;

            div {
                padding-left: 5px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);

                p:nth-of-type(1) {
                    color: #F10D0D;
                    font-weight: bold;
                    position: relative;
                    top: 5px;

                    span:nth-of-type(1) {
                        font-size: 18px;
                    }

                    span:nth-of-type(2) {
                        font-size: 36px;
                    }
                }

                p:nth-of-type(2) {
                    color: #969899;
                    font-size: 12px;
                    margin-top: 11px;
                    text-align: center;
                }
            }
        }

        .coupon-list-right {
            width: 62%;
            height: 100%;
            display: flex;
            position: relative;

            .coupon-line {
                width: 1px;
                box-sizing: border-box;
                padding: 16px 0;
                height: 106px;

                div {
                    width: 100%;
                    background: #DEE0E3;
                    height: 100%;
                }
            }

            .coupon-list-title {
                width: 100%;
                margin-top: 23px;

                p {
                    margin-left: 18px;
                }

                p:nth-of-type(1) {
                    font-weight: bold;
                    font-size: 12px;
                    color: #636566;
                    box-sizing: border-box;
                    position: relative;
                    display: flex;

                    & > span:nth-of-type(1) {
                        font-size: 15px;
                        line-height: 14px;
                        color: #F75108;
                        display: inline-block;
                        width: 60px;
                    }

                    span:nth-of-type(2) {
                        display: inline-block;
                        width: calc(100% - 50px);
                        margin-right: 16px;
                    }
                }

                p:nth-of-type(2) {
                    color: #636566;
                    font-size: 12px;
                    margin-top: 14px;
                }

            }
        }

        .coupon-details {
            width: 62%;
            float: right;
            padding-left: 19px;
            padding-bottom: 33px;
            box-sizing: border-box;
            padding-right: 16px;

            p {
                width: 100%;
                font-size: 12px;
                color: #636566;
            }
        }

        .coupon-used {
            position: absolute;
            bottom: -36px;
            right: -28px;

            svg {
                font-size: 110px;
            }
        }
    }

    .used {
        background-image: radial-gradient(#f88686 70%, #fff 0) !important;
        background-size: 14px 14px;
        background-position: -7px 0;
        background-repeat: repeat-y;

        .coupon-list-left {
            div {
                p:nth-of-type(1) {
                    color: #f57878;
                }

                p:nth-of-type(2) {
                    color: #969899;
                }
            }
        }

        .coupon-list-right {
            .coupon-list-title {
                p:nth-of-type(1) {
                    span:nth-of-type(1) {
                        color: #f99276;
                    }

                    span:nth-of-type(2) {
                        color: #636566;
                    }
                }

                p:nth-of-type(2) {
                    color: #636566;
                }

                p:nth-of-type(3) {
                    span:nth-of-type(1) {
                        color: #969899;
                    }

                    svg {
                        color: #F10D0D;
                        opacity: 0.5;
                    }
                }
            }
        }
    }

    .expired {
        background-image: radial-gradient(#636566 70%, #fff 0);
        background-size: 14px 14px;
        background-position: -7px 0;
        background-repeat: repeat-y;

        .coupon-list-left {
            div {
                p:nth-of-type(1) {
                    color: #636566;
                }
                p:nth-of-type(2) {
                    color: #969899;
                }
            }
        }

        .coupon-list-right {
            .coupon-list-title {
                p:nth-of-type(1) {
                    span:nth-of-type(1) {
                        color: #636566;
                    }

                    span:nth-of-type(2) {
                        color: #969899;
                    }
                }
                p:nth-of-type(2) {
                    color: #969899;
                }
                p:nth-of-type(3) {
                    color: #969899;

                    .icon {
                        fill: black !important;

                        path {
                            fill: rgb(255, 255, 255) !important;
                        }
                    }
                }
            }
        }
    }
    .title {
        color: #969899;
        font-size: 12px;
        margin-left: 2px;
    }
</style>
