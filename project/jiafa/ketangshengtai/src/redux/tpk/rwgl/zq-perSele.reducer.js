/*
 * @Author: zq 
 * @Date: 2020-02-18 17:45:26 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-23 15:16:21
 * 听评课2.2-创建评课任务-选择人员
 */
import _ from 'lodash';
import { message } from 'antd';
import {request} from '../../../util/request';
const ZQ_CHANGEDATA = 'ZQ_CHANGEDATA';
const ZQ_GETDATA = 'ZQ_GETDATA';
const ZQ_INIT = 'ZQ_INIT';

const  requestForListen  = request;

const init = {
  treeData: [],       //职务树
  curPostList: [],    //所选职务集合
  postKey: '',       //搜索职务关键字
  personData: [],     //人员名单集合
  personData_handle: [],     //人员名单集合二维数组
  curPerList: [],     //所选人员集合
  curPerList_handle: [],     //所选人员集合二维数组
  perKey: '',       //搜索人员关键字
  index: '',       //搜索人员索引
  taskId: '',         // 任务Id

  propPer: [],
}

export function personSele(state = init, action) {
  switch (action.type) {
    case ZQ_CHANGEDATA:
      return { ...state, ...action.data };
    case ZQ_GETDATA:
      return { ...state, ...action.data };
    case ZQ_INIT:
      return state = init;
    default:
      return state;
  }
}

/**
 * @desc 接收列表页人员数据
 * @param {*} data 
 */
export function propPerSet(data) {
  return dispatch => {
    // console.log(data);
    dispatch({
      type: ZQ_CHANGEDATA,
      data: {
        propPer: data,
        curPerList: data
      }
    })
  }
}

/**
 * 获取职务树
 * list 列表页已选择人员
 */
export function getPostData(list) {
  return (dispatch, getState) => {
    const { postKey } = getState().personSele;
    let result = [];
    requestForListen('taskList/getPostTree', { searchKey: postKey }, res => {
      if (res.result) {
        result = res.data;
      }
      dispatch({
        type: ZQ_GETDATA,
        data: { treeData: result }
      })
    })
  }
}
/**
 * 获取人员列表数据
 */
export function getPersonData(obj) {
  return (dispatch, getState) => {
    const { curPostList, perKey, index, curPerList, propPer } = getState().personSele
    let _curPostList = obj.curPostList || curPostList;
    let _perKey = obj.perKey || perKey;
    let _index = _perKey ? '' : (obj.index === undefined ? index : obj.index);
    dispatch({
      type: ZQ_CHANGEDATA,
      data: {
        curPostList: _curPostList,
        perKey: _perKey,
        index: _index,
      }
    })
    let param = {
      postList: _curPostList,
      searchKey: _perKey,
      index: _index,
    }
    let result = [];
    if (obj.curPostList && obj.curPostList.length) {
      requestForListen('taskList/getPerson', param, res => {
        if (res.result) {
          result = res.data;
        }
        let curList = _.cloneDeep(curPerList);
        let perList = _.cloneDeep(propPer);
        perList.map(item => {
          let index = _.findIndex(curList, { personId: item.personId });
          if (index === -1) {
            let oi = _.find(result, { personId: item.personId });
            if (oi) {
              curList.push(oi);
            }
          }
        })
        // console.log(perList, result, curList);

        let propData = handleTwoDimension(result, 468, 116);
        dispatch({
          type: ZQ_GETDATA,
          data: {
            personData: result,
            personData_handle: propData,
            curPerList: curList
          }
        })
      })
    } else {
      dispatch({
        type: ZQ_GETDATA,
        data: {
          personData: result,
          personData_handle: [],
          // curPerList: []
        }
      })
    }
  }
}
/**
 * List 处理成二维数组
 * @param {*} 
 */
function handleTwoDimension(arry, width, one_width) {
  const len = arry.length;
  let rowNum = parseInt(width / one_width),
    num = Math.ceil(len / rowNum),
    remain = len % rowNum,
    propData = [];
  for (let i = 0; i < num; i++) {
    let index = i + 1;
    if (remain && index === num) {     //最后一个数组
      propData[i] = arry.slice(i * rowNum, (i * rowNum + remain));
    } else {
      let start = rowNum * i;
      let end = index * rowNum;
      propData[i] = arry.slice(start, end);
    }
  }

  return propData;
}
/**
 * 选择人员
 * @param {*} personObj
 */
export function handleSelectPerson(personObj) {
  return (dispatch, getState) => {
    const { curPerList } = getState().personSele;
    let data = _.cloneDeep(curPerList);
    let index = _.findIndex(curPerList, { personId: personObj.personId });
    if (index !== -1) {
      data.splice(index, 1);
    } else {
      data.push(personObj);
    }
    dispatch({
      type: ZQ_CHANGEDATA,
      data: {
        curPerList: data,
      }
    })
  }
}
/**
 * 修改state
 * @param {*} params 
 */
export function changeData(params) {
  return (dispatch, getState) => {
    dispatch({
      type: ZQ_CHANGEDATA,
      data: params
    })
  }
}
/**
 * 初始化
 * @param {*} params 
 */
export function handleInit() {
  return (dispatch, getState) => {
    dispatch({
      type: ZQ_INIT
    })
  }
}