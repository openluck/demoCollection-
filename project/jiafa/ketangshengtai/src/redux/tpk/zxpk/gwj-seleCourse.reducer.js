import { requestForListen} from './../../../util/request';
import { message } from "antd";

const TASKID = 'TASKID';
const PAGEDATA = 'PAGEDATA';

const init = {
  taskId: '',
  pageData: {}
}

export function seleCourseReducer(state = init, action) {
  switch (action.type) {
    case TASKID:
      return {
        ...state,
        ...action
      }
    case PAGEDATA:
      return {
        ...state,
        ...action
      }
    default:
      return state;
  }
}
/**
 * 获得任务id
 */
export function getTaskId(id) {
  return dispatch => {
    dispatch({
      type: TASKID,
      taskId: id
    })
  }
}
/**
 * 列表查询
 */
export function getCourseTable(params) {
  return dispatch => {
    requestForListen('get/courseTable', params, (res) => {
      // console.log(res);
      let pageData = {};
      if (res.result) {
        if (res.data !== null) {
          pageData = {
            pageList: [...res.data],
            total: res.total
          }
        }
      } else {
        message.info(res.message);
      }
      dispatch({
        type: PAGEDATA,
        pageData
      })
    })
  }
}
