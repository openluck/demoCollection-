/*
 * @Author: xiangting 
 * @Date: 2019-03-01 09:49:22 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 14:34:55
 * 教学反思——任务课表
 */

import React, { Component } from 'react';
import { Table, Button, Icon, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { SVG } from './../../components/tpk/base.jsx';
import { timeTable, jxfsLoading, curSemesterAndWeeks } from './../../../redux/jxfs/jxfs.reducer'

import _util from './../../../util/_util'
// import _x from '../../../../js/_x/util';
// const number = _x.number
// const date = _x.date
const { toChinese } = _util;

@withRouter
@connect(state => state.getJxfsData, { timeTable, jxfsLoading, curSemesterAndWeeks })
export default class Timetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      showHover: '',
      showMore: undefined,
      curWeek: undefined
    }
  }
  componentDidMount() {
    this.props.curSemesterAndWeeks().then((res) => {
      this.setState({ "weeks": this.props.semesterAndWeeks.currentWeek }, () => {
        this.getData()
      })
    })
  }

  getData = () => {
    this.props.timeTable({
      "semester": {
        "semesterId": this.props.semesterAndWeeks.semester.semesterName
      },
      "weeks": this.state.weeks
    })
  }

  /**
   * @desc 鼠标移上单元格，显示详情
   * @param {string} text         鼠标移上的单元格显示内容
   */
  showHover(text) {
    if (text && text.typeStatus !== 2) {
      this.setState({ showHover: text.job.curriculumallId.uid })
    }
  }

  /**
   * @description     上一周按钮
   */
  lastWeek() {
    let weeks = this.state.weeks;
    if (weeks === 1) {
      message.info('已经是第一周啦！')
    } else {
      this.setState({ weeks: weeks - 1 }, () => {
        this.getData()
      })
    }
  }

  /**
   * @description     下一周按钮
   */
  nextWeek() {
    let weeks = this.state.weeks;
    if (weeks === this.props.semesterAndWeeks.totalWeek) {
      message.info('已经是最后一周啦！')
    } else {
      this.setState({ weeks: weeks + 1 }, () => {
        this.getData()
      })
    }
  }

  getMore(text, e) {
    e.stopPropagation()
    this.setState({ showMore: text })
  }

  /**
   * 
   * @param {string} id 
   * @param {string} type         课堂类型 1为教研课、2为随堂听、3为日常授课
   */
  router(id, type, timeStatus, startTime) {
    if (timeStatus !== 3) {
      // this.props.history.push('/teacher/jxfsVideo/' + id + '/' + type)
      let url = `${window.location.origin}${window.location.pathname}#/home/jxfsVideo/${id}/${type}`
      window.open(url)
    } else {
      message.info('该课程尚未开始，请于' + moment(new Date(startTime)).format('YYYY-MM-DD HH:mm:ss') + '查看')
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (JSON.stringify(nextProps.timeTableData) !== JSON.stringify(prevState.dataSource)) {
  //     return {
  //       dataSource: JSON.parse(JSON.stringify(nextProps.timeTableData))
  //     }
  //   }
  //   return null
  // }
  render() {
    let renderText = (text, record) => text.length ? <div style={{ position: 'relative' }}>
      <div
        style={{
          height: '100%',
          // lineHeight: 1.5,
          background: text[0] ? (text[0].typeStatus === 1 ? '#ff775c' : text[0].typeStatus === 2 ? '#3dcc85' : '#708afa') : '#fff',
          color: '#fff',
          cursor: 'pointer'
        }}
        className="lxx-m-tb"
        onMouseEnter={this.showHover.bind(this, text[0])}
        onMouseLeave={() => { this.setState({ showHover: undefined }) }}
        onClick={this.router.bind(this, text[0].job.curriculumallId.uid, text[0].typeStatus, text[0].timeStatus, text[0].job.curriculumallId.acturestarttime)}
      >
        <p title={text[0].job.curriculumallId.jfCurriculumsList[0].curclassname}>
          {text[0].job.curriculumallId.jfCurriculumsList[0].curclassname}
        </p>
        <p title={text[0].job.curriculumallId.jfPlaces.name}>
          {text[0].job.curriculumallId.jfPlaces.name}
        </p>
        {
          text.length > 1 ?
            <Icon type="bars" className='xt-timetable-more' onClick={this.getMore.bind(this, text)} /> : null
        }
        <SVG
          type='sjkb'
          style={{ width: '20px', height: '20px', position: 'absolute', top: '10px', right: '15px', display: text[0].timeStatus === 2 ? 'block' : 'none' }}
          color='#000'
        />
      </div>
      {
        this.state.showMore && this.state.showMore === text ?
          <div className='xt-timetable-select'>
            {
              this.state.showMore.map((item, index) => (
                <div key={'index' + index}>
                  <div className='xt-timetable-table-top' style={{ borderBottomColor: '#31a9ff' }}></div>
                  <div
                    onClick={this.router.bind(this, item.job.curriculumallId.uid, item.typeStatus)}
                  >
                    {item.job.curriculumallId.className}
                  </div>
                  {item.job.curriculumallId.jfCurriculumsList[0].curclassname}
                </div>
              ))
            }
          </div> : null}
      <div className='xt-timetable-table-hover' style={{ display: this.state.showHover === text[0].job.curriculumallId.uid && !this.state.showMore ? 'block' : 'none' }}>
        <div className='xt-timetable-table-top' style={{ borderBottomColor: 'rgba(0,0,0,0.5)' }}></div>
        <div style={{ display: text[0].typeStatus !== 3 ? 'block' : 'none' }}>收到点评：{text[0].commentNum || 0}</div>
        <div style={{ display: text[0].typeStatus === 1 ? 'block' : 'none' }}>点评分数：{text[0].avgScore || 0}</div>
        <div>违纪次数：{text[0].eventNum || 0}</div>
      </div>
    </div> : <div></div>
    const columns = [
      {
        key: 'section',
        title: '节次',
        align: 'center',
        dataIndex: 'section',
        width: '10%'
      }, {
        key: 'Monday',
        title: '星期一',
        align: 'center',
        dataIndex: 'Monday',
        render: renderText,
        width: '10%'
      }, {
        key: 'Tuesday',
        title: '星期二',
        align: 'center',
        dataIndex: 'Tuesday',
        render: renderText,
        width: '10%'
      }, {
        key: 'Wednesday',
        title: '星期三',
        align: 'center',
        dataIndex: 'Wednesday',
        render: renderText,
        width: '10%'
      }, {
        key: 'Thursday',
        title: '星期四',
        align: 'center',
        dataIndex: 'Thursday',
        render: renderText,
        width: '10%'
      }, {
        key: 'Friday',
        title: '星期五',
        align: 'center',
        dataIndex: 'Friday',
        render: renderText,
        width: '10%'
      }, {
        key: 'Saturday',
        title: '星期六',
        align: 'center',
        dataIndex: 'Saturday',
        render: renderText,
        width: '10%'
      }, {
        key: 'Sunday',
        title: '星期日',
        align: 'center',
        dataIndex: 'Sunday',
        render: renderText,
        width: '10%'
      },
    ]

    const data = this.props.timeTableData;
    // const { dataSource } = this.state;
    // console.log(data);

    const semesterAndWeeks = this.props.semesterAndWeeks
    let chWeek;
    let week = this.state.weeks;
    if (week) {
      chWeek = toChinese(this.state.weeks);
      if (chWeek.indexOf('一') > -1 && chWeek.indexOf('一') < 1 && chWeek !== '一') {
        chWeek = chWeek.substring(1, chWeek.length);
      }
    }
    return (
      <div className='xt-timetable' onClick={() => this.setState({ showMore: undefined })}>
        <div>任务课表</div>
        <div className='xt-timetable-checked'>
          <div>
            <Button onClick={this.lastWeek.bind(this)}>上一周</Button>
            <Button onClick={this.nextWeek.bind(this)}>下一周</Button>
            <span>
              第{chWeek ? chWeek : '-'}周
                        </span>
          </div>
          <div className='xt-timetable-legend'>
            <div>
              <span></span>
              <div>教研课</div>
            </div>
            <div>
              <span></span>
              <div>随堂听</div>
            </div>
            <div>
              <span></span>
              <div>日常授课</div>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          className='xt-timetable-table'
          bordered={true}
          dataSource={data}
          pagination={false}
        >
        </Table>
      </div>
    )
  }
} 