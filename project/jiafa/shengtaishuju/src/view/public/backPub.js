/*
 * @Author: lilu 
 * @Date: 2020-07-30 13:30:36 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 15:59:00
 */
import React, { Component } from 'react'
import SVG from './svg';
import './../../style/ll-backPub.scss';
import { withRouter } from 'react-router-dom';
import { ll_teaStatus } from './../../redux/ll-teaDetail.reducer';
import { ll_ordstatus } from './../../redux/ll-detailData.reducer';
import { ll_sitestatus } from './../../redux/ll-siteRateDetail.reducer';
import { ll_sleepstatus } from './../../redux/ll-sleepRateDetail.reducer';
import { ll_breachstatus } from './../../redux/ll-breachDetail.reducer';
import { ll_analystatus } from './../../redux/ll-analyDetail.reducer';
import { ll_backstatus } from './../../redux/ll-backDetail.reducer';
import { ll_quacourstatus } from './../../redux/ll-quacour.reducer';
import { ll_resInfostatus } from './../../redux/ll-resInfo.reducer';
import { ws_saveGlobalData } from './../../redux/ws-global.reducer';
import { ll_followstatus } from './../../redux/ll-follow.reducer';
import { ll_allotstatus, ll_changeType } from './../../redux/ll-allot.reducer';
import { ll_replystatus } from '../../redux/kyl-reply.reducer';
import { ll_handlestatus } from './../../redux/ll-handle.reducer';
import G from './../../config/g';

import { connect } from "react-redux";


@connect(state => state, {
  ll_teaStatus, ll_ordstatus, ll_sitestatus, ll_sleepstatus, ll_breachstatus, ll_analystatus, ll_replystatus,
  ll_backstatus, ll_quacourstatus, ll_resInfostatus, ws_saveGlobalData, ll_followstatus, ll_allotstatus, ll_handlestatus, ll_changeType
})
class BackPub extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount () {
    console.log("content", this.props.content);
  }
  /**
   * 跳转路由
   * @param {*} value 
   * @param {*} lastIndex 
   * @param {*} key 
   */
  jumpUrl (value, lastIndex, key) {
    // let url = this.props.location.pathname;

    let url = value.url;
    let path = this.props.match.path;

    if (lastIndex !== key) {
      if (path === '/home/det/:pType/play/:claRoomId') {
        switch (url) {
          case '/home/det/ordtea':
            this.props.ll_teaStatus(true);
            break;
          case '/home/det/ordclass':
            this.props.ll_ordstatus(true);
            break;
          case '/home/det/ordsit':
            this.props.ll_sitestatus(true);
            break;
          case '/home/det/ordsle':
            this.props.ll_sleepstatus(true);
            break;
          case '/home/det/ordbre':
            this.props.ll_breachstatus(true);
            break;
          case '/home/det/quaanaly':
            this.props.ll_analystatus(true);
            break;
          case '/home/det/quaback':
            this.props.ll_backstatus(true);
            break;
          case '/home/det/quacour':
            this.props.ll_quacourstatus(true);
            break;
          case '/home/det/info':
            this.props.ll_resInfostatus(true);
            break;
          // case 'home/imp/allot':
          //     this.props.ll_allotstatus(true);
          //     break;
          default:
            break;
        }
      }
      if (path === '/home/imp/follow/:id' || path === '/home/imp/follow/:id/:claRoomId') {
        this.props.ll_followstatus(true)
      }
      if (path === '/home/imp/allot/:collegeId' || path === '/home/imp/allot/:collegeId/:claRoomId') {
        this.props.ll_allotstatus(true)
      }
      if (path === '/home/imp/allot/:collegeId') {
        this.props.ll_changeType('2') //返回详情页时 必定时按开课单位查看维度
      }
      if (path === '/home/imp/handle/:claRoomId') {
        this.props.ll_handlestatus(true)
      }
      if (path === '/home/imp/reply/:claRoomId') {
        this.props.ll_replystatus(true)
      }
      // console.log("valueUrl", value.url);
      sessionStorage.setItem('isHistoryTime', true)
      this.props.history.push(value.url)
      let curSign = G.ISCED_tabArray || []
      let curSignArray = curSign.slice(0, key + 1)
      this.props.ws_saveGlobalData(curSignArray, 'ISCED_tabArray')
    }
  }


  render () {
    let arr = this.props.content || [];
    let lastIndex = arr && arr.length ? arr.length - 1 : 0;
    return (

      <div className="ll-backPub">
        <span onClick={this.jumpUrl.bind(this, arr[lastIndex - 1], lastIndex - 1, lastIndex)}> <SVG type='back' /></span>当前位置：
        {
          arr.map((value, key) => {
            return <div key={key} style={lastIndex === key ? {} : { color: '#343434' }}>
              <span onClick={this.jumpUrl.bind(this, value, lastIndex, key)} style={{ cursor: 'pointer' }}> {`${value.name} `}</span>
              {lastIndex === key ? '' : ' > '}
            </div>
          })
        }
      </div>

    )
  }
}

export default withRouter(BackPub);