/**
 * @description 报考数据统计
 * @param { Object } data
 * @returns { Promise }
 * @date 2021-1-29 10:19:15
 */

import axios from '../../axios'


// 报考数据统计-获取报考类型统计报表
export const getApplyTypeStatistical = (data) => {
  return axios({
    url: "/getApplyTypeStatistical",
    method: "post",
    data
  })
}


// 报考数据统计-获取艺体考生统计报表
export const getApplyArtStatistical = (data) => {
  return axios({
    url: "/getApplyArtStatistical",
    method: "post",
    data
  })
}


// 报考数据统计-获取对口职教考生统计报表
export const getApplyDKStatistical = (data) => {
  return axios({
    url: "/getApplyDKStatistical",
    method: "post",
    data
  })
}


// 报考数据统计-获取对口职教考生统计报表
export const exportStatisticalList = (data) => {
  return axios({
    url: "/exportStatisticalList",
    method: "post",
    data,
    responseType: 'blob'
  })
}