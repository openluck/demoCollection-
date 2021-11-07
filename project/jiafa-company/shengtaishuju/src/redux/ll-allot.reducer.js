import { request } from "../util/request";
import { message } from "antd";

//action.type 常量池
const CHANGETYPE = 'CHANGETYPE'
const CHANGEISDETAILS = 'CHANGEISDETAILS'
const CHANGESTATUS = 'CHANGESTATUS'

// import { saveAs } from 'file-saver';
const initState = {
    allotType: '1', //1按课堂 2按开课单位
    allotList: [],
    selectedRowKeys: [],
    allotInfo: {
        alertCourseNum: 0,//'预警课程数'
        allotCourseNum: 0,//'下发课程数'
        allotCourseProp: 0,//'占比
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
        collegeId: '' //1.21新增 ""查询全部

    },
    allotstatus: false,
    isDetails: false // 判断是否在 按开课单位-查看详情（按学院查看的课堂列表）

}

export const ll_allot_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'ALLOT':
            return {
                ...state,
                ...action.data
            }
        case CHANGETYPE:
            return {
              ...state,
              ...action.data
            }
        case CHANGEISDETAILS:
            return {
              ...state,
              ...action.data
            }
        case CHANGESTATUS:
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
 * 修改allotType  按课堂 or 按开课单位查看列表 1.21
 * @param {*} allottype
 */
export const ll_changeType = (allotType) => {
  return (dispatch) => {
    dispatch({
      type: CHANGETYPE,
      data: {
        allotType: allotType
      }
    })
  }
}

/**
 * 获取列表数据
 * @param {*} data 
 */
export const ll_queryAllotList = (data) => {
    return (dispatch, getState) => {
      const {allotType} = getState().ll_allot_reducer
        dispatch({
            type: 'ALLOT',
            data: {
                allLoading: true,
                inputData: data
            }
        })
        // console.log(data, 'data')
        if (data.timeType === '4') {
            data.selTime = data.semesterId;
        }
        //按课堂获取列表
        if (allotType === '1') {
          request('/api/improve/getAblIssueList', data, (res) => {
            if (res.code === '200' && res.result) {
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
        } else {
          //1.21按开课单位获取列表  获取开课单位列表时应获取全部数据，没有未下发/下发区别
          request('/api/improve/getAblIssueCollegeList', { ...data, distributionType: '' }, (res) => {
            if (res.code === '200' && res.result) {
              dispatch({
                type: 'ALLOT',
                data: {
                  allotList: res.data,
                  total: res.total,
                  allLoading: false
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
              console.log(false);
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
}

// 获取头部静态数据
export const ll_getAllotInfo = (data) => {
    return dispatch => {
        if (data.timeType === '4') {
            data.selTime = data.semesterId;
        }
        request('/api/improve/getIssueStatic', data, (res) => {
            if (res.data && res.result) {
                let data = res.data;
                dispatch({
                    type: 'ALLOT',
                    data: {
                        allotInfo: {
                            alertCourseNum: data.alertCourseNum,//'预警课程数'
                            allotCourseNum: data.allotCourseNum,//'下发课程数'
                            allotCourseProp: data.allotCourseProp,//'占比
                        }
                    }
                })
            } else {
                message.warn(res.message)
            }
        }, () => {

        })

        // dispatch({
        //     type: 'ALLOT',
        //     data: {
        //         allotInfo: {
        //             alertCourseNum: 10,//'预警课程数'
        //             allotCourseNum: 30,//'下发课程数'
        //             allotCourseProp: 20,//'占比
        //         }
        //     }
        // })
    }
}

/**
 * 批量选择
 * @param {*} data 
 */
export const ll_selectedRowKeys = (data) => {
    return dispatch => {
        dispatch({
            type: 'ALLOT',
            data: {
                selectedRowKeys: data
            }
        })
    }
}

/**
 * 下发
 * @param {*} data 
 */
export const ll_allotHandle = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            request('/api/improve/operateAblIssue', data, (res) => {
                if (res.result) {
                    dispatch({
                        type: 'ALLOT',
                        data: {
                            selectedRowKeys: []
                        }
                    })
                    resolve()
                    message.success('下发成功')
                } else {
                    message.warn(res.message)
                }
            }, () => {

            })
            // console.log(data, 'data')
            // dispatch({
            //     type: 'ALLOT',
            //     data: {
            //         selectedRowKeys: []
            //     }
            // })
            // resolve()
        })

    }
}


/**
 * 
 * @param {}} data 
 * @returns 改变inputData
 */
export const ll_changeInput = (data) => {
  console.log("changeInput", data);
    return dispatch => {
        dispatch({
            type: 'ALLOT',
            data: {
                inputData: data
            }
        })
    }
}


export const ll_allotstatus = (data) => {
  console.log('执行12321', data);
    return dispatch => {
        dispatch({
            type: CHANGESTATUS,
            data: {
              allotstatus: data
            }
        })
    }
}

export const lrf_changeIsDetails = (data) => {
  // console.log('changeDetails', data);
  return dispatch => {
    dispatch({
      type: CHANGEISDETAILS,
      data: {
        isDetails: data
      }
    })
  }
}