/*
 * @Author: yh 
 * @Date: 2020-01-21 16:05:41 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-28 10:49:40
 * 任务概览
 */
import { requestForListen } from './../../../util/request';
const Request = requestForListen;
const OVERVIEW = 'OVERVIEW';
const STATUS = 'STATUS';
const PROGRESS = 'PROGRESS';
const TASKLIST = 'TASKLIST';
const TOTAL = 'TOTAL';
const LISTLOAD = 'LISTLOAD';
const init = {
  overView: {}, // 课堂情况数据
  status: {}, // 课堂情况数据入参
  progress: {},
  taskList: [],
  total: 0,
  listLoad: true
}

export function yh_taskOverviewReducer(state = init, action) {
  switch (action.type) {
    case OVERVIEW:
      return { ...state, ...action };
    case STATUS:
      return { ...state, ...action };
    case PROGRESS:
      return { ...state, ...action };
    case TASKLIST:
      return { ...state, ...action };
    case TOTAL:
      return { ...state, ...action };
    case LISTLOAD:
      return { ...state, ...action };
    default:
      return state;
  }
}
/**
 * @description 获取任务概况数据
 */
export function yh_getOverView(semester) {
  // let res = {
  //   "result": true,
  //   "data": null
  // }
  return (dispatch) => {
    Request('taskOverview/overview', { semester }, (res) => {
      let data = {};
      if (res.result) {
        if (res.data) {
          data = res.data
          data.rate = res.data.task ? ((res.data.leader / res.data.task) * 100).toFixed(1) : 0
        } else {
          data = {}
        }
      } else {
        data = {}
      }
      dispatch({
        type: OVERVIEW,
        overView: data
      })
    })
  }
}
export function yh_getStatus(semester) {
  let res = {
    "result": true,
    "data": {
      "task": 26,
      "leader": 11,
      "supervise": 15,
      "over": 30
    }
  }
  return (dispatch) => {
    Request('taskOverview/status', { semester }, (res) => {
      let data = {};
      if (res.result) {
        if (res.data) {
          data = res.data
          data.rate = res.data.task ? ((res.data.leader / res.data.task) * 100).toFixed(1) : 0
        } else {
          data = {}
        }
      } else {
        data = {}
      }
      dispatch({
        type: STATUS,
        status: data
      })
    })

  }
}
export function yh_getProgress(semester) {
  let _res = {
    "result": true,
    "data": null
  }
  return (dispatch) => {
    Request("taskOverview/progress", { semester }, (res) => {
      let data = {};
      if (res.result) {
        if (res.data) {
          data = res.data;
          let task = data.task;
          let leader = data.leader;
          let supervise = data.supervise;
          let substrate = data.substrate;
          task.rate = task.total ? ((task.complete / task.total) * 100).toFixed(1) : 0;
          leader.rate = leader.total ? ((leader.complete / leader.total) * 100).toFixed(1) : 0;
          supervise.rate = supervise.total ? ((supervise.complete / supervise.total) * 100).toFixed(1) : 0;
          substrate.rate = substrate.total ? ((substrate.complete / substrate.total) * 100).toFixed(1) : 0;
        } else {
          data = {};
        }
      } else {
        data = {}
      }
      dispatch({
        type: PROGRESS,
        progress: data
      })
    })

  }
}
export function yh_getTaskList(params) {
  let res = {
    "total": 30,
    "result": true,
    "data": [
      {
        "id": 454546466,
        "name": "eiusmod voluptate esse consequat cillum",
        "creator": "aliquip sed ut",
        "taskType": "amet",
        "taskState": 0,
        "overProgress": {
          "over": 2,
          "total": 5,
          "rate": 40
        }
      },
      {
        "id": 454545458,
        "name": "culpa commodo voluptate",
        "creator": "laborum voluptate",
        "taskType": "ipsum",
        "taskState": 1,
        "overProgress": {
          "over": 3,
          "total": 5,
          "rate": 60
        }
      },
      {
        "id": 34158332,
        "name": "in",
        "creator": "par",
        "taskType": "sunt Lorem commodo ",
        "taskState": 3,
        "overProgress": {
          "over": 10,
          "total": 10,
          "rate": 100
        }
      }
    ]
  }
  return (dispatch) => {
    Request('taskOverview/list', params, (res) => {
      let data = [];
      if (res.result) {
        dispatch({
          type: TOTAL,
          total: res.total
        })

        if (res.data) {
          data = res.data
        } else {
          data = []
        }
      } else {
        data = [];
        dispatch({
          type: TOTAL,
          total: 0
        })
      }
      data.map((item) => {
        let taskState = item.taskState;
        let _taskState = '';
        let over = item.overProgress.over;
        let total = item.overProgress.total;
        taskState === 0 ? _taskState = '未发布' : taskState === 1 ? _taskState = "进行中" : _taskState = "已结束"
        item.taskState = _taskState;
        // rate = ((over/total)*100).toFixed(1);
        item.rate = item.overProgress.rate;
        item.over = (over / total) === 1 ? true : false
      })
      dispatch({
        type: LISTLOAD,
        listLoad: false
      })
      dispatch({
        type: TASKLIST,
        taskList: data
      })
    })
    dispatch({
      type: LISTLOAD,
      listLoad: false
    })
  }
}
