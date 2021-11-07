/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: luolei
 * @Last Modified time: 2020-07-28 15:21:00
 * 功能设置
 */
import React, { useEffect, useState } from 'react';
import { Input, Tooltip, Switch, Button, message } from 'antd';
import { request } from './../../../../util/request';

import './../../../../style/xtsz/gnsz.scss';
export default function Gnsz() {
  const [sysName, setSysName] = useState(sessionStorage.getItem('systemname')); // 系统名称
  const [robit, setRobit] = useState(false);//机器人开启状态

  const text = <div className="mj-gnsz-tipCon">
    <div></div>
    <label>{sessionStorage.getItem('systemname') || '课堂生态'}</label>
  </div>

  useEffect(() => {
    getPageInfo();
  }, [])

  /**
   * @desc 初始化小机器人数据
   */
  const getPageInfo = async () => {
    request('funcSet/getRobotStatus', {}, res => {
      if (res.code === '200') {
        const data = res.data;
        setRobit(data === '1' ? true : false);
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
    * @desc 保存页面数据
    */
  const savePageInfo = async () => {
    let str = sysName.replace(/(^\s*)|(\s*$)/g, "");
    setSysName(str);
    let params = {
      isRobot: robit ? '1' : '0',
      sysName:str
    }
    request('funcSet/editSysInfo', params, res => {
      if(res.code === '200'){
        message.success('保存成功！')
        sessionStorage.setItem('systemname', str);
        // window.location.reload()
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
   * @desc 修改系统名称
   * @param {Object} event 输入框值
   */
  const sysNameChan = (event) => {
    const val = event.target.value;
    setSysName(val);
  }

  /**
   * @desc 修改机器人状态
   * @param {Boolean} isChecked 状态值
   */
  const robitChan = (isChecked) => {
    setRobit(isChecked)
  }

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
            <Input value={sysName} onChange={(e) => sysNameChan(e)} />
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
            <Switch checked={robit} onChange={(checked) => robitChan(checked)} />
          </div>
          <label className="mj-gnsz-labelCon">
            关闭智能数据显示开关后，所有播放界面的小机器人及分析数据即被隐藏
          </label>
        </div>
      </div>

      <div className="mj-gnsz-btnCon">
        <Button onClick={() => savePageInfo()}>应用</Button>
      </div>
    </div>
  </div>
}