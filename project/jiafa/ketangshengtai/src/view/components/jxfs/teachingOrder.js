/*
 * @Author: xiangting 
 * @Date: 2019-03-01 09:50:49 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-26 14:14:06
 * 教学反思——授课秩序
 */

import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'react-redux';
import { teachingOrder, jxfsLoading } from './../../../redux/jxfs/jxfs.reducer'

@connect(state => state.getJxfsData, { teachingOrder, jxfsLoading })
export default class TeachingOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleEventType: 0,            //违纪角色：0：学生,1：教师
    }
  }

  /**
   * @description  饼图配置
   */
  initLine() {
    const teachingOrderData = this.props.teachingOrderData;
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: "<br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: '授课秩序',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            normal: {
              position: 'inner',
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: teachingOrderData.stuTotalScore || 0, name: '学生违纪', selected: this.state.roleEventType ? false : true },
            { value: teachingOrderData.teachTotalScore || 0, name: '老师违纪', selected: !this.state.roleEventType ? false : true },
          ],
          color: ['#ea6e76', '#eb8c00']
        },
        {
          name: '授课秩序',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: ' {b|{b}} ',
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          labelLine: {
            normal: {
              length: 5
            }
          },
          data: this.state.roleEventType ? teachingOrderData.teachData : teachingOrderData.stuData
        }
      ]
    };
    return option;
  }

  /**
   * @description  切换角色
   * @param {object} e    被选中角色信息
   */
  changeRole(e) {
    if (e.seriesIndex === 0) {
      this.setState({ roleEventType: e.dataIndex })
    }
  }
  render() {
    const data = this.props.teachingOrderData;
    const onEvents = { 'click': this.changeRole.bind(this) }
    return (
      <div className='xt-teachingOrder'>
        <div className='xt-teachingOrder-title'>
          <div>授课秩序</div>
          <div>总违纪次数<span>{data.eventNum || data.eventNum === 0 ? data.eventNum > 999 ? '999+' : data.eventNum : '-'}</span>次</div>
        </div>
        <ReactEcharts
          onEvents={onEvents}
          style={{
            width: '96%',
            padding: '2rem 0rem 0',
            height: '300px',
            overflow: 'hidden'
          }}
          className='xt-teachingOrder-echarts'
          option={this.initLine()}
        />
      </div>
    )
  }
}