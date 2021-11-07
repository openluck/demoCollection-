/*
 * @Author: JC.Liu 
 * @Date: 2019-02-22 17:18:45 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-16 09:40:48
 * 菜单配置
 */
import _ from "lodash"

export default function Menu(funcArr) {
  let home = [
    {
      group: "在线巡课", icon: "", path: "zxxk", display: findData("600105", funcArr),
      children: [
        { modelName: "在线巡课", path: "zxxke", icon: "", display: findData("60010501", funcArr), children: [] },
        {
          modelName: "巡课结果", path: "xkjg", icon: "", display: findData("60010502", funcArr),
          children: [
            { modelName: "课堂查询", icon: "", path: "ktcx", display: findData("6001050201", funcArr) },
            { modelName: "人员查询", icon: "", path: "rycx", display: findData("6001050202", funcArr) }
          ]
        },
        {
          modelName: "巡课设置", path: "xksz", icon: "", display: findData("60010503", funcArr),
          children: [
            { modelName: "人员安排", icon: "", path: "ryap", display: findData("6001050301", funcArr) },
            { modelName: "事件设置", icon: "", path: "sjsz", display: findData("6001050302", funcArr) }
          ]
        }
      ]
    },
    {
      group: "听评课", icon: "", path: "tpk", display: findData("600103", funcArr),
      children: [
        { modelName: "教研任务", path: "jyrw", icon: "", display: findData("60010301", funcArr), children: [] },
        {
          modelName: "教研设置", path: "jysz", icon: "", display: findData("60010302", funcArr), children: [
            { modelName: "教研计划管理", icon: "", path: "jyjhgl", display: findData("6001030201", funcArr) },
            { modelName: "教研组管理", icon: "", path: "jyzgl", display: findData("6001030202", funcArr) },
            { modelName: "教研评价管理", icon: "", path: "jypjgl", display: findData("6001030203", funcArr) },
          ]
        },
        { modelName: "随堂听任务", path: "sttrw", icon: "", display: findData("60010303", funcArr), children: [] },
        {
          modelName: "随堂听设置", path: "sttsz", icon: "", display: findData("60010304", funcArr), children: [
            { modelName: "听课员任务指标设置", icon: "", path: "tkyrwzbsz", display: findData("6001030401", funcArr) },
            { modelName: "授课员权限审批设置", icon: "", path: "skyspqxsz", display: findData("6001030402", funcArr) },
          ]
        },
        { modelName: "我的任务", path: "wdrw", icon: "", display: findData("60010305", funcArr), children: [] },
        { modelName: "我的教研课", path: "wdjyk", icon: "", display: findData("60010306", funcArr), children: [] },
        { modelName: "我的随堂听", path: "wdsst", icon: "", display: findData("60010307", funcArr), children: [] },

        // {
        //   modelName: "任务管理", path: "rwgl", icon: "", display: findData("60010801", funcArr),
        //   children: [
        //     { modelName: "任务列表", icon: "", path: "rwlb", display: findData("6001080101", funcArr) }
        //   ]
        // },
        // {
        //   modelName: "任务跟踪", path: "rwgz", icon: "", display: findData("60010802", funcArr),
        //   children: [
        //     { modelName: "任务进度", icon: "", path: "rwgzgl", display: findData("6001080201", funcArr) },
        //     { modelName: "任务结果", icon: "", path: "rwjg", display: findData("6001080202", funcArr) }
        //   ]
        // },
        // {
        //   modelName: "评课设置", path: "pksz", icon: "", display: findData("60010803", funcArr),
        //   children: [
        //     { modelName: "评议表管理", icon: "", path: "pybgl", display: findData("6001080301", funcArr) },
        //     { modelName: "职务管理", icon: "", path: "zwgl", display: findData("6001080302", funcArr) },
        //   ]
        // },
        // {
        //   modelName: "在线评课", path: "zxpk", icon: "", display: findData("60010804", funcArr),
        //   children: [
        //     { modelName: "我的任务", icon: "", path: "wdrw", display: findData("6001080401", funcArr) },
        //     { modelName: "历史评课", icon: "", path: "lspk", display: findData("6001080402", funcArr) }
        //   ]
        // }
      ]
    },
    { group: "教学反思", icon: "", path: "jxfs", display: findData("600104", funcArr), },
    {
      group: "平安教室", icon: "", path: "pajs", display: findData("600106", funcArr),
      children: [
        {
          modelName: "安全检查", path: "aqjc", icon: "", display: findData("60010601", funcArr),
          children: [
            { modelName: "自动告警检查", icon: "", path: "zdgjjc", display: findData("6001060101", funcArr) },
            { modelName: "人工安全检查", icon: "", path: "rgaqjc", display: findData("6001060102", funcArr) },
          ]
        },
        {
          modelName: "检查结果", path: "jcjg", icon: "", display: findData("60010602", funcArr),
          children: [
            { modelName: "结果统计", icon: "", path: "jgtj", display: findData("6001060201", funcArr) },
            { modelName: "检查明细", icon: "", path: "jcmx", display: findData("6001060202", funcArr) }
          ]
        },
        {
          modelName: "安全设置", path: "aqsz", icon: "", display: findData("60010603", funcArr),
          children: [
            { modelName: "监控教室设置", icon: "", path: "jkjssz", display: findData("6001060301", funcArr) },
            { modelName: "监控时段设置", icon: "", path: "jksdsz", display: findData("6001060302", funcArr) },
            { modelName: "安全事件设置", icon: "", path: "aqsjsz", display: findData("6001060303", funcArr) },
            { modelName: "人员设置", icon: "", path: "rysz", display: findData("6001060304", funcArr) },
          ]
        }
      ]
    },
    {
      group: "系统设置", icon: "", path: "xtsz", display: findData("600107", funcArr),
      children: [
        {
          modelName: "权限设置", path: "xtszhi", icon: "", display: findData("60010701", funcArr),
          children: [
            { modelName: "权限角色", icon: "", path: "qxsz", display: findData("6001070101", funcArr) },
            { modelName: "人员角色", icon: "", path: "ryszhi", display: findData("6001070102", funcArr) }
          ]
        },
        {
          modelName: "系统设置", path: "gnszhi", icon: "sz", display: findData("60010702", funcArr),
          children: [
            { modelName: "功能设置", icon: "", path: "gnsz", display: findData("6001070201", funcArr) },
          ]
        }
      ]
    }
  ];
  return home
}


const findData = (funcId, funcArr) => {
  let t = _.find(funcArr, { functionId: funcId })
  if (t && Object.keys(t).length) {
    return true
  }
  return false
}