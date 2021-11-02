/*
 * @Author: fyl
 * @Date: 2020-02-11 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-18 17:34:36
 * 听评课V2.2——历史评课首页
 */

import { requestForListen } from './../../../util/request';
const HISTORYHOMESHOWDATA = 'HISTORYHOMESHOWDATA';//本学期评课任务累计
const HISTORYHOMEDATA = 'HISTORYHOMEDATA';
const init = {
  historyShowData: {},
  historyHomeData: [],
  pageIndex: 1,
  pageSize: 20,//每页条数,
  total: 0,
};

export function fyl_historyData(state = init, action) {
  switch (action.type) {
    case HISTORYHOMESHOWDATA:
      return { ...state, ...action };
    case HISTORYHOMEDATA:
      return { ...state, ...action };
    default:
      return state;
  }
};


/**
 * @description 获取本学期评课任务累计
 * @param  
 */
export function getHistoryHomeShow(semester) {
  return (dispatch, getState) => {
    requestForListen('get/historyHomePageShow', { semester }, res => {
      if (res.result) {
        dispatch({
          type: HISTORYHOMESHOWDATA,
          historyShowData: res.data,
        })
      } else {
        dispatch({
          type: HISTORYHOMESHOWDATA,
          historyShowData: {},
        })
      }
    })
    // const res = {
    //     result: true,
    //     data:
    //     {
    //         overComplete: 1,
    //         overAllNum: 1,
    //         overTask: 1,
    //         evaluateAllNum: 1,
    //     }
    // }
    // if (res.result) {
    //     dispatch({
    //         type: HISTORYHOMESHOWDATA,
    //         historyShowData: res.data,
    //     })
    // } else {
    //     dispatch({
    //         type: HISTORYHOMESHOWDATA,
    //         historyShowData: {},
    //     })
    // }
  }
};

/**
 * @description 任务列表
 * @param  
 */
export function getHistoryHome(page, semester) {

  return (dispatch, getState) => {
    const pageSize = getState().fyl_historyData.pageSize;
    requestForListen('get/historyHomePage', { pageSize, pageIndex: page, semester }, res => {
      if (res.result) {
        dispatch({
          type: HISTORYHOMEDATA,
          historyHomeData: res.data,
          total: res.total,
          pageIndex: page
        })
      } else {
        dispatch({
          type: HISTORYHOMEDATA,
          historyHomeData: [],
          total: 0,
          pageIndex: page
        })
      }
    })
    // const res = {
    //     result: true,
    //     total: 100,
    //     data: [
    //         {
    //             evaluateNum: 1,
    //             taskName: 1,
    //             taskId: 1,
    //             creator: 1,
    //             taskType: 1,
    //             overPlan: 1,
    //         },
    //         {
    //             evaluateNum: 2,
    //             taskName: 1,
    //             taskId: 1,
    //             creator: 1,
    //             taskType: 1,
    //             overPlan: 2,
    //         },
    //     ]
    // }
    // if (res.result) {
    //     dispatch({
    //         type: HISTORYHOMEDATA,
    //         historyHomeData: res.tableData,
    //         total: res.total,
    //     })
    // } else {
    //     dispatch({
    //         type: HISTORYHOMEDATA,
    //         historyHomeData: [],
    //         total: 0,
    //     })
    // }
  }
}

