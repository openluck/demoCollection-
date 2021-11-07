import axios from '../../axios'

// 教室课表-获取课表
export const getClassroomTimetable = (data) => {
  return axios({
      url: "/timetableQuery/getClassroomTimetable",
      method: "post",
      data
  })
}

// 教室课表-导出课表
export const exportClassroomTimetable = (data) => {
  return axios({
      url: "/timetableQuery/exportClassroomTimetable",
      method: "post",
      responseType: "blob",
      data
  })
}