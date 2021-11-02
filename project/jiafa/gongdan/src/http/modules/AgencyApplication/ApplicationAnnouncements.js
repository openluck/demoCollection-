//应用通知公告

import axios from '../../axios'

//应用通知公告-查询应用通知公告
export const getNOAList = (data) => {
    return axios({
        url: "/appManagement/getNOAList",
        method: "post",
        data
    })
}

//应用通知公告-编辑应用通知公告
export const changeNOA = (data) => {
    return axios({
        url: "/appManagement/changeNOA",
        method: "post",
        data
    })
}
//应用通知公告-删除应用通知公告（单个，批量）
export const delateNOA = (data) => {
    return axios({
        url: "/appManagement/delateNOA",
        method: "post",
        data
    })
}
