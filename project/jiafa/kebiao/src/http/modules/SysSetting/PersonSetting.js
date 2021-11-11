import axios from '../../axios'

// 获取角色列表
export const getRoleList = (data) => {
  return axios({
    url: "/sysSetting/getRoleList",
    method: "post",
    data
  })
}
/**
 * 行政人员模块
 *
 **/
// 获取行政机构树
export const getAdministrativeAgencyTree = (data) => {
  return axios({
    url: "/sysSetting/getAdministrativeAgencyTree",
    method: "post",
    data
  })
}
// 获取教学机构树
export const getTeachingAgencyTree = (data) => {
  return axios({
    url: "/sysSetting/getTeachingAgencyTree",
    method: "post",
    data
  })
}
// 模糊查询行政人员List
export const getFuzzyAdminPersonList = (data) => {
  return axios({
    url: "/sysSetting/getFuzzyAdminPersonList",
    method: "post",
    data
  })
}
// 模糊查询行政人员List
export const getStaffInRoleList = (data) => {
  return axios({
    url: "/sysSetting/getStaffInRoleList",
    method: "post",
    data
  })
}


/**
 * 学生模块
 *
 */

// 模糊查询学生List
export const getFuzzyStudentList = (data) => {
  return axios({
    url: '/sysSetting/getFuzzyStudentList',
    method: 'post',
    data
  })
}

// 获取角色下人员列表（学生列表）
export const getStudentInRoleList = (data) => {
  return axios({
    url: '/sysSetting/getStudentInRoleList',
    method: 'post',
    data
  })
}


/**
 * 家长模块
 *
 */

// 模糊查询家长List
export const getFuzzyParentList = (data) => {
  return axios({
    url: '/sysSetting/getFuzzyParentList',
    method: 'post',
    data
  })
}

// 获取家长表格数据
export const getParentInRoleList = (data) => {
  return axios({
    url: '/sysSetting/getParentInRoleList',
    method: 'post',
    data
  })
}


/**
 * 
 * 自定义角色
 */

// 移除人员
export const delPerson = (data) => {
  return axios({
    url: '/sysSetting/delPerson',
    method: 'post',
    data
  })
}

// 获取全部教师列表
export const getAllTeacherList = (data) => {
  return axios({
    url: '/sysSetting/getAllTeacherList',
    method: 'post',
    data
  })
}

// 添加人员
export const addPerson = (data) => {
  return axios({
    url: '/sysSetting/addPerson',
    method: 'post',
    data
  })
}