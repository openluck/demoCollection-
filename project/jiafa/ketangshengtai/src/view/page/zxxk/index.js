/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: mzc
 * @Last Modified time: 2021-10-19 10:27:06
 * 在线巡课
 */
import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { G } from "./../../../config/g";

import Zxxke from "./zxxk/zxxkAuth";
import Xkjg from "./xkjg/xkjgIndex";
import Xksz from "./xksz/xkszIndex";

class ZxxkIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "",
    };
  }
  componentWillMount() {
    // this.findRedirect();
  }
  /**
   * @desc  根据 modelConfig 找到第一个可展示的模块
   * @param { array } model  模块配置
   */
  findRedirect() {
    // console.log(G);
    let model = _.find(G.modelConfig, { path: "zxxk" });
    let FirstTarget = _.find(model.children, { display: true });
    // console.log(model);
    let path = "";
    if (FirstTarget && FirstTarget.length) {
      path = `${FirstTarget.path}/${FirstTarget.children[0].path}`;
      return (
        <Redirect
          to={`/home/zxxk/${FirstTarget.path}/${FirstTarget.children[0].path}`}
        />
      );
    } else {
      return <Redirect to={`/home/zxxk`} />;
    }
    // this.setState({ path })
  }
  render() {
    return (
      <React.Fragment>
        <Switch>
          {/* 在线巡课 */}
          <Route path="/home/zxxk/zxxke" component={Zxxke} />
          {/* 巡课结果 */}
          <Route path="/home/zxxk/xkjg" component={Xkjg} />
          {/* 巡课设置 */}
          <Route path="/home/zxxk/xksz" component={Xksz} />

          {/* <Redirect to={`/home/zxxk/zxxke `} /> */}
          {G.modelConfig && G.modelConfig.length
            ? this.findRedirect(G.modelConfig)
            : null}
        </Switch>
      </React.Fragment>
    );
  }
}

export default ZxxkIndex;
