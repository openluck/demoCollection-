/*
 * @Author: lilu 
 * @Date: 2020-02-11 12:53:47 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-27 14:59:19
 */
import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';

const initState = {
    breachData: [],
    inspectorAll: [],
    eventAll: [],
    total: 0,
    loading: false,
    inputData: {
        semesterId: '',//学期id
        courseId: "",//课程id
        teacherId: '',//教师id
        // collegeId: '',//开课院系id
        collegeId: '',//开课院系id
        courseNum:'', //课程号
        couTypeId: '',//课程类别id
        sectionId: '',//节次id
        startTime: null,
        endTime: null,
        inspectorId: '',
        eventId: '',
        pageNum: 1,
        pageSize: 20
    },
    breachstatus: false,
    eventList:[],
    inspectorList:[],
}
const BREACH = 'BREACH'

export const ll_breachDetail_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'BREACH':
            return {
                ...state,
                ...action.data
            }
        default:
            return {
                ...state
            }
    }

}

/**
 * 获取课堂违纪数据
 * @param {object} data 
 */
export const ll_getClassDiscipli = (data) => {
    return dispatch => {
        dispatch({
            type: 'BREACH',
            data: {
                loading: true,
                inputData:data
            }
        })
        request('/api/details/teaOrder/getClassDiscipli', data, (res) => {
            if (res.result && res.message) {
                dispatch({
                    type: 'BREACH',
                    data: {
                        breachData: res.data,
                        total: res.total
                    }
                })
            } else {
                message.warn(res.message)
            }
            dispatch({
                type: 'BREACH',
                data: {
                    loading: false
                }
            })
        }, () => {
            dispatch({
                type: 'BREACH',
                data: {
                    loading: true
                }
            })
        })
        // let res = {
        //     data: [
        //         {
        //             "id": "1",
        //             "time": 44845154454,
        //             "sectionName": "第一节",
        //             "couTypeName": "计算机学院",
        //             "collegeName": "计算机科学与技术",
        //             "statusName": "正常",
        //             "checkName": "条换课",
        //             "courseName": "数学",
        //             "addr": "计科楼",
        //             "teacherName": "王老师",
        //             'disciplineName': '小米',
        //             'score': '20',
        //             'event': '不听话',
        //             'info': '交头接耳',
        //             'inspectorName': '小王'


        //         },
        //         {
        //             "id": "2",
        //             "time": 44845154454,
        //             "sectionName": "第一节",
        //             "couTypeName": "计算机学院",
        //             "collegeName": "计算机科学与技术",
        //             "statusName": "正常",
        //             "sectionName": "第一节",
        //             "checkName": "条换课",
        //             "courseName": "数学",
        //             "addr": "计科楼",
        //             "teacherName": "王老师",
        //             'disciplineName': '小米',
        //             'score': '20',
        //             'event': '不听话',
        //             'info': '交头接耳',
        //             'inspectorName': '小王'

        //         },
        //         {
        //             "id": "3",
        //             "time": 44845154454,
        //             "sectionName": "第一节",
        //             "couTypeName": "计算机学院",
        //             "collegeName": "计算机科学与技术",
        //             "statusName": "正常",
        //             "sectionName": "第一节",
        //             "checkName": "条换课",
        //             "courseName": "数学",
        //             "addr": "计科楼",
        //             "teacherName": "王老师",
        //             'disciplineName': '小米',
        //             'score': '20',
        //             'event': '不听话',
        //             'info': '交头接耳',
        //             'inspectorName': '小王'
        //         },
        //     ],
        //     total: 700,
        //     result: true
        // }
        // dispatch({
        //     type: 'BREACH',
        //     data: {
        //         breachData: res.data,
        //         total: res.total
        //     }
        // })

    }
}

/**
 * 下载课堂违纪
 * @param {object} data 
 */
export const ll_downDiscipli = (data) => {
    return dispatch => {
        request('/api/details/teaOrder/downDiscipli', data, (res, name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob, name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }
}

/**
 * 获取违纪事件和违纪人员数据
 */
export const ll_getInfor = () => {
    return dispatch => {
        dispatch({
            type: 'BREACH',
            data: {
                loading: true
            }
        })
        return Promise.all([
            new Promise((resolve, reject) => {
                request('/api/details/teaOrder/getDiscipliEvent', {}, (res) => {
                    if (res.result && res.data) {
                        let data = res.data;
                        data.forEach((val) => {
                            if (val.eventList && val.eventList.length) {
                                val.eventList.unshift({ eventId: '', eventName: '全部' })
                            }
                        })
                        dispatch({
                            type: 'BREACH',
                            data: {
                                eventAll: data,
                            }
                        })
                    } else {
                        dispatch({
                            type: 'BREACH',
                            data: {
                                loading: false
                            }
                        })
                        message.warn(res.message)
                    }
                    resolve(res)
                }, () => {
                    dispatch({
                        type: 'BREACH',
                        data: {
                            eventAll: [],
                            loading: false
                        }
                    })
                })
                ///api/details/teaOrder/getDiscipliEvent 违纪事件
                // let res = {
                //     data: [
                //         {
                //             semesterId: '2018up',
                //             eventList: [
                //                 { eventId: '', eventName: '全部' },
                //                 { eventId: '111', eventName: '事件一' },
                //                 { eventId: '222', eventName: '事件二' },
                //                 { eventId: '333', eventName: '事件三' },
                //             ]
                //         },
                //         {
                //             semesterId: '2018next',
                //             eventList: [
                //                 { eventId: '', eventName: '全部' },
                //                 { eventId: '444', eventName: '事件四' },
                //                 { eventId: '555', eventName: '事件五' },
                //                 { eventId: '666', eventName: '事件六' },
                //             ]
                //         },
                //         {
                //             semesterId: '2019up',
                //             eventList: [
                //                 { eventId: '', eventName: '全部' },
                //                 { eventId: '777', eventName: '事件七' },
                //                 { eventId: '888', eventName: '事件八' },
                //                 { eventId: '999', eventName: '事件九' },
                //             ]
                //         },
                //         {
                //             semesterId: '2019next',
                //             eventList: [
                //                 { eventId: '', eventName: '全部' },
                //                 { eventId: '000', eventName: '事件十' },
                //                 { eventId: '11111', eventName: '事件十一' },
                //                 { eventId: '2222', eventName: '事件十二' },
                //             ]
                //         },


                //     ],
                //     result: true
                // }
                // if (res.result && res.data) {
                //     dispatch({
                //         type: 'BREACH',
                //         data: {
                //             eventAll: res.data
                //         }
                //     })
                // }
                // resolve(res)
            }),
            new Promise((resolve, reject) => {
                ///api/details/teaOrder/getInspector 巡课员
                request('/api/details/teaOrder/getInspector', {}, res => {
                    if (res.result && res.data) {
                        let data = res.data;
                        data.forEach((val) => {
                            if (val.inspectorList && val.inspectorList.length) {
                                val.inspectorList.unshift({ inspectorId: '', inspectorName: '全部' })
                            }
                        })
                        dispatch({
                            type: 'BREACH',
                            data: {
                                inspectorAll: res.data
                            }
                        })
                    } else {
                        dispatch({
                            type: 'BREACH',
                            data: {
                                loading: false
                            }
                        })
                        message.warn(res.message)
                    }
                    resolve(res)
                }, () => {
                    dispatch({
                        type: 'BREACH',
                        data: {
                            inspectorAll: [],
                            loading: false
                        }
                    })
                })
                // let res = {
                //     data: [
                //         {
                //             semesterId: '2018up',
                //             inspectorList: [
                //                 { inspectorId: '', inspectorName: '全部' },
                //                 { inspectorId: 'www', inspectorName: '小王' },

                //             ]
                //         },
                //         {
                //             semesterId: '2018next',
                //             inspectorList: [
                //                 { inspectorId: '', inspectorName: '全部' },
                //                 { inspectorId: 'www', inspectorName: '小王' },
                //                 { inspectorId: 'lll', inspectorName: '小李' },
                //                 { inspectorId: 'ooo', inspectorName: '小欧' },
                //             ]
                //         },
                //         {
                //             semesterId: '2019up',
                //             inspectorList: [
                //                 { inspectorId: '', inspectorName: '全部' },
                //                 { inspectorId: 'hhh', inspectorName: '小胡' },
                //                 { inspectorId: 'zzz', inspectorName: '小张' },
                //             ]
                //         },
                //         {
                //             semesterId: '2019next',
                //             inspectorList: [
                //                 { inspectorId: '', inspectorName: '全部' },
                //                 { inspectorId: 'hhh', inspectorName: '小瀚' },
                //                 { inspectorId: 'lll', inspectorName: '小李' },
                //                 { inspectorId: 'uuu', inspectorName: '小鹿' },
                //             ]
                //         },

                //     ],
                //     result: true
                // }
                // if (res.result && res.data) {
                //     dispatch({
                //         type: 'BREACH',
                //         data: {
                //             inspectorAll: res.data
                //         }
                //     })
                // }
                // resolve(res)
            })
        ])
    }
}

export const ll_breachstatus = (data)=>{
    return dispatch=>{
        dispatch({
            type:'BREACH',
            data:{
                breachstatus:data
            }
        })
    }
}

// export const ll_saveEventList = (data)=>{

// }
