/*
 * @Description: 删除课程接口
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-13 13:17:10
 * @LastEditors: cb
 * @LastEditTime: 2021-08-23 13:58:20
 */

import axios from '../../axios'

// 取消课程-取消课程
export const abolishACourse = (data) => {
    return axios({
        url: "/timetableAdjust/abolishACourse",
        method: "post",
        data
    })
}