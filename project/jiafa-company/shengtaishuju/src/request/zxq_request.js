/*
 * @Author: xq.zhao
 * @Date: 2019-11-2 10:38:59
 * @Last Modified by: xq.zhao
 * @Last Modified time: 2019-11-2 19:33:06
 */

/**
 * @description 数据请求
 */
import { request } from "../util/request";
/* 资源情况-教室 */
// 获取教学楼数据
const BuildList = (params) => {
  return request('/api/data/resources/teachingBuild', params);
}
//  获取教学楼统计列表
const buildData = (params) => {
  return request('/api/data/resources/teachingBuiCt', params);
}
// 获取教室头部统计数据
const classStaticData = (params) => {
  return request('/api/data/resources/ClaRoomUseRa', params);
}
// 获取教室数据
const clRoomList = (params) => {
  return request('/api/data/resources/claRoom', params);
}
// 获取教室统计列表
const classData = (params) => {
  return request('/api/data/resources/claRoomCt', params);
}
// 获取机构下教室统计数据
const staticData = (params) => {
  return request('/api/data/resources/OrgClaRoomCt', params);
}


/* 资源情况-教师 */
// 获取学院数据列表
const shoolData = (params) => {
  return request('/api/data/resources/ColleData', params);
}
// 获取机构统计数据
const teaStaticData = (params) => {
  return request('api/data/resources/OrgCount', params);
}
// 获取教师数据列表
const teacherData = (params) => {
  return request('/api/data/resources/teacherCount', params);
}
// 获取教师人数统计数据
const teacherStaData = (params) => {
  return request('/api/data/resources/teaNumCount', params);
}

export default {
  buildData,
  staticData,
  classData,
  classStaticData,
  shoolData,
  teaStaticData,
  teacherData,
  teacherStaData,
  BuildList,
  clRoomList
}
