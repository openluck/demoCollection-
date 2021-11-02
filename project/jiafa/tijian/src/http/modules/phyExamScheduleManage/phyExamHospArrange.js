import axios from '../../axios'

// 体检医院编排 - 获取编排 -报名点 数组
export const getAssignsList = (data) => {
    return axios({
        // url: "/getAssignsList",
        url: "/phyExamHospArrange/getAssignsList",
        method: "post",
        data
    })
}

// 体检医院编排 - 获取编排-体检医院 数组
export const getHospitalList = (data) => {
    return axios({
        // url: "/getHospitalList",
        url: "/phyExamHospArrange/getHospitalList",
        method: "post",
        data
    })
}

// 体检医院编排 - 修改编排
export const updateArrange = (data) => {
    return axios({
        url: "/phyExamHospArrange/updateArrange",
        method: "post",
        data
    })
}
