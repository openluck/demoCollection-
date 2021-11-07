import { request } from './../../../../util/request'

export const getPlaceTree = params => {
  return request('mannualCheck/getPlaceTree', params)
}

export const getVidiconTimeSel = params => {
  return request('mannualCheck/getVidiconTimeSel', params)
}

export const getIcidentList = params => {
  return request('safeRecord/getIcidentList', params)
}

export const saveRecord = params => {
  return request('safeRecord/saveRecord', params)
}

export const getRecordTabList = params => {
  return request('safeRecord/getRecordTabList', params)
}

export const getRecordList = params => {
  return request('safeRecord/getRecordList', params)
}
