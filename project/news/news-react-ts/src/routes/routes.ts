/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-11-18 14:57:35
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-18 15:51:30
 */

import Home from "@/pages/home";
/**
 * path 跳转的路径
 * component 对应路径显示的组件
 * exact 匹配规则，true的时候则精确匹配。
 */
const menu = [
  {
    path: "/",
    name: "首页",
    exact: true,
    key: "home",
  },
];

export default menu;
