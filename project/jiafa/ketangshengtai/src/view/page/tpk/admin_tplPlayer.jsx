/*
 * @Author: JC.Liu 
 * @Date: 2019-05-05 10:40:33 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-19 11:24:05
 * 管理员听评课 播放页
 */

import React, { Component } from 'react'
import TpkPlayerCom from './../../components/tpk/playerComp.jsx';

export default class Admin_tplPlayer extends Component {
  render() {
    return (
      <div style={{padding: '20px'}}>
        <TpkPlayerCom />
      </div>
    )
  }
}
