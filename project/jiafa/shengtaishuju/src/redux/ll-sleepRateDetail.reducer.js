/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 13:53:18
 * 低头率明细 redux
 */
import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';

const initState = {
    sleepRateDate: [],
    total: 0,
    loading: false,
    inputData: {
        semesterId: '',//学期id
        courseId: "",//课程id
        teacherId: '',//教师id
        // collegeId: '',//开课院系id
        collegeId: '',//开课院系id
        courseNum:'', //课程号
        min: '',
        max: '',
        couTypeId: '',//课程类别id
        sectionId: '',//节次id
        startTime: null,
        endTime: null,
        sortType: 0,
        pageNum: 1,
        pageSize: 20
    },
    aortOrder: '',
    sleepstatus: false,

}
const SLEEPRATE = 'SLEEPRATE'

export const ll_sleepRateDetail_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'SLEEPRATE':
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
 * 获取低头率
 * @param {object} data 
 */
export const ll_getSleepRate = (data) => {
    return dispatch => {
        let param = {
            semesterId: data.semesterId,
            courseId: data.courseId,
            teacherId: data.teacherId,
            collegeId: data.collegeId,
            minSleepRate: data.min === '' ? null : data.min,
            maxSleepRate: data.max === '' ? null : data.max,
            couTypeId: data.couTypeId,
            sectionId: data.sectionId,
            startTime: data.startTime,
            endTime: data.endTime,
            sortType: data.sortType,
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            courseNum:data.courseNum
        }
        dispatch({
            type: 'SLEEPRATE',
            data: {
                loading: true,
                inputData:data
            }
        })
        request('/api/details/teaOrder/getSleepRate', param, (res) => {
            if (res.result && res.data) {
                dispatch({
                    type: 'SLEEPRATE',
                    data: {
                        sleepRateDate: res.data,
                        total: res.total
                    }
                })
            } else {
                dispatch({
                    type: 'SLEEPRATE',
                    data: {
                        sleepRateDate: [],
                        total: 0
                    }
                })
                message.warn(res.message)
            }
            dispatch({
                type: 'SLEEPRATE',
                data: {
                    loading: false
                }
            })
        }, () => {
            dispatch({
                type: 'SLEEPRATE',
                data: {
                    loading: false
                }
            })
        })
    }
}

export const ll_downSleep = (data) => {
    return dispatch => {
        let param = {
            semesterId: data.semesterId,
            courseId: data.courseId,
            teacherId: data.teacherId,
            collegeId: data.collegeId,
            minSleepRate: data.min === '' ? null : data.min,
            maxSleepRate: data.max === '' ? null : data.max,
            couTypeId: data.couTypeId,
            sectionId: data.sectionId,
            startTime: data.startTime,
            endTime: data.endTime,
            sortType: data.sortType,
            courseNum:data.courseNum
        }
        request('/api/details/teaOrder/downSleep', param, (res, name) => {
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
export const ll_sleepstatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'SLEEPRATE',
            data:{
                sleepstatus:data
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
            type:'SLEEPRATE',
            data:{
                aortOrder:data
            }
        })
    }
}