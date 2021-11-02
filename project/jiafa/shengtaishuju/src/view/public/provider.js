/*
 * @Author: junjie.lean
 * @Date: 2019-04-15 16:06:25
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-19 09:45:35
 */

/**
 * @description Provider
 */

import React from "react";
import { ConfigProvider, message } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import RouterRelation from "../router/router";
import './../../style/base.scss'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { createStore, applyMiddleware,compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import allReducers from "../../redux/index.reducers";
import { setConfig } from "./../../util/request";
import _util from "./../../util/_util";

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import persistConfig from "../../config/persistConfig";
import G from './../../config/g'
const getQueryString = _util.getQueryString;
let token = getQueryString('token') || '';
let orgcode = getQueryString('orgcode') || '';

const myPersistReducer = persistReducer(persistConfig, allReducers);


let store;

if (G.ISCED_token) {
  token = G.ISCED_token;
  orgcode = G.ISCED_orgcode;
}


{
  /**
   * @description 数据服务初始化
   */
  setConfig(G.dataService, token, orgcode);
  // setConfig("http://localhost:9000", "token", "orgcode");
  // setWSConfig("ws://10.10.1.30:3000", "token", "orgcode");
}

{
  /**
   * @description reducers合并，并创建store和router:
   */
  store = createStore(myPersistReducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f)
    );
}

const persistor = persistStore(store);

{
  /**
   * @description antd 初始化设置
   */
  message.config({
    top: 100,
    duration: 2,
    maxCount: 1
  });
  //other Config.....
}

{
  /**
   * @description  生产环境反调试
   */
  if (process.env.NODE_ENV !== "development") {
    if (window.console) {
      for (let item in window.console) {
        window["console"][item] = () => {
          return;
        };
      }
    }
  }
}

export default class APP extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterRelation />
          </PersistGate>
        </Provider>
      </ConfigProvider>
    );
  }
}
