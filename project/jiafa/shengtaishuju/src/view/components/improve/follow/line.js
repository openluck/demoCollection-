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
import _x from "./../../../../util/file";
export default class Line extends Component {

    getOption = () => {
        var getmyd = this.props.data;//学生满意度
        var getmydzd = [];//学生满意度100%
        for (let i = 0; i < getmyd.length; i++) {
            getmydzd.push(100)
        }
        let option = {
            grid: {
                left: '0',
                right: this.props.right,
                bottom: '3%',
                top: '3%',
            },
            tooltip: {
                show: false,
            },
            xAxis: {
                show: false,
                type: 'value'
            },
            yAxis: [{
                type: 'category',
                axisLabel: {
                    show: false,

                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },

            }, {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show:this.props.showValue? true:false,
                axisLabel: {
                    textStyle: {
                        color: '#333333',
                        fontSize: '14'
                    },
                    formatter: '{value}%'
                },
                data: getmyd
            }],
            series: [{
                name: '值',
                type: 'bar',
                zlevel: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: this.props.color
                    },

                    emphasis: { color:  this.props.color }, //鼠标移入颜色
                },
                barWidth: 4,
                data: getmyd
            },
            {
                name: '背景',
                type: 'bar',
                barWidth: 4,
                barGap: '-100%',
                data: getmydzd,
                itemStyle: {
                    normal: {
                        color: '#efefef',
                        barBorderRadius: 5,
                    },
                    emphasis: { color: '#efefef' }, //鼠标移入颜色
                },
            },
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

