/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 13:53:44
 * 前排就座率明细
 */
import { request } from "../util/request";
import { message } from "antd";
import { saveAs } from 'file-saver';

const initState = {
    siteRateDate: [],
    total: 0,
    loading: false,
    inputData:{
        semesterId: '',//学期id
        courseId: "",//课程id
        teacherId: '',//教师id
        // collegeId: '',//开课院系id
        collegeId: '',//开课院系id
        courseNum:'', //课程号
        min: '',
        max:'',
        couTypeId:'',//课程类别id
        sectionId:'',//节次id
        startTime: null,
        endTime:null,
        sortType: 0,
        pageNum: 1,
        pageSize: 20
    },
    sitestatus:false,
    aortOrder:'',
}
const SITERATE = 'SITERATE'

export const ll_sitRateDetail_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'SITERATE':
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
 * 获取前排就坐率列表
 * @param {object} data 
 */
export const ll_getFrontRowSeatRate = (data) => {
    return dispatch => {
        let param = {
            semesterId:data.semesterId,
            courseId: data.courseId,
            teacherId: data.teacherId,
            collegeId: data.collegeId,
            courseNum:data.courseNum,
            minSeatRate: data.min===''?null:data.min,
            maxSeatRate: data.max===''?null:data.max,
            couTypeId: data.couTypeId,
            sectionId: data.sectionId,
            startTime: data.startTime,
            endTime: data.endTime,
            sortType: data.sortType,
            pageNum: data.pageNum,
            pageSize: data.pageSize,
        }
        dispatch({
            type:'SITERATE',
            data:{
                loading:true,
                inputData:data
            }
        })
        request('/api/details/teaOrder/getFrontRowSeatRate',param,(res)=>{
            if(res.result&&res.data){
                dispatch({
                    type:'SITERATE',
                    data:{
                        siteRateDate:res.data,
                        total:res.total
                    }
                })
            }else{
                dispatch({
                    type:'SITERATE',
                    data:{
                        siteRateDate:[],
                        total:0
                    }
                })
            }
            dispatch({
                type:'SITERATE',
                data:{
                    loading:false
                }
            })
        },()=>{
            dispatch({
                type:'SITERATE',
                data:{
                    loading:false
                }
            })
        })
    }
}

/**
 * 前排就坐率下载
 * @param {object} data 
 */
export const ll_downFrontRowSeat = (data) => {
    return dispatch => {
        let param = {
            semesterId: data.semesterId,
            courseId: data.courseId,
            teacherId: data.teacherId,
            collegeId: data.collegeId,
            minSeatRate: data.min===''?null:data.min,
            maxSeatRate: data.max===''?null:data.max,
            couTypeId: data.couTypeId,
            sectionId: data.sectionId,
            startTime: data.startTime,
            endTime: data.endTime,
            sortType: data.sortType,
            courseNum:data.courseNum
        }
        request('/api/details/teaOrder/downFrontRowSeat',param, (res,name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob, name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }
}

/**
 * 是否保存条件
 * @param {*} data 
 */
export const ll_sitestatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'SITERATE',
            data:{
                sitestatus:data
            }
        })
    }
}

/**
 * 排序
 * @param {*} data 
 */
export const ll_aortOrder = (data)=>{
    return dispatch=>{
        dispatch({
            type:'SITERATE',
            data:{
                aortOrder:data
            }
        })
    }
}
