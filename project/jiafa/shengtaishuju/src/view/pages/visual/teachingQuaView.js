/*
 * @Author: tj 
 * @Date: 2020-02-13 14:51:18
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-22 17:13:39
 * 教学秩序总览
 */
import React, { Component } from 'react';
import { Select, Progress, Spin } from 'antd';
import Swiper from 'swiper/js/swiper.js';
import { withRouter } from 'react-router-dom';
import 'swiper/css/swiper.css';
import x from './../../../util/file';
import SVG from './../../public/svg';
import MoreDataPieEcharts from './../../components/visual/public/MoreDataPieEcharts';
import ColorsPieEcharts from './../../components/visual/public/ColorsPieEcharts';
import { connect } from 'react-redux';
import G from './../../../config/g'
import { getQuaTotal, getQuaAnaly, getQuaResponse, getQuaAnalyAi, getQuaResponseAi, getQuaTotalToday, getViewSection } from './../../../redux/tj-teaQuaView.reducer'
import { GaugeEchart, RadarEchart, Circle } from './../../components/visual/public/tj-common'
const { Option } = Select;
const SizeChange = x.clientSizeChange;
import './../../../style/tj_teachQuaView.scss'
@withRouter
@connect(state => state, { getQuaTotal, getViewSection, getQuaAnaly, getQuaResponse, getQuaAnalyAi, getQuaResponseAi, getQuaTotalToday })
class TeachingQuaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radarData: [
        { name: '愤怒', value: 50 },
        { name: '快乐', value: 50 },
        { name: '中性', value: 80 },
        { name: '伤心', value: 70 },
        { name: '卑微', value: 70 },
        { name: '难过', value: 90 },
        { name: '惊讶', value: 100 },
      ],
      sectionList: [],
      sectionId: [],
      froneSitRate: '',
      sleepRate: '',
      attenRate: ''
    };
    this.getQuaView = this.getQuaView.bind(this)
    this.getRaduisAndLength = this.getRaduisAndLength.bind(this)
    this.getSectionList = this.getSectionList.bind(this)
    this.getSetting = this.getSetting.bind(this)
  }

  componentDidMount() {
    this.props.getViewSection({ semesterId: G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.semesterId }).then(res => {
      if (res) {
        console.log(res)
        this.setState({
          sectionId: res !== 'null' && res !== 'undefined'
            ? [res] : ['--']
        }, () => {
          this.getSectionList()
          // if(this.state.sectionId[0]=='--'){
          //   return;
          // }

        })
      } else {
        this.setState({
          sectionId: ['--']
        })
      }
    })

    this.getSetting()

    // this.props.getQuaTotalToday()
  }

  /**
 * 获取配置项
 */
  getSetting() {
    if (G.ISCED_setInfo) {
      this.setState({
        froneSitRate: G.ISCED_setInfo.seatedRateUnder,
        sleepRate: G.ISCED_setInfo.sleepRateOver,
        attenRate: G.ISCED_setInfo.attenRaleUnder,
      })
    }
  }

  /**
* 获得节次下拉
*/
  getSectionList() {
    if (G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.sectionList.length) {
      let curId = sessionStorage.getItem('sectionId') !== 'undefined' ? sessionStorage.getItem('sectionId') : ''
      console.log(curId)
      if (curId) {
        let array = []
        // if (curId == '1') {
        //     array = G.ISCED_cutSemesterData.sectionList.slice(0, parseInt(curId))
        // } else {
        //     array = G.ISCED_cutSemesterData.sectionList.slice(0, parseInt(curId) - 1)
        // }
        array = G.ISCED_cutSemesterData.sectionList.slice(0, parseInt(curId))
        this.setState({
          sectionList: array,
          sectionId: [sessionStorage.getItem('endSectionId') == 'undefined' ? curId : sessionStorage.getItem('endSectionId')] || ['--']
        }, () => {
          if (this.state.sectionId[0] !== '--') {
            this.getRaduisAndLength()
            this.getQuaView()
            this.props.getQuaAnalyAi()
            this.props.getQuaResponseAi()
            this.props.getQuaTotalToday()
          }
        })
      }
    }
  }

  /**
   * 通过节次请求的数据
   */
  getQuaView() {
    let { sectionId } = this.state;
    let params = {
      sectionId: sectionId[0]
    }
    console.log(params)
    this.getRaduisAndLength()
    this.props.getQuaTotal(params)
    this.props.getQuaAnaly(params)
    this.props.getQuaResponse(params)

  }


  /**
   * 跳转函数
   * @param {*} type 
   * @param {*} value 
   */
  goRouter(type, value) {
    let { sectionId } = this.state;
    // let sectionId = sessionStorage.getItem('sectionId')
    if (type == 1) {
      //学校画像
      this.props.history.push(`/home/img/org/${value}`)
    } else if (type == 2) {
      console.log(sectionId)
      let $sectionId = ''
      //明细结果 教学分析
      if (sectionId && sectionId.length && sectionId[0] !== '--') {
        $sectionId = sectionId[0]
      } else {
        $sectionId = null
      }
      this.props.history.push(`/home/det/quaanaly/${value}/${$sectionId}`)
    }
  }

  /**
   * 下拉选择
   * @param {*} value 
   */
  selectChange(value) {
    this.setState({
      sectionId: value
    }, () => {
      this.getQuaView()
    })
  }

  /**
   * 各模块兼容性匹配
   */
  getRaduisAndLength() {
    let screenWidth = window.screen.width;
    console.log(screenWidth)
    let range = 1;
    let length = 20, length2 = 70
    if (screenWidth >= 1366) {
      range = 0.5
      length = 15
      length2 = 50
    }
    if (screenWidth > 1600) {
      range = 0.8;
      length = 15
      length2 = 60
    }
    if (screenWidth >= 1920) {
      range = 0.8
      length = 15
      length2 = 50
    }
    if (screenWidth > 2048) {
      range = 1.2
    }
    if (screenWidth > 2400) {
      range = 1.4
    }
    if (screenWidth > 2900) {
      range = 1.5
    }
    if (screenWidth > 3100) {
      range = 1.6
      length = 15
      length2 = 45
    }
    if (screenWidth >= 3800) {
      range = 2
    }
    console.log(range)
    this.setState({
      range,
      length,
      length2
    })
  }

  render() {

    let { sectionId, range, length, length2, sectionList, froneSitRate, sleepRate, attenRate } = this.state;
    let { totalHour, stuStand, teaGo, teaDesgin, stuResponse,
      aiStuResponse, aiTeaDesgin, stuStandToday, teaPatrol,
      analyLoading, responseLoading, analyLoadingAi, responseLoadingAi

    } = this.props.TJ_teaQuaView_reducer
    console.log(teaDesgin.behaviorList)
    return (
      <div className='tj-view-wrap'>
        <div className='qua-left'>
          <div className='sign'>
            <div className='sign-bg'>
              <div className='sign-point'></div>
              <div className='sign-room'></div>
            </div>
            <div className='sign-light'></div>
            <div className='total-wrap'>
              <div className='data'><span title={totalHour}>{totalHour || '-'}</span><span>节</span></div>
              <div className='select'>
                <Select dropdownClassName='tj-view' value={sectionId} onChange={this.selectChange.bind(this)}>
                  {
                    sectionList && sectionList.map((item, index) => {
                      return <Option key={index} value={item.sectionId}>{item.sectionName}</Option>
                    })
                  }
                </Select>
              </div>
            </div>
            {/* v1.21版本删除 */}
            {/* <div className='data-wrap'>
                            <div className='block-bg' onClick={this.goRouter.bind(this, 1, 'kthd')}>
                                <div className='block-inner'>
                                    <span>学生起立</span>
                                    <div><span className='data'>{stuStand || '-'}</span>次/课程</div>
                                </div>
                            </div>
                            <div className='block-bg' onClick={this.goRouter.bind(this, 1, 'kthd')}>
                                <div className='block-inner'>
                                    <span>教师上下讲台</span>
                                    <div><span className='data'>{teaGo || '-'}</span>次/课程</div>
                                </div>
                            </div>
                        </div> */}
            <div className='teaAnalysis-wrap'>
              {
                analyLoading ? <Spin /> :
                  <>
                    {/* v1.21版本删除 */}
                    {/* <div className='tea-block' onClick={this.goRouter.bind(this, 1, 'jxfx')}>
                      <span className='tea-title'>教师行为</span>
                      <div className='tea-cnt'>
                        {
                          teaDesgin.behaviorList.length ?
                            <ColorsPieEcharts
                              title='%'
                              color={[
                                "#9fd226",
                                "#ec7329",
                                "#de465b",
                                "#00adfe",

                              ]}
                              length={length}
                              length2={length2}
                              borderColor={"#01363e"}
                              type={1} //  1 2 不传type 3种样式
                              radius={[35 * range, 45 * range]}
                              scaleData={teaDesgin.behaviorList}
                            />
                            :
                            <div className='tj-noData'><SVG type='noData' /></div>

                        }

                      </div>
                    </div> */}
                    <div className='tea-block' onClick={this.goRouter.bind(this, 1, 'jxfx')}>
                      <span className='tea-title'>教学设计</span>
                      <div className='tea-cnt'>
                        {
                          teaDesgin.disList.length ?
                            <RadarEchart data={teaDesgin.disList} /> : <div className='tj-noData'><SVG type='noData' /></div>
                        }
                      </div>
                    </div>
                    <div className='tea-block' style={{ marginLeft: 0 }}>
                      <span className='tea-title'>课堂类型</span>
                      <div className='tea-cnt'>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '1')}>
                          <div className='center'>
                            <span>练习型</span>
                            <div><span className={teaDesgin.max == teaDesgin.testType ? 'data max' : 'data'}>{teaDesgin.testType || '-'}</span>课程</div>
                          </div>
                        </div>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '2')}>
                          <div className='center'>
                            <span>对话型</span>
                            <div><span className={teaDesgin.max == teaDesgin.speekType ? 'data max' : 'data'}>{teaDesgin.speekType || '-'}</span>课程</div>
                          </div>
                        </div>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '3')}>
                          <div className='center'>
                            <span>混合型</span>
                            <div><span className={teaDesgin.max == teaDesgin.mixType ? 'data max' : 'data'}>{teaDesgin.mixType || '-'}</span>课程</div>
                          </div>
                        </div>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '4')}>
                          <div className='center'>
                            <span>讲授型</span>
                            <div><span className={teaDesgin.max == teaDesgin.teachType ? 'data max' : 'data'}>{teaDesgin.teachType || '-'}</span>课程</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>

              }
            </div>
            {/* v1.21版本删除 */}
            {/* <div className='title1'>课堂互动</div> */}
            <div className='title2'>
              <span>教</span>
              <span>学</span>
              <span>分</span>
              <span>析</span>
            </div>
            <div className='title3'>学生听讲反馈</div>
          </div>
          <div className='stuClass-wrap'>
            <div className='stuClass-cnt'>
              {
                responseLoading ? <Spin /> :
                  <>
                    <div className='tea-block' onClick={this.goRouter.bind(this, 1, 'xstjfk')}>
                      <span className='tea-title'>学生行为</span>
                      <div className='tea-cnt'>
                        {
                          stuResponse.stuBehaviorList.length ?
                            <ColorsPieEcharts
                              color={[
                                "#9fd226",
                                "#ec7329",
                                "#de465b",
                                "#03bf84",
                                "#0072fe",
                                "#00adfe",
                                "#00fefb"

                              ]}
                              title='%'
                              length={length}
                              length2={length2}
                              borderColor={"#00373f"}
                              type={1} //  1 2 不传type 3种样式
                              radius={[42 * range, 50 * range]}
                              scaleData={stuResponse.stuBehaviorList}
                            />
                            :
                            <div className='tj-noData'><SVG type='noData' /></div>
                        }
                      </div>
                    </div>
                    <div className='tea-block' onClick={this.goRouter.bind(this, 1, 'xstjfk')}>
                      <span className='tea-title'>学生表情</span>
                      <div className='tea-cnt'>
                        {
                          stuResponse.stuFaceList.length ?
                            <RadarEchart data={stuResponse.stuFaceList} /> : <div className='tj-noData'><SVG type='noData' /></div>
                        }
                      </div>
                    </div>
                    <div className='tea-block' onClick={this.goRouter.bind(this, 1, 'xstjfk')}>
                      <span className='tea-title'>综合情况</span>
                      <div className='tea-cnt'>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>活跃度</span>
                            <div><span className={stuResponse.max == stuResponse.activeProp ? 'data max' : 'data'}>{stuResponse.activeProp || '-'}</span>%</div>

                          </div>
                        </div>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>专注度</span>
                            <div><span className={stuResponse.max == stuResponse.focusProp ? 'data max' : 'data'}>{stuResponse.focusProp || '-'}</span>%</div>
                          </div>
                        </div>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>参与度</span>
                            <div><span className={stuResponse.max == stuResponse.joinProp ? 'data max' : 'data'}>{stuResponse.joinProp || '-'}</span>%</div>
                          </div>
                        </div>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>疑惑度</span>
                            <div><span className={stuResponse.max == stuResponse.confuseProp ? 'data max' : 'data'}>{stuResponse.confuseProp || '-'}</span>%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </>
              }

            </div>
          </div>
        </div>
        <div className='qua-right'>
          <div className='right-title'>
            <span>今日概况</span>
          </div>
          <div className='total-data'>
            <div className='item' onClick={this.goRouter.bind(this, '1', 'kthd')}>
              <div className='left'>学生起立</div>
              <div className='right'>
                <span className='data'>{stuStandToday || '-'}</span>
                <div>次/课程</div></div>
            </div>
            <div className='item' onClick={this.goRouter.bind(this, '1', 'kthd')}>
              <div className='left'>教师<br />上下讲台</div>
              <div className='right'>
                <span className='data'>{teaPatrol || '-'}</span>
                <div>次/课程</div></div>
            </div>

          </div>
          <div className='block-wrap' >
            <div className='block-tit'>
              <span className='tit'>教学分析</span>
            </div>
            <div className='block-cnt'>
              {
                analyLoadingAi ? <Spin /> :
                  <>
                    {/* 1.21屏蔽教师行为 */}
                    {/* <div className='item' onClick={this.goRouter.bind(this, '1', 'jxfx')}>
                      <div className='item-tit'>教师行为</div>
                      <div className='item-cnt'>
                        {
                          aiTeaDesgin.behaviorList.length ?
                            <ColorsPieEcharts
                              title='%'
                              color={[
                                "#9fd226",
                                "#ec7329",
                                "#de465b",
                                "#00adfe",

                              ]}
                              length={length}
                              length2={length2}
                              borderColor={"#002e35"}
                              type={1} //  1 2 不传type 3种样式
                              radius={[30 * range, 40 * range]}
                              scaleData={aiTeaDesgin.behaviorList}
                            />
                            :
                            <div className='tj-noData'><SVG type='noData' /></div>
                        }

                      </div>

                    </div> */}
                    <div className='item2' style={{ width: '100%' }} onClick={this.goRouter.bind(this, '1', 'jxfx')}>
                      <div className='item-tit'>教学设计</div>
                      <div className='item-cnt'>
                        {
                          aiTeaDesgin.disList.length ?
                            <RadarEchart data={aiTeaDesgin.disList} /> : <div className='tj-noData'><SVG type='noData' /></div>
                        }
                      </div>
                    </div>
                    <div className='item3'>
                      <div className='item-tit'>课堂类型</div>
                      <div className='item-cnt'>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '1')}>
                          <div className='center'>
                            <span>练习型</span>
                            <div><span className={aiTeaDesgin.max == aiTeaDesgin.testType ? 'data max' : 'data'}>{aiTeaDesgin.testType || '-'}</span>课程</div>
                          </div>
                        </div>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '2')}>
                          <div className='center'>
                            <span>对话型</span>
                            <div><span className={aiTeaDesgin.max == aiTeaDesgin.speekType ? 'data max' : 'data'}>{aiTeaDesgin.speekType || '-'}</span>课程</div>
                          </div>
                        </div>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '3')}>
                          <div className='center'>
                            <span>混合型</span>
                            <div><span className={aiTeaDesgin.max == aiTeaDesgin.mixType ? 'data max' : 'data'}>{aiTeaDesgin.mixType || '-'}</span>课程</div>
                          </div>
                        </div>
                        <div className='cnt-item' onClick={this.goRouter.bind(this, 2, '4')}>
                          <div className='center'>
                            <span>讲授型</span>
                            <div><span className={aiTeaDesgin.max == aiTeaDesgin.teachType ? 'data max' : 'data'}>{aiTeaDesgin.teachType || '-'}</span>课程</div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </>
              }

            </div>
          </div>
          <div className='block-wrap' onClick={this.goRouter.bind(this, '1', 'xstjfk')}>
            <div className='block-tit'>
              <span className='tit'>学生听讲反馈</span>
            </div>
            <div className='block-cnt'>
              {
                responseLoadingAi ? <Spin /> :
                  <>
                    <div className='item' style={{ width: '55%' }}>
                      <div className='item-tit'>学生行为</div>
                      <div className='item-cnt'>
                        {
                          aiStuResponse.stuBehaviorList.length ?
                            <ColorsPieEcharts
                              title='%'
                              borderColor={"#002e35"}
                              color={[
                                "#9fd226",
                                "#ec7329",
                                "#de465b",

                                "#03bf84",
                                "#0072fe",
                                "#00adfe",
                                "#00fefb"

                              ]}
                              length={length}
                              length2={length2}
                              type={1} //  1 2 不传type 3种样式
                              radius={[20 * range, 25 * range]}
                              scaleData={aiStuResponse.stuBehaviorList}
                            />
                            :
                            <div className='tj-noData'><SVG type='noData' /></div>
                        }

                      </div>


                    </div>
                    <div className='item2' style={{ width: '45%' }}>
                      <div className='item-tit'>学生表情</div>
                      <div className='item-cnt'>
                        {
                          aiStuResponse.stuFaceList.length ?
                            <RadarEchart data={aiStuResponse.stuFaceList} /> : <div className='tj-noData'><SVG type='noData' /></div>
                        }
                      </div>
                    </div>
                    <div className='item3'>
                      <div className='item-tit'>综合情况</div>
                      <div className='item-cnt'>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>活跃度</span>
                            <div><span className={aiStuResponse.max == aiStuResponse.activeProp ? 'data max' : 'data'}>{aiStuResponse.activeProp || '-'}</span>%</div>
                          </div>
                        </div>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>专注度</span>
                            <div><span className={aiStuResponse.max == aiStuResponse.focusProp ? 'data max' : 'data'}>{aiStuResponse.focusProp || '-'}</span>%</div>
                          </div>
                        </div>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>参与度</span>
                            <div><span className={aiStuResponse.max == aiStuResponse.joinProp ? 'data max' : 'data'}>{aiStuResponse.joinProp || '-'}</span>%</div>
                          </div>
                        </div>
                        <div className='cnt-item'>
                          <div className='center'>
                            <span>疑惑度</span>
                            <div><span className={aiStuResponse.max == aiStuResponse.confuseProp ? 'data max' : 'data'}>{aiStuResponse.confuseProp || '-'}</span>%</div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default TeachingQuaView;