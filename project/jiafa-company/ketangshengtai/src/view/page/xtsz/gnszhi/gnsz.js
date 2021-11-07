/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: luolei
 * @Last Modified time: 2020-07-28 15:21:00
 * 功能设置
 */
import React, { Component } from 'react';
import { Input, Tooltip, Switch, Button, message } from 'antd';
import { request } from './../../../../util/request';
import { connect } from 'react-redux';
import { seleChan } from './../../../../redux/mj-Home';
import './../../../../style/xtsz/gnsz.scss';

@connect(state => state.home, { seleChan })

export default class Gnsz extends Component {
  constructor() {
    super()
    this.state = {
      sysName: sessionStorage.getItem('systemname'),
      robit: false,
    }
    this.getPageInfo = this.getPageInfo.bind(this)
    this.savePageInfo = this.savePageInfo.bind(this)
    this.sysNameChan = this.sysNameChan.bind(this)
    this.robitChan = this.robitChan.bind(this)
  }

  componentDidMount() {
    this.getPageInfo();
  }

  /**
   * @desc 初始化小机器人数据
   */
  getPageInfo = async () => {
    request('funcSet/getRobotStatus', {}, res => {
      if (res.code === '200') {
        const data = res.data;
        this.setState({ robit: data === '1' ? true : false })
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
    * @desc 保存页面数据
    */
  savePageInfo = async () => {
    let str = this.state.sysName.replace(/(^\s*)|(\s*$)/g, "");
    this.setState({ sysName: str })
    if(!str){
      message.warning('请先填写产品名称！');
      return;
    }
    let params = {
      isRobot: this.state.robit ? '1' : '0',
      sysName: str
    }
    request('funcSet/editSysInfo', params, res => {
      if (res.code === '200') {
        message.success('保存成功！')
        sessionStorage.setItem('systemname', str);
        this.props.seleChan(str)
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
   * @desc 修改系统名称
   * @param {Object} event 输入框值
   */
  sysNameChan = (event) => {
    const val = event.target.value;
    this.setState({ sysName: val });
  }

  /**
   * @desc 修改机器人状态
   * @param {Boolean} isChecked 状态值
   */
  robitChan = (isChecked) => {
    this.setState({ robit: isChecked })
  }
  render() {
    const { sysName, robit } = this.state
    const text = <div className="mj-gnsz-tipCon">
      <div></div>
      <label>课堂生态</label>
      {/* <label>{this.props.sysName}</label> */}
    </div>

    return <div className="mj-gnsz-container">
      <div className="mj-gnsz-content">
        <label className="mj-gnsz-title">功能设置</label>

        {/* 名称设置 */}
        <div className="mj-gnsz-item">
          <div className="tipLine">
            <span></span>
            <label>名称设置</label>
          </div>
          <div className="mj-gnsz-optionCon">
            <div className="mj-gnsz-inputCon">
              <span>产品名称：</span>
              <Input value={sysName} onChange={(e) => this.sysNameChan(e)} maxLength={20} />
            </div>
            <label className="mj-gnsz-labelCon">
              1.修改名称后 ，系统名称对应变化，若需修改
              <Tooltip title={text} color="#fff">
                <span>系统入口</span>
              </Tooltip>
              名称请联系运维人员； 2.建议名称限制在8个字数内
            </label>
          </div>
        </div>

        {/* 功能设置 */}
        <div className="mj-gnsz-item">
          <div className="tipLine">
            <span></span>
            <label>功能配置</label>
          </div>
          <div className="mj-gnsz-optionCon mj-gnsz-robitOptionCon">
            <div className="mj-gnsz-inputCon">
              <span>智能数据显示开关（小机器人）:</span>
              <Switch checked={robit} onChange={(checked) => this.robitChan(checked)} />
            </div>
            <label className="mj-gnsz-labelCon">
              关闭智能数据显示开关后，所有播放界面的小机器人及分析数据即被隐藏
            </label>
          </div>
        </div>

        <div className="mj-gnsz-btnCon">
          <Button onClick={() => this.savePageInfo()}>应用</Button>
        </div>
      </div>
    </div>
  }
}