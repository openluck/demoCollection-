import { request } from "../util/request";
import { message } from "antd";
import { saveAs } from 'file-saver';
import { Action } from "rxjs/internal/scheduler/Action";
import { dispatch } from "rxjs/internal/observable/range";

const initState = {
    trackList: [],
    allLoading: false,
    inputData: {
        semesterId: '',
        timeType: '',
        selTime: '',
        distributionType: '',
      
    },
    errorCourseNum:0,//问题课程数
    finishCourseNum:0,//处理课程数
    handleCourseProp:0,//处理进度
    total:0,//总数
    errorCourseList: [],
    courseNum: 0,
    changeStatus: 0,
    errorCourseListLoading: false,
    followstatus:false,
}

export const ll_follow_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'FOLLOW':

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
 * 获取列表
 * @param {*} data 
 */
export const ll_getTrackList = (data) => {
    return dispatch => {
        dispatch({
            type: 'FOLLOW',
            data: {
                allLoading: true,
                inputData:JSON.parse(JSON.stringify(data))
            }
        });
        let params={
            semesterId:data.semesterId,
            timeType:data.timeType,
            selTime:data.selTime,
            completionType:data.distributionType,
        }
        request('/api/improve/getTrackList', params, (res) => {
            if (res.data && res.result) {
                dispatch({
                    type: 'FOLLOW',
                    data: {
                        allLoading: false,
                        trackList:res.data,
                        total:res.total
                    }
                })
            }else{
                dispatch({
                    type: 'FOLLOW',
                    data: {
                        allLoading: false,
                    }
                })
                message.warn(res.message)
            }
        },()=>{
            dispatch({
                type: 'FOLLOW',
                data: {
                    allLoading: false,
                }
            })
        })
        console.log(data,'获取跟踪列表')
        // let trackList = [];
        // for(let i=0;i<20;i++){
        //     trackList.push({
        //         collegeId:`${i}`,
        //         collegeName:'计算机科学与工程学院',
        //         errorCourseNum:20,
        //         finishCourseNum:50,
        //         handleCourseProp:20.5
        //     })
        // }
        // console.log(trackList)
        // dispatch({
        //     type:'FOLLOW',
        //     data:{
        //         trackList,
        //         allLoading:false,
        //         total:30
        //     }
        // })

    }
}

/**
 * 获取问题处理
 * @param {*} data 
 */
export const ll_handleInfo = (data) =>{
    return dispatch=>{
        let params={
            selTime:data.selTime,
            semesterId:data.semesterId,
            timeType:data.timeType,
            collegeId:''
        }
        request('/api/improve/getHandleInfo',params,(res)=>{
            if(res.result&&res.data){
                let data = res.data;
                dispatch({
                    type:'FOLLOW',
                    data:{
                        errorCourseNum:data.errorCourseNum,
                        finishCourseNum:data.finishCourseNum,
                        handleCourseProp:data.handleCourseProp,
                    }
                })
            }else{
                message.warn(res.message)
            }
        },()=>{
            
        })
        // dispatch({
        //     type:'FOLLOW',
        //     data:{
        //         errorCourseNum:20,
        //         finishCourseNum:30,
        //         handleCourseProp:22.56,
        //     }
        // })
    }
}

/**
 * 改变inputData
 * @param {*} data 
 */
export const ll_changeInput = (data)=>{
    return dispatch=>{
        dispatch({
            type:'FOLLOW',
            data:{
                inputData:data
            }
        })
    }
}


/**
 * 获取处理效果统计数据
 * @param {*} data 
 */
export const ll_getEffectInfo = (data) => {
    return dispatch => {
        dispatch({
            type: 'FOLLOW',
            data: {
                errorCourseListLoading: true
            }
        })
        let params={
            selTime:data.selTime,
            semesterId:data.semesterId,
            timeType:data.timeType,
        }
        request('/api/improve/getEffectInfo', params, (res) => {
            if (res.data && res.result) {
                let data = res.data;
                dispatch({
                    type: 'FOLLOW',
                    data: {
                        errorCourseListLoading: false,
                        errorCourseList:data.errorCourseList,
                        courseNum:data.courseNum,
                        changeStatus:data.changeStatus,
                    }
                })
            }else{
                message.warn(res.data);
                dispatch({
                    type: 'FOLLOW',
                    data: {
                        errorCourseListLoading: false,
                    }
                })
            }
        },()=>{
            dispatch({
                type: 'FOLLOW',
                data: {
                    errorCourseListLoading: false,
                }
            })
        })
        // let errorCourseList = [];
        // for(let i=0;i<10;i++){
        //     errorCourseList.push({
        //         name:i,
        //         value:i
        //     })
        // }
        // dispatch({
        //     type: 'FOLLOW',
        //     data: {
        //         errorCourseListLoading: false,
        //         errorCourseList,
        //         courseNum:20,
        //         changeStatus:'1',
        //     }
        // })
    }
}

export const ll_followstatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'FOLLOW',
            data:{
                followstatus:data
            }
        })
    }
}



export const ll_downHandle=(data)=>{
    return dispatch=>{
           request('/api/improve/downHandle',data, (res,name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob,  name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }
}

