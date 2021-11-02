/*
 * @Author: JudyC 
 * @Date: 2017-10-11 14:30:15 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-20 11:01:26
 * 教研本页面
 */
import React, { Component } from 'react';
import BreadCrumb from './../../../components/breadCrumb';
import Diary from './../../../components/tpk/diary';

class TpkResearchBook extends Component {
  render() {
    const name = this.props.match.params.name;
    const data = ['听评课', '教研任务', '教研员详情', `${name||'-'}的教研本`];
    return (
      <div style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        <BreadCrumb data={data}></BreadCrumb>
        <div style={{ marginTop: '20px' }}>
           <Diary teacherId={this.props.match.params.teaId} type={'research'} curriculumallId='0'></Diary> 
        </div>
      </div>
    );
  }
}

export default TpkResearchBook;