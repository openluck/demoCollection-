/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-17 11:24:53
 * 系统设置
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, } from 'react-router-dom';
import { G } from './../../../config/g';

import Aqjc from './aqjc/aqjcIndex';
import Jcjg from './jcjg/jcjgIndex';
import Aqsz from './aqsz/aqszIndex';

class PajsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: ''
    }
  }
  componentWillMount() {
    // this.findRedirect();
  }
  /**
   * @desc  根据 modelConfig 找到第一个可展示的模块
   * @param { array } model  模块配置
   */
  findRedirect() {
    let model = _.find(G.modelConfig, { path: "pajs" });
    let FirstTarget = _.find(model.children, { display: true });
    // console.log(model, FirstTarget);
    let path = '';
    if (FirstTarget && FirstTarget.length) {
      path = `${FirstTarget.path}/${FirstTarget.children[0].path}`;
      return <Redirect to={`/home/pajs/${FirstTarget.path}/${FirstTarget.children[0].path}`} />
    } else {
      return <Redirect to={`/home/pajs`} />
      // return <Redirect to={`/home/pajs/${FirstTarget.path}`} />
    }
  };
  render() {
    return (
      <React.Fragment>
        <Switch>
          {/* 安全检查 */}
          <Route path="/home/pajs/aqjc" component={Aqjc} />
          {/* 检查结果 */}
          <Route path="/home/pajs/jcjg" component={Jcjg} />
          {/* 安全设置 */}
          <Route path="/home/pajs/aqsz" component={Aqsz} />

          {/* <Redirect to={`/home/pajs/aqjc `} /> */}
          {
            G.modelConfig && G.modelConfig.length
              ? this.findRedirect(G.modelConfig)
              : null
          }
        </Switch>
      </React.Fragment>
    )
  }
}

export default PajsIndex;