<template>
    <div>
        <div class="wait-scroll-loading" v-if="isLoading">
            <van-loading color="#09bb07" :size="25"/>
        </div>

        <div class="commodity-detail" v-else>

            <div class="commodity-detail-img">
                <div class="home" @click="$router.replace({name:'index'})">返回首页</div>
                <van-swipe :auto="3000"
                           indicator-color="white"
                           :width="bannerWidth">
                    <van-swipe-item v-for="i in 2" :key="i">
                        <img :src="commodity.commodity_img" style="width: 100%;">
                    </van-swipe-item>
                </van-swipe>
                <van-count-down class="discount-count-down"
                                :time="countDownTime"
                                format="活动结束: DD 天 HH 时 mm 分 ss 秒"
                                @finish="reloadCommodity"
                                v-if="commodity.is_discount"/>
            </div>
            <div class="commodity-details">
                <div class="price">
                    <span><span>¥</span><span>{{commodity.commodity_current_price | transformPrice}}</span></span>
                    <span>¥{{commodity.commodity_original_price | transformPrice}}</span>
                    <p>
                        <span>{{commodity.source | storageMode}}</span>
                        <span>{{commodity.commodity_country_name}}</span>
                    </p>
                </div>
                <div class="name">{{commodity.commodity_name}}</div>
                <div class="member">
                    <div class="title">
                        <img :src="vipIcon" alt="img"/>
                        VIP特权
                    </div>
                    <div class="info" v-if="commodity.commodity_vip_price">
                        <div class="info-text">
                            <p v-if="!user.vip_level > 0">
                                闲蛋会员特价区
                            </p>
                            <p :class="{'font-12':user.vip_level > 0}">
                                商品VIP优惠价
                                <span>{{commodity.commodity_vip_price}}元</span>
                            </p>
                        </div>
                        <div class="dredge" v-on:click="toMember" v-if="!user.vip_level > 0">
                            立即开通
                            <van-icon class-prefix="iconfont" name="yuanjiaojuxingkaobei"/>
                        </div>
                    </div>
                    <div class="info" v-else>
                        <div class="info-text" v-if="!user.vip_level > 0">
                            <p>
                                闲蛋会员价格
                                <span>199元/年</span>
                            </p>
                            <p>
                                全场优惠
                                <span>9.5折</span>
                                还有每期特价优惠
                            </p>
                        </div>
                        <div :class="{'info-text':true, 'font-12': user.vip_level > 0}" v-else>
                            <p>
                                产品优惠
                                <span>9.5折</span>
                            </p>
                        </div>
                        <div class="dredge" v-on:click="toMember" v-if="!user.vip_level > 0">
                            立即开通
                            <van-icon class-prefix="iconfont" class="right-icon" name="yuanjiaojuxingkaobei"/>
                        </div>
                    </div>
                </div>
                <div class="freight">
                    <span>运费：<span>{{parseFloat(shopConfig.config_free) > parseFloat(commodity.commodity_current_price) ? `满${shopConfig.config_free}包邮` : '包邮'}}</span></span>
                    <span>{{commodity.warehouse}}</span>

                </div>
                <div class="count">
                    <p><span>剩余：</span><span>{{ !commodity.commodity_stock_number ? '无货': `${commodity.commodity_stock_number}件`}}</span>
                    </p>
                    <span>{{commodity.commodity_sold_number}}人购买</span>
                </div>
            </div>
            <div class="commodity-num">
                <p>数量</p>
                <div class="num-wrap">
                    <van-icon class-prefix="iconfont" name="jian1" @click="minusClick(commodityNum)"/>
                    <input class="num" type="tel" v-model="commodityNum" ref="input" @blur="inputBlur">
                    <van-icon class-prefix="iconfont" name="jia1" @click="plusClick(commodityNum)"/>
                </div>
                <div class="commodityCollection">
                    <span>{{action ? '收藏' : '已收藏'}}</span>
                    <button :disabled="isDisable" @click="collection">
                        <van-icon class-prefix="iconfont" name="taoxin"
                                  :color="action ? '#636566' : '#F10D0D'"/>
                    </button>
                </div>
            </div>
            <div class="commodity-explain">
                <div class="commodity-title">
                    <ul class="title-wrap">
                        <li @click="detailToggle" :class=" detailVisible ? 'active' : '' ">商品详情</li>
                        <li @click="detailToggle" :class=" detailVisible ? '' : 'active' ">商品简介</li>
                    </ul>
                </div>
                <div class="detail-wrap" v-show="detailVisible" v-html="commodity.commodity_detail_info"></div>
                <div class="base-wrap" v-show="!detailVisible"
                     v-html="rnTransform(commodity.commodity_base_info)"></div>
            </div>
            <van-goods-action>
                <van-goods-action-icon icon="cart-o" text="购物车" :info="cartNum > 0 ? cartNum : null" @click="onClickCart"/>
                <van-goods-action-button type="warning" text="加入购物车" @click="addCart" />
                <van-goods-action-button type="danger" text="立即购买" @click="toPay" />
            </van-goods-action>
        </div>
    </div>
</template>

<style type="text/scss">
</style>

<script>
    'use strict';
    import '@/sass/commodity.scss';
    import vipIcon from '../../../images/icon/member-vip.png';
    import Vue from 'vue';
    import {
        Toast,
        Dialog,
        SwipeItem,
        Swipe,
        Loading,
        Tag,
        Icon,
        CountDown,
        GoodsAction,
        GoodsActionIcon,
        GoodsActionButton
    } from 'vant';
    import { weixinShare, isWechat, addQuery } from '../../common/js/tools'

    Vue.use(Toast)
        .use(Swipe)
        .use(SwipeItem)
        .use(Loading)
        .use(Tag)
        .use(Icon)
        .use(CountDown)
        .use(GoodsAction)
        .use(GoodsActionIcon)
        .use(GoodsActionButton);

    export default {
        data() {
            return {
                commodity: '',
                sheetVisible: false,
                detailVisible: true,
                commodityNum: 1,
                action: true,
                isLoading: true,
                isDisable: false,
                bannerWidth: "100%",
                vipIcon,
            };
        },
        components: {},
        computed: {
            user() {
                return this.$store.state.user;
            },
            cartNum() {
                return this.$store.state.cartNum;
            },
            shopConfig() {
                return this.$store.state.shopConfig;
            },
            countDownTime(){
                const timeStr = this.commodity.discount_end.replace(/-/g, '/');
                return new Date(timeStr).getTime() - new Date().getTime();
            }
        },
        watch: {
            commodityNum(val) {
                if (val > this.commodity.commodity_stock_number) {
                    if (this.commodity.commodity_stock_number !== 0) {
                        Toast(`此商品最多购买量：${this.commodity.commodity_stock_number}`);
                        this.commodityNum = this.commodity.commodity_stock_number;
                    } else if (this.commodity.commodity_stock_number === 0) {
                        Toast(`此商品库存不足！`);
                    }
                } else if (val <= 0) {
                    if (this.commodity.commodity_stock_number !== 0) {
                        Toast('此商品最少购买1件');
                        this.commodityNum = 1;
                    } else if (this.commodity.commodity_stock_number === 0) {
                        Toast(`此商品库存不足！`);
                        this.commodityNum = 0;
                    }
                }
            }
        },
        created() {
            this.bannerWidth  =  (document.body.clientWidth || document.body.clientHeight) - 32
            this.fetchCommodity();
            window.scrollTo(0, 0);
        },
        methods: {
            touchmove() {
                this.$refs.input.blur();
            },
            inputBlur() {
                window.scrollTo(0, 0)
            },
            onClickCart() {
                this.$router.push({ name: 'cart' });
            },
            fetchCommodity: function () {
                const itemId = this.$route.params.hashid;
                this.isLoading = true;
                this.$http.get(`/api/commodity/${itemId}`).then(response => {
                    if (response.data.code === 0) {
                        this.commodity = response.data.message;
                        let shareUrl = this.$store.getters.isLogin ? addQuery('inviter', this.$store.state.user.uid) : window.location.href;
                        weixinShare('我在闲蛋商城发现一个好产品', this.commodity.commodity_name, shareUrl, this.commodity.commodity_img);
                        this.fetchCartCount();
                        this.action = this.commodity.is_collected !== 1;
                    } else {
                        Toast({
                            message: response.data.message
                        });
                        this.$router.back();
                    }
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            reloadCommodity: function () {
                const itemId = this.$route.params.hashid;
                this.$http.get(`/api/commodity/${itemId}`).then(response => {
                    if (response.data.code === 0) {
                        this.commodity = response.data.message;
                    }
                })
            },
            fetchCartCount: function () {
                this.$http.get('/api/cart/count').then(response => {
                    if (response.data.code === 0) {
                        this.$store.commit('updateCart',{
                            empty: '=',
                            num: response.data.message
                        })
                    }
                });
            },
            rnTransform: function (text) {
                if (text) {
                    return text.replace(/\r\n/g, '<br/>');
                }
                return text;
            },
            minusClick: function (num) {
                if (num > 1) this.commodityNum = parseInt(num) - 1;
            },
            plusClick: function (num) {
                if (num < this.commodity.commodity_stock_number && num !== '') {
                    this.commodityNum = parseInt(num) + 1;
                } else if (num === '') {
                    this.commodityNum = 1;
                } else if (this.commodity.commodity_stock_number === 0) {
                    Toast(`此商品库存不足`);
                } else {
                    Toast(`此商品最多购买量：${this.commodity.commodity_stock_number}`);
                }
            },
            detailToggle: function () {
                this.detailVisible = !this.detailVisible;
            },
            addCart: function () {
                if (!(this.$store.getters.isLogin || isWechat())) { // 游客，未在微信上打开
                    Dialog.confirm({ message: '您还未登录，是否前往登录？' }).then(() => {
                        window.location.replace(this.$http.defaults.baseURL + '/public/register/wechat?redirect=' + encodeURI(window.location.href));
                    });
                    return;
                }

                Toast.loading({ message: '请稍等...', forbidClick: true });
                this.$http.post('/api/cart', {
                    /* eslint-disable camelcase */
                    commodity_id: this.commodity.id,
                    commodity_num: this.commodityNum
                    /* eslint-enable camelcase */
                }).then(response => {
                    Toast.clear();
                    if (response.data.code === 0) {
                        if (response.data.message === 'store') {
                            this.$store.commit('updateCart', {
                                empty: '+',
                                num: 1
                            });
                        }
                        Toast(`操作成功！`);
                    } else {
                        Toast(response.data.message);
                    }
                });
            },
            toPay: function () {
                if (!this.shopConfig.config_switch_purchase) {
                    Dialog.alert({ message: this.shopConfig.config_switch_tips_purchase })
                        .then(() => {
                        });
                } else {
                    if (this.commodity.commodity_stock_number === 0) {
                        Toast('此商品库存不足');
                    } else {
                        const commodity = this.commodity.id + '=' + this.commodityNum;
                        this.$router.push({
                            name: 'order-settle',
                            params: { from: 'default', commodities: commodity }
                        });
                    }
                }
            },
            // 前往开通vip会员
            toMember() {
                if (!(this.$store.getters.isLogin || isWechat())) { // 游客，未在微信上打开
                    Dialog.confirm({ message: '您还未登录，是否前往登录？' }).then(() => {
                        window.location.replace(this.$http.defaults.baseURL + '/public/register/wechat?redirect=' + encodeURI(window.location.href));
                    });
                    return;
                }
                this.$router.push('/user/member');
            },
            //   收藏功能
            collection: function () {
                if (this.$store.getters.isLogin) {
                    if (!this.action) {
                        this.cancelCollection();
                        return;
                    }
                    this.isDisable = true;
                    this.$http.post(`/api/commodity/${this.commodity.id}/collect`).then(response => {
                        if (response.data.code === 0) {
                            Toast('已收藏');
                            this.action = false;
                        } else {
                            Toast(response.data.message);
                        }
                    }).finally(() => {
                        this.isDisable = false;
                    })
                } else {
                    Toast('请先登录商城!');
                    this.$router.push({ name: 'usercenter' });
                }
            },
            // 取消收藏功能
            cancelCollection: function () {
                this.isDisable = true;
                this.$http.delete(`/api/commodity/${this.commodity.id}/collect`).then(response => {
                    if (response.data.code === 0) {
                        Toast('已取消收藏');
                        this.action = true;
                    } else {
                        Toast(response.data.message);
                    }
                }).finally(() => {
                    this.isDisable = false;
                })
            }
        }
    };
</script>
