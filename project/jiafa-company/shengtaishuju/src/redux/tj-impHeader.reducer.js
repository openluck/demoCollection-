/*
 * @Author: tj 
 * @Date: 2020-07-24 10:00:00
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-28 16:09:05
 */
import G from './../config/g';
import moment from "moment";

const initState = {
    semesterId:'',
    timeType: '1',
    curTime: '',
    selTime: '',
    selDate: '',//当前选中的日
    selWeek: '', //当前选中的周次
    selMonth: '', //当前选中的月份数据
    isHistoryTime:false

}
const TJGETDATA = 'TJGETDATA';

export const TJ_impHeader_reducer = (state = initState, action) => {
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

// 保存筛选头部时间
export const saveImpTime = (params) => {
    return dispatch => {
        let { semesterId, timeType, selTime, selDate, selWeek, selMonth, curTime } = params;
        // console.log('redux我保存了时间哦！', params)
        dispatch({
            type: TJGETDATA,
            data: {
                semesterId, timeType, selTime, selDate, selWeek, selMonth, curTime
            }
        })
    }
}

// 清空筛选头部时间
export const clearImpTime = () => {
    return dispatch => {
        console.log('redux我清除时间啦！')
        dispatch({
            type: TJGETDATA,
            data: {
                semesterId: G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.semesterId || '',
                timeType: '1',
                selTime:
                    G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.isCutSemester === "1"
                        ? moment(new Date()).format("YYYY-MM-DD")
                        : G.ISCED_cutSemesterData.startTime || '', //选择的时间参数入参
                selDate: '',
                selWeek: '',
                selMonth: '',
                curTime: G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.isCutSemester === "1"
                    ? moment(new Date()).format("YYYY.MM.DD")
                    : G.ISCED_cutSemesterData.startTime || ''
            }
        })
    }
}


//回显原来的筛选条件
export const isHistoryTime = (value) => {
    return dispatch => {
        // let { semesterId, timeType, selTime, selDate, selWeek, selMonth, curTime } = params;
        // console.log('redux我保存了时间哦！', params)
        console.log(value,888)
        dispatch({
            type: TJGETDATA,
            data: {
                isHistoryTime:value
            }
        })
    }
}