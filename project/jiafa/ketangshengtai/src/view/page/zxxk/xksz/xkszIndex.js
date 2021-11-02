/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-22 13:33:44
 * 在线巡课
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';

import Ryap from './ryap';
import Sjsz from './sjsz';

class Xksz extends Component {
  render() {
    return <Switch>
        {/* 人员安排 */}
        <Route path="/home/zxxk/xksz/ryap" component={Ryap} />
        {/* 事件设置 */}
        <Route path="/home/zxxk/xksz/sjsz" component={Sjsz} />
        
        <Redirect to="/home/zxxk/xksz/ryap" />
      </Switch>
  }
}

export default Xksz;