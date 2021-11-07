/*
 * @Author: kyl 
 * @Date: 2020-02-09 16:27:43 
 * @Last Modified by: hf
 * @Last Modified time: 2021-03-24 13:58:08
 * barData = {   //数据   Object
    xData:[],    //x轴数据  Array
    yData:[]     //y轴数据  Array
  }
 */

import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react';
import '../../../../style/tea_btm_cont.scss';
export default class Tea_btm_cont extends Component {
  constructor(props) {
    super(props)
    this.$option = null
  }
  getOtion = () => {
    // console.log(this.props.barData)
    let barData = this.props.barData;
    let barType = this.props.barType;
    let max = 100
    if (barData && barData.yData && barData.yData.length) {
      max = Math.max(...barData.yData)
      if (max < 100) {
        max = 100
      } else {
        max = Math.ceil(max / 5) * 5
      }
    }
    // let screenW=window.screen.width;
    let screenW = document.body.clientWidth
    let barCount = 9;
    if (screenW >= 1920) {
      barCount = 15
    } else if (screenW >= 1660) {
      barCount = 9
    } else if (screenW >= 1366) {
      barCount = 9
    }
    let dataSet = [{
      // id: 'dataZoomX',
      show: true, //是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
      type: 'slider', //slider表示有滑动块的，inside表示内置的 
      backgroundColor: "#eef1f1", //组件的背景颜色
      borderColor: "#eef1f1",
      showDataShadow: false,
      fillerColor: "#98ccf4", //选中范围的填充颜色。
      height: 6,
      // handleIcon: false,
      handleSize: '100%',
      handleStyle: {
        opacity: 0
      },
      textStyle: false,
      // filterMode: barData && barData.xData.length > 7 ? 'filter' : 'none',
      start: 0,
      // end: barData && barData.xData.length <= 12 ? 25 : barData && barData.xData.length <= 25 ? 35  :barData && barData.xData.length <= 150 ? 20 : barData && barData.xData.length <= 180 ? 5 : 100,
      end: barData && barData.xData.length <= barCount ? 100 : parseInt(100 * barCount / (barData.xData.length)),
      bottom: "5%", //组件离容器下侧的距离,'20%'
    }]
    let option = {
      color: ['#1890FF'],
      grid: {
        top: '12%',
        left: '3%',
        right: '0',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.props.barData.xData,
        axisLine: {
          lineStyle: {
            color: '#c3ccd9',
          }
        },
        axisLabel: {
          color: '#595959',
          margin: 14,
          interval: 0,
          formatter: function (value) {
            let str = "";
            let num = 6; //每行显示字数 
            let valLength = value.length; //该项x轴字数  
            let rowNum = Math.ceil(valLength / num); // 行数  

            if (rowNum > 1) {
              for (let i = 0; i < rowNum; i++) {
                let temp = "";
                let start = i * num;
                let end = start + num;

                temp = value.substring(start, end) + "\n";
                str += temp;
              }
              return str;
            } else {
              return value;
            }
          }
        },
        axisTick: {

          interval: 0
          // alignWithLabel: true
        },
      },
      yAxis: {
        type: 'value',
        name: barType === "hd" ? "次/课程" : "",
        axisLabel: {
          show: true,
          color: '#b8b8b8',
          formatter: (value) => {
            if (barType === "hd") {
              return value === 0 ? value : `${value}`
            } else {
              return value === 0 ? value : `${value}%`
            }

          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        interval: max / 5,
        max: max,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: [14, 16],
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: 'rgba(16,135,251,.1)'
          }
        },
        formatter: (value) => {
          // console.log(value)
          let html
          if (barType === "hd") {
            html = `<div style={{position:'relative'}}>
            <span>${value[0].name}： ${value[0].value}次/课程</span></div> `
          } else {
            html = `<div style={{position:'relative'}}>
            <span>${value[0].name}： ${value[0].value}%</span></div> `
          }

          return html

        }
      },
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '15%',
          data: barData && barData.yData ? barData.yData : [],
          barWidth: 25,
          barGap: 1
        }
      ],
      //区域缩放
      dataZoom: barData && barData.xData.length > 7 ? dataSet : [],
    }
    this.$option = option;
    return option;
  }

  click = (e) => {
    // console.log(e)
    this.props.clickBar(e)
  }

  suitResize = () => {
    let myChart = this.echarts && this.echarts.getEchartsInstance();
    let screenW = document.body.clientWidth
    let barCount = 9;
    if (screenW >= 1920) {
      barCount = 14
    } else if (screenW >= 1660) {
      barCount = 9
    } else if (screenW >= 1366) {
      barCount = 9
    }
    let barData = this.props.barData;
    let end = barData && barData.xData.length <= barCount ? 100 : parseInt(100 * barCount / (barData.xData.length))
    if (this.$option.dataZoom && this.$option.dataZoom.length) {
      this.$option.dataZoom[0].end = end;
    }
    myChart && myChart.setOption(this.$option);
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.suitResize()
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.suitResize()
    })
  }

  render() {
    let { barData } = this.props;
    const event = { 'click': this.props.clickBar ? this.click : '' }
    return (
      <ReactEcharts
        onEvents={event}
        ref={(e) => { this.echarts = e }}
        option={this.getOtion()}
        style={{ height: this.props.height || '270px', width: '100%' }}
      />
    )
  }
}
