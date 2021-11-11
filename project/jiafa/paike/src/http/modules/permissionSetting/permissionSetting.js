/*
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-14 09:31:21
 * @LastEditors: xutao
 * @LastEditTime: 2021-04-30 17:02:52
 */

import axios from '../../axios'

//根据token和系统类型获取系统权限
export const getSysPermissions = (data) => {
  return axios({
    url: '/SysRole/getSysPermissions',
    method: 'post',
    data,
  })
}

// 获取角色List
export const getRoleList = (data) => {
  return axios({
    url: '/SysRole/getRoleList',
    method: 'post',
    data,
  })
}

// 获取人员List
export const getPersonList = (data) => {
  return axios({
    url: '/SysRole/getPersonList',
    method: 'post',
    data,
  })
}
// 根据当前机构获取已选中的教师信息
export const getSelectedPersonList = (data) => {
  return axios({
    url: '/SysRole/getSelectedPersonList',
    method: 'post',
    data,
  })
}
// 根据当前机构获取已选中的教师信息
export const setPerson = (data) => {
  return axios({
    url: '/SysRole/setPerson',
    method: 'post',
    data,
  })
}
