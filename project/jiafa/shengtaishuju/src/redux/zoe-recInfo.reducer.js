/*
 * @Author: zoe ღ 
 * @Date: 2020-02-19 15:36:08 
 * @Last Modified by: tj
 * @Last Modified time: 2020-04-16 09:44:53
 * 资源情况 redux
 */
import { request } from "../util/request";
import { message } from "antd";
const initState = {
    ResMes: {
        buildingNum:0,
        buildTeacherNum:0,
        teachTeacherNum:0,
        aveSec:0,
        resData:{
            aiRoom:0,
            rdRoom:0,
            plRoom:0,
            stuAtten:0,
            teaAtten:0,
            brAtten:0,
        }
    },//资源概况值
    ResTodayMes:{
        teachTeacher:0,
        mediaUseProp:0
    },//今日概况数据
    ResTodayOpen:{
        aiRoom:0,
        rdRoom:0,
        plRoom:0
    },//今日教室开课率
    ResTodayEff:{
        aiRoom:0,
        rdRoom:0,
        plRoom:0
    },//今日教室有效利用率
    ResTodayLeisure:{
        aiRoom:0,
        rdRoom:0,
        plRoom:0
    },//闲时利用率
    ResMesLoad:false,//资源概况loading
    ResTodayMesLoad:false,//今日概况loading
    ResTodayOpenLoad:false,//教室开课loading
    ResTodayEffLoad:false,//教室有效利用率loading
    ResTodayLeisureLoad:false,//教室闲时使用率loading
}

export const zoe_recInfo = (state = initState, action) => {
    switch (action.type) {
       case 'ResMes':
            return {
                ...state,
                ResMes: action.data
            }
       case 'ResTodayMes':
            return {
                ...state,
                ResTodayMes: action.data
            }
       case 'ResTodayOpen':
            return {
                ...state,
                ResTodayOpen: action.data
            }
       case 'ResTodayEff':
            return {
                ...state,
                ResTodayEff: action.data
            }
       case 'ResTodayLeisure':
            return {
                ...state,
                ResTodayLeisure: action.data
            }
        // loading
        case 'ResMesLoad':
            return {
                ...state,
                ResMesLoad: action.data
            }
        case 'ResTodayMesLoad':
            return {
                ...state,
                ResTodayMesLoad: action.data
            }
        case 'ResTodayOpenLoad':
            return {
                ...state,
                ResTodayOpenLoad: action.data
            }
        case 'ResTodayEffLoad':
            return {
                ...state,
                ResTodayEffLoad: action.data
            }
        case 'ResTodayLeisureLoad':
            return {
                ...state,
                ResTodayLeisureLoad: action.data
            }
        default:
            return {
                ...state
            }
    }

}
//获取资源概况数据
export const zoe_getResMes = (params) => {
    return dispatch => {
        dispatch(isLoading('ResMesLoad',true));
        let data = {
                buildingNum:1,
                buildTeacherNum:1,
                teachTeacherNum:1,
                aveSec:1,
                resData:{
                    aiRoom:1,
                    rdRoom:1,
                    plRoom:1,
                    stuAtten:1,
                    teaAtten:1,
                    brAtten:1,
                }
        }
        return new Promise((resolve, reject) => {
            request('/api/visual/getResMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    dispatch({
                        type: 'ResMes',
                        data
                    })
                    dispatch(isLoading('ResMesLoad',false));
                }else{
                    dispatch(isLoading('ResMesLoad',false));
                }
            },()=>{
                dispatch(isLoading('ResMesLoad',false));
            })
        })
       
    }
}

//获取今日概况数据
export const zoe_getResTodayMes = (params) => {
    return dispatch => {
        dispatch(isLoading('ResTodayMesLoad',true));
        let data = {
                teachTeacher:1,
                mediaUseProp:1
        }
        return new Promise((resolve, reject) => {
            request('/api/visual/getResTodayMes', params, (res) => {
                if (res.result) {
                    let data = res.data;
                    dispatch({
                        type: 'ResTodayMes',
                        data
                    })
                    dispatch(isLoading('ResTodayMesLoad',false));
                }else{
                    dispatch(isLoading('ResTodayMesLoad',false));
                }
            },()=>{
                dispatch(isLoading('ResTodayMesLoad',false));
            })
        })
       
    }
}

//获取今日教室开课率
export const zoe_getResTodayOpen = (params) => {
    return dispatch => {
        dispatch(isLoading('ResTodayOpenLoad',true));
        let data = {
            aiRoom:60,
            rdRoom:70,
            plRoom:80
        }
        return new Promise((resolve, reject) => {
            request('/api/visual/getResTodayOpen', params, (res) => {
                if (res.result) {
                    let data = res.data.openClassData;
                    dispatch({
                        type: 'ResTodayOpen',
                        data
                    })
                    dispatch(isLoading('ResTodayOpenLoad',false));
                }else{
                    dispatch(isLoading('ResTodayOpenLoad',false));
                }
            },()=>{
                dispatch(isLoading('ResTodayOpenLoad',false));
            })
        })
        
    }
}

//获取今日教室有效利用率
export const zoe_getResTodayEff = (params) => {
    return dispatch => {
        dispatch(isLoading('ResTodayEffLoad',true));
        let data = {
            aiRoom:10,
            rdRoom:50,
            plRoom:80
        }
        return new Promise((resolve, reject) => {
            request('/api/visual/getResTodayEff', params, (res) => {
                if (res.result) {
                    let data = res.data.canUseData;
                    dispatch({
                        type: 'ResTodayEff',
                        data
                    })
                    dispatch(isLoading('ResTodayEffLoad',false));
                }else{
                    dispatch(isLoading('ResTodayEffLoad',false));
                }
            },()=>{
                dispatch(isLoading('ResTodayEffLoad',false));
            })
        })
        
    }
}

//获取闲时利用率
export const zoe_getResTodayLeisure = (params) => {
    return dispatch => {
        dispatch(isLoading('ResTodayLeisureLoad',true));
        let data = {
            aiRoom:20,
            rdRoom:60,
            plRoom:30
        }
        return new Promise((resolve, reject) => {
            request('/api/visual/getResTodayLeisure', params, (res) => {
                if (res.result) {
                    let data = res.data.leisureData;
                    dispatch({
                        type: 'ResTodayLeisure',
                        data
                    })
                    dispatch(isLoading('ResTodayLeisureLoad',false));
                }else{
                    dispatch(isLoading('ResTodayLeisureLoad',false));
                }
            },()=>{
                dispatch(isLoading('ResTodayLeisureLoad',false));
            })
        })
      
    }
}
//是否显示loading
export function isLoading(type,bool) {
    return dispatch => {
      dispatch({
        type: type,
        data: bool
      });
    };
  }





