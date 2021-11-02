/*
 * @Author: lxx 
 * @Date: 2020-01-22 14:04:15 
 * @Last Modified by: hf
 * @Last Modified time: 2021-03-24 16:20:52
 * 选择时间组件
 */
import React, { Component } from 'react';
import { DatePicker, Popover } from "antd";
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import G from "../../../config/g";
const { MonthPicker } = DatePicker;
class SelTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeType: "1",//选择的类型
      selTime: "",//选择的时间
      topParams: {},//头部参数
      selSemeter: {

      },//选择的学期
      dateVisible: false,//日显隐
      monthVisible: false,//月显隐
      weekVisible: false,//周显隐
      selDate: "",//选择的日
      selMonth: "",//选择的月
      defaultDate: ""//默认日期
    };
    this.selWeek = this.selWeek.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onDateVisibleChange = this.onDateVisibleChange.bind(this);
    this.onMonthVisibleChange = this.onMonthVisibleChange.bind(this);
    this.onWeekVisibleChange = this.onWeekVisibleChange.bind(this);
  }
  componentDidMount () {
  }
  componentWillReceiveProps (props) {
    if (Object.getOwnPropertyNames(props.topParams).length && JSON.stringify(props.topParams) !== JSON.stringify(this.state.topParams)) {
      this.setState({
        topParams: props.topParams
      });
      G.ISCED_semesterList.map((item) => {
        if (item.semesterId === props.topParams.semesterId) {
          let selSemeter = { ...item };
          let selTime = "";
          if (props.topParams.semesterId === G.ISCED_cutSemesterData.semesterId
            && G.ISCED_cutSemesterData.isCutSemester === "1") {
            selTime = moment(new Date()).format('YYYY-MM-DD');
          } else {
            selTime = selSemeter.startTime;
          }
          console.log(selSemeter)
          this.setState({
            selSemeter,
            timeType: "1",
            selTime,
            selDate: selTime,
            defaultDate: selTime
          })
        }
      })
    }
  }
  /**
   * @description change周
   * @param {Object} item 集合 
   */
  selWeek (item) {
    if (item.disable == true) {
      return;
    }
    let { selSemeter } = this.state;
    selSemeter.weekList.map(item => { item.active = false; })
    item.active = true;
    let selTime = item.weekName;
    this.setState({
      selSemeter,
      selTime,
      selDate: "",
      selMonth: "",
      timeType: "2",
      weekVisible: false
    })
    this.props.editTime({ timeType: "2", selTime: selTime.replace(/[^0-9]/ig, "") });
  }
  /**
   * @description change日
   */
  onChangeDate (date, dateString) {
    let { selSemeter } = this.state;
    selSemeter.weekList.map(item => { item.active = false; })
    let selTime = dateString;
    this.setState({
      selSemeter,
      selTime,
      selDate: selTime,
      selMonth: "",
      timeType: "1",
      dateVisible: false
    })
    this.props.editTime({ timeType: "1", selTime });
    // console.log(date, dateString)
  }
  /**
   * @description change月
   */
  onChangeMonth (date, dateString) {
    let { selSemeter } = this.state;
    selSemeter.weekList.map(item => { item.active = false; })
    let selTime = dateString;
    this.setState({
      selSemeter,
      selTime,
      selDate: "",
      selMonth: selTime,
      timeType: "3",
      monthVisible: false
    })
    this.props.editTime({ timeType: "3", selTime });
    // console.log(date, dateString)
  }
  /**
   * @description 日期显隐change
   */
  onDateVisibleChange (value) {
    this.setState({
      dateVisible: value
    })
  }
  /**
   * @description 月份显隐change
   */
  onMonthVisibleChange (value) {
    this.setState({
      monthVisible: value
    })
  }
  /**
   * @description 周显隐change
   */
  onWeekVisibleChange (value) {
    this.setState({
      weekVisible: value
    })
  }
  render () {
    let { timeType, dateVisible, monthVisible, weekVisible, selTime, selSemeter, selDate, selMonth, defaultDate } = this.state;
    return (
      <div className="ws-selTime" id="selTime">
        <div className="ws-selTime-option">
          <span>当前统计时间 : </span>
          <span>{selTime}</span>
          <span>
            <Popover onVisibleChange={this.onDateVisibleChange} visible={dateVisible} overlayClassName="ws-popover" placement="bottom" content={
              <DatePicker
                className="ws-datePicker-sel"
                dropdownClassName="ws-datePicker"
                format={'YYYY-MM-DD'}
                value={selDate ? moment(selDate, 'YYYY-MM-DD') : null}
                // value={selTime ? moment(selTime, 'YYYY-MM-DD') : null}
                getCalendarContainer={trigger => document.getElementById("selTime")}
                onChange={this.onChangeDate}
                defaultPickerValue={moment(defaultDate, 'YYYY-MM-DD')}
                open={dateVisible}
                allowClear={false}
                disabledDate={(current) => {
                  return current && (current < moment(selSemeter.startTime) || current > moment(moment(new Date()).format('YYYY-MM-DD')));
                }} />
            } >
              <span className={timeType === "1" ? "ws-active" : ""}>日</span>
            </Popover>
            <Popover onVisibleChange={this.onWeekVisibleChange} visible={weekVisible} overlayClassName="ws-popover" placement="bottom"
              content={
                <div className="ws-weekSel">
                  <div className="ws-weekSel-title">{selSemeter.semesterName}</div>
                  <div>
                    <PerfectScrollbar>
                      <div className="ws-weekSel-list">
                        <ul>
                          {
                            selSemeter.weekList && selSemeter.weekList.map((item, index) => (
                              <li key={index} className={item.disable ? 'ws-disabled' : item.active ? "ws-active" : ""} onClick={() => { this.selWeek(item) }}>{item.weekName}</li>
                            ))
                          }
                        </ul>
                      </div>
                    </PerfectScrollbar>
                  </div>
                </div>
              }>
              <span className={timeType === "2" ? "ws-active" : ""}>周</span>
            </Popover>
            <Popover onVisibleChange={this.onMonthVisibleChange} visible={monthVisible} overlayClassName="ws-popover" placement="bottom" content={
              <MonthPicker
                className="ws-datePicker-sel"
                dropdownClassName="ws-monthPicker"
                format={'YYYY-MM'}
                value={selMonth ? moment(selMonth, 'YYYY-MM-DD') : null}
                // value={selTime ? moment(selTime, 'YYYY-MM') : null}
                // getCalendarContainer={trigger => trigger.parentNode}
                getCalendarContainer={trigger => document.getElementById("selTime")}
                onChange={this.onChangeMonth}
                allowClear={false}
                defaultPickerValue={moment(defaultDate.split("-").splice(0, 2).join("-"), 'YYYY-MM-DD')}
                open={monthVisible}
                disabledDate={(current) => {
                  let startTime = selSemeter.startTime.split("-").splice(0, 2).join("-");
                  // let endTime = selSemeter.endTime.split("-").splice(0, 2).join("-");
                  let endTime = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2).join("-")
                  return current && (current < moment(startTime) || current > moment(endTime));
                }}
              />
            }>
              <span className={timeType === "3" ? "ws-active" : ""}>月</span>
            </Popover>
          </span>
        </div>
      </div>
    );
  }
}

export default SelTime;
