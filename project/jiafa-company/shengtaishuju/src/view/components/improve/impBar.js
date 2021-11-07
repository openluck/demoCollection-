import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import _x from './../../../util/file';
const SizeChange = _x.clientSizeChange;
export default class ImpBar extends Component {
    constructor(props) {
        super(props)
    }
    initOption() {
        let array = this.props.data;
        // let array=[{name:'工学院',value:20},{name:'外国语学院',value:50},{name:'外国语学院',value:50},{name:'外国语学院',value:50},{name:'外国语学院',value:50}]
        let data = array; let yData = []; let maxValue = 0
        
        console.log(result)
        array.forEach((item, index) => {
            yData.push(item.name)
            // data.push({
            //     name: item.collegeName,
            //     value: item.courseNum,
            // })
            maxValue = maxValue + Number(item.value)
        });
        let result=(JSON.parse(JSON.stringify(data))).reverse();
        console.log(data, maxValue)
        let option = {
            backgroundColor: 'transparent',
            color: [new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: "#fbdc79"
            }, {
                offset: 1,
                color: "#fa9c6c"
            }], false)],
            grid: {
                left: '5%',
                right: '40%',
                top: '5%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [{
                data: yData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    color: "#647281",
                    fontSize: 14 * SizeChange()
                }
            }, {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                axisLabel: {
                    textStyle: {
                        color: '#4B4B4B',
                        fontSize: '16'
                    },
                    formatter: function (value,index) {
                       
                        return result[index].value
                    },
                },
                data: yData
            }],

            xAxis: [{
                axisTick: {
                    show: false
                },
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: [
                {
                    name: '开课单位top5',
                    type: 'bar',
                    barWidth: 11 * SizeChange(),
                    itemStyle: {
                        barBorderRadius: 10,
                    },
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.5)',
                        barBorderRadius: 10,
                    },
                    label: {
                        // normal: {
                        //     formatter: function (params) {
                        //         return params.data.value
                        //     },
                        //     show: true,
                        //     // show: false, //第二种显示方法
                        //     position: 'right',
                        //     textStyle: {
                        //         fontSize: 16 * SizeChange(),
                        //         color: '#647281'
                        //     }
                        // }
                    },
                    data: data
                },
            ]
        };
        return option;
    }
    render() {
        return (
            <ReactEcharts
                ref={(e) => this.echartsReactRef = e}
                style={{ width: '100%', height: '100%' }}
                option={this.initOption()}
            ></ReactEcharts>
        )
    }
}