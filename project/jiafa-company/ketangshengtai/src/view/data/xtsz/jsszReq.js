/*
 * @Author: your name
 * @Date: 2021-07-28 17:55:34
 * @LastEditTime: 2021-10-11 11:21:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import { request } from '../../../util/request';

//获取人员列表(添加人员)
export const getUserListCon = params => {
  return request('public/getUserLists', params)
}
//添加人员
export const addUser = params => {
  return request('public/addPerson', params)
}
 