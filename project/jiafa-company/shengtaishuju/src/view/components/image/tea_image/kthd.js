/*
 * @Author: kyl 
 * @Date: 2020-02-14 14:41:38 
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-30 13:27:13
 * 课堂互动
 */

import React, { Component } from 'react'
import Tea_btm_cont from '../public/tea_btm_cont';
import Tea_than_comp from '../tea_image/tea_than_comp';
import { Select, Spin } from 'antd';
import XqLine from './../public/xqLine.js';
import Kthd_comp from './kthd_comp';
import SVG from '../../../public/svg';
import NoDataAndLoading from '../public/noDataAndLoading';
import '../../../../style/kyl_tea_comp.scss';
import { kyl_get_kthdInfo, kyl_get_kthdAnl, kyl_getKthdLine_data, kyl_clean_kthd_line } from '../../../../redux/kyl-teaImage.reducer';
import { connect } from 'react-redux';

const { Option } = Select;
const barData = {
  xData: ['数学学院', '航空学院', '物理学院', '经济管理学院', '化学院化工学院', '数学学院', '航空学院', '物理学院', '经济管理学院', '化学院化工学院'],
  yData: [15, 25, 30, 15, 2, 15, 25, 30, 15, 2]
}
@connect(state => state, { kyl_get_kthdInfo, kyl_get_kthdAnl, kyl_getKthdLine_data, kyl_clean_kthd_line })
export default class Kthd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortValue: 0,
      barVal: '1',   //对比分析选中 1  学生起立  2 教师上下讲台
      lineVal: '1',   //趋势选中 1  学生起立  2 教师上下讲台

      firSel: undefined,     //第一个下拉
      secSel: undefined,     //第二个下拉
    }
  }

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
      checkType:'1',
    }
    this.reqData(p);
  }

  reqData = (params) => {
    let { sortValue, barVal, lineVal } = this.state;
    this.props.kyl_get_kthdInfo(params);
    this.props.kyl_get_kthdAnl(params, sortValue, barVal);
    this.props.kyl_getKthdLine_data(params, lineVal);
  }

  componentDidUpdate() {
    let propParams = this.props.params;
    let { params } = this.state;
    if (JSON.stringify(propParams) !== JSON.stringify(params)) {
      this.setState({
        params: propParams,
        sortValue: 2,
        barVal: '1',   //对比分析选中 1  学生起立  2 教师上下讲台
        lineVal: '1',   //趋势选中 1  学生起立  2 教师上下讲台
        firSel: undefined,     //第一个下拉
        secSel: undefined,     //第二个下拉
      })
      this.reqData(propParams)
    }
  }

  //切换排序
  onSort = (val) => {
    let { params, } = this.props;
    let { barVal } = this.state;
    this.setState({
      sortValue: val
    })
    this.props.kyl_get_kthdAnl(params, val, barVal);
  }

  //选择教学班
  changeSel = (val, type) => {
    let { cond, params } = this.props;
    let { lineVal } = this.state;
    if (type === 1) {
      this.setState({
        firSel: val
      })
    } else {
      this.setState({
        secSel: val
      })
    }
    this.props.kyl_getKthdLine_data(params, lineVal, val, type)
  }

  render() {
    let { sortValue, lineVal, barVal, firSel, secSel } = this.state;
    let { kthd_info, kthd_anl, kthd_line, loading } = this.props.kyl_teaImage_reducer
    let { list, params } = this.props;
    // console.log('3333333333333', kthd_line)
    return (
      <div className='image_public kyl-teaImage-cont'>
        {/* <div className='scl_header'>
          <span></span>
          <span>课堂互动</span>
        </div> */}
        <div>
          {
            loading[12] ?
              <div className='kyl-ttc-cont' style={{ height: '160px' }}>
                <div className='xq-load-all'><Spin /></div>
              </div> :
              <div className='kyl-ttc-cont' style={{ height: '160px' }}>
                <Kthd_comp cond={1} data={kthd_info.stuAction}></Kthd_comp>
                {/* <div style={{ position: 'relative' }}> */}
                <Kthd_comp cond={2} data={kthd_info.teaAction}></Kthd_comp>
                {/* </div> */}
              </div>
          }

          <div>
            <div className='header' style={{ background: '#fff', padding: '20px' }}>
              <div style={{ display: 'flex', position: 'relative' }}><span>教学班对比分析</span>
                <span className='sort_svg kyl-sortSvg'>
                  <SVG
                    title={'正序'}
                    type={'de_sort3'}
                    color={sortValue === 1 ? '#1890ff' : '#a1adb3'}
                    onClick={() => this.onSort(1)}
                  />
                  <SVG
                    title={'倒序'}
                    type={'de_sort2'}
                    color={sortValue === 0 ? '#1890ff' : '#a1adb3'}
                    onClick={() => this.onSort(0)}
                  />
                </span>
                <div className='kyl-tabBtn' style={{ top: '-3px' }}>
                  <div className={barVal === '1' ? 'kyl-tabSel' : ''}
                    onClick={() => {
                      this.setState({ barVal: '1' })
                      this.props.kyl_get_kthdAnl(params, sortValue, '1');
                    }}
                  >学生起立</div>
                  <div className={barVal === '2' ? 'kyl-tabSel' : ''}
                    onClick={() => {
                      this.setState({ barVal: '2' })
                      this.props.kyl_get_kthdAnl(params, sortValue, '2');
                    }}
                  >教师上下讲台</div>
                </div>
              </div>
              <div style={{ height: '270px' }}>
                {
                  loading[13] ?
                    <div className='kyl-ttc-cont'>
                      <div className='xq-load-all'><Spin /></div>
                    </div> :
                    <div style={{ height: '100%' }}>
                      {
                        kthd_anl.xData && kthd_anl.xData.length > 0 ?
                          <Tea_btm_cont
                            clickBar={this.clickBar}
                            barData={kthd_anl}
                            barType="hd"  
                          ></Tea_btm_cont> :
                          <NoDataAndLoading></NoDataAndLoading>
                      }
                    </div>
                }
              </div>

            </div>
            <div className='header' >
              <div style={{ lineHeight: '2.5', display: 'flex', background: '#fff', padding: '20px 20px 0 20px', position: 'relative' }}>
                <div><span>课堂互动趋势</span></div>
                <div style={{ marginLeft: '144px' }} className='kyl-compare-cont'>
                  <span className='xq-compar-all-t'>全部</span>
                  &nbsp;&nbsp;&nbsp;<img src={require('../../../../media/picture/img_vs.png')} />&nbsp;&nbsp;&nbsp;
                <Select value={firSel} placeholder='请选择'
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    onChange={(val) => this.changeSel(val, 1)} style={{ width: 120 }}>
                    {
                      list.map((item, index) => {
                        return <Option value={item.teaClaId} key={index} title={item.teaClaName}>
                          {item.teaClaName}
                        </Option>
                      })
                    }
                  </Select>
                  &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
                <Select value={secSel} placeholder='请选择'
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    onChange={(val) => this.changeSel(val, 2)} style={{ width: 120 }}>
                    {
                      list.map((item, index) => {
                        return <Option value={item.teaClaId} key={index} title={item.teaClaName}>
                          {item.teaClaName}
                        </Option>
                      })
                    }
                  </Select>
                </div>
                <div className='kyl-tabBtn' style={{ top: '14px' }}>
                  <div className={lineVal === '1' ? 'kyl-tabSel' : ''}
                    onClick={() => {
                      this.setState({ lineVal: '1' })
                      //如果这里切换是否要重置sel选项？
                      if (firSel) {
                        this.props.kyl_getKthdLine_data(params, '1')
                        this.props.kyl_getKthdLine_data(params, '1', firSel, 1)
                      }
                      if (secSel) {
                        this.props.kyl_getKthdLine_data(params, '1')
                        this.props.kyl_getKthdLine_data(params, '1', secSel, 2)
                      }
                      if (!firSel && !secSel) {
                        //两个下拉都无值
                        this.props.kyl_getKthdLine_data(params, '1')
                      }
                    }}
                  >学生起立</div>
                  <div className={lineVal === '2' ? 'kyl-tabSel' : ''}
                    onClick={() => {
                      //如果这里切换是否要重置sel选项？
                      this.setState({ lineVal: '2' })
                      if (firSel) {
                        this.props.kyl_getKthdLine_data(params, '2')
                        this.props.kyl_getKthdLine_data(params, '2', firSel, 1)
                      }
                      if (secSel) {
                        this.props.kyl_getKthdLine_data(params, '2')
                        this.props.kyl_getKthdLine_data(params, '2', secSel, 2)
                      }
                      if (!firSel && !secSel) {
                        //两个下拉都无值
                        this.props.kyl_getKthdLine_data(params, '2')
                      }
                    }}
                  >教师上下讲台</div>
                </div>
              </div>
              <div style={{ height: '300px' }}>
                {
                  loading[14] ?
                    <div className='kyl-ttc-cont'>
                      <div className='xq-load-all'><Spin /></div>
                    </div> :
                    <div style={{ background: "#fff", height: '100%' }}>
                      {
                        kthd_line && kthd_line.xData.length > 0 ?
                          <XqLine
                            color={['#3385ff', '#4ecc7b', '#cfdd68']}
                            xData={kthd_line.xData}
                            data={kthd_line.data}
                            yName='次/课程'
                          /> : <NoDataAndLoading></NoDataAndLoading>
                      }
                    </div>
                }
              </div>

            </div>
          </div>

        </div>
      </div >
    )
  }
}
