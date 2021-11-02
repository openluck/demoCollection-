/*
 * @Author: junjie.lean 
 * @Date: 2020-04-16 17:27:05 
 * @Last Modified by: mzc
<<<<<<< .mine
 * @Last Modified time: 2021-10-12 09:39:04
||||||| .r50302
 * @Last Modified time: 2021-10-11 16:03:21
=======
 * @Last Modified time: 2021-10-19 13:19:30
>>>>>>> .r50342
 */

import { request } from "./../util/request";
/**
 * 全局数据
 */
const modelConfig = [
  {
    group: "在线巡课",
    path: "zxxk",
    icon: "",
    display: true,
    children: [
      { modelName: "在线巡课", path: "zxxke", icon: "zxxk", display: true },
      {
        modelName: "巡课结果",
        path: "xkjg",
        icon: "xkjg",
        display: true,
        children: [
          { modelName: "课堂查询", path: "ktcx", icon: "", display: true },
          { modelName: "人员查询", path: "rycx", icon: "", display: true },
        ],
      },
      {
        modelName: "巡课设置",
        path: "xksz",
        icon: "sz",
        display: true,
        children: [
          { modelName: "人员安排", path: "ryap", icon: "", display: true },
          { modelName: "事件设置", path: "sjsz", icon: "", display: true },
        ],
      },
    ],
  },
  {
    group: "听评课",
    icon: "",
    path: "tpk",
    display: true,
    children: [
      { modelName: "教研任务", path: "jyrw", icon: "rwgl", display: true },
      {
        modelName: "任务管理",
        path: "rwgl",
        icon: "rwgl",
        display: true,
        children: [
          { modelName: "任务列表", icon: "", path: "rwlb", display: true },
        ],
      },
      {
        modelName: "任务跟踪",
        path: "rwgz",
        icon: "rwgz",
        display: true,
        children: [
          { modelName: "任务进度", icon: "", path: "rwgzgl", display: true },
          { modelName: "任务结果", icon: "", path: "rwjg", display: true },
        ],
      },
      {
        modelName: "在线评课",
        path: "zxpk",
        icon: "zxpk",
        display: true,
        children: [
          { modelName: "我的任务", icon: "", path: "wdrw", display: true },
          { modelName: "历史评课", icon: "", path: "lspk", display: true },
        ],
      },
      {
        modelName: "评课设置",
        path: "pksz",
        icon: "sz",
        display: true,
        children: [
          { modelName: "评议表管理", icon: "", path: "pybgl", display: true },
          { modelName: "职务管理", icon: "", path: "zwgl", display: true },
        ],
      },
    ],
  },
  {
    group: "平安教室",
    path: "pajs",
    icon: "",
    display: true,
    children: [
      {
        modelName: "安全检查",
        path: "aqjc",
        icon: "",
        display: true,
        children: [
          {
            modelName: "自动告警检查",
            path: "zdgjjc",
            icon: "",
            display: true,
          },
          {
            modelName: "人工安全检查",
            path: "rgaqjc",
            icon: "",
            display: true,
          },
        ],
      },
      {
        modelName: "检查结果",
        path: "jcjg",
        icon: "",
        display: true,
        children: [
          { modelName: "结果统计", path: "jgtj", icon: "", display: true },
          { modelName: "检查明细", path: "jcmx", icon: "", display: true },
        ],
      },
      {
        modelName: "安全设置",
        path: "aqsz",
        icon: "",
        display: true,
        children: [
          {
            modelName: "监控教室设置",
            path: "jkjssz",
            icon: "",
            display: true,
          },
          {
            modelName: "监控时段设置",
            path: "jksdsz",
            icon: "",
            display: true,
          },
          {
            modelName: "安全事件设置",
            path: "aqsjsz",
            icon: "",
            display: true,
          },
          { modelName: "人员设置", path: "rysz", icon: "", display: true },
        ],
      },
    ],
  },
  {
    group: "系统设置",
    path: "xtsz",
    icon: "",
    display: true,
    children: [
      {
        modelName: "系统设置",
        path: "xtszhi",
        icon: "",
        display: true,
        children: [
          { modelName: "权限设置", path: "qxsz", icon: "", display: true },
          { modelName: "人员设置", path: "ryszhi", icon: "", display: true },
        ],
      },
    ],
  },
];
const semesters = [
  {
    id: "2019-2020_1",
    name: "2019-2020学年第一学期",
    semesterEndDate: "2020-01-01",
    semesterStartDate: "2019-09-01",
    isNow: 1,
    months: [
      {
        name: "九月",
        id: "19",
        startTime: "2019-09-01",
        endTime: "2019-09-30",
      },
      {
        name: "十月",
        id: "20",
        startTime: "2019-10-01",
        endTime: "2019-10-31",
      },
      {
        name: "十一月",
        id: "1",
        startTime: "2019-11-01",
        endTime: "2019-11-29",
      },
      {
        name: "十二月",
        id: "2",
        startTime: "2019-12-01",
        endTime: "2019-12-30",
      },
      { name: "一月", id: "3", startTime: "2020-01-01", endTime: "2020-01-31" },
    ],
    weeks: [
      {
        name: "第一周",
        id: "a",
        startTime: "2019-09-01",
        endTime: "2019-09-07",
      },
      {
        name: "第2周",
        id: "aa",
        startTime: "2019-09-08",
        endTime: "2019-09-14",
      },
      {
        name: "第3周",
        id: "aaa",
        startTime: "2019-09-15",
        endTime: "2019-09-21",
      },
      {
        name: "第33周",
        id: "3a",
        startTime: "2019-09-22",
        endTime: "2019-09-28",
      },
      {
        name: "第4周",
        id: "4a",
        startTime: "2019-09-29",
        endTime: "2019-10-05",
      },
      {
        name: "第53周",
        id: "a5a",
        startTime: "2019-10-06",
        endTime: "2019-10-12",
      },
    ],
  },
  {
    id: "2019-2020_2",
    name: "2019-2020学年第2学期",
    semesterEndDate: "2020-03-01",
    semesterStartDate: "2019-06-01",
    isNow: 0,
    months: [
      { name: "3月", id: "13" },
      { name: "4月", id: "40" },
      { name: "5月", id: "5" },
      { name: "6月", id: "66" },
    ],
    weeks: [
      { name: "第一周", id: "a" },
      { name: "第2周", id: "aa" },
      { name: "第3周", id: "aaa" },
    ],
  },
];
const builderList = [
  { builder: "校管理员", builderId: "1" },
  { builder: "校管理员1", builderId: "11" },
];
const taskTypeList = [
  { tasktype: "领导评课", taskTypeId: "1" },
  { tasktype: "督导评课", taskTypeId: "2" },
];

export const G = {
  systemname: "课堂生态平台",

  token: "",
  orgCode: "",
  baseinfo: {},
  modelConfig: [],
  semesters: [],
  builderList: [],
  taskTypeList: [],
  serverUrl: "http://10.20.5.210:8087/cloud",
  // serverUrl: 'http://10.10.0.19:8088/cloud',
  // serverUrl: window.location.origin + "/cloud",
};

const getGlobalData = () => {
  console.log(1111);
  Promise.all([
    // 获取创建者
    // request('public/builderList', {}, res => { }),
    // 获取任务类型
    // request('public/taskType', {}, res => { }),
    // 获取系统名称
    request("api/web/project/get_name", {}, (res) => {}),
    // 获取学期数据
    request("public/semester", {}, (res) => {}),
  ]).then((values) => {
    if (values && values.length) {
      values.map((item, index) => {
        switch (index) {
          case 1:
            let ret = item.data;
            let list = [];
            if (ret.result && ret.data && ret.data.length) {
              list = ret.data;
            } else {
              list = [];
            }
            G.semesters = list;
            sessionStorage.setItem("semesters", JSON.stringify(list));
            break;

          // case 0:
          //   let ret1 = item.data;
          //   let list1 = [];
          //   if (ret1.result && ret1.data && ret1.data.length) {
          //     list1 = ret1.data;
          //   } else {
          //     list1 = [];
          //   }
          //   G.builderList = list1;
          //   sessionStorage.setItem('builderList', JSON.stringify(list1));
          //   break;

          // case 1:
          //   let ret2 = item.data;
          //   let list2 = [];
          //   if (ret2.result && ret2.data && ret2.data.length) {
          //     list2 = ret2.data;
          //   } else {
          //     list2 = [];
          //   }
          //   G.taskTypeList = list2;
          //   sessionStorage.setItem('taskTypeList', JSON.stringify(list2));
          //   break;

          case 0:
            let sysRes = item.data,
              sysData = "";
            if (sysRes.result) {
              sysData = sysRes.data;
            } else {
              sysData = "课堂生态平台";
            }
            G.systemname = sysData;
            sessionStorage.setItem("systemname", sysData);
            break;
          default:
            break;
        }
        console.log("getGloableData");
      });
      // sessionStorage.setItem('G', JSON.stringify(G));
    } else {
      message.error("全局信息获取错误，请重新登录", 2, () => {
        window.close();
      });
    }
  });
};

// 同步内存与session全局数据
export const findGlobalData = function () {
  return new Promise((resolve, reject) => {
    // 全局中没有token 并且 没有用户信息
    if (!G.token || !G.orgCode || !Object.keys(G.baseinfo).length) {
      // 重新请求全局数据
      // getGlobalData();

      let global = JSON.parse(sessionStorage.getItem("G"));
      if (
        !Object.keys(global).length ||
        sessionStorage.getItem("token") == null ||
        sessionStorage.getItem("orgCode") == null
      ) {
        console.log("缓存中没有token或者没有orgCode或者没有用户信息");
        reject();
      } else {
        // G = JSON.parse(sessionStorage.getItem("G"));
        // console.log(G);
        G.baseinfo = JSON.parse(sessionStorage.getItem("baseinfo"));
        G.modelConfig = JSON.parse(sessionStorage.getItem("modelConfig"));
        G.token = sessionStorage.getItem("token");
        G.orgCode = sessionStorage.getItem("orgCode");

        // G.builderList = JSON.parse(sessionStorage.getItem("builderList"));
        // G.taskTypeList = JSON.parse(sessionStorage.getItem("taskTypeList"));
        G.semesters = JSON.parse(sessionStorage.getItem("semesters"));
        G.semester = JSON.parse(sessionStorage.getItem("semester"));
        G.currentWeek = sessionStorage.getItem("currentWeek");
        // 重新赋值给全局 g
        window.G = G;

        resolve();
      }
    }
  });
};

window.G = G;
