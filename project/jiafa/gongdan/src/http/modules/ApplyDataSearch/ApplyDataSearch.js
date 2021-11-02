import axios from '../../axios'

// 获取报名数据列表
export const getApplyDataList = (data) => {
  return axios({
    url: "/getApplyDataList",
    method: "post",
    data
  })
}

// 获取所属机构树
export const getAffiliationTree = (data) => {
  return axios({
    url: "/getAffiliationTree",
    method: "post",
    data
  })
}