/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-30 15:52:33
 * 听评课V2.2——个人任务详情
 */

import React, { Component } from "react";
import { Button } from "antd";

// import BreadCrumb from './../../../components/breadCrumb';
import { BreadPonent } from './../../../components/topPonent';
import MyTaskDetailComp from "./../../../components/tpk/zxpk/myTaskDetail";

export default class MyTaskDetail extends Component {
  render() {
    return (
      <>
        {/* <BreadCrumb ver='tpk' data={['在线评课', '我的任务', '个人任务详情']} /> */}
        <BreadPonent pages={['我的任务', '个人任务详情']} />

        <MyTaskDetailComp />
        {/* <Button onClick={() => this.props.history.goBack()}>返回 </Button>
      <div>  个人任务详情    </div>
      <Button onClick={() => this.props.history.push('/admin/tpk/zxpk/wdrw/xzkc')}>选择课程 </Button> */}
      </>
    );
  }
}
