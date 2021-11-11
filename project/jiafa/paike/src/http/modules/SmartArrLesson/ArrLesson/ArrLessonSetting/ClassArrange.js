/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-10 17:51:30
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-10 17:53:46
 */
export const getClassroomList = (data) => {
  return axios({
    url: '/ArrLession/getClassroomList',
    method: 'post',
    data,
  })
}