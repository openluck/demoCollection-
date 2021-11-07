/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: luolei
 * @Last Modified time: 2020-07-27 10:16:32
 * 在线巡课
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';

import Qxsz from './qxsz';
import Ryszhi from './ryszhi';

class Xtszhi extends Component {
  render() {
    return <div style={{height: "100%"}}>
      <Switch>
        {/* 权限设置 */}
        <Route path="/home/xtsz/xtszhi/qxsz" component={Qxsz} />
        {/* 人员设置 */}
        <Route path="/home/xtsz/xtszhi/ryszhi" component={Ryszhi} />
        
        <Redirect to="/home/xtsz/xtszhi/qxsz" />
      </Switch>
    </div>
  }
}

export default Xtszhi;