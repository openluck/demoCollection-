import axios from '../../axios'

// 校验数据管理 - 获取校验列表
export const getList = (data) => {
  return axios({
    url: '/checkData/getList',
    method: 'post',
    data,
  })
}

// 校验数据管理 - 导出校验列表
export const exportExcel = (data) => {
  return axios({
    url: '/checkData/export',
    method: 'post',
    responseType: 'blob',
    data,
  })
}

// 校验数据管理 - 进行校验
export const check = (data) => {
  return axios({
    url: '/checkData/check',
    method: 'post',
    timeout: 1000 * 60 * 15,
    data,
  })
}
