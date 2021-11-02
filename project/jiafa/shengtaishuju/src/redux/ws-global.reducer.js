/*
 * @Author: wangsong 
 * @Date: 2020-02-20 14:24:00 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-18 15:24:55
 */
import { request } from "../util/request";
import { message } from "antd";
import G from "../config/g";
import { REHYDRATE } from 'redux-persist';
const initState = {
    ISCED_semesterList: [],//学期列表
    ISCED_cutSemesterData: {},//当前学期数据
    ISCED_courseTypeList: [],//课程类型列表
    ISCED_roleData: {},//鉴权数据
    ISCED_curRoleInfo: {},//当前菜单
    ISCED_courseList: [],//课程列表
    ISCED_teacherList: [],//教师列表
    ISCED_collegeList: [],//学院列表
    ISCED_codeList: [],//基础码表
    ISCED_setInfo: {},//设置信息
    ISCED_orgcode: '', // orgcode
    ISCED_token: '', // token
    ISCED_tabArray: [], //报表统计面包屑
    ISCED_content: [], //明细查询路由信息
    ISCED_followName: '',
    ISCED_orgName: '',//报表机构名称
    ISCED_detailCondition: {}, //明细结果的条件
    ISCED_headerParams: {}, //改进头部条件
    ISCED_sysName: '', // 标题
    ISCED_sysNameConfig: {} //标题配置
}
const levInfo = {
    ISCED_saveInfo: '1'
}
export const ws_global_reducer = (state = initState, action) => {
    switch (action.type) {
        case 'ISCED_semesterList':
            return {
                ...state,
                ISCED_semesterList: action.data
            }
        case "ISCED_cutSemesterData":
            return {
                ...state,
                ISCED_cutSemesterData: action.data
            }
        case 'ISCED_courseTypeList':
            return {
                ...state,
                ISCED_courseTypeList: action.data
            }
        case 'ISCED_roleData':
            return {
                ...state,
                ISCED_roleData: action.data
            }
        case 'ISCED_curRoleInfo':
            return {
                ...state,
                ISCED_curRoleInfo: action.data
            }
        case 'ISCED_courseList':
            return {
                ...state,
                ISCED_courseList: action.data
            }
        case 'ISCED_teacherList':
            return {
                ...state,
                ISCED_teacherList: action.data
            }
        case 'ISCED_collegeList':
            return {
                ...state,
                ISCED_collegeList: action.data
            }
        case 'ISCED_codeList':
            return {
                ...state,
                ISCED_codeList: action.data
            }
        case "ISCED_setInfo":
            return {
                ...state,
                ISCED_setInfo: action.data
            }
        case 'ISCED_token':
            return {
                ...state,
                ISCED_token: action.data
            }
        case 'ISCED_orgcode':
            return {
                ...state,
                ISCED_orgcode: action.data
            }
        case 'LXX_SAVEINFO':
            return {
                ...state,
                ISCED_saveInfo: action.data
            }
        case 'ISCED_content':
            return {
                ...state,
                ISCED_content: action.data
            }

        case 'ISCED_followName':
            return {
                ...state,
                ISCED_followName: action.data
            }

        case 'ISCED_tabArray':
            return {
                ...state,
                ISCED_tabArray: action.data
            }
        case 'ISCED_orgName':
            return {
                ...state,
                ISCED_orgName: action.data
            }
        case 'ISCED_detailCondition':
            return {
                ...state,
                ISCED_detailCondition: action.data
            }
        case 'ISCED_headerParams':
            return {
                ...state,
                ISCED_headerParams: action.data
            }
        case 'ISCED_sysName':
            return {
                ...state,
                ISCED_sysName: action.data
            }
        case 'ISCED_sysNameConfig':
            return {
                ...state,
                ISCED_sysNameConfig: action.data
            }

        case REHYDRATE:
            if (action.payload) {
                if (action.payload.ws_global_reducer) {
                    Object.keys(action.payload.ws_global_reducer).forEach((item, index) => {
                        try {
                            G[item] = action.payload.ws_global_reducer[item];
                            if(item === 'ISCED_sysName') {
                                document.querySelector("head>title").innerHTML = action.payload.ws_global_reducer[item];
                            }
                        }
                        catch (e) {
                            G[item] = action.payload.ws_global_reducer[item];
                        }

                    })
                    return {
                        ...state,
                        ...action.payload.ws_global_reducer
                    }
                }
            }
        default:
            return {
                ...state
            }
    }

}

/**
 * 保存全局数据
 * @param {Array} data 
 * @param {string} type 
 */
export const ws_saveGlobalData = (data, type) => {
    G[type] = data;
    return dispatch => {
        dispatch({
            type,
            data
        })
    }
}


export const lxx_lev_reducer = (state = levInfo, action) => {
    switch (action.type) {
        case 'LXX_SAVEINFO':
            return {
                ...state,
                ISCED_saveInfo: action.data
            }
        default:
            return {
                ...state
            }
    }

}

/**
 * 保存报表及明细层级数据
 * @param {string} val 
 */
export const lxx_saveInfo = (val) => {
    return dispatch => {
        dispatch({
            type: 'LXX_SAVEINFO',
            data: val
        })
    }
}

