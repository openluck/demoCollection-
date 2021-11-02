/*
 * @Author: Minj 
 * @Date: 2017-09-11 10:27:54 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 15:00:10
 * 听评课-管理员部分-随堂听任务-随堂听开展情况
 */
import React, { Component } from 'react';
import { Radio, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { SVG } from './../../components/tpk/base.jsx';
import { request } from './../../../util/request';
// import util from './../../../../js/_x/index.js';
// const Request = util.util.request.request;

import ListenTopTeas from './../../components/tpk/listenTopTeas.jsx';
import ListenAppliCom from './../../components/tpk/listenAppliCom.jsx';
// import TpkManaOverListenerInfo from './../../../page/admin/tpk/sttrw/tpkManaOverListenerInfo';

import './../../../style/tpk/mj_listenTopTotal.css';

class ListenTopTotal extends Component {
  constructor() {
    super();
    this.state = {
      timeType: '1',    //时间选择
      applyCnt: 0,     //申请次数
      listenCnt: 0,    //听课次数
      unListen: 0,     //申请未听
      applySort: [],   //申请次数最多
      listenSort: [],  //听课数最多
      hotSort: [],      //热度最高的老师
      loading: true
    };

    this.requestData = this.requestData.bind(this);
    this.changeType = this.changeType.bind(this);
  };

  // 开展情况  数据请求
  requestData(dateType) {
    request('api/web/listen_in_class/overview', { 'dateType': dateType }, function (ret) {
      if (ret.result) {
        const data = ret.data;
        // const data = {
        //   applyCnt: 2,
        //   applySort: [
        //     { teacherId: "2018051", teacherName: "金毛", cnt: 2 }
        //   ],
        //   hotSort: [
        //     { teacherId: "2018015", teacherName: "王四", cnt: 2 }
        //   ], listenCnt: 0,
        //   listenSort: [],
        //   listenUnFinishedCnt: 2
        // }
        var applySort = data.applySort;
        var listenSort = data.listenSort;
        var hotSort = data.hotSort;
        // 申请次数最多补加
        if (data.applySort.length < 3) {
          for (var i = 0, len = 3 - data.applySort.length; i < len; i++) {
            applySort.push({
              cnt: '',
              teacherId: '',
              teacherName: ''
            });
          }
        }
        // 听课数最多补加
        if (data.listenSort.length < 3) {
          for (var i = 0, len = 3 - data.listenSort.length; i < len; i++) {
            listenSort.push({
              cnt: '',
              teacherId: '',
              teacherName: ''
            });
          }
        }
        // 热度最高补加
        if (data.hotSort.length < 3) {
          for (var i = 0, len = 3 - data.hotSort.length; i < len; i++) {
            hotSort.push({
              cnt: '',
              teacherId: '',
              teacherName: ''
            });
          }
        }

        this.setState({
          data: data,
          applyCnt: data.applyCnt,
          listenCnt: data.listenCnt,
          unListen: data.listenUnFinishedCnt,
          applySort: applySort,
          listenSort: listenSort,
          hotSort: hotSort,
          loading: false
        })
      }else{
        this.setState({
          loading: false
        })
      }
    }.bind(this));
  }
  componentDidMount() {
    this.requestData(this.state.timeType);
  };
  // 时间切换
  changeType(e) {
    this.setState({
      timeType: e.target.value,
      loading: true
    });
    this.requestData(e.target.value);
  };

  render() {
    return (
      <div className='mj-ltt-topCon'>
        <div className='mj-ltt-tit'>
          <span>随堂听开展情况</span>
          <Link to='/home/tpk/sttrw/TpkManaOverListenerInfo'>
            <SVG type='jt' />
          </Link>
        </div>
        <div className='mj-ltt-choice'>
          <Radio.Group className="mj-ltt-RadioGroup" defaultValue={this.state.timeType} onChange={this.changeType}>
            <Radio.Button value='1'>本周</Radio.Button>
            <Radio.Button value='2'>本月</Radio.Button>
            <Radio.Button value='3'>本学期</Radio.Button>
          </Radio.Group>
        </div>
        {
          this.state.loading
            ?
            <div className='mj-ltt-loading'><Spin /></div>
            :
            (
              <div className='mj-clearfix' style={{position: 'relative'}}>
                <ListenAppliCom apply={this.state.applyCnt} listen={this.state.listenCnt} noListen={this.state.unListen}></ListenAppliCom>
                <ListenTopTeas applySort={this.state.applySort} listenSort={this.state.listenSort} hotSort={this.state.hotSort}></ListenTopTeas>
              </div>
            )
        }
      </div>
    );
  }
}
export default ListenTopTotal;