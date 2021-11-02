/*
 * @Author: yrj
 * @Date: 2020-01-22 16:07:48
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-18 10:02:10
 */


import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import PropTypes from "prop-types";
import _x from '../../../../util/file';

const clientSizeChange = _x.clientSizeChange;

class ColorsPieEcharts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null,
      subtext: null
    }
  }

  getOption() {
    let { color, radius, scaleData } = this.props;

    let option = {
      // tooltip: {
      //     trigger: 'item',
      //     formatter: '{a} <br/>{b}: {c} ({d}%)'
      // },
      // legend: {
      //     orient: 'vertical',
      //     left: 10,
      //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      // },

      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: radius,
          avoidLabelOverlap: false,
          hoverOffset: 3,
          itemStyle: { // 此配置
            normal: {
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          },
          label: {
            show: false,
            position: 'center'
          },
          // emphasis: {
          //     label: {
          //         show: true,
          //         fontSize: '30',
          //         fontWeight: 'bold'
          //     }
          // },
          labelLine: {
            show: false
          },
          data: [
            { value: scaleData[0] || 0, name: '直接访问', itemStyle: { normal: { color: '#ff4c4c' } } },
            { value: scaleData[1] || 0, name: '邮件营销', itemStyle: { normal: { color: '#5ab1ee' } } }

          ]
        }
      ]
    };
    return option;
  }
  componentDidMount() {
    this.setState({
      // myChart:this.echarts_react.getEchartsInstance()
    })
  }
  onMouseover = (params) => {
    this.setState({
      text: params.data.value,
      subtext: params.data.name + "(" + this.props.title + ")"
    })
  }
  onMouseout = (params) => {
    this.setState({
      text: null,
      subtext: null
    })
  }
  onEvent = {
    "mouseover": this.onMouseover,
    "mouseout": this.onMouseout,
  }
  render() {
    return (
      <ReactEcharts
        style={{ height: "100%", width: "100%" }}
        option={this.getOption()}
      // ref="ReactEcharts"
      // onEvents={this.onEvent}
      />
    );
  }
}

export default ColorsPieEcharts;

ColorsPieEcharts.propsTypes = {
  radius: PropTypes.arry,
  center: PropTypes.arry,
  color: PropTypes.arry,
  data: PropTypes.number
};
