/*
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: went
 * @LastEditTime: 2021-08-17 15:19:05
 */
import axios from "../../axios";

// 代课调整-获取教师的课程列表
export const getTeacherCourseList = (data) => {
  return axios({
    url: "/timetableAdjust/getTeacherCourseList",
    method: "post",
    data,
  });
};

// 代课调整-获取可代课教师列表
export const getReplaceLesTeachers = (data) => {
  return axios({
    url: "/timetableAdjust/getReplaceLesTeachers",
    method: "post",
    data,
  });
};

// 代课调整-代课调整操作
export const operateRepleceLes = (data) => {
  return axios({
    url: "/timetableAdjust/operateRepleceLes",
    method: "post",
    data,
  });
};
