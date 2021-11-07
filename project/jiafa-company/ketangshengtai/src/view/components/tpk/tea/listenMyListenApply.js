/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 14:00:10 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-26 09:42:17
 * 申请情况
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import { Row, Col } from 'antd';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import './../../../../style/tpk/mj_listenMyListenApply.css';

class ListenMyListenApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static defaultProps = {
    myListenApply: {
      myListenApply: 0,
      agreeListen: 0,
      disagreeListen: 0
    }
  }
  render() {
    const agreeListen = this.props.agreeListen;
    const disagreeListen = this.props.disagreeListen;
    var mainStyle = {
      width: this.props.haveTask ? '' : ''
      // width: this.props.haveTask ? '' : '375px'
    };
    var pieStyle = {
      margin: this.props.haveTask ? '' : '0px auto 20px'
    }
    var pieMiddleStyle = {
      left: this.props.haveTask ? '67px' : '112px'
    }
    const wait = this.props.myListenApply.myListenApply - this.props.myListenApply.agreeListen - this.props.myListenApply.disagreeListen;
    return (
      <div className="pf-l-card" style={mainStyle}>
        <p className="pf-l-cardtitle">申请情况</p>
        <div className="pf-l-pie" style={pieStyle}>
          <ReactEcharts style={{ width: '160px', height: '160px' }} option={this.getOption()} />
        </div>
        {/* <div className="pf-r-piemiddle pf-l-piemiddle" style={pieMiddleStyle}>
          <p className="pf-r-piemidfont">共申请</p>
          <p><span className="pf-r-bigsize">{this.props.myListenApply.myListenApply}</span>次</p>
        </div> */}
        <div className="pf-l-list">
          <Row gutter={8}>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <div className="pf-l-gutter">待审核</div>
                </Col>
                <Col span={9}>
                  {
                    wait > 1000 ? <div className="pf-l-smallsize pf-l-agree" style={{ color: '#777777' }}>{wait || 0}</div> :
                      <div className="pf-l-bigsize pf-l-agree" style={{ color: '#777777' }}>{wait || 0}</div>
                  }
                </Col>
                <Col span={3}>
                  <div className="pf-l-gutter">次</div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <div className="pf-l-gutter">同意听课</div>
                </Col>
                <Col span={9}>
                  {
                    this.props.myListenApply.agreeListen > 1000 ? <div className="pf-l-smallsize pf-l-agree">{this.props.myListenApply.agreeListen || 0}</div> :
                      <div className="pf-l-bigsize pf-l-agree">{this.props.myListenApply.agreeListen || 0}</div>
                  }
                </Col>
                <Col span={3}>
                  <div className="pf-l-gutter">次</div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <div className="pf-l-gutter">拒绝听课</div>
                </Col>
                <Col span={9}>
                  {
                    this.props.myListenApply.disagreeListen > 1000 ? <div className="pf-l-smallsize pf-l-reject">{this.props.myListenApply.disagreeListen || 0}</div> :
                      <div className="pf-l-bigsize pf-l-reject">{this.props.myListenApply.disagreeListen || 0}</div>
                  }
                </Col>
                <Col span={3}>
                  <div className="pf-l-gutter">次</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  getOption() {
    const _that = this;
    const option = {
      series: [{
        name: '申请情况',
        type: 'pie',
        radius: ['60%', '80%'],
        hoverAnimation: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#00CC88',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 14
            },
            formatter: function (params) {
              const name = params.name;
              let str = name === '共申请' ? name + "\n\n" + '{size|' + (_that.props.myListenApply.myListenApply || 0) + '}' + `次` : '';
              return str;
            },
            rich: {
              size: {
                color: '#00CC88',
                fontSize: 20,
              }
            },
          }
        },
        data: [{
          value: this.props.myListenApply.agreeListen || 0,
          name: '',
        }, {
            value: this.props.myListenApply.myListenApply - this.props.myListenApply.disagreeListen - this.props.myListenApply.agreeListen || 0,
            name: ''
          }, {
          value: this.props.myListenApply.disagreeListen || 0,
          name: '共申请'
        }
        ]
      }],
      color: ['#00cc88','#777777', '#FFB728']
    }
    return option;
  }
}



export default ListenMyListenApply;
