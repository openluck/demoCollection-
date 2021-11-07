/*
 * @Author: MinJ
 * @Date: 2017-09-11 18:06:49 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-22 17:30:24
 * 听评课-教师部分-我的教研课
 */
import React, { Component } from 'react';
import ResearchMyTeachInfo from './../../../components/tpk/tea/researchMyTeachInfo';
import ResearchMySearchTeachInfo from './../../../components/tpk/tea/researchMySearchTeachInfo';

export class MyClass extends Component {
  componentDidMount() {
    this.node.scrollIntoView();
  }
  render() {
    return (
      <div ref={node => this.node = node} style={{ width: '100%', height: '100%', padding: '16px 20px' }}>
        {/* 我的教研课 上面的模块 */}
        <ResearchMyTeachInfo></ResearchMyTeachInfo>
        {/* 下面的时间抽模块 */}
        <ResearchMySearchTeachInfo></ResearchMySearchTeachInfo>
      </div>
    );
  }
}