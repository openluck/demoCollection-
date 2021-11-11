/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-01-28 19:15:37
 * @LastEditors: went
 * @LastEditTime: 2021-08-27 15:55:43
 */
import axios from "../../axios";

// token鉴权
export const getMenuList = (data) => {
  return axios({
    url: "/public/getMenuList",
    method: "post",
    data,
  });
};

// 获取用户信息
export const getUserInfo = (data) => {
  return axios({
    url: "/public/getUserInfo",
    method: "post",
    data,
  });
};
// 获取学年学期、学段年级
export const getBasicList = (data) => {
  return axios({
    url: "/public/getBasicList",
    method: "post",
    data,
  });
};
// 根据学期获取教学周
export const getTeachWeekBySemester = (data) => {
  return axios({
    url: "/public/getTeachWeekBySemester",
    method: "post",
    data,
  });
};

// 根据年级获班级
export const getClassByGrade = (data) => {
  return axios({
    url: "/public/getClassByGrade",
    method: "post",
    data,
  });
};
// 根据科目获取老师
export const getTeacherBySub = (data) => {
  return axios({
    url: "/public/getTeacherBySubject",
    method: "post",
    data,
  });
};

// 根据班级获取学生
export const getStuByClass = (data) => {
  return axios({
    url: "/public/getStuByClass",
    method: "post",
    data,
  });
};

// 根据日期获取对应教学周
export const getTeachWeekByDate = (data) => {
  return axios({
    url: "/public/getTeachWeekByDate",
    method: "post",
    data,
  });
};
// 获取人员课表（合）
export const getStuTimetable = (data) => {
  return axios({
    url: "/timetableAdjust/getStuTimetable",
    method: "post",
    data,
  });
};
// 获取场所课表（合）
export const getPlaceTimetable = (data) => {
  return axios({
    url: "/timetableAdjust/getPlaceTimetable",
    method: "post",
    data,
  });
};
// 获取班级课表（合）
export const getClassTimetable = (data) => {
  return axios({
    url: "/timetableAdjust/getClassTimetable",
    method: "post",
    data,
  });
};
// 课表调整记录（课表调整公共接口）
export const getRecordList = (data) => {
  return axios({
    url: "/timetableAdjust/getRecordList",
    method: "post",
    data,
  });
};

// 获取场所树（完整）
export const getAllPlaceTree = (data) => {
  return axios({
    url: "/public/getAllPlaceTree",
    method: "post",
    data,
  });
};

// 获取场所树（到楼层）
export const getPlaceTree = (data) => {
  return axios({
    url: "/public/getPlaceTree",
    method: "post",
    data,
  });
};

// 根据楼层获取教室
export const getClassroom = (data) => {
  return axios({
    url: "/public/getClassroom",
    method: "post",
    data,
  });
};

// 根据学段获取科目
export const getSubjecByStudySec = (data) => {
  return axios({
    url: "/public/getSubjecByStudySec",
    method: "post",
    data,
  });
};

// 根据学年学期获取学段、年级、班级列表
export const getGradeList = (data) => {
  return axios({
    url: "/public/getGradeList",
    method: "post",
    data,
  });
};

// 应用到其他周次
export const applyOtherWeek = (data) => {
  return axios({
    url: "/timetableAdjust/applyOtherWeek",
    method: "post",
    data,
  });
};

