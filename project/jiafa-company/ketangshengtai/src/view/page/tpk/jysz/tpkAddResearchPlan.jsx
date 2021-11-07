/*
 * @Author: JudyC 
 * @Date: 2017-09-12 10:53:47 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-20 15:00:55
 */
import React, { Component } from 'react';
import BreadCrumb from './../../../components/breadCrumb';
import ListenTaskStep from './../../../components/tpk/listenTaskStep.jsx';
import './../../../../style/tpk/mj_tpkAddResearchPlan.css';

const steps = [
  { title: '计划名称', content: '取一个教研课计划名称' },
  { title: '选择课程', content: '安排成员听谁的课' },
  { title: '选择听课成员', content: '安排教研课听课成员' },
];

class TpkAddResearchPlan extends Component {
  componentWillMount() {
    const planId = this.props.match.params.planId;
    if (planId === undefined) {
      this.data = ['听评课', '教研计划管理', '新增教研计划'];
    } else {
      this.data = ['听评课', '教研计划管理', '编辑教研计划'];
    }
  }
  render() {
    return (
      <div>
        <BreadCrumb data={this.data} />
        <div className="cjy-arp-prgrsBox">
          <ListenTaskStep steps={steps} person={'cjy'} />
        </div>
      </div>
    );
  }
}

export default TpkAddResearchPlan;