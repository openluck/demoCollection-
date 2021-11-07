import axios from '../../axios'

// 编排结果管理- 获取列表
export const getList = (data) => {
    return axios({
        url: "/arrangedResultManage/getList",
        method: "post",
        data
    })
}

// 编排结果管理- 导出
export const exportExcel = (data) => {
    return axios({
        url: "/arrangedResultManage/export",
        method: "post",
        responseType: 'blob',
        data
    })
}

// 编排结果管理- 获取体检日期 午别 分组 列表
export const getDateGroupList = (data) => {
    return axios({
        url: "/arrangedResultManage/getDateGroupList",
        method: "post",
        data
    })
}

// 编排结果管理- 编辑
export const edit = (data) => {
    return axios({
        url: "/arrangedResultManage/edit",
        method: "post",
        data
    })
}
