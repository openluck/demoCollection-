import axios from '../../axios'

// 胸透-获取列表
export const getList = (data) => {
    return axios({
        url: "/laboratoryNumber/getList",
        method: "post",
        data
    })
}
// 胸透-导出
export const getExport = (data) => {
  return axios({
      url: "/laboratoryNumber/export",
      method: "post",
      data,
      responseType: 'blob'
  })
}