/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-08-13 13:33:55
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-18 13:44:36
 */
import axios from "../../axios";
// 获取消息列表
export const getInformation = (data) => {
  return axios({
    url: "/information/getInformation",
    method: "post",
    data,
  });
};

// 标记消息已读
export const readInformation = (data) => {
  return axios({
    url: "/information/readInformation",
    method: "post",
    data,
  });
};

// 删除消息
export const delInformation = (data) => {
  return axios({
    url: "/information/delInformation",
    method: "post",
    data,
  });
};
