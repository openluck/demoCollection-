/*
 * @Author: xiangting 
 * @Date: 2019-03-01 09:50:31 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-26 13:57:15
 * 教学反思——教学质量
 */

import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'react-redux';
import { teachingQuality, jxfsLoading } from './../../../redux/jxfs/jxfs.reducer'

@connect(state => state.getJxfsData, { teachingQuality, jxfsLoading })

export default class TeachingQuality extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {}
        }
    }
    componentDidMount() {
    }

    /**
     * @description 柱状图配置
     */
    initLine() {
        let option = {
            tooltip: {
                // trigger: 'item',
                formatter: (params) => {
                    let classList = this.props.teachingQualityData.classList
                    return (
                        `<div>
                            <div>课程数：${classList[params[0].dataIndex].totalNumClass}</div>
                            <div>平均分：${classList[params[0].dataIndex].totalScoreClass}</div>
                        </div>`
                    )
                },
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            xAxis: {
                type: 'category',
                data: this.props.teachingQualityData.className || [],
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                // data: [10],
                data: this.props.teachingQualityData.totalScoreClass || [],
                type: 'bar',
                color: '#ffaf40',
                barWidth: 30,
                label: {
                    show: true,
                    position: 'top'
                },
                markLine: {
                    lineStyle: {
                        color: '#3dcc85',
                        width: 1,
                        type: 'solid'
                    },
                    data: [{
                        yAxis: this.props.teachingQualityData.avgScore || 0,
                        symbol: 'none'
                    }],
                }
            }]
        };
        return option
    }
    render() {
        const data = this.props.teachingQualityData
        return (
            <div className='xt-teachingQuality'>
                <div>教研课质量</div>
                <div className="xt-teachingQuality-score">
                    <div>
                        <div>教研课节数</div>
                        <div><span>{data.totalResearchNum || data.totalResearchNum === 0 ? data.totalResearchNum > 999 ? '999+' : data.totalResearchNum : '-'}</span>节</div>
                    </div>
                    <div>
                        <div>收到点评</div>
                        <div><span>{data.totalCommentNum || data.totalCommentNum === 0 ? data.totalCommentNum > 999 ? '999+' : data.totalCommentNum : '-'}</span>条</div>
                    </div>
                    <div>
                        <div>评教得分</div>
                        <div><span>{data.avgScore || data.avgScore === 0 ? data.avgScore > 999 ? '999+' : data.avgScore : '-'}</span>分</div>
                    </div>
                </div>
                <ReactEcharts
                    style={{
                        width: '96%',
                        height: '300px',
                        overflow: 'hidden'
                    }}
                    className='xt-teachingQuality-echarts'
                    option={this.initLine()}
                />
            </div>
        )
    }
}