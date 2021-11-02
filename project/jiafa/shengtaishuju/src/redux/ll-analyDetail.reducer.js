/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-27 14:58:08
 */
import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';
const initState = {
    analyData: [],
    total: 0,
    loading:false,
    inputData:{
        semesterId:'',//学期id
        courseId: "",//课程id
        teacherId: '',//教师id
        // collegeId: '',//开课院系id
        collegeId:'',//开课院系id
        courseNum:'', //课程号
        collegeId: '',//开课院系id
        couTypeId: '',//课程类别id
        sectionId:'',//节次id
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 20,
        classRoomType:""
    },
    analystatus:false,
}
const ANALY = 'ANALY'

export const ll_AnalyDetail_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'ANALY':
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
 * 获取数据
 * @param {object} data 
 */
export const ll_getTeaAnalysis = (data) => {
    return dispatch => {
        dispatch({
            type: 'ANALY',
            data: {
                loading: true,
                inputData:data
            }
        })
        request('/api/details/teaQuality/getTeaAnalysis',data,(res)=>{
            if(res.result&&res.data){
                dispatch({
                    type: 'ANALY',
                    data: {
                        analyData: res.data,
                        total: res.total
                    }
                })
            }else{
                message.warn(res.message)
                dispatch({
                    type: 'ANALY',
                    data: {
                        analyData: [],
                        total: 0,
                    }
                })
            }
            dispatch({
                type: 'ANALY',
                data: {
                    loading: false
                }
            })
         },()=>{
            dispatch({
                type: 'ANALY',
                data: {
                    loading: false
                }
            })
         })
    }
}

/**
 * 下载
 */
export const ll_downTeaAnalysis = (data) => {
    return dispatch => {
        request('/api/details/teaQuality/downTeaAnalysis',data, (res,name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob, name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }
}

/**
 * 是否保存条件 true是 否不是
 * @param {*} data 
 */
export const ll_analystatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'ANALY',
            data:{
                analystatus:data
            }
        })
    }
}