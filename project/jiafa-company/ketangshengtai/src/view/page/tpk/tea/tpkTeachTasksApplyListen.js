/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 09:42:54 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 10:42:34
 * 听评课-教师部分-我的任务-申请听课页面
 */
import React, { Component } from 'react';
import { Breadcrumb,Button} from 'antd';
import { Link } from 'react-router-dom';
import TasksApplyListenTable from './../../../components/tpk/tea/tasksApplyListenTable';
import './../../../../style/tpk/mj_tpkTeachTasksApplyListen.css';


class TpkTeachTasksApplyListen extends Component{  
  render(){
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
              <Breadcrumb.Item>申请听课</Breadcrumb.Item> 
            </Breadcrumb> 
          </div>
        </div>
        <TasksApplyListenTable></TasksApplyListenTable>
      </div>
    );
  }
}




export default TpkTeachTasksApplyListen;
