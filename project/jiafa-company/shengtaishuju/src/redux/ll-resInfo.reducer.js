/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-08-04 09:23:29
 * 多媒体使用
 */

const initState = {
    inputData:{
        semesterId:'',//学期id
        courseId: "",//课程id
        teacherId: '',//教师id
        collegeId:'',//开课院系id
        multiUse:"",//多媒体使用
        couTypeId:'',//课程类别id
        sectionId: '',//节次id
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 20
    },
    resInfostatus:false,
}

export const ll_resInfo_reducer = (state = initState, action) => {
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
export const ll_resInfostatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'QUACOUR',
            data:{
                resInfostatus:data
            }
        })
    }
}
