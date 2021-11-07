/*
 * @Author: Minj 
 * @Date: 2017-09-11 10:27:54 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 15:03:09
 * 听评课-管理员部分-随堂听任务-听课员详情(开展情况)
 */
import React, { Component } from 'react';

import ListenerOverTab from './../../../components/tpk/listenerOverTab.jsx';
import BreadCrumb from './../../../components/breadCrumb';

class TpkManaOverListenerInfo extends Component {
  render() {
    const data = ['听评课', '随堂听任务', '听课员详情'];
    return (
      <div>
        <BreadCrumb data={data}></BreadCrumb>
        <ListenerOverTab></ListenerOverTab>
      </div>
    );
  }
}
export default TpkManaOverListenerInfo; 