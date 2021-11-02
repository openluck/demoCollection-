/*
 * @Author: lilu
 * @Date: 2020-02-09 16:22:25
 * @Last Modified by: lxx
 * @Last Modified time: 2021-04-02 09:48:51
 * 教师考勤明细组件 头部 选择框
 */

import React, { Component } from "react";
import { Select, DatePicker, Button, message, Input } from "antd";
import "./../../../style/teaDetail.scss";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
import _ from "./../../../util/_util";
import SelInput from "./../../public/searSel/element";
import G from "./../../../config/g";
import {
  ll_getTeacherList,
  ll_getDepartmentList,
  ll_getCourseList,
  ll_changeTeacher,
  ll_changeCollege,
  ll_changeCouse
} from "./../../../redux/ll-header.reducer";
import { connect } from "react-redux";
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const toChinese = _.toChinese;
const dateFormat = "YYYY-MM-DD";

@connect(state => state, {
  ll_getTeacherList,
  ll_getDepartmentList,
  ll_getCourseList,
  ll_changeTeacher,
  ll_changeCollege,
  ll_changeCouse
})
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      semester: JSON.parse(JSON.stringify(G.ISCED_semesterList)) || [],
      kqstatus: [
        { status: "", statusName: "全部" },
        { status: "1", statusName: "正常" },
        // { status: "0", statusName: "异常" }
        { status: "0", statusName: "疑似异常" } //1.21 异常 → 疑似异常
      ],
      clsTypeArr: [
        { clsType: "", clsTypeName: "全部" },
        { clsType: "practice", clsTypeName: "练习型" },
        { clsType: "teach", clsTypeName: "讲授型" },
        { clsType: "talk", clsTypeName: "对话型" },
        { clsType: "mixture", clsTypeName: "混合型" },
      ],
      course: [],
      teacher: [],
      college: [],
      check: [
        { checkType: "", checkName: "全部" },
        { checkType: "1", checkName: "正常" },
        { checkType: "2", checkName: "迟到" },
        { checkType: "3", checkName: "早退" },
        { checkType: "4", checkName: "缺勤" },
        { checkType: "5", checkName: "调换课" },
        { checkType: "6", checkName: "请假" },
        { checkType: "7", checkName: "迟到并且早退" }
      ],
      multiUseList: [
        { multiUse: "", multiUseName: "全部" },
        { multiUse: "1", multiUseName: "是" },
        { multiUse: "2", multiUseName: "否" }
      ],
      couType:
        G.ISCED_courseTypeList && G.ISCED_courseTypeList.length
          ? G.ISCED_courseTypeList
          : [],
      section: [],
      inputData: {}, // JSON.parse(JSON.stringify(this.props.inputData))
      oldInputData: {},
      eventList: [],
      inspectorList: [],
      oldEventAll: [],
      eventAll: [],
      inspectorAll: [],
      inspectorList: [],
      oldEventList: [],
      oldInspectorList: []
    };
    this.disabledDate = this.disabledDate.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
  }

  componentDidMount() {

    let { course, teacher, college, section, semester, couType } = this.state;
    let { inputData } = this.props;
    // console.log(inputData, 'section')

    let courseData = G.ISCED_courseList || [];
    courseData.map(value => {
      course.push({
        id: value.courseId,
        name: value.courseName
      });
    });
    let teacherData = G.ISCED_teacherList || [];
    teacherData.map(value => {
      teacher.push({
        id: value.teacherId,
        name: value.teacherName
      });
    });

    //1.21 当前账户身份是教师时 教师列表只显示此教师
    if (G.ISCED_curRoleInfo.roleType === '5') {
      teacher = teacher.filter(item => item.id === G.ISCED_roleData.accountId)
      let { inputData} = this.state
      inputData.teacherId = G.ISCED_roleData.accountId
      this.setState({
        inputData
      })
    }

    let collegeData = G.ISCED_collegeList || [];
    collegeData.map(value => {
      college.push({
        id: value.collegeId,
        name: value.collegeName
      });
    });
    semester.map(value => {
      if (value.sectionList && value.sectionList.length) {
        value.sectionList.unshift({
          sectionId: "",
          sectionName: "全部"
        });
      }
      // 2020-07-14 修改匹配选中学期id，对应的节次
      // if (value.isCutSemester === "1") {
      //   section = value.sectionList;
      // }
      // console.log(value, inputData.semesterId)
      if (value.semesterId === inputData.semesterId) {
        section = value.sectionList;
      }
    });
    let { roleType, belongOrgId } = G.ISCED_curRoleInfo
    if (roleType==="3" || roleType === '4') {
      inputData.collegeId = belongOrgId;
    } else {
      inputData.collegeId = '';
    }
    //1.21 当前账号身份为教师 并且所属学院只有一个时 默认选中此学院
    if (roleType === '5' && college.length === '1') {
      inputData.collegeId = belongOrgId;
    }
    // if (G.ISCED_courseTypeList && G.ISCED_courseTypeList.length) {
    //     couType = JSON.parse(JSON.stringify(G.ISCED_courseTypeList))
    //     couType.unshift({
    //         couTypeId: '',
    //         couTypeName: '全部'
    //     })
    // } else {
    //     couType = []
    // }
    this.props.ll_changeTeacher(teacher);
    this.props.ll_changeCollege(college);
    this.props.ll_changeCouse(course);
    this.setState({
      course,
      teacher,
      college,
      section,
      inputData
      // couType,
    });
  }
  static getDerivedStateFromProps(props, state) {
    let { type } = props;
    let {
      inputData,
      oldInputData,
      eventAll,
      eventList,
      inspectorAll,
      inspectorList,
      oldEventList,
      oldInspectorList,
      semester,
      section
    } = state;
    if (JSON.stringify(oldInputData) !== JSON.stringify(props.inputData)) {//判断原来的入参和传入的入参是否一样
      inputData = JSON.parse(JSON.stringify(props.inputData));
      if (oldInputData.sectionId === '' && props.inputData.semesterId) {
        semester.map(value => {
          if (value.semesterId === inputData.semesterId) {
            section = value.sectionList; //节次列表
          }
        })
      }
    }
    //课堂违纪 违纪事件判断
    if (
      (type === 5 &&
        JSON.stringify(oldEventList) !== JSON.stringify(props.eventList)) ||
      (type === 5 &&
        JSON.stringify(oldInputData) !== JSON.stringify(props.inputData))
    ) {
      eventList = JSON.parse(JSON.stringify(props.eventList));
    }
    //课堂违纪 违纪人员判断
    if (
      (type === 5 &&
        JSON.stringify(oldInspectorList) !==
        JSON.stringify(props.inspectorList)) ||
      (type === 5 &&
        JSON.stringify(oldInputData) !== JSON.stringify(props.inputData))
    ) {
      inspectorList = JSON.parse(JSON.stringify(props.inspectorList));
    }

    return {
      inputData,
      type,
      oldInputData: JSON.parse(JSON.stringify(props.inputData)),
      eventList,
      inspectorList,
      oldEventList:
        type === 5 ? JSON.parse(JSON.stringify(props.eventList)) : [],
      oldInspectorList:
        type === 5 ? JSON.parse(JSON.stringify(props.inspectorList)) : [],
      section
    };
  }

  // componentDidMount(){

  // }

  /**
   *搜索选择
   *
   * @param {*} type
   * @param {*} value
   * @memberof TeaDetail
   */
  selectChange(type, value) {
    let { inputData, course, teacher, college } = this.state;
    switch (type) {
      case "course":
        inputData.courseId = value.id;
        this.props.ll_changeCouse(course);
        break;
      case "teacher":
        inputData.teacherId = value.id;
        this.props.ll_changeTeacher(teacher);

        break;
      case "college":
        inputData.collegeId = value.id;
        this.props.ll_changeCollege(college);

        break;
      default:
        break;
    }

    //1.21当前身份是教师时，搜索加入此教师ID，只能查该教师
    if (G.ISCED_curRoleInfo.roleType === '5') {
      inputData.teacherId = G.ISCED_roleData.accountId
    }
    this.setState({
      inputData
    });
  }

  inputChange(e) {
    let { inputData } = this.state;
    inputData.courseNum = e.target.value
    this.setState({
      inputData
    })
  }

  /**
   *搜索条件
   *
   * @param {*} value
   * @memberof Header
   */
  onSearch(type, value) {
    let { inputData, course, teacher, college } = this.state;
    switch (type) {
      case "course":
        if (!value) {
          // console.log("ll_changeCouse接口");
          inputData.courseId = "";
          this.props.ll_changeCouse(course);
          this.setState({
            inputData
          });
        } else {
          let data = {
            searchValue: value,
            couTypeId: inputData.couTypeId,
            collegeId: inputData.collegeId,
            semesterId: inputData.semesterId,
            teacherId: inputData.teacherId
          };
          this.props.ll_getCourseList(data);
        }
        break;
      case "teacher":
        if (!value) {
          inputData.teacherId = "";
          this.props.ll_changeTeacher(teacher);
          this.setState({
            inputData
          });
        } else {
          let data = {
            searchValue: value,
            collegeId: inputData.collegeId,
            semesterId: inputData.semesterId,
            teacherId: inputData.teacherId //1.21 教师id
          };
          this.props.ll_getTeacherList(data);
        }
        break;
      case "college":
        if (!value) {
          inputData.collegeId = "";
          this.props.ll_changeCollege(college);
          this.setState({
            inputData
          });
        } else {
          let data = {
            searchValue: value,
            collegeId: inputData.collegeId,
            semesterId: inputData.semesterId,
            courseId: inputData.courseId,
            teacherId: inputData.teacherId,
            couTypeId: inputData.couTypeId
          };
          this.props.ll_getDepartmentList(data);
        }
        break;
      default:
        break;
    }
  }

  /**
   *筛选条件
   *
   * @param {*} type
   * @param {*} value
   * @memberof Header
   */
  select(type, value) {
    let { inputData, semester, section, eventList, inspectorList } = this.state;
    // let {eventList, inspectorList} = this.props
    let reg = /^[0-9]*$/;
    switch (type) {
      case "semester":
        semester.map(val => {
          if (val.semesterId === value) {
            inputData.startTime = val.startTime;
            inputData.endTime =
              val.isCutSemester === "1"
                ? moment(new Date()).format("YYYY-MM-DD")
                : val.endTime;
            section = val.sectionList;
          }
        });
        if (this.props.type === 5) {
          let { eventAll, inspectorAll } = this.props;
          for (let i = 0; i < eventAll.length; i++) {
            if (eventAll[i].semesterId === value) {
              eventList = eventAll[i].eventList;
              break;
            } else {
              eventList = [];
            }
          }
          for (let i = 0; i < inspectorAll.length; i++) {
            if (inspectorAll[i].semesterId === value) {
              inspectorList = inspectorAll[i].inspectorList;
              break;
            } else {
              inspectorList = [];
            }
          }
          inputData.eventId = "";
          inputData.inspectorId = "";
        }
        inputData.sectionId = "";
        inputData.semesterId = value;
        break;
      case "status":
        inputData.status = value;
        inputData.checkType = '';
        break;
      case "clsType":
        inputData.classRoomType = value;
        break;
      case "check":
        inputData.checkType = value;
        break;
      case "couType":
        inputData.couTypeId = value;
        break;
      case "section":
        inputData.sectionId = value;
        break;
      case "min":
        let min = value.target.value;
        if (reg.test(min) && min) {
          if (min > 999 && (this.props.type === 2 || this.props.type === 3)) {
            return;
          }
          if (min > 100 && this.props.type === 4) {
            return;
          }

          inputData.min = Number(min);
        } else if (!min) {
          inputData.min = "";
        }
        // if (value.target.value === null) {
        //     inputData.min = 0
        // } else if (value.target.value > inputData.max) {
        //     inputData.min = inputData.max
        // }else{
        //     inputData.min=value.target.value
        // }
        break;
      case "max":
        let max = value.target.value;
        if (reg.test(max) && max) {
          if (max > 999 && (this.props.type === 2 || this.props.type === 3)) {
            return;
          }
          if (max > 100 && this.props.type === 4) {
            return;
          }
          inputData.max = Number(max);
        } else if (!max) {
          inputData.max = "";
        }
        break;
      case "event":
        inputData.eventId = value;
        break;
      case "people":
        inputData.inspectorId = value;
        break;
      case "multiUse":
        inputData.multiUse = value;
        break;
      default:
        break;
    }
    this.setState({
      inputData,
      section,
      inspectorList,
      eventList
    });
  }

  /**
   *禁止选择日期
   *
   * @param {*} current
   * @returns
   * @memberof Header
   */
  disabledDate(current) {
    let { inputData, semester } = this.state;
    let start;
    let end;
    semester.map(value => {
      if (inputData.semesterId === value.semesterId) {
        start = new Date(value.startTime).getTime();
        if (value.isCutSemester === "1") {
          end = new Date();
        } else {
          end = new Date(value.endTime).getTime();
        }
      }
    });
    return (
      current > moment(end).endOf("day") ||
      current < moment(start).startOf("day")
    );
  }

  /**
   *时间选择
   *
   * @param {*} type
   * @param {*} date
   * @param {*} dateString
   * @memberof Header
   */
  dateChange(type, date, dateString) {
    let { inputData } = this.state;
    console.log('dateString', dateString);
    switch (type) {
      case "start":
        inputData.startTime = dateString;
        break;
      case "end":
        inputData.endTime = dateString;
        break;
      default:
        break;
    }
    this.setState({
      inputData
    });
  }

  /* 搜索 */
  clickSearch() {
    let { inputData, inspectorList, eventList } = this.state;
    let type = this.props.type;
    if (type === 2 || type === 3 || type === 4) {
      inputData.sortType = 1;
      let max;
      let min;
      if (type === 2 || type === 3) {
        max = inputData.max === "" ? null : inputData.max;
        min = inputData.min === "" ? null : inputData.min;
      } else {
        max = inputData.max === "" ? null : inputData.max;
        min = inputData.min === "" ? null : inputData.min;
      }
      if (min > max) {
        message.warn("最小值应小于最大值");
        return;
      }
    }
    if (inputData.startTime === "") {
      message.warn("请选择开始日期");
      return;
    }
    if (inputData.endTime === "") {
      message.warn("请选择结束日期");
      return;
    }
    if (
      new Date(inputData.startTime).getTime() >
      new Date(inputData.endTime).getTime()
    ) {
      message.warn("开始日期应小于结束日期");
      return;
    }
    this.props.search(inputData, inspectorList, eventList);
  }
  render() {
    let {
      kqstatus,
      clsTypeArr,
      semester,
      check,
      couType,
      inputData,
      section,
      eventList,
      inspectorList,
      multiUseList
    } = this.state;
    let { course, teacher, college } = this.props.ll_Header_reducer;
    let { type, pageType } = this.props;
    let { isClassOrder } = G.ISCED_setInfo
    return (
      <div className={"ll-teaD-top"}>
        <div className="ll-top-bor">
          <div className="ll-top-tit">学年学期：</div>
          <Select
            placeholder="请选择"
            onChange={this.select.bind(this, "semester")}
            value={semester.length ? inputData.semesterId : []}
            className="ll-select"
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {semester.map((value, key) => {
              return (
                <Option value={value.semesterId} key={key}>
                  {value.semesterName}
                </Option>
              );
            })}
          </Select>
        </div>
        {
          isClassOrder == '1' ?
            <div className="ll-top-bor">
              <div className="ll-top-tit">课程号：</div>
              <div className="ll-select ll-searchInp">
                <Input
                  placeholder='请输入'
                  onChange={this.inputChange.bind(this)}
                  value={inputData.courseNum}
                />
              </div>
            </div> : null
        }

        <div className="ll-top-bor">
          <div className="ll-top-tit">课程名：</div>
          <div className="ll-select ll-searchInp">
            <SelInput
              onChange={this.selectChange.bind(this, "course")}
              onSearch={this.onSearch.bind(this, "course")}
              value={inputData.courseId}
              list={course}
            />
          </div>
          {/* <Select
                        showSearch
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={this.selectChange.bind(this, 'course')}
                        onSearch={this.onSearch.bind(this)}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={inputData.courseId}
                        className='ll-select'
                    >
                        {
                            course.map((value, key) => {
                                return <Option value={value.courseId} key={key}>{value.courseName}</Option>

                            })
                        }
                    </Select> */}
        </div>

        <div className="ll-top-bor">
          <div className="ll-top-tit">教师：</div>
          <div className="ll-select ll-searchInp">
            <SelInput
              onChange={this.selectChange.bind(this, "teacher")}
              onSearch={this.onSearch.bind(this, "teacher")}
              value={ G.ISCED_curRoleInfo.roleType === '5' ? G.ISCED_roleData.accountId : inputData.teacherId }
              list={teacher}
            />
          </div>

          {/* <Select
                        showSearch
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={this.selectChange.bind(this, 'teacher')}
                        onSearch={this.onSearch.bind(this)}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={inputData.teacherId}
                        className='ll-select'
                    >
                        {
                            teacher.map((value, key) => {
                                return <Option value={value.teacherId} key={key}>{value.teacherName}</Option>
                            })
                        }
                    </Select> */}
        </div>
        <div className="ll-top-bor">
          <div className="ll-top-tit">开课单位：</div>
          <div className="ll-select ll-searchInp">
            <SelInput
              onChange={this.selectChange.bind(this, "college")}
              onSearch={this.onSearch.bind(this, "college")}
              value={inputData.collegeId}
              list={college}
            />
          </div>
          {/* <Select
                        showSearch
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={this.selectChange.bind(this, 'college')}
                        onSearch={this.onSearch.bind(this)}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={inputData.collegeId}
                        className='ll-select'
                    >
                        {
                            college.map((value, key) => {
                                return <Option value={value.collegeId} key={key}>{value.collegeName}</Option>
                            })
                        }

                    </Select> */}
        </div>
        {type === 1 ? (
          <>
            <div className="ll-top-bor">
              <div className="ll-top-tit">考勤状态：</div>
              <Select
                placeholder="请选择"
                onChange={this.select.bind(this, "status")}
                value={kqstatus.length ? inputData.status : []}
                className="ll-select"
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {kqstatus.map((value, key) => {
                  return (
                    <Option value={value.status} key={key}>
                      {value.statusName}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className="ll-top-bor">
              <div className="ll-top-tit">状态类别：</div>
              <Select
                placeholder="请选择"
                onChange={this.select.bind(this, "check")}
                value={check.length ? inputData.checkType : []}
                className="ll-select"
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {check.map((value, key) => {
                  return (
                    // 考勤状态正常
                    (inputData.status === '1' && value.checkType === '') || (inputData.status === '1' && (value.checkType === '1' || value.checkType === '6')) ?
                      <Option value={value.checkType} key={key}>
                        {value.checkName}
                      </Option>
                      // 考勤状态异常
                      : inputData.status === '0' && value.checkType !== '1' && value.checkType !== '6' ?
                        <Option value={value.checkType} key={key}>
                          {value.checkName}
                        </Option> :
                        // 全部
                        inputData.status === '' ?
                          <Option value={value.checkType} key={key}>
                            {value.checkName}
                          </Option> : null
                  );
                })}
              </Select>
            </div>
          </>
        ) : null}


        {type === 5 ? (
          <>
            <div className="ll-top-bor">
              <div className="ll-top-tit">违纪事件：</div>
              <Select
                placeholder="请选择"
                onChange={this.select.bind(this, "event")}
                value={eventList.length ? inputData.eventId : []}
                className="ll-select"
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {eventList.map((value, key) => {
                  return (
                    <Option value={value.eventId} key={key}>
                      {value.eventName}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </>
        ) : null}
        {type === 5 ? (
          <>
            <div className="ll-top-bor">
              <div className="ll-top-tit">巡课员：</div>
              <Select
                placeholder="请选择"
                onChange={this.select.bind(this, "people")}
                value={inspectorList.length ? inputData.inspectorId : []}
                className="ll-select"
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {inspectorList.map((value, key) => {
                  return (
                    <Option value={value.inspectorId} key={key}>
                      {value.inspectorName}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </>
        ) : null}
        {type === 7 && pageType === "analy" ? (
          <div className="ll-top-bor">
            <div className="ll-top-tit">课堂类型：</div>
            <Select
              placeholder="请选择"
              onChange={this.select.bind(this, "clsType")}
              value={clsTypeArr.length ? inputData.classRoomType : []}
              className="ll-select"
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {clsTypeArr.map((value, key) => {
                return (
                  <Option value={value.clsType} key={key}>
                    {value.clsTypeName}
                  </Option>
                );
              })}
            </Select>
          </div>
        ) : null}
        <div
          className="ll-top-bor"
          style={
            type === 5
              ? isClassOrder == 1?{ marginLeft: 0 ,width:"24.4%"}:{ marginLeft: 0 ,width:"23%"}
              : type === 1
                ? isClassOrder == 1?{ width:"24.4%"}:{ width:"23%"}
                : {}
          }
        >
          <div className="ll-top-tit">课程类别：</div>
          <Select
            placeholder="请选择"
            onChange={this.select.bind(this, "couType")}
            value={inputData.couTypeId || []}
            className="ll-select"
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {couType.map((value, key) => {
              return (
                <Option value={value.couTypeId} key={key}>
                  {value.couTypeName}
                </Option>
              );
            })}
          </Select>
        </div>
        {type === 7 && pageType === 'media' ? (
          <div className="ll-top-bor">
            <div className="ll-top-tit">多媒体使用：</div>
            <Select
              placeholder="请选择"
              onChange={this.select.bind(this, "multiUse")}
              value={inputData.multiUse}
              className="ll-select"
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {multiUseList.map((value, key) => {
                return (
                  <Option value={value.multiUse} key={key}>
                    {value.multiUseName}
                  </Option>
                );
              })}
            </Select>
          </div>
        ) : null}
        {type === 2 || type === 3 || type === 4 ? (
          <div className="ll-top-bor">
            <div className="ll-top-tit">
              {type === 2
                ? "学生到课率："
                : type === 3
                  ? "前排就座率："
                  : "低头率："}
            </div>
            <Input
              placeholder="请输入"
              value={inputData.min}
              onChange={this.select.bind(this, "min")}
              className="ll-h-input"
            />
            <div className="ll-line">—</div>
            <Input
              value={inputData.max}
              placeholder="请输入"
              onChange={this.select.bind(this, "max")}
              className="ll-h-input"
            />
          </div>
        ) : null}
        <div
          className="ll-top-bor"
          style={
            type === 1
              ? isClassOrder == 1 ? { marginRight: '1.4%', marginLeft: 0, width: "23%" } : { width: "24.4%" }
              : type === 5
                ?isClassOrder == 1 ?  { width: "23%" }:{width: "24.4%"}
                : type === 6
                  ? {}
                  : isClassOrder == 1?{ width: "24.4%", marginLeft: 0 }:{width:'23%'}
          }
        >
          <div className="ll-top-tit" style={isClassOrder == 1 ? { width: 78 } : {}}>节次：</div>
          <Select
            placeholder="请选择"
            onChange={this.select.bind(this, "section")}
            value={section.length ? inputData.sectionId : []}
            className="ll-select"
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {section.map((value, key) => {
              return (
                <Option value={value.sectionId} key={key}>
                  {value.sectionName}
                </Option>
              );
            })}
          </Select>
        </div>
        <div
          className="ll-top-bor"
          style={
            type === 1 || type === 5
              ? isClassOrder == 1 ? {width:'36%' } : { width: "36%"}
              : type === 6
                ? { width: "36%", marginLeft: 0 }
                : { width: "36%", marginRight: "-3px" }
          }
        >
          <div
            className="ll-top-tit"
            style={
              type === 1 || type === 5 || type === 6 ? isClassOrder == 1 ? { width: 78 } : {} : { width: "42px" }
            }
          >
            日期：
          </div>
          <DatePicker
            value={
              inputData.startTime
                ? moment(inputData.startTime, dateFormat)
                : null
            }
            format={dateFormat}
            onChange={this.dateChange.bind(this, "start")}
            allowClear={false}
            disabledDate={this.disabledDate}
            
            getCalendarContainer={trigger => trigger.parentNode}
          />
          <div className="ll-line">—</div>
          <DatePicker
            // defaultValue={moment('2015/01/01', dateFormat)}
            value={
              inputData.endTime ? moment(inputData.endTime, dateFormat) : null
            }
            format={dateFormat}
            onChange={this.dateChange.bind(this, "end")}
            allowClear={false}
            disabledDate={this.disabledDate}
            
            getCalendarContainer={trigger => trigger.parentNode}
          />
        </div>
        <div className="ll-btn" onClick={this.clickSearch}>
          <Button icon="search">查询</Button>
        </div>
      </div>
    );
  }
}

export default Header;
