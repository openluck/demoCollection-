/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-27 14:59:27
 */
import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';
const initState = {
    backData: [],
    total: 0,
    loading:false,
    inputData:{
        semesterId:'',//学期id
        courseId: "",//课程id
        teacherId: '',//教师id
        courseNum:'', //课程号
        // collegeId: '',//开课院系id
        collegeId:'',//开课院系id
        couTypeId:'',//课程类别id
        sectionId: '',//节次id
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 20
    },
    backstatus:false
}
const BACK = 'BACK'

export const ll_backDetail_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'BACK':
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


export const ll_getListenFeedback = (data) => {
    return dispatch => {
        dispatch({
            type: 'BACK',
            data: {
              loading:true,
              inputData:data
            }
        })
        request('/api/details/teaQuality/getListenFeedback',data,(res)=>{
            if(res.result&&res.data){
                dispatch({
                    type: 'BACK',
                    data: {
                        backData: res.data,
                        total: res.total
                    }
                })
            }else{
                message.warn(res.message)
                dispatch({
                    type: 'BACK',
                    data: {
                        backData: [],
                        total:0
                    }
                })
            }
            dispatch({
                type: 'BACK',
                data: {
                  loading:false
                }
            })
        },()=>{
            dispatch({
                type: 'BACK',
                data: {
                  loading:false
                }
            })
        })
    }
}

export const ll_downFeedback = (data) => {
    return dispatch => {
       request('/api/details/teaQuality/downFeedback',data, (res,name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob,name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }
}

/**
 * 是否保存条件
 * @param {*} data 
 */
export const ll_backstatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'BACK',
            data:{
                backstatus:data
            }
        })
    }
}
