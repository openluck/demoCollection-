import axios from '../../axios'

// 年级课表-获取课表
export const getGradeTimetable = (data) => {
  return axios({
      url: "/timetableQuery/getGradeTimetable",
      method: "post",
      data
  })
}

// 年级课表-导出课表
export const exportGradeTimetable = (data) => {
  return axios({
      url: "/timetableQuery/exportGradeTimetable",
      method: "post",
      responseType: "blob",
      data
  })
}