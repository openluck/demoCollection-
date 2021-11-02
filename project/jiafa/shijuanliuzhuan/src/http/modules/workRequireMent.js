import axios from '../axios'


//工作要求设置管理接口

//查询值班在岗检查设置
export const getDutyCheckConf=(data)=>{
    return axios({
        url:'getDutyCheckConf',
        method:'post',
        data
    })
}
//更新值班在岗检查设置
export const updateDutyCheckConf=(data)=>{
    return axios({
        url:'/updateDutyCheckConf',
        method:'post',
        data
    })
}
//查询押运检查设置
export const getEscortCheckConf=(data)=>{
    return axios({
        url:'/getEscortCheckConf',
        method:'post',
        data
    })
}
//更新押运检查设置
export const updateEscortCheckConf=(data)=>{
    return axios({
        url:'/updateEscortCheckConf',
        method:'post',
        data
    })
}
//获取押运任务短信设置
export const getSmsSettings=(data)=>{
    return axios({
        url:'/getSmsSettings',
        method:'post',
        data
    })
}
//添加/更新押运任务短信设置
export const saveSmsSettings=(data)=>{
    return axios({
        url:'/saveSmsSettings',
        method:'post',
        data
    })
}
