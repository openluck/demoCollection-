/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-28 14:03:58
 * 听评课V2.2——任务结果详情
 */

import React, { Component } from 'react';
import TaskDetails from './../../../components/tpk/rwgz/taskDetails';
import { BreadPonent } from './../../../components/topPonent';

export default class ResultDetail extends Component {
  render() {
    return <>
      <BreadPonent pages={["任务结果", "任务详情"]} />
      <TaskDetails />
      {/* <Button onClick={() => this.props.history.goBack()}>返回 </Button>
      <div>  任务结果详情    </div>
      <Button onClick={() => this.props.history.push('/admin/tpk/rwgz/rwjg/rwjggrxq/1')}>任务结果个人详情 </Button> */}
    </>;
  }
}
