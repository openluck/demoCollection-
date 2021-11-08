/*
 * @Author: yrj
 * @Date: 2020-01-20 14:40:12
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-02-28 14:41:15
 * 进度图组件；
 */
/**
 * @desc 
 * radius: ['55', '65']
 * center: ['50%','50%']
 * color: ['#54baee', '#fff']    
 * data = 60
 * title='总任务进度'
 * @param {arry}   radius         大小圆半径
 * @param {arry}   center         圆点位置
 * @param {arry}   color          第一项为0%处的饼图段颜色；第二项为100%处饼图段颜色
 * @param {number} data           进度值
 */

{/* demo
<CommonPie
radius={["55", "65"]}
center={["50%", "80"]}
color={["#56bbee", "#fbfcfd"]}
data={Math.round(combData.totalProp * 100)}
title='总任务进度'
/> */}
import React, { Component } from "react";
import ReactEcharts from 'echarts-for-react';
import PropTypes from "prop-types";
export default class CommmonPie extends Component {
  getOption = () => {
    let props = this.props;
    const
      option = {
        backgroundColor: '#fff',
        legend: {
          show: false,
          itemGap: 12,
          data: ['01', '02']
        },
        // itemStyle: props.percent ? {} : {
        //   borderWidth: 5, //设置border的宽度有多大
        //   borderColor: '#fff',
        // },
        series: [{
          name: 'Line 1',
          type: 'pie',
          clockWise: true,
          radius: props.radius,
          center: props.center,
          hoverAnimation: false,
          cursor: 'auto',
          data: [{
            value: props.data,
            name: '01',
            label: {
              show: true,
              formatter: props.title ? props.total ? props.total + '\n\n' + props.title : '{c}%' + '\n\n' + props.title : '{c}%',
              position: "center",
              fontSize: 14,
              color: "#313233"
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: props.color[0] // 0% 处的颜色
                  }]
                },

              }
            }
          }, {
            name: '02',
            value: 100 - props.data,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: props.color[1] // 100% 处的颜色
                  }]
                },

              }
            }
          }]
        }]
      };
    return option;
  }
  render() {
    return (

      <ReactEcharts
        option={this.getOption()}
        style={{ height: '100%', width: '100%' }}
      />

    );
  }

}
CommmonPie.propsTypes = {
  radius: PropTypes.arry,
  center: PropTypes.arry,
  color: PropTypes.arry,
  data: PropTypes.number
};