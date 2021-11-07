import axios from '../../axios'

// 获取角色列表
export const getRoleList = (data) => {
  return axios({
    url: "/sysSetting/getRoleAndPermissionList",
    method: "post",
    data
  })
}
// 修改角色
export const updateRole = (data) => {
  return axios({
    url: "/sysSetting/updateRole",
    method: "post",
    data
  })
}

// 删除角色
export const delRole = (data) => {
  return axios({
    url: "/sysSetting/delRole",
    method: "post",
    data
  })
}
// 新增角色
export const addRole = (data) => {
  return axios({
    url: "/sysSetting/addRole",
    method: "post",
    data
  })
}
// 编辑菜单权限
export const updateMenuPermission = (data) => {
  return axios({
    url: "/sysSetting/updateMenuPermission",
    method: "post",
    data
  })
}