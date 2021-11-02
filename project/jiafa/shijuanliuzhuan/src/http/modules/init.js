import axios from '../axios'


//押运任务监控接口

export const getSSO=(data)=>{
    return axios({
        url:'getSSO',
        method:'post',
        data
    })
}
export const getSystemConf=(data)=>{
    return axios({
        url:'getSystemConf',
        method:'post',
        data
    })
}
export const checkToken=(data)=>{
    return axios({
        url:'checkToken',
        method:'post',
        data
    })
}
export const getEnabledOrgs=(data)=>{
    return axios({
        url:'getEnabledOrgs',
        method:'post',
        data
    })
}
export const getSessionAndSubject=(data)=>{
    return axios({
        url:'getSessionAndSubject',
        method:'post',
        data
    })
}

export const getAvailableCars=(data)=>{
    return axios({
        url:'getAvailableCars',
        method:'post',
        data
    })
}
