/*
 * @Author: JudyC 
 * @Date: 2017-09-12 15:11:12 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-20 15:07:07
 * 设置教研课程计划名
 */
import React, { Component } from 'react';
import {Input} from 'antd';
import './../../../style/tpk/mj_confirmPlanName.css';

class ConfirmPlanName extends Component{
  render(){
    return (
      <div className="cjy-cpn-inputBox">
        <span>教研课程计划名：</span>
        <Input maxLength={20} value={this.props.defaultData} onChange={this.props.handlePage1.bind(this)} />
      </div>
    );
  }
}

export default ConfirmPlanName;