import React, { Component } from 'react'
import '../../../../style/kyl_tea_comp.scss';
import ReactEcharts from 'echarts-for-react';
import { Progress, Divider } from 'antd';


export default class Tea_progress extends Component {
  getOtion = () => {
    var option = {
      backgroundColor: '#fff',
      title: {
        show: false
      },
      grid: {
        bottom: '5%',
      },
      series: [{
        type: "gauge",
        min: 0,
        max: 100,
        radius: "80%",
        center: ["50%", "50%"],
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            width: 10,
            color: [
              [0.75, '#1990ff'],
              [1, ' #f0f2f5'],
            ]
          }
        },
        axisTick: {
          show: true,
          length: 15,
          splitNumber: 1,
          lineStyle: {
            width: 2,
            color: 'auto'
          }

        },
        splitLine: {
          show: false,
          length: 15,
          splitNumber: 30,
          interval: 5,
          lineStyle: {
            width: 2,
            color: 'auto'
          }
        },
        pointer: {
          show: true,
          width: "1",
          length: '50%'
        },
        detail: {
          formatter: '{value}%',
          offsetCenter: ['0', '80%'],
          textStyle: {
            fontSize: 24,
            color: "#000"
          }
        },
        itemStyle: {
          color: "#1990ff",
          borderColor: "#1990ff",
          borderWidth: 3
        },
        data: [{ value: 75 }]
      },
      {//指针外环
        "type": 'pie',
        "hoverAnimation": false,
        "legendHoverLink": false,
        "radius": ['4%', '6%'],
        "z": 10,
        "label": {
          "normal": {
            "show": false
          }
        },
        "labelLine": {
          "normal": {
            "show": false
          }
        },
        "data": [{
          "value": 100,
          itemStyle: {
            normal: {
              color: "#1990ff"
            }
          }
        }]
      },
      {//指针内环
        "type": 'pie',
        "hoverAnimation": false,
        "legendHoverLink": false,
        "radius": ['0%', '4%'],
        "z": 10,
        "label": {
          "normal": {
            "show": false
          }
        },
        "labelLine": {
          "normal": {
            "show": false
          }
        },
        "data": [{
          "value": 100,
          itemStyle: {
            normal: {
              color: "#fff"
            }
          }
        }]
      }]
    };
    return option;
  }
  render() {
    return (
      <div style={{ textAlign: 'center', height: '270px', background: '#fff' }}>
        <ReactEcharts
          onEvents={event}
          option={this.getOtion()}
          style={{ height: '200px' }}
        />
        <div>已完成 20人次</div>
        <div>总任务量 100人次</div>
      </div>

    )
  }
}
