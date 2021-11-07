/*
 * @Author: yrj 
 * @Date: 2019-03-01 09:33:47 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-26 13:51:08
 */
import { message } from 'antd';
import {request} from './../../util/request_2.12';
// const ajax = request.request;
let res = {
    attendance: {
        late: 0,
        leaveel: 0,
        Skipping: 0,
        changing: 0,
        attendanceException:0
    },
    order: {
        allclass: 0,
        abnormal: 0,
        violation: 0
    },
    quality: {
        teaching: 0,
        classnum: 0,
        listen: 0
    }


}

export const GETEDUDATA = (params) => {
    return dispatch => {
        let _methodName = 'api/web/TeachingReflection/MyAttendance';
        request(_methodName,
            params,
            (res) => {
                if (res.result && res.code === '200') {
                    let data = res.data
                    let attendance = {
                        late: data.late,
                        leaveel: data.leaveEarly,
                        Skipping: data.absenteeism,
                        changing: data.theClassesInClass,
                        attendanceException: data.attendanceException
                    }

                    dispatch({
                        type: 'GETEDUDATA',
                        attendance
                    })
                } else {
                    message.error(res.message)

                }
            })


    }
}


export let Edutitilereducer = function (state = res, action) {


    switch (action.type) {
        case 'GETEDUDATA':
            return {
                ...state,
                ...action
            }
        case 'CLASSROOMORDER':
            return {
                ...state,
                ...action
            }
        case 'QUALITYOFTEACHING':
            return {
                ...state,
                ...action
            }
        default:
            return {
                ...state
            }
    }

}


export function classroomOrder(params) {
    return dispatch => {
        let _methodName = 'api/web/TeachingReflection/classroomOrder';
        request(_methodName,
            params,
            (res) => {
                if (res.result && res.code === '200') {
                    let data = res.data
                    let order = {
                        allclass: data.classRoomNum,
                        abnormal: data.exceptionNum,
                        violation: data.disciplinaryPenaltyPoints
                    }

                    dispatch({
                        type: 'CLASSROOMORDER',
                        order
                    })
                } else {
                    message.error(res.message)

                }
            })


    }
}

export function qualityOfTeaching(params) {
    return dispatch => {
        let _methodName = 'api/web/TeachingReflection/qualityOfTeaching';
        request(_methodName,
            params,
            (res) => {
                if (res.result && res.code === '200') {
                    let data = res.data
                    let quality = {
                        teaching: data.teachingGrade,
                        classnum: data.teachingClass,
                        listen: data.listenToMyClass
                    }

                    dispatch({
                        type: 'QUALITYOFTEACHING',
                        quality
                    })
                } else {
                    message.error(res.message)

                }
            })


    }
}
