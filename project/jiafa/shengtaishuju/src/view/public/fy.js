/**
 * 分页器组件
 * 传4个参数
 * pageSize：每页的条目数,  默认20  number
 * pageIndex: 当前页数  必传  number
 * (pageIndex)=>{接收当前页数} 必传   回调函数  用于请求和接收当前页数   function
 * total: 总数   默认0     number  必传
 */
import React, { Component } from 'react';
import './fy.scss'
import { Input, Pagination } from 'antd';

export default class Fy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inp: '',
      inpPage: this.props.pageIndex     //输入的页数
    }
  }
  componentDidMount() {
  }
  componentDidUpdate() {
    if (this.state.inpPage != this.props.pageIndex) {
      this.setState({ inpPage: this.props.pageIndex });
    }
  }
  // changeInput = (e) => {
  //   // console.log(e.target.value)
  //   if (e.target.value === '') {
  //     this.setState({
  //       inp: ''
  //     })
  //     return false;
  //   }
  //   let isNum = /^[0-9]+$/.test(e.target.value);
  //   // console.log(isNum)
  //   if (isNum) {
  //     this.setState({
  //       inp: Number(e.target.value)
  //     })
  //   } else {
  //     message.warning('请输入纯数字！');
  //     this.setState({
  //       inp: ''
  //     })
  //   }
  // }
  // handleChangePage = () => {
  //   if (this.state.inp === '') {
  //     message.warning('请输入页码！');
  //   } else
  //    if (0 < this.state.inp && this.state.inp <= Math.ceil(this.props.total / this.props.pageSize)) {
  //     if (this.props.jumpPage) {
  //       this.setState({
  //         inpPage: this.state.inp
  //       }, () => {
  //         if (this.props.goTop) {
  //           this.props.goTop.scrollIntoView();
  //         }
  //         this.props.jumpPage(this.state.inpPage);
  //       })
  //     }
  //   } else {
  //     message.warning('输入的内容有误，请重新输入！');
  //   }
  //   this.setState({
  //     inp: '',
  //   })
  // }
  jumpPage(pageNumber) {
    this.setState({
      inpPage: pageNumber,
    }, () => {
      if (this.props.jumpPage) {
        if (this.props.goTop) {
          this.props.goTop.scrollIntoView();
        }
        this.props.jumpPage(this.state.inpPage);
      }
    })
  }

  render() {
    let total = this.props.total || 0,
      pageSize = this.props.pageSize || 20;
    return (
      <div className='mj-clearfix wsFyUp' style={{ height: '75px ', display: total === 0 ? 'none' : 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
        <span className="kyl-kt-pageInfo">每页{pageSize}条数据，共{total}条</span>
        {/* <Input
            className="kyl-kt-jumpZdPage"
            onChange={this.changeInput}
            value={this.state.inp}
            disabled={total < pageSize ? true : false}
            onBlur={() => { this.setState({ inp: '' }) }}
            onPressEnter={this.handleChangePage} /> */}
        <Pagination
          className="kyl-fy"
          // showQuickJumper
          defaultCurrent={1}
          current={this.state.inpPage}
          total={total}
          onChange={this.jumpPage.bind(this)}
          pageSize={pageSize}
        />
      </div>
    )
  }
}