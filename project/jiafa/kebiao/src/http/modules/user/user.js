import axios from '../../axios'

// 码表管理-获取码表列表
export const login = (data) => {
    return axios({
        url: "/user/login",
        method: "post",
        data
    })
}

export const getUserInfo = (data) => {
    return axios({
        url: "/user/info",
        method: "post",
        data
    })
}

export const logout = (data) => {
    return axios({
        url: "/user/logout",
        method: "post",
        data
    })
}