/*
 * @Author: kyl 
 * @Date: 2020-02-17 13:51:17 
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-05 14:55:48
 * 学生听讲反馈
 */
import React, { Component } from 'react'
import '../../../../style/kyl_tea_comp.scss';
import ColorsPieEcharts from '../public/ColorsPieEcharts';
import { Spin } from 'antd';
import WaveLine from '../public/waveLine';
import {
  kyl_get_stuActPie,
  kyl_get_stuBqPie,
  kyl_get_allCondPie,
  kyl_get_stuActLine,
  kyl_get_xsbqLine,
  kyl_get_allCondLine
} from '../../../../redux/kyl-teaImage.reducer';
import Randar from './radar';
import NoDataAndLoading from '../public/noDataAndLoading';
import { connect } from 'react-redux';

@connect(state => state, {
  kyl_get_stuActPie,
  kyl_get_stuBqPie,
  kyl_get_allCondPie,
  kyl_get_stuActLine,
  kyl_get_xsbqLine,
  kyl_get_allCondLine
})
export default class Jxtjfk extends Component {

  componentDidMount() {
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
    let p={
      ...propParams,
    }
    this.reqData(p);
  }

  reqData = (p) => {
    this.props.kyl_get_stuActPie(p);
    this.props.kyl_get_stuBqPie(p);
    this.props.kyl_get_allCondPie(p);
    this.props.kyl_get_stuActLine(p);
    this.props.kyl_get_xsbqLine(p);
    this.props.kyl_get_allCondLine(p);
  }

  componentDidUpdate() {
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
  render() {
    let waveColor = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137'];
    let { xsxw_pie, xsbq_pie, zhqk_pie,
      xsxw_line, xsbq_line, zhqk_line,
      loading
    } = this.props.kyl_teaImage_reducer
    // console.log(123)
    return (
      <div
        className='image_public dkl kyl-teaImage-cont'
      >
        {/* <div className='scl_header'>
          <span></span>
          <span>学生听讲反馈</span>
        </div> */}
        <div>
          <div className='kyl-jxfx-cont'>
            <div style={{ position: 'relative' }}>
              <div className='kyl-ttc-pieTi'>学生行为</div>
              <div style={{ height: 'calc(100% - 41px)' }}>
                {
                  loading[6] ? <div className='kyl-ttc-cont'>
                    <div className='xq-load-all'><Spin /></div>
                  </div> :
                    (
                      xsxw_pie.length > 0 ? <ColorsPieEcharts
                        title="%"//title="人次" title="%"
                        radius={[45, 60]}
                        color={waveColor}//每一个，对应scaleData对应下标的颜色
                        type={''} //  1 2 不传type 3种样式
                        scaleData={xsxw_pie}
                      /> : <NoDataAndLoading />
                    )
                }
              </div>

            </div>
            <div>
              {
                loading[9] ? <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                  (
                    xsxw_line.xData.length > 0 ?
                      <WaveLine legend={xsxw_line.legend}
                        lineColor={waveColor}
                        xData={xsxw_line.xData}
                        yData={xsxw_line.yData}
                        timeType={this.props.params.timeType}></WaveLine> : <NoDataAndLoading />
                  )
              }
            </div>
          </div>
          <div className='kyl-jxfx-cont'>
            <div style={{ position: 'relative' }}>
              <div className='kyl-ttc-pieTi'>学生表情</div>
              <div style={{ height: 'calc(100% - 41px)' }}>
                {
                  loading[7] ? <div className='kyl-ttc-cont'>
                    <div className='xq-load-all'><Spin /></div>
                  </div> :
                    (
                      xsbq_pie.length > 0 ?
                        <ColorsPieEcharts
                          title="%"//title="人次" title="%"
                          radius={[45, 60]}
                          color={waveColor}//每一个，对应scaleData对应下标的颜色
                          type={''} //  1 2 不传type 3种样式
                          scaleData={xsbq_pie}
                        /> : <NoDataAndLoading />
                    )
                }
              </div>
            </div>
            <div>
              {
                loading[10] ? <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                  (
                    xsbq_line.xData.length > 0 ?
                      <WaveLine legend={xsbq_line.legend}
                        lineColor={waveColor}
                        xData={xsbq_line.xData}
                        yData={xsbq_line.yData}
                        timeType={this.props.params.timeType}></WaveLine>
                      : <NoDataAndLoading />
                  )
              }

            </div>
          </div>
          <div className='kyl-jxfx-cont'>
            <div style={{ position: 'relative' }}>
              <div className='kyl-ttc-pieTi'>综合情况</div>
              <div style={{ height: 'calc(100% - 41px)' }}>
                {
                  loading[8] ? <div className='kyl-ttc-cont'>
                    <div className='xq-load-all'><Spin /></div>
                  </div> :
                    (
                      zhqk_pie && zhqk_pie.data.length > 0 ?
                        <Randar
                          data={zhqk_pie}
                        ></Randar> : <NoDataAndLoading />
                    )
                }
              </div>
            </div>
            <div>
              {
                loading[11] ? <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                  (
                    zhqk_line.xData.length > 0 ?
                      <WaveLine legend={zhqk_line.legend}
                        lineColor={waveColor}
                        xData={zhqk_line.xData}
                        yData={zhqk_line.yData}
                        timeType={this.props.params.timeType}></WaveLine> :
                      <NoDataAndLoading />
                  )
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}
