/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-09 09:57:30
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-21 13:01:12
 */
import axios from "../../../axios";

// 获取节次
export const getClassSectionList = (data) => {
  return axios({
    url: "/CA_Plan/getClassSectionList",
    method: "post",
    data,
  });
};

// 设置节次
export const setClassSection = (data) => {
  return axios({
    url: "/CA_Plan/setClassSection",
    method: "post",
    data,
  });
};
