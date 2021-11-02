/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-28 16:43:13
 * 听评课V2.2——任务进度
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import TaskOverView from './taskOverview';
import TaskResult from './taskResult';
import  OverviewDetail  from './overviewDetail';
import OverviewPerDetail from './overviewPerDetail';
import ResultDetail from './resultDetail';
import ResultPerDetail from './resultPerDetail';
// const roleTxt = sessionStorage.getItem("roleTxt");

export default class TaskFlow extends Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Switch>
          {/* 任务概览 */}
          <Route exact path={`/home/tpk/rwgz/rwgzgl`} component={TaskOverView} />
          {/* taskId任务id semester学期id */}
          <Route path={`/home/tpk/rwgz/rwgzgl/rwjdxq/:taskId/:semester`} component={OverviewDetail} />
          {/* perId人员id   jobId任务id */}
          <Route path={`/home/tpk/rwgz/rwgzgl/rwjdgrxq/:perId/:jobId`} component={OverviewPerDetail} />

          {/* 任务结果 */}
          <Route exact path={`/home/tpk/rwgz/rwjg`} component={TaskResult} />
          {/* taskId任务id semester学期id */}
          <Route path={`/home/tpk/rwgz/rwjg/rwjgxq/:taskId/:semester`} component={ResultDetail} />
          {/* perId人员id   jobId任务id */}
          <Route path={`/home/tpk/rwgz/rwjg/rwjggrxq/:perId/:jobId`} component={ResultPerDetail} />

          <Redirect to={`/home/tpk/rwgz/rwgzgl`} />
        </Switch>
      </div>
    );
  }
}
