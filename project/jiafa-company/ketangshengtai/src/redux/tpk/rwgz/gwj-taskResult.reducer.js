import { requestForListen} from "./../../../util/request";
import moment from 'moment';
import { message } from "antd";
import { G } from './../../../config/g';

const EVASITUATION = "EVASITUATION";
const PAGEDATA = "PAGEDATA";

const init = {
  evaSituation: {},
  pageData: {},
};

export function taskResultReducer(state = init, action) {
  switch (action.type) {
    case EVASITUATION:
      return {
        ...state,
        ...action
      };
    case PAGEDATA:
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
}
/**
 * 评课概况
 */
export function getEvaSituation(params) {
  return dispatch => {
    requestForListen("get/evaSituation", params, res => {
      //   console.log(res);
      let evaSituation = {};
      if (res.result) {
        if (res.data != null) {
          evaSituation = { ...res.data };
        }
      } else {
        message.info(res.message);
      }
      dispatch({
        type: EVASITUATION,
        evaSituation: evaSituation
      });
    });
  };
}
/**
 * 任务列表查询
 */
export function getOverviewTable(params) {
  return dispatch => {
    requestForListen("get/overviewTable", params, res => {
      // console.log(res);
      let pageData = {};
      if (res.result) {
        if (res.data != null) {
          let data = res.data;
          data.map(item=>{
            let evaResult = item.evaResult;
            let txt = '';
            evaResult && evaResult.length &&evaResult.map(resultItem=>{
              txt = txt + resultItem.evaResult + ":" + resultItem.cnt + ' ';
            })
            item.evaResult =  txt;
          })
          pageData = {
            pageList: [...data],
            total: res.total
          };
        }
      } else {
        message.info(res.message);
      }
      dispatch({
        type: PAGEDATA,
        pageData
      });
    });
  };
}
/**
 * 列表导出
 */
export function exportOverviewTable(params) {
  return dispatch => {
    requestForListen("export/overviewTable", params, res => {
      if (res.result) {
        const data = res.data;
        let downUrl = G.serverUrl + '/' + data.excel_file;
        let elink = document.createElement('a');
        elink.download = "评课数据 " + moment(new Date()).format("YYYY-MM-DD");
        elink.href = downUrl;
        // console.log(downUrl, elink.download);
        elink.click();
        // window.open(res.data);
      } else {
        message.info(res.message);
      }
    });
  };
}
