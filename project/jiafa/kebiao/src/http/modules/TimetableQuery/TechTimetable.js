import axios from '../../axios'

// 教师课表-获取课表
export const getTeacherTimetable = (data) => {
  return axios({
      url: "/timetableQuery/getTeacherTimetable",
      method: "post",
      data
  })
}

// 教师课表-导出课表
export const exportTeacherTimetable = (data) => {
  return axios({
      url: "/timetableQuery/exportTeacherTimetable",
      method: "post",
      responseType: "blob",
      data
  })
}