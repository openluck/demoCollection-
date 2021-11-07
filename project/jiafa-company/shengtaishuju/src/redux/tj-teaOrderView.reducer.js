/*
 * @Author: tj 
 * @Date: 2020-02-20 15:57:41
 * @Last Modified by: tj
 * @Last Modified time: 2020-11-09 13:59:44
 */
import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';

const initState = {
    totalHour: '',//当前节次课时数
    teaNormalProp: '',//教师考勤正常率
    attenProp: '',//到课率
    frontProp: '',//前排就坐率
    sleepProp: '',//低头率
    vioProp: '',//课堂违纪率
    teaAttenHour: '',//教师考勤异常课时数
    vioHour: '',//违纪课时
    frontHour: '',//前排就坐率课时
    sleepHour: '',//低头率课时
    atten: '',//出勤课时
    aiWaringLeft: [],//AI预警类型组
    collageList: [],
    teaAtten: {
        normalProp: '',
        sortType: '',
        changeProp: '',
        pieData: []
    },
    stuAtten: {
        attenProp: '',
        sortType: '',
        changeProp: '',
        pieData: []
    },
    sleepPropData: {},
    frontPropData: {},
    vioPropData: {}

}
const TJGETDATA = 'TJGETDATA';
const TJLOADING = 'TJLOADING'

export const TJ_teaOrderView_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'TJGETDATA':
            return {
                ...state,
                ...action.data
            }
        case 'TJLOADING':
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
 * 获取正在直播的节次
 */
export const getViewSection = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            request('/api/visual/getHeadMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    resolve(data.sectionId)
                    sessionStorage.setItem('sectionId', data.sectionId)
                    sessionStorage.setItem('endSectionId', data.endSectionId)
                    // sessionStorage.setItem('sectionId','7')
                } else {
                    resolve(false)
                }
            })
        })
    }
}

// 根据节次获取当前课时、ai预警、头部总数
export const getViewMore = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('moreLoading', true))
            // let data = {
            //     objHour: 20,
            //     teaNormalProp: 50,
            //     attenProp: 40,
            //     frontProp: 80,
            //     sleepProp: 20,
            //     vioProp: 18,
            //     teaAttenHour: 10,
            //     vioHour: 3,
            //     frontHour: 10,
            //     sleepHour: 5,
            //     Atten: 0,
            //     aiWaringLeft: [{
            //         waringName: '教师缺勤',
            //         waringId: 1,
            //         waringHour: 4
            //     }, {
            //         waringName: '教师调课',
            //         waringId: 1,
            //         waringHour: 0
            //     }, {
            //         waringName: '教师迟到',
            //         waringId: 1,
            //         waringHour: 4
            //     }, {
            //         waringName: '教师早退',
            //         waringId: 1,
            //         waringHour: 2
            //     }],
            // }
            // let alertAiData = []
            // alertAiData.push(data.frontProp)
            // alertAiData.push(data.sleepProp)
            // alertAiData.push(data.vioProp)
            // alertAiData.push(data.attenProp)
            // alertAiData.push(data.teaAttenHour)
            // sessionStorage.setItem('alertAiData', alertAiData)
            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             totalHour: data.objHour,
            //             teaNormalProp: data.teaNormalProp,
            //             attenProp: data.attenProp,
            //             frontProp: data.frontProp,
            //             sleepProp: data.sleepProp,
            //             vioProp: data.vioProp,
            //             teaAttenHour: data.teaAttenHour,
            //             vioHour: data.vioHour,
            //             frontHour: data.frontHour,
            //             sleepHour: data.sleepHour,
            //             Atten: data.Atten,
            //             aiWaringLeft: data.aiWaringLeft,
            //         }
            //     })
            //     dispatch(changeLoading('moreLoading', false))
            // }, 3000)

            // return;
            request('/api/visual/getOrdMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    let alertAiData = []
                    alertAiData.push(data.frontProp)
                    alertAiData.push(data.sleepProp)
                    alertAiData.push(data.vioProp)
                    alertAiData.push(data.attenProp)
                    alertAiData.push(data.teaAttenHour)
                    sessionStorage.setItem('alertAiData', alertAiData)
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            totalHour: data.objHour,
                            teaNormalProp: data.teaNormalProp,
                            attenProp: data.attenProp,
                            frontProp: data.frontProp,
                            sleepProp: data.sleepProp,
                            vioProp: data.vioProp,
                            teaAttenHour: data.teaAttenHour,
                            vioHour: data.vioHour,
                            frontHour: data.frontHour,
                            sleepHour: data.sleepHour,
                            atten: data.atten,
                            aiWaringLeft: data.aiWaringLeft,
                        }
                    })
                    dispatch(changeLoading('moreLoading', false))
                } else {
                    dispatch(changeLoading('moreLoading', false))
                }

            }, () => {
                dispatch(changeLoading('moreLoading', false))
            })
        })
    }
}

// 根据节次和违纪类型获取学院列表
export const getCollageList = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('collageLoading', true))
            // let arr = []
            // let percent = 100;
            // for (let i = 0; i < 22; i++) {
            //     console.log(i)
            //     arr.push({
            //         id: i,
            //         name: '商务学院' + i,
            //         prop: percent
            //     })
            //     percent -= 2
            // }
            // let itemArr = [];
            // for (var i = 0, len = arr.length; i < len; i += 10) {
            //     itemArr.push(arr.slice(i, i + 10));
            // }

            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             collageList: itemArr
            //         }
            //     })
            //     dispatch(changeLoading('collageLoading', false))
            //     resolve(true)
            // }, 2000)
            // return;
            request('/api/visual/getOrdViolateMes', params, (res) => {
                if (res.result) {
                    let data = res.data.vioLateList;
                    if (data) {
                        let itemArr = [];
                        for (var i = 0, len = data.length; i < len; i += 8) {
                            itemArr.push(data.slice(i, i + 8));
                        }
                        console.log(itemArr)
                        dispatch({
                            type: TJGETDATA,
                            data: {
                                collageList: itemArr
                            }
                        })
                        resolve(true)
                    } else {
                        dispatch({
                            type: TJGETDATA,
                            data: {
                                collageList: []
                            }
                        })
                    }

                    dispatch(changeLoading('collageLoading', false))
                } else {
                    dispatch(changeLoading('collageLoading', false))
                }

            }, (err) => {
                dispatch(changeLoading('collageLoading', false))
            })
        })
    }
}

// 获取今日教师考勤
export const getTeaAtten = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('teaLoading', true))
            // let data = {
            //     normalProp: 50,
            //     sortType: '1',
            //     changeProp: '5',
            //     pieData: [
            //         {
            //             name: "调换课",
            //             prop: 1300
            //         },
            //         {
            //             name: "早退",
            //             prop: 800
            //         },
            //         {
            //             name: "迟到",
            //             prop: 700
            //         },
            //         {
            //             name: "缺勤",
            //             prop: 900
            //         }
            //     ]
            // }
            // setTimeout(()=>{
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             teaAtten: data
            //         }
            //     })
            //     dispatch(changeLoading('teaLoading', false))
            //     resolve(true)
            // },2000)

            // return;
            request('/api/visual/getOrdTodayAttend', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            teaAtten: data
                        }
                    })
                    dispatch(changeLoading('teaLoading', false))
                } else {
                    dispatch(changeLoading('teaLoading', false))
                }
            }, (err) => {
                dispatch(changeLoading('teaLoading', false))
            })
        })
    }
}

// 获取今日学生到课率考勤
export const getStuAtten = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('stuLoading', true))
            // let data = {
            //     attenProp: '80',
            //     sortType: '1',
            //     changeProp: '3',
            //     pieData: [
            //         {
            //             name: "0%-20%",
            //             prop: 1021
            //         },
            //         {
            //             name: "20%-40%",
            //             prop: 344
            //         },
            //         {
            //             name: "40%-60%",
            //             prop: 700
            //         },
            //         {
            //             name: "60%-80%",
            //             prop: 520
            //         },
            //         {
            //             name: "80%-100%",
            //             prop: 741
            //         }
            //     ]
            // }
            // setTimeout(()=>{
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             stuAtten: data
            //         }
            //     })
            //     dispatch(changeLoading('stuLoading', false))
            //     resolve(true)
            // },2000)

            // return;
            request('/api/visual/getOrdTodayToClass', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            stuAtten: data
                        }
                    })
                    dispatch(changeLoading('stuLoading', false))
                } else {
                    dispatch(changeLoading('stuLoading', false))
                }
            }, (err) => {
                dispatch(changeLoading('stuLoading', false))
            })
        })
    }
}

// 获取今日课堂情况
export const getTodayClass = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('classLoading', true))
            // let data = {
            //     sleepPropData: {
            //         sortType: "1",
            //         objProp: "30",
            //         changeProp: "5",
            //         objName: "1",
            //         objHour: "50"
            //     },
            //     frontPropData: {
            //         sortType: "2",
            //         objProp: "20",
            //         changeProp: "5",
            //         objName: "1",
            //         objHour: "50"
            //     },
            //     vioPropData: {
            //         sortType: "1",
            //         objProp: "80",
            //         changeProp: "5",
            //         objName: "1",
            //         objHour: "50"
            //     }
            // }
            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             sleepPropData: data.sleepPropData,
            //             frontPropData: data.frontPropData,
            //             vioPropData: data.vioPropData
            //         }
            //     })
            //     dispatch(changeLoading('classLoading', false))
            //     resolve(true)
            // }, 2000)
            // return;
            request('/api/visual/getOrdTodayClassMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            sleepPropData: data.sleepPropData,
                            frontPropData: data.frontPropData,
                            vioPropData: data.vioPropData
                        }
                    })
                    dispatch(changeLoading('classLoading', false))
                } else {
                    dispatch(changeLoading('classLoading', false))
                }
            }, (err) => {
                dispatch(changeLoading('classLoading', false))
            })
        })
    }
}

/**
 * 获取配置项
 */
export const getSetting = () => {
    return dispatch => {
        return new Promise((resolve,reject)=>{
            dispatch(changeLoading('moreLoading', true))
            request("/api/system/getSetInfo", {}, res => {
                if (res.result) {
                    let data = res.data
                    if (data) {
                        resolve(data)
                        dispatch(changeLoading('moreLoading', false))
                    }
                } else {
                    message.warning(res.message);
                }
            });
        })
    }
}


export const changeLoading = (type, value) => {
    return dispatch => {
        dispatch({
            type: TJLOADING,
            data: {
                [type]: value
            }
        })
    }
}