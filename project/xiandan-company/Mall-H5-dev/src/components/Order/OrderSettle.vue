<template>
    <div>
        <div class="wait-scroll-loading" v-if="wait">
            <van-loading type="spinner" color="#09bb07" :size="25"/>
        </div>
        <div class="order-settle" v-else>
            <van-cell title="添加收货地址"
                      icon="location-o"
                      size="large"
                      :to="{name:'address', query:{mode: 'choose'}}"
                      v-if="address === ''"
                      is-link/>
            <div @click="chooseAddress" v-else class="address-switch">
                <order-address :address="address">
                    <label v-show="address.defaulted" slot="defaulted">默认</label>
                </order-address>
                <van-icon class-prefix="iconfont" name="yuanjiaojuxingkaobei4"/>
            </div>
            <order-inventory :goods="goods"/>
            <div class="order-discount">
                <p @click="showCouponList">
                    <span>优惠券</span>
                    <span>{{this.payment.coupon > 0?`¥${this.payment.coupon}`:couponText}}
                        <van-icon class-prefix="iconfont" name="yuanjiaojuxingkaobei"/>
                    </span>
                </p>
                <div class="order-line"/>
                <div class="order-red">
                    <div>
                        <p>咸蛋</p>
                        <p>剩余咸蛋:<label style="color:#F10D0D;">{{user.salt_eggs}}颗</label>
                            <van-icon class-prefix="iconfont" name="exclamation" @click="saltedRule = !saltedRule"/>
                        </p>
                    </div>
                    <div>
                        <van-switch v-model="useSaltEggs" @change="onUseSaltEggsSwitchChange"/>
                    </div>
                </div>
                <div class="order-line"/>
                <div class="order-red">
                    <div>
                        <p>红包</p>
                        <p>红包余额:<label style="color:#F10D0D;">{{parseFloat(user.red_pack).toFixed(2)}}元</label>
                            <van-icon class-prefix="iconfont" name="exclamation" @click="redRule = !redRule"/>
                        </p>
                    </div>
                    <div>
                        <van-switch v-model="useRedPack" @change="onUseRedPackSwitchChange"/>
                    </div>
                </div>
                <div class="order-line"/>
                <div class="order-red">
                    <div>
                        <p>备注</p>
                    </div>
                    <div>
                        <p><input class="comments" v-model="comments" placeholder="备注:尺码、颜色等信息"/></p>
                    </div>
                </div>
            </div>
            <div class="order-agreement" v-if="isBonded">
                <input type="checkbox" v-model="acceptedAgreement" value="1"/>
                <span>本人已知晓并接受</span>
                <a href="https://mp.weixin.qq.com/s/JGYJA9j_mNAfuWPTGW2XHg">闲蛋商城《告知书及服务协议》</a>

            </div>
            <order-transaction :payment="payment"/>
            <div id="pay-container">
                <div class="total-result">
                    <div>
                        <p class="total-price"><span>合计：</span>&yen;{{totalPrice | transformPrice}}</p>
                        <p v-if="shopConfig.config_free === 0">（全场包邮）</p>
                        <p v-else-if="payment.freight">
                            （订单未满¥{{shopConfig.config_free | transformPrice}}，
                            需额外支付邮费¥{{payment.freight | transformPrice}}）
                        </p>
                        <p v-else>（订单已满¥{{shopConfig.config_free | transformPrice}}，无需邮费）</p>
                    </div>
                </div>
                <div class="to-pay-btn" @click="payOrder">结算</div>
            </div>
            <transition>
                <section class="clip-coupons" v-show="showCoupons">
                    <div class="clip-coupons-top">
                        <span v-for="(item,index) in couPonTop" :key="index"
                              @click="clipCouponsAction(index)"
                              :class="{clipCouponsAction:clipCouponsShow === index}">
                            <span>{{item}}</span><span/></span>
                    </div>
                    <div class="clip-coupons-bottom" v-show="clipCouponsShow === 0">
                        <coupon-list :table="couponAvailable" :selectCoupon="selectCoupon"/>
                        <div class="no-use" @click="deselected" v-if="this.couponAvailable.list.length > 0">不使用优惠券
                            <p>
                                <van-icon class-prefix="iconfont"
                                          name="yuanjiaojuxingkaobei1"
                                          v-if="couponCode === '-1'"/>
                            </p>
                        </div>
                        <empty-data :is-show="{empty:this.couponAvailable.list.length <= 0, stroll:false}">
                            <van-icon class-prefix="iconfont" name="tubiao5" slot="img"/>
                            <h4 slot="header">没有可使用的优惠券！</h4>
                        </empty-data>
                    </div>
                    <div class="clip-coupons-bottom" v-show="clipCouponsShow === 1">
                        <coupon-list :table="couponUnavailable"/>
                        <empty-data :is-show="{empty:this.couponUnavailable.list.length <= 0, stroll:false}">
                            <van-icon class-prefix="iconfont" name="tubiao5" slot="img"/>
                            <h4 slot="header">没有不可使用的优惠券！</h4>
                        </empty-data>
                        <div class="data-scroll-end" v-if="this.couponUnavailable.length > 0">
                            没有更多优惠券了:)
                        </div>
                    </div>
                </section>
            </transition>
            <p class="settle-mask" v-show="showCoupons" @click="mask"/>
        </div>
        <van-popup v-model="saltedRule" class="salted-rule">
            <h5>闲蛋积分使用规则</h5>
            <p>使用条件</p>
            <p>
                <span>1.咸蛋数量大于1000个（含）；</span><br>
                <span>2.使用咸蛋数量为1000的整数倍；</span><br>
                <span>3.1000咸蛋抵扣10元；</span>
            </p>
            <p @click="saltedRule = !saltedRule">我知道了</p>
        </van-popup>
        <van-popup v-model="redRule" class="salted-rule">
            <h5>闲蛋红包使用规则</h5>
            <p>使用条件</p>
            <p>
                <span>1.闲蛋商城红包不能抵扣税收、邮费；</span><br>
                <span>2.单笔订单不支持全额抵扣，用户应至少支付0.01元；</span><br>
                <span>3.闲蛋红包余额不能兑换现金、不能转赠他人、不能为他人代付款，红包余额抵扣金额不能开具发票；</span>
            </p>
            <p @click="redRule = !redRule">我知道了</p>
        </van-popup>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/settle.scss';
    import Vue from 'vue';
    import {Toast, Dialog, Cell, Switch, Popup, Radio, Loading} from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';
    import {login, fixed} from '@/common/js/tools';
    import Icon from '@/components/_layouts/Icon.vue'
    import OrderInventory from './OrderInventory'
    import OrderAddress from './OrderAddress'
    import OrderTransaction from './OrderTransaction'
    import CouponList from '../User/CouponList'
    import store from "@/store";

    Vue.use(Toast).use(Cell).use(Switch).use(Popup).use(Radio).use(Loading);

    export default {
        data() {
            return {
                from: '',
                commodities: '',
                goods: [],
                couponCode: '-1',
                coupons: [],
                useSaltEggs: false,
                useRedPack: false,
                comments: '',
                freight_amount: false, // eslint-disable-line camelcase
                showCoupons: false,
                discountSalteggs: false,
                discountRedpack: false,
                payment: {
                    amount: 0.0,
                    tax: 0.0,
                    freight: 0.0,
                    coupon: 0.0,
                    redpack: 0.0,
                    salteggs: 0.0,
                    commodity_vip_price: 0.0,
                    vip_discount: 0.0,
                },
                couponAvailable: {
                    list: [],
                    selected: 'available',
                    action: -1
                },
                couponUnavailable: {
                    list: [],
                    selected: 'expired'
                },
                clipCouponsShow: 0,
                activeIndex: -1,
                couPonTop: ['可用优惠券', '不可用优惠券'],
                saltedRule: false,
                redRule: false,
                pay: true,
                wait: true,
                acceptedAgreement: true // 同意告知书及服务协议
            }
        },
        components: {
            EmptyData,
            Icon,
            OrderInventory,
            OrderAddress,
            OrderTransaction,
            CouponList
        },
        computed: {
            shopConfig() {
                return this.$store.state.shopConfig;
            },
            order() {
                return this.$store.state.orderData;
            },
            address() {
                return this.$store.state.chooseAddress;
            },
            user() {
                return this.$store.state.user;
            },
            totalPrice() {
                const money = this.payment.amount + this.payment.tax + this.payment.freight - this.payment.coupon - this.payment.redpack - this.payment.salteggs;
                return (money > 0) ? money : 0.01;
            },
            couponAvail() {
                if (this.couponAvailable.list.length <= 0) {
                    return false;
                }
                return true;
            },
            couponText() {
                return !this.couponAvail ? '没有可使用的优惠券' : (this.couponCode === '-1' ? '不使用优惠劵' : '-' + this.payment.coupon + '元');
            },
            // 是否是保税订单
            isBonded() {
                for (let i = 0; i < this.goods.length; i++) {
                    if (this.goods[i].source === 1 || this.goods[i].source === 2) {
                        return true;
                    }
                }
                return false;
            }
        },
        watch: {
            'couponCode': function () {
                this.fetchPayment();
                this.showCoupons = false;
            },
            'payment': function () {
                this.discountSalteggs = this.payment.salteggs > 0;
                this.discountRedpack = this.payment.redpack > 0;
            },
            'showCoupons': function (val) {
                fixed(val)
            }
        },
        created() {
            this.initOrder();
        },
        methods: {
            initOrder: function () {
                // check 是否注册，未注册跳向注册
                if (!this.$store.getters.isLogin) { // 未登录
                    Dialog.confirm({message: '您还是未登录，否前往登录？'}).then(() => {
                        login(this.$router);
                    }).catch(() => {
                        this.$router.back()
                    })
                    return;
                }
                const params = this.$route.params;
                this.from = params.from;
                this.commodities = params.commodities;

                this.fetchInfo();

                if (this.address === '') {
                    this.fetchDefaultAddress();
                }
            },
            // 获取默认地址
            fetchDefaultAddress: function () {
                this.$http.get('/api/address/default').then(response => {
                    if (response.data.code === 0) {
                        this.$store.commit('updateChooseAddress', response.data.message);
                        if (!response.data.message) {
                            Dialog.confirm({message: '还未建立收货地址，马上去新建?'}).then(() => {
                                this.$router.push({name: 'add-address'});
                            })
                        }
                    }
                    this.wait = false
                });
            },
            // 获取订单信息
            fetchInfo: function () {
                this.$http.get(`/api/order/${this.commodities}/settle`).then(response => {
                    if (this.address !== '') {
                        this.wait = false
                    }
                    if (response.data.code === 0) {
                        this.goods = response.data.message.commodities;
                        this.coupons = response.data.message.coupons;
                        let bestCoupon = null;
                        for (let i = 0; i < this.coupons.length; i++) {
                            const coupon = this.coupons[i];
                            if (coupon.usable === true) {
                                this.couponAvailable.list.push(coupon)
                                if (!bestCoupon || bestCoupon.denomination < coupon.denomination) {
                                    bestCoupon = coupon;
                                }
                            } else {
                                this.couponUnavailable.list.push(coupon)
                            }
                        }
                        this.payment = response.data.message.payment;

                        //默认选择一张最大面值的优惠券
                        if (bestCoupon) {
                            this.couponCode = bestCoupon.code;
                        }
                    } else {
                        Dialog.alert({message: response.data.message}).then(() => {
                            this.$router.back();
                        });

                    }
                });
            },
            fetchPayment: function () {
                this.$http.get(`/api/order/${this.commodities}/payment`, {
                    params: {
                        /* eslint-disable camelcase */
                        coupon_code: this.couponCode === '-1' ? '' : this.couponCode,
                        use_salt_eggs: this.useSaltEggs ? 1 : 0,
                        use_red_pack: this.useRedPack ? 1 : 0
                        /* eslint-enable camelcase */
                    }
                }).then(response => {
                    if (response.data.code === 0) {
                        this.payment = response.data.message;
                        if (response.data.message.redpack <= 0 && this.useRedPack) {
                            this.useRedPack = false;
                            Toast(`最低支付0.01元`);
                        } else if (response.data.message.salteggs <= 0 && this.useSaltEggs) {
                            this.useSaltEggs = false;
                            Toast(`最低支付0.01元`);
                        }
                    } else {
                        Toast({
                            message: response.data.message
                        });
                        this.$router.back();
                    }
                });
            },
            chooseAddress: function () {
                this.$router.push({name: 'address', params: {hashid: this.address.id}, query: {mode: 'choose'}})
            },
            payOrder: function () {
                if (this.isBonded && this.user.is_auth !== 2) {
                    Dialog.confirm({message: '您好，根据海关跨境电商监管要求，购买保税、直邮商品需要真实身份信息，前往实名认证？'}).then(() => {
                        this.$router.push({name: 'userauth'})
                    })
                    return
                }

                if (!this.address) {
                    Toast({message: '请选择地址'});
                    return;
                }

                if (this.isBonded && !this.acceptedAgreement) {
                    Toast({message: '请阅读并接受闲蛋商城《告知书及服务协议》'});
                    return;
                }

                if (this.pay) {
                    this.pay = false;
                    Toast.loading({
                        message: '订单创建中...',
                        forbidClick: true
                    });
                    const data = {};
                    // 订单来源
                    data.from = this.from;
                    data.comments = this.comments;
                    // 地址数据
                    data.name = this.address.name;
                    data.phone = this.address.phone;
                    data.province = this.address.province;
                    data.city = this.address.city;
                    data.district = this.address.district;
                    data.address = this.address.address;
                    // 商品数据
                    data.commodities = this.commodities;
                    /* eslint-disable camelcase */
                    data.coupon_code = this.couponCode === '-1' ? '' : this.couponCode;// 使用的优惠券
                    data.use_salt_eggs = this.useSaltEggs ? 1 : 0; // 是否使用咸蛋积分
                    data.use_red_pack = this.useRedPack ? 1 : 0;// 是否使用红包
                    if (global.inviter) {
                        data.inviter = global.inviter
                    }
                    /* eslint-enable camelcase */
                    // 创建订单
                    this.$http.post('/api/order', data).then(response => {
                        Toast.clear()
                        if (response.data.code === 0) {
                            // 更新咸蛋和红包数据
                            this.$store.commit('updateSaltEggs', response.data.message.user.salt_eggs);
                            this.$store.commit('updateRedPack', response.data.message.user.red_pack);
                            this.$router.replace({
                                name: 'orderpay',
                                params: {'hashid': response.data.message.order_id}
                            });
                        } else {
                            this.pay = true;
                            Toast({
                                message: response.data.message
                            });
                        }
                    });
                }
            },
            onUseSaltEggsSwitchChange: function () {
                // if (this.useSaltEggs == checked) return
                if (this.useSaltEggs && this.user.salt_eggs < 1000) {
                    Dialog.alert({message: '咸蛋必须大于1000枚才能使用'}).then(() => {
                        this.useSaltEggs = false;
                    });
                } else {
                    this.fetchPayment();
                }
            },
            onUseRedPackSwitchChange: function () {
                if (this.useRedPack && this.user.red_pack.toFixed(2) <= 0) {
                    Dialog.alert({message: '红包余额必须大于0元才能使用'}).then(() => {
                        this.useRedPack = false;
                    });
                } else {
                    this.fetchPayment();
                }
            },
            showCouponList: function () {

                if (this.payment.amount <= 0.01)//订单金额已经最小值，不能使用优惠价
                {
                    Toast('订单金额已最低不能使用其它优惠！');
                    return;
                }
                if (this.coupons.length === 0) {
                    Toast('没有优惠劵！');
                    return;
                }
                this.showCoupons = true;
            },
            clipCouponsAction(index) {
                this.clipCouponsShow = index
            },
            selectCoupon(index, code) {
                if (this.couponCode === code) {
                    this.showCoupons = false
                } else {
                    this.couponCode = code;
                    this.couponAvailable.action = index;
                }
            },
            deselected() {
                this.couponCode = '-1';
                this.couponAvailable.action = -1;
                this.showCoupons = false;
            },
            mask() {
                this.showCoupons = false;
            }
        }
    }
</script>

<style>
    .data-scroll-end {
        font-size: 14px;
        color: yellowgreen;
    }
</style>
