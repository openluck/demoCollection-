import axios from "../../axios";

// 获取智能分班列表
export const getPlanGroupList = (data) => {
  return axios({
    url: "/DC_PlanGroup/getPlanGroupList",
    method: "post",
    data,
  });
};

// 获取系统导入的列表
export const getGradesListByOrganizationId = (data) => {
  return axios({
    url: "/Common/getGradesListByOrganizationId",
    method: "post",
    data,
  });
};

// 获取系统导入的对应年级表格数据
export const getCourseGroupList = (data) => {
  return axios({
    url: "/DC_PlanGroup/getCourseGroupList",
    method: "post",
    data,
  });
};
// 获取分班方案表格数据
export const getDivideSchemList = (data) => {
  return axios({
    url: "/DC_Plan/getDivideSchemList",
    method: "post",
    data,
  });
};

//删除分班方案编号
export const deleList = (data) => {
  return axios({
    url: "/DC_Plan/delPlan",
    method: "post",
    data,
  });
};

// 添加分班方案
export const getAddPlan = (data) => {
  return axios({
    url: "/DC_Plan/AddPlan",
    method: "post",
    data,
  });
};
// 发布分班方案
export const inputDivideClass = (data) => {
  return axios({
    url: "/DC_Plan/inputDivideClass",
    method: "post",
    data,
  });
};

// 获取方案报告对比
export const getSchemeReportList = (data) => {
  return axios({
    url: "/DC_Plan/getSchemeReportList",
    method: "post",
    data,
  });
};

// 全部清空
export const delSelCourse = (data) => {
  return axios({
    url: "/DC_PlanGroup/delSelCourse",
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

// 下载选课错误信息
export const downExcelError = (data) => {
  return axios({
    url: "/DC_PlanGroup/downExcelError",
    method: "post",
    responseType: "blob", // 下载模板接口需要写这个相应类型为blob
    data,
  });
};

// 手动导入
export const importExistCourseGroup = (data) => {
  return axios({
    url: "/DC_PlanGroup/importExistCourseGroup",
    method: "post",
    data,
  });
};

// 系统导入
export const importNewCourseGroup = (data) => {
  return axios({
    url: "/DC_PlanGroup/importNewCourseGroup",
    method: "post",
    data,
  });
};

// 导出分班方案
export const OutputDivideSchem = (data) => {
  return axios({
    url: "/DC_Plan/OutputDivideSchem",
    method: "post",
    responseType: "blob",
    data,
  });
};

// 检查改方案是否发布
export const checkInput = (data) => {
  return axios({
    url: "/DC_Class/getSaveData",
    method: "post",
    data,
  });
};
