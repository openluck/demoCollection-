/*
 * @Author: lilu 
 * @Date: 2020-07-29 16:02:10 
 * @Last Modified by: tj
 * @Last Modified time: 2020-09-02 13:40:42
 */


import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

export default class Circle extends Component {

    getOption = () => {
        var datas = {
            value: this.props.data,
            ringColor: [{
                offset: 0,
                color: this.props.color
            }]
        }
        let option = {
            //  backgroundColor:"#000",
            title: {
                text: `${datas.value}{a1|%}`,
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#666',
                    fontSize: '16',
                    rich: {
                        a1: {
                            fontSize: 12
                        }
                    }
                }
            },
            color: ['#f0f0f0'],
            legend: {
                show: false,
            },

            series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: true,
                radius: ['52%', '60%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: { color: '#f0f0f0' }
                },
                hoverAnimation: false,
                data: [{
                    value: datas.value>100?100:datas.value,
                    name: '',
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: datas.ringColor
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: { color: datas.ringColor[0].color }, //鼠标移入颜色
                    }
                }, {
                    name: '',
                    value: 100 - (datas.value>100?100:datas.value)
                }]
            }]
        };
        return option
    }
    render() {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <ReactEcharts
                    option={this.getOption()}
                    style={{ height: 'calc(100% - 30px)', width: "100%" }}
                />
                <div style={{width:"100%",height:'20px',lineHeight:'20px',textAlign:'center',color:'#595959'}}>{this.props.title}</div>
            </div>
        );
    }
}

