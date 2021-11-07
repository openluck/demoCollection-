import axios from '../../axios'

// 班级课表-获取课表
export const getClassTimetable = (data) => {
  return axios({
      url: "/timetableQuery/getClassTimetable",
      method: "post",
      data
  })
}

// 班级课表-导出课表
export const exportClassTimetable = (data) => {
  return axios({
      url: "/timetableQuery/exportClassTimetable",
      method: "post",
      responseType: "blob",
      data
  })
}