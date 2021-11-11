import axios from "../../../../axios";

/**
 * @description 预览课表接口地址
 * @param { Object } params
 * @returns { Promise }
 */

// 获取班级列表
export const getClassByGrade = (data) => {
  return axios({
    url: "/CA_CourseTable/getClassByGrade",
    method: "post",
    data,
  });
};

// 根据班级获取学生列表
export const getStudentsByClass = (data) => {
  return axios({
    url: "/CA_CourseTable/getStudentsByClass",
    method: "post",
    data,
  });
};

//全校课表
export const getWholeSchoolTimetable = (data) => {
  return axios({
    url: "/CA_CourseTable/getWholeSchoolTimetable",
    method: "post",
    data,
  });
};

// 获取年级课表
export const getGradeTimetable = (data) => {
  return axios({
    url: "/CA_CourseTable/getGradeTimetable",
    method: "post",
    data,
  });
};

// 获取班级课表
export const getClassTimetable = (data) => {
  return axios({
    url: "/CA_CourseTable/getClassTimetable",
    method: "post",
    data,
  });
};

// 获取教师课表
export const getTeacherTimetable = (data) => {
  return axios({
    url: "/CA_CourseTable/getTeacherTimetable",
    method: "post",
    data,
  });
};

// 获取教师列表
export const getTeacherList = (data) => {
  return axios({
    url: "/CA_CourseTable/getTeacherList",
    method: "post",
    data,
  });
};

export const getClassroomTree = (data) => {
  return axios({
    url: "/CA_ClassRoom/getClassroomTree",
    method: "post",
    data,
  });
};

// 获取教室课表
export const getClassroomTimetable = (data) => {
  return axios({
    url: "/CA_CourseTable/getClassroomTimetable",
    method: "post",
    data,
  });
};

// 获取学生课表
export const getStudentsTimetable = (data) => {
  return axios({
    url: "/CA_CourseTable/getStudentsTimetable",
    method: "post",
    data,
  });
};

// 保存课表
export const saveTimetable = (data) => {
  return axios({
    url: "/ArrLessonResult/saveTimetable",
    method: "post",
    data,
  });
};

// 发布课表
export const publishTimetable = (data) => {
  return axios({
    url: "/ArrLessonResult/publishTimetable",
    method: "post",
    data,
  });
};

// const interfaceAddress = [
//   '/ArrLessonResult/getClassByGrade', // 获取班级列表
//   '/ArrLessonResult/getStudentsByClass', // 根据班级获取学生列表
//   '/ArrLessonResult/getGradeTimetable', // 获取年级课表
//   '/ArrLessonResult/getClassTimetable', // 获取班级课表
//   '/ArrLessonResult/getTeacherTimetable', // 获取教师课表
//   '/ArrLessonResult/getClassroomTimetable', // 获取教室课表
//   '/ArrLessonResult/getStudentsTimetable', // 获取学生课表
//   '/ArrLessonResult/saveTimetable', // 保存课表
//   '/ArrLessonResult/publishTimetable', // 发布课表
// ]

// const interfaceList = interfaceAddress.map((item) => {
//   const name = item.split('/')
//   return {
//     [name[name.length - 1]]: (data) => {
//       return axios({
//         url: item,
//         method: 'post',
//         data,
//       })
//     },
//   }
// })
// export const ...interfaceList
