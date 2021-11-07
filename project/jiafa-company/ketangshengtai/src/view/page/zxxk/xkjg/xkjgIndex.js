/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-21 15:35:32
 * 在线巡课
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';

import Ktcx from './ktcx';
import Rycx from './rycx';
import Ktcxxq from './ktcxxq';
import Rycxxq from './rycxxq';

class Xkjg extends Component {
  render() {
    return <div style={{height: '100%'}}>
      <Switch>
        {/* 课堂查询 */}
        <Route path="/home/zxxk/xkjg/ktcx" component={Ktcx} />
        {/* 课堂查询详情 id课程id */}
        <Route path="/home/zxxk/xkjg/ktcxxq/:id" component={Ktcxxq} />

        {/* 人员查询 */}
        <Route path="/home/zxxk/xkjg/rycx" component={Rycx} />
        {/* 人员查询详情 id人员id semester学期 startTime开始时间 endTime结束时间 perName人员名称 */}
        <Route path="/home/zxxk/xkjg/rycxxq/:id/:semester/:startTime/:endTime/:perName" component={Rycxxq} />

        <Redirect to="/home/zxxk/xkjg/ktcx" />
      </Switch>
    </div>
  }
}

export default Xkjg;