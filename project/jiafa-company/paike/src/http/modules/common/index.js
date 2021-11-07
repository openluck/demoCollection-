/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-08 17:58:45
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-21 17:39:22
 */
import axios from '../../axios'

/**
 * @description 公共分类  接口地址列表
 * @param { Object } params
 * @returns { Promise }
 */

// 文件上传
export const uploadExcel = (data) => {
  return axios({
    url: '/Common/uploadExcel',
    method: 'post',
    data,
  })
}
// 模板下载
export const downExcelTep = (data) => {
  return axios({
    url: '/Common/downExcelTep',
    method: 'post',
    data,
  })
}
// 根据机构OrganizationId获取年级信息
export const getGradesListByOrganizationId = (data) => {
  return axios({
    url: '/Common/getGradesListByOrganizationId',
    method: 'post',
    data,
  })
}
// 获取教室（场所）结构树
export const getClassroomTree = (data) => {
  return axios({
    url: '/Common/getClassroomTree',
    method: 'post',
    data,
  })
}
// 排课规则-作用课程
export const getActionCourse = (data) => {
  return axios({
    url: '/Common/getActionCourse',
    method: 'post',
    data,
  })
}
// 下载导入选课活动错误信息
export const downExcelError = (data) => {
  return axios({
    url: '/Common/downExcelError',
    method: 'post',
    data,
  })
}
// 获取学生列表树
export const getStudentsTree = (data) => {
  return axios({
    url: '/Common/getStudentsTree',
    method: 'post',
    data,
  })
}
// 作用人员
export const getActionPerson = (data) => {
  return axios({
    url: '/Common/getActionPerson',
    method: 'post',
    data,
  })
}
