/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:28:39
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-13 17:08:26
 */
// 导入所有接口
import api from "./api";

const install = (Vue) => {
  // 第二次就不用再添加 直接return出去
  if (install.installed) {
    return;
  }

  // 给函数中增加一个属性，第一次初始化，增加 $api
  install.installed = true;
  Object.defineProperties(Vue.prototype, {
    // 注意，此处挂载在 Vue 原型的 $api 对象上
    $api: {
      get() {
        return api;
      },
    },
  });
};

export default install;
