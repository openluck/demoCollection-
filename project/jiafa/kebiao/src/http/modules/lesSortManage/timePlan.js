/*
 * @Descripttion: 节次方案相关接口
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-10 15:47:28
 * @LastEditors: YanQY
 * @LastEditTime: 2021-08-23 16:55:25
 */
import axios from '../../axios'

// 0813-节次设置-获取时间方案列表
export const getTimePlanList = (data) => {
  return axios({
    url: "/lesSort/getTimePlanList",
    method: "post",
    data
  })
}

// 0813-节次设置-重置时间方案列表
export const resetTimePlanList = (data) => {
  return axios({
    url: "/lesSort/resetTimePlanList",
    method: "post",
    data
  })
}

// 0813-节次设置-设置时间方案使用纬度
export const setTimePlanDimension = (data) => {
  return axios({
    url: "/lesSort/setTimePlanDimension",
    method: "post",
    data
  })
}

// 0813-节次设置-获取时间方案详情
export const getTimePlanInfo = (data) => {
  return axios({
    url: "/lesSort/getTimePlanInfo",
    method: "post",
    data
  })
}

// 0813-节次设置-新增时间方案
export const addTimePlan = (data) => {
  return axios({
    url: "/lesSort/addTimePlan",
    method: "post",
    data
  })
}

// 0813-节次设置-编辑时间方案
export const updateTimePlan = (data) => {
  return axios({
    url: "/lesSort/updateTimePlan",
    method: "post",
    data
  })
}

// 0813-节次设置-删除时间方案
export const delTimePlan = (data) => {
  return axios({
    url: "/lesSort/delTimePlan",
    method: "post",
    data
  })
}
