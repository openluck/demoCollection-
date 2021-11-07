/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-28 11:00:32
 * 听评课V2.2——任务结果
 */

import React, { Component } from "react";
import { Button } from "antd";
import MyTaskResult from "./../../../components/tpk/rwgz/taskResult";
import BreadCrumb from "./../../../components/breadCrumb";
import { TpkBreadCrumb } from './../../../components/tpk_breadCrumb';

export default class TaskResult extends Component {
  constructor(props) {
    super(props);
    this.state = { semester: '' }
    this.semesterChan = this.semesterChan.bind(this);
  }
  semesterChan(id) {
    this.setState({ semester: id });
  }
  render() {
    const { semester } = this.state;
    return (
      <>
        <TpkBreadCrumb semesterChan={(id) => this.semesterChan(id)} />
        {/* <BreadCrumb ver="tpk" data={["任务跟踪", "任务结果"]} /> */}
        <MyTaskResult semester={semester} />
        {/* <Button onClick={() => this.props.history.push('/admin/tpk/rwgz/rwjg/rwjgxq/1')}>任务结果详情 </Button> */}
      </>
    );
  }
}
