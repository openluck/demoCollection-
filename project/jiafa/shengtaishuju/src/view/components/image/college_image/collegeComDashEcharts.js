/*
 * @Author: yrj
 * @Date: 2020-01-20 14:40:12
 * @Last Modified by: yrj
 * @Last Modified time: 2020-01-21 11:50:04
 * 画像-仪表盘
 */


{
  /* demo
  <CollegeComDashEcharts/> 
  */
}

import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import PropTypes from "prop-types";
import _x from "./../../../../util/file";
const clientSizeChange=_x.clientSizeChange;
export default class CollegeComDashEcharts extends Component {
  getOption = () => {
    let props = this.props;
    const option = {
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} %"
      },
      backgroundColor: "#fff",
      series: [
        {
          name: "仪表盘",
          type: "gauge",
          data: [
            {
              value: props.data,
              name: "数据总量"
            }
          ],
          radius: "68%",
          center: ["50%", "50%"],
          min: 0,
          max: 100,
          splitNumber: 2,
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              width: 10*clientSizeChange(),
              color: [
                [props.data/100, props.pieColor],
                [1, "#eee"]
              ]
            }
          },
          axisTick: {
            // 坐标轴小标记
            length: 13*clientSizeChange(), // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: "auto"
            }
          },
          splitLine: {
            // 分隔线
            length: 13*clientSizeChange(), // 属性length控制线长
            lineStyle: {
              // 属性lineStyle（详见lineStyle）控制线条样式
              color: "auto"
            }
          },
          axisLabel: {
            show: false,
            color: props.pieColor
          },
          detail: {
            formatter: "{value}%",
            fontWeight: "20",
            fontSize: 20*clientSizeChange(),
            color: props.pieColor,
            offsetCenter: [0, "85%"]
          },
          pointer: {
            width: 1.5, // 指针大小
            color:props.pieColor
          }
        },
        {
          //指针外环
          type: "pie",
          hoverAnimation: false,
          legendHoverLink: false,
          radius: ["4%", "5%"],
          center: ["50%", "50%"],
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: 100,
              itemStyle: {
                normal: {
                  color:  props.pieColor
                }
              }
            }
          ]
        },

        {
          //指针内环
          type: "pie",
          hoverAnimation: false,
          legendHoverLink: false,
          radius: ["0%", "4%"],
          center: ["50%", "50%"],
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: 100,
              itemStyle: {
                normal: {
                  color: "#fff"
                }
              }
            }
          ]
        }
      ]
    };
    return option;
  };
  render() {
    return (
      <ReactEcharts
        option={this.getOption()}
        style={{ height: "100%", width: "100%" }}
      />
    );
  }
}
CollegeComDashEcharts.propsTypes = {
  radius: PropTypes.arry,
  center: PropTypes.arry,
  color: PropTypes.arry,
  data: PropTypes.number
};
