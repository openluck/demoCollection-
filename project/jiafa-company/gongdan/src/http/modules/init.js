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
        url: '/getCodeTable',
        method: 'post',
        data
    })
}

// 获取基础配置
export const getBasicConfig = data => {
    return axios({
        url:"/getBasicConfig",
        method:"post",
        data
    })
}