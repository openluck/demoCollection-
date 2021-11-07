/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 09:58:48 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 09:54:35
 * 听评课-教师部分-我的教研课-我的教研本
 */
import React, { Component } from 'react';
import { Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import { G } from './../../../../config/g';
import Diary from './../../../components/tpk/diary';

class TpkTeachResearchComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: G.baseinfo.teacherid,
      curriculumallId: '',
      uid: null
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
    const { uid } = this.state;
    const baseinfo = JSON.parse(sessionStorage.getItem('baseinfo'))
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        <div className="pf-t-breadcrumb">
          <Link to='/home/tpk/wdjyk' className='pf-t-breadbutton'>
            <Button type="primary" size='large'>返回</Button>
          </Link>
          <span className='pf-t-breadtitle'>当前位置：</span>
          <div className='pf-t-bread'>
            <Breadcrumb separator=">">
              <Breadcrumb.Item>我的教研课</Breadcrumb.Item>
              <Breadcrumb.Item>我的教研本</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Diary teacherId={baseinfo.userId || ''} type={'research'} curriculumallId={this.state.curriculumallId} uid={uid}></Diary>
      </div>
    );
  }
}

export default TpkTeachResearchComment;