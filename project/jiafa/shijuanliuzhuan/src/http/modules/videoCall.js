import axios from '../axios'



// 请求查看移动端视频
export const askMobileVideo = (data)=>{
    return axios({
        url:'/askMobileVideo',
        method:'post',
        data
    })
}

// 停止查看移动端视频
// export const stopMobileVideo = (data)=>{
//     return axios({
//         url:'/stopMobileVideo',
//         method:'post',
//         data
//     })
// }