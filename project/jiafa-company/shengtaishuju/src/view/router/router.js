/*
 * @Author: junjie.lean
 * @Date: 2019-04-15 15:53:28
 * @Last Modified by: lxx
 * @Last Modified time: 2020-07-28 16:25:14
 */

/**
 * @description 路由处理逻辑
 */

import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Loading from "../pages/loading";
import Home from "../pages/home";
import VisualRouter from './visualRouter'
import ErrPage from './../pages/errPage'

export default class RouterRelation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router basename="/">
        <Switch>
          <Route exact path="/" component={Loading} />
          {/* 非可视化路由 */}
          <Route path="/home" component={Home} />
          {/* 可视化中心 */}
          <Route path="/visual" component={VisualRouter} />
          {/* 加载页 */}
          <Route path="/loading/:id" component={Loading} />
          <Route path="/loading" component={Loading} />
          {/* 错误页 */}
          <Route path="/error" component={ErrPage} />

          <Redirect to="/loading" />
        </Switch>
      </Router>
    );
  }
}
