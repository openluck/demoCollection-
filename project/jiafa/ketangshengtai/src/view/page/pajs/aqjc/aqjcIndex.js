/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: mzc
 * @Last Modified time: 2021-10-19 10:32:08
 * 在线巡课
 */
import React, { Component } from "react";
import { Route, Switch, Redirect, matchPath } from "react-router-dom";

import Zdgjjc from "./zdgjjc";
import Rgaqjc from "./rgaqjcAuth";

class Aqjc extends Component {
  render() {
    return (
      <div style={{ height: "100%" }}>
        <Switch>
          {/* 自动告警检查 */}
          <Route path="/home/pajs/aqjc/zdgjjc" component={Zdgjjc} />
          {/* 人工安全检查 */}
          <Route path="/home/pajs/aqjc/rgaqjc" component={Rgaqjc} />

          <Redirect to="/home/pajs/aqjc/zdgjjc" />
        </Switch>
      </div>
    );
  }
}

export default Aqjc;
