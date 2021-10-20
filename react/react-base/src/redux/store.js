/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-19 15:53:17
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-19 16:14:19
 */
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

export const store = compose(applyMiddleware(thunk))(createStore)(rootReducer);
