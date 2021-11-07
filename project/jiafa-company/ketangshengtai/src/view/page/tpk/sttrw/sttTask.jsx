/*
 * @Author: JC.Liu 
 * @Date: 2019-02-23 22:34:10 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-20 17:28:28
 * 听评课 - 随堂听任务
 */
import React, { Component } from 'react';
import ListenTopTotal from './../../../components/tpk/listenTopTotal.jsx';
import ListenButtomTotal from './../../../components/tpk/listenButtomTotal.jsx';

export class SttTask extends Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
         <ListenTopTotal history={this.props.history}></ListenTopTotal>
         <ListenButtomTotal></ListenButtomTotal>  
      </div>
    );
  }
}