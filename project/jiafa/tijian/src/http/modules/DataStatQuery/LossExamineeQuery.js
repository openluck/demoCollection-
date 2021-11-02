import axios from '../../axios'

// 漏检考生查询-获取列表
export const getList = (data) => {
    return axios({
        url: "/leakDetection/getList",
        method: "post",
        data
    })
}
// 漏检考生查询-获取科室列表
export const getDepartments = (data) => {
    return axios({
        url: "/leakDetection/getDepartments",
        method: "post",
        data
    })
}