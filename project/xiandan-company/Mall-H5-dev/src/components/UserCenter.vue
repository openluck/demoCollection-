<template>
    <div class="user-center-content">
        <div class="user-center">
            <div class="user-center-top" v-if="$store.getters.isLogin">
                <div class="user-info">
                    <img :src="user.avatar" class="avatar-img">
                    <div class="info-right">
                        <div>
                            <p class="user-name">{{user.nickname}}</p>
                            <div class="member-vip member" v-if="user.vip_level > 0" :style="{backgroundImage:'url(' + vipIcon + ')'}">
                                <span class="member-text">闲蛋VIP</span>
                            </div>
<!--         ↓ 普通会员和vip会员 ↑ 的不同样式                    -->
                            <div class="member-normal member" v-else :style="{backgroundImage:'url(' + normalIcon + ')'}">
                                <span class="member-text">普通会员</span>
                            </div>
                        </div>
                        <van-button
                                :disabled="user.checked"
                                type="info"
                                color="#F75108"
                                size="small"
                                @click="checkin"
                                class="check-in"
                                round>{{user.checked ? '已签到' : '签到'}}
                        </van-button>
                    </div>
                </div>
                <div class="menu-bar">
                    <menu-item :to="{name:'coupon',query:{infoSon:this.info},params:{'type':'available'}}"
                               icon="youhuijuan"
                               name="我的优惠券"/>
                    <menu-item :to="{name:'saltegg'}"
                               icon="jifen1"
                               name="闲蛋积分"/>
                    <menu-item :to="{name:'redpack'}"
                               icon="honbao"
                               name="闲蛋红包"/>
                    <menu-item :to="{name:'collection'}"
                               icon="shoucang2"
                               name="收藏"/>
                </div>
            </div>
<!--          已登录 ↑  未登录 ↓-->
            <div v-else class="not-login">
                <div class="login-left">
                    <div class="login-text">欢迎来到闲蛋商城</div>
                    <button class="to-login" v-on:click="login">立即登录</button>
                </div>
                <div class="login-img">
                  <img :src="notLogin" alt="img"/>
                </div>
            </div>
          <div class="member-area">
            <p class="member-top">
              {{user.vip_level > 0 ? "尊敬的VIP您好" : "开通VIP获得不一样的产品优惠"}}
            </p>
            <div class="member-bottom">
              <div class="right-text">
                <p v-if="user.vip_level > 0">
                  距离VIP到期还剩
                  <span>111</span>
                  天
                </p>
                <p v-else>
                  全场商城
                  <span>9.5折 还有其他</span>
                </p>
              </div>
              <button v-on:click="toMember">
                {{user.vip_level > 0 ? "特权查看" : "立即开通"}}
              </button>
            </div>
          </div>
            <div class="user-center-orders">
                <div>我的订单</div>
                <div>
                    <menu-item :to="{name:'order-list',params:{'type':'all'}}"
                               name="全部订单">
                        <img src="/images/icon/all.svg" class="user-center-menu-icon" slot="icon">
                    </menu-item>
                    <menu-item :to="{name:'order-list',params:{'type':'unpay'}}"
                               name="待付款">
                        <img src="/images/icon/unpay.svg" class="user-center-menu-icon" slot="icon">
                    </menu-item>
                    <menu-item :to="{name:'order-list',params:{'type':'unreceived'}}"
                               name="待收货">
                        <img src="/images/icon/unreceived.svg" class="user-center-menu-icon" slot="icon">
                    </menu-item>
                </div>
            </div>
            <div class="user-center-bottom">
                <menu-item tag="div"
                           :to="{name:'userauth'}"
                           icon="renz"
                           name="实名认证"
                           :arrow="true"/>
                <p class="user-center-line"/>
                <menu-item tag="div"
                           :to="{name:'address'}"
                           icon="tubiao2"
                           name="地址管理"
                           :arrow="true"/>
                <p class="user-center-line"/>
                <menu-item tag="div"
                           :to="{name:'mallInvitation'}"
                           icon="haoyou"
                           name="邀请好友"
                           :arrow="true"/>
                <p class="user-center-line"/>
                <menu-item tag="div"
                           :to="{name:'luckDraw'}"
                           icon="renzheng1"
                           name="立即抽奖"
                           :arrow="true"/>
                <p class="user-center-line"/>
                <menu-item tag="div"
                           :to="{name:'suggestion'}"
                           icon="tubiao4"
                           name="意见反馈"
                           :arrow="true"/>
            </div>
        </div>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/UserCenter.scss';
    import Vue from 'vue';
    import { Toast, Icon, Button } from 'vant';
    import { login } from '@/common/js/tools';
    import MenuItem from './User/MenuItem';
    import normalIcon from '../../images/icon/member-normal.png';
    import vipIcon from '../../images/icon/member-vip.png';
    import notLogin from '../../images/icon/not-login.png';
    import memberBg from '../../images/icon/member_bg.svg';

    Vue.use(Toast).use(Icon).use(Button);

    export default {
        name: 'UserCenter',
        data() {
            return {
                popupVisible: true,
                info: {},
                link: ['index', 'countries', 'cart', 'login'],
                vipIcon,
                normalIcon,
                notLogin,
                memberBg,
            };
        },
        components: {
            MenuItem
        },
        computed: {
            user() {
                return this.$store.state.user
            },
            orderNum() {
                return this.$store.state.orderNum
            }
        },
        beforeMount() {
            if (this.$store.getters.isLogin) {
                this.requestCouponInfo();
                this.getCheckinInfo();
                this.orderQuantity();
            }
        },
        mounted: function () {

        },
        methods: {
            login: function () {
                if (!this.$store.getters.isLogin) {
                    login(this.$router);// 去登录
                }
            },
            checkin: function (e) {
                const url = '/api/checkin';
                e.preventDefault();
                this.$http.post(url).then((response) => {
                    if (response.data.code === 0) {
                        const data = response.data.message;
                        if (data.checkin_ok) {
                            this.$store.commit('updateChecked', true);
                            Toast(`签到得${data.salt_eggs}个咸蛋`);
                        }
                        // 更新user
                        this.$store.commit('addUserSaltEggs', data.salt_eggs);
                    } else {
                        Toast({ message: response.data.message });
                    }
                })
            },
            // 优惠券张数
            requestCouponInfo() {
                this.$http.get('/api/coupon/list/info').then(response => {
                    if (response.data.code === 0) {
                        // 更新优惠券张数
                        this.$store.commit('updateAvailable', response.data.message.available);
                        this.$set(this.$data, 'info', response.data.message);
                    } else {
                        console.log('数据引入失败！');
                    }
                })
            },
            // 获取订单数量
            orderQuantity() {
                this.$http.get('/api/order?status=info').then(response => {
                    if (response.data.code === 0) {
                        this.$store.commit('updateUserNum', response.data.message);
                    } else {
                        Toast('订单数量获取失败')
                    }
                })
            },
            getCheckinInfo() {
                const url = '/api/checkin';
                this.$http.get(url).then(response => {
                    if (response.data.code === 0) {
                        const data = response.data.message;
                        this.days = data.days;
                        this.$store.commit('updateSaltEggs', data.total_salt_eggs);
                    } else {
                        Toast({ message: response.data.message });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            // 去往会员页面
            toMember() {
              this.$router.push('/user/member');
            },
        }
    };
</script>
<style lang="scss" type="text/scss">
    .user-login {
        background: transparent !important;
        border: 1px solid #F10D0D;
        color: #313233 !important;
        box-shadow: none !important;
    }
</style>
