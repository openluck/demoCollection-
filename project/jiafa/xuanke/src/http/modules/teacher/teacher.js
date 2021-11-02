import axios from '../../axios'

// 教师-根据学年、学期、年级、活动名称查询选课活动列表
export const getCourseGroupsPageList = (data) => {
    return axios({
        url: "/api/CourseGroups/getCourseGroupsPageList",
        method: "post",
        data
    })
}
// 教师-根据机构OrganizationId获取年级信息
export const getGradesList = (data) => {
    return axios({
        url: "/api/common/getGradesListByOrganizationId",
        method: "post",
        data
    })
}
// 教师-根据学年YearId获取学期信息
export const getTermsList = (data) => {
    return axios({
        url: "/api/common/getTermsListByYearId",
        method: "post",
        data
    })
}
// 教师-根据机构OrganizationId获取学年信息
export const getYearsList = (data) => {
    return axios({
        url: "/api/common/getYearsListByOrganizationId",
        method: "post",
        data
    })
}
// 教师-添加活动
export const addElc_CourseGroups = (data) => {
    return axios({
        url: "/api/CourseGroups/addElc_CourseGroups",
        method: "post",
        data
    })
}
// 教师-编辑活动
export const editElc_CourseGroups = (data) => {
    return axios({
        url: "/api/CourseGroups/editElc_CourseGroups",
        method: "post",
        data
    })
}
// 教师-删除活动
export const delElc_CourseGroups = (data) => {
    return axios({
        url: "/api/CourseGroups/delElc_CourseGroups",
        method: "post",
        data
    })
}
// 教师-获取课时计划
export const getloadExam = (data) => {
    return axios({
        url: "/api/Exam/getloadExam",
        method: "post",
        data
    })
}
// 教师-获取科目列表
export const getCourseList = (data) => {
    return axios({
        url: "/api/Sys_Courses/getCourseList",
        method: "post",
        data
    })
}