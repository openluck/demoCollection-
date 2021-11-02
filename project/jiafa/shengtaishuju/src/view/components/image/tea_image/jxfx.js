/*
 * @Author: kyl 
 * @Date: 2020-02-17 12:36:22 
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-05 14:56:33
 * 教学分析
 */

import React, { Component } from 'react'
import '../../../../style/kyl_tea_comp.scss';
import { Spin } from 'antd';
import ColorsPieEcharts from '../public/ColorsPieEcharts';
import WaveLine from '../public/waveLine';
import Randar from './radar';
import NoDataAndLoading from '../public/noDataAndLoading';
import {
  kyl_get_teaActPie,
  kyl_get_teaDisPie,
  kyl_get_classTypePie,
  kyl_get_teaActLine,
  kyl_get_teaDisLine,
  kyl_get_classTypeLine
} from '../../../../redux/kyl-teaImage.reducer';
import { connect } from 'react-redux';

@connect(state => state, {
  kyl_get_teaActPie,
  kyl_get_teaDisPie,
  kyl_get_classTypePie,
  kyl_get_teaActLine,
  kyl_get_teaDisLine,
  kyl_get_classTypeLine
})
export default class Jxfx extends Component {

  componentDidMount () {
    let propParams = this.props.params;
    this.setState({
      params: propParams
    })
    // let p = {
    //   "semesterId": "2019_2020_2",
    //   "collegeId": "",
    //   "teacherId": "3f0529defcf9712a5bc8b3869b47ba7c",
    //   "timeType": "1",
    //   "selTime": "2020-02-24",
    //   // "sortType": "0",
    //   "checkType": "1",
    //   "checkClassId": "",
    //   "couTypeId": 0
    // }
    let p = {
      ...propParams,
    }
    this.reqData(p);
  }
  reqData = (p) => {
    // this.props.kyl_get_teaActPie(p);
    this.props.kyl_get_teaDisPie(p);
    this.props.kyl_get_classTypePie(p);
    // this.props.kyl_get_teaActLine(p);
    this.props.kyl_get_teaDisLine(p);
    this.props.kyl_get_classTypeLine(p);
  }

  componentDidUpdate () {
    let propParams = this.props.params;
    let { params } = this.state;
    // console.log(123132152)
    if (JSON.stringify(propParams) !== JSON.stringify(params)) {
      console.log('状态改变了')
      this.setState({
        params: propParams
      })
      this.reqData(propParams)
    }
  }
  render () {
    let waveColor = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137'];
    let { jsxw_pie, jxsj_pie, ktlx_pie, jsxw_line, jxsj_line, ktlx_line, loading } = this.props.kyl_teaImage_reducer
    console.log('jsxw', jsxw_pie)
    return (
      <div
        className='image_public dkl kyl-teaImage-cont'
      >
        {/* <div className='scl_header'>
          <span></span>
          <span>教学分析</span>
        </div> */}
        <div>
          {/* v1.21版本删除 */}
          {/*<div className='kyl-jxfx-cont'>
              loading[0] ?
                <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                (
                  <div style={{ position: 'relative' }}>
                    <div className='kyl-ttc-pieTi'>教师行为</div>
                    {
                      jsxw_pie.length > 0 ?
                        <div style={{ height: 'calc(100% - 41px)' }}>
                          <ColorsPieEcharts
                            title="%"//title="人次" title="%"
                            radius={[45, 60]}
                            color={waveColor}//每一个，对应scaleData对应下标的颜色
                            type={''} //  1 2 不传type 3种样式
                            scaleData={jsxw_pie}
                          />
                        </div> : <NoDataAndLoading></NoDataAndLoading>
                    }
                  </div>
                )
           

            {
              loading[3] ?
                <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                <div style={{ height: '100%' }}>
                  {
                    jsxw_line && jsxw_line.xData.length > 0 ?
                      <WaveLine legend={jsxw_line.legend}
                        lineColor={waveColor}
                        xData={jsxw_line.xData}
                        yData={jsxw_line.yData}
                        timeType={this.props.params.timeType}></WaveLine> : <NoDataAndLoading></NoDataAndLoading>
                  }
                </div>
            }

          </div>
           */}
          <div className='kyl-jxfx-cont'>
            {
              loading[1] ?
                <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                (
                  <div style={{ position: 'relative' }}>
                    <div className='kyl-ttc-pieTi'>教学设计</div>
                    {
                      jxsj_pie.length > 0 ?
                        <div style={{ height: 'calc(100% - 41px)' }}>
                          <ColorsPieEcharts
                            title="%"//title="人次" title="%"
                            radius={[45, 60]}
                            color={waveColor}//每一个，对应scaleData对应下标的颜色
                            type={''} //  1 2 不传type 3种样式
                            scaleData={jxsj_pie}
                          />
                        </div> : <NoDataAndLoading></NoDataAndLoading>
                    }
                  </div>
                )
            }
            {
              loading[4] ?
                <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                <div style={{ height: '100%' }}>
                  {
                    jxsj_line && jxsj_line.xData.length > 0 ?
                      <WaveLine legend={jxsj_line.legend}
                        lineColor={waveColor}
                        xData={jxsj_line.xData}
                        yData={jxsj_line.yData}
                        timeType={this.props.params.timeType}></WaveLine> : <NoDataAndLoading></NoDataAndLoading>
                  }
                </div>
            }

          </div>
          <div className='kyl-jxfx-cont'>
            {
              loading[2] ?
                <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                (

                  <div style={{ position: 'relative' }}>
                    <div className='kyl-ttc-pieTi'>课堂类型</div>
                    {
                      ktlx_pie.length > 0 ?
                        <div style={{ height: 'calc(100% - 41px)' }}>
                          <ColorsPieEcharts
                            title="%"//title="人次" title="%"
                            radius={[45, 60]}
                            color={waveColor}//每一个，对应scaleData对应下标的颜色
                            type={''} //  1 2 不传type 3种样式
                            scaleData={ktlx_pie}
                          />
                        </div> : <NoDataAndLoading></NoDataAndLoading>
                    }
                  </div>
                )
            }
            {
              loading[5] ?
                <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                <div style={{ height: '100%' }}>
                  {
                    ktlx_line && ktlx_line.xData.length > 0 ?
                      <WaveLine legend={ktlx_line.legend}
                        lineColor={waveColor}
                        xData={ktlx_line.xData}
                        yData={ktlx_line.yData}
                        timeType={this.props.params.timeType}></WaveLine> : <NoDataAndLoading></NoDataAndLoading>
                  }
                </div>
            }
          </div>
        </div>
      </div >
    )
  }
}
