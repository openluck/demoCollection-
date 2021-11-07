import axios from '../../axios'

//跨地区考生查询
export const TransRegionalExamineeList = (data) => {
    return axios({
        url: '/croAreaDistributStu/getExamineeList',
        method: 'post',
        data
    })
}

//编排结果查询
export const arrangeResultList = (data) => {
  return axios({
      url: '/arrangeResultQuery/getList',
      method: 'post',
      data
  })
}

//复查考生查询
export const reviewExamineeList = (data) => {
  return axios({
      url: '/reviewExamineeQuery/getList',
      method: 'post',
      data
  })
}

//复检考生查询
export const recheckExamineeList = (data) => {
  return axios({
      url: '/recheckExamineeQuery/getList',
      method: 'post',
      data
  })
}

//不予录取查询
export const refuseAdmitList = (data) => {
  return axios({
      url: '/refuseAdmitQuery/getList',
      method: 'post',
      data
  })
}

//漏检考生查询
export const lossExamineeList = (data) => {
  return axios({
      url: '/lossExamineeQuery/getList',
      method: 'post',
      data
  })
}

//缺检考生查询
export const missingExamineeList = (data) => {
  return axios({
      url: '/missingExamineeQuery/getList',
      method: 'post',
      data
  })
}

//体检情况统计
export const physicalConditionList = (data) => {
  return axios({
      url: '/physicalConditionStatistics/getList',
      method: 'post',
      data
  })
}

//体检进度统计
export const physicalProgressList = (data) => {
  return axios({
      url: '/physicalProgressStatistics/getList',
      method: 'post',
      data
  })
}

//体检受限统计
export const physicalLimitationList = (data) => {
  return axios({
      url: '/physicalLimitationStatistics/getList',
      method: 'post',
      data
  })
}

//导出
export const allExport = (data) => {
  return axios({
      url: '/physicalQueryStatistics/allExport',
      method: 'post',
      responseType: "blob",
      data
  })
}