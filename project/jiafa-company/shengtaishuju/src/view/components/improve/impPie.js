/*
 * @Description: 
 * @version: 
 * @Author: lrf
 * @Date: 2021-07-21 13:55:57
 * @LastEditors: lrf
 * @LastEditTime: 2021-07-22 15:26:44
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import _x from '../../../util/file';
import totalImg from './../../../media/picture/reply.png'
const SizeChange = _x.clientSizeChange;
export default class ImpPie extends Component {
    constructor(props) {
        super(props)
    }
    initOption() {
        let img = totalImg;
        let color=['#5ab1ee','#ff4c4c']
        let {allowApplyNum,noApplyNum,radius} = this.props.data;
        let data = [{
            name: '同意申请',
            value:allowApplyNum||0
        }, {
            name: '不同意申请',
            value: noApplyNum||0
        }];
        // console.log(data)
        let option = {
            graphic: {
                elements: [{
                    type: "image",
                    z: 3,
                    style: {
                        image: img,
                        width: 42,
                        height: 42
                    },
                    left: 'center',
                    top: 'center',
                    position: [100, 100]
                }]
            },
            backgroundColor: "transparent",
            color:color,
            series: [
                {
                    type: 'pie',
                    clockwise: false, //饼图的扇区是否是顺时针排布
                    minAngle: 0, //最小的扇区角度（0 ~ 360）
                    radius: radius||['76%','90%'],
                    avoidLabelOverlap: false,
                    itemStyle: { //图形样式
                        normal: {
                            borderColor: '#ffffff',
                            borderWidth: 1,
                        },
                    },
                    animation: false,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: data
                }
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