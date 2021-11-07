/*
 * @Descripttion: 时段管理请求
 * @version: 
 * @Author: YanQY
 * @Date: 2021-07-29 11:07:32
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-16 20:51:45
 */
import axios from '../../axios'

// 时段设置-获取时段列表
export const getDiffNoonList = (data) => {
  return axios({
    url: "/lesSort/getDiffNoonList",
    method: "post",
    data
  })
}

// 时段设置-新增时段
export const addDiffNoon = (data) => {
  return axios({
    url: "/lesSort/addDiffNoon",
    method: "post",
    data
  })
}

// 时段设置-编辑时段
export const updateDiffNoon = (data) => {
  return axios({
    url: "/lesSort/updateDiffNoon",
    method: "post",
    data
  })
}

// 时段设置-删除时段
export const deleteDiffNoon = (data) => {
  return axios({
    url: "/lesSort/deleteDiffNoon",
    method: "post",
    data
  })
}