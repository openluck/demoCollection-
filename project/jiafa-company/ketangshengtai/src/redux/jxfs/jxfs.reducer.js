
import { message } from 'antd';
import { request } from './../../util/request_2.12';
import _util from './../../util/_util';
// import util from './../js/_x/index';
// const number = util.util.number
// const Request = util.util.request.request;
const { toChinese } = _util

const TEACHINGORDER = 'TEACHINGORDER';
const TEACHINGQUALITY = 'TEACHINGQUALITY';
const TIMETABLE = 'TIMETABLE';
const CURSEMESTERANDWEEKS = 'CURSEMESTERANDWEEKS';
const JXFSLOADING = 'JXFSLOADING';
const init = {
  teachingOrderData: {
    className: [],
    totalScoreClass: []
  },
  teachingQualityData: { teachData: [], stuData: [], stuTotalScore: 0, teachTotalScore: 0, eventNum: 0 },
  timeTableData: [],
  semesterAndWeeks: { semester: {} },
  isLoading: false
};

export function getJxfsData(state = init, action) {
  switch (action.type) {
    case TEACHINGORDER:
      return { ...state, ...action };
    case TEACHINGQUALITY:
      return { ...state, ...action };
    case TIMETABLE:
      return { ...state, ...action };
    case CURSEMESTERANDWEEKS:
      return { ...state, ...action };
    case JXFSLOADING:
      return { ...state, ...action };
    default:
      return state;
  }
}

export function teachingOrder(params) {
  return dispatch => {
    this.jxfsLoading(true)
    request('api/web/TeachingReflection/eventView', params, (res) => {
      this.jxfsLoading(false)
      dispatch({
        type: TEACHINGORDER,
        teachingOrderData: init.teachingOrderData
      })
      if (res.result && res.code === '200') {
        let event = { teachData: [], stuData: [], stuTotalScore: res.data.stuTotalScore, teachTotalScore: res.data.teachTotalScore, eventNum: res.data.eventNum };
        if (res.data.classList[0]) {
          res.data.classList[0].eventTypeList.map((item) => {
            if (item.roleEventType === 2) {
              event.teachData.push({
                name: item.eventName,
                value: item.score,
              })
            } else {
              event.stuData.push({
                name: item.eventName,
                value: item.score,
              })
            }
          })
        }
        dispatch({
          type: TEACHINGORDER,
          teachingOrderData: event
        })
      } else {
        message.error(res.message)
      }
    })
  }
}

export function teachingQuality(params) {
  return dispatch => {
    this.jxfsLoading(true)
    request('api/web/TeachingReflection/teachQuality', params, (res) => {
      this.jxfsLoading(false)
      dispatch({
        type: TEACHINGQUALITY,
        teachingQualityData: init.teachingQualityData
      })
      if (res.result && res.code === '200') {
        res.data.className = []
        res.data.totalScoreClass = []
        res.data.classList.map((item) => {
          res.data.className.push(item.className)
          res.data.totalScoreClass.push(item.totalScoreClass)
        })
        dispatch({
          type: TEACHINGQUALITY,
          teachingQualityData: res.data
        })
      } else {
        message.error(res.message)
      }
    })
  }
}

export function timeTable(params) {
  return dispatch => {
    this.jxfsLoading(true)
    dispatch({
      type: TIMETABLE,
      timeTableData: init.timeTableData
    })
    request('api/web/TeachingReflection/teachClassByWeeks', params, (res) => {
      this.jxfsLoading(false)
      if (res.result && res.code === '200') {
        let timeTableData = []
        let maxlessonordernum = 0;   //最大节次
        for (let i = 1; i <= res.total; i++) {
          let param = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] }
          res.data.map((item) => {
            if (item.job.curriculumallId.lessonordernum === i) {
              maxlessonordernum = i
              switch (item.job.curriculumallId.weekday) {
                case 1:
                  return param.Monday.push(item);
                case 2:
                  return param.Tuesday.push(item);
                case 3:
                  return param.Wednesday.push(item);
                case 4:
                  return param.Thursday.push(item);
                case 5:
                  return param.Friday.push(item);
                case 6:
                  return param.Saturday.push(item);
                default:
                  return param.Sunday.push(item);
              }
            }
          })
          param.key = i;
          if (i === 10) {
            param.section = '第十节'
          } else if (i > 10 && i < 20) {
            param.section = '第十' + toChinese(i - 10) + '节'
          } else {
            param.section = '第' + toChinese(i) + '节'
          }
          timeTableData.push(param)
        }
        timeTableData = timeTableData.slice(0, maxlessonordernum)
        dispatch({
          type: TIMETABLE,
          timeTableData
        })
      } else {
        message.error(res.message)
      }
    })
  }
}

/**
 * @description 获取当前周及日期
 */
export function curSemesterAndWeeks() {
  return dispatch => {
    return new Promise((resolve) => {
      this.jxfsLoading(true)
      dispatch({
        type: CURSEMESTERANDWEEKS,
        semesterAndWeeks: init.semesterAndWeeks
      })
      request('api/web/semester/curSemesterAndWeeks', {}, (res) => {
        resolve(res)
        this.jxfsLoading(false)
        if (res) {
          dispatch({
            type: CURSEMESTERANDWEEKS,
            semesterAndWeeks: res
          })
        } else {
          message.error('请求失败')
        }
      })
    })
  }
}

/**
 * @description loading
 * @param {boolean} param 
 */
export function jxfsLoading(param) {
  return dispatch => {
    dispatch({
      type: JXFSLOADING,
      isLoading: param
    })
  }
}