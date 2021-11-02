/*
 * @Author: JC.Liu
 * @Date: 2017-09-11 18:11:47 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-22 16:14:22
 * 听评课-教师部分-我的任务
 */
import React, { Component } from 'react';
import TasksMyInfo from './../../../components/tpk/tea/tasksMyInfo';
import TasksMySchedule from './../../../components/tpk/tea/tasksMySchedule';

export class MyTask extends Component {
  componentDidMount(){
    this.node.scrollIntoView();
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}
       className="JC-cancel-col-padding" ref={node => this.node = node}>
         <TasksMyInfo></TasksMyInfo>
         <TasksMySchedule></TasksMySchedule>  
      </div>
    );
  }
}