/*
 * @Author: zoe ღ
 * @Date: 2020-02-10 16:22:28
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-05-07 11:24:09
 */
import React, { Component } from "react";
import { Select, DatePicker } from "antd";
import SVG from "../../../public/svg";
import SelInput from "./../../../public/searSel/element";
import G from "../../../../config/g";
import { request } from "../../../../util/request";
const { Option } = Select;
class ZoeDownLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeId: "", //开课单位id
      courseId: "", //课程id
      teacherId: "", //教师id
      collegeList: G.ISCED_collegeList, //开课单位列表
      courseList: [], //课程列表
      teacherList: [], //教师列表
      semesterId: "", //当前选择的学期id
      couTypeId: "", //当前选择的课程类别
    };
  }
  componentDidMount() {
    const { curSign, pinkInfo, collegeId, subPageType } = this.props;
    const { roleType } = G.ISCED_curRoleInfo;
    if (curSign === 2) {
      //2级页面
      if (subPageType === 1) {
        //调课程列表接口
        if (roleType === "1" || roleType === "2") {
          //校级账号登陆
          this.getCourse({
            searchValue: "",
            couTypeId: pinkInfo.couTypeId,
            semesterId: pinkInfo.semesterId,
            collegeId,
          });
        }
      } else {
        //调教师列表接口
        if (roleType === "1" || roleType === "2") {
          //校级账号登陆
          this.getTeacher({
            searchValue: "",
            semesterId: pinkInfo.semesterId,
            collegeId: collegeId,
          });
        }
      }
    }
  }
  componentWillReceiveProps(prop) {
    // console.log('pinkInfo',prop.pinkInfo)
    // console.log('collegeId',prop.collegeId)
    // console.log('curSign',prop.curSign)
    const { semesterId, couTypeId } = this.state;
    const { belongOrgId, roleType } = G.ISCED_curRoleInfo;
    if (prop.curSign === 1) {
      //校级的情况
      if (
        prop.pinkInfo.semesterId !== semesterId ||
        prop.pinkInfo.couTypeId !== couTypeId
      ) {
        this.getCollege({
          searchValue: "",
          semesterId: prop.pinkInfo.semesterId,
          courseId: "",
          teacherId: "",
          couTypeId: prop.pinkInfo.couTypeId,
        });
        this.setState({
          semesterId: prop.pinkInfo.semesterId,
          couTypeId: prop.pinkInfo.couTypeId,
        });
      }
    }
    if (prop.curSign === 2) {
      if (roleType === "2" || roleType === "3") {
        //院级账号进入
        if (prop.subPageType === 1) {
          //调课程列表接口
          if (
            prop.pinkInfo.semesterId !== semesterId ||
            prop.pinkInfo.couTypeId !== couTypeId
          ) {
            this.getCourse({
              searchValue: "",
              couTypeId: prop.pinkInfo.couTypeId,
              semesterId: prop.pinkInfo.semesterId,
              collegeId: belongOrgId,
            });
            this.setState({
              semesterId: prop.pinkInfo.semesterId,
              couTypeId: prop.pinkInfo.couTypeId,
            });
          }
        }
        if (prop.subPageType === 2) {
          //调教师列表接口
          if (prop.pinkInfo.semesterId !== semesterId) {
            this.getTeacher({
              searchValue: "",
              semesterId: prop.pinkInfo.semesterId,
              collegeId: belongOrgId,
            });
            this.setState({
              semesterId: prop.pinkInfo.semesterId,
            });
          }
        }
      }
    }
  }
  // 下拉的选择事件
  selectChange = (value, type) => {
    // console.log('value',value)
    // console.log('type',type)
    const { pinkInfo, collegeId } = this.props;
    switch (type) {
      case "college":
        this.props.getCollegeId(value.id);
        if (!value.id) {
          this.setState({
            collegeList: G.ISCED_collegeList,
          });
        }
        break;
      case "course":
        this.props.getCourseId(value.id);
        if (!value.id) {
          this.getCourse({
            searchValue: "",
            couTypeId: pinkInfo.couTypeId,
            semesterId: pinkInfo.semesterId,
            collegeId,
          });
        }
        break;
      case "teacher":
        this.props.getTeacherId(value.id);
        if (!value.id) {
          this.getTeacher({
            searchValue: "",
            semesterId: pinkInfo.semesterId,
            collegeId,
          });
        }
        break;
      default:
        break;
    }
  };
  //搜索事件 搜索的数据用来查询全局公共的下拉列表 学院列表 课程列表 教师列表
  onSearch = (searchValue, type) => {
    // console.log('searchValue',searchValue)
    // console.log('type',type)
    const { pinkInfo, collegeId } = this.props;
    switch (type) {
      case "college":
        //开课院系列表接口函数
        this.getCollege({
          searchValue,
          semesterId: pinkInfo.semesterId,
          courseId: "",
          teacherId: "",
          couTypeId: pinkInfo.couTypeId,
        });
        break;
      case "course":
        //课程院系列表接口函数
        this.getCourse({
          searchValue,
          couTypeId: pinkInfo.couTypeId,
          semesterId: pinkInfo.semesterId,
          collegeId,
        });
        break;
      case "teacher":
        //课程院系列表接口函数
        this.getTeacher({
          searchValue,
          semesterId: pinkInfo.semesterId,
          collegeId,
        });
        break;
    }
  };
  //获取开课院系列表接口函数
  getCollege = (params) => {
    request("/api/public/getDepartmentList", params, (res) => {
      if (res.result) {
        this.setState({
          collegeList: res.data,
        });
      } else {
        this.setState({
          collegeList: [],
        });
      }
    });
  };
  //获取课程列表接口函数
  getCourse = (params) => {
    request("/api/public/getCourseList", params, (res) => {
      if (res.result) {
        this.setState({
          courseList: res.data,
          oldCourseList: res.data,
        });
      } else {
        this.setState({
          courseList: [],
          oldCourseList: [],
        });
      }
    });
  };
  //获取教师列表接口函数
  getTeacher = (params) => {
    request("/api/public/getTeacherList", params, (res) => {
      if (res.result) {
        this.setState({
          teacherList: res.data,
          oldTeacherList: res.data,
        });
      } else {
        this.setState({
          teacherList: [],
          oldTeacherList: [],
        });
      }
    });
  };
  render() {
    const { curSign, subPageType } = this.props;
    const { collegeList, courseList, teacherList } = this.state;
    const { collegeId, courseId, teacherId } = this.props;
    var college = collegeList.map((item) => {
      return { id: item.collegeId, name: item.collegeName };
    });
    var course = courseList.map((item) => {
      return { id: item.courseId, name: item.courseName };
    });
    var teacher = teacherList.map((item) => {
      return { id: item.teacherId, name: item.teacherName };
    });
    return (
      <div className="zoe-data-download">
        {curSign === 1 ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>开课单位：</div>
            <SelInput
              onChange={(value) => this.selectChange(value, "college")}
              onSearch={(value) => this.onSearch(value, "college")}
              value={collegeId}
              list={college}
            />
          </div>
        ) : curSign === 2 ? (
          subPageType === 1 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>课程：</div>
              <SelInput
                onChange={(value) => this.selectChange(value, "course")}
                onSearch={(value) => this.onSearch(value, "course")}
                value={courseId}
                list={course}
              />
            </div>
          ) : subPageType === 2 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>教师：</div>
              <SelInput
                onChange={(value) => this.selectChange(value, "teacher")}
                onSearch={(value) => this.onSearch(value, "teacher")}
                value={teacherId}
                list={teacher}
              />
            </div>
          ) : null
        ) : null}

        <div className="zoe-down" onClick={this.props.downLoad}>
          <SVG type="de_download"></SVG>
          <div>下载</div>
        </div>
      </div>
    );
  }
}

export default ZoeDownLoad;
