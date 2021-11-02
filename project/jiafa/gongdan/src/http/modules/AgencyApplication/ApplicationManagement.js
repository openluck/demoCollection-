//应用管理
import axios from '../../axios'

//应用管理-查询应用
export const getAppList = (data) => {
    return axios({
        url: "/appManagement/getAppList",
        method: "post",
        data
    })
}

//应用管理-添加/编辑应用
export const addApp = (data) => {
    return axios({
        url: "/appManagement/addApp",
        method: "post",
        data
    })
}

//应用管理-应用排序
export const appSort = (data) => {
    return axios({
        url: "/appManagement/appSort",
        method: "post",
        data
    })
}

//应用管理-删除应用和更改应用状态
export const delateApp = (data) => {
    return axios({
        url: "/appManagement/delateApp",
        method: "post",
        data
    })
}

//应用管理-接入功能列表
export const getFunList = (data) => {
    return axios({
        url: "/appManagement/getFunList",
        method: "post",
        data
    })
}

//应用管理-获取秘钥、回调配置
export const getAppKey = (data) => {
    return axios({
        url: "/appManagement/getAppKey",
        method: "post",
        data
    })
}

//应用管理-接入秘钥
export const changeKey = (data) => {
    return axios({
        url: "/appManagement/changeKey",
        method: "post",
        data
    })
}

//应用管理-回调配置
export const changeCallBack = (data) => {
    return axios({
        url: "/appManagement/changeCallBack",
        method: "post",
        data
    })
}