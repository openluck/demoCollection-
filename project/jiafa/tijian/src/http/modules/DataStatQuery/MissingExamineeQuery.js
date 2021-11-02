import axios from '../../axios'

// 缺检考生查询-获取列表
export const getList = (data) => {
    return axios({
        url: "/missing/getList",
        method: "post",
        data
    })
}