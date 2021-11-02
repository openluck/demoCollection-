/*
 * @Author: ylc
 * @Date: 2021-08-13 09:46:03
 * @LastEditTime: 2021-09-08 14:28:34
 * @LastEditors: ylc
 * @Description: 课表管理
 * @FilePath: \Web\src\http\modules\TimetableManage\TimetableManage.js
 */
import axios from "../../axios";
import formAxios from "../../axiosFormdata"

// 获取非校本课年级导入记录
export const getSchoolNormalList = (data) => {
  return axios({
    url: "/timetableManage/getSchoolNormalList",
    method: "post",
    data
  });
};

// 获取非校本课班级导入记录列表
export const getImportRecord = (data) => {
  return axios({
    url: "/timetableManage/getImportRecord",
    method: "post",
    data
  });
};

// 获取校本课导入记录列表
export const getSchoolBasedList = (data) => {
  return axios({
    url: "/timetableManage/getSchoolBasedList",
    method: "post",
    data
  });
};

// 导入数据预览
export const previewImportTimeTable = (data) => {
  return formAxios({
    url: "/timetableManage/previewImportTimeTable",
    method: "post",
    data
  });
};

// 查询有课表数据的班级列表
export const getTimetableClassInfo = (data) => {
  return axios({
    url: "/timetableManage/getTimetableClassInfo",
    method: "post",
    data
  });
};

// 自动导入
export const autoImportTable = (data) => {
  return axios({
    url: "/timetableManage/autoImportTable",
    method: "post",
    data
  });
};

// 下载课表导入模板
export const downloadTemplate = (data) => {
  return axios({
    url: "/timetableManage/downloadTemplate",
    method: "post",
    data,
    responseType: "blob"
  });
};

// 检测导入环境
export const checkEnvironment = (data) => {
  return axios({
    url: "/timetableManage/checkEnvironment",
    method: "post",
    data
  });
};

// 最终导入
export const importTimeTableFinally = (data) => {
  return axios({
    url: "/timetableManage/importTimeTableFinally",
    method: "post",
    data
  });
};

// 查询冲突信息（分页）
export const getConflictInfoPage = (data) => {
  return axios({
    url: "/timetableManage/getConflictInfoPage",
    method: "post",
    data
  });
};
