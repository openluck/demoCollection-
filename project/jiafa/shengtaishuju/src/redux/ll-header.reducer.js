/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: lilu♥
 * @Last Modified time: 2020-02-27 15:05:32
 */
import { request } from "../util/request";
import { message } from "antd";
const initState = {
    inputDate: {},
    teacher: [],
    college: [],
    course: []

}
const HEADER = 'HEADER'
export const ll_Header_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'HEADER':
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
 * 教师
 * @param {*} data 
 */
export const ll_getTeacherList = (data) => {
    return dispatch => {
        request('/api/public/getTeacherList',data,(res)=>{
            if(res.result&&res.data){
                let data =res.data;
                let teacher=[];
                data.map((value)=>{
                    teacher.push({
                        id:value.teacherId,
                        name:value.teacherName
                    })
                })
                dispatch({
                    type:'HEADER',
                    data:{
                        teacher
                    }
                })

            }else{
                message.warn(res.message)
            }
        },()=>{
            dispatch({
                type:'HEADER',
                data:{
                    teacher:[]
                }
            })
        })
        // let data = [
        //     { teacherName: "陈玉建", teacherId: "151YERG15PL" },
        //     { teacherName: "张柏芝", teacherId: "151YERG152L" },
        //     { teacherName: "周星驰", teacherId: "A12QWHEA125" },
        //     { teacherName: "张三四", teacherId: "FASYERG15PL" },
        // ]
        // let teacher = [];
        // data.map((value) => {
        //     teacher.push({
        //         id: value.teacherId,
        //         name: value.teacherName
        //     })
        // })
        // dispatch({
        //     type: 'HEADER',
        //     data: {
        //         teacher
        //     }
        // })
    }
}

/**
 * 开课单位
 * @param {*} data 
 */
export const ll_getDepartmentList = (data) => {
    return dispatch => {
        request('/api/public/getDepartmentList',data,(res)=>{
            if(res.result&&res.data){
                let data =res.data;
                let college=[];
                data.map((value)=>{
                    college.push({
                        id:value.collegeId,
                        name:value.collegeName
                    })
                })
                dispatch({
                    type:'HEADER',
                    data:{
                        college
                    }
                })

            }else{
                message.warn(res.message)
            }
        },()=>{
            dispatch({
                type:'HEADER',
                data:{
                    college:[]
                }
            })
        })
        // let data = [
        //     { collegeName: "马克思主义学院", collegeId: "6745645" },
        //     { collegeName: "经济管理学院", collegeId: "7457457" },
        //     { collegeName: "能源与动力工程学院", collegeId: "6546455" },
        // ]
        // let ccollege = [];
        // data.map((value) => {
        //     ccollege.push({
        //         id: value.collegeId,
        //         name: value.collegeName
        //     })
        // })
        // dispatch({
        //     type: 'HEADER',
        //     data: {
        //         ccollege
        //     }
        // })
    }
}



/**
 * 课程
 * @param {*} data 
 */
export const ll_getCourseList = (data) => {
    return dispatch => {
        request('/api/public/getCourseList', data, (res) => {
            if (res.result && res.data) {
                let data = res.data;
                let course = [];
                data.map((value) => {
                    course.push({
                        id: value.courseId,
                        name: value.courseName
                    })
                })
                dispatch({
                    type: 'HEADER',
                    data: {
                        course
                    }
                })

            } else {
                message.warn(res.message)
            }
        }, () => {
            dispatch({
                type: 'HEADER',
                data: {
                    course: []
                }
            })
        })
        // let data = [
        //     { courseName: "半导体专业实验", courseId: "Specialty" },
        //     { courseName: "材料的力学性能测试", courseId: "Measurement" },
        //     { courseName: "人工智能程序设计", courseId: "Artificial" },
        //     { courseName: "变质量系统热力学与新型回转压", courseId: "Variable" }
        // ]
        // let course = [];
        // data.map((value) => {
        //     course.push({
        //         id: value.courseId,
        //         name: value.courseName
        //     })
        // })
        // dispatch({
        //     type: 'HEADER',
        //     data: {
        //         course
        //     }
        // })
    }
}

/**
 * 改变课程
 * @param {*} data 
 */
export const ll_changeCouse = (data)=>{
    return dispatch=>{
        dispatch({
            type:'HEADER',
            data:{
                course:data
            }
        })
    }
}

/**
 * 改变老师
 * @param {*} data 
 */
export const ll_changeTeacher = (data)=>{
    return dispatch=>{
        dispatch({
            type:'HEADER',
            data:{
                teacher:data
            }
        })
    }
}

/**
 * 改变学院
 * @param {*} data 
 */
export const ll_changeCollege = (data)=>{
    return dispatch=>{
        dispatch({
            type:'HEADER',
            data:{
                college:data
            }
        })
    }
}