import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Select, Input, Button, message } from "antd";
import { connect } from "react-redux";

import "./../../../../style/tpk/zxpk/queryConditions.scss";
import { requestForListen} from "./../../../../util/request";

const { Option } = Select;
@withRouter
export default class QueryConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifMount: true,    //是否是初始化：true是，false不是

      scopeId: "1",
      dScopeId: "",
      courseId: "",
      teacherName: "",
      courseName: "",

      departmentScope: [],
      courseType: []
    };
    this.courseScope = [
      { scopeName: "指定课程", scopeId: "1" },
      { scopeName: "全部课程", scopeId: "0" }
    ];
  }

  componentDidMount() {
    //请求三个接口，默认选中第一项
    this.getDepartmentScope({
      taskId: this.props.taskId,
      scopeId: this.state.scopeId
    });
    // this.getCourseType({
    //   taskId: this.props.taskId,
    //   dScopeId: this.state.dScopeId
    // });
    // this.props.getQueryCondition({ ...this.state });
  }

  onChangeSelect = (value, name) => {
    // console.log("value", value);
    // console.log("name", name);
    this.setState({
      [name]: value
    });
    //根据name分别做正关联进行接口请求
    if (name == "scopeId") {
      this.getDepartmentScope({
        taskId: this.props.taskId,
        scopeId: value
      });
      // this.getCourseType({
      //   taskId: this.props.taskId,
      //   dScopeId: this.state.dScopeId
      // });
    }
    if (name == "dScopeId") {
      this.getCourseType({
        taskId: this.props.taskId,
        dScopeId: value,
        scopeId : this.state.scopeId
      });
    }
  };

  onChangeInput = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  };

  query = () => {
    // console.log("查询！");
    this.props.getQueryCondition({ ...this.state });
  };

  /**
   * 开课院系查询
   */
  getDepartmentScope = params => {
    params.taskId = this.props.match.params.taskId;
    requestForListen("get/departmentScope", params, res => {
      // console.log(res);
      let departmentScope = [],
        dScopeId = "";
      if (res.result) {
        if (res.data !== null) {
          departmentScope = [...res.data];
          if (departmentScope.length) {
            dScopeId = departmentScope[0].dScopeId;
          }
          // if (this.state.ifMount) {
          this.getCourseType({ taskId: this.props.taskId, dScopeId, scopeId: params.scopeId });
          // }
          this.setState({
            departmentScope,
            dScopeId
          });
        }
      } else {
        message.info(res.message);
      }
    });
  };
  /**
   * 课程类别查询
   */
  getCourseType = params => {
    requestForListen("get/courseType", params, res => {
      // console.log(res);
      let courseType = [],
        courseId = "";
      if (res.result) {
        if (res.data !== null) {
          courseType = [...res.data];
        }
      } else {
        message.info(res.message);
      }
      if (courseType.length) {
        courseId = courseType[0].courseId;
      }
      this.setState({
        courseType,
        courseId
      }, () => {
        if (this.state.ifMount) {
          this.props.getQueryCondition({ ...this.state });
          this.setState({
            ifMount: false
          })
        }
      });
    });
  };
  render() {
    let { scopeId, dScopeId, courseId, teacherName, courseName } = this.state;
    return (
      <div className="gwj-queryConditions">
        <ul>
          <li>
            课程范围：
            <Select
              value={scopeId}
              style={{ width: "60%" }}
              onChange={value => this.onChangeSelect(value, "scopeId")}
            >
              {this.courseScope.map((item, index) => {
                return (
                  <Option key={index} value={item.scopeId}>
                    {item.scopeName}
                  </Option>
                );
              })}
            </Select>
          </li>
          <li>
            开课院系：
            <Select
              value={dScopeId}
              style={{ width: "60%" }}
              onChange={value => this.onChangeSelect(value, "dScopeId")}
            >
              {this.state.departmentScope.length
                ? this.state.departmentScope.map((item, index) => {
                  return (
                    <Option key={index} value={item.dScopeId}>
                      {item.dScopeName}
                    </Option>
                  );
                })
                : null}
            </Select>
          </li>
          <li>
            课程类别：
            <Select
              value={courseId}
              style={{ width: "60%" }}
              onChange={value => this.onChangeSelect(value, "courseId")}
            >
              {this.state.courseType.length
                ? this.state.courseType.map((item, index) => {
                  return (
                    <Option key={index} value={item.courseId}>
                      {item.courseName}
                    </Option>
                  );
                })
                : null}
            </Select>
          </li>
          <li>
            教师：
            <Input
              className="gwj-input"
              placeholder="输入教师名称"
              value={teacherName}
              onChange={e => this.onChangeInput(e, "teacherName")}
            />
          </li>
          <li>
            课程：
            <Input
              className="gwj-input"
              placeholder="输入课程名称"
              value={courseName}
              onChange={e => this.onChangeInput(e, "courseName")}
            />
          </li>
          <li>
            <Button type="primary" onClick={this.query}>
              筛选
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}
