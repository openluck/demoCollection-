import axios from '../../axios'

// 残疾考生便利申请管理-获取表格数据
export const getList = (data) => {
    return axios({
        url: "/disabledApplyManage/getList",
        method: "post",
        data
    })
}
// 残疾考生便利申请管理-生成告知书
export const createNote = (data) => {
    return axios({
        url: "/disabledApplyManage/createNote",
        method: "post",
        data
    })
}
// 残疾考生便利申请管理-导出学生名单
export const exportExcel = (data) => {
  return axios({
      url: "/disabledApplyManage/exportExcel",
      method: "post",
      data,
      responseType: 'blob'
  })
}