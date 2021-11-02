/*
 * @Descripttion:
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-05-26 17:18:13
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-09 15:29:05
 */

import axios from "../../axios";

//left - 获取行政班级列表（含基础数据）
export const getAdminClassList = (data) => {
  return axios({
    url: "/CA_CourseTable/getAdminClassList",
    method: "post",
    data,
  });
};

//right - 获取未排课课程List
export const getNolessonList = (data) => {
  return axios({
    url: "/CA_CourseTable/getNolessonList",
    method: "post",
    data,
  });
};

//right - 获取未排课教师List
export const getNoTeacherList = (data) => {
  return axios({
    url: "/CA_CourseTable/getNoTeacherList",
    method: "post",
    data,
  });
};
// right - 获取教师分组List（下拉）
export const getGroupOfTeacher = (data) => {
  // console.log(data);
  return axios({
    url: "/CA_CourseTable/getGroupOfTeacher",
    method: "post",
    data,
  });
};

// right-获取未排课教室List
export const getNoRoomList = (data) => {
  // console.log(data);
  return axios({
    url: "/CA_CourseTable/getNoRoomList",
    method: "post",
    data,
  });
};
// right-获取教室（场所）结构树
export const getClassroomTree = (data) => {
  return axios({
    url: "/CA_ClassRoom/getClassroomTree",
    method: "post",
    data,
  });
};
export const autoDivideRoom = (data) => {
  return axios({
    url: "/CA_CourseTable/autoDivideRoom",
    method: "post",
    data,
  });
};

// center-获取课表
export const getTimeTable = (data) => {
  return axios({
    url: "/CA_CourseTable/getTimeTable",
    method: "post",
    data,
  });
  // return res
};
/**
 * @desc 获取冲突课表
 */
export const getConflictTimeTable = (params) => {
  return axios({
    url: "/CA_CourseTable/getConflictTimeTable",
    method: "post",
    data: params,
  });
};
/**
 * @desc 格子间拖动 反向验证
 */
// export const reverseTimeTable = (data) => {
//   return axios({
//     url: '/CA_CourseTable/ReverseValidate',
//     method: 'post',
//     data
//   })
// }
/**
 * @desc 格子间拖动 保存数据
 */
export const exchangeLesson = (data) => {
  return axios({
    url: "/CA_CourseTable/exchangeLesson",
    method: "post",
    data,
  });
};
/**
 * @desc 单双周数据交换
 */
export const exchangeSingleDoubleInfo = (data) => {
  return axios({
    url: "/CA_CourseTable/exchangeSingleDoubleInfo",
    method: "post",
    data,
  });
};
/**
 * @desc 删除表格数据
 */
export const cancleOpration = (data) => {
  return axios({
    url: "/CA_CourseTable/cancleOpration",
    method: "post",
    data,
  });
};
/**
 * @desc 解锁格子
 */
export const unlockOpration = (data) => {
  return axios({
    url: "/CA_CourseTable/unlockOpration",
    method: "post",
    data,
  });
};
/**
 * @desc 拖动添加课程
 */
export const addTableData = (data) => {
  return axios({
    url: "/CA_CourseTable/addTableData",
    method: "post",
    data,
  });
};

//rule - 获取教室安排list
export const getRoomList = (data) => {
  return axios({
    url: "/CA_CourseTable/getRoomList",
    method: "post",
    data,
  });
};

//rule - 删除教室
export const delRoom = (data) => {
  return axios({
    url: "/CA_CourseTable/delRoom",
    method: "post",
    data,
  });
};
//rule-获取教师（按分组）
export const getTeacherList = (data) => {
  return axios({
    url: "/CA_CourseTable/getTeacherList",
    method: "post",
    data,
  });
};
//rule-删除教师（按分组）
export const delTeacher = (data) => {
  return axios({
    url: "/CA_CourseTable/delTeacher",
    method: "post",
    data,
  });
};
/**
 * @desc 添加教师 - 获取所有教师列表
 */
export const getAllTeacherList = (data) => {
  return axios({
    url: "/CA_TeachingGroup/getTeacherDialogList",
    method: "post",
    data,
  });
};

//rule-获取课程List
export const getLessonList = (data) => {
  return axios({
    url: "/CA_CourseTable/getLessonList",
    method: "post",
    data,
  });
};
// rule-获取可以进行添加的课程列表
export const getTeaClassDialogList = (data) => {
  return axios({
    url: "/CA_ClassTeachHour/getTeaClassDialogList",
    method: "post",
    data,
  });
};
//rule-添加课程
export const addLessonInType = (data) => {
  return axios({
    url: "/CA_CourseTable/addLessonInType",
    method: "post",
    data,
  });
};

//rule-获取课程List
export const delLesson = (data) => {
  return axios({
    url: "/CA_CourseTable/delLesson",
    method: "post",
    data,
  });
};

export const checkArrLesson = (data) => {
  return axios({
    url: "/CA_CourseTable/checkArrLesson",
    method: "post",
    data,
  });
};
/**
 * @desc 自动排课
 */
export const autoArrange = (data) => {
  return axios({
    url: "/CA_Plan/autoArrange",
    method: "post",
    data,
  });
};
/**
 * @desc 备份
 */
export const backUpCourseTable = (data) => {
  return axios({
    url: "/CA_CourseTable/backUpCourseTable",
    method: "post",
    data,
  });
};
/**
 * @desc 获取备份列表
 */
export const getbackUpList = (data) => {
  return axios({
    url: "/CA_CourseTable/getbackUpList",
    method: "post",
    data,
  });
};
/**
 * @desc 还原备份
 */
export const restoreCourseTable = (data) => {
  return axios({
    url: "/CA_CourseTable/restoreCourseTable",
    method: "post",
    data,
  });
};
/**
 * @desc 删除备份
 */
export const delBackUp = (data) => {
  return axios({
    url: "/CA_CourseTable/delBackUp",
    method: "post",
    data,
  });
};
/**
 * @desc 清空课表数据
 */
export const DelAllCourseTable = (data) => {
  return axios({
    url: "/CA_CourseTable/DelAllCourseTable",
    method: "post",
    data,
  });
};

