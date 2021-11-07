import axios from '../../axios'

//获取提交机构列表
export const getAlterCommitOrgList = (data) => {
    return axios({
        url: "/getAlterCommitOrgList",
        method: "post",
        data
    })
}
//获取变更统计列表
export const getAlterStatList = (data) => {
    return axios({
        url: "/getAlterStatList",
        method: "post",
        data
    })
}
//获取工单审核列表
export const getAlterAuditOrderList = (data) => {
    return axios({
        url: "/getAlterAuditOrderList",
        method: "post",
        data
    })
}
//获取审核考生列表
export const getAlterAuditExamineeList = (data) => {
    return axios({
        url: "/getAlterAuditExamineeList",
        method: "post",
        data
    })
}