import Vue from 'vue';
import axios from 'axios';

/**
 * 获取页面Meta标签数据
 * @param {string} id 标签id
 * @returns {string} 标签内容
 */
export function getMetaStr(id) {
  const query = document.querySelector(`#${id}`);
  if (!query) return '';
  return query.getAttribute('content');
}

/**
 * 初始化微信分享内容（页面变化需调用）
 * @param {string} title 分享的标题
 * @param {string} desc 内容的内容
 * @param {string} link 点击的链接,该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
 * @param {string} imgUrl 显示的Icon图片地址
 * @return {void}
 */
export function weixinShare(title, desc, link, imgUrl) {
  Vue.prototype.$http.get(`/api/public/mall/init?url=${encodeURIComponent(location.href.split('#')[0])}`)
    .then((response) => {
      if (response.data.code === 0) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.message.csrf;
        wx.config(response.data.message.config);
        wx.ready(() => {
          //  自定义“分享给朋友”及“分享到QQ”按钮的分享内容
          const config = {
            title,
            desc,
            link: encodeURI(link),
            imgUrl,
          };
          wx.updateAppMessageShareData(config);
          wx.updateTimelineShareData(config);

          //  老接口
          wx.onMenuShareAppMessage(config);
          wx.onMenuShareTimeline(config);
          wx.onMenuShareQQ(config);
          wx.onMenuShareWeibo(config);
          wx.onMenuShareQZone(config);
        });
      }
    });
}

/**
 * 判断是否在微信中
 * @returns {boolean} true 在微信中 false 不在
 */
export function isWechat() {
  const ua = window.navigator.userAgent.toLowerCase();
  //  通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) != null) {
    return true;
  }
  return false;
}

/**
 * 判断是否是手机浏览器
 * @returns {boolean} true 手机浏览器 其它平台
 */
export function isMobile() {
  const userAgentInfo = navigator.userAgent;
  const mobileAgents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  // 根据userAgent判断是否是手机
  for (let v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      return true;
    }
  }

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  //  根据屏幕分辨率判断是否是手机
  if (screenWidth < 500 && screenHeight < 800) {
    return true;
  }

  return false;
}

/**
 * 获取当前打开的平台
 *
 * @returns {string} 'WECHAT':表示在微信中 'MOBILE':表示在手机浏览器打开 'PC':表示在电脑流量器打开
 */
export function getPlatform() {
  if (isWechat()) {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/macwechat/i) !== null) {
      return 'MACOS-WECHAT';
    }
    if (ua.match(/windowswechat/i) !== null) {
      return 'WINDOWS-WECHAT';
    }
    return 'WECHAT';
  }

  if (isMobile()) {
    return 'MOBILE';
  }

  return 'PC';
}

/**
 * 跳转到登录界面.
 * @param {VueRouter}router 路由管理器
 * @return {void}
 */
export function login(router) {
  if (isWechat()) {
    window.location.replace(`${Vue.prototype.$http.defaults.baseURL}/public/register/wechat?redirect=${window.location.href}`);
  } else {
    router.push({ name: 'login' });
  }
}

/**
 * 向链接加入参数
 * @param {string} key 关键字
 * @param {string} value 值
 * @param {string} uri 链接地址 默认是当前页
 * @return {string} 新的链接
 */
export function addQuery(key, value, uri = window.location.href) {
  if (!value) {
    return uri;
  }
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, `$1${key}=${value}$2`);
  }
  return `${uri + separator + key}=${value}`;
}

/*
 *弹出框时候底部固定
 */
export function fixed(val) {
  if (val) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
  }
}

/**
 * 关闭窗口
 */
export function closeWindow() {
  if (isWechat()) {
    wx.closeWindow();
  } else {
    window.close();
  }
}

/**
 * 通过快递名称转快递代码
 * @param name 快递名称
 * @return {string|*} 快递代码
 */
export function getShippingCode(name) {
  switch (name) {
    case '中通快递':
      return 'ZTO';
    case '圆通快递':
      return 'YTO';
    case '申通快递':
      return 'STO';
    case '韵达速递':
      return 'YD';
    case '顺丰速运':
      return 'SF';
    case '百世快递':
      return 'HTKY';
    case 'EMS':
      return 'EMS';
    case '天天快递':
      return 'HHTT';
    case '京东快递':
      return 'JD';
    case '优速快递':
      return 'UC';
    case '德邦快递':
      return 'DBL';
    case '宅急送':
      return 'ZJS';
    default:
      return name;
  }
}
