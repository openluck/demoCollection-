/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-12 10:56:18
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-12 15:32:07
 */
import { Layout, Menu,Icon,spin } from 'ant-design-vue'
import "ant-design-vue/dist/antd"

export default function (Vue) {
  Vue.use(Layout).use(Menu).use(Icon).use(spin)
}