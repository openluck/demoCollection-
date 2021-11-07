/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-08-02 15:10:36
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-20 15:05:56
 */
import axios from "../../axios";

// 获取课时统计列表
export const getClassHourStatisticList = (data) => {
  return axios({
    url: "/classHourStatistic/getClassHourStatisticList",
    method: "post",
    data,
  });
};
// 导出课时统计列表-excel
export const exportClassStatisticExcel = (data) => {
  return axios({
    url: "/classHourStatistic/exportClassStatisticExcel",
    method: "post",
    responseType: "blob",
    data,
  });
};
