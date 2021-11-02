/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-26 17:07:01
 * 听评课V2.2——创建评课任务-选择课程表格
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Checkbox, Pagination } from 'antd';
import PerfectScrollbar from "react-perfect-scrollbar";
import PagePonent from './../../pagePonent';

import './../../../../style/tpk/rwgl/mj-courseTable.scss';
import { seleChan, courseSeleChan, reqCourseList } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';

@withRouter
@connect(state => state.addTask, { seleChan, courseSeleChan, reqCourseList })
export default class CourseSele extends Component {
  constructor(props) {
    super(props);
    this.pageChan = this.pageChan.bind(this);
  }
  /**
   * @desc 页码改变
   * @param {*} page 页码
   */
  pageChan(page) {
    const { collegeSele, schoolSele, typeSele, courseKeyWord, teacherKeyWord } = this.props;
    this.props.reqCourseList(page, collegeSele, schoolSele, typeSele, courseKeyWord, teacherKeyWord);
  }

  render() {
    const title = [
      { name: '', key: 'sele' },
      { name: '开课院系', key: 'collegeName' },
      { name: '课程号', key: 'courseNum' },
      { name: '课程名', key: 'courseName' },
      { name: '课程类别', key: 'courseType' },
      { name: '教师', key: 'teacherName' },
      { name: '周次', key: 'week' },
      { name: '星期', key: 'weekDay' },
      { name: '节次', key: 'schoolNum' },
      { name: '校区', key: 'areaName' },
      { name: '场所', key: 'school' },
    ];
    let { courseListData, courseListTotal, ifAll, seleList, courseListIndex } = this.props;
    // console.log(courseListIndex);

    return <>
      {/* 表头 */}
      <div className='mj-ct-tableHeaderCon'>
        {
          title.map(item => {
            return item.key === 'sele' ?
              <Checkbox
                className='mj-cs-titleCon'
                key={item.key}
                checked={ifAll}
                onChange={(e) => this.props.courseSeleChan('checkAll', e.target.checked)} /> :
              <div key={item.key}>{item.name}</div>
          })
        }
      </div>

      {/* 表格内容 */}
      <div style={{ height: 'calc(100% - 170px)' }}>
        <PerfectScrollbar>
          {
            courseListData && courseListData.length ?
              courseListData.map(item => {
                return <div key={item.dataId} className='mj-ct-tableCon mj-cs-tableCon'>
                  <Checkbox
                    className='mj-cs-titleCon'
                    checked={item.checked}
                    onChange={(e) => this.props.courseSeleChan('check', { event: e.target.checked, item })} />
                  <div title={item.collegeName}>{item.collegeName || '-'}</div>
                  <div title={item.courseNum}>{item.courseNum || '-'}</div>
                  <div title={item.courseName}>{item.courseName || '-'}</div>
                  <div title={item.courseType}>{item.courseType || '-'}</div>
                  <div title={item.teacherName}>{item.teacherName || '-'}</div>
                  <div title={item.week}>{item.week || '-'}</div>
                  <div title={item.weekDay}>{item.weekDay || '-'}</div>
                  <div title={item.schoolNum}>{item.schoolNum || '-'}</div>
                  <div title={item.areaName}>{item.areaName || '-'}</div>
                  <div title={item.school} style={{textAlign: 'left'}}>{item.school || '-'}</div>
                </div>
              }) : null
          }
        </PerfectScrollbar>
      </div>

      {/* 分页 */}
      <div className='mj-p-pages'>
        {/* <span className='mj-ct-total'>{`每页20条数据，共${courseListTotal}条`}</span>
        <Pagination
          current={courseListIndex}
          total={courseListTotal}
          pageSize={20}
          onChange={(page) => this.pageChan(page)}
        /> */}
        <PagePonent
          pageIndex={courseListIndex}
          pageSize={20}
          pageChan={(page) => this.pageChan(page)}
          len={courseListData && courseListData.length || 0}
          total={courseListTotal} />
      </div>
    </>;
  }
}
