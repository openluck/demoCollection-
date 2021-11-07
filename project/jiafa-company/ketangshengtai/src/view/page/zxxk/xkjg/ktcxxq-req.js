import { request } from './../../../../util/request'

export const getCourseInfo = params => {
  return request('courseSelectDetail/getCourseInfo', params)
}

export const getRecordTabList = params => {
  return request('courseSelectDetail/getRecordTabList', params)
}

export const getRecordList = params => {
  return request('courseSelectDetail/getRecordList', params)
}
