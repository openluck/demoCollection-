/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-17 11:26:24
 * 系统设置
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, } from 'react-router-dom';
import { G } from './../../../config/g';

import Xtszhi from './xtszhi/xtszIndex';
import Gnszhi from './gnszhi/gnszhiIndex';

class XtszIndex extends Component {
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
    let model = _.find(G.modelConfig, { path: "zxxk" });
    let FirstTarget = _.find(model.children, { display: true });
    // console.log(model);
    let path = '';
    if (FirstTarget && FirstTarget.length) {
      path = `${FirstTarget.path}/${FirstTarget.children[0].path}`;
      return <Redirect to={`/home/zxxk/${FirstTarget.path}/${FirstTarget.children[0].path}`} />
    } else {
      return <Redirect to={`/home/xtsz`} />
    }
    // this.setState({ path })
  };
  render() {
    return (
      <React.Fragment>
        <Switch>
          {/* 权限设置 */}
          <Route path="/home/xtsz/xtszhi" component={Xtszhi} />

          {/* 功能设置 */}
          <Route path="/home/xtsz/gnszhi" component={Gnszhi} />

          {/* <Redirect to={`/home/xtsz/xtszhi `} /> */}
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

export default XtszIndex;