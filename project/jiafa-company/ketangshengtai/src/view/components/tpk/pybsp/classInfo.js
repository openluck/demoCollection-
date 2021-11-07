/*
 * @Author: yh 
 * @Date: 2020-02-11 14:10:25 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-24 09:47:10
 * 视频--课堂基本信息
 */
import React, { Component } from 'react'
import { Button } from 'antd'
import { withRouter } from "react-router-dom";
import  SVG  from "../../../public/public-component-svg";
@withRouter
export default class ClassInfo extends Component {
  constructor(props) {
    super(props)
    this.pageReturn = this.pageReturn.bind(this)
  }
  pageReturn() {
    this.props.history.goBack()
  }
  render() {
    const { baseInfo } = this.props
    // console.log('0000000', baseInfo);

    return (
      <div className="yh-class-wrap">
        <div className="yh-class-left">
          <span title={baseInfo.college || '--'}>
            <SVG type="xy1" />
            {baseInfo.college || '--'}
          </span>
          <span title={baseInfo.secTime || '--'}>
            <SVG type="sjkb" />
            {baseInfo.secTime || '--'}
          </span>
          <span title={baseInfo.teacher || "--"}><SVG type="lskb" />{baseInfo.teacher || "--"}</span>
          <span title={baseInfo.subject || "--"}><SVG type="xk" />{baseInfo.subject || "--"}</span>
          <span title={baseInfo.stuNum || 0}><SVG type="xs" />学生人数：{baseInfo.stuNum || 0}</span>
          <span title={baseInfo.attendRate || 0 + '%'}><SVG type="xueshengchuqin" />出勤率：{baseInfo.attendRate || 0}%</span>
        </div>
        <div className="yh-return-btn">
          <Button onClick={this.pageReturn}>返回</Button>
        </div>
      </div>
    )
  }
}
