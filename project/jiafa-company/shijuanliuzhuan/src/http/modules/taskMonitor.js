import axios from '../axios'


//押运任务监控接口

export const getDeviceGPS = (data) => {
    return axios({
        url: 'getDeviceGPS',
        method: 'post',
        data
    })
}
export const queryEscort = (data) => {
    return axios({
        url: 'queryEscort',
        method: 'post',
        data
    })
}
export const getEscortDetail = (data) => {
    return axios({
        url: 'getEscortDetail',
        method: 'post',
        data
    })
}
export const queryEscortAlarm = (data) => {
    return axios({
        url: '/queryEscortAlarm',
        method: 'post',
        data
    })
}
export const getEscortReport = (data) => {
    return axios({
        url: 'getEscortReport',
        method: 'post',
        data
    })
}
export const sendEscortMsg = (data) => {
    return axios({
        url: 'sendEscortMsg',
        method: 'post',
        data
    })
}
export const askMobileVideo = (data) => {
    return axios({
        url: 'askMobileVideo',
        method: 'post',
        data
    })
}
// 616获取摄像头拉流设备
export const getEscortCameraDevice = (data) => {
    return axios({
        url: 'getEscortCameraDevice',
        method: 'post',
        data
    })
}
// 616获取摄像头拉流地址
export const getEscortCameraUrl = (data) => {
    return axios({
        url: 'getEscortCameraUrl',
        method: 'post',
        data
    })
}
// 获取押运任务指令推送列表
export const getEscortMsg = (data) => {
    return axios({
        url: 'getEscortMsg',
        method: 'post',
        data
    })
}
// 获取押运任务指令推送详情
export const getEscortMsgDetail = (data) => {
    return axios({
        url: 'getEscortMsgDetail',
        method: 'post',
        data
    })
}
// 获取押运任务指令推送详情
export const aioVideoStreamHeart = (data) => {
    return axios({
        url: 'SendEscortVideoStreamHeart',
        method: 'post',
        data
    })
}