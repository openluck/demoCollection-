/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 13:54:10 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-20 16:23:08
 * 公共组件-面包屑
 * 在包含此面包屑的主体页面传入data数组：<BreadCrumb data={data} back={'/lisTasks'}></BreadCrumb> 
 * 其中data比如：const data = ['听评课','随堂任务听','听课员详情'];
 * back 为需要返回的页面路径
 */
import React, { Component } from 'react';
import { Breadcrumb, Button } from 'antd';

import './../../style/breadCrumb.scss';

class BreadCrumb extends Component {
  render() {
    return (
      <div className={this.props.ver === 'tpk' ? 'mj-bc-breadCrumb mj-breadCrumb' : 'mj-bc-breadCrumb'}>
        {this.props.ver === 'tpk' ? null : <Button type="primary" onClick={() => this.goBack()}>返回</Button>}
        {this.props.ver === 'tpk' ? null : <span className='mj-bc-tit'>当前位置：</span>}
        <div className='mj-bc-bread'>
          <Breadcrumb separator=">">
            {
              this.props.data.map((item, index) => (
                <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
              ))
            }
          </Breadcrumb>
        </div>
      </div>
    );
  }
  goBack = () => {
    window.history.back(-1);
  }
}

export default BreadCrumb;
