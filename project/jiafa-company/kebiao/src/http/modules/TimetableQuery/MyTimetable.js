import axios from '../../axios'

// 我的课表-导出课表
export const exportMyTimetable = (data) => {
  return axios({
    url: "/timetableQuery/exportMyTimetable",
    method: "post",
    responseType: "blob",
    data
  })
}

// 家长身份下获取多个学生
export const getPatriarchStudents = (data) => {
  return axios({
    url: "/timetableQuery/getPatriarchStudents",
    method: "post",
    data
  })
}

// 获取课表详情
export const getLessonDetail = (data) => {
  return axios({
    url: "/timetableQuery/getLessonDetail",
    method: "post",
    data
  })
}

// 导出课表详情
export const exportLessDetail = (data) => {
  return axios({
    url: "/timetableQuery/exportLessDetail",
    method: "post",
    responseType: "blob",
    data
  })
}
