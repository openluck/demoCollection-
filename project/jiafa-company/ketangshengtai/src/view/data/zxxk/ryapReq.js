/*
 * @Author: your name
 * @Date: 2021-07-28 17:55:34
 * @LastEditTime: 2021-10-11 11:21:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import { request } from '../../../util/request';

//获取权限分组
export const getPermission = params => {
  return request('perArrange/getPermission', params)
}
//设置权限分组
export const setPermission = params => {
  return request('perArrange/setPermission', params)
}
// 获取权限对应角色列表
export const getPermissionList = params => {
  return request('perArrange/getPermissionList', params)
}
//获取人员安排列表数据
export const getArrangeList = params => {
  return request('perArrange/getArrangeLists', params)
}
//删除人员
export const delectUser = params => {
  return request('perArrange/delectUser', params)
}


//获取人员列表(添加人员)
export const getUserList = params => {
  return request('perArrange/getUserList', params)
}
//添加人员
export const addUser = params => {
  return request('perArrange/addUser', params)
}


//获取权限场所树
export const getSchoolList = params => {
  return request('perArrange/getSchoolList', params)
}
// 获取场所树下场所列表
export const getPlaceList = params => {
  return request('perArrange/getPlaceLists', params)
}
// 设置范围
export const setRange = params => {
  return request('perArrange/setRange', params)
}

/**
 * @desc 将树节点处理成平级 
 * @param {*} data 树
 */
export const flattenTreeDataClosure = (data) => {
  const treeData = JSON.parse(JSON.stringify(data));
  const flattenData = [];
  function flattenTree(data, parentKey) {
    data.forEach(ele => {
      const { title, value, children, type } = ele;
      flattenData.push({ title, value, parentKey, type });
      if (children) {
        flattenTree(children, value);
      }
    })
  }
  flattenTree(treeData, null);
  return flattenData;
}
/**
 * @desc 找到所有父节点
 * @param {*} item 子节点
 * @param {*} flattenTree 树 
 */
export const findParent = (item, flattenTree) => {
  const parentArr = [], arr = []; // 存储所有的父级元素
  function find(item, flattenTree) {
    flattenTree.forEach(ele => {
      if (ele.value === item) {
        parentArr.unshift(ele.value);
        arr.unshift(ele);
        find(ele.parentKey, flattenTree);
      }
    })
  }
  find(item, flattenTree);
  // console.log(arr);
  return { parentArr, arr };
}
