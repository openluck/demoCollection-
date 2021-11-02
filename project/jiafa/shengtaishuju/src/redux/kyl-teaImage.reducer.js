/*
 * @Author: kyl 
 * @Date: 2020-02-18 13:44:46 
 * @Last Modified by: yrj
 * @Last Modified time: 2020-07-24 13:50:30
 * 教师画像
 */

import { getConfigData } from '../config/actionConfig';
import { request } from '../util/request';
import { message } from 'antd';

const initState = {
  kthd_info: {

  },       //课堂互动基本信息
  kthd_anl: {
    xData: [],
    yData: []
  },       //课堂互动对比分析
  kthd_line: {
    xData: [],
    data: []
  },       //课堂互动趋势
  jsxw_pie: [],  //教学分析饼图
  jxsj_pie: [],  //教学设计饼图
  ktlx_pie: [],  //课堂类型饼图

  jsxw_line: {
    legend: [],
    xData: [],
    yData: []
  },  //教师行为线图
  jxsj_line: {
    legend: [],
    xData: [],
    yData: []
  },  //教学设计线图
  ktlx_line: {
    legend: [],
    xData: [],
    yData: []
  },  //课堂类型线图

  xsxw_pie: [],  //学生行为饼图
  xsbq_pie: [],   //学生表情
  zhqk_pie: {
    data: [], legend: []
  },    //综合情况雷达图

  xsxw_line: {
    legend: [],
    xData: [],
    yData: []
  },              //学生行为线图
  xsbq_line: {
    legend: [],
    xData: [],
    yData: []
  },             //学生表情线图
  zhqk_line: {
    legend: [],
    xData: [],
    yData: []
  },             //综合情况线图
  loading: [
    false, false, false, false, false, false,     //教学分析  
    false, false, false, false, false, false,     //学生听讲反馈  
    false, false, false,                          //课堂互动
  ]    //loading
}

const KYL_KTHD_INFO = 'KYL_KTHD_INFO';
const KYL_KTHD_ANL = 'KYL_KTHD_ANL';
const KYL_KTHD_LINE = 'KYL_KTHD_LINE';
const KYL_JSXW_PIE = 'KYL_JSXW_PIE';
const KYL_JXSJ_PIE = 'KYL_JXSJ_PIE';
const KYL_KTLX_PIE = 'KYL_KTLX_PIE';
const KYL_JSXW_LINE = 'KYL_JSXW_LINE';
const KYL_JXSJ_LINE = 'KYL_JXSJ_LINE';
const KYL_KTLX_LINE = 'KYL_KTLX_LINE';
const KYL_XSXW_PIE = 'KYL_XSXW_PIE';
const KYL_XSBQ_PIE = 'KYL_XSBQ_PIE';
const KYL_ZHQK_PIE = 'KYL_ZHQK_PIE';
const KYL_XSXW_LINE = 'KYL_XSXW_LINE';
const KYL_XSBQ_LINE = 'KYL_XSBQ_LINE';
const KYL_ZHQK_LINE = 'KYL_ZHQK_LINE';

const KYL_INIT_STATE = 'KYL_INIT_STATE';
const KYL_CLEAN_KTHD_LINE = 'KYL_CLEAN_KTHD_LINE';
const KYL_SET_LOADING = 'KYL_SET_LOADING';

export const kyl_teaImage_reducer = (state = initState, action) => {
  switch (action.type) {
    case KYL_KTHD_INFO:
      return {
        ...state,
        kthd_info: action.data
      }
    case KYL_KTHD_ANL:
      return {
        ...state,
        kthd_anl: action.data
      }
    case KYL_KTHD_LINE:
      return {
        ...state,
        kthd_line: action.data
      }

    case KYL_JSXW_PIE:
      return {
        ...state,
        jsxw_pie: action.data
      }
    case KYL_JXSJ_PIE:
      return {
        ...state,
        jxsj_pie: action.data
      }
    case KYL_KTLX_PIE:
      return {
        ...state,
        ktlx_pie: action.data
      }

    case KYL_JSXW_LINE:
      return {
        ...state,
        jsxw_line: action.data
      }
    case KYL_JXSJ_LINE:
      return {
        ...state,
        jxsj_line: action.data
      }
    case KYL_KTLX_LINE:
      return {
        ...state,
        ktlx_line: action.data
      }

    case KYL_XSXW_PIE:
      return {
        ...state,
        xsxw_pie: action.data
      }
    case KYL_XSBQ_PIE:
      return {
        ...state,
        xsbq_pie: action.data
      }
    case KYL_ZHQK_PIE:
      return {
        ...state,
        zhqk_pie: action.data
      }

    case KYL_XSXW_LINE:
      return {
        ...state,
        xsxw_line: action.data
      }
    case KYL_XSBQ_LINE:
      return {
        ...state,
        xsbq_line: action.data
      }
    case KYL_ZHQK_LINE:
      return {
        ...state,
        zhqk_line: action.data
      }

    case KYL_INIT_STATE:
      return {
        ...state,
        ...action.data
      }
    case KYL_CLEAN_KTHD_LINE:
      return {
        ...state,
        kthd_line: action.data
      }
    case KYL_SET_LOADING:
      return {
        ...state,
        loading: action.data
      }
    default:
      return {
        ...state
      }
  }
}

// 获取数据
//params   Object 公共参数
//sortType Object 其他参数
export function kyl_get_data(par, sortType) {
  // let params = {
  //   ...par
  // }
  let params = {
    "semesterId": "2019_2020_2",
    "collegeId": "",
    "teacherId": "3f0529defcf9712a5bc8b3869b47ba7c",
    "timeType": "1",
    "selTime": "2020-02-24",
    // "sortType": "0",
    // "checkType": "1",
    // "checkClassId": "",
    "couTypeId": 0
  }
  // console.log(params)
  return (dispath, getState) => {
    //课堂互动
    // dispath(kyl_get_kthdInfo(params));
    // dispath(kyl_get_kthdAnl(params, sortType.kthdSort, sortType.kthdAnlTab));
    // dispath(kyl_getKthdLine_data(params, sortType.kthdLineTab));

    // //教学分析饼图
    // dispath(kyl_get_teaActPie(params));
    // dispath(kyl_get_teaDisPie(params));
    // dispath(kyl_get_classTypePie(params));

    // //教学分析线图
    // dispath(kyl_get_teaActLine(params));
    // dispath(kyl_get_teaDisLine(params));
    // dispath(kyl_get_classTypeLine(params));

    // //学生听讲反馈饼图
    // dispath(kyl_get_stuActPie(params));
    // dispath(kyl_get_stuBqPie(params));
    // dispath(kyl_get_allCondPie(params));

    // //学生听讲反馈线图
    // dispath(kyl_get_stuActLine(params));
    // dispath(kyl_get_xsbqLine(params));
    // dispath(kyl_get_allCondLine(params));


  }
}


//获取课堂互动基本信息
export function kyl_get_kthdInfo(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 12))
    request('/api/image/getTeacherActive', params, (res) => {
      if (res.result && res.data) {
        dispath({
          type: KYL_KTHD_INFO,
          data: res.data
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_KTHD_INFO,
          data: {}
        })
      }
      dispath(kyl_loading(false, 12))
    }, () => {
      dispath({
        type: KYL_KTHD_INFO,
        data: {}
      })
      dispath(kyl_loading(false, 12))
    })
  }
}

//获取课堂互动对比分析数据
//params  Object  公共入参
//sortType Object其他参数
//checkType String  1起立/2上下台   
export function kyl_get_kthdAnl(params, sortType, checkType) {
  return dispath => {
    let param = {
      ...params,
      sortType:String(sortType),
      checkType
    }
    dispath(kyl_loading(true, 13))
    request('/api/image/getTeacherActiveAna', param, (res) => {
      if (res.result && res.data) {
        let xData = [], yData = [];
        res.data.map((it, idx) => {
          xData.push(it.teaClaName);
          yData.push(it.rate);
        })
        dispath({
          type: KYL_KTHD_ANL,
          data: { xData, yData, oData: res.data }
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_KTHD_ANL,
          data: { xData: [], yData: [], oData: [] }
        })
        dispath({
          type: KYL_KTHD_ANL,
          data: { xData, yData, oData: res.data }
        })
      }
      dispath(kyl_loading(false, 13))
    }, () => {
      dispath(kyl_loading(false, 13))
    })
  }
}

//获取课堂互动趋势数据  
//params 共有入参  
//checkType 起立/上下台   
//checkClassId  学院id  
//type 第几条数据
export function kyl_getKthdLine_data(params, checkType, checkClassId, type) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 14))
    if (!checkClassId) {
      //如果不存在班级id，则清空数据
      dispath(kyl_clean_kthd_line())
    }
    let param = {
      ...params,
      checkType,
      checkClassId: checkClassId || '',     //全部为''
    }
    request('/api/image/getTeacherTrend', param, (res) => {
      if (res.result && res.data) {
        let xData = [], list = [], data = [];
        res.data.lineList.map((it, idx) => {
          xData.push(it.name)
          list.push(it.prop)
        })
        // console.log(getState().kyl_teaImage_reducer.dkl_line.data)
        let hasEData = getState().kyl_teaImage_reducer.kthd_line.data
        let lastLine=getState().kyl_teaImage_reducer.kthd_line
        let dklData = {
          xData:xData,//以全校的x为准
          data: [
            ...hasEData
          ]
        }
        if (type) {
          dklData.xData=lastLine.xData;
          let newlist=new Array(lastLine.xData.length).fill('--');
          if(xData.length && lastLine.xData && lastLine.xData.length){
            xData.map((v,k)=>{
              lastLine.xData.map((inV,inK)=>{
                if(v===inV){
                  newlist[inK]=list[k]
                }
              })
            })
          }
          dklData.data.splice(type, 1, {
            name: res.data.name,
            list: newlist,
            colId: res.data.id
          })
         
          // console.log(newlist,"list[k]")
        } else {
          console.log("切换到教师上下讲台")
          console.log(dklData,list,'看看我')
          dklData.data.push({
            name: res.data.name,
            list: list,
            colId: res.data.id
          })
        }
        dispath({
          type: KYL_KTHD_LINE,
          data: dklData
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_KTHD_LINE,
          data: { xData: [], data: [] }
        })
      }
      dispath(kyl_loading(false, 14))
    }, () => {
      dispath({
        type: KYL_KTHD_LINE,
        data: { xData: [], data: [] }
      })
      dispath(kyl_loading(false, 14))
    })
  }
}

//获取教学分析教师行为饼图数据
export function kyl_get_teaActPie(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 0))
    request('/api/image/getTeacherBehPie', params, (res) => {
      if (res.result && res.data) {
        let data = [
          {
            name: "板书",
            prop: res.data.boardWrite || 0,
          },
          {
            name: "巡视",
            prop: res.data.patrol || 0,
          },
          {
            name: "多媒体",
            prop: res.data.media || 0,
          }
        ]
        dispath({
          type: KYL_JSXW_PIE,
          data
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_JSXW_PIE,
          data: []
        })
      }
      dispath(kyl_loading(false, 0))
    }, () => {
      dispath({
        type: KYL_JSXW_PIE,
        data: []
      })
      dispath(kyl_loading(false, 0))
    })
  }
}

//获取教学分析教学设计饼图数据
export function kyl_get_teaDisPie(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 1))
    request('/api/image/getTeacherDesPie', params, (res) => {
      if (res.result && res.data) {
        let data = [
          {
            name: "学生自习",
            prop: res.data.stuLearn || 0,
          },
          {
            name: "生生互动",
            prop: res.data.stuInteract || 0,
          },
          {
            name: "师生互动",
            prop: res.data.tsInteract || 0,
          },
          {
            name: "教师讲授",
            prop: res.data.teaching || 0,
          },
          {
            name: "学生展示",
            prop: res.data.stuShow || 0,
          },
        ]
        dispath({
          type: KYL_JXSJ_PIE,
          data
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_JXSJ_PIE,
          data: []
        })
      }
      dispath(kyl_loading(false, 1))
    }, () => {
      dispath({
        type: KYL_JXSJ_PIE,
        data: []
      })
      dispath(kyl_loading(false, 1))
    })
  }
}


//获取教学分析课堂类型饼图数据
export function kyl_get_classTypePie(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 2))
    request('/api/image/getTeacherTypePie', params, (res) => {
      if (res.result && res.data) {
        let data = [
          {
            name: "讲授型",
            prop: res.data.teachingT || 0,
          },
          {
            name: "对话型",
            prop: res.data.chatT || 0,
          },
          {
            name: "混合型",
            prop: res.data.mixT || 0,
          },
          {
            name: "练习型",
            prop: res.data.exeT || 0,
          }
        ]
        dispath({
          type: KYL_KTLX_PIE,
          data
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_KTLX_PIE,
          data: []
        })
      }
      dispath(kyl_loading(false, 2))
    }, () => {
      dispath({
        type: KYL_KTLX_PIE,
        data: []
      })
      dispath(kyl_loading(false, 2))
    })
  }
}

//获取教学分析教师行为线图数据
export function kyl_get_teaActLine(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 3))
    request('/api/image/getTeacherBehLine', params, (res) => {
      if (res.result && res.data) {
        let data = getConfigData(res.data, 1);
        // console.log('线图数据', data)
        let xData = [], yData = [], legend = [];
        for (let key in data) {
          // console.log(data[key])
          if (data[key].name) {
            xData = data[key].date;
            yData.push(data[key].num);
            legend.push(data[key].name);
          }
        }
        let waveData = {
          xData, yData, legend
        }
        // console.log(waveData)
        dispath({
          type: KYL_JSXW_LINE,
          data: waveData
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_JSXW_LINE,
          data: { legend: [], xData: [], yData: [] }
        })
      }
      dispath(kyl_loading(false, 3))
    }, () => {
      dispath({
        type: KYL_JSXW_LINE,
        data: { legend: [], xData: [], yData: [] }
      })
      dispath(kyl_loading(false, 3))
    })
  }
}

//获取教学分析教学设计线图数据
export function kyl_get_teaDisLine(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 4))
    request('/api/image/getTeacherDesLine', params, (res) => {
      if (res.result && res.data) {
        let data = getConfigData(res.data, 2);
        // console.log('线图数据', data)
        let xData = [], yData = [], legend = [];
        for (let key in data) {
          // console.log(data[key])
          if (data[key].name) {
            xData = data[key].date;
            yData.push(data[key].num);
            legend.push(data[key].name);
          }
        }
        let waveData = {
          xData, yData, legend
        }
        // console.log(waveData)
        dispath({
          type: KYL_JXSJ_LINE,
          data: waveData
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_JXSJ_LINE,
          data: { legend: [], xData: [], yData: [] }
        })
      }
      dispath(kyl_loading(false, 4))
    }, () => {
      dispath(kyl_loading(false, 4))
      dispath({
        type: KYL_JXSJ_LINE,
        data: { legend: [], xData: [], yData: [] }
      })
    })
  }
}


//获取教学分析课堂类型线图数据
export function kyl_get_classTypeLine(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 5))
    request('/api/image/getTeacherTypeLine', params, (res) => {
      if (res.result && res.data) {
        let data = getConfigData(res.data, 3);
        // console.log('线图数据', data)
        let xData = [], yData = [], legend = [];
        for (let key in data) {
          // console.log(data[key])
          if (data[key].name) {
            xData = data[key].date;
            yData.push(data[key].num);
            legend.push(data[key].name);
          }
        }
        let waveData = {
          xData, yData, legend
        }
        // console.log(waveData)
        dispath({
          type: KYL_KTLX_LINE,
          data: waveData
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_KTLX_LINE,
          data: { legend: [], xData: [], yData: [] }
        })
      }
      dispath(kyl_loading(false, 5))
    }, () => {
      dispath({
        type: KYL_KTLX_LINE,
        data: { legend: [], xData: [], yData: [] }
      })
      dispath(kyl_loading(false, 5))
    })
  }
}


//获取教学分析学生行为饼图数据
export function kyl_get_stuActPie(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 6))
    request('/api/image/getTeacherStuBehPie', params, (res) => {
      if (res.result && res.data) {
        let data = [
          {
            name: "阅读",
            prop: res.data.read || 0,
          },
          {
            name: "书写",
            prop: res.data.write || 0,
          },
          {
            name: "听讲",
            prop: res.data.listen || 0,
          },
          {
            name: "举手",
            prop: res.data.handUp || 0,
          },
          {
            name: "起立",
            prop: res.data.standUp || 0,
          },
          {
            name: "玩手机",
            prop: res.data.playPhone || 0,
          },
          {
            name: "趴桌子",
            prop: res.data.onTable || 0,
          },
        ]
        dispath({
          type: KYL_XSXW_PIE,
          data
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_XSXW_PIE,
          data: []
        })
      }
      dispath(kyl_loading(false, 6))
    }, () => {
      dispath({
        type: KYL_XSXW_PIE,
        data: []
      })
      dispath(kyl_loading(false, 6))
    })
  }
}

//获取教学分析学生表情饼图数据
export function kyl_get_stuBqPie(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 7))
    request('/api/image/getTeacherStuFacPie', params, (res) => {
      if (res.result && res.data) {
        let data = [
          {
            name: "高兴",
            prop: res.data.happy || 0,
          },
          {
            name: "害怕",
            prop: res.data.scare || 0,
          },
          {
            name: "中性",
            prop: res.data.neuter || 0,
          },
          {
            name: "惊讶",
            prop: res.data.amzed || 0,
          },
          {
            name: "愤怒",
            prop: res.data.anger || 0,
          },
          {
            name: "难过",
            prop: res.data.sad || 0,
          },
          {
            name: "厌恶",
            prop: res.data.detest || 0,
          },
        ]
        dispath({
          type: KYL_XSBQ_PIE,
          data
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_XSBQ_PIE,
          data: []
        })
      }
      dispath(kyl_loading(false, 7))
    }, () => {
      dispath({
        type: KYL_XSBQ_PIE,
        data: []
      })
      dispath(kyl_loading(false, 7))
    })
  }
}


//获取听讲反馈综合分析雷达图数据
export function kyl_get_allCondPie(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 8))
    request('/api/image/getTeacherStuZhRade', params, (res) => {
      if (res.result && res.data) {
        let legend = [
          { name: '参与度', max: 100 },
          { name: '专注度', max: 100 },
          { name: '活跃度', max: 100 },
          { name: '疑惑度', max: 100 }
        ];
        let data = [res.data.involvement || 0, res.data.concentration || 0, res.data.activation || 0, res.data.distrust || 0]
        dispath({
          type: KYL_ZHQK_PIE,
          data: {
            data, legend
          }
        })
      } else {
        dispath({
          type: KYL_ZHQK_PIE,
          data: {
            data: [], legend: []
          }
        })
      }
      dispath(kyl_loading(false, 8))
    }, () => {
      dispath({
        type: KYL_ZHQK_PIE,
        data: {
          data: [], legend: []
        }
      })
      dispath(kyl_loading(false, 8))
    })
  }
}

//获取听讲反馈学生行为线图数据
export function kyl_get_stuActLine(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 9))
    request('/api/image/getTeacherStuBehLine', params, (res) => {
      if (res.result && res.data) {
        let data = getConfigData(res.data, 4);
        // console.log('线图数据', data)
        let xData = [], yData = [], legend = [];
        for (let key in data) {
          // console.log(data[key])
          if (data[key].name) {
            xData = data[key].date;
            yData.push(data[key].num);
            legend.push(data[key].name);
          }
        }
        let waveData = {
          xData, yData, legend
        }
        // console.log(waveData)
        dispath({
          type: KYL_XSXW_LINE,
          data: waveData
        })
      } else {
        dispath({
          type: KYL_XSXW_LINE,
          data: { legend: [], xData: [], yData: [] }
        })
      }
      dispath(kyl_loading(false, 9))
    }, () => {
      dispath({
        type: KYL_XSXW_LINE,
        data: { legend: [], xData: [], yData: [] }
      })
      dispath(kyl_loading(false, 9))
    })
  }
}

//获取听讲反馈学生表情线图数据
export function kyl_get_xsbqLine(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 10))
    request('/api/image/getTeacherStuFacLine', params, (res) => {
      if (res.result && res.data) {
        let data = getConfigData(res.data, 5);
        // console.log('线图数据', data)
        let xData = [], yData = [], legend = [];
        for (let key in data) {
          // console.log(data[key])
          if (data[key].name) {
            xData = data[key].date;
            yData.push(data[key].num);
            legend.push(data[key].name);
          }
        }
        let waveData = {
          xData, yData, legend
        }
        // console.log(waveData)
        dispath({
          type: KYL_XSBQ_LINE,
          data: waveData
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_XSBQ_LINE,
          data: { legend: [], xData: [], yData: [] }
        })
      }
      dispath(kyl_loading(false, 10))
    }, () => {
      dispath({
        type: KYL_XSBQ_LINE,
        data: { legend: [], xData: [], yData: [] }
      })
      dispath(kyl_loading(false, 10))
    })
  }
}


//获取听讲反馈综合情况线图数据
export function kyl_get_allCondLine(params) {
  return (dispath, getState) => {
    dispath(kyl_loading(true, 11))
    request('/api/image/getTeacherZhLine', params, (res) => {
      if (res.result && res.data) {
        let data = getConfigData(res.data, 6);
        // console.log('线图数据', data)
        let xData = [], yData = [], legend = [];
        for (let key in data) {
          // console.log(data[key])
          if (data[key].name) {
            xData = data[key].date;
            yData.push(data[key].num);
            legend.push(data[key].name);
          }
        }
        let waveData = {
          xData, yData, legend
        }
        // console.log(waveData)
        dispath({
          type: KYL_ZHQK_LINE,
          data: waveData
        })
      } else {
        message.warn(res.message)
        dispath({
          type: KYL_ZHQK_LINE,
          data: { legend: [], xData: [], yData: [] }
        })
      }
      dispath(kyl_loading(false, 11))

    }, () => {
      dispath({
        type: KYL_ZHQK_LINE,
        data: { legend: [], xData: [], yData: [] }
      })
      dispath(kyl_loading(false, 11))
    })
  }
}

//初始化state
export function kyl_initState() {

  return dispath => {
    const initState = {
      kthd_info: {

      },       //课堂互动基本信息
      kthd_anl: {
        xData: [],
        yData: []
      },       //课堂互动对比分析
      kthd_line: {
        xData: [],
        data: []
      },       //课堂互动趋势
      jsxw_pie: [],  //教学分析饼图
      jxsj_pie: [],  //教学设计饼图
      ktlx_pie: [],  //课堂类型饼图

      jsxw_line: {
        legend: [],
        xData: [],
        yData: []
      },  //教学分析线图
      jxsj_line: {
        legend: [],
        xData: [],
        yData: []
      },  //教学设计线图
      ktlx_line: {
        legend: [],
        xData: [],
        yData: []
      },  //课堂类型线图

      xsxw_pie: [],  //学生行为饼图
      xsbq_pie: [],   //学生表情
      zhqk_pie: {
        data: [], legend: []
      },    //综合情况雷达图

      xsxw_line: {
        legend: [],
        xData: [],
        yData: []
      },              //学生行为线图
      xsbq_line: {
        legend: [],
        xData: [],
        yData: []
      },             //学生表情线图
      zhqk_line: {
        legend: [],
        xData: [],
        yData: []
      }             //综合情况线图
    }
    dispath({
      type: KYL_INIT_STATE,
      data: initState
    })
  }
}

//loading
//status Boolean
//index  Number 序号
export function kyl_loading(status, index) {
  return (dispath, getState) => {
    let loadings = getState().kyl_teaImage_reducer.loading
    loadings[index] = status;
    dispath({
      type: KYL_SET_LOADING,
      data: loadings
    })
  }
}

//清空课堂互动趋势
export function kyl_clean_kthd_line() {
  return dispath => {
    dispath({
      type: KYL_CLEAN_KTHD_LINE,
      data: {
        xData: [],
        data: []
      },
    })
  }
}





