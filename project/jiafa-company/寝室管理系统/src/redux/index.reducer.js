/*
 * @Author: junjie.lean
 * @Date: 2020-11-16 10:40:07
 * @Last Modified by: xq
 * @Last Modified time: 2021-01-21 10:06:01
 */

import { combineReducers } from "redux";

//example:
import { 
    initQueryString_reducer,
    userInfo_reducer,
    buildTree_reducer,
    classesTree_reducer
 } from "./reducers/public.reducer";

 import {
    ruleManageTree_reducer
 } from './reducers/ruleManage.reducer.js'
 import {
     detailData_reducer
 } from "./reducers/inRoomManage.reducer"

export default combineReducers({ 
    initQueryString_reducer,
    userInfo_reducer,
    buildTree_reducer,
    classesTree_reducer,
    detailData_reducer,
    ruleManageTree_reducer
 });
