/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: luolei
 * @Last Modified time: 2020-07-21 17:32:39
 * 在线巡课
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';

import Jgtj from './jgtj';
import Jcmx from './jcmx';

class Xtszhi extends Component {
  render() {
    return <div style={{height: "100%"}}>
      <Switch>
        {/* 结果统计 */}
        <Route path="/home/pajs/jcjg/jgtj" component={Jgtj} />
        {/* 检查明细 */}
        <Route path="/home/pajs/jcjg/jcmx" component={Jcmx} />
        
        <Redirect to="/home/pajs/jcjg/jgtj" />
      </Switch>
    </div>
  }
}

export default Xtszhi;