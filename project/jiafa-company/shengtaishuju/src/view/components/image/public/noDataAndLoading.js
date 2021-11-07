/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: lj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 无数据及loading组件
 */
import React, { Component } from "react";
import './../../../../style/lj_noData.scss';
import imgURL from './../../../../media/picture/img_noData.png';
import { Spin } from 'antd';
export default class NoDataAndLoading extends Component {
  render() {
    return (
      <div className='lj_noData'>
          {
              !this.props.loading ? 
              <img src={imgURL } />
              :<Spin />
          }
      </div>
    );
  }
}
