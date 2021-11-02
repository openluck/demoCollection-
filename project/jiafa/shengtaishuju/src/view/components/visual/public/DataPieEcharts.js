/*
 * @Author: yrj
 * @Date: 2020-01-20 14:40:12
 * @Last Modified by: yrj
 * @Last Modified time: 2020-02-27 13:48:56
 * 饼图组件
 */

/**
 * @desc
 *
 * center: ['50%','50%']
 * color: ['#54baee', '#fff']
 * data = 60
 *
 * @param {arry}   radius         大小圆半径
 * @param {arry}   center         圆点位置
 * @param {arry}   color          第一项为0%处的饼图段颜色；第二项为100%处饼图段颜色
 * @param {number} data           进度值
 */

/* demo
<DataPieEcharts

center={["50%", "80"]}
color={["#56bbee", "#fbfcfd"]}
data={60}
radius_border=["63", "65"] //边线
radius={["50", "65"]} //环
bgColorb={#000} //背景
/> */

import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import PropTypes from "prop-types";

import _x from "./../../../../util/file";
const clientSizeChange=_x.clientSizeChange;

export default class DataPieEcharts extends Component {
  getOption = () => {
    let props = this.props;
    const option = {
      backgroundColor: props.bgColorb || "#fff",
      legend: {
        show: false,
        itemGap: 12,
        data: ["00", "01", "02"]
      },

      series: [
        {
          name: "LineBorder",
          type: "pie",
          radius: props.radius_border||[63*clientSizeChange(), 65*clientSizeChange()],
          center: props.center,
          hoverAnimation: false,
          data: [
            {
              value: 30,
              name: "",

              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: {
                    // 完成的圆环的颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: props.color[0] // 0% 处的颜色
                      }
                    ]
                  }
                }
              }
            }
          ]
        },
        {
          name: "Line 1",
          type: "pie",
          clockWise: true,
          radius:props.radius|| [50*clientSizeChange(), 65*clientSizeChange()],
          center: props.center,
          hoverAnimation: false,
          label: {
            show: true,
            formatter: function(params) {
              return "{first|" + params.value + "}" + "{sec|%}";
            },
            position: "center",

            rich: {
              first: {
                fontSize: 26*clientSizeChange(),
                align: "center",
                color: "rgb(159,210,227)",
                fontWeight: "bold"
              },
              sec: {
                fontSize: 12*clientSizeChange(),
                align: "center",
                width: 15*clientSizeChange(),
                color: "rgb(159,210,227)",
                padding: [0, 0, 7, 0]
              }
            }
          },

          data: [
            {
              value: props.data,
              name: "",

              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: {
                    // 完成的圆环的颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: props.color[0] // 0% 处的颜色
                      }
                    ]
                  }
                }
              }
            },
            {
              name: "02",
              value: 100 - props.data,
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: {
                    // 完成的圆环的颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: props.color[1] // 100% 处的颜色
                      }
                    ]
                  }
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
DataPieEcharts.propsTypes = {
  radius: PropTypes.arry,
  center: PropTypes.arry,
  color: PropTypes.arry,
  data: PropTypes.number
};
