/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 13:53:42
 * 到课率明细
 */
import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';
const initState = {
    rateData: [],
    total: 0,
    loading: false,
    inputData: {
        semesterId: '',//学期id
        courseId: "",//课程id
        teacherId: '',//教师id
        collegeId: '',//开课院系id
        min: '',
        max: '',
        courseNum:'',
        couTypeId: '',//课程类别id
        sectionId: '',//节次id
        startTime: null,
        endTime: null,
        sortType: 0,
        pageNum: 1,
        pageSize: 20
    },
    ordstatus:false,
    aortOrder:''
}
const RAREDATA = 'RAREDATA'

export const ll_DetailData_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'RAREDATA':
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
 * 到课率列表
 * @param {object} data 
 */
export const ll_getStuAttendance = (data) => {
    return dispatch => {
        let param = {
            semesterId: data.semesterId,
            courseId: data.courseId,
            teacherId: data.teacherId,
            collegeId: data.collegeId,
            courseNum:data.courseNum,
            minToClassRate: data.min === '' ? null : data.min,
            maxToClassRate: data.max === '' ? null : data.max,
            couTypeId: data.couTypeId,
            sectionId: data.sectionId,
            startTime: data.startTime,
            endTime: data.endTime,
            sortType: data.sortType,
            pageNum: data.pageNum,
            pageSize: data.pageSize,
        }
        dispatch({
            type: 'RAREDATA',
            data: {
                loading: true,
                inputData:data
            }
        })
        request('/api/details/teaOrder/getStuAttendance', param, (res) => {
            if (res.result && res.data) {
                dispatch({
                    type: 'RAREDATA',
                    data: {
                        rateData: res.data,
                        total: res.total
                    }
                })
            } else {
                message.warn(res.message)
                dispatch({
                    type: 'RAREDATA',
                    data: {
                        rateData: [],
                        total: 0
                    }
                })
            }
            dispatch({
                type: 'RAREDATA',
                data: {
                    loading: false
                }
            })
        }, () => {
            dispatch({
                type: 'RAREDATA',
                data: {
                    loading: false
                }
            })
        })

    }
}

/**
 * 到课率下载
 * @param {object} data 
 */
export const ll_downStu = (data) => {
    return dispatch => {
        let param = {
            semesterId: data.semesterId,
            courseId: data.courseId,
            teacherId: data.teacherId,
            collegeId: data.collegeId,
            minToClassRate: data.min === '' ? null : data.min,
            maxToClassRate: data.max === '' ? null : data.max,
            couTypeId: data.couTypeId,
            sectionId: data.sectionId,
            startTime: data.startTime,
            endTime: data.endTime,
            sortType: data.sortType,
            courseNum:data.courseNum||''
        }
        request('/api/details/teaOrder/downStu', param, (res, name) => {
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
export const ll_ordstatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'RAREDATA',
            data:{
                ordstatus:data
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
            type:'RAREDATA',
            data:{
                aortOrder:data
            }
        })
    }
}