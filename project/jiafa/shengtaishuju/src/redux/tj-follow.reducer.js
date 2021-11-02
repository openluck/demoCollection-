/*
 * @Author: tj 
 * @Date: 2020-07-24 10:00:00
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 14:42:11
 */
import G from './../config/g';
import { request } from "../util/request";
import moment from "moment";
const initState = {
    dataClaList: [],
    loading: true,
    dataColList: [],
    detailList: [],
    total: 0,
    errorStateNum: '',
    replyNum: '',
    expireReplyNum: '',
    applyNorNum: '',
    noApplyNum: '',
    allowApplyNum: '',
    realCourseNum: '',
    headParams: {}
}
const TJGETDATA = 'TJGETDATA';

export const TJ_follow_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'TJGETDATA':
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


export const getClassData = (params) => {
    return dispatch => {
        console.log('按照课堂请求参数', params)
        // let data = [{
        //     checkName: "2",
        //     checkNameEnd: '2',
        //     claAddress: "九教3-2",
        //     claRoomId: "96da1f37989f3f19fbbd1345575dd23a",
        //     collegeName: "华西公共卫生学院",
        //     courseName: "健康与社会模块-2",
        //     courseTime: "2020-12-09第5,6,7节",
        //     frontSeatRate: "",
        //     frontSeatRateEnd: '',
        //     sleepRate: "",
        //     sleepRateEnd: '',
        //     stuOnAttRate: "83",
        //     stuOnAttRateEnd: '83',
        //     teacherName: "袁萍",
        //     replyStatus: '0',
        //     finishResult: '0'
        // }, {
        //     checkName: "3",
        //     checkNameEnd: '3',
        //     claAddress: "九教3-2",
        //     claRoomId: "96da1f37989f3f19fbbd1345575dd23b",
        //     collegeName: "华西公共卫生学院",
        //     courseName: "健康与社会模块-2",
        //     courseTime: "2020-12-09第5,6,7节",
        //     frontSeatRate: "400.0",
        //     frontSeatRateEnd: '400.0',
        //     sleepRate: "17.0",
        //     sleepRateEnd: '80',
        //     stuOnAttRate: "83",
        //     stuOnAttRateEnd: '83',
        //     teacherName: "袁萍",
        //     replyStatus: '1',
        //     finishResult: '1'
        // }, {
        //     checkName: "2",
        //     checkNameEnd: '1',
        //     claAddress: "九教3-2",
        //     claRoomId: "96da1f37989f3f19fbbd1345575dd23c",
        //     collegeName: "华西公共卫生学院",
        //     courseName: "健康与社会模块-2",
        //     courseTime: "2020-12-09第5,6,7节",
        //     frontSeatRate: "400.0",
        //     frontSeatRateEnd: '400.0',
        //     sleepRate: "17.0",
        //     sleepRateEnd: '80',
        //     stuOnAttRate: "",
        //     stuOnAttRateEnd: '',
        //     teacherName: "袁萍",
        //     replyStatus: '2',
        //     finishResult: '0'
        // }]

        dispatch({
            type: TJGETDATA,
            data: {
                loading:true
            }
        })
        // return;
        request('/api/improve/getClassTrackList', params, (res) => {
            if (res.result) {
                let data = res.data;
                dispatch({
                    type: TJGETDATA,
                    data: {
                        dataClaList: data,
                        total: res.total,
                        loading:false
                    }
                })
            } else {
                dispatch({
                    type: TJGETDATA,
                    data: {
                        dataClaList: [],
                        total: 0,
                        loading:false
                    }
                })
            }
        },error=>{
            dispatch({
                type: TJGETDATA,
                data: {
                    dataClaList: [],
                    total: 0,
                    loading:false
                }
            })
        })

    }
}

export const getColData = (params) => {
    return dispatch => {
        console.log('按照学院请求参数', params)
        // let data = [{
        //     collegeId: "96da1f37989f3f19fbbd1345575dd23a",
        //     collegeName: "华西公共卫生学院",
        //     errorNum: "10",
        //     replyNum: "2",
        //     replyProp: "20",
        //     expReplyNum: '5',
        //     applyNorNum: "2",
        //     realNum: '2',
        // }, {
        //     collegeId: "96da1f37989f3f19fbbd1345575dd23b",
        //     collegeName: "华西公共卫生学院",
        //     errorNum: "10",
        //     replyNum: "2",
        //     replyProp: "50",
        //     expReplyNum: '5',
        //     applyNorNum: "2",
        //     realNum: '2',
        // }, {
        //     collegeId: "96da1f37989f3f19fbbd1345575dd23c",
        //     collegeName: "华西公共卫生学院",
        //     errorNum: "10",
        //     replyNum: "2",
        //     replyProp: "60",
        //     expReplyNum: '5',
        //     applyNorNum: "2",
        //     realNum: '2',
        // }]

        dispatch({
            type: TJGETDATA,
            data: {
                loading:true
            }
        })
        // return;
        request('/api/improve/getColTrackList', params, (res) => {
            if (res.result) {
                let data = res.data;
                dispatch({
                    type: TJGETDATA,
                    data: {
                        dataColList: data,
                        total: res.total,
                        loading:false
                    }
                })
            } else {
                dispatch({
                    type: TJGETDATA,
                    data: {
                        loading:false
                    }
                })
            }
        },error=>{
            dispatch({
                type: TJGETDATA,
                data: {
                    loading:false
                }
            })
        })

    }
}


export const getDetailData = (params) => {
    return dispatch => {
        console.log('详情请求参数', params)
        // let data = [{
        //     checkName: "2",
        //     checkNameEnd: '2',
        //     claAddress: "九教3-2",
        //     claRoomId: "96da1f37989f3f19fbbd1345575dd23a",
        //     collegeName: "华西公共卫生学院",
        //     courseName: "健康与社会模块-2",
        //     courseTime: "2020-12-09第5,6,7节",
        //     frontSeatRate: "",
        //     frontSeatRateEnd: '',
        //     sleepRate: "",
        //     sleepRateEnd: '',
        //     stuOnAttRate: "83",
        //     stuOnAttRateEnd: '83',
        //     teacherName: "袁萍",
        //     replyStatus: '0',
        //     finishResult: '0'
        // }, {
        //     checkName: "3",
        //     checkNameEnd: '3',
        //     claAddress: "九教3-2",
        //     claRoomId: "96da1f37989f3f19fbbd1345575dd23b",
        //     collegeName: "华西公共卫生学院",
        //     courseName: "健康与社会模块-2",
        //     courseTime: "2020-12-09第5,6,7节",
        //     frontSeatRate: "400.0",
        //     frontSeatRateEnd: '400.0',
        //     sleepRate: "17.0",
        //     sleepRateEnd: '80',
        //     stuOnAttRate: "83",
        //     stuOnAttRateEnd: '83',
        //     teacherName: "袁萍",
        //     replyStatus: '1',
        //     finishResult: '1'
        // }, {
        //     checkName: "2",
        //     checkNameEnd: '1',
        //     claAddress: "九教3-2",
        //     claRoomId: "96da1f37989f3f19fbbd1345575dd23c",
        //     collegeName: "华西公共卫生学院",
        //     courseName: "健康与社会模块-2",
        //     courseTime: "2020-12-09第5,6,7节",
        //     frontSeatRate: "400.0",
        //     frontSeatRateEnd: '400.0',
        //     sleepRate: "17.0",
        //     sleepRateEnd: '80',
        //     stuOnAttRate: "",
        //     stuOnAttRateEnd: '',
        //     teacherName: "袁萍",
        //     replyStatus: '2',
        //     finishResult: '0'
        // }]

        dispatch({
            type: TJGETDATA,
            data: {
                loading:true
            }
        })
        // return;
        request('/api/improve/getClassTrackList', params, (res) => {
            if (res.result) {
                let data = res.data;
                dispatch({
                    type: TJGETDATA,
                    data: {
                        detailList: data,
                        total: res.total,
                        loading:false
                    }
                })
            } else {

            }
        })

    }
}

export const getStaticData = (params) => {
    return dispatch => {
        console.log('统计请求参数', params)
        // let data = {
        //     errorStateNum: "10",
        //     replyNum: '2',
        //     expireReplyNum: "2",
        //     applyNorNum: "8",
        //     noApplyNum: "4",
        //     allowApplyNum: "2",
        //     realCourseNum: "2",
        // }

    
        // return;
        request('/api/improve/getTrackStatic', params, (res) => {
            if (res.result) {
                let data = res.data;
                dispatch({
                    type: TJGETDATA,
                    data: {
                        ...data
                    }
                })
            } else {

            }
        })

    }
}

export const saveParams = (data) => {
    return dispatch => {
        dispatch({
            type: TJGETDATA,
            data: {
                headParams: data,
            }
        })
    }
}

export const changeLoading = (data) => {
    return dispatch => {
        dispatch({
            type: TJGETDATA,
            data: {
                loading: data,
            }
        })
    }
}