/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-08 09:05:18
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-15 09:50:51
 */
import axios from "../../../axios";

// 获取已发布的分班方案
export const getDivideClassesList = (data) => {
  return axios({
    url: "/Ca_PlanGroup/getDivideClassesList",
    method: "post",
    data,
  });
};

// 获取排课方案列表-分班方案组
export const getPlanGroupList = (data) => {
  return axios({
    url: "/Ca_PlanGroup/getPlanGroupList",
    method: "post",
    data,
  });
};

// 批量删除
export const batchDel = (data) => {
  return axios({
    url: "/Ca_PlanGroup/batchDel",
    method: "post",
    data,
  });
};

// 弹窗-系统导入分班方案列表
export const getDivideClassesListDialog = (data) => {
  return axios({
    url: "/Ca_PlanGroup/getDivideClassesList",
    method: "post",
    data,
  });
};

// 根据机构OrganizationId获取年级信息
export const getGradesListByOrganizationId = (data) => {
  return axios({
    url: "/Common/getGradesListByOrganizationId",
    method: "post",
    data,
  });
};

// 弹窗-确定系统导入
export const sysImport = (data) => {
  return axios({
    url: "/Ca_PlanGroup/sysImport",
    method: "post",
    data,
  });
};

// 下载模板
export const downExcelTep = (data) => {
  return axios({
    url: "/Common/downExcelTep",
    method: "post",
    responseType: "blob", // 下载模板接口需要写这个相应类型为blob
    data,
  });
};

// 确定手动导入excel文件上传
export const handleImport = (data) => {
  return axios({
    url: "/Ca_PlanGroup/import",
    method: "post",
    data,
  });
};

// 下载导入选课活动错误信息
export const downExcelError = (data) => {
  return axios({
    url: "/Common/downExcelError",
    method: "post",
    responseType: "blob", // 下载模板接口需要写这个相应类型为blob
    data,
  });
};

