/*
 * @Author: xq 
 * @Date: 2021-01-18 14:56:08 
 * @Last Modified by: xq
 * @Last Modified time: 2021-01-21 16:23:56
 */
import { request as Ajax } from "./../../util/request";

// 首页列表请求
export const getRuleManage_request = (params = {}) => {
    return Ajax("manageRule/queryList", params).then( ({ data }) => data);
}

// 弹框 - 人员列表请求 
export const getPersonList_request = (params = {}) => {
     return Ajax("manageRule/queryManageList", params).then( ({ data }) => data);
}

// 新增/编辑 宿管信息 - 提交
export const submitAdd_request = (params = {},url) => {
   return Ajax(url, params).then( ({ data }) => data);
}

export const deleManage_request = (params = {}) => {
    return Ajax("manageRule/deleManage", params).then( ({ data }) => data);
}