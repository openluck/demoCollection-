import axios from '../../axios'

//获取变更列表
export const getAlterList = (data) => {
  return axios({
    url: "/getAlterList",
    method: "post",
    data
  })
}
//获取变更列表
export const exportExcelInSearch = (data) => {
  return axios({
    url: "/exportExcelInSearch",
    method: "post",
    data,
    responseType: 'blob'
  })
}