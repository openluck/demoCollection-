/*
 * @Author: JudyC 
 * @Date: 2017-09-11 17:31:34 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-19 16:10:11
 * 教研任务页，引入教研计划任务情况、教研课任务情况、教研员任务情况三个板块
 */
import React, { Component } from 'react';
import ResearchPlan from './../../../components/tpk/researchPlan.jsx';
import ResearchLesson from './../../../components/tpk/researchLesson.jsx';
import Researchers from './../../../components/tpk/researchers.jsx';
// import createBrowserHistory from 'history/createBrowserHistory';

export class TpkTeaTask extends Component {
  render() {
    return (
      <div style={{width: '100%', height: '100%', padding: '16px 20px'}}>
        <ResearchPlan className="cjy-rp-researchPlan" />
        <ResearchLesson className="cjy-rp-researchLesson" />
        <Researchers className="cjy-rp-researchers" />
      </div>
    );
  }
}