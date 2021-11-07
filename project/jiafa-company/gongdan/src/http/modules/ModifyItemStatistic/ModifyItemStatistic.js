import axios from '../../axios'

//获取变更项统计列表
export const getStatisticChangeItemList = (data) => {
  return axios({
    url: "/getStatisticChangeItemList",
    method: "post",
    data
  })
}

//获取变更项查询条件
export const getChangeItemConditionList = (data) => {
  return axios({
    url: "/getChangeItemConditionList",
    method: "post",
    data
  })
}

//获取变更项考生列表
export const getExamineeChangeItemList = (data) => {
  return axios({
    url: "/getExamineeChangeItemList",
    method: "post",
    data
  })
}


//获取变更项考生列表
export const getLowerOrgExamineeChangeItemList = (data) => {
  return axios({
    url: "/getLowerOrgExamineeChangeItemList",
    method: "post",
    data
  })
}