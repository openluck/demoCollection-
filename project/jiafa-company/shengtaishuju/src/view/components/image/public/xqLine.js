/*
 * @Author: xq
 * @Date: 2020-02-16 15:47:35
 * @LastEditors: xq
 * @LastEditTime: 2020-02-17 13:15:43
 * 多折线图表
 */
import React from "react";
import ReactEcharts from 'echarts-for-react';
import img_noData from '../../../../media/picture/img_noData.png'
import { message } from 'antd';
import './../../../../style/xqLine.scss';
import NoDataAndLoading from './noDataAndLoading';


export default class XqLine extends React.Component {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
        this.color = ['#1890ff', '#4ecb73', '#fbd437'];
    }
//获取最大值
 getMax1(data){
    if (data.length) {
      let list=[]
      data.map((v,k)=>{
          if(typeof v==='number'){
            list.push(v)
          }
      })
      return Math.max(...list)
    }else{
      return 100
    }
  }
    //获取最大值
     getmax(data) {
    //   console.log(data,'xxxxx')
      if(data&&data.length){
        let first=data[0]?data[0].list:[0]
        let sec=data[1]?data[1].list:[0]
        let thr=data[2]?data[2].list:[0]
        let max=Math.max(...[this.getMax1(first),this.getMax1(sec),this.getMax1(thr)])
        if(max<100){
            max=100
        }
        return max
      }else{
        return 100
      }
  
  
    }

    /**
     * @desc 折线图组件渲染
     * @param {Array}   color  全局色盘。       默认3个颜色。例：['#3385ff','#4ecc7b','#cfdd68']
     * @param {Array}   xData  x轴数据。        例：['2019.1.1', '2019.1.2']
     * @param {Array}   data   折线图数据。     例：[{ name:'英语课程',list:[55,45,22,24,65,60,62]}]
     * @param {string}  yType  Y轴类型。        默认是'per'。 'per'百分比，'num'数值
     * @param {string}  yName  Y轴坐标轴名称。  无名称时，可传空字符串''。
     */
    getOption(color, xData, data, yType, yName,max) {
        // console.log(max,'xxxx')
        if(max){
            if(max<100){
                max=100
            }else{
                max=Math.ceil(max/5)*5
            }
        }else{
            max= Math.ceil(this.getmax(data)/5)*5
            // max=100
        }
        // 处理series数据 和 图例
        let _series = [], _legend = [], legend = [];
        this.props.type === '2' && xData && xData.length
            ? xData = xData.map(dt => `第${dt}周`)
            : null
  
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item) {
                _legend.push(item.name);
                legend.push({ name: item.name, color: color[i] ? color[i] : color[0] });
                _series.push({
                    name: item.name,
                    data: item.list,
                    type: 'line',
                    showAllSymbol: true, //显示所有图形。
                    symbol: "circle", //标记的图形为实心圆
                    symbolSize: 7, //标记的大小
                    itemStyle: {
                        color: color[i] ? color[i] : color[0]
                    }
                })
            }
        };
        // console.log(_legend)
        // 数据渲染
        let option = {
            color,
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.6)',
                axisPointer: {
                    type: "shadow",
                    shadowStyle: {
                        color: 'rgba(16,135,251,.1)'
                    }
                },
                formatter: function (params) {
                    let list = [`<div class="xqToolText">${params[0]['axisValue']}</div>`];
                    let listItem = '';
                    params.map((item, index) => {
                        let _style = `background-color:${color[item.seriesIndex]}`;
                        if (yType === 'per') {
                            if(yName==='次/课程'){
                                list.push(
                                    '<div class="xqToolText" key=' + index + '>'
                                    + '<span style="' + _style + '"></span>' + item.seriesName  + '：' + item.data +
                                    '次/课程</div> '
                                )
                            }else{
                                list.push(
                                    '<div class="xqToolText" key=' + index + '>'
                                    + '<span style="' + _style + '"></span>' + item.seriesName  + '：' + item.data +
                                    '%</div> '
                                )
                            }
                            
                        } else {
                            list.push(
                                '<div class="xqToolText" key=' + index + '>'
                                + '<span style="' + _style + '"></span>' +(index===0?( item.seriesName || "全校") :item.seriesName) + '：' + item.data + yName +
                                '</div> '
                            )
                        }
                        let _index = _.findIndex(legend, { name: item.seriesName });
                        if (_index !== -1) {
                            legend.splice(_index, 1);
                        }
                    })
                   
                    legend.map((t, i) => {
                      
                        list.push(
                            '<div class="xqToolText" key=' + t.name + i + '>'
                            + '<span style="' + `background-color:${t.color}` + '"></span>' + t.name  || '全校'+ '：' + '--' + yName +
                            '</div> '
                        )
                    })
                    // console.log(legend,'cosnolecosnole')
                    listItem = list.join('');

                    return '<div class="xqToolFormatter">' + listItem + '</div>'
                }
            },
            legend: {
                data: _legend,
                left: 70,
                bottom: 0,
                itemGap: 30
            },
            grid: {
                top: '40px',
                left: '3%',
                right: '3%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    margin: 20
                },
                data: xData
            },
            yAxis: {
                type: 'value',
                name: yName,
                interval:max/5,
                max:max,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: yType === 'per' ? yName==='次/课程'?'{value}':'{value} %' : '{value}'
                },
                splitLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            series: _series
        };
        return option;
    }

    render() {
        let {
            color,
            xData,
            data,
            yType,
            yName,
            max
        } = this.props;
        color = color && color.length ? color : this.color;
        xData = xData ? xData : [];
        data = data ? data : [];
        yType = yType ? yType : 'per';
        yName = yName ? yName : '';
        return (
            xData.length && data.length
                ? <ReactEcharts
                    notMerge={true}
                    option={this.getOption(color, xData, data, yType, yName,max)}
                />
                : <NoDataAndLoading />
        )
    }
}