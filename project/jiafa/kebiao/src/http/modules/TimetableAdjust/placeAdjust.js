/*
 * @Description: 场所调整接口
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-02 15:07:53
 * @LastEditors: cb
 * @LastEditTime: 2021-08-11 10:54:24
 */
import axios from '../../axios'

// 场所调整-获取场所的课程列表
export const getplaceCourseList = (data) => {
    return axios({
        url: "/timetableAdjust/getplaceCourseList",
        method: "post",
        data
    })
}
// 场所调整-获取可调整场所列表
export const getAdjustPlaceList = (data) => {
    return axios({
        url: "/timetableAdjust/getAdjustPlaceList",
        method: "post",
        data
    })
}
// 场所调整-场所调整操作
export const operatePlaceAdjust = (data) => {
    return axios({
        url: "/timetableAdjust/operatePlaceAdjust",
        method: "post",
        data
    })
}