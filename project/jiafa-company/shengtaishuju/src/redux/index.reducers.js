/*
 * @Author: junjie.lean
 * @Date: 2019-04-16 21:01:49
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-23 14:15:18
 */
import { combineReducers } from "redux";
/**
 * @description reducer集合
 */
import { zoe_orderData } from './zoe-dataOrder.reducer'
import { ll_DetailData_reducer } from './ll-detailData.reducer'
import { ll_Header_reducer } from './ll-header.reducer'
import { ll_teaDetail_reducer } from './ll-teaDetail.reducer'
import { ll_sitRateDetail_reducer } from './ll-siteRateDetail.reducer';
import { ll_sleepRateDetail_reducer } from './ll-sleepRateDetail.reducer';
import { ll_breachDetail_reducer } from './ll-breachDetail.reducer';
import { ll_AnalyDetail_reducer } from './ll-analyDetail.reducer'
import { zoe_quaData } from "./zoe-dataQua.reducer";
import { ll_backDetail_reducer } from './ll-backDetail.reducer'
import { kyl_teaImage_reducer } from './kyl-teaImage.reducer';
import { kyl_reply_reducer } from './kyl-reply.reducer';
import { kyl_role_reducer } from './kyl-role.reducer';
import { zoe_recInfo } from './zoe-recInfo.reducer';
import { ws_global_reducer, lxx_lev_reducer } from "./ws-global.reducer";
import { TJ_teaOrderView_reducer } from './tj-teaOrderView.reducer';
import { TJ_teaQuaView_reducer } from './tj-teaQuaView.reducer';
import { ll_allot_reducer } from './ll-allot.reducer';
import { TJ_impHeader_reducer } from './tj-impHeader.reducer';
import { ll_handle_reducer } from './ll-handle.reducer';
import { ll_follow_reducer } from './ll-follow.reducer';
import { ll_followDetails_reducer } from './ll-followDetails.reducer';
import { ll_playPage_reducer } from './ll-playPage.reducer';
import { ll_quacour_reducer } from './ll-quacour.reducer';
import { ll_resInfo_reducer } from './ll-resInfo.reducer';
import { TJ_follow_reducer } from './tj-follow.reducer';
import {TJ_masterReport_reducer} from './tj-masterReport.reducers'
export default combineReducers({
    zoe_orderData,
    ll_DetailData_reducer,
    ll_Header_reducer,
    ll_teaDetail_reducer,
    ll_sitRateDetail_reducer,
    ll_sleepRateDetail_reducer,
    ll_breachDetail_reducer,
    ll_AnalyDetail_reducer,
    zoe_quaData,
    kyl_teaImage_reducer,
    ll_backDetail_reducer,
    zoe_recInfo,
    ws_global_reducer,
    lxx_lev_reducer,
    TJ_teaOrderView_reducer,
    TJ_teaQuaView_reducer,
    ll_allot_reducer,
    TJ_impHeader_reducer,
    ll_handle_reducer,
    ll_follow_reducer,
    ll_followDetails_reducer,
    ll_playPage_reducer,
    ll_quacour_reducer,
    ll_resInfo_reducer,
    kyl_reply_reducer,
    TJ_follow_reducer,
    kyl_role_reducer,
    TJ_masterReport_reducer
});


