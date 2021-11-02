/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-20 10:27:38
 * 听评课V2.2——创建评课任务-步骤一
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Radio, Input, DatePicker, Button, Modal } from 'antd';
import SVG from './../../../public/public-component-svg';
import { G } from './../../../../config/g';
import errorTip from './../../../../media/picture/errorTip.png';

import CourseTable from './mj-courseTable';
import SeleCourseList from './mj-seleCourseList';
import { seleChan, downLoadList, leadInExcel, reqErrorLeadIn } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';
import './../../../../style/tpk/rwgl/mj-addTask.scss';

@withRouter
@connect(state => state.addTask, { seleChan, downLoadList, leadInExcel, reqErrorLeadIn })
export default class StepOne extends Component {
  disabledDate = (current) => {
    let today = moment().subtract(0, "days").format("YYYY-MM-DD");
    return current && current < moment(today);
  }
  goback = () => {
    this.props.seleChan('init');
    // console.log(this.props);

    this.props.history.goBack();
  }

  render() {
    let { ifNew, taskType, taskName, taskDate, leadInModal, leadInError, seleCourseModal,
      courseInfoList, courseInfoTotal, courseInfoTable, fileName, ifEdit } = this.props;
    let taskTypeList = G.taskTypeList;
    // console.log(G);

    return <div className='mj-so-content' ref={node => (this.node = node)}>
      {/* 任务类型 */}
      <div className='mj-so-taskType'>
        <span>任务类型：</span>
        <Radio.Group
          onChange={(e) => this.props.seleChan('taskTypeSele', e.target.value)}
          disabled={ifEdit}
          value={taskType}>
          {
            taskTypeList && taskTypeList.length ?
              taskTypeList.map(item => {
                return item.taskTypeId === 'all' ? null : <Radio key={item.taskTypeId} value={item.taskTypeId}>{item.tasktype}</Radio>
              }) : null
          }
        </Radio.Group>
      </div>

      {/* 任务名称 */}
      <div className='mj-so-taskNameCon'>
        <div className='mj-so-taskName'>
          <span>任务名称：</span>
          <Input
            maxLength={30}
            disabled={ifEdit}
            value={taskName}
            onChange={(e) => this.props.seleChan('taskNameSele', e.target.value)} />
        </div>
        <div className='mj-so-taskDate'>
          <span>截止日期：</span>
          <DatePicker
            value={taskDate ? moment(taskDate, "YYYY-MM-DD") : null}
            disabledDate={this.disabledDate}
            getCalendarContainer={() => document.getElementsByClassName('mj-so-taskDate')[0]}
            disabled={ifEdit}
            onChange={(date, dateString) => this.props.seleChan('taskDateSele', dateString)} />
        </div>
      </div>

      {/* 课程名单 */}
      <div className='mj-so-taskCourseTxt'>
        <span>指定的课程名单（非必填）：</span>
        {
          !courseInfoTotal ? null :
            <div className='mj-clearfix mj-so-notNew'>
              <span className='mj-so-grade'>总共指定 </span>
              <span className='mj-so-blue'>{courseInfoTotal}</span>
              <span className='mj-so-grade'> 门课程</span>
              <div>
                <Button
                  style={{
                    color: ifEdit ? 'rgba(0, 0, 0, 0.25)' : '#fff',
                    backgroundColor: ifEdit ? '#f5f5f5' : '#59a6ee',
                    borderColor: ifEdit ? '#d9d9d9' : 'transparent'
                  }}
                  className='mj-so-seleCourseTop'
                  disabled={ifEdit}
                  onClick={() => this.props.seleChan('seleCourse')}>选择课程</Button>
                <Button
                  style={{
                    color: ifEdit ? 'rgba(0, 0, 0, 0.25)' : '#fff',
                    backgroundColor: ifEdit ? '#f5f5f5' : '#5acc9b',
                    borderColor: ifEdit ? '#d9d9d9' : 'transparent'
                  }}
                  className='mj-so-leadInTop'
                  disabled={ifEdit}
                  onClick={() => this.props.seleChan('leadInClick')}>导入课程名单</Button>
              </div>
            </div>
        }
      </div>
      {
        courseInfoTotal !== 0 ?
          <CourseTable scrollTop={this.props.scrollTop} /> :
          <div className='mj-so-taskCourseCon'>
            <Button
              style={{
                color: ifEdit ? 'rgba(0, 0, 0, 0.25)' : '#fff',
                backgroundColor: ifEdit ? '#f5f5f5' : '#59a6ee',
                borderColor: ifEdit ? '#d9d9d9' : 'transparent'
              }}
              className='mj-so-seleCourse'
              disabled={ifEdit}
              onClick={() => this.props.seleChan('seleCourse')}>选择课程</Button>
            <Button
              style={{
                color: ifEdit ? 'rgba(0, 0, 0, 0.25)' : '#fff',
                backgroundColor: ifEdit ? '#f5f5f5' : '#5acc9b',
                borderColor: ifEdit ? '#d9d9d9' : 'transparent'
              }}
              className='mj-so-leadIn'
              disabled={ifEdit}
              onClick={() => this.props.seleChan('leadInClick')}>导入课程名单</Button>
          </div>
      }

      <div className='mj-so-stepBtn'>
        <Button className='mj-so-cancel' onClick={() => this.goback()}>取消</Button>
        <Button className='mj-so-next' onClick={() => {
          this.props.seleChan('stepNext', 2);
          this.node.scrollIntoView();
        }}>下一步</Button>
      </div>

      {/* 模态框 */}
      {
        !leadInModal ? null :
          <Modal
            title="导入课程名单"
            centered={true}
            wrapClassName='mj-so-modal'
            visible={leadInModal}
            cancelText={'取消'}
            okText={'导入'}
            onCancel={() => this.props.seleChan('leadInCancel')}
            onOk={() => this.props.seleChan('filesOk')}
          >
            <div className='mj-so-modalTxt'>1.下载听课课程模板</div>
            <div className='mj-so-leadInLink'>
              <SVG type='xiazai' />
              <a onClick={() => this.props.downLoadList()}>课程导入模板.xlsx</a>
            </div>

            <div className='mj-so-modalTxt'>2.将已有数据的课程列表导入</div>
            <div className='mj-so-leadInLink mj-so-seleFile'>
              <Input value={fileName} />
              <div>
                <Button>选择文件</Button>
                <input
                  ref={(files) => this.files = files}
                  onChange={(e) => this.props.seleChan('filesChan', e.target.files)}
                  className='mj-so-file'
                  type='file' />
              </div>
            </div>
          </Modal>
      }

      {
        !leadInError ? null :
          <Modal
            title="导入课程名单"
            centered={true}
            wrapClassName='mj-so-errorModal'
            visible={leadInError}
            onCancel={() => this.props.seleChan('errorLeadCancel')}
          >
            <img src={errorTip} />
            <p>数据文件有误</p>
            <div>
              <SVG type='bg' />
              <a onClick={() => this.props.reqErrorLeadIn()}>点击下载标出错误的EXCEL文件</a>
            </div>
          </Modal>
      }

      {
        !seleCourseModal ? null :
          <SeleCourseList />
      }
    </div>;
  }
}
