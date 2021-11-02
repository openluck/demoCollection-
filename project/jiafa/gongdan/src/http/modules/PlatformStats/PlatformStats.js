import axios from '../../axios'

// 平台统计

//统计总数
export const staSum = (data) => {
    return axios({
        url: "/statistics/sum",
        method: "post",
        data
    })
}

//注册用户与认证用户
export const regAndCer = (data) => {
    return axios({
        url: "/statistics/regAndCer",
        method: "post",
        data
    })
}

//app下载量
export const appDownloads = (data) => {
    return axios({
        url: "/statistics/appDownloads",
        method: "post",
        data
    })
}

//认证与未认证用户
export const authenAndUnver = (data) => {
    return axios({
        url: "/statistics/authenAndUnver",
        method: "post",
        data
    })
}

//用户手机品牌
export const phoneBrand = (data) => {
    return axios({
        url: "/statistics/phoneBrand",
        method: "post",
        data
    })
}

//开放api调用占比
export const apiProportion = (data) => {
    return axios({
        url: "/statistics/apiProportion",
        method: "post",
        data
    })
}

//异常调用排行
export const errRank = (data) => {
    return axios({
        url: "/statistics/errRank",
        method: "post",
        data
    })
}

//api调用趋势图
export const apiTrend = (data) => {
    return axios({
        url: "/statistics/apiTrend",
        method: "post",
        data
    })
}

//热门应用排行
export const hotAppRank = (data) => {
    return axios({
        url: "/statistics/hotAppRank",
        method: "post",
        data
    })
}

//前15热门搜索词
export const hotKeyword = (data) => {
    return axios({
        url: "/statistics/hotKeyword",
        method: "post",
        data
    })
}
//消息发布占比
export const msgScale = (data) => {
    return axios({
        url: "/statistics/msgScale",
        method: "post",
        data
    })
}