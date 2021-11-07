/*
 * @Author: tj 
 * @Date: 2020-02-20 15:57:41
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 14:36:56
 */
import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';

const initState = {
    totalHour: '',//当前节次课时数
    stuStand: '',//学生起立课时数
    teaGo: '',//老师上下讲台次数
    teaDesgin: { //教学分析
        behaviorList: [],
        disList: [],
        testType: '',
        speekType: '',
        mixType: '',
        teachType: '',
        max: ''
    },
    stuResponse: {//学生听课反馈
        stuBehaviorList: [],
        stuFaceList: [],
        confuseProp: '',
        focusProp: '',
        joinProp: '',
        activeProp: '',
        max: ''
    },
    aiStuResponse: {//ai学生听课反馈
        stuBehaviorList: [],
        stuFaceList: [],
        confuseProp: '',
        focusProp: '',
        joinProp: '',
        activeProp: '',
        max: ''
    },
    aiTeaDesgin: { //ai教学分析
        behaviorList: [],
        disList: [],
        testType: '',
        speekType: '',
        mixType: '',
        teachType: '',
        max: ''
    },
    stuStandToday: '',//今日学生起立
    teaPatrol: '',//今日教师巡课
}
const TJGETDATA = 'TJGETDATA';
const TJLOADING = 'TJLOADING';

export const TJ_teaQuaView_reducer = (state = initState, action) => {
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

// 通过节次获得总数数据
export const getQuaTotal = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // let data = {
            //     objHour: '40',
            //     stuStand: '4',
            //     teaGo: '10'
            // }
            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             totalHour: data.objHour,
            //             stuStand: data.stuStand,
            //             teaGo: data.teaGo
            //         }
            //     })
            // }, 2000);

            // return;
            request('/api/visual/getQuaMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            totalHour: data.objHour,
                            stuStand: data.stuStand,
                            teaGo: data.teaPatrol
                        }
                    })
                }

            })
        })
    }
}


/**
 * 获取正在直播的节次
 */
export const getViewSection= (params)=>{
    return dispatch => {
        return new Promise((resolve, reject) => {
            request('/api/visual/getHeadMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    if(data.endSectionId){
                        resolve(data.endSectionId)
                        sessionStorage.setItem('sectionId',data.sectionId)
                    }else{
                        if(data.sectionId){
                            resolve(data.sectionId*1-1>0?JSON.stringify(data.sectionId*1-1):'1')
                        }else{
                            resolve('undefined')
                        }
                        
                    }
                    
                    sessionStorage.setItem('sectionId',data.sectionId)
                    sessionStorage.setItem('endSectionId',data.endSectionId)
                    // sessionStorage.setItem('sectionId','7')
                }else{
                    resolve(false)
                }
            })
        })}
}

// 获得教学分析数据
export const getQuaAnaly = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('analyLoading', true))
            // let data = { //教学分析
            //     behaviorList: [
            //         {
            //             name: "板书",
            //             prop: 20
            //         },
            //         {
            //             name: "多媒体",
            //             prop: 45
            //         },
            //         {
            //             name: "巡视",
            //             prop: 55
            //         }
            //     ],
            //     disList: [
            //         { name: '师生互动', prop: 20 },
            //         { name: '教师讲授', prop: 15 },
            //         { name: '学生自习', prop: 12 },
            //         { name: '学生展示', prop: 33 },
            //         { name: '生生互动', prop: 20 },
            //     ],
            //     testType: '42',
            //     speekType: '20',
            //     mixType: '35',
            //     teachType: '15'
            // }
            // let numArry=[]
            // numArry.push(data.testType)
            // numArry.push(data.speekType)
            // numArry.push(data.mixType)
            // numArry.push(data.teachType)
            // numArry.sort((a,b)=>{
            //     return b-a
            // })
            // data.max=numArry[0]
            // let arry = []
            // data.disList.forEach(item => {
            //     arry.push({ name: item.name, value: item.prop })
            // });
            // data.disList = arry;
            // setTimeout(()=>{
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             teaDesgin: data
            //         }
            //     })
            //     dispatch(changeLoading('analyLoading',false))
            // },2000)

            // return;
            request('/api/visual/getQuaTeachAna', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    let numArry = []
                    numArry.push(data.testType)
                    numArry.push(data.speekType)
                    numArry.push(data.mixType)
                    numArry.push(data.teachType)
                    numArry.sort((a, b) => {
                        return b - a
                    })
                    data.max = numArry[0]
                    let arry = []
                    data.disList.forEach(item => {
                        arry.push({ name: item.name, value: item.prop })
                    });
                    data.disList = arry;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            teaDesgin: data
                        }
                    })
                    dispatch(changeLoading('analyLoading', false))
                }

            },(err)=>{
                dispatch(changeLoading('analyLoading', false))
            })
        })
    }
}

// 获得听讲反馈
export const getQuaResponse = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('responseLoading', true))
            // let data = { //教学分析
            //     stuBehaviorList: [
            //         {
            //             name: "书写",
            //             prop: 15
            //         },
            //         {
            //             name: "阅读",
            //             prop: 30
            //         },
            //         {
            //             name: "玩手机",
            //             prop: 5
            //         },
            //         {
            //             name: "趴桌子",
            //             prop: 10
            //         },
            //         {
            //             name: "站立",
            //             prop: 10
            //         },
            //         {
            //             name: "听讲",
            //             prop: 8
            //         },
            //         {
            //             name: "举手",
            //             prop: 12
            //         }
            //     ],
            //     stuFaceList: [
            //         { name: '愤怒', prop: 10 },
            //         { name: '高兴', prop: 10 },
            //         { name: '中性', prop: 5 },
            //         { name: '害怕', prop: 15 },
            //         { name: '厌恶', prop: 21 },
            //         { name: '难过', prop: 9 },
            //         { name: '惊讶', prop: 30 }
            //     ],
            //     confuseProp: '42',
            //     focusProp: '20',
            //     joinProp: '35',
            //     activeProp: '15'
            // }
            // let numArry = []
            // numArry.push(data.confuseProp)
            // numArry.push(data.focusProp)
            // numArry.push(data.joinProp)
            // numArry.push(data.activeProp)
            // numArry.sort((a, b) => {
            //     return b - a
            // })
            // data.max = numArry[0]
            // let arry = []
            // data.stuFaceList.forEach(item => {
            //     arry.push({ name: item.name, value: item.prop })
            // });
            // data.stuFaceList = arry;
            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             stuResponse: data
            //         }
            //     })
            //     dispatch(changeLoading('responseLoading', false))
            // }, 2000)

            // return;
            request('/api/visual/getQuaStuBack', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    let numArry = []
                    numArry.push(data.confuseProp)
                    numArry.push(data.focusProp)
                    numArry.push(data.joinProp)
                    numArry.push(data.activeProp)
                    numArry.sort((a, b) => {
                        return b - a
                    })
                    data.max = numArry[0]
                    let arry = []
                    data.stuFaceList.forEach(item => {
                        arry.push({ name: item.name, value: item.prop })
                    });
                    data.stuFaceList = arry;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            stuResponse: data
                        }
                    })
                    dispatch(changeLoading('responseLoading', false))
                } else {
                    dispatch(changeLoading('responseLoading', false))
                }

            }, (err) => {
                dispatch(changeLoading('responseLoading', false))
            })
        })
    }
}

// 获得AI教学分析数据
export const getQuaAnalyAi = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('analyLoadingAi', true))
            // let data = { //教学分析
            //     behaviorList: [
            //         {
            //             name: "板书",
            //             prop: 33
            //         },
            //         {
            //             name: "多媒体",
            //             prop: 46
            //         },
            //         {
            //             name: "巡视",
            //             prop: 21
            //         }
            //     ],
            //     disList: [
            //         { name: '师生互动', prop: 12 },
            //         { name: '教师讲授', prop: 13 },
            //         { name: '学生自习', prop: 25 },
            //         { name: '学生展示', prop: 40 },
            //         { name: '生生互动', prop: 10 },
            //     ],
            //     testType: '36',
            //     speekType: '20',
            //     mixType: '35',
            //     teachType: '15'
            // }
            // let numArry = []
            // numArry.push(data.testType)
            // numArry.push(data.speekType)
            // numArry.push(data.mixType)
            // numArry.push(data.teachType)
            // numArry.sort((a, b) => {
            //     return b - a
            // })
            // data.max = numArry[0]
            // let arry = []
            // data.disList.forEach(item => {
            //     arry.push({ name: item.name, value: item.prop })
            // });
            // data.disList = arry;
            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             aiTeaDesgin: data
            //         }
            //     })
            //     dispatch(changeLoading('analyLoadingAi', false))
            // }, 2000)

            // return;
            request('/api/visual/getQuaAna', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    let numArry = []
                    numArry.push(data.testType)
                    numArry.push(data.speekType)
                    numArry.push(data.mixType)
                    numArry.push(data.teachType)
                    numArry.sort((a, b) => {
                        return b - a
                    })
                    data.max = numArry[0]
                    let arry = []
                    data.disList.forEach(item => {
                        arry.push({ name: item.name, value: item.prop })
                    });
                    data.disList = arry;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            aiTeaDesgin: data
                        }
                    })
                    dispatch(changeLoading('analyLoadingAi', false))
                }else{
                    dispatch(changeLoading('analyLoadingAi', false))
                }

            },(err)=>{
                dispatch(changeLoading('analyLoadingAi', false))
            })
        })
    }
}

// 获得AI听讲反馈
export const getQuaResponseAi = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(changeLoading('responseLoadingAi', true))
            // let data = { //教学分析
            //     stuBehaviorList: [
            //         {
            //             name: "书写",
            //             prop: 12
            //         },
            //         {
            //             name: "阅读",
            //             prop: 26
            //         },
            //         {
            //             name: "玩手机",
            //             prop: 2
            //         },
            //         {
            //             name: "趴桌子",
            //             prop: 10
            //         },
            //         {
            //             name: "站立",
            //             prop: 10
            //         },
            //         {
            //             name: "听讲",
            //             prop: 16
            //         },
            //         {
            //             name: "举手",
            //             prop: 24
            //         }
            //     ],
            //     stuFaceList: [
            //         { name: '愤怒', prop: 10 },
            //         { name: '高兴', prop: 20 },
            //         { name: '中性', prop: 5 },
            //         { name: '害怕', prop: 5 },
            //         { name: '厌恶', prop: 10 },
            //         { name: '难过', prop: 20 },
            //         { name: '惊讶', prop: 30 }
            //     ],
            //     confuseProp: '22',
            //     focusProp: '20',
            //     joinProp: '35',
            //     activeProp: '15'
            // }
            // let numArry = []
            // numArry.push(data.confuseProp)
            // numArry.push(data.focusProp)
            // numArry.push(data.joinProp)
            // numArry.push(data.activeProp)
            // numArry.sort((a, b) => {
            //     return b - a
            // })
            // data.max = numArry[0]
            // let arry = []
            // data.stuFaceList.forEach(item => {
            //     arry.push({ name: item.name, value: item.prop })
            // });
            // data.stuFaceList = arry;
            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             aiStuResponse: data
            //         }
            //     })
            //     dispatch(changeLoading('responseLoadingAi', false))
            // }, 2000);

            // return;
            request('/api/visual/getQuaBack', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    let numArry = []
                    numArry.push(data.confuseProp)
                    numArry.push(data.focusProp)
                    numArry.push(data.joinProp)
                    numArry.push(data.activeProp)
                    numArry.sort((a, b) => {
                        return b - a
                    })
                    data.max = numArry[0]
                    let arry = []
                    data.stuFaceList.forEach(item => {
                        arry.push({ name: item.name, value: item.prop })
                    });
                    data.stuFaceList = arry;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            aiStuResponse: data
                        }
                    })
                    dispatch(changeLoading('responseLoadingAi', false))
                }else{
                    dispatch(changeLoading('responseLoadingAi', false))
                }

            },(err)=>{
                dispatch(changeLoading('responseLoadingAi', false))
            })
        })
    }
}

// 获得今日概况数据
export const getQuaTotalToday = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // let data = {
            //     stuStand: '40',
            //     teaPatrol: '25',
            // }
            // setTimeout(() => {
            //     dispatch({
            //         type: TJGETDATA,
            //         data: {
            //             stuStandToday: data.stuStand,
            //             teaPatrol: data.teaPatrol,
            //         }
            //     })
            // }, 2000);

            // return;
            request('/api/visual/getQuaTodayMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    dispatch({
                        type: TJGETDATA,
                        data: {
                            stuStandToday: data.stuStand,
                            teaPatrol: data.teaPatrol,
                        }
                    })
                }

            })
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

