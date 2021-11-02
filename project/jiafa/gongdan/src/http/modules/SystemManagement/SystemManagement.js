
/* 
 *系统管理 
*/
import axios from '../../axios'

// 码表管理-获取码表列表
export const getCodeTableList = (data) => {
    return axios({
        url: "/codeTable/list",
        method: "post",
        data
    })
}

// 码表管理-添加/修改码值
export const createAndUpdateCodeTable = (data) => {
    return axios({
        url: "/codeTable/createAndUpdate",
        method: "post",
        data
    })
}

// 码表管理-删除/批量删除
export const deleteCodeTable = (data) => {
    return axios({
        url: "/codeTable/delete",
        method: "post",
        data
    })
}

//角色管理-角色列表
export const getRolelist = (data) => {
    return axios({
        url: "/role/list",
        method: "post",
        data
    })
}

//角色管理-新增/编辑角色
export const addAndUpdateRole = (data) => {
    return axios({
        url: "/role/addAndUpdate",
        method: "post",
        data
    })
}

//角色管理-删除角色/状态切换
export const deleteAndToggleRole = (data) => {
    return axios({
        url: "/role/deleteAndToggle",
        method: "post",
        data
    })
}

//角色管理-获取分类权限列表
export const getClassifyPermissionList = (data) => {
    return axios({
        url: "/role/getClassifyPermissionList",
        method: "post",
        data
    })
}

//权限管理-获取权限列表
export const getPermissionList = (data) => {
    return axios({
        url: "/permission/list",
        method: "post",
        data
    })
}

//权限管理-新增/编辑权限
export const addAndUpdatePermission = (data) => {
    return axios({
        url: "/permission/addAndUpdate",
        method: "post",
        data
    })
}

//权限管理-删除权限
export const deletePermission = (data) => {
    return axios({
        url: "/permission/delete",
        method: "post",
        data
    })
}

// 行为日志-获取行为日志列表
export const getBehaviorLogList = (data) => {
    return axios({
        url: "/behaviorLog/list",
        method: "post",
        data
    })
}

// 个人中心-获取个人中心信息
export const getPersonalInfo = (data) => {
    return axios({
        url: "/personal/info",
        method: "post",
        data
    })
}

// 个人中心-设置个人中心信息
export const setPersonalInfo = (data) => {
    return axios({
        url: "/personal/set",
        method: "post",
        data
    })
}

// 敏感词库-获取敏感词列表
export const getSensitiveWordList = (data) => {
    return axios({
        url: "/sensitiveWord/list",
        method: "post",
        data
    })
}

// 敏感词库-新增/编辑敏感词
export const addAndUpdateSensitiveWord = (data) => {
    return axios({
        url: "/sensitiveWord/addAndUpdate",
        method: "post",
        data
    })
}

// 敏感词库-批量状态确认修改
export const statusUpdateSensitiveWord = (data) => {
    return axios({
        url: "/sensitiveWord/statusUpdate",
        method: "post",
        data
    })
}

// 敏感词库-获取批量状态
export const getbatchStatusSensitiveWord = (data) => {
    return axios({
        url: "/sensitiveWord/getbatchStatus",
        method: "post",
        data
    })
}

// 敏感词库-下载模板
export const downloadFormSensitiveWord = (data) => {
    return axios({
        url: "/sensitiveWord/downloadForm",
        method: "post",
        data
    })
}

// 敏感词库-批量新增（上传excel）
export const batchAddSensitiveWord = (data) => {
    return axios({
        url: "/sensitiveWord/batchAdd",
        method: "post",
        data
    })
}

// 敏感词库-删除敏感词
export const deleteAndToggleSensitiveWord = (data) => {
    return axios({
        url: "/sensitiveWord/deleteAndToggle",
        method: "post",
        data
    })
}

