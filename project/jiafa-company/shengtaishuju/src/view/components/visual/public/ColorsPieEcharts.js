/*
 * @Author: yrj
 * @Date: 2020-01-22 16:07:48
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-17 10:33:39
 * 可视化中心-多色环状饼图
 */
{
  /*
demo:  
<ColorsPieEcharts
title="课时"//title="%"
color={[
  "#00ffff",
  "#00cfff",
  "#006ced",
  "#ffe000",
  "#ffa800",
  "#ff5b00",
  "#ff3000"
]}//每一个，对应scaleData对应下标的颜色
length={20}
length={70}
borderColor={"#000"}
radius={[42, 50]}
scaleData={[
  {
    name: "调换课",
    prop: 1300
  },
  {
    name: "调换课",
    prop: 800
  },
  {
    name: "调换课",
    prop: 700
  },
  {
    name: "缺勤",
    prop: 900
  }
]}
/> */
}

import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import PropTypes from "prop-types";
import _x from "./../../../../util/file";
const clientSizeChange = _x.clientSizeChange;

export default class ColorsPieEcharts extends Component {
  constructor(props) {
    super(props);
  }
  getOption() {
    let title = this.props.title;
    let scaleData = [];
    if (this.props.scaleData) {
      this.props.scaleData.map((v, k) => {
        scaleData.push({
          name: v.name,
          value: v.prop
        });
      });
    }
    // console.log(scaleData)
    let rich = {
      first: {
        align: "center",
        fontSize: 12 * clientSizeChange(),
        padding: [0, 0, -15*clientSizeChange(), 0]
      },
      first1: {
        align: "center",
        fontSize: 10 * clientSizeChange(),
        padding: [0, 0, -15*clientSizeChange(), 0]
      },
      sec1_1: {
        fontSize: 10 * clientSizeChange(),
        padding: [0, 0, -15*clientSizeChange(), 0],
        align: "center"
      },
      sec1: {
        fontSize: 10 * clientSizeChange(),
        padding: [0,4*clientSizeChange(), -15*clientSizeChange(), 0],
        align: "center",
        // color: "rgb(125,169,184)"
      },
      sec2: {
        color: "rgb(125,169,184)",
        align: "center",
        padding: [0, 0, -15*clientSizeChange(), 0],
        fontSize: 10 * clientSizeChange()
      }
    };
    let placeHolderStyle = {
      normal: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        color: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(0, 0, 0, 0)",
        borderWidth: 0
      }
    };
    let data = [];
    let color = this.props.color;
    for (var i = 0; i < scaleData.length; i++) {
      data.push({
        value: scaleData[i].value,
        name: scaleData[i].name,
        itemStyle: {
          normal: {
            color: color[i]
          }
        }
      });
    }
    let seriesObj = [
      {
        name: "",
        type: "pie",
        minAngle: 25 * clientSizeChange(), //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
        avoidLabelOverlap: true, //是否启用防止标签重叠策略
        clockWise: false,
        radius: this.props.radius || [42*clientSizeChange(), 50*clientSizeChange()],
        hoverAnimation: false,

        itemStyle: {
          normal: {
            borderColor: this.props.borderColor || "#fff",
            borderWidth: 2 * clientSizeChange(),
            label: {
              show: true,
              position: "outside",
              padding: title !== "%" ? [0, -75*clientSizeChange()] : [0, -60*clientSizeChange()],
              align: "center",

              //   color: "#ddd",
              formatter: function(params) {
                if (params.name !== "") {
                  if (title !== "%") {
                    // return (
                    //   "{first|" +
                    //   params.value +
                    //   "}" +
                    //   "{sec1|" +
                    //   title +
                    //   "}" +
                    //   "\n{sec2|" +
                    //   params.name +
                    //   "}"
                    // );
                    return (
                      "{first|" +
                      params.value +
                      "}" +
                      "{sec1|" +
                      title +
                      "}"+""+
                      "{sec2|" +
                      params.name +
                      "}"
                    );
                  } else {
                    // return (
                    //   "{first1|" +
                    //   params.value +
                    //   "}" +
                    //   "{sec1_1|" +
                    //   title +
                    //   "}" +
                    //   "\n{sec2|" +
                    //   params.name +
                    //   "}"
                    // );
                    return (
                      "{first|" +
                      params.value +
                      "}" +
                      "{sec1|" +
                      title +
                      "}"+""+
                      "{sec2|" +
                      params.name +
                      "}"
                    );
                  }
                } else {
                  return "";
                }
              },
              rich: rich
            },
            labelLine: {
              length: this.props.length
                ? this.props.length * clientSizeChange()
                : 20 * clientSizeChange(),
              length2: this.props.length2
                ? this.props.length2 * clientSizeChange()
                : 70 * clientSizeChange(),
              show: true
              //   color: "#00ffff"
            }
          }
        },
        data: data
      }
    ];
    let option = {
      tooltip: {
        show: false
      },
      legend: {
        show: false
      },
      toolbox: {
        show: false
      },
      series: seriesObj
    };
    return option;
  }
  render() {
  
    return (
      <ReactEcharts
        style={{ width: "100%", height: "100%" }}
        option={this.getOption()}
      
      />
    );
  }
}

ColorsPieEcharts.propsTypes = {
  radius: PropTypes.arry,
  center: PropTypes.arry,
  color: PropTypes.arry,
  data: PropTypes.number
};
