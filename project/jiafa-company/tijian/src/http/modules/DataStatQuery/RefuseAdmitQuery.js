import axios from '../../axios'

// 不予录取查询-获取列表
export const getList = (data) => {
    return axios({
        url: "/notEnroll/getList",
        method: "post",
        data,
    })
}