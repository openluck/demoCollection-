import axios from '../axios'

//领卷清单-普通类导出
export const takeListExportNormal=(data)=>{
  return axios({
      url:`/takeListExportNormal?orgcode=${data.orgcode}&examid=${data.examid}`,
      method:'get',
      responseType: "blob",
  })
}

//领卷清单-对口类导出
export const takeListExportCounterpart=(data)=>{
  return axios({
      url:`/takeListExportCounterpart?orgcode=${data.orgcode}&examid=${data.examid}`,
      method:'get',
      responseType: "blob",
  })
}

//领卷清单-一类导出
export const takeListExportFirst=(data)=>{
  return axios({
      url:`/takeListExportFirst?orgcode=${data.orgcode}&examid=${data.examid}`,
      method:'get',
      responseType: "blob",
  })
}