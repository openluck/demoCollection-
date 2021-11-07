/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-10 16:30:32
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-15 14:35:45
 */
import axios from "../../../../axios";
// 教师任教安排-获取老师列表-弹窗

export const getTeacherDialogList = (data) => {
  return axios({
    url: "/ArrLession/getTeacherDialogList",
    method: "post",
    data,
  });
};
// 教师任教安排-获取教研组
export const getTeachGroup = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeachGroup",
    method: "post",
    data,
  });
};

// 教师任教安排-获取教研组列表-弹窗
export const getTeachGroupDialogList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeachGroupDialogList",
    method: "post",
    data,
  });
};

// 教师任教安排-获取任教老师列表
export const getTeacherGroupList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeacherGroupList",
    method: "post",
    data,
  });
};
