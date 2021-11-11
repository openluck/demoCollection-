import axios from "../../../../axios";

/**
 * @description 规则设置 接口地址列表
 * @param { Object } params
 * @returns { Promise }
 */

// 规则清空
export const clearRules = (data) => {
  return axios({
    url: "/CA_Rule/ClearRule",
    method: "post",
    data,
  });
};

// 规则清空
export const getHTCourseList = (data) => {
  return axios({
    url: "/CA_Rule/getHTCourseList",
    method: "post",
    data,
  });
};

export const getCanMove = (data) => {
  return axios({
    url: "/CA_Rule/getCanMove",
    method: "post",
    data,
  });
};
// 获取排课规则列表
export const getRuleList = (data) => {
  return axios({
    url: "/CA_Rule/getRuleList",
    method: "post",
    data,
  });
};
// 删除排课规则
export const delRules = (data) => {
  return axios({
    url: "/CA_Rule/DeleteRule",
    method: "post",
    data,
  });
};
// 设置规则顺序（排序）
export const setRulesSort = (data) => {
  return axios({
    url: "/CA_Rule/setRulesSort",
    method: "post",
    data,
  });
};
// 获取设置规则课程表格
export const getSetRulesTimetable = (data) => {
  return axios({
    // url: '/ArrLessonRule/getSetRulesTimetable',
    url: "/CA_Rule/getSetRulesTimetable",
    method: "post",
    data,
  });
};
// 新增-课程/教师-不能排/只能排
export const addRulesOnlyNotOnly = (data) => {
  return axios({
    // url: '/ArrLessonRule/addRulesCanorCant',
    url: "/CA_Rule/addRulesOnlyNotOnly",
    method: "post",
    data,
  });
};
// 新增-课程/教师-同步/互斥
export const addRulesCanorCant = (data) => {
  return axios({
    // url: '/ArrLessonRule/addRulesCanorCant',
    url: "/CA_Rule/addRulesCanorCant",
    method: "post",
    data,
  });
};
// 新增-课程/教师-获取作用课程列表-已有
export const getSubjectList = (data) => {
  return axios({
    url: "/ArrLessonRule/getSubjectList",
    method: "post",
    data,
  });
};
// 新增-课程/教师-获取作用班级列表
export const getUseClassList = (data) => {
  return axios({
    // url: '/ArrLessonRule/getUseClassList',
    url: "/CA_ClassTeachHour/getUseClassList",
    method: "post",
    data,
  });
};
// 新增-课程-单双周
export const addLessonWeek = (data) => {
  return axios({
    // url: '/ArrLessonRule/addLessonWeek',
    url: "/CA_Rule/addLessonWeek",
    method: "post",
    data,
  });
};
// 新增-课程-单双周-获取已设置规则列表
export const getSetedRules = (data) => {
  return axios({
    // url: '/ArrLessonRule/getSetedRules',
    url: "/CA_Rule/getSetedRules",
    method: "post",
    data,
  });
};
// 新增-课程-单双周&课程连堂-获取待选课程
export const getToChooseCourse = (data) => {
  return axios({
    // url: '/ArrLessonRule/getToChooseCourse',
    url: "/CA_Rule/getToChooseCourse",
    method: "post",
    data,
  });
};
// 新增-课程-连堂
export const addLessonConnectClass = (data) => {
  return axios({
    url: "/CA_Rule/addLessonConnectClass",
    method: "post",
    data,
  });
};
// 新增-课程-获取连堂数列表
export const addLessonConnectCount = (data) => {
  return axios({
    url: "/CA_Rule/addLessonConnectCount",
    method: "post",
    data,
  });
};
// 新增-课程-连堂-获取已设置规则列表
export const getCourseRulesList = (data) => {
  return axios({
    url: "/CA_Rule/getCourseRulesList",
    method: "post",
    data,
  });
};
// 新增-课程-教案齐平
export const addLessonJAQP = (data) => {
  return axios({
    // url: '/ArrLessonRule/addLessonJAQP',
    url: "/CA_Rule/addLessonJAQP",
    method: "post",
    data,
  });
};
// 新增-课程-课程不相邻
export const addLessonKCBZL = (data) => {
  return axios({
    url: "/CA_Rule/addLessonKCBZL",
    method: "post",
    data,
  });
};
// 新增-课程-周内分散
export const addLessonZNFS = (data) => {
  return axios({
    url: "/CA_Rule/addLessonZNFS",
    method: "post",
    data,
  });
};
// 新增-课程-周内分散-获取待选课程
export const getToChooseCourseZNFS = (data) => {
  return axios({
    url: "/CA_Rule/getToChooseCourseZNFS",
    method: "post",
    data,
  });
};
// 新增-课程-周内分散-获取已设置的规则列表
export const getZNFSRulesList = (data) => {
  return axios({
    url: "/CA_Rule/getZNFSRulesList",
    method: "post",
    data,
  });
};
// 新增-教师-互斥/同步授课
export const addCourseMutuxOrSync = (data) => {
  return axios({
    url: "/CA_Rule/addCourseMutuxOrSync",
    method: "post",
    data,
  });
};
// 获取-教师-互斥/同步授课_规则
export const GetTeacherMutexSync = (data) => {
  return axios({
    url: "/CA_Rule/GetTeacherMutexSync",
    method: "post",
    data,
  });
};

export const getTeacherList = (data) => {
  return axios({
    url: "/CA_CourseTable/getTeacherList",
    method: "post",
    data,
  });
};
// 新增-教师-互斥/同步授课-获取作用人员列表
export const getUsePersonList = (data) => {
  return axios({
    // url: '/CA_CourseTable/getTeacherList',
    url: "/CA_Rule/getUsePersonList",
    method: "post",
    data,
  });
};
// 新增-教师-互斥/同步授课-获取互斥课时数
export const getMutuxCountList = (data) => {
  return axios({
    url: "/CA_Rule/getMutuxCountList",
    method: "post",
    data,
  });
};
// 新增-教师-合班
export const addMergeClass = (data) => {
  return axios({
    url: "/CA_Rule/addMergeClass",
    method: "post",
    data,
  });
};
// 新增-教师-合班
export const getMergeClassRules = (data) => {
  return axios({
    url: "/CA_Rule/getMergeClassRules",
    method: "post",
    data,
  });
};
// 新增-教师-课时数下拉框数据
export const getMergeHour = (data) => {
  return axios({
    url: "/CA_Rule/getMergeHour",
    method: "post",
    data,
  });
};
// 新增-教师-周内集中/分散
export const addLessonTeacherZNFS = (data) => {
  return axios({
    url: "/CA_Rule/addLessonTeacherZNFS",
    method: "post",
    data,
  });
};
// 新增-教师-周内集中&分散-获取待选教师及课时
export const getZNJZFSteacherList = (data) => {
  return axios({
    url: "/CA_Rule/getZNJZFSteacherList",
    method: "post",
    data,
  });
};
// 新增-教师-周内集中&分散-获取已设置规则列表
export const getZNJZFSruleList = (data) => {
  return axios({
    url: "/CA_Rule/getZNJZFSruleList",
    method: "post",
    data,
  });
};
