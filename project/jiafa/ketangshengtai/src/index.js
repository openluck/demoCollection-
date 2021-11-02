/*
 * @Author: junjie.lean
 * @Date: 2020-01-09 14:17:37
 * @Last Modified by: mzc
 * @Last Modified time: 2021-10-13 09:34:35
 */

import "core-js";
import React from "react";
import { render } from "react-dom";
import App from "./view/public/public-provider";
// import PCP from "./util/plugin-cross-platform";
import svgs from "!!raw-loader!./media/svg/symbol-defs.svg";
import Promise from "babel-polyfill";

// To add to window  解决promise 在ie中未定义的问题
if (!window.Promise) {
  window.Promise = Promise;
}

const DOM = document.getElementById("app");
document.title = "课堂生态平台";
document.querySelector("#svg").innerHTML += svgs;
//要实现局部热更新，必须要添加此句
if (module.hot) {
  module.hot.accept();
}

render(<App />, DOM);

// console.log("hot", module.hot);
//跨项目通讯相关,考务项目需求,非考务项目或非必要需求可以注释!
// PCP();
