import axios from "../../../axios";

// 获取课程组合
export const getCourseGroupItemList = data => {
  return axios({
    url: "/api/StudentSelections/getCourseGroupItemList",
    method: "post",
    data
  });
};

// 获取学生选课列表
export const getStudentSelectionPageList = data => {
  return axios({
    url: "/api/StudentSelections/getStudentSelectionPageList",
    method: "post",
    data
  });
};

// 保存调配结果
export const saveStudentSelectionsCourseItem = data => {
  return axios({
    url: "/api/StudentSelections/saveStudentSelectionsCourseItem",
    method: "post",
    data
  });
};

// 下载模板
export const downExcelTep = data => {
  return axios({
    url: "/api/common/downExcelTep",
    method: "post",
    responseType: "blob",
    data
  });
};

// 导出
export const exportExcel = data => {
  return axios({
    url: "/api/StudentSelections/export",
    method: "post",
    responseType: "blob",
    data
  });
};

// 导入
export const importExcel = data => {
  return axios({
    url: "/api/StudentSelections/importExcel",
    method: "post",
    data
  });
};