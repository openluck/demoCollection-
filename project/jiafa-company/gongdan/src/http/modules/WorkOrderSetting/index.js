import axios from '../../axios'

/**
 * @description 工单设置接口地址
 * @param {Object}
 * @returns {Promise}
 */

// 工单设置-获取工单设置时间
export const getWorkOrderTime = (data) => {
  return axios({
      url: "/getWorkOrderTime",
      method: "post",
      data
  })
}

// 工单设置-更新工单设置时间
export const updateWorkOrderTime = (data) => {
  return axios({
      url: "/updateWorkOrderTime",
      method: "post",
      data
  })
}