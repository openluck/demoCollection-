/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-08-03 17:35:50
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
        collegeId:'',//开课院系id
        couTypeId:'',//课程类别id
        sectionId: '',//节次id
        startTime:null,
        endTime:null,
        pageNum: 1,
        pageSize: 20
    },
    quacourstatus:false,
}

export const ll_quacour_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'QUACOUR':
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


export const ll_changeInput=(data)=>{
    return dispatch =>{
        dispatch({
            type:'QUACOUR',
            data:{
                inputData:data
            }
        })
    }
}

/**
 * 是否保存条件
 * @param {*} data 
 */
export const ll_quacourstatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'QUACOUR',
            data:{
                quacourstatus:data
            }
        })
    }
}
