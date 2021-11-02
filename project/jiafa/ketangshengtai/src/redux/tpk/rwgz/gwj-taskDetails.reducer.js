import { requestForListen} from "./../../../util/request";
import { message } from "antd";

const LEADEVATASK = "LEADEVATASK";
const PAGEDATA = 'PAGEDATA';

const init = {
  leadEvaTask: {},
  pageData: {}
};

export function taskDetailsReducer(state = init, action) {
  switch (action.type) {
    case LEADEVATASK:
      return {
        ...state,
        ...action
      };
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
 * 川大校领导评课任务
 */
export function getLeadEvaTask(params) {
  return dispatch => {
    requestForListen("get/leadEvaTask", params, res => {
      // console.log(res);
      let leadEvaTask = {};
      if (res.result) {
        if (res.data !== null) {
          leadEvaTask = { ...res.data };
        }
      } else {
        message.info(res.message);
      }
      dispatch({
        type: LEADEVATASK,
        leadEvaTask
      });
    });
  };
}
/**
 * 评课结果列表查询
 */
export function getEvaResultTable(params) {
    // console.log('评课结果列表查询',params)
  return dispatch => {
    requestForListen("get/evaResultTable", params, res => {
      // console.log(res);
      let pageData = {};
      if (res.result) {
        if (res.data !== null) {
          pageData = {
            pageList: [...res.data],
            total: res.total
          };
        }
      } else {
        message.info(res.message);
      }
      dispatch({
          type:PAGEDATA,
          pageData
      })
    });
  };
}
