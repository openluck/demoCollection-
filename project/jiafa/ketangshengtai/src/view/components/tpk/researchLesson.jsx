/*
 * @Author: JudyC 
 * @Date: 2017-09-11 17:57:39 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 16:55:59
 *  教研课任务情况组件
 */
import React, { Component } from 'react';
import { Icon, Radio } from 'antd';
import { SVG } from './../../components/tpk/base.jsx';
import ReactEcharts from 'echarts-for-react';
import { Link } from 'react-router-dom';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import { request } from './../../../util/request_2.12';
// import util from './../../../../js/_x/index.js';
// const Request = util.util.request.request;
import './../../../style/tpk/mj_researchLesson.css';

class ResearchLesson extends Component {
  constructor() {
    super();
    this.state = {
      catalog: [],//Echarts数据
      finished: 0,//已完成的数量
      unfinished: 0,//未完成的
      notStart: 0,//未开始的
      canClick: false//本周本月本学期是否可点击
    };
    this.timeType = '1';  //1本周，2 本月，3学期
    // this.canClick = true; //本周本月本学期是否可点击
    this.getData = this.getData.bind(this);
  };

  componentDidMount() {
    this.getData();
  };

  /**
   * 获取数据
   */
  getData() {
    this.setState({
      canClick: true
    });
    var req = {
      dateType: this.timeType
    };
    request('api/web/research_plan_job/task/catalog', req, function (ret) {
      // let ret = {
      //   result: true,
      //   data: { notStart: 0, finished: 0, unfinished: 0 }
      // }
      this.setState({
        canClick: false
      });
      if (ret.result) {
        var resData = ret.data ? ret.data : { notStart: 0, finished: 0, unfinished: 0 };
        //重新构造数组
        var lessonNum = [];
        lessonNum.push({
          value: resData.finished,
          name: '已完成'
        });
        lessonNum.push({
          value: resData.notStart,
          name: '未开始'
        });
        lessonNum.push({
          value: resData.unfinished,
          name: '未完成'
        });
        this.setState({
          catalog: lessonNum,
          finished: resData.finished,
          notStart: resData.notStart,
          unfinished: resData.unfinished
        });
      }
    }.bind(this));
  };

  render() {
    return (
      <div className="cjy-rl-researchLesson">
        <div className="cjy-rl-title cjy-rl-clearfix" style={{ position: 'relative' }}>
          <span className="cjy-rl-left">教研课任务情况</span>
          <Link to='/home/tpk/jyrw/reLessonDe' className="cjy-rl-toDetail">
            {/* <Icon className="cjy-rl-right" type="right" /> */}
            <SVG type='jt'
              style={{ width: '20px', height: '20px', position: 'absolute', top: '2px', right: '15px' }}
              color='#000' />
          </Link>
        </div>
        <Radio.Group className="cjy-rl-RadioGroup" value={this.timeType} onChange={this.changeType}>
          <Radio.Button value="1" disabled={this.state.canClick}>本周</Radio.Button>
          <Radio.Button value="2" disabled={this.state.canClick}>本月</Radio.Button>
          <Radio.Button value="3" disabled={this.state.canClick}>本学期</Radio.Button>
        </Radio.Group>
        <div className="cjy-rl-pie">
          <ReactEcharts style={{ height: '170px' }} option={this.getOption(this.state.catalog)} />
        </div>
        <div className="cjy-rl-legend">
          <div className="cjy-rl-mt10"><span className="cjy-rl-box cjy-rl-finished"></span>&nbsp;已完成&nbsp;&nbsp;<div className="cjy-rl-sbox"><span className="cjy-rl-num">{this.state.finished}</span>个</div></div>
          <div className="cjy-rl-mt10"><span className="cjy-rl-box cjy-rl-unstart"></span>&nbsp;未开始&nbsp;&nbsp;<div className="cjy-rl-sbox"><span className="cjy-rl-num">{this.state.notStart}</span>个</div></div>
          <div className="cjy-rl-mt10"><span className="cjy-rl-box cjy-rl-unfinished"></span>&nbsp;未完成&nbsp;&nbsp;<div className="cjy-rl-sbox"><span className="cjy-rl-num">{this.state.unfinished}</span>个</div></div>
        </div>
      </div>
    );
  }

  /**
   * 本周本月本学期按钮切换
   */
  changeType = (e) => {
    this.timeType = e.target.value;
    this.getData();
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
            length: 0.001,
          }
        },
        label: {
          normal: {
            show: true
          }
        }
      })
    });
    const option = {
      series: [
        {
          type: 'pie',
          hoverAnimation: false,
          // stillShowZeroSum:false,
          radius: '80%',
          center: ['50%', '55%'],
          data: Data,
        }
      ],
      color: ['#00cc88', '#ffb728', '#f55450']
    };
    option.series[0].data.map(item => {
      if (item.value == 0) {
        item.labelLine.normal.show = false;
        item.label.normal.show = false;
      }
    })
    return option;
  };
}

export default ResearchLesson;