import axios from '../../axios'

// admin-分班教室保存
export const addSys_Workers = (data) => {
    return axios({
        url: "/api/SysRole/addSys_Workers",
        method: "post",
        data
    })
}
// 根据当前机构获取已选中的教师信息
export const getOldTeacherList = (data) => {
    return axios({
        url: "/api/SysRole/getSelectedTeacherList",
        method: "post",
        data
    })
}
//根据用户ID和系统类型获取系统权限
export const getSysPermissions = (data) => {
    return axios({
        url: "/api/SysRole/getSysPermissions",
        method: "post",
        data
    })
}
//根据当前机构获取教师信息
export const getTeacherList = (data) => {
  return axios({
      url: "/api/SysRole/getTeacherList",
      method: "post",
      data
  })
}

//根据当前机构获取教师信息
export const getPermission = (data) => {
    return axios({
        url: "/api/SysRole/getPermissionConfigurationList",
        method: "post",
        data
    })
  }