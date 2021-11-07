/*
 * @Author: JC.Liu 
 * @Date: 2019-02-23 22:34:10 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-20 16:09:54
 * 听评课 - 教研设置
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';
import PlanCtro from './planCtro.jsx';
import GroupCtro from './groupCtro.jsx';
import EvaluateCtro from './evaluateCtro.jsx';
import TpkAddResearchPlan from './tpkAddResearchPlan.jsx';
export class TpkTeaSetting extends Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        <Switch>
          {/* 教研计划管理 */}
          <Route exact path="/home/tpk/jysz/jyjhgl" component={PlanCtro} />
          <Route path="/home/tpk/jysz/jyjhgl/reAddPlan/:planId?" component={TpkAddResearchPlan} />
          {/* 教研组管理 */}
          <Route path="/home/tpk/jysz/jyzgl" component={GroupCtro} />
          {/* 教研评价管理 */}
          <Route path="/home/tpk/jysz/jypjgl" component={EvaluateCtro} />
          <Redirect to="/home/tpk/jysz/jyjhgl" />
        </Switch>
      </div>
    )
  }
}
