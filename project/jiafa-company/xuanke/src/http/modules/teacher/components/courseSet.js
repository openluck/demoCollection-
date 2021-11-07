import axios from "../../../axios";

//获取选课模式
export const getCourseGroupsScheme = data => {
  return axios({
    url: "/api/CourseGroups/getCourseGroupsSchemeByOrgCode",
    method: "post",
    data
  });
};

//获取参选课目
export const getCourse = data => {
  return axios({
    url: "/api/CourseGroups/getCourseByCourseGroupId",
    method: "post",
    data
  });
};

//生成选课组合
export const addCourseGroupItem = data => {
  return axios({
    url: "/api/CourseGroups/addCourseGroupItem",
    method: "post",
    data
  });
};

//生成选课组合列表
export const getGroupItemPagingList = data => {
  return axios({
    url: "/api/CourseGroups/getGroupItemPagingList",
    method: "post",
    data
  });
};

//发布课程组合（撤回同）
export const updateGroupItemState = data => {
  return axios({
    url: "/api/CourseGroups/updateGroupItemStateByItemId",
    method: "post",
    data
  });
};

// 删除课程组合
export const delGroupItem = data => {
  return axios({
    url: "/api/CourseGroups/delGroupItemByItemId",
    method: "post",
    data
  });
};
