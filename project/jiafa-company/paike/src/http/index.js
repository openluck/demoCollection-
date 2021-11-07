/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-05-27 09:54:45
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-10 18:05:42
 */
// 导入所有接口
import api from './api'

const install = Vue => {
    if (install.installed) { return; }

    install.installed = true;
    Object.defineProperties(Vue.prototype, {
        // 注意，此处挂载在 Vue 原型的 $api 对象上
        $api: {
            get() {
                return api
            }
        }
    })
}

export default install