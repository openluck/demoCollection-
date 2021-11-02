/*
 * @Author: Minj 
 * @Date: 2017-09-11 10:27:54 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 15:55:04
 * 听评课-管理员部分-随堂听任务-听课员详情(完成情况)
 */
import React, { Component } from 'react';

import ListenerFiniTab from './../../../components/tpk/listenerFiniTab.jsx';
import BreadCrumb from './../../../components/breadCrumb';

const data = ['听评课','随堂听任务','听课员详情'];

class TpkManaDetListenerInfo extends Component{
  render(){
    return (
      <div>
         <BreadCrumb data={data}></BreadCrumb> 
         <ListenerFiniTab></ListenerFiniTab>  
      </div>
    );
  }
}

export default TpkManaDetListenerInfo;