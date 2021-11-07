/*
 * @Description: 换休调整接口
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-02 15:07:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-20 16:13:04
 */
import axios from '../../axios'

//换休调整-应用换休调整
export const applyCgOnLeave = (data) => {
  return axios({
    url: "/timetableAdjust/applyCgOnLeave",
    method: "post",
    data
  })
}

// 根据学段获取节次
export const getSpelledLesSort = (data) => {
  return axios({
    url: "/timetableAdjust/getSpelledLesSort",
    method: "post",
    data
  })
}