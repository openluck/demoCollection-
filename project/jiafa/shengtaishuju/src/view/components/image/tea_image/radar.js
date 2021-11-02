/*
 * @Author: kyl 
 * @Date: 2020-02-12 13:57:18 
 * @Last Modified by: kyl
 * @Last Modified time: 2020-02-26 15:49:36
 * 雷达图
 * data={
 *    legend:[
        { name: '参与度', max: 100 },
        { name: '专注度', max: 100 },
        { name: '活跃度', max: 100 },
        { name: '疑惑度', max: 100 }
      ],
      data:[20,30,15,6] 数组内四个数据分别对应legend的顺序
 * }
 * 
 */

import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

export default class Radar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const option = this.getOtion();
    // console.log({ nextProps, nextState })
    return option === undefined || _.isEqual(option.series.map(i => i.data), nextProps.data.data.map(i => i));
  }
  getOtion = () => {
    let { color, data } = this.props;
    let option = {
      backgroundColor: "#ffffff",
      color: color || ["#1890ff", "#facc14", "#2fc25b", "#f47a8f"],
      grid: {
        bottom: '20%',
        top: '20%',
        right: '20%',
        left: '20%',
      },
      tooltip: {},
      xAxis: {
        show: false
      },
      yAxis: {
        show: false
      },
      radar: {
        shape: 'circle',
        name: {
          textStyle: {
            color: '#595959',
          }
        },
        radius: 60,
        startAngle: 80,
        splitNumber: 5,
        indicator: data.legend || [],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#f4f4f4'
          }
        },
        // axisLabel: {
        //   color: '#595959'
        // },
        splitLine: {
          show: true,
        },
        areaStyle: {
          show: false
        },
        splitArea: {
          areaStyle: {
            color: '#fff',
          }
        },
      },

      series: [{
        // name: '预算 vs 开销',
        type: 'radar',
        data: [{
          value: data && data.data || [],
          itemStyle: {
            normal: {
              color: '#5FC1F2'
            }
          },
          areaStyle: {
            normal: {
              color: '#E7F6FD'
            }
          }
        }],
        symbol: 'rect',   //折点取消
        tooltip: {        //悬浮框
          // show: false,
          trigger: 'item',
          formatter: (val) => {
            let str = '';
            data.legend.map((it, idx) => {
              str += `${it.name} : ${val.value[idx]}<br/>`
            })
            return str
          },
          padding: [8, 10]
        },
        // itemStyle: {
        //   normal: {
        //     borderWidth: 4,
        //   },
        // },
      }]
    };
    return option;
  }
  render() {
    let { height } = this.props;
    return (
      <ReactEcharts
        onEvents={event}
        option={this.getOtion()}
        style={{ height: height || '100%' }}
      />
    )
  }
}
