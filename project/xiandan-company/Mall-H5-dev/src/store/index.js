/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    user: {},
    cartNum: 0,
    shopConfig: {
      new_user_rewards: [],
    },
    orderNum: {
      all: '',
      unpay: '',
      unreceived: '',
    },
    chooseAddress: '',
    isSuccess: false,
  },
  mutations: {

    initUser(state, user) { // 初始化用户信息
      state.user = user;
    },
    updateUserAuth(state, auth) { // 更新用户认证状态
      state.user.is_auth = auth;
    },
    updateSaltEggs(state, value) { // 更新咸蛋
      state.user.salt_eggs = value;
    },
    addUserSaltEggs(state, value) { // 添加咸蛋
      state.user.salt_eggs = Number(state.user.salt_eggs) + value;
    },
    minusUserSaltEggs(state, value) { // 减少咸蛋
      state.user.salt_eggs = Number(state.user.salt_eggs) - value;
    },
    updateRedPack(state, value) { // 更新红包
      state.user.red_pack = value;
    },
    addUserRedPack(state, value) { // 添加红包
      state.user.red_pack = Number(state.user.red_pack) + value;
    },
    changeVipLevel(state, value) { // 开通vip后更新vip_level
      state.user.vip_level = value;
    },
    initShopConfig(state, config) { // 初始化商城配置信息
      state.shopConfig = config;
    },
    updateChooseAddress(state, address) { // 更新选择的地址
      state.chooseAddress = address;
    },
    updateAvailable(state, value) { // 跟新用户优惠券数量
      state.user.ava_coupon_count = value;
    },
    updateUserNum(state, value) {
      state.orderNum = value;
    },
    updateChecked(state, value) { // 更新是否已签到
      state.user.checked = value;
    },
    updateCart(state, value) { // 更新购物车的数量
      switch (value.empty) {
        case '+':
          state.cartNum = Number(state.cartNum) + value.num;
          break;
        case '-':
          state.cartNum = Number(state.cartNum) - value.num;
          break;
        default:
          state.cartNum = parseInt(value.num, 10);
          break;
      }
    },
    updateSuccess(state, value) {
      state.isSuccess = value;// 周年庆活动是否成功兑换实物奖品
    },
  },
  getters: {
    // 判断是否登录
    isLogin: (state) => state.user && state.user.registered,
  },
});
