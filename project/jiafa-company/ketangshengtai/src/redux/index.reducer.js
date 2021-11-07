/*
 * @Author: junjie.lean
 * @Date: 2020-03-13 15:31:34
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-26 14:10:23
 */
import { combineReducers } from "redux";
import { addTask } from './tpk/rwgl/mj-addTsak.reducer';
import { personSele } from './tpk/rwgl/zq-perSele.reducer';
import { fyl_resultReducer } from './tpk/rwgz/fyl-resukltPerDetail.reducer';
import { taskDetailsReducer } from './tpk/rwgz/gwj-taskDetails.reducer';
import { taskResultReducer } from './tpk/rwgz/gwj-taskResult.reducer';
import { yh_taskOverviewReducer } from './tpk/rwgz/yh-taskOveriew.reducer';
import { fyl_historyData } from './tpk/zxpk/evaluHistory.reducer';
import { myTaskReducer } from './tpk/zxpk/gwj-myTask.reducer';
import { myTaskDetailReducer } from './tpk/zxpk/gwj-myTaskDetail.reducer';
import { seleCourseReducer } from './tpk/zxpk/gwj-seleCourse.reducer';
import { fyl_historyDetailsData } from './tpk/zxpk/history.reducer';
import { Edutitilereducer } from './jxfs/Edutitilereducer'
import { getJxfsData } from './jxfs/jxfs.reducer'
import { home } from './mj-Home';

export default combineReducers({
  addTask,
  personSele,
  fyl_resultReducer,
  taskDetailsReducer,
  taskResultReducer,
  yh_taskOverviewReducer,
  fyl_historyData,
  myTaskReducer,
  myTaskDetailReducer,
  seleCourseReducer,
  fyl_historyDetailsData,
  Edutitilereducer,
  getJxfsData,
  home
});
