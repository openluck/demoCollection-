/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-09-28 14:26:08
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-13 14:19:57
 */
/*
 * @Descripttion:
 * @version:
 * @Author: YanQY
 * @Date: 2021-03-18 13:42:46
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-11 09:53:21
 */

// 课程总览地址
let pandect = {
  // 选课统计 服务器地址
  url: "http://10.4.3.51:8089/share2.html",
  shareToken:
    "shareToken=eNoNzrcBAzEMBLCVGPQM5THtP5Ldo8A3BQ-wr5ZqPlA2vIyS95t9mWp3Sdd4NGxpGi-2ySxENIavvbnKHzhifUTIBa7m8EbIxcjT1EU15oyZUHYbNVebSRCESvi6O6XO6LBI7ucLvRVtunt_qibo_v5Ta_mEeuR-fJYr5w#share/dashboard",
};

// 课程明细地址
let particulars = {
  url: "http://10.4.3.51:8089/share2.html",
  shareToken:
    "shareToken=eNoNyrkNAEEIA8CWwN6HDXn7L-kuHGnGLaPUzNmQmyRqTdy3wyts99B4I2Sdk0-3Yinhy6Soq7UmM3SmYABLzlErkNdlwfgM83vxsT3Sa46qeJxpi5ro98ThRtjte688VrEUeL1vO6fBlJn1Vx545m7GSWxIFuYDcvcrwQ#share/dashboard",
};

// 课程组合地址
let group = {
  url: "http://10.4.3.51:8089/share2.html",
  shareToken:
    "shareToken=eNoNzEcBwEAIADBLjGM9mf4ltREQIMHrmFqnFLLOBMhp3xNGhT12tip4qh0oSA-Z8jkM41v0MSZUvn21vGhbYJMN47Ga4nQ-9Dh4szrnFBGy9NZrrjYCktKZ3NbMIHiGB4lixTb_l7jh7t-DlbJblkubhKCH7gNszCvW#share/dashboard",
};

// 新增未选人员
let oldChoosePeople = {
  url: "http://10.20.5.125:8089/share2.html",
  shareToken:
   "shareToken=eNoNyskNwDAIBMCWMBgDT5aj_5KS50ijz06Rk9kg2S5e1g6OFLClNJ7vukeAdM_YmpCQhiHs3EyALpy2lxVyxqPk6o9lD592Xm--EjKJyt53DiXejqMXE0HJ6cJuY2YU0i19mGPUJmWHpWj3_lUeZ5WO4BUrUzXvB5HMLBY#/share/dashboard",
};

// init url 调基础平台接口拿取人员类型
// let initUrl = 'http://10.4.3.30:12201/isbm'
let initUrl = "http://10.20.5.191:12201/isbm";

// 生产环境请求地址
let productionRequestUrl = null;

window.g = {
  pandect,
  particulars,
  group,
  initUrl,
  productionRequestUrl,
  oldChoosePeople,
};
