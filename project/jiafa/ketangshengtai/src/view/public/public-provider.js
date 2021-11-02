/*
 * @Author: junjie.lean
 * @Date: 2020-03-17 09:52:08
 * @Last Modified by: xm
 * @Last Modified time: 2020-12-09 16:29:38
 */

import React, { createContext } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import zhCN from "antd/lib/locale-provider/zh_CN";
import RouterRelation from "../router/router-index";
import PerformanceMonitor from "./public-monitor";
import 'react-perfect-scrollbar/dist/css/styles.css';
import Antd from "antd";
import { G } from './../../config/g';

import allReducers from "../../redux/index.reducer";
// import thunk from "redux-thunk";
// import {
//   registerMessageEvent,
//   removeMessageEvent,
// } from "../../util/plugin-cross-platform";

import { setConfig } from "./../../util/request";
import { setConfig_2 } from "./../../util/request_2.12";
import _util from './../../util/_util';
import { request } from './../../util/request';
const { getQueryString } = _util;

const store = createStore(allReducers, applyMiddleware(thunk));

let token = getQueryString('token');
let orgCode = getQueryString('orgCode');
setConfig(G.serverUrl, token || '', orgCode || '');
setConfig_2(G.serverUrl, token || '', orgCode || '');
// console.log(token);
if (token) {
  G.token = token;
  sessionStorage.setItem('token', token);
} else {
  G.token = ""
}


// public/heartbeat;
export const Context = createContext({});

export default function App() {
  useEffect(() => {
    //   //注册postMessage事件监听
    //   let receiveMessageCallBack = (receiveMessageObject) => {
    //     console.log(
    //       `receive a new massage from ${receiveMessageObject.origin}:`,
    //       receiveMessageObject.data
    //     );
    //   };
    //   registerMessageEvent(receiveMessageCallBack);
    //   return () => {
    //     //移除postMessage事件监听
    //     removeMessageEvent();
    //   };
  }, []);

  // const store = {
  //   setValue: (key, value) => {
  //     store[key] = value;
  //   },
  //   deleteKey: (key) => {
  //     delete store[key];
  //   },
  // };

  return (
    <PerformanceMonitor>
      <Antd.ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <RouterRelation />
        </Provider>
      </Antd.ConfigProvider>
    </PerformanceMonitor>
  );
}
