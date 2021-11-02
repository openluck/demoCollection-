import axios from '../../axios'

// 考生跨地区分配-获取申请列表
export const getApplyList = (data) => {
    return axios({
        url: "/croAreaDistributStu/getApplyList",
        method: "post",
        data
    })
}

// 考生跨地区分配-获取接收机构 树
export const receiveOrgCodeTree = (data) => {
    return axios({
        url: "/croAreaDistributStu/receiveOrgCodeTree",
        method: "post",
        data
    })
}

// 考生跨地区分配-获取申请日期
export const applyDateList = (data) => {
    return axios({
        url: "/croAreaDistributStu/applyDateList",
        method: "post",
        data
    })
}

// 考生跨地区分配-导入-下载模板
export const downloadTemplate = (data) => {
    return axios({
        url: "/croAreaDistributStu/downloadTemplate",
        method: "post",
        responseType: "blob",
        data
    })
}

// 考生跨地区分配-导入-上传文件
export const uploadExcel = (data) => {
    console.log("data", data);
    return axios({
        url: "/croAreaDistributStu/uploadExcel",
        method: "post",
        headers: {
            'Content-Type': "multipart/form-data"
        },
        responseType: "blob",
        timeout: 1000 * 60 * 5,
        // "headers-Content-Type": "multipart/form-data",
        data
    })
}

// 考生跨地区分配-导出Excel
export const exportExcel = (data) => {
    return axios({
        url: "/croAreaDistributStu/exportExcel",
        method: "post",
        responseType: "blob",
        data
    })
}

