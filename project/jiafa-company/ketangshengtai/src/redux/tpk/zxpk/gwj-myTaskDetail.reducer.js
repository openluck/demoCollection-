import { requestForListen} from './../../../util/request';
import { message } from "antd";

const SEMESTEREVATASK = 'SEMESTEREVATASK';
const TASKNAME = 'TASKNAME';
const PAGEDATA = 'PAGEDATA';

const init = {
    semesterEvaTask:{},
    taskName:'',
    pageData:{}
}

export function myTaskDetailReducer(state = init,action){
    switch(action.type){
        case TASKNAME:
            return {
                ...state,
                ...action
            }
        case SEMESTEREVATASK:
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
 * 获取任务名称
 */
export function getTaskName(name){
    return dispatch => {
        dispatch({
            type:TASKNAME,
            taskName:name
        })
    }
}
/**
 * 学期评课任务
 */
export function getSemesterEvaTask(params){
    return dispatch => {
        requestForListen('get/semesterEvaTask',params,(res) => {
            console.log(res);
            let semesterEvaTask = {};
            if(res.result){
                if(res.data!==null){
                    semesterEvaTask = {...res.data}
                }
            }else{
                message.info(res.message);
            }
            dispatch({
                type:SEMESTEREVATASK,
                semesterEvaTask
            })
        })
    }
}
/**
 * 任务列表
 */
export function getEvaTaskTable(params) {
    return dispatch => {
        requestForListen('get/evaTaskTable',params,(res) => {
            console.log(res);
            let pageData = {};
            if(res.result){
                if(res.data!==null){
                    pageData = {
                        pageList:[...res.data],
                        total:res.total
                    }
                }else{
                    message.info(res.message);
                }
            }
            dispatch({
                type:PAGEDATA,
                pageData
            })
        })
    }
}