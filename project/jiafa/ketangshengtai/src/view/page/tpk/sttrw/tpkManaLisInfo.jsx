/*
 * @Author: Minj 
 * @Date: 2017-09-11 10:27:54 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 15:55:47
 * 听评课-管理员部分-随堂听任务-听课详情
 */
import React, { Component } from 'react';

import ListenDetTab from './../../../components/tpk/listenDetTab.jsx';
import BreadCrumb from './../../../components/breadCrumb';

const data = ['听评课', '随堂听任务', '听课详情'];

class TpkManaLisInfo extends Component {
  render() {
    const date = this.props.match.params.id;
    const teaName = this.props.match.params.teacher;
    const teaId = this.props.match.params.teaId;
    // console.log(id);
    return (
      <div>
        <BreadCrumb data={data}></BreadCrumb>
        <ListenDetTab teaName={teaName} teaId={teaId} history={this.props.history}></ListenDetTab>
      </div>
    );
  }
}

export default TpkManaLisInfo;