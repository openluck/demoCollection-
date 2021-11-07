import axios from '../../axios'

// 跨地区分配审核 -详情- 获取考生列表
export const getExamineeList = (data) => {
    return axios({
        url: "/croAreaDistAudit/getExamineeList",
        method: "post",
        data
    })
}

// 跨地区分配审核 - 详情 -获取考籍所在地 树
export const examMemLocationTree = (data) => {
    return axios({
        url: "/croAreaDistAudit/examMemLocationTree",
        method: "post",
        data
    })
}

// 跨地区分配审核 - 详情 --获取体检所在地 树
export const phyExamLocationTree = (data) => {
    return axios({
        url: "/croAreaDistAudit/phyExamLocationTree",
        method: "post",
        data
    })
}

// 跨地区分配审核 -详情- 导出
export const exportExaminee = (data) => {
    return axios({
        url: "/croAreaDistAudit/exportExaminee",
        method: "post",
        responseType: "blob",
        data
    })
}
