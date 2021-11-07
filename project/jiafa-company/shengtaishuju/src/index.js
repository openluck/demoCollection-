/*
 * @Author: junjie.lean
 * @Date: 2019-08-27 11:18:15
 * @Last Modified by: lxx
 * @Last Modified time: 2020-01-22 14:22:11
 */

/**
 * @description 入口文件
 * @writable  false
 */
import "core-js/shim"; 
// import '@babel/polyfill';
import React from "react";
import ReactDOM from "react-dom";
import APP from "./view/public/provider";
import lang from "./lang/zh_CN";
import svgContent from "!!raw-loader!./media/svg/symbol-defs.svg";
// console.log(lang.systeam)
// document.querySelector("head>title").innerHTML = lang.systeam.systemTitle;
document.querySelector("body").innerHTML += svgContent;
ReactDOM.render(<APP />, document.getElementById("root"));
