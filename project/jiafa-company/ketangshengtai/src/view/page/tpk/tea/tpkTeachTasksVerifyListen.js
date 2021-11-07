/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 09:44:10 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 10:45:56
 * 听评课-教师部分-我的任务-处理听课申请页面
 */
import React, { Component } from 'react';
import { Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import TasksVerifyListenTable from './../../../components/tpk/tea/tasksVerifyListenTable';


class TpkTeachTasksVerifyListen extends Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        <div className="pf-t-breadcrumb">
          <Link to='/home/tpk/wdrw' className='pf-t-breadbutton'>
            <Button type="primary" size='large'>返回</Button>
          </Link>
          <span className='pf-t-breadtitle'>当前位置：</span>
          <div className='pf-t-bread'>
            <Breadcrumb separator=">">
              <Breadcrumb.Item>我的任务</Breadcrumb.Item>
              <Breadcrumb.Item>待处理的申请</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <TasksVerifyListenTable></TasksVerifyListenTable>
      </div>
    );
  }
}

export default TpkTeachTasksVerifyListen;