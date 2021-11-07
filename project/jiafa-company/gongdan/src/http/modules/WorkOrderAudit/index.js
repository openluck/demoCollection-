import axios from '../../axios'

// 平台统计

//统计总数
export const getAuditOrderList = (data) => {
    return axios({
        url: "/workOrderAudit/getAuditOrderList",
        method: "post",
        data
    })
}
//获取退回意见考生列表
export const getReOpExamiee = (data) => {
    return axios({
        url: "/workOrderAudit/getReOpExamiee",
        method: "post",
        data
    })
}
//签字确认提交-二维码获取
export const signConfirm = (data) => {
    return axios({
        url: "/workOrderAudit/signConfirm",
        method: "post",
        data
    })
}
//获取工单详情-即考生列表
export const getExamineeList = (data) => {
    return axios({
        url: "/workOrderAudit/getExamineeList",
        method: "post",
        data
    })
}
//获取审核记录
export const getAuditLogList = (data) => {
    return axios({
        url: "/workOrderAudit/getAuditLog",
        method: "post",
        data
    })
}
//退回-获取详细退回意见列表
export const getBackOpinionList = (data) => {
    return axios({
        url: "/workOrderAudit/getBackOpinionList",
        method: "post",
        data
    })
}
//获取审核记录详情
export const getAuditLogDetails = (data) => {
    return axios({
        url: "/workOrderAudit/auditLogDetails",
        method: "post",
        data
    })
}
// 退回-退回工单确定操作
export const backupWorkOrder = (data) => {
    return axios({
        url: "/workOrderAudit/backupWorkOrder",
        method: "post",
        data
    })
}
// 获取变更项列表
export const getChangeItemList = (data) => {
    return axios({
        url: "/workOrderAudit/getInfoAndChangeList",
        method: "post",
        data
    })
}
// 获取信息修改日志
export const getChangeLogList = (data) => {
    return axios({
        url: "/workOrderAudit/getChangeLogList",
        method: "post",
        data
    })
}
// 考生数据修改-保存考生退回意见
export const saveReOption = (data) => {
    return axios({
        url: "/workOrderAudit/saveBackOpinion",
        method: "post",
        data
    })
}

