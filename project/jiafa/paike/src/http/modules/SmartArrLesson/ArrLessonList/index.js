/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-08 09:05:18
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-09 13:04:15
 */
import axios from "../../../axios";

export const getQueueup = (data) => {
  // console.log(data);
  return axios({
    url: "/CA_Plan/getQueueup",
    method: "post",
    data,
  });
};

export const autoArrangeDataList = (data) => {
  // console.log(data);
  return axios({
    url: "/CA_CourseTable/autoArrangeDataList",
    method: "post",
    data,
  });
};

export const outQueueup = (data) => {
  return axios({
    url: "/CA_Plan/outQueueup",
    method: "post",
    data,
  });
};
// 获取排课方案列表
export const getArrLessonList = (data) => {
  return axios({
    url: "/CA_Plan/getArrLessonList",
    method: "post",
    data,
  });
};

// 批量删除排课方案
export const delArrLesson = (data) => {
  return axios({
    url: "/CA_Plan/delArrLesson",
    method: "post",
    data,
  });
};

// 新增排课方案
export const createArrLessonId = (data) => {
  return axios({
    url: "/CA_Plan/createArrLessonId",
    method: "post",
    data,
  });
};

// 发布排课方案
export const publishArrLesson = (data) => {
  return axios({
    url: "/CA_Plan/publishArrLesson",
    method: "post",
    data,
  });
};

// 方案启用
export const UpdatePlanEnable = (data) => {
  return axios({
    url: "/CA_Rule/UpdatePlanEnable",
    method: "post",
    data,
  });
};
// 获取自习班分班结果表格数据
export const getClassListPaging = (data) => {
  return axios({
    url: "/Ca_Study_Class/getCa_Study_ClassListPaging",
    method: "post",
    data,
  });
};
// 自习课分班
export const createStudyClass = (data) => {
  return axios({
    url: "/Ca_Study_Class/createStudyClass",
    method: "post",
    data,
  });
};
// 获取周次
export const GetStudyClassWeek = (data) => {
  return axios({
    url: "/Ca_Study_Class/GetStudyClassWeek",
    method: "post",
    data,
  });
};
// 根据周次获取节次
export const GetStudyClassSection = (data) => {
  return axios({
    url: "/Ca_Study_Class/GetStudyClassSection",
    method: "post",
    data,
  });
};
// 获取自习班学生分班表格数据
export const getStudyClassStuPaging = (data) => {
  return axios({
    url: "/Ca_Study_Class/getStudyClassStuPaging",
    method: "post",
    data,
  });
};
// 根据周次，节次获取班级
export const GetStudyClassClass = (data) => {
  return axios({
    url: "/Ca_Study_Class/GetStudyClassClass",
    method: "post",
    data,
  });
};
// 更新排课方案名
export const updatePlanCode = (data) => {
  return axios({
    url: "/CA_Plan/updatePlanCode",
    method: "post",
    data,
  });
};
