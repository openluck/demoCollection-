
/*
* @Author: fyl 
* @Date: 2020-01-21 16:05:41 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-18 16:19:09
*/

import { requestForListen} from './../../../util/request';
const DETAILS = 'DETAILS_RESULT';
const DETAILSTABLE = 'DETAILSTABLE_RESULT';
const init = {
  detailsList: {}, //评课详情数据
  recordList: [], //评课记录数据
  pageIndex: 1,
  pageSize: 20,//每页条数
  total: 0,//总条数
};


export function fyl_resultReducer(state = init, action) {
  switch (action.type) {
    case DETAILS:
      return { ...state, ...action };
    case DETAILSTABLE:
      return { ...state, ...action };
    default:
      return state;
  }
};


/**
 * @description 获取评课详情
 * @param  evaClassId 评课id
 */
export function getdetaData(evaClassId, jobId, type) {
  return (dispatch, getState) => {
    requestForListen('get/resultDetailsShow', { evaClassId, jobId, type }, res => {
      if (res.result) {
        dispatch({
          type: DETAILS,
          detailsList: res.data,
        })
      } else {
        dispatch({
          type: DETAILS,
          detailsList: {},
        })
      }
    })
    //  const res = {
    //     result: true,
    //     data: {
    //         listen:'1',
    //         duty: '1',
    //         task: '1',
    //         mixDegree: '1',
    //         assignDegree: '1',
    //     }
    // }
    // if (res.result) {
    //     dispatch({
    //         type: DETAILS,
    //         detailsList: res.data,
    //     })
    // } else {
    //     dispatch({
    //         type: DETAILS,
    //         detailsList: {},
    //     })
    // }
  }
}

/**
  * @description 获取评课记录
  * @param  evaClassId 评课id
  */

export function getRecordData(evaClassId, jobId, pageIndex, type) {
  return (dispatch, getState) => {
    const { pageSize } = getState().fyl_resultReducer;
    requestForListen('get/resultDetails', { evaClassId, jobId, pageSize, pageIndex, type }, res => {
      if (res.result && res.data) {
        console.log(res.data);
        
        dispatch({
          type: DETAILSTABLE,
          recordList: res.data,
          total: res.total,
          pageIndex: pageIndex
        })
      } else {
        dispatch({
          type: DETAILSTABLE,
          recordList: [],
          pageIndex: pageIndex
        })
      }
    })
    // const res = {
    //     result: true,
    //     total: 100,
    //     data: [
    //         {
    //         evaluateNum: '1232347679345234523452345',
    //         schoolName: 'jasldf卡就是了单身到发哪里撒开的房间吧vzcxjkh',
    //         studyName: 1,
    //         studyType: 1,
    //         teacher: 1,
    //         classNum: 1,
    //         evaluateTime: 1,
    //         evaluateAll: 1,
    //     },
    //     {
    //         evaluateNum: 2,
    //         schoolName: 1,
    //         studyName: 1,
    //         studyType: 1,
    //         teacher: 1,
    //         classNum: 1,
    //         evaluateTime: 1,
    //         evaluateAll: 1,
    //     },
    // ]
    // }
    // if (res.result) {
    //     dispatch({
    //         type: DETAILSTABLE,
    //         recordList: res.data,
    //         total: res.total,
    //         pageIndex: pageIndex
    //     })
    // } else {
    //     dispatch({
    //         type: DETAILSTABLE,
    //         recordList: [],
    //         pageIndex: pageIndex
    //     })
    // }
  }
}