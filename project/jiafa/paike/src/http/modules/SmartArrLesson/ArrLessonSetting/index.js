/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-21 15:48:12
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-30 14:32:46
 */
import axios from "../../../axios";
// 新增排课方案
export const getTeachGroupDialogList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeachGroupDialogList",
    method: "post",
    data,
  });
};

// 确定添加教研组
export const saveTeachGroup = (data) => {
  return axios({
    url: "/CA_TeachingGroup/saveTeachGroup",
    method: "post",
    data,
  });
};

// 获取弹窗中的老师列表
export const getTeacherDialogList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeacherDialogList",
    method: "post",
    data,
  });
};

// 获取教室（场所）结构树
export const getClassroomTree = (data) => {
  return axios({
    url: "/Common/getClassroomTree",
    method: "post",
    data,
  });
};
// getPlanClassRoomTree
export const getPlanClassRoomTree = (data) => {
  return axios({
    url: "/CA_ClassRoom/getPlanClassRoomTree",
    method: "post",
    data,
  });
};

// 教室安排-获取教室安排列表
export const getClassroomList = (data) => {
  return axios({
    url: "/CA_ClassRoom/getClassroomList",
    method: "post",
    data,
  });
};

// 教师任教安排-获取任教老师列表
export const getTeacherGroupList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeacherGroupList",
    method: "post",
    data,
  });
};

// 教师任教安排-获取教研组
export const getTeachGroupList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeachGroupList",
    method: "post",
    data,
  });
};

// 教师任教安排-确定添加教研组
// export const saveTeachGroup = (data) => {
//   return axios({
//     url: "/CA_TeachingGroup/saveTeachGroup",
//     method: "post",
//     data,
//   });
// };

// 教师任教安排-批量设置教师课时
export const setTeacherHour = (data) => {
  return axios({
    url: "/CA_TeachingGroup/setTeacherHour",
    method: "post",
    data,
  });
};
// 教师任教安排-批量设置教师课时-新
export const setTeacherHourNewAll = (data) => {
  return axios({
    url: "/CA_TeachingGroup/setTeacherHourNewAll",
    method: "post",
    data,
  });
};
// 教师任教安排-导入基础数据-新
export const ImportBasicData = (data) => {
  return axios({
    url: "/CA_TeachingGroup/ImportBasicData",
    method: "post",
    data,
  });
};

// 删除教研组
export const delTeachGroup = (data) => {
  return axios({
    url: "/CA_TeachingGroup/delTeachGroup",
    method: "post",
    data,
  });
};

// 添加老师
export const addTeacher = (data) => {
  return axios({
    url: "/CA_TeachingGroup/addTeacher",
    method: "post",
    data,
  });
};

// 删除教研组
export const getClassList = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/getClassList",
    method: "post",
    data,
  });
};

// 教师任教安排-批量取消
export const delTeacherList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/delTeacherList",
    method: "post",
    data,
  });
};

// 班级授课-获取班级授课列表
export const getTeaClassList = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/getTeaClassList",
    method: "post",
    data,
  });
};

// 班级授课-确定批量配置课程课时
export const updateTeaClassDialogList = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/updateTeaClassDialogList",
    method: "post",
    data,
  });
};

// 班级授课-获取下拉框老师
export const getTeacherList = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/getTeacherList",
    method: "post",
    data,
  });
};

// 班级授课-确定批量配置课程课时
export const getTeaClassDialogList = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/getTeaClassDialogList",
    method: "post",
    data,
  });
};

//
export const addClassroomList = (data) => {
  return axios({
    url: "/CA_ClassRoom/addClassroomList",
    method: "post",
    data,
  });
};

// 教室安排-批量删除教室
export const delClassroomList = (data) => {
  return axios({
    url: "/CA_ClassRoom/delClassroomList",
    method: "post",
    data,
  });
};

// 确定保存老师
export const saveTeacher = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/saveTeacher",
    method: "post",
    data,
  });
};

// 班级授课-删除教师
export const delTeacher = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/delTeacher",
    method: "post",
    data,
  });
};

// 班级授课-删除教师
export const updateHourArr = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/updateHourArr",
    method: "post",
    data,
  });
};

// 班级授课-获取table列表
export const getClassHourInfoListNew = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/getClassHourInfoListNew",
    method: "post",
    data,
  });
};

export const getPlanSectionsCount = (data) => {
  return axios({
    url: "/CA_Plan/getPlanSectionsCount",
    method: "post",
    data,
  });
};

export const getYearTermTree = (data) => {
  return axios({
    url: "/Common/getYearTermTree",
    method: "post",
    data,
  });
};

export const publishArrLesson = (data) => {
  return axios({
    url: "/CA_Plan/publishArrLesson",
    method: "post",
    data,
  });
};

export const exportArrLesson = (data) => {
  return axios({
    url: "/CA_CourseTable/exportArrLesson",
    method: "post",
    responseType: "blob", // 下载模板接口需要写这个相应类型为blob
    data,
  });
};
// 方案对比
export const getPlanReportorCompare = (data) => {
  return axios({
    url: "/CA_Plan/getPlanReportorCompare",
    method: "post",
    data,
  });
};
// 班级课时重置
export const resetClassHourTeacher = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/resetClassHourTeacher",
    method: "post",
    data,
  });
};
// 自动分配教师
export const autoClassHourTeacher = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/autoClassHourTeacher",
    method: "post",
    data,
  });
};
