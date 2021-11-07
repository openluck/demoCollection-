/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-29 14:30:09
 * 听评课V2.2——创建评课任务-选择课程名单
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, Select, Input, Button } from 'antd';
import noneData from './../../../../media/picture/noneData.png';

import CourseSele from './mj-courseSele';
import CourseChecked from './mj-courseChecked';
import { reqCollegeList, reqCourseList, seleChan, courseSeleChan } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';
import './../../../../style/tpk/rwgl/mj-seleCourseList.scss';

const { Option } = Select;
@withRouter
@connect(state => state.addTask, { reqCollegeList, reqCourseList, seleChan, courseSeleChan })
export default class SeleCourseList extends Component {
  componentDidMount() {
    this.props.reqCollegeList();
  }
  render() {
    let ifId = this.props.match.params.taskId;
    const { seleCourseModal, collegeList, collegeSele, schoolList, schoolSele, typeList, typeSele, courseKeyWord, teacherKeyWord,
      ifSele, seleList, courseListData } = this.props;
    return <Modal
      title={
        <div className='mj-scl-modalTitle'>
          <span>选择课程名单</span>
          <div onClick={() => this.props.courseSeleChan('ifSeleChan', !ifSele)}>{ifSele ? `查看已选课程（${seleList.length}）` : `选择课程`}</div>
        </div>
      }
      centered={true}
      wrapClassName='mj-scl-seleModal'
      visible={seleCourseModal}
      cancelText={'取消'}
      okText={'确定'}
      onCancel={() => this.props.courseSeleChan('courseCance', false)}
      onOk={() => this.props.courseSeleChan('checkSure')}
    >
      {
        ifSele ?
          <>
            {/* 筛选 */}
            <div className='mj-scl-seleCon'>
              <div className='mj-scl-college'>
                <span>院系：</span>
                <Select
                  value={collegeSele}
                  getPopupContainer={() => document.getElementsByClassName('mj-scl-seleCon')[0]}
                  onSelect={(value) => this.props.courseSeleChan('collegeChan', value)}>
                  {
                    !collegeList.length ? null :
                      collegeList.map(item => {
                        return <Option key={item.collegeId} value={item.collegeId}>{item.collegeName}</Option>
                      })
                  }
                </Select>
              </div>

              <div className='mj-scl-college mj-scl-school'>
                <span>校区：</span>
                <Select
                  getPopupContainer={() => document.getElementsByClassName('mj-scl-seleCon')[0]}
                  value={schoolSele}
                  onSelect={(value) => this.props.courseSeleChan('schoolChan', value)}>
                  {
                    !schoolList.length ? null :
                      schoolList.map(item => {
                        return <Option key={item.schoolId} value={item.schoolId}>{item.schoolName}</Option>
                      })
                  }
                </Select>
              </div>

              <div className='mj-scl-college mj-scl-school'>
                <span>课程类别：</span>
                <Select
                  getPopupContainer={() => document.getElementsByClassName('mj-scl-seleCon')[0]}
                  value={typeSele}
                  onSelect={(value) => this.props.courseSeleChan('typeChan', value)}>
                  {
                    !typeList.length ? null :
                      typeList.map(item => {
                        return <Option key={item.typeId} value={item.typeId}>{item.typeName}</Option>
                      })
                  }
                </Select>
              </div>

              <div className='mj-scl-teacher'>
                <span>教师：</span>
                <Input
                  placeholder='输入教师名称'
                  value={teacherKeyWord}
                  onChange={(e) => this.props.courseSeleChan('teahcerChan', e.target.value)} />
              </div>

              <div className='mj-scl-teacher'>
                <span>课程：</span>
                <Input
                  placeholder='输入课程名称'
                  value={courseKeyWord}
                  onChange={(e) => this.props.courseSeleChan('courseChan', e.target.value)} />
              </div>

              <Button
                className='mj-scl-seleBtn'
                type='primary'
                onClick={() => this.props.reqCourseList(1, collegeSele, schoolSele, typeSele, courseKeyWord, teacherKeyWord)}>筛选</Button>
            </div>

            {/* 表格 */}
            {
              !courseListData.length ?
                <div className='mj-rxq-noneData' style={{height: 'calc(100% - 40px)'}}>
                  <img src={noneData} />
                  <div>暂无数据</div>
                </div> :
                <CourseSele />
            }
          </>
          : <div style={{height: '100%'}}>
            {
              !seleList.length ?
                <div className='mj-rxq-noneData'>
                  <img src={noneData} />
                  <div>暂无数据</div>
                </div> :
                <CourseChecked />
            }
          </div>
      }
    </Modal>;
  }
}
