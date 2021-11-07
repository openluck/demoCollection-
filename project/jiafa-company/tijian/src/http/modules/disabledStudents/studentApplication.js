import axios from '../../axios'

// 残疾考生告知书-查询列表数据
export const getList = (data) => {
    return axios({
        url: "/disabledExamNote/getList",
        method: "post",
        data
    })
}
// 残疾考生告知书-获取打印名单数据
export const getListData = (data) => {
    return axios({
        url: "/disabledExamNote/getListData",
        method: "post",
        data
    })
}
// 残疾考生告知书-获取打印模板
/* export const getPrintTemplate = (data) => {
  return axios({
      url: "/disabledExamNote/" + data,
      method: "get",
      data
  })
} */