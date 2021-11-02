/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: yrj
 * @Last Modified time: 2020-08-06 10:08:32
 */

/**
 * @description 公共波浪图组件
 */

/**
 * @desc 
 *            legend: ['活跃度','专注度','疑惑度','参与度']
 *            lineColor: ['#59c99b','#7ad8e3','#cfa4e3','#000']
 *            xData: ['3-1','3-2','3-2','3-2','3-2','3-2']
 *            yData: [
                        [1,4,19,5,7,44,123,10],
                        [100,18,154,13,1,23,44,49],
                        [45,34,21,44,56,13,16,17]
                     ]

 * @param {arry}   legend         多线标题
 * @param {arry}   lineColor      线条颜色
 * @param {arry}   xData          x轴值
 * @param {arry} yData          y轴值，二维数组
 */
import React, { Component } from "react";
import ReactEcharts from 'echarts-for-react';
export default class WaveLine extends Component {
  getOption(props) {
    let xData = this.props.xData;
     props.type === '2'
            ? xData = xData.map(dt => `第${dt}周`)
            : null
    let
      option =
      {
        backgroundColor: '#fff',
        legend: {
         data: this.props.legend,
         top:'20',
         itemGap:14,
         selectedMode:true,
         itemWidth: 20,
         itemHeight: 8,
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params){
            let list = [`<div class="xqToolText">${params[0]['axisValue']}</div>`];
            let listItem = '';
            params.map((item,index)=>{
                let _style=`background-color:${props.lineColor[index]}`;
                list.push(
                    '<div class="xqToolText" key='+index+'>'
                        + '<span style="' +_style + '"></span>'  + item.seriesName + '：' + Math.round(item.data*100)/100 + 
                    '%</div> '
                )
            })
            listItem = list.join('');
            return '<div class="xqToolFormatter">' + listItem + '</div>'
          }
        },
        grid: {
          left: '10',
          right: '50',
          bottom: '0',
          top: '60',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLine: {
            lineStyle: {
              color: '#b8b8b8'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          max:100,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {  
            show: true,  
            interval: 'auto',  
            formatter:'{value} %'
          },
          splitLine: {
            show: true,
            lineStyle:{
                 color: 'rgba(192,192,192,0.3)',
                 width: 1,
                 type: 'solid'
            }
        }
        },
        series: []
      } 
      for(let i = 0;i<this.props.yData.length;i++){
        option.series.push({
          name: this.props.legend[i],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          color: [this.props.lineColor[i]],
          lineStyle: {
            normal: {
              width: 1,
              color: [this.props.lineColor[i]],
              // shadowColor: 'rgba(192,192,192,0.1)',
              // shadowBlur: 1,
              // shadowOffsetY: 3
            }
          },
          showSymbol: false,
          data: this.props.yData[i],
        })
      }
      let selected = {};
      for(let i = 0;i<props.legend.length;i++){
        if(i > 2){
          selected[props.legend[i]] = false;
        }
      }
      option.legend.selected = selected;
      return option
    }                
  render() {
    return (
      <ReactEcharts
          option={this.getOption(this.props)}
          style={{ height: '95%', width: '100%' }}
        />
    );
  }
}
