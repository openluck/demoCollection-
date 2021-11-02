/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-31 10:04:52
 * 听评课V2.2——在线评课
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import MyTask from './myTask';
import EvaluHistory from './evaluHistory';
import MyTaskDetail from './myTaskDetail';
import SeleCourse from './seleCourse';
import HistoryDetail from './historyDetail';
// const roleTxt = sessionStorage.getItem("roleTxt");

export default class EvaluOnline extends Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Switch>
          {/* 我的任务 */}
          <Route exact path={`/home/tpk/zxpk/wdrw`} component={MyTask} />
          <Route path={`/home/tpk/zxpk/wdrw/grrwxq/:taskId/:perId`} component={MyTaskDetail} />
          <Route path={`/home/tpk/zxpk/wdrw/xzkc/:taskId/:perId`} component={SeleCourse} />

          {/* 历史评课 */}
          <Route exact path={`/home/tpk/zxpk/lspk`} component={EvaluHistory} />
          <Route path={`/home/tpk/zxpk/lspk/lspkxq/:taskId/:perId/:semester`} component={HistoryDetail} />

          <Redirect to={`/home/tpk/zxpk/wdrw`} />
        </Switch>
      </div>
    );
  }
}
