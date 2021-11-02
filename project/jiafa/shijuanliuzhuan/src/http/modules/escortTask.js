import axios from '../axios'


//获取押运任务详情
export const getEscortTaskDetail=(data)=>{
    return axios({
        url:'/getEscortTaskDetail',
        method:'post',
        data
    })
}

//获取押运任务详情
export const getOvertimeTask=(data)=>{
    return axios({
        url:'/getOvertimeTask',
        method:'post',
        data
    })
}

//获取押运任务试卷清单
export const getEscortPaperList=(data)=>{
    return axios({
        url:'/queryEscortPaperList',
        method:'post',
        data
    })
}

//押运任务 人员车辆信息保存
export const saveCarsPersons=(data)=>{
    return axios({
        url:'/saveCarsPersons',
        method:'post',
        data
    })
}
//押运任务 获取车载设备试卷箱摄像机_
export const queryDeviceList=(data)=>{
    return axios({
        url:'/queryDeviceList',
        method:'post',
        data
    })
}

//押运任务 押运任务 路线规划保存
export const saveMapCircuit=(data)=>{
    return axios({
        url:'/saveMapCircuit',
        method:'post',
        data
    })
}

//押运任务 获取强制操作记录
export const getForceActionRecord=(data)=>{
    return axios({
        url:'/getForceActionRecord',
        method:'post',
        data
    })
}

//押运任务 确认任务
export const releaseTaskDetail=(data)=>{
    return axios({
        url:'/releaseTaskDetail',
        method:'post',
        data
    })
}

//获取强制操作二维码
export const getForceActionQRCode=(data)=>{
    return axios({
        url:'/forceActionQRCode',
        method:'post',
        data
    })
}

//获取强制操作二维码
export const getForceSignStatus=(data)=>{
    return axios({
        url:'/forceSignStatus',
        method:'post',
        data
    })
}

