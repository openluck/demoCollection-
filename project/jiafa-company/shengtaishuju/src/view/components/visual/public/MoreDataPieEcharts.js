/*
 * @Author: yrj
 * @Date: 2020-01-20 14:40:12
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-21 16:52:08
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
<MoreDataPieEcharts

center={["50%", "80"]}
color={["#56bbee", "transparent"]}
data={60}
pTop={"20%"}
changeProp={2} //改变的prop
up={true} //箭头朝向以及颜色
/> */

import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import PropTypes from "prop-types";
import SVG from "./../../../public/svg";
import "./../../../../style/yrj_comEcharts.scss";

import _x from "./../../../../util/file";
const clientSizeChange = _x.clientSizeChange;
export default class MoreDataPieEcharts extends Component {
  getOption = () => {
    let props = this.props;
    const option = {
      // backgroundColor: "#fff",
      legend: {
        show: false,
        itemGap: 12,
        data: ["00", "01", "02"]
      },

      series: [
        {
          name: "LineBorder",
          type: "pie",
          radius: [44.5 * clientSizeChange(), 46 * clientSizeChange()],
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
          radius: [34 * clientSizeChange(), 46 * clientSizeChange()],
          center: props.center,
          hoverAnimation: false,
          label: {
            show: false,
            formatter: function(params) {
              return "{first|" + params.value + "}" + "{sec|%}";
            },
            position: "center",
            rich: {
              first: {
                fontSize: 26 * clientSizeChange(),
                align: "center",
                color: "rgb(159,210,227)",
                fontWeight: "bold"
              },
              sec: {
                fontSize: 12 * clientSizeChange(),
                align: "center",
                width: 15 * clientSizeChange(),
                color: "rgb(159,210,227)",
                padding: [0, 0, 7, 0]
              }
            }
          },

          data: [
            {
              value: props.data>100?100:props.data,
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
              value: 100 - (props.data>100?100:props.data),
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
      <div className="yrj_echart_pos">
        <ReactEcharts
          option={this.getOption()}
          style={{ height: "100%", width: "100%" }}
        />
        <div className="yrj_echarts_con">
          <p>
            <span>{this.props.data}</span>
            <span>%</span>
          </p>
          {this.props.up!=='0' ? (
            <p>
              <span>
                <SVG type={this.props.up === "1" ? "imgUp" : this.props.up === "2"?"imgDown":''} />
              </span>
              <span>
                {this.props.changeProp ? this.props.changeProp + "%" : "0%"}
              </span>
            </p>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    );
  }
}
MoreDataPieEcharts.propsTypes = {
  radius: PropTypes.arry,
  center: PropTypes.arry,
  color: PropTypes.arry,
  data: PropTypes.number
};
