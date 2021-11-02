import axios from '../../axios'

// 结论重置审核 - 获取列表
export const getList = (data) => {
    return axios({
        url: "/resultReset/getList",
        method: "post",
        data
    })
}

// 结论重置审核 -  结论重置审核
export const save = (data) => {
  return axios({
      url: "/resultReset/save",
      method: "post",
      data
  })
}

// 结论重置审核 - 导出Excel
export const exportExcel = (data) => {
  return axios({
      url: "/resultReset/export",
      method: "post",
      data,
      responseType: 'blob'
  })
}