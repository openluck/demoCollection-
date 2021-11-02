/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-18 11:28:52
 * 听评课V2.2——创建评课任务
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
// import BreadCrumb from './../../../components/breadCrumb';
import { G } from './../../../../config/g';
import { BreadPonent } from './../../../components/topPonent';

import StepOne from './../../../components/tpk/rwgl/mj-stepOne';
import StepTwo from './../../../components/tpk/rwgl/mj-stepTwo';
import { seleChan, reqTaskInfo, reqCourseInfo } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';
import './../../../../style/tpk/rwgl/mj-addTask.scss';

@connect(state => state.addTask, { seleChan, reqTaskInfo, reqCourseInfo })
export default class AddTask extends Component {
  constructor() {
    super()
    this.scrollTop = this.scrollTop.bind(this);
  }
  componentDidMount() {
    let ifId = this.props.match.params.taskId;
    let type = this.props.match.params.type;
    if (ifId) {
      this.props.reqTaskInfo(ifId);
      this.props.reqCourseInfo(ifId);
    }
    this.props.seleChan('ifNewPage', { ifId: ifId ? false : true, type: type !== '1' ? false : true });
    this.props.seleChan('taskTypeList', G.taskTypeList);
  }
  componentWillUnmount() {
    this.props.seleChan('init');
  }

  scrollTop(isTop) {
    isTop ? this.node.scrollIntoView() : null;
  }
  render() {
    const { pageStep } = this.props;
    const { taskId, type } = this.props.match.params;
    // console.log(this.props.match.params);

    return <>
      {/* <BreadCrumb ver='tpk' data={['任务管理', '任务列表', '创建评课任务']} /> */}
      <BreadPonent pages={['任务列表', '创建评课任务']} />

      <div className='mj-at-container'>
        <div className='mj-at-title' ref={node => (this.node = node)}>
          <span></span>
          <span>{taskId && type === '0' ? '编辑任务' : type === '1' ? '查看任务' : '创建任务'}</span>
        </div>
        <div className='mj-at-content'>
          {
            pageStep === 1 ?
              <StepOne scrollTop={this.scrollTop} /> :
              <StepTwo scrollTop={this.scrollTop} />
          }
        </div>
      </div>
    </>;
  }
}
