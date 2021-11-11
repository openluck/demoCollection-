import axios from '../../axios'

// 获取操作日志列表
export const getOperationLogList = (data) => {
  return axios({
    url: "/sysSetting/getOperationLogList",
    method: "post",
    data
  })
}

// 导出操作日志
export const exportOperationLog = (data) => {
  return axios({
    url: "/sysSetting/exportOperationLog",
    method: "post",
    data
  })
}

// 获取全部教师（查询下来list）
export const getAllTeacherListInSearch = (data) => {
  return axios({
    url: "/sysSetting/getAllTeacherListInSearch",
    method: "post",
    data
  })
}
