import axios from '../../axios'

// 跨地区分配审核 - 获取审核列表
export const getAuditList = (data) => {
    return axios({
        url: "/croAreaDistAudit/getAuditList",
        method: "post",
        timeout: 1000 * 60 * 5,
        data
    })
}

// 跨地区分配审核 - 获取申请机构树
export const getApplyOrgCodeTree = (data) => {
    return axios({
        url: "/croAreaDistAudit/getApplyOrgCodeTree",
        method: "post",
        data
    })
}

// 跨地区分配审核 - 获取申请日期
export const applyDateList = (data) => {
    return axios({
        url: "/croAreaDistAudit/applyDateList",
        method: "post",
        data
    })
}

// 跨地区分配审核 - 获取审核日期
export const auditDateList = (data) => {
    return axios({
        url: "/croAreaDistAudit/auditDateList",
        method: "post",
        data
    })
}

// 跨地区分配审核 - 审核
export const audit = (data) => {
    return axios({
        url: "/croAreaDistAudit/audit",
        method: "post",
        data
    })
}

// 跨地区分配审核 - 导出
export const exportApply = (data) => {
    return axios({
        url: "/croAreaDistAudit/exportApply",
        method: "post",
        responseType: "blob",
        data
    })
}

