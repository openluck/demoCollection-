

import { request } from "../util/request";
import { message } from "antd";

const initState = {
    stuOnAttRate: 0,
    frontSeatRate: 0,
    sleepRate: 0,
    identifyResults: [],
    detailsInfo: {
        collegeName: "",
        subject: "",
        claAddress: "",
        couTypeName: "",
        teacherName: "",
        date: "",
        courseNum: "",
        checkName: "",
        courseSection: [],
        stuNum: "",
        actualImgAddress: "",
        imgAddress: "",
        claRoomId: ""
    },
    teaImgs: [],
    stuImgs: [],
    loading: false,
    replyInfo: ''
}

export const ll_playPage_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'PLAYPAGE':
            return {
                ...state,
                ...action.data
            }

        default:
            return {
                ...state,
            }
    }
}

/**
 * 获取学生状态数据
 * @param {*} data 
 */
export const ll_getClassDetailsStatus = (data) => {
    return dispatch => {
        dispatch({
            type: 'PLAYPAGE',
            data: {
                loading: true
            }
        })
        request('/api/public/getClassDetailsStatus', { claRoomId: data }, (res) => {
            if (res.data && res.result) {
                let data = res.data;
                dispatch({
                    type: 'PLAYPAGE',
                    data: {
                        stuOnAttRate: data.stuOnAttRate,
                        frontSeatRate: data.frontSeatRate,
                        sleepRate: data.sleepRate,
                        identifyResults: data.identifyResults,
                        loading: false
                    }
                })
            } else {
                dispatch({
                    type: 'PLAYPAGE',
                    data: {
                        loading: false
                    }
                })
                message.warn(res.message)
            }
        }, () => {
            dispatch({
                type: 'PLAYPAGE',
                data: {
                    loading: false
                }
            })
        })
        // console.log('获取学生到课率')
        // dispatch({
        //     type: 'PLAYPAGE',
        //     data: {
        //         stuOnAttRate: 21.56,
        //         frontSeatRate: 15,
        //         sleepRate: 5.5,
        //         identifyResults: [
        //             {
        //                 date: '08:00',
        //                 stuOnAttRate: 20,
        //                 frontSeatRate: 30,
        //                 sleepRate: 50.25,
        //             },
        //             {
        //                 date: '09:00',
        //                 stuOnAttRate: 10,
        //                 frontSeatRate: 50,
        //                 sleepRate: 22,
        //             },
        //             {
        //                 date: '10:00',
        //                 stuOnAttRate: 50,
        //                 frontSeatRate: 60,
        //                 sleepRate: 23,
        //             }
        //         ],
        //         loading:false

        //     }
        // })
    }
}


/**
 * 获取课堂信息
 * @param {*} data 
 */
export const ll_getClassDetailsInfo = (data) => {
    return dispatch => {
        request('/api/public/getClassDetailsInfo', { claRoomId: data }, (res) => {
            if (res.data && res.result) {
                dispatch({
                    type: 'PLAYPAGE',
                    data: {
                        detailsInfo: res.data
                    }
                })
            } else {
                message.warn(res.message)
            }
        }, () => {

        })

        // dispatch({
        //     type:'PLAYPAGE',
        //     data:{
        //         detailsInfo:{
        //             collegeName:"计算机学院",
        //             subject:"数学",
        //             claAddress:"一教",
        //             couTypeName:"校外专家课",
        //             teacherName:"王老师",
        //             date:"2020.02.01 第二节",
        //             courseNum:"05",
        //             checkName:"1",
        //             courseSection:[
        //                 {
        //                     sectionId:'1',
        //                     sectionStatus:'2'
        //                 },
        //                 {
        //                     sectionId:'2',
        //                     sectionStatus:'1'
        //                 }
        //             ],
        //             stuNum:"200",
        //             actualImgAddress:"http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg",
        //             imgAddress:"http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg",
        //         }
        //     }
        // })
    }
}


/**
 * 获取课堂图片-学生图片
 * @param {*} data 
 */
{/*export const ll_getClassDetailsImg = (data) => {
    return dispatch => {
        request('api/public/getClassDetailsImg', { claRoomId: data }, (res) => {
            if (res.data && res.result) {
                let data = res.data;
                // let tea=[{
                //     name:'开始考勤时间',
                //     time:1602741600000,
                //     imgs:['/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/e056420abe0347d38ad3f31f3294ff8d',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862'
                // ]
                // },
                // {
                //     name:'结束考勤时间',
                //     time:1602750900000,
                //     imgs:['/cloud/file/8651010000002/e056420abe0347d38ad3f31f3294ff8d',
                //     '/cloud/file/8651010000002/7c87375a56b34aea8c38962ea4b57ef8',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862'
                // ]
                // }]
                dispatch({
                    type: 'PLAYPAGE',
                    data: {
                        stuImgs: data.stuImgs
                    }
                })
            } else {
                message.warn(res.message)
            }
        }, () => {

        })
    }
}*/}


/**
 * 获取课堂学生各项信息图片
 * @param {*} data 
 */
export const lxx_getStuImg = (data) => {
    return dispatch => {
        request('api/public/getClassStuImg', { claRoomId: data }, (res) => {
            if (res.data && res.result) {
                let data = res.data;
                // let data = {
                //     stuOnAttInfo: {
                //         planNum: 60,
                //         imgs: [{
                //             imgUrl: '',
                //             num: 58
                //         }, 
                //         {
                //             imgUrl: '/cloud/file/8651010000002/11d99adf91874ae887390a7ee2f88db7',
                //             num: 55
                //         },
                //         {
                //             imgUrl: '/cloud/file/8651010000002/11d99adf91874ae887390a7ee2f88db7',
                //             num: 50
                //         },
                //         ]
                //     },
                //     frontSeatInfo: {
                //         planNum: 15,
                //         imgs: [{
                //             imgUrl: '/cloud/file/8651010000002/11d99adf91874ae887390a7ee2f88db7',
                //             num: 12
                //         }, 
                //         {
                //             imgUrl: '/cloud/file/8651010000002/11d99adf91874ae887390a7ee2f88db7',
                //             num: 5
                //         },
                //         {
                //             imgUrl: '/cloud/file/8651010000002/11d99adf91874ae887390a7ee2f88db7',
                //             num: 0
                //         },
                //         ]
                //     },
                //     sleepInfo: [{
                //         imgUrl: '/cloud/file/8651010000002/11d99adf91874ae887390a7ee2f88db7',
                //         num: 0,
                //         realNum: 10
                //     }]
                // }
                dispatch({
                    type: 'PLAYPAGE',
                    data: {
                        stuImgs: data
                    }
                })
            } else {
                message.warn(res.message)
            }
        }, () => {

        })
    }
}

/**
 * 获取教师课堂考勤图片
 * @param {String} data 课堂id
 */
export const lxx_getTeaImgs = (data) => {
    return dispatch => {
        request('api/public/getTeaDetailsImg', { claRoomId: data }, (res) => {
            if (res.data && res.result) {
                let data = res.data;
                // let data=[{
                //     name:'开始考勤时间',
                //     time:1602741600000,
                //     imgs:['/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/e056420abe0347d38ad3f31f3294ff8d',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862'
                // ]
                // },
                // {
                //     name:'结束考勤时间',
                //     time:1602750900000,
                //     imgs:['/cloud/file/8651010000002/e056420abe0347d38ad3f31f3294ff8d',
                //     '/cloud/file/8651010000002/7c87375a56b34aea8c38962ea4b57ef8',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862',
                //     '/cloud/file/8651010000002/af6fb4ec9fed45d9a5e4a10b254a2862'
                // ]
                // }]
                dispatch({
                    type: 'PLAYPAGE',
                    data: {
                        teaImgs: data
                    }
                })
            } else {
                message.warn(res.message)
            }
        }, () => {

        })
    }
}

/**
 * 重置数据
 */
export const lxx_init = () => {
    return dispatch => {
        dispatch({
            type: 'PLAYPAGE',
            data: {
                stuOnAttRate: 0,
                frontSeatRate: 0,
                sleepRate: 0,
                identifyResults: [],
                teaImgs: [],
                stuImgs: [],
                detailsInfo: {
                    collegeName: "",
                    subject: "",
                    claAddress: "",
                    couTypeName: "",
                    teacherName: "",
                    date: "",
                    courseNum: "",
                    checkName: "",
                    courseSection: [],
                    stuNum: "",
                    actualImgAddress: "",
                    imgAddress: "",
                    claRoomId: ""
                },
                replyInfo: ''
            }
        })
    }
}

/**
 * 获取课堂回复详情
 * @param {String} data 课堂id
 */
export const lxx_getReplyInfo = (data) => {
    return dispatch => {
        request('api/public/getReplyInfo', { claRoomId: data }, (res) => {
            if (res.data && res.result) {
                let data = res.data;
                dispatch({
                    type: 'PLAYPAGE',
                    data: {
                        replyInfo: data || "",
                    }
                })
            } else {
                message.warn(res.message)
            }
        }, () => {

        })
    }
}