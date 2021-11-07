/*
 * @Author: JC.Liu
 * @Date: 2017-09-11 18:06:54 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 09:13:47
 * 听评课-教师部分-我的随堂听
 */
import React, { Component } from 'react';
import ListenMyInfo from './../../../components/tpk/tea/listenMyInfo';
import ListenSearchListenInfo from './../../../components/tpk/tea/listenSearchListenInfo';

export class MyListen extends Component {
  componentDidMount() {
    this.node.scrollIntoView();
  }
  render() {
    return (
      <div ref={node => this.node = node}
        style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        <ListenMyInfo></ListenMyInfo>
        <ListenSearchListenInfo></ListenSearchListenInfo>
      </div>
    );
  }
}