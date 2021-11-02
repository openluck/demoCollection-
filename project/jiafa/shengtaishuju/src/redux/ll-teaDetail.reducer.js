/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-19 10:34:07
 */
import { request } from "../util/request";
import { message } from "antd";
import { saveAs } from 'file-saver';
import moment from 'moment';

const initState = {
    kqData:[],
    total:0,
    loading:false,
    inputData:{
        semesterId: '',//学期id
        courseId: '',//课程id
        teacherId: '',//教师id
        collegeId: '',//开课院系id
        // collegeId:'',//开课院系id
        status:'',//考勤状态（0 异常 1正常 ' '全部）
        checkType:'',//状态类型
        couTypeId:'',//课程类别id
        sectionId: '',//节次id
        courseNum:'', //课程号
        startTime:null,
        endTime:null,
        pageNum: 1,
        pageSize: 20
    },
    teaStatus:false,
}
const KQDATA='KQDATA'

export const ll_teaDetail_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'KQDATA':
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


export const ll_getTeaAttendance=(data)=>{
    return dispatch=>{
        dispatch({
            type:'KQDATA',
            data:{
               loading:true,
               inputData:data
            }
        })
        request('/api/details/teaOrder/getTeaAttendance',data,(res)=>{
            if(res.result&&res.data){
                dispatch({
                    type:'KQDATA',
                    data:{
                        kqData:res.data,
                        total:res.total
                    }
                })
            }else{
                dispatch({
                    type:'KQDATA',
                    data:{
                        kqData:[],
                        total:0
                    }
                })
                message.warn(res.message)
            }
            dispatch({
                type:'KQDATA',
                data:{
                   loading:false
                }
            })
        },()=>{
            dispatch({
                type:'KQDATA',
                data:{
                   loading:false,
                   kqData:[],
                   total:0
                }
            })
        })
    }
}

export const ll_downTea=(data)=>{
    return dispatch=>{
           request('/api/details/teaOrder/downTea',data, (res,name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob,  name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }
}

   // let name = `${data.startTime}-${data.endTime}`
            // if(JSON.stringify(data.startTime) ===JSON.stringify(data.endTime)){
            //     name = `${data.startTime}`
            // }
            // saveAs(blob,   `教师考勤明细${name}.xlsx`)



export const ll_teaStatus = (data)=>{
    return dispatch=>{
        // console.log(data,'00000000000');
        dispatch({
            type:'KQDATA',
            data:{
                teaStatus:data
            }
        })
    }
}
