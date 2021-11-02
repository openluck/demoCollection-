/*
 * @Author: JudyC 
 * @Date: 2017-09-11 17:56:36 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 16:55:45
 * 教研计划任务情况组件
 */
import React, { Component } from 'react';
import { Icon } from 'antd';
import { SVG } from './../../components/tpk/base.jsx';
import ReactEcharts from 'echarts-for-react';
import { Link } from 'react-router-dom';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import { request } from './../../../util/request_2.12';
// import util from './../../../../js/_x/index.js';
// const Request = util.util.request.request;
import './../../../style/tpk/mj_researchPlan.css';

class ResearchPlan extends Component {
  constructor() {
    super();
    this.state = {
      catalog: [],     //Echarts所需数据
      finished: 0,     //已完成的数量
      unfinished: 0,   //未完成的
      notStart: 0,     //未开始的
      keepOn: 0        //进行中的  
    }
    this.getData = this.getData.bind(this);
  };

  componentDidMount() {
    this.getData();
  }

  /**
   * 获取数据方法
   */
  getData() {
    request('api/web/research_plan_job/catalog', {}, function (ret) {
      // let ret = {
      //   result: true,
      //   data:
      //   null 
      //   // {
      //   //   finished: 0,
      //   //   keepOn: 0,
      //   //   notStart: 0,
      //   //   unfinished: 0
      //   // }
      // }
      if (ret.result) {
        var resData = ret.data ? ret.data : { finished: 0, keepOn: 0, notStart: 0, unfinished: 0 };
        var planNum = [];
        planNum.push({
          value: resData.finished,
          name: '已完成'
        });
        planNum.push({
          value: resData.notStart,
          name: '未开始'
        });
        planNum.push({
          value: resData.unfinished,
          name: '未完成'
        });
        planNum.push({
          value: resData.keepOn,
          name: '进行中'
        });
        this.setState({
          catalog: planNum,
          finished: resData.finished,
          unfinished: resData.unfinished,
          notStart: resData.notStart,
          keepOn: resData.keepOn
        });
      }
    }.bind(this));
  }

  render() {

    return (
      <div className="cjy-rp-researchPlan" >
        <div className="cjy-rp-title cjy-rp-clearfix" style={{position: 'relative'}}>
          <span className="cjy-rp-left">教研计划任务情况</span>
          <Link to='/home/tpk/jyrw/rePlanDe' className="cjy-rp-toDetail">
            {/* <Icon className="cjy-rp-right" type="right" /> */}
            <SVG type='jt'
              style={{ width: '20px', height: '20px', position: 'absolute', top: '2px', right: '15px' }}
              color='#000' />
          </Link>
        </div>
        <div className="cjy-rp-pie">
          <ReactEcharts style={{ height: '170px' }} option={this.getOption(this.state.catalog)} />
        </div>
        <div className="cjy-rp-legend">
          <div className="cjy-rp-mt10">
            <span className="cjy-rp-box cjy-rp-finished"></span>
            &nbsp;已完成&nbsp;&nbsp;
            <div className="cjy-rp-sbox">
              <span className="cjy-rp-num">{this.state.finished}</span>个
            </div>
          </div>
          <div className="cjy-rp-mt10">
            <span className="cjy-rp-box cjy-rp-unstart"></span>
            &nbsp;未开始&nbsp;&nbsp;
            <div className="cjy-rp-sbox">
              <span className="cjy-rp-num">{this.state.notStart}</span>个
            </div>
          </div>
          <div className="cjy-rp-mt10">
            <span className="cjy-rp-box cjy-rp-unfinished"></span>
            &nbsp;未完成&nbsp;&nbsp;
            <div className="cjy-rp-sbox">
              <span className="cjy-rp-num">{this.state.unfinished}</span>个
            </div>
          </div>
          <div className="cjy-rp-mt10">
            <span className="cjy-rp-box cjy-rp-ing"></span>
            &nbsp;进行中&nbsp;&nbsp;
            <div className="cjy-rp-sbox">
              <span className="cjy-rp-num">{this.state.keepOn}</span>个
            </div>
          </div>
        </div>
      </div >
    )
  };

  /**
   * 
   * @param {Object} data Echarts数据
   */
  getOption(data) {
    var Data = [];
    data.map(item => {
      Data.push({
        value: item.value,
        name: item.name,
        labelLine: {
          normal: {
            show: true,
            length: 0.001
          }
        },
        label: {
          normal: {
            show: true
          }
        }
      })
    });
    console.log(Data)
    var option = {
      series: [{
        type: 'pie',
        hoverAnimation: false,
        radius: '80%',
        center: ['50%', '55%'],
        label: { position: 'outside' },
        data: Data
      }],
      color: ['#00cc88', '#ffb728', '#f55450', '#00d2d9']
    };
    option.series[0].data.map(item => {
      if (item.value == 0) {
        item.labelLine.normal.show = false;
        item.label.normal.show = false;
      }
    })
    return option;
  };
};

export default ResearchPlan;