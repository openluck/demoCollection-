import Vue from 'vue';

/**
 * 价格转换为0.00的浮点数
 */
Vue.filter('transformPrice', (value) => (value ? parseFloat(value).toFixed(2) : value));

/**
 * 商品详情换行
 */
Vue.filter('rnTransform', (value) => {
  if (value !== null) {
    return value.replace(/\r\n/g, '<br/>');
  }
  return value;
});

/**
 * 给数字加上 + 或则- 符号
 */
Vue.filter('SignNumberFloat', (value) => {
  if (value >= 0) {
    return `+${parseFloat(value).toFixed(2)}`;
  }
  return `-${parseFloat(Math.abs(value)).toFixed(2)}`;
});

/**
 * Int符号化（加上+或-）
 */
Vue.filter('SignNumberInt', (value) => {
  if (value >= 0) {
    return `+${parseInt(value, 10)}`;
  }
  return `-${parseInt(Math.abs(value), 10)}`;
});

/**
 * 手机号隐私处理
 */
Vue.filter('transformPhone', (value) => {
  if (value) {
    const phone = value;
    const phoneHead = phone.substring(0, 3);
    const phoneFoot = phone.substr(7, 4);
    return `${phoneHead}****${phoneFoot}`;
  }
  return value;
});

/**
 * 仓储方式转换
 *['现货', '保税', '直邮'],
 */
Vue.filter('storageMode', (value) => {
  switch (value) {
    case 0:
      return '现货';
    case 1:
      return '保税';
    case 2:
      return '直邮';
    default:
      return '未知';
  }
});

/**
 * 年份时间转换
 */
Vue.filter('timeFormat', (value) => {
  const date = new Date(value);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const D = date.getDate();
  return `${Y}年${M}月${D}日`;
});
