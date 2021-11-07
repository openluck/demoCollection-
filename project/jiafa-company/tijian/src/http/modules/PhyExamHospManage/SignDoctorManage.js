import axios from '../../axios'

// 签名医生管理-获取医生列表
export const getList = (data) => {
    return axios({
        url: "/doctor/getList",
        method: "post",
        data
    })
}

// 签名医生管理-删除医生
export const deletedoctor = (data) => {
  return axios({
      url: "/doctor/delete",
      method: "post",
      data
  })
}

// 签名医生管理-签名医生设置
export const save = (data) => {
  return axios({
      url: "/doctor/save",
      method: "post",
      data
  })
}

// 签名医生管理-签名医生导出
export const exportDoctor = (data) => {
  return axios({
      url: "/doctor/export",
      method: "post",
      data,
      responseType: 'blob'
  })
}

// 签名医生管理-根据科室获取医生
export const getDoctor = (data) => {
  return axios({
      url: "/doctor/getDoctor",
      method: "post",
      data
  })
}
// 签名医生管理-获取科室
export const getDepartments = (data) => {
  return axios({
      url: "/doctor/getEditable",
      method: "post",
      data
  })
}