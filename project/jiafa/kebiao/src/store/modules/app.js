/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-01-19 14:38:00
 * @LastEditors: went
 * @LastEditTime: 2021-09-24 16:49:24
 */
export default {
  namespaced: true,
  state: {
    collapse: false, // 导航栏收缩状态
    menuRouteLoaded: false, // 菜单和路由是否已经加载
    picBaseUrl: "", //图片基础地址
    isGettedInfo: false,
    isAllowStatus: true,
    isRouterAlive: true,
    hasNewTips: false, // 消息红点
    userName: ""
  },
  getters: {
    collapse(state) {
      // 对应着上面state
      return state.collapse;
    }
  },
  mutations: {
    onCollapse(state) {
      // 改变收缩状态
      state.collapse = !state.collapse;
    },
    menuRouteLoaded(state, menuRouteLoaded) {
      // 改变菜单和路由的加载状态
      state.menuRouteLoaded = menuRouteLoaded;
    },
    changePicBaseUrl(state, payload) {
      // console.log("payload",payload)   //修改图片基础地址
      state.picBaseUrl = payload;
    },
    reload(state) {
      state.isRouterAlive = false; //先关闭，
      setTimeout(() => {
        state.isRouterAlive = true; //再打开
      }, 100);
    },
    // 修改消息红点
    getHasNewTips(state, payload) {
      state.hasNewTips = payload;
      console.log('state.hasNewTips', state.hasNewTips);
    },
    setUserName(state, payload) {
      state.userName = payload
    }
  },
  actions: {}
};
