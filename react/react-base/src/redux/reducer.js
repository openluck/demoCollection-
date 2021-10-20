/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-19 15:53:11
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-19 16:14:02
 */
import { combineReducers } from 'redux';
import date from '../containers/DateRedux';
import history from '../containers/HistoryRedux';

export default combineReducers({
  date,
  history
});
