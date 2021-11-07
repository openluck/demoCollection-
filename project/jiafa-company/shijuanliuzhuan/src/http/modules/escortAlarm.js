import axios from '../axios'


//押运预警管理接口

export const queryEscortAlarm=(data)=>{
    return axios({
        url:'/queryEscortAlarm',
        method:'post',
        data
    })
}

export const confirmEscortAlarm=(data)=>{
    return axios({
        url:'/confirmEscortAlarm',
        method:'post',
        data
    })
}