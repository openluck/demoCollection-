import axios from '../../axios'

// 码表管理-获取码表列表
export const login = (data) => {
    return axios({
        url: "/login",
        method: "post",
        data
    })
}

// 获取用户信息
export const getUserInfo = (data) => {
    return axios({
        url: "/getUserInfo",
        method: "post",
        data
    })
}

export const logout = (data) => {
    return axios({
        url: "/logout",
        method: "post",
        data
    })
}

// token鉴权
export const checkToken = (data) => {
    return axios({
        url: "/checkToken",
        method: "post",
        data
    })
}