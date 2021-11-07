/*
 * @Description: 学生换课接口
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-02 15:07:53
 * @LastEditors: cb
 * @LastEditTime: 2021-08-16 13:36:57
 */
import axios from '../../axios'

//学生换课

// 学生换课-查询学生（班级）是否有走班课
export const getHaveTimetable = (data) => {
  return axios({
    url: "/timetableAdjust/getHaveTimetable",
    method: "post",
    data
  })
}  
// 学生换课-获取学生的课程列表
export const getStuCoureseList = (data) => {
  return axios({
    url: "/timetableAdjust/getStuCoureseList",
    method: "post",
    data
  })
}
// 学生换课-获取可换课课程列表
export const getCgableCourseList = (data) => {
  return axios({
    url: "/timetableAdjust/getCgableCourseList",
    method: "post",
    data
  })
}
// 学生换课-换课操作
export const operateChangeLes = (data) => {
  return axios({
    url: "/timetableAdjust/operateChangeLes",
    method: "post",
    data
  })
}

