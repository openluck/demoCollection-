import axios from '../../axios'

// 考生跨地区分配-获取考生列表
export const getList = (data) => {
    return axios({
        url: "/croAreaDistributStu/getExamineeList",
        method: "post",
        data
    })
}

// 考生跨地区分配-获取考籍所在地 树
export const examMemLocationTree = (data) => {
    return axios({
        url: "/croAreaDistributStu/examMemLocationTree",
        method: "post",
        data
    })
}

// 考生跨地区分配-获取体检所在地 树
export const phyExamLocationTree = (data) => {
    return axios({
        url: "/croAreaDistributStu/phyExamLocationTree",
        method: "post",
        data
    })
}


// 考生跨地区分配-导出Excel
export const exportExcel = (data) => {
    return axios({
        url: "/croAreaDistributStu/exportExaminee",
        method: "post",
        responseType: "blob",
        data
    })
}
