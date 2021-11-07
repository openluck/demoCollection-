/*
 * @Author: JudyC 
 * @Date: 2017-09-12 15:21:04 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-15 14:16:14
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import { SVG } from './../../components/tpk/base.jsx';
import './../../../style/tpk/mj_classHaveChosed.css';

class ClassHaveChosed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.columns = [{
      title: '周次/周几/节次',
      dataIndex: 'time'
    }, {
      title: '名字',
      dataIndex: 'name'
    }, {
      title: '科目',
      dataIndex: 'subject'
    }, {
      title: '班级',
      dataIndex: 'gradeClass'
    }, {
      title: '人数',
      dataIndex: 'num'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <span>
          {/* <i className="iconfont" onClick={() =>this.onDelete(record.key)}>&#xe626;</i> */}
          <SVG type='sc' style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} onClick={() => this.onDelete(record.key)} />
        </span>
      )
    }];
    this.columns1 = [
      {
        title: '任课老师',
        dataIndex: 'name'
      }, {
        title: '课程',
        dataIndex: 'subject'
      },
      {
        title: '上课日期',
        dataIndex: 'time'
      },
      {
        title: '地点',
        dataIndex: 'gradeClass'
      },
      {
        title: '班级',
        dataIndex: 'className'
      }, {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <span>
            <SVG type='sc' style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} onClick={() => this.onDelete(record.key)} />
          </span>
        )
      }];
  }

  onDelete = (key) => {
    this.props.handleDelHaveChose(key);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(nextProps.dataSource.length, prevState.data.length);
    if (nextProps.dataSource.length !== prevState.data.length) {
      return {
        data: JSON.parse(JSON.stringify(nextProps.dataSource))
      }
    } else {
      return null
    }
  }

  render() {
    let { data } = this.state
    console.log('data', data)
    return (
      <div className="cjy-chc-haveChoseBox">
        <div className="cjy-chc-headLine">
          <span className="cjy-chc-haveChoseSpan">
            {this.props.type === 'listen' ? '此次选择的随堂听' : '已选教研课：' + '共 ' + `${this.props.dataSource.length}` + ' 节'}</span>
          {
            this.props.type === 'listen' ?
              <div className="cjy-chc-amountBox">共&nbsp;<span>{this.props.dataSource.length}</span>&nbsp;节</div>
              : null
          }
        </div>
        {
          this.props.type == 'listen' ?
            <Table showHeader={false} pagination={false} columns={this.columns} dataSource={data} />
            :
            <Table pagination={false} columns={this.columns1} dataSource={data} />
        }
      </div>
    );
  }
}

export default ClassHaveChosed;