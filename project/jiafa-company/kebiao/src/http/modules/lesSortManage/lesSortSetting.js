/*
 * @Descripttion: 节次设置-首页 请求
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-06 09:44:18
 * @LastEditors: YanQY
 * @LastEditTime: 2021-08-26 17:31:05
 */


import axios from '../../axios'

// 0813-节次设置-获取学段下节次方案列表
export const getLesSortPlanList = (data) => {
  return axios({
    url: "/lesSort/getLesSortPlanList",
    method: "post",
    data
  })
}

// 0813-节次设置-新增节次方案
export const addLesSortPlan = (data) => {
  return axios({
    url: "/lesSort/addLesSortPlan",
    method: "post",
    data
  })
}

// 0813-节次设置-修改节次方案
export const updateLesSortPlan = (data) => {
  return axios({
    url: "/lesSort/updateLesSortPlan",
    method: "post",
    data
  })
}

// 0813-节次设置-获取节次方案详情
export const getLesSortPlanInfo = (data) => {
  return axios({
    url: "/lesSort/getLesSortPlanInfo",
    method: "post",
    data
  })
}

// 0813-节次设置-删除节次方案
export const delLesSortPlan = (data) => {
  return axios({
    url: "/lesSort/delLesSortPlan",
    method: "post",
    data
  })
}
