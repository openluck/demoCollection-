/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-26 17:07:18
 * 听评课V2.2——创建评课任务-已选择课程表格
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import PerfectScrollbar from "react-perfect-scrollbar";
import PagePonent from './../../pagePonent';

import { seleChan, courseSeleChan } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';
import './../../../../style/tpk/rwgl/mj-courseTable.scss';

@connect(state => state.addTask, { seleChan, courseSeleChan })
export default class CourseChecked extends Component {
  render() {
    const title = [
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
      { name: '操作', key: 'dataId' }
    ];
    let { seleList, seleListIndex, seleListTable } = this.props;
    // console.log(data);

    return <>
      {/* 表头 */}
      <div className='mj-ct-tableHeaderCon'>
        {
          title.map(item => {
            return <div key={item.key}>{item.name}</div>
          })
        }
      </div>

      {/* 表格内容 */}
      <div style={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
        <PerfectScrollbar>
        {
          seleListTable && seleListTable.length ?
            seleListTable.map(item => {
              return <div key={item.dataId} className='mj-cc-tableCon'>
                <div title={item.collegeName}>{item.collegeName || '-'}</div>
                <div title={item.courseNum}>{item.courseNum || '-'}</div>
                <div title={item.courseName}>{item.courseName || '-'}</div>
                <div title={item.courseType}>{item.courseType || '-'}</div>
                <div title={item.teacherName}>{item.teacherName || '-'}</div>
                <div title={item.week}>{item.week || '-'}</div>
                <div title={item.weekDay}>{item.weekDay || '-'}</div>
                <div title={item.schoolNum}>{item.schoolNum || '-'}</div>
                <div title={item.areaName}>{item.areaName || '-'}</div>
                <div title={item.school} style={{ textAlign: 'left' }}>{item.school || '-'}</div>
                <div onClick={() => this.props.courseSeleChan('deleSele', item.dataId)}>移除</div>
              </div>
            }) : null
        }
        </PerfectScrollbar>
      </div>

      {/* 分页 */}
      <div className='mj-p-pages'>
        {/* <span className='mj-ct-total'>{`每页20条数据，共${seleList.length}条`}</span>
        <Pagination
          defaultCurrent={1}
          total={seleList.length}
          pageSize={20}
          current={seleListIndex}
          onChange={(page) => this.props.courseSeleChan('seleListPage', page)}
        /> */}
        <PagePonent
          pageIndex={seleListIndex}
          pageSize={20}
          pageChan={(page) => this.props.courseSeleChan('seleListPage', page)}
          len={seleListTable && seleListTable.length || 0}
          total={seleList.length} />
      </div>
    </>;
  }
}