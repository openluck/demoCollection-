/*
 * @Author: kyl 
 * @Date: 2020-02-12 13:06:00 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 16:20:07
 * cond 1到课率  2前排就座率  3低头率  4违纪课堂
 */

import React, { Component } from 'react'
import SVG from '../../../public/svg';
import '../../../../style/tea_than_comp.scss';
import { Spin } from 'antd';
import { request } from '../../../../util/request';
import _ from 'lodash';
import ColorsPieEcharts from '../public/ColorsPieEcharts';
import Tea_btm_cont from '../public/tea_btm_cont';
import Tea_than_comp from '../tea_image/tea_than_comp';
import XqLine from './../public/xqLine.js'
import G from './../../../../config/g';
import NoDataAndLoading from '../public/noDataAndLoading';
import { Select } from 'antd'
import { connect } from 'react-redux';
import U from './../../../../util/_util'
import { jumpFun } from './../public/jumpFun'
import { withRouter } from 'react-router-dom';

const getMonthDate = U.getMonthDate

const { Option } = Select;
class Dkl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortValue: 0,
      firSel: undefined,     //第一个下拉
      secSel: undefined,     //第二个下拉
      dklRate: '',
      dkl: {
        normalProp: 0,
        rank: 0,
        checkProp: {
          name: '',
          changeProp: 0,
          sortType: '0'
        },
        abnormalHour: 0,
        attenPie: [],
        classPie: []
      },       //基础信息和异常
      dkl_anl: {
        xData: [],
        yData: []
      },       //分析对比
      dkl_line: {
        xData: [],
        data: []
      },       //趋势
    }
  }

  componentDidMount() {
    // console.log(this.props.cond === 1);
    let { cond } = this.props;
    let propParams = this.props.params;
    this.setState({
      params: propParams
    })
    let $cond = String(cond)
    // console.log(cond)
    if (G.ISCED_setInfo) {
      switch ($cond) {
        case '1':
          this.setState({
            dklRate: G.ISCED_setInfo.attenRaleUnder || '--'
          })
          break;
        case '2':
          this.setState({
            dklRate: G.ISCED_setInfo.seatedRateUnder || '--'
          })
          break;
        case '3':
          this.setState({
            dklRate: G.ISCED_setInfo.sleepRateOver || '--'
          })
          break;
      }
    }

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
    this.dklReq(propParams);
  }


  dklReq = (propParams) => {
    let { sortValue } = this.state;
    this.kyl_get_dkl_info(propParams);
    this.kyl_get_dklAnl(propParams, sortValue);
    this.kyl_getDklLine_data(propParams);
  }

  //获取到课率基本信息和异常分析
  kyl_get_dkl_info = (params) => {
    let { cond } = this.props;
    let add = this.serveAdd(cond, 1)
    this.setState({ jcxx_loading: true })
    request(add, params, (res) => {
      if (res.result && res.data) {
        this.setSt(cond, 1, res.data)
      } else {
        this.setSt(cond, 1, {})
        message.warn(res.message)
      }
      this.setState({ jcxx_loading: false })
    }, () => {
      this.setSt(cond, 1, {})
      this.setState({ jcxx_loading: false })
    })
  }

  setSt = (cond, type, val) => {
    switch (type) {
      case 1:
        this.setState({ dkl: val })
        break;
      case 2:
        this.setState({ dkl_anl: val })
        break;
      case 3:
        this.setState({ dkl_line: val })
        break;
    }
  }

  /**
     * 到课率，前排就座率，低头率，巡课违纪跳转明细
     * @param {Number} ind 下标
     */
  goRouter = (ind) => {
    let { dkl } = this.state
    let { params, cond } = this.props
    let info = dkl.attenPie[ind] // 选中模块数据
    console.log('params', params, info)
    let start, end, max, min
    if (cond !== 4) {
      // 获取到课率，前排就座率，低头率的最大最小值
      let data = jumpFun(info.name)
      if (data && data.length) {
        min = data[0] || null
        max = data[1] || null
      }
    }
    if (params.timeType === '1') {
      // 具体日期
      start = new Date(params.selTime).getTime();
      end = new Date(params.selTime).getTime()
    } else if (params.timeType === '2') {
      // 具体周次
      let t = _.find(G.ISCED_cutSemesterData.weekList, o => o.weekId === params.selTime)
      if (t) {
        start = t.startTime
        end = t.endTime
      }
    } else if (params.timeType === '3') {
      // 具体月份
      let arr = getMonthDate(params.selTime)
      if (arr.length) {
        start = new Date(arr[0]).getTime()
        end = new Date(arr[1]).getTime()
      }
    }

    switch (cond) {
      case 1: //到课率
        this.props.history.push(`/home/det/ordclass/${max}/${min}/null/${start}/${end}/${params.collegeId}/${params.teacherId}/null/${params.semesterId}/${params.couTypeId}`)
        break
      case 2: //前排就座率
        this.props.history.push(`/home/det/ordsit/${max}/null/${min}/${start}/${end}/${params.collegeId}/${params.teacherId}/null/${params.semesterId}/${params.couTypeId}`)
        break
      case 3: //低头率
        this.props.history.push(`/home/det/ordsle/${min}/null/${max}/${start}/${end}/${params.collegeId}/${params.teacherId}/null/${params.semesterId}/${params.couTypeId}`)
        break
      case 4: //巡课违纪
        this.props.history.push(`/home/det/ordbre/null/${start}/${end}/${params.collegeId}/${params.teacherId}/null/${params.semesterId}/${params.couTypeId}`)
        break
    }

  }

  //后端地址
  serveAdd = (cond, type) => {
    let add = '';
    switch (type) {
      case 1:
        if (cond === 1) {
          add = '/api/image/getTeacherToClass'
        } else if (cond === 2) {
          add = '/api/image/getTeacherSea'
        } else if (cond === 3) {
          add = '/api/image/getTeacherSleep'
        } else if (cond === 4) {
          add = '/api/image/getTeacherClassDis'
        }
        return add
      case 2:
        if (cond === 1) {
          add = '/api/image/getTeacherToClassAna'
        } else if (cond === 2) {
          add = '/api/image/getTeacherSeaAna'
        } else if (cond === 3) {
          add = '/api/image/getTeacherSleepAna'
        } else if (cond === 4) {
          add = '/api/image/getTeacherClassDisAna'
        }
        return add
      case 3:
        if (cond === 1) {
          add = '/api/image/getTeacherToClassTrend'
        } else if (cond === 2) {
          add = '/api/image/getTeacherSeaTrend'
        } else if (cond === 3) {
          add = '/api/image/getTeacherSleepTrend'
        } else if (cond === 4) {
          add = '/api/image/getTeacherClassDisTrend'
        }
        return add
    }
  }

  //获取到课率对比分析数据
  kyl_get_dklAnl = (params, sortType) => {
    let { cond } = this.props;
    let add = this.serveAdd(cond, 2)
    let param = {
      ...params,
      sortType,
    }
    this.setState({ anl_loading: true })
    request(add, param, (res) => {
      if (res.result && res.data) {
        let xData = [], yData = [];
        res.data.map((it, idx) => {
          xData.push(it.teaClaName);
          yData.push(it.rate);
        })
        this.setSt(cond, 2, { xData, yData, oData: res.data })
      } else {
        this.setSt(cond, 2, { xData: [], yData: [], oData: [] })
      }
      this.setState({ anl_loading: false })
    }, () => {
      this.setSt(cond, 2, { xData: [], yData: [], oData: [] })
      this.setState({ anl_loading: false })
    })
  }

  //获取到课率趋势数据 list 第几条数据
  kyl_getDklLine_data = (params, checkClassId, type) => {
    let { cond } = this.props;
    let add = this.serveAdd(cond, 3)
    let hasEData = _.cloneDeep(this.state.dkl_line.data);


    let param = {
      ...params,
      checkClassId: checkClassId || ''
    }
    this.setState({ line_loading: true })
    request(add, param, (res) => {
      if (res.result && res.data && res.data.lineList && res.data.lineList.length) {
        let xData = [], list = [], data = [];
        res.data.lineList.map((it, idx) => {
          xData.push(it.name)
          list.push(it.prop)
        })

        let dklData = {
          xData,
          data: [
            ...hasEData
          ]
        }
        if (type) {

          //新增填充
          let lastLine = _.cloneDeep(this.state.dkl_line);
          dklData.xData = lastLine.xData;
          let newlist = new Array(lastLine.xData.length).fill('--');

          if (xData.length && lastLine.xData && lastLine.xData.length) {
            xData.map((v, k) => {
              lastLine.xData.map((inV, inK) => {
                if (v === inV) {
                  newlist[inK] = list[k]
                }
              })
            })
          }

          dklData.data.splice(type, 1, {
            name: res.data.name,
            list: newlist,
            colId: res.data.id
          })
        } else {
          dklData.data.push({
            name: res.data.name,
            list: list,
            colId: res.data.id
          })
        }
        this.setSt(cond, 3, dklData)
      }
      // else {
      //   this.setSt(cond, 3, { xData: [], data: [] })
      // }
      this.setState({ line_loading: false })
    }, () => {
      this.setSt(cond, 3, { xData: [], data: [] })
      this.setState({ line_loading: false })
    })
  }

  componentDidUpdate() {
    let propParams = this.props.params;
    let { params } = this.state;
    if (JSON.stringify(propParams) !== JSON.stringify(params)) {
      console.log('状态改变了')
      this.setState({
        params: propParams,
        sortValue: 2,
        firSel: undefined,     //第一个下拉
        secSel: undefined,     //第二个下拉
      })
      if (G.ISCED_setInfo) {
        switch (this.props.cond) {
          case '1':
            this.setState({
              dklRate: G.ISCED_setInfo.attenRaleUnder || '--'
            })
            break;
          case '2':
            this.setState({
              dklRate: G.ISCED_setInfo.seatedRateUnder || '--'
            })
            break;
          case '3':
            this.setState({
              dklRate: G.ISCED_setInfo.sleepRateOver || '--'
            })
            break;
        }
      }
      this.dklReq(propParams)
    }
  }

  //切换排序
  onSort = (val) => {
    let { params } = this.state;
    this.setState({
      sortValue: val
    })
    this.kyl_get_dklAnl(params, val)
  }

  //选择教学班
  changeSel = (val, type) => {
    let { params } = this.state;
    if (type === 1) {
      this.setState({
        firSel: val
      })
    } else {
      this.setState({
        secSel: val
      })
    }
    this.kyl_getDklLine_data(params, val, type)
  }

  //获取最大值
  getMax1 = (data) => {
    if (data.length) {
      let list = []
      data.map((v, k) => {
        if (typeof v === 'number') {
          list.push(v)
        }
      })
      return Math.max(...list)
    } else {
      return 100
    }
  }
  //获取最大值
  getmax = (data) => {
    console.log(data, 'xxxxx')
    if (data && data.length) {
      let first = data[0] ? data[0].list : [0]
      let sec = data[1] ? data[1].list : [0]
      let thr = data[2] ? data[2].list : [0]
      let max = Math.max(...[this.getMax1(first), this.getMax1(sec), this.getMax1(thr)])
      return max
    } else {
      return 100
    }


  }

  render() {
    let { type, cond, list } = this.props;
    let { sortValue, firSel, secSel, jcxx_loading, anl_loading, line_loading,
      dkl, dkl_anl, dkl_line, dklRate
    } = this.state;
    let titleName = cond === 1 ? '到课率' : cond === 2 ? '前排就座率' : cond === 3 ? '低头率' : '违纪课堂'
    let data = dkl
    let anl = dkl_anl
    let line = dkl_line
    return (
      <div
        className='image_public dkl kyl-teaImage-cont'
      >
        {
          jcxx_loading ?
            <div className='kyl-ttc-cont' style={{ height: '270px' }}>
              <div className='xq-load-all'><Spin /></div>
            </div> :
            <div className='kyl-ttc-cont' style={{ height: '270px' }}>
              <Tea_than_comp type='2' cond={cond} data={data}></Tea_than_comp>
              <div style={{ position: 'relative' }}>
                <p className='kyl-ttc-pieTi'>{titleName}分布</p>
                <div style={{ height: 'calc(100% - 41px)' }}>
                  {
                    JSON.stringify(data) !== '{}' && data.attenPie.length > 0 ?
                      (
                        cond === 4 ?
                          <ColorsPieEcharts
                            title="次"
                            color={[
                              "#3aa1ff",
                              "#f47a8f",
                              "#eed46d",
                              "#4ecb73",
                              "#975fe5"
                            ]}//每一个，对应scaleData对应下标的颜色
                            // titleSize={16}
                            // titleSubSize={10}
                            radius={[50, 65]}
                            scaleData={data && data.attenPie}
                            goRouter={this.goRouter}
                          /> :
                          cond == 1 ?
                            <ColorsPieEcharts
                              title="课程"
                              color={
                                //   [
                                //   "rgb(214,53,87)","rgb(224,38,65)", "rgb(223,75,29)", "rgb(213,121,48)", "rgb(15,171,127)"
                                // ]
                                [
                                  "#4ecb73",
                                  "#eed46d",
                                  "#f47a8f",
                                  "#3aa1ff",
                                  "#975fe5",
                                ]
                              }//每一个，对应scaleData对应下标的颜色
                              // titleSize={16}
                              // titleSubSize={10}
                              radius={[50, 65]}
                              // type={1} //  1 2 不传type 3种样式
                              scaleData={data && data.attenPie}
                              goRouter={this.goRouter}
                            />
                            :
                            <ColorsPieEcharts
                              title="课程"//title="人次" title="%"
                              color={[
                                "#3aa1ff",
                                "#f47a8f",
                                "#eed46d",
                                "#4ecb73",
                                "#975fe5"
                              ]}//每一个，对应scaleData对应下标的颜色
                              // titleSize={16}
                              // titleSubSize={10}
                              radius={[50, 65]}
                              // type={1} //  1 2 不传type 3种样式
                              scaleData={data && data.attenPie}
                              goRouter={this.goRouter}
                            />
                      ) : <NoDataAndLoading></NoDataAndLoading>
                  }
                </div>
              </div>
            </div>
        }
        <div>

          <div className='header' style={{ padding: '20px' }}>
            <div style={{ display: 'flex', fontSize: 15 }}><span>教学班对比分析</span>
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
            </div>
            <div style={{ height: '270px' }}>
              {
                anl_loading ?
                  <div className='xq-load-all'><Spin /></div>
                  :
                  <div style={{ height: '100%' }}>
                    {
                      anl && anl.xData.length > 0 ?
                        <Tea_btm_cont
                          clickBar={this.clickBar}
                          barData={anl}
                        ></Tea_btm_cont> : <NoDataAndLoading></NoDataAndLoading>
                    }
                  </div>
              }
            </div>

          </div>


          <div className='header' >
            <div style={{ lineHeight: '2.5', display: 'flex', background: '#fff', padding: '20px 20px 0 20px', fontSize: 15 }}>
              <div><span>{titleName}趋势</span></div>
              <div style={{ marginLeft: '144px' }} className='kyl-compare-cont'>
                <span className='xq-compar-all-t'>全部</span>
                &nbsp;&nbsp;&nbsp;<img src={require('../../../../media/picture/img_vs.png')} />&nbsp;&nbsp;&nbsp;
                  <Select value={firSel} placeholder='请选择'
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  onChange={(val) => this.changeSel(val, 1)} style={{ width: 120 }}>
                  {
                    list.map((item, index) => {
                      return <Option disabled={item.teaClaId == secSel ? true : false} value={item.teaClaId} key={index} title={item.teaClaName}>
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
                      return <Option disabled={item.teaClaId == firSel ? true : false} value={item.teaClaId} key={index} title={item.teaClaName}>
                        {item.teaClaName}
                      </Option>
                    })
                  }
                </Select>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              {
                line_loading ?
                  <div className='xq-load-all'><Spin /></div>
                  :
                  <div style={{ background: "#fff", height: '100%' }}>
                    {
                      line && line.xData.length > 0 ?
                        <XqLine
                          color={['#3385ff', '#4ecc7b', '#cfdd68']}
                          xData={line.xData}
                          data={line.data}
                          max={this.getmax(line.data)}
                        /> : <NoDataAndLoading></NoDataAndLoading>
                    }
                  </div>
              }
            </div>

          </div>
        </div>
        <div className='header' >
          <div style={{ lineHeight: '2.5', display: 'flex', background: '#fff', padding: '20px', fontSize: 15 }}>
            <div><span>{titleName}{cond === 4 ? '' : cond === 3 ? `高于${dklRate}%课堂分析` : `低于${dklRate}%课堂分析`}</span></div>
          </div>
          <div style={{ height: '270px' }}>
            {
              jcxx_loading ?
                <div className='kyl-ttc-cont'>
                  <div className='xq-load-all'><Spin /></div>
                </div> :
                <div className='kyl-ttc-cont kyl-ttc-analyse' style={{ height: '220px' }}>
                  <Tea_than_comp type='3' cond={cond} data={data}></Tea_than_comp>
                  <div style={{ position: 'relative' }}>
                    <div className='kyl-ttc-pieTi'>教学班分布</div>
                    <div style={{ height: 'calc(100% - 0px)' }}>
                      {
                        JSON.stringify(data) !== '{}' && data.classPie.length > 0 ?
                          <ColorsPieEcharts
                            title="课程"//title="人次" title="%"
                            other={data.classPie.length > 5 ? 5 : false}
                            color={[
                              '#e8af6a',
                              '#ebcd54',
                              '#56bbee',
                              '#7bd9e3'
                            ]}//每一个，对应scaleData对应下标的颜色
                            titleSize={15}
                            titleSubSize={10}
                            radius={[40, 50]}
                            type={2} //  1 2 不传type 3种样式
                            scaleData={data && data.classPie}
                          /> : <NoDataAndLoading></NoDataAndLoading>
                      }
                    </div>
                  </div>
                </div>
            }
          </div>

        </div>
      </div>
    )
  }
}

export default withRouter(connect(state => state, {})(Dkl))
