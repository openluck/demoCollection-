/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-02 10:18:06
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-12 17:02:13
 */

// init url
let initUrl = "http://10.20.5.191:12201/isbm";
// 说明文档地址
let InstructionsUrl = "http://www.baidu.com";
// production url
let productionUrl = "http://10.10.0.232:2003/api/";
// 是否展示自动排课次数抽屉 + 排课方案启用一列是否显示
let showAutoPkNumber = true;
// 是否展示自习排课
let showStudyClass = true;

const g = {
  initUrl: initUrl,
  productionUrl: productionUrl,
  InstructionsUrl: InstructionsUrl,
  showAutoPkNumber: showAutoPkNumber,
  showStudyClass: showStudyClass
};

window.G = g;
