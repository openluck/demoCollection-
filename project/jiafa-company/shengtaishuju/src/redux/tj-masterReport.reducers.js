/*
 * @Author: tj 
 * @Date: 2021-02-23 14:11:44
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-08 11:18:46
 */
import G from './../config/g';
import moment from "moment";
import { message } from 'antd'
import { request } from "../util/request";
const initState = {
  isLoading: false,
  classrooms: '',
  schoolName: '',
  schoolTime: '',
  courses: '',
  orgList: [],
  globalTea: '',
  globalTeaNormal: '',
  globalTeaNormalPer: '',
  globalTeaUnnormal: '',
  globalTeaUnnormalPer: '',
  globalStu: '',
  globalStuAvg: '',
  stuSet: '',
  globalStuLow: '',
  globalStuLowPer: '',
  globalStuHigh: '',
  globalStuHighPer: '',
  globalFront: '',
  globalFrontAvg: '',
  frontSet: '',
  globalFrontLow: '',
  globalFrontLowPer: '',
  globalFrontHigh: '',
  globalFrontHighPer: '',
  globalSleep: '',
  globalSleepAvg: '',
  sleepSet: '',
  globalSleepLow: '',
  globalSleepLowPer: '',
  globalSleepHigh: '',
  globalSleepHighPer: '',
  detailTea: '',
  teaImageList: {

  },
  detailStuLow: '',
  detailStuHigh: '',
  stuImageList: {

  },
  detailFrontLow: '',
  detailFrontHigh: '',
  frontImageList: {

  },
  detailSleepHigh: '',
  detailSleepLow: '',
  sleepImageList: {

  },
  attDeal: '',
  attDealNormal: '',
  attDealUnnormal: '',
  attDealImageList: {

  },
  orderDeal: '',
  orderDealNormal: '',
  orderDealUnnormal: '',
  orderDealImageList: {

  },
  detail: [],
  seenMonth: [],
  seenSem:'',
  stuMonData: [], //学生整体情况监测数据统计
  semStuOnRate:'', //学期课堂明细阈值
}
const TJGETDATA = 'TJGETDATA';
export const TJ_masterReport_reducer = (state = initState, action) => {
  switch (action.type) {
    case 'TJGETDATA':
      return {
        ...state,
        ...action.data
      }
    default:
      return {
        ...state
      }
  }
}
export const getMasterInfo = (params) => {
  return dispatch => {
    console.log('校长报告请求参数', params)
    // let data = {
    //     "classrooms": "30",
    //     "courses": "20",
    //     "orgList": [
    //       {
    //         "orgName": "外语学院",
    //         "front": "12",
    //         "arrive": "20",
    //         "attence": "15",
    //         "sleep": "15"
    //       },
    //       {
    //         "orgName": "外语学院2",
    //         "front": "12",
    //         "arrive": "20",
    //         "attence": "15",
    //         "sleep": "15"
    //       },
    //       {
    //         "orgName": "外语学院3",
    //         "front": "12",
    //         "arrive": "20",
    //         "attence": "15",
    //         "sleep": "15"
    //       },
    //       {
    //         "orgName": "外语学院4",
    //         "front": "12",
    //         "arrive": "20",
    //         "attence": "15",
    //         "sleep": "15"
    //       }
    //     ], 
    //     "globalTea": "22",
    //     "schoolTime": "2020-10",
    //     "schoolName": "四川大学",
    //     "globalTeaNormalPer": "80",
    //     "globalTeaNormal": "22",
    //     "globalTeaUnnormalPer": "40",
    //     "globalTeaUnnormal": "20",
    //     "globalStu": "12",
    //     "globalStuLow": "20",
    //     "stuSet": "70",
    //     "globalStuAvg": "20",
    //     "globalStuLowPer": "20",
    //     "globalStuHighPer": "20",
    //     "globalStuHigh": "20",
    //     "globalFront": "20",
    //     "detailTea": "20",
    //     "globalSleepHighPer": "20",
    //     "globalSleepHigh": "20",
    //     "globalSleepLowPer": "20",
    //     "globalSleepLow": "20",
    //     "sleepSet": "20",
    //     "globalSleepAvg": "50",
    //     "globalSleep": "50",
    //     "globalFrontHighPer": "50",
    //     "globalFrontHigh": "50",
    //     "globalFrontLowPer": "80",
    //     "globalFrontLow": "50",
    //     "frontSet": "42",
    //     "globalFrontAvg": "50",
    //     "stuImageList": {
    //       "orgList": [
    //         "中医学院",
    //         "外语学校",
    //         "大学校",
    //         "电子科技",
    //       ],
    //       "dataList": [
    //         {
    //           "value": "12",
    //           "color": "rgb(43,193,123)"
    //         },
    //         {
    //           "value": "20",
    //           "color": "rgb(255,153,51)"
    //         },
    //         {
    //           "value": "20",
    //           "color": "rgb(255,153,51)"
    //         },
    //         {
    //           "value": "66",
    //           "color": "rgb(255,76,76)"
    //         }
    //       ]
    //     },
    //     "detailStuHigh": "40",
    //     "detailStuLow": "50",
    //     "teaImageList": {
    //       "orgList": [],
    //       "dataList": []
    //     },
    //     "detailFrontHigh": "80",
    //     "detailFrontLow": "50",
    //     "frontImageList": {
    //       "orgList": [],
    //       "dataList": []
    //     },
    //     "sleepImageList": {
    //       "orgList": [],
    //       "dataList": []
    //     },
    //     "detailSleepLow": "40",
    //     "detailSleepHigh": "22",
    //     "attDealNormal": "22",
    //     "attDeal": "22",
    //     "attDealUnnormal": "22",
    //     "attDealImageList": {
    //         "orgList": [],
    //         "dataList": []
    //     },
    //     "orderDealNormal": "22",
    //     "orderDeal": "22",
    //     "detail": [
    //       {
    //         "place": "德育楼3-1",
    //         "teacher": "小红",
    //         "orderNum": "154",
    //         "lessonNum": "230",
    //         "subject": "语文",
    //         "orgName": "传学院",
    //         "stu": "70",
    //         "time": "2020-10-10",
    //         "sleep": "20",
    //         "front": "50",
    //         "image": "",
    //         "tea": "50",
    //         teaType:'0',
    //         "stuType": "1",
    //         "frontType": "0",
    //         "sleepType": "0"
    //       },
    //       {
    //         "place": "德育楼3-2",
    //         "teacher": "小红",
    //         "orderNum": "154",
    //         "lessonNum": "230",
    //         "subject": "语文",
    //         "orgName": "传学院",
    //         "stu": "70",
    //         "time": "2020-10-10",
    //         "sleep": "20",
    //         "front": "50",
    //         "image": "",
    //         "tea": "50",
    //         teaType:'0',
    //         "stuType": "0",
    //         "frontType": "0",
    //         "sleepType": "0"
    //       }
    //     ],
    //     "orderDealImageList": {
    //       "orgList": [
    //         "中医学院",
    //         "外语学校",
    //         "大学校",
    //         "电子科技",
    //         "电子科技1",
    //         "电子科技2",
    //         "电子科3",
    //         "电子科技4学校学下学校",
    //       ],
    //       "dataList": [
    //         {
    //           "value": "12",
    //           "color": "rgb(43,193,123)"
    //         },
    //         {
    //           "value": "20",
    //           "color": "rgb(255,153,51)"
    //         },
    //         {
    //           "value": "20",
    //           "color": "rgb(255,153,51)"
    //         },
    //         {
    //           "value": "60",
    //           "color": "rgb(255,76,76)"
    //         },
    //         {
    //           "value": "60",
    //           "color": "rgb(255,76,76)"
    //         },
    //         {
    //           "value": "60",
    //           "color": "rgb(255,76,76)"
    //         },
    //         {
    //           "value": "80",
    //           "color": "rgb(255,76,76)"
    //         },
    //         {
    //           "value": "92",
    //           "color": "rgb(255,76,76)"
    //         }
    //       ]
    //     },
    //     "orderDealUnnormal": "1",
    //     detailStuSet:'20'
    // }
    // let stuMonData=[{
    //     id:'1',
    //     globalTeaNormalPer:data.globalTeaNormalPer,
    //     globalTeaNormal:data.globalTeaNormal,
    //     globalTeaUnnormal:data.globalTeaUnnormal,
    //     globalTeaUnnormalPer:data.globalTeaUnnormalPer,
    //     globalStuAvg:data.globalStuAvg,
    //     globalStuLow:data.globalStuLow,
    //     globalStuLowPer:data.globalStuLowPer,
    //     globalStuHigh:data.globalStuHigh,
    //     globalStuHighPer:data.globalStuHighPer,
    //     globalFront:data.globalFront,
    //     globalFrontLow:data.globalFrontLow,
    //     globalFrontLowPer:data.globalFrontLowPer,
    //     globalSleepAvg:data.globalSleepAvg,
    //     globalSleepLow:data.globalSleepLow,
    //     globalSleepLowPer:data.globalSleepLowPer
    // }]
    // dispatch({
    //     type: TJGETDATA,
    //     data: {
    //         ...data,stuMonData
    //     }
    // })
    // return;
    dispatch({
      type: TJGETDATA,
      data: {
        isLoading: true
      }
    })
    if(params.selType=='2'&&!params.selTime){
      dispatch({
        type: TJGETDATA,
        data: {
          isLoading: false,
          schoolName:''
        }
      })
      return;
    }
    request('/api/report/masterReport/getColMonInfo', params, (res) => {
      if (res.result) {
        let data = res.data;
        let stuMonData = [{
          id: '1',
          globalTeaNormalPer: data.globalTeaNormalPer,
          globalTeaNormal: data.globalTeaNormal,
          globalTeaUnnormal: data.globalTeaUnnormal,
          globalTeaUnnormalPer: data.globalTeaUnnormalPer,
          globalStuAvg: data.globalStuAvg,
          globalStuLow: data.globalStuLow,
          globalStuLowPer: data.globalStuLowPer,
          globalStuHigh: data.globalStuHigh,
          globalStuHighPer: data.globalStuHighPer,
          globalFront: data.globalFront,
          globalFrontLow: data.globalFrontLow,
          globalFrontLowPer: data.globalFrontLowPer,
          globalSleepAvg: data.globalSleepAvg,
          globalSleepHigh: data.globalSleepHigh,
          globalSleepHighPer: data.globalSleepHighPer
        }]

        dispatch({
          type: TJGETDATA,
          data: {
            ...data, stuMonData,isLoading:false
          }
        })
      } else {
        dispatch({
          type: TJGETDATA,
          data: {
            isLoading: false
          }
        })
        message.warning(res.message)
      }
    },error=>{
      dispatch({
        type: TJGETDATA,
        data: {
          isLoading: false
        }
      })
    })

  }
}

export const getMasterSeenMonth = (params) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      console.log('月份请求参数', params)
      // let data = {
      //   months:[
      //     1609430400000,
      //     1601481600000
      // ],
      // semTime:1609430400000
      // }
      // dispatch({
      //     type: TJGETDATA,
      //     data: {
      //       seenMonth: data.months,
      //       seenSem:data.semTime
      //     }
      // })
      // resolve(data)
      // return;
      dispatch({
        type: TJGETDATA,
        data: {
          isLoading: true
        }
      })
      request('/api/report/masterReport/getSeenMonth', params, (res) => {
        if (res.result) {
          let {months,semTime,semStuOnRate} = res.data;
          dispatch({
            type: TJGETDATA,
            data: {
              seenMonth: months,
              seenSem:semTime,
              semStuOnRate,
              isLoading: false
            }
          })
          resolve(res.data)
        }
      }, error => {
        dispatch({
          type: TJGETDATA,
          data: {
            isLoading: false
          }
        })
        reject(error)
      })
    })


  }
}

