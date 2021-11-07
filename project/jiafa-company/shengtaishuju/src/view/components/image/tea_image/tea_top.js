/*
 * @Author: wangsong 
 * @Date: 2020-02-27 10:10:12 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-24 17:24:43
 * 画像中心学校头部
 */
import React, { Component } from 'react';
import { Select } from "antd";
import SelInput from "../../../public/searSel/element";
import G from "../../../../config/g";
import { request } from './../../../../util/request';
const { Option } = Select;
class TeaTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        semesterId: G.ISCED_cutSemesterData.semesterId,
        teacherId: "",
        collegeId: "",
      },
      teacherList: G.ISCED_teacherList || [],
      collegeList: G.ISCED_collegeList || [],
    };
    this.onChangeSemester = this.onChangeSemester.bind(this);
    this.onChangeCollege = this.onChangeCollege.bind(this);
    this.getTeacherList = this.getTeacherList.bind(this);
    this.getCollegeList = this.getCollegeList.bind(this);
  }
  componentDidMount () {
    if (
      (this.props.match.params.teacherId && this.props.match.params.teacherId != "undefined")
      || G.ISCED_curRoleInfo.roleType === "5"
    ) {
      let { params } = this.state;
      if (G.ISCED_curRoleInfo.roleType === "5") {
        params.teacherId = G.ISCED_roleData && G.ISCED_roleData.accountId
        params.collegeId = G.ISCED_collegeList.length === 1 ? G.ISCED_collegeList[0].collegeId : ""
      } else {
        params.teacherId = this.props.match.params.teacherId;
        params.collegeId = this.props.match.params.collegeId && this.props.match.params.collegeId != "undefined"
          ? this.props.match.params.collegeId
          : "";
      }
      this.setState({ params });
      this.props.editTopParams(params);
    }
  }
  /**
   * @description 改变学期
   */
  onChangeSemester (value) {
    let { params } = this.state;
    params.semesterId = value;
    params.teacherId = "";
    this.getTeacherList({
      searchValue: "",
      semesterId: params.semesterId,
      collegeId: ""
    })
    params.collegeId = "";
    this.setState({
      params,
      collegeList: []
    });
    this.props.editTopParams(params);
  }
  /**
   * @description 获取教师列表
   */
  getTeacherList (params) {
    request('api/public/getTeacherList', params, (res) => {
      if (res.result && res.data) {
        this.setState({
          teacherList: res.data
        })
      } else {
        message.warning(res.message)
      }
    })
  }
  /**
   * @description 获取开课单位列表
   */
  getCollegeList (params) {
    return new Promise((reject, resove) => {
      request('api/public/getDepartmentList', params, (res) => {
        if (res.result && res.data) {
          this.setState({
            collegeList: res.data
          }, () => { reject(res) });
        } else {
          message.warning(res.message)
        }
      })
    })

  }
  /**
   * @description 改变教师
   */
  onChangeTeacher (type, value) {
    let { params } = this.state;
    params.teacherId = value.id;
    params.collegeId = "";
    this.getCollegeList({
      searchValue: "",
      couTypeId: "",
      courseId: "",
      semesterId: params.semesterId,
      teacherId: params.teacherId
    }).then(res => {
      params.collegeId = res.data.length === 1 ? res.data[0].collegeId : "";
      this.setState({
        params,
        teacherList: G.ISCED_teacherList
      });
      this.props.editTopParams(params);
    });

  }
  /**
   * @description 搜索教师
   */
  onSearchTeacher (type, value) {
    let { params } = this.state;
    this.getTeacherList({
      searchValue: value,
      semesterId: params.semesterId,
      couTypeId: params.couTypeId
    })
  }
  /**
   * @description 改变开课单位
   */
  onChangeCollege (value) {
    let { params } = this.state;
    params.collegeId = value;
    this.setState({
      params
    });
    this.props.editTopParams(params);
  }
  render () {
    let { params, teacherList, collegeList } = this.state;
    teacherList.map((item) => {
      item.name = item.teacherName;
      item.id = item.teacherId;
    })
    let { roleType } = G.ISCED_curRoleInfo
    return (
      <div className="ws-scl-top">
        <Select className="ws-select ws-noBor" placeholder={"请选择学期"} onChange={this.onChangeSemester} value={params.semesterId || undefined}>
          {
            G.ISCED_semesterList.map((item, index) => (
              <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
            ))
          }

        </Select>
        <div className="ws-top-sel">
          <label>教师 : </label>
          <SelInput
            onChange={this.onChangeTeacher.bind(this, 'teacher')}
            onSearch={this.onSearchTeacher.bind(this, 'teacher')}
            value={params.teacherId}
            list={teacherList}
          />

          {(roleType === "1" || roleType === '2' || roleType === '5') ?
            <React.Fragment>
              <label>开课单位 : </label>
              <Select className="ws-select" notFoundContent={params.teacherId ? "暂无数据" : "请先选择教师"} placeholder={"请选择"} onChange={this.onChangeCollege} value={params.collegeId}>
                {collegeList.length !== 1 ? <Option key="" value="">全部</Option> : ""}
                {
                  collegeList.map((item, index) => (
                    <Option key={item.collegeId} value={item.collegeId}>{item.collegeName}</Option>
                  ))
                }

              </Select>
            </React.Fragment> : ""}
        </div>
      </div>
    );
  }
}

export default TeaTop;
