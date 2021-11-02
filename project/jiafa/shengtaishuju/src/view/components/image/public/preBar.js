/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: lj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 公共进度图组件
 */

/**
 * @desc 
 *            data: 50
 *            rank: 1
 *            name: 50

 * @param {number} data  进度值
 * @param {number} rank  排名
 * @param {number} name  学科名称
 * 
 */
import React, { Component } from "react";
import ReactEcharts from 'echarts-for-react';
import './../../../../style/lj_preBar.scss'
export default class PreBar extends Component {
  render() {
    return (
      <div className='lj_bar' style={{'height':'20px','width':'100%'}}>
        <span className={this.props.rank == 1 || this.props.rank == 2 || this.props.rank == 3 ? 'top' : 'bottom'}>{this.props.rank}</span>
        <span className='pre_name' title={this.props.name}>{this.props.name}</span>
        <div className="progress">
          <div className="progress-inner">
            <div className="progress-bg" style={{'width':`${this.props.data}%`}}>
              
            </div>
          </div>
          <div className="progress-s" 
          style={{
            'left':`${this.props.data}%`,
            'display':this.props.data == 0 || 
            this.props.data >= 100 ? 'none' : 'block'}}>
            </div>
          {/* <ReactEcharts
            option={this.getOption()}
            style={{ height: '100%', width: '100%' }}
          /> */}
        </div>
          <span className='rate'>{this.props.data}{this.props.type == 'kthd' ? '次' : '%'}</span>
      </div>

    );
  }
}
