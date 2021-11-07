import axios from '../../axios'

// 体检情况统计-获取列表
export const getList = (data) => {
    return axios({
        url: "/PEPlanStatistics/getList",
        method: "post",
        data
    })
}
// 体检情况统计-导出
export const allExport = (data) => {
  return axios({
      url: "/dataStatistics/allExport",
      method: "post",
      data,
      responseType: 'blob'
  })
}
// 体检情况统计-获取日期
export const getMedicalDate = (data) => {
    return axios({
        url: "/getAmendDate",
        method: "post",
        data
    })
}