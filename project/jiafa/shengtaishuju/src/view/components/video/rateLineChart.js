/*
 * @Author: lilu 
 * @Date: 2020-07-29 16:02:22 
 * @Last Modified by: tj
 * @Last Modified time: 2020-08-18 13:32:17
 */


import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

export default class RateLineChart extends Component {

    getOption = () => {
        let data = this.props.data;
        let nameData = [{ name: '到课率', color: '#59a6ee', }, { name: '前排就坐率', color: '#14cc8f', }, { name: '低头率', color: '#ff9933', }]
        let lineData = [];
        let stuOnAttData = [];
        let frontSeatData = [];
        let sleepRateData = [];
        for (let i = 0; i < data.length; i++) {
            lineData.push(data[i].date);
            stuOnAttData.push(data[i].stuOnAttRate);
            frontSeatData.push(data[i].frontSeatRate);
            sleepRateData.push(data[i].sleepRate);
        }
        let seriesData = [];
        for (let j = 0; j < nameData.length; j++) {
            seriesData.push({
                name: nameData[j].name,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 3,
                showSymbol: false,
                cursor: 'pointer',
                lineStyle: {
                    normal: {
                        shadowColor: '#f0f0f0',
                        shadowBlur: 2,
                        shadowOffsetY: 12,
                        shadowOffsetX: 0,
                        color: nameData[j].color,
                    }
                },
                itemStyle: {
                    color: nameData[j].color,
                    borderColor: "#fff",
                    borderWidth: 2,
                },
                emphasis: {
                    itemStyle: {
                        borderWidth: 2,
                        borderColor: nameData[j].color,
                        color: '#fff',
                    }
                },
                data: j === 0 ? stuOnAttData : j === 1 ? frontSeatData : sleepRateData
            })
        }

        let option = {
            backgroundColor: "#fff",
            tooltip: {
                trigger: 'axis',
                show: true,
                formatter: function (params) {
                    var result = '';
                    result = params[0].name + '&nbsp' + '&nbsp' + '</br>'
                    for (let i = 0; i < params.length; i++) {
                        result+=params[i].seriesName + ':' + '&nbsp' + '&nbsp' + params[i].value + '%' + '</br>'
                    }
                    return result;
                }
            },
            legend: {
                show: true,
                icon: 'rect',
                top: 0,
                right: 0,
                textStyle: {
                    fontSize: 12,
                    color: '#999999'
                },
                itemWidth: 12,
                itemHeight: 12,
                selectedMode: false,
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '25%',
                bottom: '6%',
                containLabel: true,

            },
            xAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    // interval: 0,
                    color: '#AAAAB1'
                },
                data: lineData
            },
            yAxis: {
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                name: 'AI识别结果',
                nameTextStyle: {
                    color: '#333'
                },
                axisLabel: {
                    color: '#ccc',
                    show: true,
                    interval: "auto",
                    formatter: "{value}%"
                },
                splitLine:{
                    lineStyle:{
                        color:'#F0F2F6'
                    }
                }
            },
            series: seriesData
        };
        return option
    }
    render() {
        return (
            <ReactEcharts
                option={this.getOption()}
                style={{ height: '100%', width: "100%" }}
            />
        );
    }
}

