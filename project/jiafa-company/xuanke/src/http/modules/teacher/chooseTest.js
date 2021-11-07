import axios from "../../axios";

// 获取课程列表
export const getParticCourseList = data => {
  return axios({
    url: "/api/Sys_ParticCourses/getParticCourseList",
    method: "post",
    data
  });
};

// 获取科目列表
export const getCourseList = data => {
  return axios({
    url: "/api/Sys_Courses/getCourseList",
    method: "post",
    data
  });
};

// 新增科目
export const addParticCourse = data => {
  return axios({
    url: "/api/Sys_ParticCourses/addParticCourse",
    method: "post",
    data
  });
};

// 删除科目
export const delParticCourse = data => {
  return axios({
    url: "/api/Sys_ParticCourses/delParticCourse",
    method: "post",
    data
  });
};