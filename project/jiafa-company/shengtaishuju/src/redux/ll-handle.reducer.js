import { request } from "../util/request";
import { message } from "antd";

const initState = {
    handleInfo: {
        alertCourseNum: 0,//'问题课程数'
        allotCourseNum: 0,//'已处理课程数'
        allotCourseProp: 0,//'占比
    },
    handleList: [],//列表数据
    allLoading: false,
    inputData: {
        semesterId: '',
        timeType: '',
        selTime: '',
        distributionType: '',
        pageSize: 20,
        pageNum: 1,
    },
    total:0,
    handlestatus:false

}

export const ll_handle_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'HANDLE':
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
 * 统计
 * @param {*} data 
 */
export const ll_getHandleInfo = (data) => {
    return dispatch => {
        let params ={
            selTime:data.selTime,
            semesterId:data.semesterId,
            timeType:data.timeType,
            collegeId:''
        }
        request('/api/improve/getHandleInfo',params,(res)=>{
            if(res.data&&res.result){
                let data = res.data;
                dispatch({
                    type:'HANDLE',
                    data:{
                        handleInfo:{
                            alertCourseNum:data.errorCourseNum,//'预警课程数'
                            allotCourseNum: data.finishCourseNum,//'下发课程数'
                            allotCourseProp: data.handleCourseProp,//'占比
                        }
                    }
                })
            }else{
                message.warn(res.message)
            }
        },()=>{

        })
        // dispatch({
        //     type: 'HANDLE',
        //     data: {
        //         handleInfo: {
        //             alertCourseNum: 10,//'问题课程数'
        //             allotCourseNum: 130,//'已处理课程数'
        //             allotCourseProp: 20,//'占比
        //         }
        //     }
        // })
    }
}

/**
 * 获取列表数据
 * @param {*} data 
 */
export const ll_getHandleList = (data) => {
    return dispatch => {
        dispatch({
            type: 'HANDLE',
            data: {
                allLoading: true,
                inputData: data
            }
        })
        let params={
            semesterId: data.semesterId,
            timeType: data.timeType,
            selTime: data.selTime,
            handleType:data.distributionType,
            pageSize: data.pageSize,
            pageNum: data.pageNum,
        }
        console.log(data, 'data11111')
        request('/api/improve/getHandleList', params, (res) => {
            if (res.data && res.result) {
                dispatch({
                    type: 'HANDLE',
                    data:{
                        handleList: res.data,
                        total: res.total,
                        allLoading: false,
                    }
                })
            } else {
                dispatch({
                    type: 'HANDLE',
                    data: {
                        allLoading: false
                    }
                })
            }
        }, () => {
            dispatch({
                type: 'HANDLE',
                data: {
                    allLoading: false
                }
            })
        })

        // let handleList = [];
        // for (let i = 0; i < 20; i++) {
        //     handleList.push(
        //         {
        //             "claRoomId": i,
        //             "courseNum": "12",
        //             "couTypeName": "家长公开课",
        //             "claAddress": "教学楼123",
        //             "collegeName": "计算机学院",
        //             "checkName": "2",
        //             "date": "2015-02-12 1-4节",
        //             "teacherName": "吴老师",
        //             "sleepRate": "20",
        //             "frontSeatRate": "30",
        //             "stuOnAttRate": "50",
        //             "distributionType": "1",
        //             "courseName": "计算机"
        //         }
        //     )
        // }
        // dispatch({
        //     type: 'HANDLE',
        //     data: {
        //         handleList,
        //         selectedRowKeys: [],
        //         allLoading: false,
        //     }

        // })
    }
}


/**
 * 改变input值
 * @param {*} data 
 */
export const ll_changeInput = (data) => {
    return dispatch => {
        dispatch({
            type: 'HANDLE',
            data: {
                inputData: data
            }
        })
    }
}


export const ll_handlestatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'HANDLE',
            data:{
                handlestatus:data
            }
        })
    }
}