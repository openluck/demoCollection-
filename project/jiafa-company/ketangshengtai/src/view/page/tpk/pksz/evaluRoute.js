/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-24 10:22:15
 * 听评课V2.2——任务列表路由
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { EvaluSetting } from './evaluSetting';
import AddForm from './addForm';
import Zwgl from './jobManage';
// const roleTxt = sessionStorage.getItem("roleTxt");

export default class EvaluRoute extends Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Switch>
          <Route exact path={`/home/tpk/pksz/pybgl`} component={EvaluSetting} />
          <Route path={`/home/tpk/pksz/pybgl/xzbd/:formEditType/:formId?`} component={AddForm} />

          <Route path={`/home/tpk/pksz/zwgl`} component={Zwgl} />

          <Redirect to={`/home/tpk/pksz/pybgl`} />
        </Switch>
      </div>
    );
  }
}
