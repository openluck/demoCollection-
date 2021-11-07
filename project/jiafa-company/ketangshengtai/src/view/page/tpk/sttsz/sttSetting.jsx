/*
 * @Author: JC.Liu 
 * @Date: 2019-02-23 22:34:10 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-21 15:03:57
 * 听评课 - 随堂听设置
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';
import TargetSetting from './targetSetting.jsx';
import PowerSetting from './powerSetting.jsx';
import TpkManaNewTask from './tpkManaNewTask.jsx';
export class SttSetting extends Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        <Switch>
          {/* 听课员任务指标设置 */} 
          <Route exact path="/home/tpk/sttsz/tkyrwzbsz" component={TargetSetting} />
          <Route exact path="/home/tpk/sttsz/tkyrwzbsz/TpkManaNewTask" component={TpkManaNewTask} /> 
          {/* 授课员审批权限设置 */}
          <Route path="/home/tpk/sttsz/skyspqxsz" component={PowerSetting} />
          <Redirect to="/home/tpk/sttsz/tkyrwzbsz" />
        </Switch>
      </div>
    )
  }
}
