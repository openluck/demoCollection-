import { request } from './../../../../util/request'

export const getstatisticalData = params => {
  return request('perSearch/getstatisticalData', params)
}

export const exportSubsidiary = params => {
  return request('perSearch/exportSubsidiary', params)
}

export const getCheckPerList = params => {
  return request('perSearch/getCheckPerList', params)
}
