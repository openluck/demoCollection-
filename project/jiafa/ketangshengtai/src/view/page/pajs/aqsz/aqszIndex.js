/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: luolei
 * @Last Modified time: 2020-07-22 13:39:00
 * 在线巡课
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';

import Jkjssz from './jkjssz';
import Jksdsz from './jksdsz';
import Aqsjsz from './aqsjsz';
import Rysz from './rysz';

class Aqsz extends Component {
  render() {
    return <div style={{ height: "100%" }}>
      <Switch>
        {/* 监控教室设置 */}
        <Route path="/home/pajs/aqsz/jkjssz" component={Jkjssz} />
        {/* 监控时段设置 */}
        <Route path="/home/pajs/aqsz/jksdsz" component={Jksdsz} />
        {/* 安全事件设置 */}
        <Route path="/home/pajs/aqsz/aqsjsz" component={Aqsjsz} />
        {/* 人员设置 */}
        <Route path="/home/pajs/aqsz/rysz" component={Rysz} />

        <Redirect to="/home/pajs/aqsz/jkjssz" />
      </Switch>
    </div>
  }
}

export default Aqsz;