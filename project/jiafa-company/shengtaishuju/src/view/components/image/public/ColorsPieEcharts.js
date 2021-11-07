/*
 * @Author: yrj
 * @Date: 2020-01-22 16:07:48
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-22 17:16:05
 * 画像中心-多色环状饼图
 */
{
  /*
demo:  
<ColorsPieEcharts
title="课时"//title="人次" title="%"
other={5} //将第五位以后的合并为其他
color={[
  "#00ffff",
  "#00cfff",
  "#006ced",
  "#ffe000",
  "#ffa800",
  "#ff5b00",
  "#ff3000"
]}//每一个，对应scaleData对应下标的颜色
radius={[45, 60]},
 type={2} //  1 2 不传type 3种样式
 titleSize={10}
 titleSubSize={5}
 scaleData={[
            {
              name: "调换课",
              prop: 1300,
            },
            {
              name: "调换课",
              prop: 800,
            },
            {
              name: "调换课",
              prop: 700,
            },
            {
              name: "缺勤",
              prop: 900,
            }
          ]}
/> */
}

import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import _x from "./../../../../util/file";
import PropTypes from "prop-types";

const clientSizeChange = _x.clientSizeChange;

class ColorsPieEcharts extends Component {
  // constructor(props) {
  //   super(props);
  // }
  getOption() {
    let title = this.props.title;
    let radius = this.props.radius;
    let other = this.props.other;
    let scaleData = [];
    let titleSize = this.props.titleSize;
    let titleSubSize = this.props.titleSubSize;
    let otherObj = {
      name: "其他",
      value: 0
    };
    if (this.props.scaleData) {
      // 处理数据量大于5的项统一为其他
      if (other && this.props.scaleData.length > 5) {
        this.props.scaleData.map((v, k) => {
          if (k < other - 1) {
            scaleData.push({
              name: v.name,
              value: v.prop
            });
          } else {
            otherObj.value += v.prop;
          }
        });
      } else {
        this.props.scaleData.map((v, k) => {
          scaleData.push({
            name: v.name,
            value: v.prop
          });
        });
      }
      if (other && this.props.scaleData.length > 5) {
        scaleData.push(otherObj);
      }
    }

    let type = this.props.type;
    let rich = {
      first: {
        align: "center",
        fontSize: 12 * clientSizeChange(),
        color: "rgba(89,89,89)"
      },
      sec1: {
        fontSize: 12 * clientSizeChange(),
        align: "center",
        color: "rgba(89,89,89)"
      },
      sec2: {
        color: "rgba(89,89,89)",
        align: "center",
        fontSize: 12 * clientSizeChange()
      },
      hr: {
        borderColor: "rgb(89,89,89)",
        width: '100%',
        borderWidth: 0.5,
        height: 0
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
        startAngle: 45,
        radius: radius || [45 * clientSizeChange(), 60 * clientSizeChange()],
        label: {
          padding: [0, -5 * clientSizeChange(), 12 * clientSizeChange()],
          formatter: function (params) {
            let newname
            params.name.length > 7 ? newname = params.name.substr(0, 7) + "..." : newname = params.name;
            if (params.name !== "") {
              if (type === 1) {
                // return (
                //   "{first|" +
                //   params.name +
                //   " " +
                //   params.percent +
                //   "%}" +
                //   "\n{sec1|" +
                //   params.value +
                //   "}" +
                //   "{sec2|" +
                //   title +
                //   "}"
                // );
                return (
                  "{first|" +
                  newname +
                  " " +
                  params.percent +
                  "%}" +
                  "\n{hr|}"
                  // +
                  // "{sec1|" +
                  // params.value +
                  // "}" +
                  // "{sec2|" +
                  // title +
                  // "}"
                );
              } else if (type === 2 || type === 4) {
                // return (
                //   "{first|" +
                //   params.name +
                //   " " +
                //   "}" +
                //   "\n{sec1|" +
                //   params.percent +
                //   "%" +
                //   " " +
                //   " " +
                //   params.value +
                //   "}" +
                //   "{sec2|" +
                //   title +
                //   "}"
                // );
                return (
                  "{first|" +
                  newname +
                  " " +
                  "}" +
                  "{sec1|" +
                  params.percent +
                  "%" +
                  "}" + "\n{hr|}"
                  // +
                  // params.value +
                  // "}" +
                  // "{sec2|" +
                  // title +
                  // "}"
                );
              } else {
                return (
                  "{first|" +
                  params.name +
                  "}" +
                  " " +
                  "{sec1|" +
                  params.value +
                  "}" +
                  "{sec2|" +
                  title +
                  "}" + "\n{hr|}"
                );
              }
            } else {
              return "";
            }
          },
          rich: rich
        },
        labelLine: {
          // length: 20 * clientSizeChange(),
          length2: 4 * clientSizeChange(),
          show: true,
          lineStyle: {
            color: "rgb(89,89,89)"
            // rgba(230,230,230)
          }
        },
        itemStyle: {
          borderColor: "#fff",
          // borderWidth: 2 * clientSizeChange()
        },
        top: '10%',
        data: data
      }
    ];
    // console.log(titleSize,'titleSize')
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          // console.log(params)
          if (type === 4) {
            return params.data.name + '<br/>' + ' ' + params.percent + '%'
          } else {
            return params.data.name + '<br/>' + params.data.value + `${title} ` + ' (' + params.percent + '%)'
          }
        }
      },
      title: {
        text: this.state.text,
        subtext: this.state.subtext,
        x: "center",
        y: "center",
        textStyle: {
          fontSize: titleSize ? titleSize * clientSizeChange() : 24 * clientSizeChange(),
          fontWeight: "normal",
          color: ["#333"],

        },
        subtextStyle: {
          color: "#666",
          fontSize: titleSubSize ? titleSubSize * clientSizeChange() : 12 * clientSizeChange()
        }
      },
      // tooltip: {
      //   show: false
      // },
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
  constructor() {
    super()
    this.state = {
      text: null,
      subtext: null
    }
  }
  componentDidMount() {
    this.setState({
      // myChart:this.echarts_react.getEchartsInstance()
    })
    let { jumpType } = this.props;
    this.echartsInstance = this.echartsReactRef.getEchartsInstance();
    this.zr = this.echartsInstance.getZr();
    this.zr.on('click', (e) => {
      if (e.target && e.target.dataIndex >= 0) {
        let index = e.target.dataIndex
        console.log(index)
        this.props.goRouter(index,jumpType)
        return;
      }
    });
    // this.echartsInstance.on('click', 'series', (e) => {
    // })
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
    "mouseout": this.onMouseout
  }
  render() {
    return (
      <ReactEcharts
        ref={(e) => this.echartsReactRef = e}
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
