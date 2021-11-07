/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-28 10:38:18
 * 听评课V2.2——任务概览
 */
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Select, Input, Button, } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import BreadCrumb from './../../../components/breadCrumb';
import { TpkBreadCrumb } from './../../../components/tpk_breadCrumb';

// import OverviewContainer from './../../../../component/admin/tpk_2.2/rwgz/overviewContainer';
import TaskProfile from './../../../components/tpk/rwgz/taskProfile';
import TaskState from './../../../components/tpk/rwgz/taskState';
import TaskProgress from './../../../components/tpk/rwgz/taskProgress';
import TaskList from './../../../components/tpk/rwgz/taskList';

import { yh_getOverView, yh_getStatus, yh_getProgress } from './../../../../redux/tpk/rwgz/yh-taskOveriew.reducer';
import './../../../../style/tpk/yh-taskOverview.scss';
const { Option } = Select;
@connect(state => state.yh_taskOverviewReducer, {
  yh_getOverView,
  yh_getStatus,
  yh_getProgress
})
export default class TaskOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      semesterId: '',
    }
    this.breadCrumb = ['任务跟踪', '任务进度']
    this.scrollTop = this.scrollTop.bind(this);
  }
  componentDidMount() {
    // this.props.yh_getOverView();
    // this.props.yh_getStatus()
    // this.props.yh_getProgress()
  }
  scrollTop(isScroll) {
    isScroll ? this.node.scrollIntoView() : null;
  }

  semesterChan(id) {
    this.props.yh_getOverView(id);
    this.props.yh_getStatus(id);
    this.props.yh_getProgress(id);
    this.setState({ semesterId: id })
  }

  render() {
    const { overView, status, progress } = this.props;
    const { semesterId } = this.state;

    return (
      <>
        <TpkBreadCrumb semesterChan={(id) => this.semesterChan(id)} />

        <div className='mj-to-content'>
          <PerfectScrollbar>
            <div className="yh-item-wrap" ref={node => (this.node = node)}>
              <TaskProfile
                overViewData={overView}
              />
              <TaskState
                stateData={status}
              />
            </div>
            <div className="yh-item-wrap">
              <TaskProgress
                progressData={progress}
              />
            </div>
            <div className="yh-item-wrap">
              <TaskList scrollTop={this.scrollTop} semester={semesterId} />
            </div>
          </PerfectScrollbar>
        </div>
      </>
    )
  }
}

