/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-23 15:24:31
 * 听评课V2.2——任务列表路由
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import {TaskList} from './taskList';
import AddTask from './addTask';
// const roleTxt = sessionStorage.getItem("roleTxt");

class TaskRoute extends Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Switch>
          <Route exact path={`/home/tpk/rwgl/rwlb`} component={TaskList} />
          {/* type 0新增、编辑 1查看  taskId任务id */}
          <Route path={`/home/tpk/rwgl/rwlb/cjpkrw/:type/:taskId?`} component={AddTask} />

          <Redirect to={`/home/tpk/rwgl/rwlb`} />
        </Switch>
      </div>
    );
  }
}
export default TaskRoute;
