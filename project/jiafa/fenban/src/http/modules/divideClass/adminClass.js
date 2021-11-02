/*
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-25 09:02:01
 * @LastEditors: xutao
 * @LastEditTime: 2021-04-30 17:03:09
 */

import axios from '../../axios'

//行政班级-查看行政班人员名单list
export const getStuInAdminClass = (data) => {
  return axios({
    url: '/DC_Class/getStuInAdminClass',
    method: 'post',
    data,
  })
}
//行政班级-删除行政班级
export const delAdminClass = (data) => {
  return axios({
    url: '/DC_Class/delAdminClass',
    method: 'post',
    data,
  })
}

//组合操作-删除行政班级中的组合
export const delCombination = (data) => {
  return axios({
    url: '/DC_Class/delCombination',
    method: 'post',
    data,
  })
}

//组合操作-编辑行政班级中的组合
export const updateCombination = (data) => {
  return axios({
    url: '/DC_Class/updateCombination',
    method: 'post',
    data,
  })
}
//组合操作-获取组合下的学生list
//新建行政班级-获取科目组合下可以添加的学生List（分页查询）
export const getStuListInCombination = (data) => {
  return axios({
    url: '/DC_Class/getStuListInCombination',
    method: 'post',
    data,
  })
}

//教学班级-获取组合下的学生list
export const getStuInTeachClass = (data) => {
  return axios({
    url: '/DC_Class/getStuInTeachClass',
    method: 'post',
    data,
  })
}
//教学班级-获取组合下的学生list
export const getKHBTeachClassList = (data) => {
  return axios({
    url: '/DC_Class/getKHBTeachClassList',
    method: 'post',
    data,
  })
}

//教学班级-合并教学班级
export const mergeTeachClass = (data) => {
  return axios({
    url: '/DC_Class/mergeTeachClass',
    method: 'post',
    data,
  })
}
//教学班操作-合并教学班-组合下未走班人员
export const getGroupGoClassStuList = (data) => {
  return axios({
    url: '/DC_Class/getGroupGoClassStuList',
    method: 'post',
    data,
  })
}
//教学班级-合并教学班级
export const cancelMergeTeachClass = (data) => {
  return axios({
    url: '/DC_Class/cancelMergeTeachClass',
    method: 'post',
    data,
  })
}

//新建行政班级-获取科目组合下可以添加的学生List（分页查询）
export const getStuListInCombinationInClass = (data) => {
  return axios({
    url: '/DC_Class/getStuListInCombinationInClass',
    method: 'post',
    data,
  })
}
// 新建- 新建行政班级
export const addAdminClass = (data) => {
  return axios({
    url: '/DC_Class/addAdminClass',
    method: 'post',
    data,
  })
}

export const getSaveData = (data) => {
  return axios({
    url: '/DC_Class/getSaveData',
    method: 'post',
    data,
  })
}
