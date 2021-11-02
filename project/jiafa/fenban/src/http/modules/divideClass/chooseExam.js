import axios from '../../axios'

/**
 * @desc 
 * @param {*} params 请求参数
 * @returns {Promise} 
 */

// wq_获取组合和行政班级数据
export const getBaseClassData = (data) => {
  return axios({
    url: '/DC_Class/getBaseClassData',  
    method: 'post',
    data,
  })
}

// wq_导入分班方案
export const importDivideClass = (data) => {
  return axios({
    url: '/DC_Class/importDivideClass',
    method: 'post',
    data,
  })
}

// wq_自动分班
export const autoDivideClass = (data) => {
  return axios({
    url: 'DC_Plan/autoDivideClass',
    method: 'post',
    data,
  })
}

// wq_获取分组下未分班的学生列表
export const getGroupStuList = (data) => {
  return axios({
    url: '/DC_Class/getGroupStuList',
    method: 'post',
    data,
  })
}

// wq_上传人员列表
export const uploadGroupStuList = (data) => {
  return axios({
    url: '/DC_Class/uploadGroupStuList',
    method: 'post',
    data,
  })
}

// wq_添加分组
export const addGroup = (data) => {
  return axios({
    url: '/DC_Class/addGroup',
    method: 'post',
    data,
  })
}

// wq_编辑分组
export const editGroup = (data) => {
  return axios({
    url: '/DC_Class/editGroup',
    method: 'post',
    data,
  })
}

// wq_删除分组
export const delGroup = (data) => {
  return axios({
    url: '/DC_Class/delGroup',
    method: 'post',
    data,
  })
}

// wq_删除添加的组内科目组合
export const delSubGroupInGroup = (data) => {
  return axios({
    url: '/DC_Class/delSubGroupInGroup',
    method: 'post',
    data,
  })
}

// wq_学考分班-合并班级-获取可以合并班级列表
export const studyQueryMergeClass = (data) => {
  return axios({
    url: '/studyQueryMergeClass',
    method: 'post',
    data,
  })
}

// wq_学考分班-合并班级-确定
export const studyMergeClass = (data) => {
  return axios({
    url: '/studyMergeClass',
    method: 'post',
    data,
  })
}

// wq_学考分班-学考分班-查看班级详情
export const getStudyClassDetails = (data) => {
  return axios({
    url: '/DC_Class/getStudyClassDetails',
    method: 'post',
    data,
  })
}

// wq_获取编辑分组组合数据
export const getEditGroupList = (data) => {
  return axios({
    url: '/DC_Class/getEditGroupList',
    method: 'post',
    data,
  })
}


// wq_获取编辑分组组合数据
export const saveSettingColor = (data) => {
  return axios({
    url: '/DC_Class/saveSettingColor',
    method: 'post',
    data,
  })
}

// wq_获取机构下该方案下关联的班级数量
export const getPlanRelevanceClassCount = (data) => {
  return axios({
    url: '/DC_Plan/getPlanRelevanceClassCount',
    method: 'post',
    data,
  })
}

// 下载选课错误信息
export const downExcelError = (data) => {
  return axios({
    url: '/Common/downExcelError',
    method: 'post',
    responseType: 'blob', // 下载模板接口需要写这个相应类型为blob
    data
  })
}
