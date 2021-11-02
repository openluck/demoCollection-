/* 
 * 三方应用消息
 */
import axios from '../../axios'

// 获取三方应用消息列表
export const getApplyMessageList = (data) => {
    return axios({
        url: '/applyMessage/list',
        method: 'post',
        data
    })
}

// 三方应用消息 删除（单个，批量）
export const deleteApplyMessage = (data) => {
    return axios({
        url: '/applyMessage/delete',
        method: 'post',
        data
    })
}
