/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 09:56:36 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 09:50:32
 * 听评课-教师部分-我的随堂听-随堂听笔记本
 */
import React, { Component } from 'react';
import { Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import Diary from './../../../components/tpk/diary';
import { G } from './../../../../config/g';

class TpkTeachListenComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: G.baseinfo.teacherid,
      curriculumallId: '',
      uid: null,
    }
  };
  componentWillMount() {
    if (this.props.match.params.teacherId && this.props.match.params.curriculumallId && this.props.match.params.uid) {
      this.setState({
        curriculumallId: this.props.match.params.curriculumallId,
        uid: this.props.match.params.uid,
      })
    } else {
      this.setState({
        teacherId: G.baseinfo.teacherid,
        curriculumallId: '',
        uid: null
      })
    }
  }

  render() {
    const baseinfo = JSON.parse(sessionStorage.getItem('baseinfo'))
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        <div className="pf-t-breadcrumb">
          <Link to='/home/tpk/wdsst' className='pf-t-breadbutton'>
            <Button type="primary" size='large'>返回</Button>
          </Link>
          <span className='pf-t-breadtitle'>当前位置：</span>
          <div className='pf-t-bread'>
            <Breadcrumb separator=">">
              <Breadcrumb.Item>我的随堂听</Breadcrumb.Item>
              <Breadcrumb.Item>我的听课本</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Diary teacherId={baseinfo.userId || ''} type={'listen'} curriculumallId={this.state.curriculumallId} uid={this.state.uid}></Diary>
      </div>
    );
  }
}

export default TpkTeachListenComment;