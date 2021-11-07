import { request } from "../util/request";
import { message } from "antd";
import { saveAs } from 'file-saver';
import G from './../config/g';
import moment from "moment";
const initState = {
    fDInfo: {
        alertCourseNum: 0,
        allotCourseNum: 0,
        allotCourseProp: 0,
    },
    trackHandleList: [],//列表数据
    allLoading: false,
    inputData: {
        collegeId: '',
        pageSize: 20,
        pageNum: 1,
        timeType:'1',
        selTime:'',
        semesterId:''
   },
    total: 21,
  
}


export const ll_followDetails_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'FOLLOWDETAILS':
            return {
                ...state,
                ...action.data
            }

        default:
            return {
                ...state,
            }
    }
}

/**
 * 获取列表信息
 * @param {*} data 
 */
export const ll_getTrackHandleList = (data) => {
    return dispatch => {
        dispatch({
            type: 'FOLLOWDETAILS',
            data: {
                allLoading: true,
                inputData: data
            }
        })

        request('/api/improve/getTrackHandleList',data,(res)=>{
            if(res.data&&res.result){
                dispatch({
                    type:'FOLLOWDETAILS',
                    data:{
                        trackHandleList:res.data,
                        total:res.total,
                        allLoading: false,
                    }
                })
            }else{
                dispatch({
                    type: 'FOLLOWDETAILS',
                    data: {
                        allLoading: false,
                    }
                })
                message.warn(res.message)
            }
        },()=>{
            dispatch({
                type: 'FOLLOWDETAILS',
                data: {
                    allLoading: false,
                }
            })
        })
        // let trackHandleList = []
        // for (let i = 0; i < 20; i++) {
        //     trackHandleList.push({
        //         claRoomId: `${i}`,
        //         collegeName: '计算机科学与工程',
        //         claAddress: '三教',
        //         couTypeName: '家长公开课',
        //         courseNum: '20131',
        //         courseName: '软件工程',
        //         teacherName: '王老师',
        //         date: '2013-05-02 1-3节',
        //         checkName: '调课换课',
        //         stuOnAttRate: 30,
        //         frontSeatRate: 20,
        //         sleepRate: 20,
        //         processingStatus: '0',
        //         processingPer: ['张三','李四', ]
        //     })
        // }
        // dispatch({
        //     type: 'FOLLOWDETAILS',
        //     data: {
        //         trackHandleList,
        //         allLoading: false,
        //         total: 31
        //     }
        // })
    }
}

/**
 * 处理统计
 * @param {*} data 
 */
export const ll_fDInfo = (data) => {
    return dispatch => {
        request('/api/improve/getHandleInfo',data,(res)=>{
            if(res.result&&res.data){
                let data = res.data;
                dispatch({
                    type:'FOLLOWDETAILS',
                    data:{
                        fDInfo:{
                            alertCourseNum:data.errorCourseNum,
                            allotCourseNum:data.finishCourseNum,
                            allotCourseProp:data.handleCourseProp,
                        }

                    }
                })
            }else{
                message.warn(res.message)
            }
        },()=>{

        })
        // dispatch({
        //     type: 'FOLLOWDETAILS',
        //     data: {
        //         fDInfo: {
        //             alertCourseNum: 20,
        //             allotCourseNum: 30,
        //             allotCourseProp: 10.22,
        //         }
        //     }
        // })
    }
}

/**
 * 改变入参
 * @param {*} data 
 */
export const ll_changeInput=(data)=>{
    return dispatch=>{
        dispatch({
            type:'FOLLOWDETAILS',
            data:{
                inputData:data
            }
        })
    }
}


export const ll_downHandleDetail=(data)=>{
    return dispatch=>{
           request('/api/improve/downHandleDetail',data, (res,name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob,  name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }
}

