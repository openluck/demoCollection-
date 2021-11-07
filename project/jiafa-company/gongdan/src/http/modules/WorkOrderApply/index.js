import axios from "../../axios";

/**
 * @description 工单申请接口地址
 * @param {Object}
 * @returns {Promise}
 */

// 获取码表
export const getCodeTable = (data) => {
  return axios({
    url: "/getCodeTable",
    method: "post",
    data,
  });
};

// 验证报名号是否唯一_1222
export const verifyBmhIsUnique = (data) => {
  return axios({
    url: "/workOrderApply/verifyBmhIsUnique",
    method: "post",
    data,
  });
};

// 获取工单申请列表
export const getWorkOrderList = (data) => {
  return axios({
    url: "/workOrderApply/getWorkOrderList",
    method: "post",
    data,
  });
};

// 获取新建工单号
export const getNewWorkOrder = (data) => {
  return axios({
    url: "/workOrderApply/getNewWorkOrder",
    method: "post",
    data,
  });
};

// 新建工单
export const createWorkOrder = (data) => {
  return axios({
    url: "/workOrderApply/createWorkOrder",
    method: "post",
    data,
  });
};

// 删除工单
export const delWorkOrder = (data) => {
  return axios({
    url: "/workOrderApply/delWorkOrder",
    method: "post",
    data,
  });
};

// 提交工单
export const submitWorkOrder = (data) => {
  return axios({
    url: "/workOrderApply/submitWorkOrder",
    method: "post",
    data,
  });
};

// 获取该工单下考生列表
export const getExamineeList = (data) => {
  return axios({
    url: "/workOrderApply/getExamineeList",
    method: "post",
    data,
  });
};

// 获取该工单下审核流程列表
export const getAuditLog = (data) => {
  return axios({
    url: "/workOrderApply/getAuditLog",
    method: "post",
    data,
  });
};

// 获取该工单下审核流程详情
export const getAuditLogDetail = (data) => {
  return axios({
    url: "/workOrderApply/getAuditLogDetail",
    method: "post",
    data,
  });
};

// 编辑工单上传申请材料URL绑定到该工单
export const fileWithWorkOrder = (data) => {
  return axios({
    url: "/workOrderApply/fileWithWorkOrder",
    method: "post",
    data,
  });
};

// 删除该工单下某个考生数据
export const delExaminee = (data) => {
  return axios({
    url: "/workOrderApply/delExaminee",
    method: "post",
    data,
  });
};

// 获取该工单下某个考生信息
export const getExamineeInfo = (data) => {
  return axios({
    url: "/workOrderApply/getExamineeInfo",
    method: "post",
    data,
  });
};

// 录入/编辑-删除该生当前变更项
export const delAlterItem = (data) => {
  return axios({
    url: "/workOrderApply/delAlterItem",
    method: "post",
    data,
  });
};

// 录入/编辑-考生删除
export const delExamineeAll = (data) => {
  return axios({
    url: "/workOrderApply/delExamineeAll",
    method: "post",
    data,
  });
};

// 获取该工单下考生信息变更日志
export const getInfoAlterLog = (data) => {
  return axios({
    url: "/workOrderApply/getInfoAlterLog",
    method: "post",
    data,
  });
};

// 录入-根据考生身份证号码获取考生信息
export const getExamineeInfoWithID = (data) => {
  return axios({
    url: "/workOrderApply/getExamineeInfoWithID",
    method: "post",
    data,
  });
};

// 获取考生信息表
export const getExamineeRegInfo = (data) => {
  return axios({
    url: "/workOrderApply/getExamineeRegInfo",
    method: "post",
    data,
  });
};

// 更新考生信息表
export const setExamineeRegInfo = (data) => {
  return axios({
    url: "/workOrderApply/setExamineeRegInfo",
    method: "post",
    data,
  });
};

// 获取考生信息表所有码表
export const getExamineeRegInfoCode = (data) => {
  return axios({
    url: "/workOrderApply/getExamineeRegInfoCode",
    method: "post",
    data,
  });
};

// 考生变更项批量导入_0120
export const batchEntry = (data) => {
  return axios({
    url: "/workOrderApply/batchEntry",
    method: "post",
    data,
  });
};

// 下载批量导入模板与返回的错误信息表_0120
export const downloadTemplate = (data) => {
  return axios({
    url: "/workOrderApply/downloadTemplate",
    method: "post",
    data,
  });
};