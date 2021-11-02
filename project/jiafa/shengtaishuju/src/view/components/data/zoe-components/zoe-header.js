/*
 * @Author: zoe ღ
 * @Date: 2020-02-10 13:51:43
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 18:41:17
 * 教学秩序-头部 统计时间、日周月切换、学年学期切换、课程类别切换
 */

import React, { Component } from "react";
import { Select, DatePicker, Popover } from "antd";
import moment from "moment";
import _ from "lodash";
import G from "../../../../config/g";
const { Option } = Select;
const { MonthPicker } = DatePicker;
class ZoeHeader extends Component {
  constructor(props) {
    super(props);

    // 需要判断是否是下级页面返回需要回显条件
    let curSignArray = G.ISCED_tabArray || [];
    let curTime_ =
      curSignArray.length &&
      curSignArray[curSignArray.length - 1].timeType == "2"
        ? "第" + curSignArray.length &&
          curSignArray[curSignArray.length - 1].selTime + "周"
        : (curSignArray.length &&
            curSignArray[curSignArray.length - 1].selTime) ||
          G.ISCED_cutSemesterData.isCutSemester === "1"
        ? moment(new Date()).format("YYYY.MM.DD")
        : G.ISCED_cutSemesterData.startTime;
    console.log(curTime_);
    this.state = {
      selTime:
        G.ISCED_cutSemesterData.isCutSemester === "1"
          ? moment(new Date()).format("YYYY-MM-DD")
          : G.ISCED_cutSemesterData.startTime, //选择的时间参数入参
      semesterId:
        (curSignArray.length > 1 &&
          curSignArray[curSignArray.length - 1].semesterId) ||
        G.ISCED_cutSemesterData.semesterId, //当前学年学期ID
      semesterName: G.ISCED_cutSemesterData.semesterName, //学年学期名字
      couTypeId:
        (curSignArray.length > 1 &&
          curSignArray[curSignArray.length - 1].couTypeId) ||
        "0", //课程类型ID
      couTypeName: "全部", //课程类型名
      curTime: curTime_, //默认是今天的年月日
      selDate: "", //当前选中的日
      selWeek:
        curSignArray.length > 1 &&
        curSignArray[curSignArray.length - 1].timeType == 2
          ? curSignArray.length && curSignArray[curSignArray.length - 1].selTime
          : "", //当前选中的周次
      selMonth: "", //当前选中的月份数据
      semester: G.ISCED_cutSemesterData, //当前选择的学期 默认是当前学期
      timeType:
        (curSignArray.length >= 1 &&
          curSignArray[curSignArray.length - 1].timeType) ||
        "1", //选择的时间类型入参 "1" 日 "2"周  "3" 月
      dateVisible: false, //日显隐
      monthVisible: false, //月显隐
      weekVisible: false, //周显隐
      defaultDate: "",
    };
    this.date = ["日", "周", "月"];
    // this.weeks = [];
    // for (let i = 1; i <= G.ISCED_cutSemesterData.weekMax; i++) {
    //   this.weeks.push("第" + i + "周");
    // }
    this.weeks = G.ISCED_cutSemesterData.weekList;
  }
  componentDidMount() {
    const { semesterId, couTypeId, timeType, selTime } = this.state;
    let curSignArray = G.ISCED_tabArray || [];
    let selSemeter = G.ISCED_semesterList[0];
    let selTime_ =
      (curSignArray.length && curSignArray[curSignArray.length - 1].selTime) ||
      selTime;
    console.log(selTime_);
    let curTime_ = curSignArray.length
      ? curSignArray[curSignArray.length - 1].timeType == "2"
        ? "第" + curSignArray[curSignArray.length - 1].selTime + "周"
        : curSignArray[curSignArray.length - 1].selTime
      : (curSignArray.length &&
          curSignArray[curSignArray.length - 1].selTime) ||
        G.ISCED_cutSemesterData.isCutSemester === "1"
      ? moment(new Date()).format("YYYY.MM.DD")
      : G.ISCED_cutSemesterData.startTime;
    if (curSignArray.length) {
      this.setState({
        curTime: curTime_.replace(/\-/g, "."),
      });
    } else {
      this.setState({
        curTime: selTime_.replace(/\-/g, "."),
      });
    }
    this.setState({
      defaultDate: selSemeter.startTime,
    });

    this.props.getHeaderParams({
      semesterId,
      couTypeId,
      timeType,
      selTime: selTime_,
    });
  }
  //选择学年学期
  setSemester = (semesterId) => {
    const { couTypeId, timeType, selTime } = this.state;
    const { pageType } = this.props;
    let semester = _.find(G.ISCED_semesterList, { semesterId });
    this.setState({
      semesterId,
      semesterName: semester.semesterName,
      semester,
      timeType: "1",
      selTime:
        semester.isCutSemester === "1"
          ? moment(new Date()).format("YYYY-MM-DD")
          : semester.startTime,
      curTime:
        semester.isCutSemester === "1"
          ? moment(new Date()).format("YYYY.MM.DD")
          : semester.startTime.replace(/\-/g, "."),
      selWeek: "",
      selMonth: "",
    });
    this.props.getHeaderParams({ semesterId, couTypeId, timeType, selTime });
    if (pageType) {
      this.props.changeReset();
    }
  };
  //选择课程类别
  setCouType = (couTypeId) => {
    const { semesterId, timeType, selTime } = this.state;
    const { pageType } = this.props;

    this.setState({
      couTypeId,
      couTypeName: _.find(G.ISCED_courseTypeList, { couTypeId }).couTypeName,
    });
    this.props.getHeaderParams({ semesterId, couTypeId, timeType, selTime });
    if (pageType) {
      this.props.changeReset();
    }
  };
  // 时间类型选择日的事件
  setDay = (date, dateString) => {
    const { semesterId, couTypeId } = this.state;
    const { pageType } = this.props;
    this.setState({
      selTime: dateString,
      selDate: dateString,
      curTime: moment(date).format("YYYY.MM.DD"),
      timeType: "1",
      selWeek: "",
      selMonth: "",
      dateVisible: false,
    });
    //当重新选择时间的时候需要重置列表的排序
    if (pageType) {
      this.props.changeReset();
    }
    this.props.getHeaderParams({
      semesterId,
      couTypeId,
      timeType: "1",
      selTime: dateString,
    });
  };
  //日期显隐change
  onDateVisibleChange = (value) => {
    this.setState({
      dateVisible: value,
    });
  };
  //时间类型选择周的事件
  setWeek = (index, item) => {
    console.log("index", index);
    if (item.disable == true) {
      return;
    }
    const { semesterId, couTypeId } = this.state;
    const { pageType } = this.props;
    this.setState({
      selTime: (index + 1).toString(),
      timeType: "2",
      curTime: "第" + (index + 1) + "周",
      selWeek: (index + 1).toString(),
      selMonth: "",
      selDate: "",
      weekVisible: false,
    });
    //当重新选择时间的时候需要重置列表的排序
    if (pageType) {
      this.props.changeReset();
    }
    this.props.getHeaderParams({
      semesterId,
      couTypeId,
      timeType: "2",
      selTime: (index + 1).toString(),
    });
  };
  // 时间类型选择月的事件
  setMonth = (date, dateString) => {
    const { semesterId, couTypeId } = this.state;
    const { pageType } = this.props;
    this.setState({
      selTime: dateString,
      timeType: "3", //日期类型设置为月
      curTime: moment(date).format("YYYY.MM"),
      selMonth: dateString,
      selWeek: "",
      selDate: "",
      monthVisible: false,
    });
    //当重新选择时间的时候需要重置列表的排序
    if (pageType) {
      this.props.changeReset();
    }
    this.props.getHeaderParams({
      semesterId,
      couTypeId,
      timeType: "3",
      selTime: dateString,
    });
  };

  //月份显隐change
  onMonthVisibleChange = (value) => {
    this.setState({
      monthVisible: value,
    });
  };
  //周份显隐change
  onWeekVisibleChange = (value) => {
    this.setState({
      weekVisible: value,
    });
  };
  render() {
    const {
      timeType,
      selTime,
      curTime,
      semesterName,
      couTypeName,
      semester,
      selDate,
      selMonth,
      selWeek,
      dateVisible,
      monthVisible,
      weekVisible,
      defaultDate,
    } = this.state;
    const { curSign } = this.props;
    const { roleType } = G.ISCED_curRoleInfo;
    let curSignArray = G.ISCED_tabArray || [];
    return roleType === "1" || roleType === "2" ? (
      curSignArray.length <= 1 ? ( //校级账号，查看所有学院数据
        <div className="zoe-data-header">
          <div className="zoe-data-date">
            <div style={{ marginRight: 20 }}>
              <div>当前统计时间：</div>
              <div>{curTime}</div>
            </div>
            <div id="selTime">
              <Popover
                onVisibleChange={this.onDateVisibleChange}
                visible={dateVisible}
                overlayClassName="ws-popover"
                placement="bottom"
                content={
                  <DatePicker
                    className="ws-datePicker-sel"
                    dropdownClassName="ws-datePicker"
                    format={"YYYY-MM-DD"}
                    value={selDate ? moment(selDate, "YYYY-MM-DD") : null}
                    getCalendarContainer={(trigger) =>
                      document.getElementById("selTime")
                    }
                    onChange={this.setDay}
                    defaultPickerValue={moment(defaultDate, "YYYY-MM-DD")}
                    open={dateVisible}
                    allowClear={false}
                    disabledDate={(current) => {
                      return (
                        current &&
                        (current < moment(semester.startTime) ||
                          current >
                            moment(moment(new Date()).format("YYYY-MM-DD")))
                      );
                    }}
                  />
                }
              >
                <span className={timeType === "1" ? "zoe-selDate" : ""}>
                  日
                </span>
              </Popover>
              <Popover
                onVisibleChange={this.onWeekVisibleChange}
                visible={weekVisible}
                overlayClassName="ws-popover"
                placement="bottom"
                content={
                  <div className="zoe-data-hover-week">
                    <div>{semesterName}</div>
                    <div>
                      {this.weeks.map((item, index) => (
                        <div
                          className={
                            item.disable == true
                              ? "tj-week-disable"
                              : selWeek.toString() === (index + 1).toString()
                              ? "zoe-week-sel"
                              : ""
                          }
                          onClick={() => this.setWeek(index, item)}
                          key={index}
                        >
                          {item.weekName}
                        </div>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className={timeType === "2" ? "zoe-selDate" : ""}>
                  周
                </span>
              </Popover>
              <Popover
                onVisibleChange={this.onMonthVisibleChange}
                visible={monthVisible}
                overlayClassName="ws-popover"
                placement="bottom"
                content={
                  <MonthPicker
                    className="ws-datePicker-sel"
                    dropdownClassName="ws-monthPicker"
                    format={"YYYY-MM"}
                    value={selMonth ? moment(selMonth, "YYYY-MM-DD") : null}
                    // value={selTime ? moment(selTime, 'YYYY-MM') : null}
                    // getCalendarContainer={trigger => trigger.parentNode}
                    getCalendarContainer={(trigger) =>
                      document.getElementById("selTime")
                    }
                    onChange={this.setMonth}
                    allowClear={false}
                    defaultPickerValue={moment(
                      defaultDate.split("-").splice(0, 2).join("-"),
                      "YYYY-MM-DD"
                    )}
                    open={monthVisible}
                    disabledDate={(current) => {
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
                      let endTime = moment(new Date())
                        .format("YYYY-MM-DD")
                        .split("-")
                        .splice(0, 2)
                        .join("-");
                      // let endTime = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2).join("-")
                      return (
                        current &&
                        (current < moment(startTime) ||
                          current > moment(endTime))
                      );
                    }}
                  />
                }
              >
                <span className={timeType === "3" ? "zoe-selDate" : ""}>
                  月
                </span>
              </Popover>
            </div>
          </div>
          <div className="zoe-data-select">
            <div style={{ marginRight: 30 }}>
              <div>学年学期：</div>
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={this.state.semesterId}
                onChange={this.setSemester}
                style={{ width: 200 }}
              >
                {G.ISCED_semesterList.map((item, index) => (
                  <Option key={"a" + index} value={item.semesterId}>
                    {item.semesterName}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <div>课程类别：</div>
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={this.state.couTypeId}
                onChange={this.setCouType}
                style={{ width: 200 }}
              >
                {G.ISCED_courseTypeList.map((item, index) => (
                  <Option key={"b" + index} value={item.couTypeId}>
                    {item.couTypeName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      ) : (
        //校级账号，查看单个学院的课程数据
        <div className="zoe-data-header" style={{ justifyContent: "normal" }}>
          <div style={{ marginRight: 35 }}>
            <div>学年学期：</div>
            <div>{semesterName}</div>
          </div>
          <div style={{ marginRight: 35 }}>
            <div>课程类别：</div>
            <div>{couTypeName}</div>
          </div>
          <div>
            <div>当前统计时间：</div>
            <div>{curTime}</div>
          </div>
        </div>
      )
    ) : roleType === "3" || roleType === "4" ? ( //院级
      curSign === 2 ? ( //查看学院下所有课程数据
        <div className="zoe-data-header">
          <div className="zoe-data-date">
            <div style={{ marginRight: 20 }}>
              <div>当前统计时间：</div>
              <div>{curTime}</div>
            </div>
            <div id="selTime">
              <Popover
                onVisibleChange={this.onDateVisibleChange}
                visible={dateVisible}
                overlayClassName="ws-popover"
                placement="bottom"
                content={
                  <DatePicker
                    className="ws-datePicker-sel"
                    dropdownClassName="ws-datePicker"
                    format={"YYYY-MM-DD"}
                    value={selDate ? moment(selDate, "YYYY-MM-DD") : null}
                    getCalendarContainer={(trigger) =>
                      document.getElementById("selTime")
                    }
                    onChange={this.setDay}
                    defaultPickerValue={moment(defaultDate, "YYYY-MM-DD")}
                    open={dateVisible}
                    allowClear={false}
                    disabledDate={(current) => {
                      // return current && (current < moment(semester.startTime) || current > moment(moment(new Date().getTime() + 86400000).format('YYYY-MM-DD')));
                      return (
                        current &&
                        (current < moment(semester.startTime) ||
                          current >
                            moment(moment(new Date()).format("YYYY-MM-DD")))
                      );
                    }}
                  />
                }
              >
                <span className={timeType === "1" ? "zoe-selDate" : ""}>
                  日
                </span>
              </Popover>
              <Popover
                onVisibleChange={this.onWeekVisibleChange}
                visible={weekVisible}
                overlayClassName="ws-popover"
                placement="bottom"
                content={
                  <div className="zoe-data-hover-week">
                    <div>{semesterName}</div>
                    <div>
                      {this.weeks.map((item, index) => (
                        <div
                          className={
                            item.disable == true
                              ? "tj-week-disable"
                              : selWeek.toString() === (index + 1).toString()
                              ? "zoe-week-sel"
                              : ""
                          }
                          onClick={() => this.setWeek(index, item)}
                          key={index}
                        >
                          {item.weekName}
                        </div>
                      ))}
                    </div>
                  </div>
                }
              >
                <span className={timeType === "2" ? "zoe-selDate" : ""}>
                  周
                </span>
              </Popover>
              <Popover
                onVisibleChange={this.onMonthVisibleChange}
                visible={monthVisible}
                overlayClassName="ws-popover"
                placement="bottom"
                content={
                  <MonthPicker
                    className="ws-datePicker-sel"
                    dropdownClassName="ws-monthPicker"
                    format={"YYYY-MM"}
                    // value={selMonth ? moment(selMonth, 'YYYY-MM-DD') : null}
                    // value={selTime ? moment(selTime, 'YYYY-MM') : null}
                    // getCalendarContainer={trigger => trigger.parentNode}
                    getCalendarContainer={(trigger) =>
                      document.getElementById("selTime")
                    }
                    onChange={this.setMonth}
                    allowClear={false}
                    defaultPickerValue={moment(
                      defaultDate.split("-").splice(0, 2).join("-"),
                      "YYYY-MM-DD"
                    )}
                    open={monthVisible}
                    disabledDate={(current) => {
                      let startTime = semester.startTime
                        .split("-")
                        .splice(0, 2)
                        .join("-");
                      // let endTime = semester.endTime
                      //   .split("-")
                      //   .splice(0, 2)
                      //   .join("-");
                      // let endTime = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2);
                      // endTime[1] = Number(endTime[1]) + 1;
                      // let single = endTime[1] >= 10 ? endTime[1] : '0' + endTime[1]
                      // endTime[1] = single;
                      // endTime = endTime.join("-");
                      let endTime = moment(new Date())
                        .format("YYYY-MM-DD")
                        .split("-")
                        .splice(0, 2)
                        .join("-");
                      // let endTime = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2).join("-")
                      return (
                        current &&
                        (current < moment(startTime) ||
                          current > moment(endTime))
                      );
                    }}
                  />
                }
              >
                <span className={timeType === "3" ? "zoe-selDate" : ""}>
                  月
                </span>
              </Popover>
            </div>
          </div>

          <div className="zoe-data-select">
            <div style={{ marginRight: 30 }}>
              <div>学年学期：</div>
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={this.state.semesterId}
                onChange={this.setSemester}
                style={{ width: 200 }}
              >
                {G.ISCED_semesterList.map((item, index) => (
                  <Option key={"a" + index} value={item.semesterId}>
                    {item.semesterName}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <div>课程类别：</div>
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={this.state.couTypeId}
                onChange={this.setCouType}
                style={{ width: 200 }}
              >
                {G.ISCED_courseTypeList.map((item, index) => (
                  <Option key={"b" + index} value={item.couTypeId}>
                    {item.couTypeName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      ) : (
        //查看课程所有教学班数据
        <div className="zoe-data-header" style={{ justifyContent: "normal" }}>
          <div style={{ marginRight: 35 }}>
            <div>学年学期：</div>
            <div>{semesterName}</div>
          </div>
          <div style={{ marginRight: 35 }}>
            <div>课程类别：</div>
            <div>{couTypeName}</div>
          </div>
          <div>
            <div>当前统计时间：</div>
            <div>{curTime}</div>
          </div>
        </div>
      )
    ) : (
      <></>
    );
  }
}

export default ZoeHeader;
