import axios from '../../axios'

// 码表管理-获取码表列表
export const getExaminationList = (data) => {
  return axios({
    url: "/getExaminationList",
    method: "post",
    data
  })
}
// 码表管理-获取码表列表
export const getQrcodeStatus = (data) => {
  return axios({
    url: "/getQrcodeStatus",
    method: "post",
    data
  })
}


// 获取下级提交机构树
export const getLowerCommitTree = (data) => {
  return axios({
    url: "/getLowerCommitTree",
    method: "post",
    data
  })
}