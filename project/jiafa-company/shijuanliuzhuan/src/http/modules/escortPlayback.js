import axios from '../axios'


//查询押运回放记录接口

export const queryEscortPlayback = (data)=>{
    return axios({
        url:'/queryEscortRplay',
        method:'post',
        data
    })
}


// 确认押运回放记录接口
export const confirmEscortPlayback = (data)=>{
    return axios({
        url:'/confirmEscortReplay',
        method:'post',
        data
    })
}

