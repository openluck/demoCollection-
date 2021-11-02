import axios from '../../axios'

//课表调整记录-获取调换课调整记录
export const getSwitchLesRecord = (data) => {
  return axios({
    url: "/timetableAdjust/getSwitchLesRecord",
    method: "post",
    data
  })
}
//课表调整记录-获取代课调整记录
export const getReplaceLesRecord = (data) => {
  return axios({
    url: "/timetableAdjust/getReplaceLesRecord",
    method: "post",
    data
  })
}
//课表调整记录-获取场所调整记录
export const getPlaceAdjustRecord = (data) => {
  return axios({
    url: "/timetableAdjust/getPlaceAdjustRecord",
    method: "post",
    data
  })
}
//课表调整记录-获取学生换课记录
export const getStuCgLesRecord = (data) => {
  return axios({
    url: "/timetableAdjust/getStuCgLesRecord",
    method: "post",
    data
  })
}
//课表调整记录-获取换休调整记录
export const getCgLeisureRecord = (data) => {
  return axios({
    url: "/timetableAdjust/getCgLeisureRecord",
    method: "post",
    data
  })
}
//课表调整记录-导出操作日志
export const exportOperateLog = (data) => {
  return axios({
    url: "/timetableAdjust/exportOperateLog",
    method: "post",
    data
  })
}
