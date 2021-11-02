import { request } from './../../../../util/request'

export const getStatistiData = params => {
  return request('coureseSearch/getStatistiData', params)
}

export const getCollegeList = params => {
  return request('perSearch/getDetilList', params)
}

export const getCourseList = params => {
  return request('coureseSearch/getCourseList', params)
}

export const exportSubsidiary = params => {
  return request('coureseSearch/exportSubsidiary', params)
}
