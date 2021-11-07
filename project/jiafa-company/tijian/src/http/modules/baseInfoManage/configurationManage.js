import axios from '../../axios'

//（省端）获取新增科室及对应编辑项
export const getEditList = (data) => {
  return axios({
      url: '/config/editList',
      method: 'post',
      data
  })
}

//（省端）获取科室列表
export const getDeskList = (data) => {
  return axios({
      url: '/config/deskList',
      method: 'post',
      data
  })
}

// （省端）保存配置
export const saveConfig = (data) => {
  return axios({
      url: '/config/saveConfig',
      method: 'post',
      data
  })
}

// （区县端）获取通知内容
export const getStateAddInform = (data) => {
  return axios({
      url: '/config/getStateAddInform',
      method: 'post',
      data
  })
}

// （区县端）通知保存
export const informSave = (data) => {
  return axios({
      url: '/config/informSave',
      method: 'post',
      data
  })
}
