/*
 * @Author: zoe ღ
 * @Date: 2020-02-10 13:51:43
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 16:42:33
 */

/*教学改进-头部时间筛选组件
* isSave 是否保存时间条件（Boolean）
* getHeaderParams 选择时间函数回调 （Function）
*/

import React, { useState, useEffect } from "react";
import { Select, DatePicker, Popover } from "antd";
import moment from "moment";
import _ from "lodash";
import G from '../../../config/g';
const { Option } = Select;
const { MonthPicker } = DatePicker;

export default function ImpHeader(props) {
  const [selTime, setSelTime] = useState(G.ISCED_cutSemesterData.isCutSemester === "1"
    ? moment(new Date()).format("YYYY-MM-DD")
    : G.ISCED_cutSemesterData.startTime);
  const [semesterId, setSemesterId] = useState(G.ISCED_cutSemesterData.semesterId);
  const [semesterName, setSemesterName] = useState(G.ISCED_cutSemesterData.semesterName);
  const [curTime, setCurTime] = useState(G.ISCED_cutSemesterData.isCutSemester === "1"
    ? moment(new Date()).format("YYYY.MM.DD")
    : G.ISCED_cutSemesterData.startTime.replace(/\-/g, '\.'));
  const [selDate, setSelDate] = useState(G.ISCED_cutSemesterData.isCutSemester === "1"
    ? moment(new Date()).format("YYYY-MM-DD")
    : G.ISCED_cutSemesterData.startTime);
  const [selWeek, setSelWeek] = useState('');
  const [selMonth, setSelMonth] = useState('');
  const [semester, setSemester] = useState(G.ISCED_cutSemesterData);
  const [timeType, setTimeType] = useState('1');
  const [dateVisible, setDateVisible] = useState(false);
  const [monthVisible, setMonthVisible] = useState(false);
  const [weekVisible, setWeekVisible] = useState(false);
  const [attType, setAttType] = useState('1')
  const [defaultDate,setDefaultDate]=useState(G.ISCED_semesterList[0].startTime)
  const date = ["日", "周", "月"];
  const [attTypeList, setAttTypeList] = useState([{ id: '1', name: '教师考勤' }, { id: '2', name: '学生课堂秩序' }])
  //let weeks = [];
  //for (let i = 1; i <= G.ISCED_cutSemesterData.weekMax; i++) {
  //  weeks.push("第" + i + "周");
  //}
  let weeks = G.ISCED_cutSemesterData.weekList;

  useEffect(() => {
    console.log(props)
    let isHistory = sessionStorage.getItem('isHistoryTime')
    // let isSelect = sessionStorage.getItem('isSelect')
    let conditions = sessionStorage.getItem('conditions')
    
    //isTeacherCheck 教师考勤 当功能设置教师考勤关闭时 不显示教师考勤 1.21
    if (G.ISCED_setInfo.isTeacherCheck === '0') {
      setAttTypeList(
        [{ id: '2', name: '学生课堂秩序' }]
      )
      setAttType('2')
    }

    if (props.isSave && isHistory == 'true' && conditions !== 'null') {
      let { semesterId_, curTime_, selDate_, selTime_, timeType_, selWeek_, selMonth_, attType_ } = JSON.parse(sessionStorage.getItem('conditions'))
      console.log('用的上次数据')
      // if(selTime_!==selTime){
      setSemesterId(semesterId_)
      setSelDate(selDate_)
      setTimeType(timeType_)
      setCurTime(curTime_)
      setSelTime(selTime_)
      setSelWeek(selWeek_)
      setSelMonth(selMonth_)
      setAttType(attType_)
      props.getHeaderParams({
        semesterId: semesterId_,
        timeType: timeType_,
        selTime: selTime_,
        attType: attType_
      });
      // }

    } else {
      //1.21 发现conditions被清空 给conditions一个默认值 在学期内默认是当天，学期外默认是学期开始时间
      let con = {
        semesterId_: semesterId,
        timeType_: timeType,
        curTime_: semester.isCutSemester === "1" ? moment(new Date()).format("YYYY.MM.DD") : semester.startTime.replace(/\-/g, '\.'),
        selTime_: semester.isCutSemester === "1" ? moment(new Date()).format("YYYY-MM-DD") : semester.startTime,
        selDate_: semester.isCutSemester === "1" ? moment(new Date()).format("YYYY-MM-DD") : semester.startTime,
        selWeek_: selWeek,
        selMonth_: selMonth,
        attType_: G.ISCED_setInfo.isTeacherCheck === "0" ? "2" : "1"
      }
      sessionStorage.setItem('conditions', JSON.stringify(con))

      props.getHeaderParams({ 
        semesterId, 
        timeType, 
        selTime, 
        // attType 
        attType: G.ISCED_setInfo.isTeacherCheck === '0' ? '2' : '1' //1.21 关闭教师考勤时，没有教师考勤标签栏，此时attType默认为2
      });
    }
  }, [])

  // 选择学期
  function onSetSemester(semesterId) {
    let semester = _.find(G.ISCED_semesterList, { semesterId })
    let $curTime = semester.isCutSemester === "1" ? moment(new Date()).format("YYYY.MM.DD") : semester.startTime.replace(/\-/g, '\.')
    let $selTime = semester.isCutSemester === "1" ? moment(new Date()).format("YYYY-MM-DD") : semester.startTime;
    setSemesterId(semesterId)
    setSemesterName(semester.semesterName)
    setSemester(semester)
    setTimeType('1')
    setCurTime($curTime)
    setSelTime($selTime)
    setSelWeek('')
    setSelMonth('')
    if (props.isSave) {
      let con = {
        semesterId_: semesterId,
        timeType_: timeType,
        selTime_: semester.isCutSemester === "1" ? moment(new Date()).format("YYYY-MM-DD") : semester.startTime,
        curTime_: semester.isCutSemester === "1" ? moment(new Date()).format("YYYY.MM.DD") : semester.startTime.replace(/\-/g, '\.'),
        selWeek_: selWeek,
        selMonth_: selMonth,
        attType_: attType
      }
      sessionStorage.setItem('conditions', JSON.stringify(con))
      // sessionStorage.setItem('isSelect',true)
    }
    props.getHeaderParams({
      semesterId,
      timeType: "1",
      selTime: $selTime,
      attType
    })

  }

  // 时间类型选择日的事件
  function onSetDay(date, dateString) {
    setTimeType('1')
    setCurTime(moment(date).format("YYYY.MM.DD"))
    setSelTime(dateString)
    setSelDate(dateString)
    setSelWeek('')
    setSelMonth('')
    setDateVisible(false)
    if (props.isSave) {
      let con = {
        semesterId_: semesterId,
        timeType_: "1",
        curTime_: moment(date).format("YYYY.MM.DD"),
        selTime_: dateString,
        selDate_: dateString,
        selWeek_: "",
        selMonth_: "",
        attType_: attType
      }
      sessionStorage.setItem('conditions', JSON.stringify(con))
      // sessionStorage.setItem('isSelect',true)
    }
    props.getHeaderParams({
      semesterId,
      timeType: "1",
      selTime: dateString,
      attType
    });
  }

  //时间类型选择周的事件
  function onSetWeek(index, item) {
    if (item.disable == true) {
      return;
    }
    setTimeType('2')
    setCurTime("第" + (index + 1) + "周")
    setSelTime((index + 1).toString())
    setSelDate('')
    setSelWeek((index + 1).toString())
    setSelMonth('')
    setWeekVisible(false)
    if (props.isSave) {
      let con = {
        semesterId_: semesterId,
        timeType_: "2",
        curTime_: "第" + (index + 1) + "周",
        selTime_: (index + 1).toString(),
        selMonth_: "",
        selDate_: '',
        selWeek_: (index + 1).toString(),
        attType_: attType
      }
      sessionStorage.setItem('conditions', JSON.stringify(con))
      // sessionStorage.setItem('isSelect',true)
    }
    props.getHeaderParams({
      semesterId,
      timeType: "2",
      selTime: (index + 1).toString(),
      attType
    });
  }

  // 时间类型选择月的事件
  function onSetMonth(date, dateString) {
    setTimeType('3')
    setCurTime(moment(date).format("YYYY.MM"))
    setSelTime(dateString)
    setSelDate('')
    setSelWeek('')
    setSelMonth(dateString)
    setMonthVisible(false)
    if (props.isSave) {
      let con = {
        semesterId_: semesterId,
        timeType_: "3",
        selTime_: dateString,
        selMonth_: dateString,
        selWeek_: "",
        selDate_: '',
        curTime_: moment(date).format("YYYY.MM"),
        attType_: attType
      }
      sessionStorage.setItem('conditions', JSON.stringify(con))
      // sessionStorage.setItem('isSelect',true)
    }
    props.getHeaderParams({
      semesterId,
      timeType: "3",
      selTime: dateString,
      attType
    });

  }

  //时间类型选择本学期
  function onSetCurrentSemes() {
    setTimeType('4')
    setSelTime(semesterId)
    setSelDate('')
    setSelWeek('')
    setSelMonth('')
    setCurTime("本学期")
    if (props.isSave) {
      let con = {
        semesterId_: semesterId,
        timeType_: "4",
        selTime_: semesterId,
        selMonth_: "",
        selWeek_: "",
        selDate_: "",
        curTime_: "本学期",
        attType_: attType
      }
      sessionStorage.setItem('conditions', JSON.stringify(con))
      // sessionStorage.setItem('isSelect',true)
    }
    props.getHeaderParams({
      semesterId,
      timeType: "4",
      selTime: semesterId,
      attType
    });
  }

  //日期显隐change
  function onDateVisibleChange(value) {
    setDateVisible(value)
  }

  //周份显隐change
  function onWeekVisibleChange(value) {
    setWeekVisible(value)
  }

  //月份显隐change
  function onMonthVisibleChange(value) {
    setMonthVisible(value)
  }

  //考勤类型选择
  function onSetAttType(value) {
    setAttType(value)
    if (props.isSave) {
      let con = {
        semesterId_: semesterId,
        timeType_: timeType,
        selTime_: selTime,
        selMonth_: selMonth,
        selWeek_: selWeek,
        selDate_: selDate,
        curTime_: curTime,
        attType_: value
      }
      sessionStorage.setItem('conditions', JSON.stringify(con))
    }
    props.getHeaderParams({
      semesterId,
      timeType: timeType,
      selTime: selTime,
      attType: value
    });
  }

  return (
    <div className="zoe-data-header improve">
      <div className='tj-attType'>
        {
          attTypeList.map((item, index) => {
            return (
              <div key={index} className={attType == item.id ? 'tj-attType-item active' : 'tj-attType-item'} onClick={onSetAttType.bind(this, item.id)}>
                <span>{item.name}</span>
              </div>
            )
          })
        }
      </div>
      <div className="zoe-data-select">
        <div style={{ marginRight: 30 }}>
          <div className='in'>学年学期：</div>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            value={semesterId}
            onChange={onSetSemester}
            style={{ width: 200 }}
          >
            {G.ISCED_semesterList.map((item, index) => (
              <Option key={"a" + index} value={item.semesterId}>
                {item.semesterName}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="zoe-data-date" >
        <div style={{ marginRight: 20, width: '200px' }}>
          <div className='in'>当前选择时间：</div>
          <div className='in'>{curTime}</div>
        </div>
        <div id="selTime">
          <Popover
            onVisibleChange={onDateVisibleChange}
            visible={dateVisible}
            overlayClassName="ws-popover"
            placement="bottom"
            content={
              <DatePicker
                className="ws-datePicker-sel"
                dropdownClassName="ws-datePicker"
                format={"YYYY-MM-DD"}
                value={selDate ? moment(selDate, 'YYYY-MM-DD') : null}
                getCalendarContainer={trigger =>
                  document.getElementById("selTime")
                }
                onChange={onSetDay}
                defaultPickerValue={moment(defaultDate, 'YYYY-MM-DD')}
                open={dateVisible}
                allowClear={false}
                disabledDate={(current) => {
                  return current && (current < moment(semester.startTime) || current > moment(moment(new Date()).format('YYYY-MM-DD')));
                }}
              />
            }
          >
            <span className={timeType === "1" ? "zoe-selDate" : ""}>日</span>
          </Popover>
          <Popover
            onVisibleChange={onWeekVisibleChange}
            visible={weekVisible}
            overlayClassName="ws-popover"
            placement="bottom"
            content={
              <div className="zoe-data-hover-week">
                <div>{semesterName}</div>
                <div>
                  {weeks.map((item, index) => (
                    <div
                      className={
                        item.disable == true ? 'tj-week-disable' :
                          selWeek.toString() === (index + 1).toString()
                            ? "zoe-week-sel"
                            : ""
                      }
                      onClick={() => onSetWeek(index, item)}
                      key={index}
                    >
                      {item.weekName}
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <span className={timeType === "2" ? "zoe-selDate" : ""}>周</span>
          </Popover>
          <Popover
            onVisibleChange={onMonthVisibleChange}
            visible={monthVisible}
            overlayClassName="ws-popover"
            placement="bottom"
            content={
              <MonthPicker
                className="ws-datePicker-sel"
                dropdownClassName="ws-monthPicker"
                format={"YYYY-MM"}
                value={selMonth ? moment(selMonth, 'YYYY-MM-DD') : null}
                // value={selTime ? moment(selTime, 'YYYY-MM') : null}
                // getCalendarContainer={trigger => trigger.parentNode}
                getCalendarContainer={trigger =>
                  document.getElementById("selTime")
                }
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onChange={onSetMonth}
                allowClear={false}
                defaultPickerValue={moment(defaultDate.split("-").splice(0,2).join("-"), 'YYYY-MM-DD')}
                open={monthVisible}
                disabledDate={current => {
                  let startTime = semester.startTime
                    .split("-")
                    .splice(0, 2)
                    .join("-");

                  // let endTime = semester.endTime
                  //   .split("-")
                  //   .splice(0, 2);
                  // let endTime = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2);
                  // endTime[1] = Number(endTime[1]) + 1;
                  // let single = endTime[1] >= 10 ? endTime[1] : '0' + endTime[1]
                  // endTime[1] = single;
                  // endTime = endTime.join("-");
                  let endTime = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2).join("-")
                  return (
                    current && (current < moment(startTime) || current > moment(endTime))
                  );
                }}

              />
            }
          >
            <span className={timeType === "3" ? "zoe-selDate" : ""}>月</span>
          </Popover>
          <span className={timeType === "4" ? "zoe-selDate" : ""} onClick={onSetCurrentSemes}>本学期</span>
        </div>
      </div>
    </div>
  )
}

