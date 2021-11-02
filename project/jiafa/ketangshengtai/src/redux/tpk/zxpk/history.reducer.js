/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-31 10:08:31
 */
import { requestForListen} from './../../../util/request';
const HISTORYDETAILSSHOW = 'HISTORYDETAILSSHOW';//个人评课记录
const HISTORYDETAILS = 'HISTORYDETAILS';//任务列表
const init = {
  tableData: [],//任务列表数据
  showData: {},//个人评课记录数据
  pageSize: 20,//每页条数
  classNumSort: 2,//节次排序 1正序/0倒序
  evaluateTimeSort: 0,//评课时间排序  1正序/0倒序
};

export function fyl_historyDetailsData(state = init, action) {
  switch (action.type) {
    case HISTORYDETAILSSHOW:
      return { ...state, ...action };
    case HISTORYDETAILS:
      return { ...state, ...action };
    default:
      return state;
  }
}

/**
 * @description 获取个人评课记录
 * @param  
 */
export function getHistoryShow(taskId, semester) {
  return (dispatch, getState) => {
    requestForListen('get/historyDetailsShow', { taskId, semester }, res => {
      if (res.result) {
        dispatch({
          type: HISTORYDETAILSSHOW,
          showData: res.data,
        })
      } else {
        dispatch({
          type: HISTORYDETAILSSHOW,
          showData: {},
        })
      }
    })
    // const res = {
    //     result: true,
    //     data: {
    //         duty: 1,
    //         task: 1,
    //         mixDegree: 1,
    //         assignDegree: 1,
    //     }
    // }
    // if (res.result) {
    //     dispatch({
    //         type: HISTORYDETAILSSHOW,
    //         showData: res.data,
    //     })
    // } else {
    //     dispatch({
    //         type: HISTORYDETAILSSHOW,
    //         showData: {},
    //     })
    // }
  }
}

/**
 * @description 获取任务列表
 * @param  
 */

export function getHistoryList(taskId, pageIndex, classNumSort, evaluateTimeSort, semester) {
  return (dispatch, getState) => {
    dispatch({
      type: HISTORYDETAILS,
      classNumSort: classNumSort,//节次排序 1正序/0倒序
      evaluateTimeSort: evaluateTimeSort,//评课时间排序  1正序/0倒序
    })
    const { pageSize } = getState().fyl_historyDetailsData;
    requestForListen('get/historyDetails', { taskId, classNumSort, evaluateTimeSort, pageSize, pageIndex, semester }, res => {
      if (res.result) {
        dispatch({
          type: HISTORYDETAILS,
          tableData: res.data,
          total: res.total,
        })
      } else {
        dispatch({
          type: HISTORYDETAILS,
          tableData: [],
          total: 0,
        })
      }
    })
    // const res = {
    //     total: 100,
    //     result: true,
    //     tableData: [
    //         {
    //             evaluateNum: 1,
    //             schoolName: 1,
    //             studyName: 1,
    //             studytype: 1,
    //             teacher: 1,
    //             classNum: 1,
    //             evaluateTime: 1,
    //         },
    //         {
    //             evaluateNum: 2,
    //             schoolName: 1,
    //             studyName: 1,
    //             studytype: 1,
    //             teacher: 1,
    //             classNum: 2,
    //             evaluateTime: 1,
    //         },
    //         {
    //             evaluateNum: 3,
    //             schoolName: 1,
    //             studyName: 1,
    //             studytype: 1,
    //             teacher: 1,
    //             classNum: 3,
    //             evaluateTime: 1,
    //         },
    //         {
    //             evaluateNum: 4,
    //             schoolName: 1,
    //             studyName: 1,
    //             studytype: 1,
    //             teacher: 1,
    //             classNum: 4,
    //             evaluateTime: 1,
    //         },

    //     ],
    // }
    // if (res.result) {
    //     dispatch({
    //         type: HISTORYDETAILS,
    //         tableData: res.tableData,
    //         total: res.total,

    //     })
    // } else {
    //     dispatch({
    //         type: HISTORYDETAILS,
    //         tableData: [],
    //         total: 0,
    //     })
    // }
  }
}