/*
 * @Author: MinJ
 * @Date: 2020-05-13 13:37:16 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-04 15:39:58
 * 分页组件
 * total 数据总数
 * pageIndex当前页
 * pageSize 每页条数
 * pageChan 当页码切换时回调(page:当前选中页)
 * len 当前展示条数
 */
import React, { Component } from 'react';
import { Pagination } from 'antd';
import { withRouter } from "react-router-dom";

import './../../style/modalPonent.scss';

class PagePonent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.pageChange = this.pageChange.bind(this);
  }

  pageChange(page) {
    this.props.pageChan(page);
  }

  render() {
    const { total, pageIndex, pageSize, len } = this.props;
    return <div className='mj-pp-content'>
      {/* <div className='mj-pp-txtCon'>当前显示 {len || 0} 条，共 {total} 条</div> */}
      <div className='mj-pp-txtCon'>当前第 {pageIndex || 1} 页，共 {total} 条</div>
      <Pagination
        showSizeChanger={false}
        total={total}
        current={pageIndex}
        pageSize={pageSize}
        onChange={(page) => this.pageChange(page)}
        className="mj-pp-pageCon" />
    </div>
  }
}

export default withRouter(PagePonent);
