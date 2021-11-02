/*
 * @Author: tj 
 * @Date: 2020-02-13 14:51:18
 * @Last Modified by: tj
 * @Last Modified time: 2021-04-20 09:43:31
 * 教学秩序总览
 */
import React, { Component } from 'react';
import { Select, Progress, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import './../../../style/tj_teachOrderView.scss';
import Swiper from 'swiper/js/swiper.js';
import 'swiper/css/swiper.css';
import SVG from './../../public/svg';
import x from './../../../util/file';
import MoreDataPieEcharts from './../../components/visual/public/MoreDataPieEcharts';
import DataPieEcharts from './../../components/visual/public/DataPieEcharts';
import { Circle, BarEchart } from './../../components/visual/public/tj-common';
import { connect } from 'react-redux';
import G from './../../../config/g'
import { getViewMore, getCollageList, getTeaAtten, getStuAtten, getTodayClass, getViewSection, getSetting } from './../../../redux/tj-teaOrderView.reducer';
import { ws_saveGlobalData } from "./../../../redux/ws-global.reducer";
const { Option } = Select;
const SizeChange = x.clientSizeChange;

const SelectList = [
  { value: "4", title: "教师考勤" },
  { value: "3", title: "到课率" },
  { value: "0", title: "前排就座率" },
  { value: "1", title: "低头率" },
  { value: "2", title: "巡课违纪率" }
]

@connect(state => state, { getViewMore, getCollageList, getTeaAtten, getStuAtten, getTodayClass, getViewSection, getSetting, ws_saveGlobalData })
@withRouter
class TeachingOrderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      selectList: SelectList, // 违纪类型下拉
      vioType: SelectList[0].value, //违纪类型默认选中
      sectionId: [],//[sessionStorage.getItem('sectionId')],
      sectionList: [],
      froneSitRate: '',
      sleepRate: '',
      attenRate: '',
      width: 33
    };
    this.loopIndex = this.loopIndex.bind(this)
    this.getCollage = this.getCollage.bind(this)
    this.getViewMore = this.getViewMore.bind(this)
    this.getSectionList = this.getSectionList.bind(this)
    this.resizeChange = this.resizeChange.bind(this)
    this.getSetting = this.getSetting.bind(this)
  }


  componentDidMount() {
    this.getSetting()
    // 获取正在直播的节次
    this.props.getViewSection({
      semesterId: G.ISCED_cutSemesterData
        && G.ISCED_cutSemesterData.semesterId
    }).then(res => {
      if (res) {
        console.log(res)
        this.setState({
          sectionId: [res]
        }, () => {
          if (this.state.sectionId[0] == '--') {
            return;
          }
          this.getSectionList()
          this.getViewMore()
          this.loopIndex()
          let { sectionId, vioType } = this.state;
          let params = {
            sectionId: sectionId[0],
            checkType: vioType
          }
          console.log(params)
          this.props.getCollageList(params).then(res => {
            if (res) {
              this.initSwiper()
              window.addEventListener('resize', this.resizeChange);
            }
          })
          // let {sectionId} = this.state;
          this.props.getTeaAtten({ sectionId: sectionId[0] })
          this.props.getStuAtten({ sectionId: sectionId[0] })
          this.props.getTodayClass({ sectionId: sectionId[0] })
        })
      } else {
        console.log(sessionStorage.getItem('sectionId'))
        this.setState({
          sectionId: sessionStorage.getItem('sectionId') !== 'undefined' ? [sessionStorage.getItem('sectionId')] : ['--']
        }, () => {
          if (this.state.sectionId[0] == '--') {
            return;
          }
          this.getSectionList()
          this.getViewMore()
          this.loopIndex()
          let { sectionId, vioType } = this.state;
          let params = {
            sectionId: sessionStorage.getItem('sectionId') ? sessionStorage.getItem('sectionId') : '',
            checkType: vioType
          }
          console.log(params)
          this.props.getCollageList(params).then(res => {
            if (res) {
              this.initSwiper()
            }
          })
          // let {sectionId} = this.state;
          this.props.getTeaAtten({ sectionId: sectionId[0] })
          this.props.getStuAtten({ sectionId: sectionId[0] })
          this.props.getTodayClass({ sectionId: sectionId[0] })
        })
      }
    })


  }

  /**
   * 获取配置项
   */
  getSetting() {
    this.props.getSetting().then((data) => {
      this.props.ws_saveGlobalData(data, "ISCED_setInfo");
      let num = 3
      let { selectList, width } = this.state

      if (data.isTeacherCheck && data.isTeacherCheck === "0") {
        // 剔除教师考勤
        selectList = _.filter(selectList, (o) => o.value !== "4")
      }
      if (data.isHeadLow && data.isHeadLow === "0") {
        // 剔除低头率
        num--
        selectList = _.filter(selectList, (o) => o.value !== "1")
      }
      if (data.isFrontRate && data.isFrontRate === "0") {
        // 剔除前排就座率
        num--
        selectList = _.filter(selectList, (o) => o.value !== "0")
      }
      if (data.ifClassroomDiscipline && data.ifClassroomDiscipline === "0") {
        // 剔除巡课违纪率
        num--
        selectList = _.filter(selectList, (o) => o.value !== "2")
      }
      // console.log("selectList", selectList)
      if (!num) {
        width = 0
      } else {
        width = Math.floor(100 / num)
      }
      console.log("widht", width)

      this.setState({
        width,
        selectList,
        vioType: selectList[0].value,
        froneSitRate: data.seatedRateUnder,
        sleepRate: data.sleepRateOver,
        attenRate: data.attenRaleUnder,
      })
    })
  }

  resizeChange() {
    this.initSwiper()
  }

  /**
   * 获得节次下拉
   */
  getSectionList() {
    if (G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.sectionList.length) {
      let curId = sessionStorage.getItem('sectionId') ? sessionStorage.getItem('sectionId') : ''
      if (curId) {
        let array = G.ISCED_cutSemesterData.sectionList.slice(0, parseInt(curId));
        //    let array=G.ISCEM_cutSemesterData.weekList.slice(0,7)
        this.setState({
          sectionList: array
        })
      }
    }
  }

  /**
   * 初始化swiper
   */
  initSwiper() {
    if (document.getElementById('swiper-cnt')) {
    } else {
      return;
    }
    let height = document.getElementById('swiper-cnt').clientHeight;
    // if (this.swiper) {
    //     this.swiper.slideTo(0, 0);
    //     this.swiper.destroy()
    //     this.swiper = null;
    // }
    this.swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      speed: 1000,
      autoplay: {
        stopOnLastSlide: true
      },
      noSwiping: true,
      height: height,
    });

  }

  /**
   * 循环高亮指标
   */
  loopIndex() {
    this.t = setTimeout(() => {
      if (this.state.activeIndex == 4) {
        this.setState({
          activeIndex: 0,
          vioType: '4'
        }, () => {
          this.loopIndex()
          this.getCollage()
        })
      } else {
        let index = this.state.activeIndex + 1;
        this.setState({
          activeIndex: index,
          vioType: index == 1 ? "3" : index == 2 ? "0" : index == 3 ? "1" : "2"
        }, () => {
          this.loopIndex()
          this.getCollage()
        })
      }

    }, 1000 * 60)
  }

  componentWillUnmount() {
    clearTimeout(this.t)
    // sessionStorage.removeItem('sectionId')
    if (this.swiper) { // 销毁swiper
      console.log('swiper destory')
      if (this.props.TJ_teaOrderView_reducer.collageList.length) {
        this.swiper.destroy(true)
        window.removeEventListener('resize', this.resizeChange);
      }
    }

  }

  /**
   * 下拉选择
   * @param {*} type 下拉类型
   * @param {*} value 选择值
   */
  selectChange(type, value) {
    this.setState({
      [type]: value
    }, () => {
      if (type == 'sectionId') {
        this.props.getViewMore({ sectionId: value })
        this.getCollage()
      } else {
        // 43012
        let activeIndex = 0;
        if (value == '4') {
          activeIndex = 0
        } else if (value == '3') {
          activeIndex = 1
        } else if (value == '0') {
          activeIndex = 2
        } else if (value == '1') {
          activeIndex = 3
        } else {
          activeIndex = 4
        }
        this.setState({
          activeIndex
        }, () => {
          clearTimeout(this.t)
          this.loopIndex()
        })
        this.getCollage()
      }

    })

  }

  /**
   * 获得ai预警、总数数据
   */
  getViewMore() {
    this.props.getViewMore({ sectionId: this.state.sectionId[0] })
  }

  /**
   * 获得开课单位数据
   */
  getCollage() {
    let { sectionId, vioType } = this.state;
    let params = {
      sectionId: sectionId[0],
      checkType: vioType
    }
    console.log(params)
    this.props.getCollageList(params).then(res => {
      if (res) {
        this.initSwiper()
      }
    })
  }

  /**
   * 跳转函数
   * @param {Number} type 跳转路由类型
   * @param {String} value 参数
   */
  goRouter(type, value, value2) {
    console.log(type, value, value2)
    let { sectionId } = this.state;
    if (Array.isArray(sectionId)) {
      sectionId = null
    }
    if (type == 1) {
      //学校画像
      this.props.history.push(`/home/img/org/${value}`)
    } else if (type == 2) {
      //明细 教学秩序 课堂考勤
      this.props.history.push(`/home/det/ordtea/${value}/null`)
    } else if (type == 3) {
      //明细 教学秩序 到课率
      this.props.history.push(`/home/det/ordclass/${value}/null/${sectionId}`)
    } else if (type == 4) {
      //明细 教学秩序 就座率
      this.props.history.push(`/home/det/ordsit/${value}/${sectionId}`)
    } else if (type == 5) {
      //明细 教学秩序 低头率
      this.props.history.push(`/home/det/ordsle/${value}/${sectionId}`)
    } else if (type == 6) {
      //明细 教学秩序 课堂违纪
      this.props.history.push(`/home/det/ordbre/${sectionId}`)
    } else if (type == 7) {
      //今日概况 学校画像
      this.props.history.push(`/home/img/org/${value}`)
    } else if (type == 8) {
      //开课单位排名 开课单位画像
      this.props.history.push(`/home/img/col/${value}`)
    } else if (type == 9) {
      //明细 教学秩序 到课率
      this.props.history.push(`/home/det/ordclass/${value2}/${value}/null`)
    } else if (type == 10) {
      //明细 教学秩序 就座率 全部节次
      this.props.history.push(`/home/det/ordsit/${value}/null`)
    } else if (type == 11) {
      //明细 教学秩序 低头率 全部节次
      this.props.history.push(`/home/det/ordsle/${value}/null`)
    } else if (type == 12) {
      //明细 教学秩序 课堂违纪 全部节次
      this.props.history.push(`/home/det/ordbre/null`)
    }
  }


  render() {
    let { activeIndex, sectionId, vioType, sectionList, froneSitRate,
      sleepRate, attenRate, selectList, width } = this.state;
    let { totalHour, teaNormalProp, attenProp, frontProp, sleepProp, vioProp,
      teaAttenHour, vioHour, frontHour, sleepHour, atten, aiWaringLeft,
      collageList, teaAtten, stuAtten, sleepPropData, frontPropData,
      vioPropData, teaLoading, stuLoading, classLoading, collageLoading,
      moreLoading } = this.props.TJ_teaOrderView_reducer;
    return (
      <div className='tj-view-wrap'>
        <div className='order-left'>
          <div className='sign'>
            <div className='sign-bg'>
              <div className='sign-point'></div>
              <div className='sign-room'></div>
            </div>
            <div className='sign-light'></div>
            <div className='total-wrap'>
              <div className='data'><span title={totalHour}>{totalHour || '-'}</span><span>节</span></div>
              <div className='select'>
                <Select dropdownClassName='tj-view' value={sectionId} onChange={this.selectChange.bind(this, 'sectionId')}>
                  {
                    sectionList && sectionList.map((item, index) => {
                      return <Option key={index} value={item.sectionId}>{item.sectionName}</Option>
                    })
                  }
                </Select>
              </div>
            </div>
            <div className='data-wrap'>
              {
                G.ISCED_setInfo && G.ISCED_setInfo.isTeacherCheck == '1'
                  ? <div className={activeIndex == 0 ? 'block-bg active' : 'block-bg'} onClick={this.goRouter.bind(this, 1, 'jskq')}>
                    <div className='block-inner' >
                      <span>教师考勤正常率</span>
                      <div>{teaNormalProp || teaNormalProp === 0 ? teaNormalProp : '-'}%</div>
                    </div>
                  </div>
                  : null
              }
              <div className={activeIndex == 1 ? 'block-bg active' : 'block-bg'} onClick={this.goRouter.bind(this, 1, 'dkl')}>
                <div className='block-inner'>
                  <span>到课率</span>
                  <div>{attenProp || attenProp === 0 ? attenProp : '-'}%</div>
                </div>
              </div>
              {
                G.ISCED_setInfo && G.ISCED_setInfo.isFrontRate == '1'
                  ? <div className={activeIndex == 2 ? 'block-bg active' : 'block-bg'} onClick={this.goRouter.bind(this, 1, 'qpjzl')}>
                    <div className='block-inner'>
                      <span>前排就座率</span>
                      <div>{frontProp || frontProp === 0 ? frontProp : '-'}%</div>
                    </div>
                  </div>
                  : null
              }
              {
                G.ISCED_setInfo && G.ISCED_setInfo.isHeadLow == '1'
                  ? <div className={activeIndex == 3 ? 'block-bg active' : 'block-bg'} onClick={this.goRouter.bind(this, 1, 'sjl')}>
                    <div className='block-inner'>
                      <span>低头率</span>
                      <div>{sleepProp || sleepProp === 0 ? sleepProp : '-'}%</div>
                    </div>
                  </div>
                  : null
              }
              {
                G.ISCED_setInfo && G.ISCED_setInfo.ifClassroomDiscipline == '1' ?
                  <div className={activeIndex == 4 ? 'block-bg active' : 'block-bg'} onClick={this.goRouter.bind(this, 1, 'ktwj')}>
                    <div className='block-inner'>
                      <span>巡课违纪率</span>
                      <div>{vioProp || vioProp === 0 ? vioProp : '-'}%</div>
                    </div>
                  </div> : ''
              }
            </div>
            <div className='data-select'>
              <Select
                dropdownClassName='tj-view'
                value={vioType}
                onChange={this.selectChange.bind(this, 'vioType')}
              >
                {
                  selectList.map(item => {
                    return <Option value={item.value} title={item.title}>{item.title}</Option>
                  })
                }
              </Select>
            </div>
            <div className='collage-wrap'>
              <div className='title'>
                <span>开课单位</span>
                <span></span>
                <span>百分比</span>
              </div>
              <div className='cnt' id='swiper-cnt'>
                {
                  collageLoading ? <Spin /> :
                    collageList.length ?
                      <div className="swiper-container">
                        <div className="swiper-wrapper">
                          {
                            collageList.length && collageList.map((item1, index1) => {
                              return (
                                <div className="swiper-slide" key={index1}>
                                  {
                                    item1.map((item, index) => {
                                      let color = {
                                        from: '#019fe9',
                                        to: '#0bc9d6',
                                      }
                                      if (index1 == 0 && index == 0) {
                                        color = {
                                          from: '#9ab928',
                                          to: '#d1731b',
                                        }
                                      } else if (index1 == 0 && index == 1) {
                                        color = {
                                          from: '#55b103',
                                          to: '#c2be0a',
                                        }

                                      } else if (index1 == 0 && index == 2) {
                                        color = {
                                          from: '#019444',
                                          to: '#0dba13',
                                        }

                                      } else {
                                        color = {
                                          from: '#019fe9',
                                          to: '#0bc9d6',
                                        }

                                      }
                                      return (
                                        <div className='list-item' key={index} onClick={this.goRouter.bind(this, 8, item.id)}>
                                          <span className='item-name' title={item.name}>{item.name}</span>
                                          <div className='item-progress'>
                                            <Progress
                                              strokeColor={color}
                                              percent={parseInt(item.prop)}
                                              showInfo={false}
                                            />
                                          </div>
                                          <span className='item-value'>{item.prop}%</span>
                                        </div>
                                      )
                                    })

                                  }

                                </div>

                              )
                            })
                          }

                        </div>
                      </div>
                      :
                      <div className='tj-noData'><SVG type='noData' /></div>

                }
              </div>
            </div>
            <div className='aiAlert-wrap'>
              {
                moreLoading ? <Spin /> :

                  <div className='center-item'>
                    <div className='center-name'>AI预警</div>
                    {
                      G.ISCED_setInfo && G.ISCED_setInfo.isSeatedRate == '1' ?
                        <div className='line1'>
                          <div className='right1' onClick={this.goRouter.bind(this, 4, froneSitRate)}>
                            <Circle type={2} data={{ name: "前排就座率", value: frontHour || '0' }} other={`低于${froneSitRate}%`} />
                          </div>
                        </div>
                        : null

                    }
                    {
                      G.ISCED_setInfo && G.ISCED_setInfo.isSleepRate == '1' ?
                        <div className='line2'>
                          <div className='right2' onClick={this.goRouter.bind(this, 5, sleepRate)}>
                            <Circle type={2} data={{ name: "低头率", value: sleepHour || '0' }} other={`高于${sleepRate}%`} />
                          </div>
                        </div>
                        : null
                    }
                    {
                      G.ISCED_setInfo && G.ISCED_setInfo.isClassDiscipline == '1' ?
                        <div className='line3'>
                          <div className='right3' onClick={this.goRouter.bind(this, 6)}>
                            <Circle type={2} data={{ name: "巡课违纪", value: vioHour || '0' }} />
                          </div>
                        </div> : ''
                    }

                    {
                      G.ISCED_setInfo && G.ISCED_setInfo.isStuOnAttRate == '1' ?
                        <div className='line4'>
                          <div className='right4' onClick={this.goRouter.bind(this, 3, attenRate)}>
                            <Circle type={1} data={{ name: "到课率", value: atten || '0' }} other={`低于${attenRate}%`} />
                          </div>
                        </div> : ''
                    }
                    {
                      G.ISCED_setInfo && G.ISCED_setInfo.isTeaAttLate == '0' && G.ISCED_setInfo.isTeaAttExchange == '0'
                        && G.ISCED_setInfo.isTeaAttLate == '0' && G.ISCED_setInfo.isTeaEarly == '0' ? null :
                        <div className='line5'>
                          <div className='left-center' >
                            <Circle type={1} data={{ name: "教师考勤异常", value: teaAttenHour || '0' }} />
                            <div className='center-circle' onClick={this.goRouter.bind(this, 2, '0')}></div>
                            {
                              aiWaringLeft ?
                                aiWaringLeft.map((item, index) => {
                                  if (!item.waringHour) {
                                    return;
                                  }
                                  let data = {
                                    name: item.waringName,
                                    value: item.waringHour
                                  }
                                  let n;
                                  if (item.waringName == '教师缺勤') {
                                    n = '4';
                                    if (G.ISCED_setInfo && G.ISCED_setInfo.isTeaAttLate == '1') {
                                      return (
                                        <div className={'line' + (parseInt(index) + 6)} key={index}>
                                          <div className={'left' + (parseInt(index) + 1)} onClick={this.goRouter.bind(this, 2, n)}>
                                            <Circle type={1} data={data} />
                                          </div>
                                        </div>
                                      )
                                    }

                                  } else if (item.waringName == '教师调课') {
                                    n = '5';
                                    if (G.ISCED_setInfo && G.ISCED_setInfo.isTeaAttExchange == '1') {
                                      return (
                                        <div className={'line' + (parseInt(index) + 6)} key={index}>
                                          <div className={'left' + (parseInt(index) + 1)} onClick={this.goRouter.bind(this, 2, n)}>
                                            <Circle type={1} data={data} />
                                          </div>
                                        </div>
                                      )
                                    }
                                  } else if (item.waringName == '教师迟到') {
                                    n = '2';
                                    if (G.ISCED_setInfo && G.ISCED_setInfo.isTeaAttLate == '1') {
                                      return (
                                        <div className={'line' + (parseInt(index) + 6)} key={index}>
                                          <div className={'left' + (parseInt(index) + 1)} onClick={this.goRouter.bind(this, 2, n)}>
                                            <Circle type={1} data={data} />
                                          </div>
                                        </div>
                                      )
                                    }
                                  } else if (item.waringName == '教师早退') {
                                    n = '3';
                                    if (G.ISCED_setInfo && G.ISCED_setInfo.isTeaEarly == '1') {
                                      return (
                                        <div className={'line' + (parseInt(index) + 6)} key={index}>
                                          <div className={'left' + (parseInt(index) + 1)} onClick={this.goRouter.bind(this, 2, n)}>
                                            <Circle type={1} data={data} />
                                          </div>
                                        </div>
                                      )
                                    }
                                  }
                                }) : ''
                            }
                          </div>
                        </div>

                    }

                  </div>

              }
            </div>
          </div>
        </div>
        <div className='order-right'>
          <div className='right-title'>
            <span>今日概况</span>
          </div>
          {
            G.ISCED_setInfo && G.ISCED_setInfo.isTeacherCheck === '1'
              ? <div className='block-wrap'>
                <div className='block-tit'>
                  <span className='tit'>教师考勤</span>
                </div>
                <div className='block-cnt'>
                  {
                    teaLoading ? <Spin /> :
                      <>
                        <div className='item' onClick={this.goRouter.bind(this, 7, 'jskq')}>
                          <div className='item-tit'>正常率</div>
                          <div className='item-cnt'>
                            {
                              teaAtten.normalProp ?

                                <MoreDataPieEcharts
                                  center={["50%", "50%"]}
                                  color={[teaAtten.sortType == 1 ? "#03bf84" : teaAtten.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                                  data={teaAtten.normalProp}
                                  changeProp={teaAtten.changeProp}
                                  up={teaAtten.sortType}
                                />

                                :
                                <div className='tj-noData'><SVG type='noData' /></div>
                            }

                          </div>
                          <div className='item-oth'>较上周同期</div>

                        </div>
                        <div className='item2'>
                          <div className='item-tit'>异常分布</div>
                          <div className='item-cnt'>
                            {
                              teaAtten.pieData.length ?
                                <BarEchart
                                  type={0}
                                  goRouter={this.goRouter.bind(this)}
                                  data={teaAtten.pieData}
                                  color={[{
                                    start: 'rgba(217,127,39,0)',
                                    end: 'rgb(217,127,39)'
                                  }, {
                                    start: 'rgba(219,55,90,0)',
                                    end: 'rgb(219,55,90)'
                                  }, {
                                    start: 'rgba(229,78,37,0)',
                                    end: 'rgb(229,78,37)'
                                  }, {
                                    start: 'rgba(222,44,68,0)',
                                    end: 'rgb(222,44,68)'
                                  }]} />
                                : <div className='tj-noData'><SVG type='noData' /></div>
                            }
                          </div>
                        </div>
                      </>
                  }
                </div>
              </div>
              : null
          }
          <div className='block-wrap' >
            <div className='block-tit'>
              <span className='tit'>学生到课率</span>
            </div>
            <div className='block-cnt'>
              {
                stuLoading ? <Spin /> :
                  <>
                    <div className='item' onClick={this.goRouter.bind(this, 7, 'dkl')}>
                      <div className='item-tit'>到课率</div>
                      <div className='item-cnt'>
                        {
                          stuAtten.attenProp ?
                            <MoreDataPieEcharts
                              center={["50%", "50%"]}
                              color={[stuAtten.sortType == 1 ? "#03bf84" : stuAtten.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                              data={stuAtten.attenProp}
                              changeProp={stuAtten.changeProp}
                              up={stuAtten.sortType}
                            />
                            : <div className='tj-noData'><SVG type='noData' /></div>
                        }
                      </div>
                      <div className='item-oth'>较上周同期</div>

                    </div>
                    <div className='item2'>
                      <div className='item-tit'>到课率分布</div>
                      <div className='item-cnt'>
                        {
                          stuAtten.pieData.length ?
                            <BarEchart
                              goRouter={this.goRouter.bind(this)}
                              type={1}
                              data={stuAtten.pieData}
                              color={[{
                                start: 'rgba(3,191,132,0)',
                                end: 'rgb(3,191,132)'
                              }, {
                                start: 'rgba(211,120,47,0)',
                                end: 'rgb(211,120,47)'
                              }, {
                                start: 'rgba(222,75,28,0)',
                                end: 'rgb(222,75,28)'
                              }, {
                                start: 'rgba(225,38,65,0)',
                                end: 'rgb(225,38,65)'
                              }, {
                                start: 'rgba(217,53,88,0)',
                                end: 'rgb(217,53,88)'
                              }]} />
                            : <div className='tj-noData'><SVG type='noData' /></div>
                        }
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>
          {
            width
              ? <div className='block-wrap3' >
                {
                  classLoading ? <Spin /> :
                    <>
                      {
                        G.ISCED_setInfo && G.ISCED_setInfo.isFrontRate == '1' ?
                          <div className='block' style={{ width: `${width}%` }} >
                            <div className='block-tit' onClick={this.goRouter.bind(this, 7, 'qpjzl')}>前排就座率</div>
                            <div className='block-cnt'>
                              {
                                frontPropData.objProp ?
                                  <MoreDataPieEcharts
                                    center={["50%", "50%"]}
                                    color={[frontPropData.sortType == 1 ? "#03bf84" : frontPropData.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                                    data={frontPropData.objProp}
                                    changeProp={frontPropData.changeProp}
                                    up={frontPropData.sortType}
                                  />
                                  : <div className='tj-noData'><SVG type='noData' /></div>
                              }

                            </div>
                            <div className='block-other'>较上周同期</div>
                            <div
                              className='block-data'
                              style={
                                (width === 50)
                                  ? { paddingLeft: '37%' }
                                  : (width === 100)
                                    ? { paddingLeft: '44%' }
                                    : null
                              }>
                              <div onClick={this.goRouter.bind(this, 10, 90)}><span className='data'>{frontPropData.objHour || '-'}</span>课程</div>
                              <div title={`前排就座率低于${froneSitRate}%`}>前排就座率低于{froneSitRate}%</div>
                            </div>
                          </div>
                          : ''
                      }
                      {
                        G.ISCED_setInfo && G.ISCED_setInfo.isHeadLow == '1' ?
                          <div className='block' style={{ width: `${width}%` }} >
                            <div className='block-tit' onClick={this.goRouter.bind(this, 7, 'sjl')}>低头率</div>
                            <div className='block-cnt'>
                              {
                                sleepPropData.objProp ?
                                  <MoreDataPieEcharts
                                    center={["50%", "50%"]}
                                    color={[sleepPropData.sortType == 1 ? "#03bf84" : sleepPropData.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                                    data={sleepPropData.objProp}
                                    changeProp={sleepPropData.changeProp}
                                    up={sleepPropData.sortType}
                                  />
                                  : <div className='tj-noData'><SVG type='noData' /></div>
                              }

                            </div>
                            <div className='block-other'>较上周同期</div>
                            <div
                              className='block-data'
                              style={
                                (width === 50)
                                  ? { paddingLeft: '37%' }
                                  : (width === 100)
                                    ? { paddingLeft: '44%' }
                                    : null
                              }
                            >
                              <div onClick={this.goRouter.bind(this, 11, 15)}><span className='data'>{sleepPropData.objHour || '-'}</span>课程</div>
                              <div title={`低头率低于${sleepRate}%`}>低头率高于{sleepRate}%</div>
                            </div>
                          </div>
                          : ''
                      }
                      {
                        G.ISCED_setInfo && G.ISCED_setInfo.ifClassroomDiscipline == '1' ?
                          <div className='block' style={{ width: `${width}%` }}>
                            <div className='block-tit' onClick={this.goRouter.bind(this, 7, 'ktwj')}>巡课违纪率</div>
                            <div className='block-cnt'>
                              {
                                vioPropData.objProp ?
                                  <MoreDataPieEcharts
                                    center={["50%", "50%"]}
                                    color={[vioPropData.sortType == 1 ? "#03bf84" : vioPropData.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                                    data={vioPropData.objProp}
                                    changeProp={vioPropData.changeProp}
                                    up={vioPropData.sortType}
                                  />
                                  : <div className='tj-noData'><SVG type='noData' /></div>
                              }

                            </div>
                            <div className='block-other'>较上周同期</div>
                            <div
                              className='block-data'
                              style={
                                (width === 50)
                                  ? { paddingLeft: '37%' }
                                  : (width === 100)
                                    ? { paddingLeft: '44%' }
                                    : null
                              }>
                              <div onClick={this.goRouter.bind(this, 12)}><span className='data'>{vioPropData.objHour || '-'}</span>课程</div>
                              <div title='巡课违纪率'>巡课违纪</div>
                            </div>
                          </div>
                          : ''
                      }

                    </>
                }
              </div>
              : ""
          }

        </div>
        {/* <div style={{width:'120px'}}>
                <GaugeEchart data={{total:10,finished:5,title:'完成率',fontColor:'#00fefb',dataColor:'#03bd83'}}/>
                </div>
                <div style={{width:'220px',height:'200px'}}>
                <RadarEchart data={this.state.radarData}/>
                </div>
                <div>
                    <Circle data={{name:'教师考勤异常',value:0}}/>
                </div> */}
      </div>
    );
  }
}

export default TeachingOrderView;