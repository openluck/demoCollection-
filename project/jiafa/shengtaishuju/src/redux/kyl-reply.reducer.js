import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';
const initState = {
  allotList: [],
  selectedRowKeys: [],
  allotInfo: {
    errorStateNum: 0,//'异常情况数'
    replyNum: 0,//'已回复数'
    expireReplyNum: 0,//'过期未回复数
    applyNorNum: 0,//申请为正常数	
    noApplyNum: 0,//不同意申请数	
    allowApplyNum: 0 //同意申请数	
  },
  allLoading: false,
  total: 0,
  inputData: {
    semesterId: '',
    timeType: '',
    selTime: '',
    distributionType: '',
    pageSize: 20,
    pageNum: 1,
    attType: '',
    replyType: '',
    searchParam: ''
  },
  replystatus: false,

}

export const kyl_reply_reducer = (state = initState, action) => {
  switch (action.type) {
    case 'ALLOT':
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


/**
 * 获取列表数据（学校）
 * @param {*} data 
 */
export const ll_queryAllotListOfSch = (data) => {
  data.replyType = data.distributionType || "";
  return dispatch => {
    dispatch({
      type: 'ALLOT',
      data: {
        allLoading: true,
        inputData: data
      }
    })
    delete data.distributionType
    request('/api/improve/getAblReplyListOfSch', data, (res) => {
      if (res.data && res.result) {
        dispatch({
          type: 'ALLOT',
          data: {
            allotList: res.data,
            total: res.total,
            allLoading: false,
          }
        })
      } else {
        message.warn(res.message)
        dispatch({
          type: 'ALLOT',
          data: {
            allLoading: false
          }
        })
      }
    }, () => {
      dispatch({
        type: 'ALLOT',
        data: {
          allLoading: false
        }
      })
    })
  }
}

/**
 * 获取列表数据（学院）
 * @param {*} data 
 */
export const ll_queryAllotListOfCol = (data) => {
  let i = _.cloneDeep(data).distributionType;
  return dispatch => {
    dispatch({
      type: 'ALLOT',
      data: {
        allLoading: true,
        inputData: data
      }
    })
    data.replyType = i;
    request('/api/improve/getAblReplyListOfCol', { ...data, distributionType: undefined }, (res) => {
      if (res.data && res.result) {
        dispatch({
          type: 'ALLOT',
          data: {
            allotList: res.data,
            total: res.total,
            allLoading: false,
          }
        })
      } else {
        message.warn(res.message)
        dispatch({
          type: 'ALLOT',
          data: {
            allLoading: false
          }
        })
      }
    }, () => {
      dispatch({
        type: 'ALLOT',
        data: {
          allLoading: false
        }
      })
    })
  }
}

export const kyl_submitReason = (data) => {
  return (dispatch, getState) => {
    request('/api/improve/operateReply', data, (res) => {
      if (res.result) {
        message.success('操作成功');
        dispatch(ll_queryAllotListOfSch(getState().kyl_reply_reducer.inputData))
        dispatch(ll_getAllotInfo(getState().kyl_reply_reducer.inputData))
      } else {
        message.warn(res.message)
      }
    }, () => {

    })
  }
}

export const updateList = () => {
  return (dispatch, getState) => {
    dispatch(ll_queryAllotListOfCol(getState().kyl_reply_reducer.inputData))
    dispatch(ll_getAllotInfo(getState().kyl_reply_reducer.inputData))
  }
}

export const ll_getAllotInfo = (data) => {
  return dispatch => {

    if (data.timeType === '4') {
      data.selTime = data.semesterId;
    }
    request('/api/improve/getReplyStatic', data, (res) => {
      if (res.data && res.result) {
        let data = res.data;
        dispatch({
          type: 'ALLOT',
          data: {
            allotInfo: {
              errorStateNum: data.errorStateNum,//'异常情况数'
              replyNum: data.replyNum,//'已回复数'
              expireReplyNum: data.expireReplyNum,//'过期未回复数
              applyNorNum: data.applyNorNum,//申请为正常数	
              noApplyNum: data.noApplyNum,//不同意申请数	
              allowApplyNum: data.allowApplyNum //同意申请数	
            }
          }
        })
      } else {
        message.warn(res.message)
      }
    }, () => {

    })
  }
}

export const ll_changeInput = (data) => {
  return dispatch => {
    dispatch({
      type: 'ALLOT',
      data: {
        inputData: data
      }
    })
  }
}


export const ll_replystatus = (data) => {
  return dispatch => {
    dispatch({
      type: 'ALLOT',
      data: {
        replystatus: data
      }
    })
  }
}

