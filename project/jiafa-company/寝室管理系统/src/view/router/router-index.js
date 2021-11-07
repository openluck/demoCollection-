/*
 * @Author: junjie.lean
 * @Date: 2021-01-18 10:22:54
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-26 12:43:42
 */

import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Loading from "../page/layout-loading";
import Home from "../page/layout-home";
import ErrPage from "./../page/layout-err";

/**
 * @description RouterRelation 包含"loading/error/home"三个一级路由,默认重定向到loading路由
 * @constructor router-RouterRelation
 * @exports constructor:RouterRelation
 */
export default function RouterRelation() {
  let baseHash = "";
  return (
    <Router basename="/">
      <Switch>
        <Route exact path={baseHash + "/"} component={Loading} />
        <Route path={baseHash + "/loading"} component={Loading} />
        <Route path={baseHash + "/error"} component={ErrPage} />
        <Route path={baseHash + "/home"} component={Home} />
        <Redirect to={baseHash + "/loading"} />
      </Switch>
    </Router>
  );
}
