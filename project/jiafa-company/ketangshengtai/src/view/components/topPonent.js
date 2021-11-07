/*
 * @Author: MinJ
 * @Date: 2020-05-13 13:37:16 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-06-22 16:44:28
 * 面包屑
 * pages 数据列表
 * 
 * 统计组件
 * data 数字
 * text:icon: 图标   iconColor: 图标颜色   title: 标题  normal：单位
 * 
 * 日期
 * dateChan相应选择变化回调
 */
import React, { Component } from 'react';
import { Select, Popover, DatePicker, Button } from 'antd';
import { withRouter } from "react-router-dom";
import moment from 'moment';
import { G } from './../../config/g';
import SVG from './../public/public-component-svg';

import './../../style/modalPonent.scss';
const { Option } = Select;
const { RangePicker } = DatePicker;

function getDate(params) {
  var date
  if (params) {
    date = new Date(params);
  } else {
    date = new Date();
  }
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

// 面包屑
class Bread extends Component {
  render() {
    const { pages } = this.props;
    const { handleGoBack } = this.props
    return <div className='mj-bp-content'>
      <div style={{ flex: 2 }}>
        {
          pages && pages.length ?
            pages.map((item, index) => {
              return <span key={Math.random()}>{`${index === 0 ? '' : ' > '}${item}`}</span>
            }) : null
        }
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <Button onClick={() => {
          handleGoBack ? handleGoBack() : this.props.history.goBack()
          
        }}>返回</Button>
      </div>
    </div>
  }
}
export const BreadPonent = withRouter(Bread);

// 统计组件
class Census extends Component {
  render() {
    const { data, text } = this.props;
    return <div className='mj-cp-Content'>
      <div className='mj-cp-textCon'>
        <div className='mj-cp-textTop'>
          <span>{data}</span>
          <span>{text.normal}</span>
        </div>
        <div className='mj-cp-textTitle'>{text.title}</div>
      </div>
      <div className='mj-cp-iconCon'>
        <SVG type={text.icon} fill={text.iconColor} />
      </div>
    </div>
  }
}
export const CensusPonent = withRouter(Census);

// 日期
class Dates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      semester: { id: null, name: null },   //学期选中
      type: 0,          //选中日期类型：0日1周2月
      weeks: [],        //周下拉数据列表
      week: {},         //选中周次
      day: new Date(),    //选中日期
      month: null,        //选中月
      startTime: '',    //开始时间
      endTime: '',      //结束时间
      fixedWeek: '',
    }
    this.semesterChan = this.semesterChan.bind(this);
    this.weeksNodes = this.weeksNodes.bind(this);
    this.dayNodes = this.dayNodes.bind(this);
    this.monthNodes = this.monthNodes.bind(this);
    this.weekChan = this.weekChan.bind(this);
    this.disabledDate = this.disabledDate.bind(this);
    this.disabledDay = this.disabledDay.bind(this);
  }

  componentDidUpdate() {

  }

  componentDidMount() {

    // let date = new Date()
    // let year = date.getFullYear()
    // let mon = date.getMonth() + 1
    // console.log('year', year)
    // console.log('mon', mon)
    // setTimeout(() => {
    //   console.log('dom', document.querySelector('.mj-dp-monthDropDown tbody'))
    // }, 100);

    const semesters = JSON.parse(sessionStorage.getItem("semesters"));
    const timeNow = new Date().getTime();
    let semesterNow = {},
      weeksNow = [],
      startDate = new Date(),
      hasNow = false;
    let fixedWeek
    semesters?.map(item => {

      if (item.isNow === 1) {
        semesterNow = item;
        weeksNow = item.weeks;
        let startPoint = new Date(item.semesterStartDate).getTime(),
          endPoint = new Date(item.semesterEndDate).getTime();

        startDate = timeNow > startPoint && timeNow < endPoint ? timeNow :
          timeNow > endPoint ? endPoint : startPoint;

        hasNow = true;

        console.log('item', item)
        if (weeksNow.length) {
          const today = new Date().getTime()
          fixedWeek = weeksNow.find(item => {
            const start = new Date(item.startTime).getTime()
            const end = new Date(item.endTime).getTime()
            return today >= start && today <= end
          })
          if (!fixedWeek) fixedWeek = {}
        }
      }
    })

    if (!hasNow && semesters && semesters.length) {
      semesterNow = semesters[0];
      weeksNow = semesterNow.weeks;

      let startPoint = new Date(semesterNow.semesterStartDate).getTime(),
        endPoint = new Date(semesterNow.semesterEndDate).getTime();
      startDate = timeNow > startPoint && timeNow < endPoint ? timeNow :
        timeNow > endPoint ? endPoint : startPoint;
      // startDate = semesterNow.semesterStartDate;
    }


    this.setState({
      semester: semesterNow,
      weeks: weeksNow,
      week: {},
      fixedWeek,
      day: startDate,
      startTime: startDate,
      endTime: startDate
    })
    this.props.dateChan({
      semester: semesterNow && semesterNow.id || null,
      startTime: moment(new Date(startDate)).format('YYYY-MM-DD'),
      endTime: moment(new Date(startDate)).format('YYYY-MM-DD'),
    })
  }

  /**
   * 学期切换
   * @param {*} value 选中值
   */
  semesterChan(val) {
    // console.log(val);
    const semesters = JSON.parse(sessionStorage.getItem("semesters"));
    semesters.map(item => {
      let weeks = item.weeks
      if (val === item.id) {
        let startDate, fixedWeek
        if (item.isNow === 1) {
          let timeNow = new Date().getTime();
          let startPoint = new Date(item.semesterStartDate).getTime(),
            endPoint = new Date(item.semesterEndDate).getTime();

          startDate = timeNow > startPoint && timeNow < endPoint ? timeNow :
            timeNow > endPoint ? endPoint : startPoint;
        }
        const today = new Date().getTime()
        fixedWeek = weeks.find(ele => {
          const start = new Date(ele.startTime).getTime()
          const end = new Date(ele.endTime).getTime()
          return today >= start && today <= end
        })
        if (!fixedWeek) fixedWeek = {}
        this.setState({
          semester: item,
          weeks: item.weeks,
          type: 0,
          fixedWeek,
          day: startDate ? startDate : item.semesterStartDate,
          day: item.semesterStartDate,
          week: {},
          month: null,
          startTime: startDate ? startDate : item.semesterStartDate,
          endTime: startDate ? startDate : item.semesterStartDate
        });
        this.props.dateChan({
          semester: item.id,
          startTime: startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : item.semesterStartDate,
          endTime: startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : item.semesterStartDate,
        })
      }
    })
  }

  // 周次节点
  weeksNodes() {
    const { weeks, semester, week, fixedWeek } = this.state;
    // return
    return <div className='mj-dc-weekContent'>
      <div className='mj-dc-weekTitle'>{semester.name}</div>
      <div className='mj-dc-weekList'>
        {
          weeks.length ?
            weeks.map(item => {
              return <span
                onClick={() => this.weekChan('week', item)}
                style={{
                  backgroundColor: week.id === item.id ? '#47c6a4' : null,
                  border: fixedWeek && fixedWeek.id === item.id ? '1px solid #30bf99' : '',
                  boxSizing: 'border-box',
                  color: week.id === item.id ? '#fff' : '#000000',
                }}
                key={item.id}>{item.name}</span>
            }) : null
        }
      </div>
    </div>
  }

  /**
   * @desc 日期禁用
   * @param {*} current 
   */
  disabledDate(current) {
    const { semester } = this.state;
    const { semesterStartDate, semesterEndDate } = semester;
    return current < moment(semesterStartDate) || current > moment(semesterEndDate);
  }
  // 日期节点
  dayNodes() {
    const { day } = this.state;
    return <div className='mj-dp-dayContent' style={{ position: 'relative' }}>
      <DatePicker
        value={day ? moment(day) : null}
        dropdownClassName='mj-dp-dayDropDown'
        open={true}
        onChange={(date, dateString) => this.weekChan('day', dateString)}
        disabledDate={(currentDate) => this.disabledDate(currentDate)}
        getPopupContainer={triggerNode => triggerNode.parentElement} />
    </div>
  }

  /**
   * @desc 月份禁用
   */
  disabledDay(current) {
    const { semester } = this.state;
    const { semesterStartDate, semesterEndDate } = semester;
    // return
    let start = new Date(semesterStartDate),
      startDay = start.setDate(1),
      end = new Date(semesterEndDate);
    end.setMonth(end.getMonth() + 1);
    let endDay = end.setDate(0);

    return current < moment(startDay) || current > moment(endDay);
  }

  // 月节点
  monthNodes() {

    const { month } = this.state;
    // return
    let i = 0
    return <div className='mj-dp-monthContent' style={{ position: 'relative' }}>
      <DatePicker
        value={month ? moment(month) : null}
        picker="month"
        dropdownClassName='mj-dp-monthDropDown'
        open={true}
        monthCellRender={(date, locale) => {
          const crrdate = new Date(date._d)
          let nowYear = new Date().getFullYear()
          let nowMonth = new Date().getMonth()
          let style = {};
          if (nowYear === crrdate.getFullYear() && nowMonth === crrdate.getMonth()) {
            style = {
              border: '1px solid #30bf99',
              borderRadius: '2px'
            }
          }
          return (
            <div className="ant-picker-cell-inner" style={style}>
              {(crrdate.getMonth() + 1) + '月'}
            </div>
          );
        }}
        onChange={(date, dateString) => this.weekChan('month', dateString)}
        disabledDate={(currentDate) => this.disabledDay(currentDate)}
        getPopupContainer={triggerNode => triggerNode.parentElement} />
    </div>
  }

  /**
   * @desc 时间切换
   * @param {*} type week周次 day日期 month月
   * @param {*} data 值
   */
  weekChan(type, data) {
    // console.log(data);
    const { semester } = this.state;
    switch (type) {
      case 'week':
        this.setState({
          week: data,
          type: 1,
          startTime: data.startTime,
          endTime: data.endTime,
          day: null,
          month: null
        })
        this.props.dateChan({
          semester: semester.id,
          startTime: data.startTime,
          endTime: data.endTime
        })
        break;
      case 'day':
        this.setState({
          day: data,
          type: 0,
          startTime: data,
          endTime: data,
          week: {},
          month: null
        })
        this.props.dateChan({
          semester: semester.id,
          startTime: data,
          endTime: data
        })
        break;
      case 'month':
        let now = new Date(data),
          year = now.getFullYear(),
          month = now.getMonth(),
          startTime = new Date(year, month, 1),
          endTime = new Date(year, month + 1, 0),
          start = moment(startTime).format('YYYY-MM-DD'),
          end = moment(endTime).format('YYYY-MM-DD');
        console.log('data', data)
        this.setState({
          month: data,
          startTime: start,
          endTime: end,
          type: 2,
          day: null,
          week: {}
        })
        this.props.dateChan({
          semester: semester.id,
          startTime: start,
          endTime: end,
        })
        break;
      default:
        break;
    }
  }

  render() {
    const semesters = JSON.parse(sessionStorage.getItem("semesters"));
    const { semester, type, startTime, endTime } = this.state;
    // console.log(startTime, endTime);

    return <div className='mj-dp-content'>
      <div className='mj-dp-semester'>
        <Select
          onChange={(val, option) => this.semesterChan(val)}
          value={semester.id || ''}
          suffixIcon={<SVG type='xl' />}
          dropdownClassName='mj-dp-dropDown'>
          {
            semesters && semesters.length ?
              semesters.map(item => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              }) : null
          }
        </Select>
      </div>

      <div className='mj-dp-btnCon'>
        <span>当前统计时间：{type === 0 ? moment(new Date(startTime)).format('YYYY-MM-DD') : startTime + ' ~ ' + endTime}</span>
        <Popover
          content={this.dayNodes()}
          // content={() => 88888888888888}
          title={null}
          trigger="hover"
          placement="bottom">
          <div className={type === 0 ? 'mj-dp-btn mj-dp-btnHigh' : 'mj-dp-btn'}>日</div>
        </Popover>

        <Popover
          content={() => this.weeksNodes()}
          placement="bottom"
          title={null}
          trigger="hover">
          <div className={type === 1 ? 'mj-dp-btn mj-dp-btnHigh' : 'mj-dp-btn'}>周</div>
        </Popover>

        <Popover
          content={() => this.monthNodes()}

          title={null}
          trigger="hover"
          placement="bottom">
          <div className={type === 2 ? 'mj-dp-btn mj-dp-btnHigh' : 'mj-dp-btn'}>月</div>
        </Popover>

      </div>
    </div>
  }
}
export const DatePonent = withRouter(Dates);

// 平安教室 - 日期组件
class PaDates extends Component {
  constructor() {
    super();
    this.state = {
      dates: [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],      //选中时间
    }
    this.dateChan = this.dateChan.bind(this);
  }

  componentDidMount() {
    const { dates } = this.state;
    this.props.paDateChan(dates);
  }

  /**
   * @desc 日期切换
   */
  dateChan(dateStings) {
    // console.log(dateStings);
    this.props.paDateChan(dateStings);
    this.setState({ dates: dateStings })
  }

  render() {
    const { dates } = this.state;
    return <div className='mj-pdp-content'>
      <div className='mj-pdp-text'></div>
      {/* <div className='mj-pdp-text'>{`当前时间：${dates[0]} ~ ${dates[1]}`}</div> */}
      <div className='mj-pdp-timeCon'>
        <RangePicker
          onChange={(date, dateStings) => this.dateChan(dateStings)}
          defaultValue={[moment(new Date()), moment(new Date())]}
          separator='~'
          suffixIcon={<SVG type='rq' />}
          bordered={false}
          allowClear={false} />
      </div>
    </div>
  }
}
export const PaDatesPonent = withRouter(PaDates);