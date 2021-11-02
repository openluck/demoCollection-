import axios from '../axios'


//押运计划管理接口

//查询
export const queryEscort = (data) => {
    return axios({
        url: '/queryEscort',
        method: 'post',
        data
    })
}
//新增和编辑
export const setEscort = (data) => {
    return axios({
        url: '/setEscort',
        method: 'post',
        data
    })
}
//618---编辑
export const setEscortDetail = (data) => {
    return axios({
        url: '/setEscortDetail',
        method: 'post',
        data
    })
}
//获取详情
export const getEscortDetail = (data) => {
    return axios({
        url: '/getEscortTaskDetail',
        // url:'/getEscortDetail',
        method: 'post',
        data
    })
}
//删除
export const deleteEscort = (data) => {
    return axios({
        url: '/deleteEscort',
        method: 'post',
        data
    })
}
//获取押运员
export const getPerson = (data) => {
    return axios({
        url: '/getPerson',
        method: 'post',
        data
    })
}

// 获取押运任务日志
export const getTaskLog = (data) => {
    return axios({
        url: '/queryEscortLoginfo',
        method: 'post',
        data,
    })
}
//**********押运任务管理查询

export const queryEscortManagementList = (data) => {
    return axios({
        url: '/queryEscortManagementList',
        method: 'post',
        data
    })
}

export const setBatchEscort = (data) => {
    return axios({
        url: '/setBatchEscort',
        method: 'post',
        data
    })
}

/**
 * @date 2021年2月25日09:54:42
 * @des 一键创建押运计划_v4.10_0203
 */
export const createBatchPlan = (data) => {
    return axios({
        url: '/createBatchPlan',
        method: 'post',
        data
    })
}

/**
 * @date 2021年2月25日09:54:42
 * @des 查询押运计划管理列表_v4.10_0203
 */
export const queryEscortPlanList = (data) => {
    return axios({
        url: '/queryEscortPlanList',
        method: 'post',
        data
    })
}
/**
 * @date 2021年2月25日09:54:42
 * @des 发布任务（新增与编辑通用）_v4.10_0203
 */
export const releaseTask = (data) => {
    return axios({
        url: '/releaseTask',
        method: 'post',
        data
    })
}
/**
 * @date 2021年2月25日09:54:42
 * @des 获取押运计划详情（编辑、详情）_v4.10_0203
 */
export const getEscortPlanDetail = (data) => {
    return axios({
        url: '/getEscortTaskDetail',
        // url:'/getEscortPlanDetail',
        method: 'post',
        data
    })
}
/**
 * @date 2021年2月25日09:54:42
 * @des 获取押运计划详情（编辑、详情）_v4.10_0203
 */
export const deleteEscortPlan = (data) => {
    return axios({
        url: '/deleteEscortPlan',
        method: 'post',
        data
    })
}
/**
 * @date 2021年2月26日2021年2月26日15:38:40
 * @des 导出试卷信息（计划管理与任务管理通用）_v4.10_0203
 */
export const exportPaper = (data) => {
    return axios({
        url: '/exportPaper',
        method: 'post',
        responseType: "blob",
        data
    })
}

/**
 * @date 2021年4月06日2021年4月06日16:38:40
 * @des 表单打印所有（考试清单通用）_v4.10_0406
 */
export const exportTable = (data) => {
    return axios({
        url: "/exportAllPaper",
        method: "post",
        responseType: "blob",
        headers: {
            "content-type": "application/json; charset=utf-8",
            token: sessionStorage.getItem("userInfo")
                ? JSON.parse(sessionStorage.getItem("userInfo")).token
                : "",
        },
        data,
    })
}


/**
 * @date 2021年4月08日2021年4月08日9:35:40
 * @des pdf获取（考试清单通用）_v4.10_0408
 */
export const exportPdf = (data) => {
    return axios({
        url: '/PaperDemandGetPrintPdfUrl',
        method: "post",
        data,
    })
}