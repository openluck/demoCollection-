import { request } from './../../../../util/request'

export const getWarningList = params => {
  return request('automaticCheck/getWarningList', params)
}

export const getPlaceSelectList = params => {
  return request('automaticCheck/getPlaceSelectList', params)
}

export const getStatisticData = params => {
  return request('automaticCheck/getStatisticData', params)
}

export const handleWarning = params => {
  return request('automaticCheck/handleWarning', params)
}