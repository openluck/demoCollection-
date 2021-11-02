/*
 * @Author: mikey.zhaopeng 
 * @Date: 2020-02-10 17:33:03 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-15 13:37:40
 * 评议表--机器人
 */
import React, { Component } from 'react';
import moment from 'moment';
// import _x from "./../../../../../js/_x/index";
// const format = _x.util.date.format
import RobotPng from './../../../../media/picture/robot.png';

export default class Robot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      robotInfo: {},
      robotShow: false
    }
    this.robotClick = this.robotClick.bind(this)
  }
  robotClick() {
    const { robotShow } = this.state;
    if (robotShow) {
      return
    }
    this.props.click()
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.robotShow != prevState.robotShow) {
      return {
        robotInfo: nextProps.robotInfo,
        robotShow: nextProps.robotShow
      }
    }
    return null
  }
  render() {
    const { robotShow } = this.props;
    const { robotInfo } = this.state
    console.log(robotInfo);

    return (
      <div className="yh-robot-wrap">
        <div className="yh-slide-robot" onClick={this.robotClick}>
          <img src={RobotPng} alt="" />
        </div>
        {
          robotShow ?
            <div className="yh-popup-wrap">
              <div className="yh-popup-info">
                <p>{robotInfo.teaState || ''}</p>
                <p>当前教室人数：{robotInfo.stuNum || 0}(应到{robotInfo.shouldNum || 0})</p>
                <p>上次统计时间：{moment(new Date(robotInfo.countTime || new Date())).format('HH:mm:ss')}</p>
                {/* <p>上次统计时间：{format(new Date(robotInfo.countTime || new Date()), "HH:mm:ss")}</p> */}
                <span className="yh-triangle"></span>
              </div>
              <div>
                <img src={RobotPng} alt="" />
              </div>
            </div>
            :
            null
        }
      </div>
    )
  }
}
