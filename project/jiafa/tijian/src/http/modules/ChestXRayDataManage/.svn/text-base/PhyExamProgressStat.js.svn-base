import axios from '../../axios'

// 体检进度-获取列表
export const getList = (data) => {
    return axios({
        url: "/chestRayNumber/getList",
        method: "post",
        data
    })
}
// 体检统计-导出
export const getExport = (data) => {
  return axios({
      url: "/chestRayNumber/export",
      method: "post",
      data,
      responseType: 'blob'
  })
}