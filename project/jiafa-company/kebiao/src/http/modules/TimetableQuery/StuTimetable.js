import axios from '../../axios'

// 学生课表-获取课表
export const getStudentTimetable = (data) => {
  return axios({
      url: "/timetableQuery/getStudentTimetable",
      method: "post",
      data
  })
}

// 学生课表-导出课表
export const exportStudentTimetable = (data) => {
  return axios({
      url: "/timetableQuery/exportStudentTimetable",
      method: "post",
      responseType: "blob",
      data
  })
}