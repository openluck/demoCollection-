//机构和账户
import axios from '../../axios'

//新增编辑机构
export const addOrg = (data) => {
    return axios({
        url: "/organization/addOrg",
        method: "post",
        data
    })
}

//查询机构
export const getOrgList = (data) => {
    return axios({
        url: "/organization/getOrgList",
        method: "post",
        data
    })
}

//删除机构
export const delateOrg = (data) => {
    return axios({
        url: "/organization/delateOrg",
        method: "post",
        data
    })
}

//查询接入应用列表
export const getAppList = (data) => {
    return axios({
        url: "/organization/getAppList",
        method: "post",
        data
    })
}

//查询接入应用列表
export const appInfo = (data) => {
    return axios({
        url: "/organization/appInfo",
        method: "post",
        data
    })
}