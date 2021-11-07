import { requestForListen} from './../../../util/request';
import { message } from "antd";

const EVATASK = 'EVATASK';
const PAGEDATA = 'PAGEDATA';

const init = {
    evaTask:{},
    pageData:{}
}

export function myTaskReducer(state = init,action){
    switch(action.type){
        case EVATASK:
            return {
                ...state,
                ...action
            }
        case PAGEDATA:
            return {
                ...state,
                ...action
            }
        default:
            return state;
    }
}

/**
 * 评课任务
 */
export function getEvaTask (params){
    return dispatch => {
        requestForListen('get/evaTask',params,(res) => {
            console.log(res);
            let evaTask = {};
            if(res.result){
                if(res.data!==null){
                    evaTask = { ...res.data }
                }
            }else{
                message.info(res.message);
            }
            dispatch({
                type:EVATASK,
                evaTask
            })
        })
    }
}
/**
 * 任务列表查询
 */
export function getTaskTable (params) {
    return dispatch => {
        requestForListen('get/taskTable',params,(res) => {
            console.log(res);
            let pageData = {};
            if(res.result){
                if(res.data!==null){
                    pageData = {
                        pageList:[...res.data],
                        total:res.total
                    }
                }
            }else{
                message.info(res.message);
            }
            dispatch({
                type:PAGEDATA,
                pageData
            })
        })
    }
}