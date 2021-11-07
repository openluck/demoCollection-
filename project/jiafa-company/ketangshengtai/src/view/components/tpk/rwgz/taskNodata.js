/*
 * @Author: yh 
 * @Date: 2020-02-11 14:09:45 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-28 10:51:45
 * 任务列表无数据
 */
import React, { Component } from 'react';
import noneData from './../../../../media/picture/noneData.png';

export default class TaskNodata extends Component {
  render() {
    return (
      <div className='mj-rxq-noneData'>
        <img src={noneData} />
        <div>暂无数据</div>
      </div>
    )
  }
}
