import axios from '../axios'

//图片上传
export const uploadPic = (data) => {
    return axios({
        url: 'uploadPic',
        method: 'post',
        data
    })
}

//获取图片基础地址
export const getPicBaseUrl = (data) => {
    return axios({
        url: 'getPicBaseUrl',
        method: 'post',
        data
    })
}

//获取省市区
export const province = (data) => {
    return axios({
        url: '/province',
        method: 'post',
        data
    })
}

// 查询码表
export const queryCodeTable = (data) => {
    return axios({
        url: '/codeTable',
        method: 'post',
        data
    })
}

// 获取年级、周次、科目等基础数据
export const getBasicData = (data) => {
    return axios({
        url: '/getBasicData',
        method: 'post',
        data
    })
}

// 根据学年获取学期
export const getSemesterBySchoolYear = (data) => {
    return axios({
        url: '/getSemesterBySchoolYear',
        method: 'post',
        data
    })
}

// 根据年级获班级
export const getClassByGrade = (data) => {
    return axios({
        url: '/getClassByGrade',
        method: 'post',
        data
    })
}

// 根据班级获取学生
export const getStuByClass = (data) => {
    return axios({
        url: '/getStuByClass',
        method: 'post',
        data
    })
}

// 根据科目获取教师
export const getTeacherBySubject = (data) => {
    return axios({
        url: '/getTeacherBySubject',
        method: 'post',
        data
    })
}

// 获取教室结构
export const getClassroomTree = (data) => {
    return axios({
        url: '/getClassroomTree',
        method: 'post',
        data
    })
}