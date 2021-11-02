/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: luolei
 * @Last Modified time: 2020-07-27 10:16:32
 * 系统设置 - 功能设置
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';

import Gnsz from './gnsz';

class Xtszhi extends Component {
  render() {
    return <div style={{ height: "100%" }}>
      <Switch>
        {/* 功能设置 */}
        <Route path="/home/xtsz/gnszhi/gnsz" component={Gnsz} />

        <Redirect to="/home/xtsz/gnszhi/gnsz" />
      </Switch>
    </div>
  }
}

export default Xtszhi;