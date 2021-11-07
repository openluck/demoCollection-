import React, { Component, Fragment } from "react";
import { Button, Pagination, Modal, Select, message } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from 'lodash';
import noneData from './../../../../media/picture/noneData.png';
import PagePonent from './../../../components/pagePonent';

import "./../../../../style/tpk/zxpk/seleCourseComp.scss";
import QueryConditions from "./queryConditions";
import { getCourseTable, getTaskId } from "./../../../../redux/tpk/zxpk/gwj-seleCourse.reducer";
import { requestForListen } from "./../../../../util/request";

const { Option } = Select;

@connect(state => state.seleCourseReducer, { getCourseTable, getTaskId })
class SeleCourseComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: [],
      visible: false,
      record: {}, //当前课程记录
      weekId: "",
      children: [],
      timeId: "",
      currentPage: 1,
      queryData: {},
      week: [],
      taskId: '',     //任务Id
    };
  }

  componentDidMount() {
    this.props.getTaskId(this.props.match.params.taskId);
    this.setState({
      taskId: this.props.match.params.taskId
    })
    // this.getData();
    //设置节次默认值
  }

  queryConditions = args => {
    // console.log("args", args);
    this.props.getCourseTable({
      taskId: this.state.taskId,
      scopeId: args.scopeId,
      dScopeId: args.dScopeId,
      courseId: args.courseId,
      teacherName: args.teacherName,
      courseName: args.courseName,
      pageIndex: 1,
      pageSize: 20
    });
    this.setState({
      queryData: args,
      currentPage: 1
    });
  };

  chooseDay = record => {
    this.setState({ visible: true, record });
    this.getWeek({
      courseId: record.courseId
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleOk = () => {
    const { taskId, perId } = this.props.match.params;
    const timeData = _.find(this.state.children, { 'timeId': this.state.timeId })
    // console.log(this.state.children, this.state.timeId, timeData);
    this.props.history.push(`/home/tpk/video/${this.state.record.courseId}/${taskId}/${perId}/${timeData.curId}/1`);
    this.setState({ visible: false, record: {} });
  };

  onchangePage = page => {
    let { queryData } = this.state;
    this.props.getCourseTable({
      taskId: this.props.taskId,
      scopeId: queryData.scopeId,
      dScopeId: queryData.dScopeId,
      courseId: queryData.courseId,
      teacherName: queryData.teacherName,
      courseName: queryData.courseName,
      pageIndex: page,
      pageSize: 20
    });
    this.setState({
      currentPage: page
    });
    this.node.scrollIntoView();
  };

  onChangeWeek = (value, name) => {
    let children = [],
      timeId = '';
    if (name == "weekId") {
      for (let i = 0; i < this.state.week.length; i++) {
        if (this.state.week[i].weekId == value) {
          children = [...this.state.week[i].children];
        }
      }
      timeId = children[0].timeId;
      this.setState({
        [name]: value,
        children,
        timeId: timeId
      });
    } else {
      // console.log(value, name);
      timeId = value;
      this.setState({
        timeId: timeId
      });
    }
  };

  /**
   * 获取评课周次
   */
  getWeek = params => {
    requestForListen("get/evaClassTime", params, res => {
      // console.log(res);
      let week = [],
        weekId = '',
        timeId = '',
        children = [];
      if (res.result) {
        if (res.data !== null && res.data.length) {
          week = [...res.data];
          weekId = week[0].weekId;
          timeId = week[0].children[0].timeId;
          children = [...week[0].children];
        }
      } else {
        message.info(res.message);
      }
      this.setState({
        week,
        weekId,
        children,
        timeId
      });
    });
  };

  render() {
    let { record, weekId, children, timeId } = this.state;
    let { pageData } = this.props;
    // console.log(record);
    return (
      <div className="gwj-seleCourse" ref={node => (this.node = node)}>
        <div className="gwj-seleCourse-title">
          <span className="gwj-title-span">选择课程</span>
          {/* <Button
            className="gwj-seleCourse-btn"
            onClick={() => {
              this.props.history.goBack(-1);
            }}
          >
            返回
          </Button> */}
        </div>

        <QueryConditions getQueryCondition={this.queryConditions} taskId={this.props.taskId} />

        <div className="gwj-seleCourse-table">
          <div className="gwj-seleCourse-table-fixedHeight">
            {pageData.pageList && pageData.pageList.length ? (
              <Fragment>
                <ul className="gwj-ul">
                  <li>序号</li>
                  <li>开课院系</li>
                  <li>课程名称</li>
                  <li>教师</li>
                  <li>课程类别</li>
                  <li>星期</li>
                  <li>教室</li>
                  <li>评课人数</li>
                  <li>我的评课状态</li>
                  <li>操作</li>
                </ul>
                {pageData.pageList.map((item, index) => {
                  return (
                    <ul className="gwj-ul gwj-ul-c" key={index}>
                      <li>{item.serialNum}</li>
                      <li title={item.department}>{item.department || '-'}</li>
                      <li title={item.course}>{item.course || '-'}</li>
                      <li>{item.teacher || '-'}</li>
                      <li>{item.courseTypeName || '-'}</li>
                      {/* <li>
                        {
                          item.courseType === '1' ? '公共基础' :
                            item.courseType === '2' ? '公共选修' :
                              item.courseType === '3' ? '专业基础' : '专业选修'
                        }
                      </li> */}
                      <li>{item.weekDay || '-'}</li>
                      <li>{item.classRoom || '-'}</li>
                      <li>{`${item.evaClassNum}人已评`}</li>
                      <li className={item.evaClassStatus == 0 ? "gwj-noEva" : null}>
                        {item.evaClassStatus == 0 ? "未评课" : "已评" + item.evaClassStatus + "次"}
                      </li>
                      <li className="gwj-choose" onClick={() => this.chooseDay(item)}>
                        选择节次
                      </li>
                    </ul>
                  );
                })}
                {/* <div className="gwj-pagination">
                  <Pagination
                    current={this.state.currentPage}
                    total={pageData.total || 0}
                    pageSize={20}
                    showTotal={total => `每页20条数据，共 ${total} 条`}
                    onChange={this.onchangePage}
                  />
                </div> */}
                <div className='mj-p-pages'>
                  <PagePonent
                    pageIndex={this.state.currentPage}
                    pageSize={20}
                    pageChan={this.onchangePage}
                    len={pageData.pageList && pageData.pageList.length || 0}
                    total={pageData.total || 0} />
                </div>
              </Fragment>
            ) : (
                <div className='mj-rxq-noneData'>
                  <img src={noneData} />
                  <div>暂无数据</div>
                </div>
              )}
          </div>
        </div>
        <Modal
          className="gwj-modal"
          title="选择节次"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="返回"
          okText="评课"
        >
          <p>
            评课课程：
            {record.department +
              " " +
              record.course +
              " " +
              record.teacher +
              " " + '星期' +
              record.weekDay}
          </p>
          <div>
            选择周次：
            <Select
              style={{ width: 120 }}
              value={weekId}
              onChange={value => this.onChangeWeek(value, "weekId")}
            >
              {this.state.week.length
                ? this.state.week.map((item, index) => {
                  return (
                    <Option key={index} value={item.weekId}>
                      {item.weekName}
                    </Option>
                  );
                })
                : null}
            </Select>
            <Select
              style={{ width: 120 }}
              value={timeId}
              onChange={value => this.onChangeWeek(value, "timeId")}
            >
              {children.length
                ? children.map((item, index) => {
                  return (
                    <Option key={item.timeId} value={item.timeId}>
                      {item.timeName}
                    </Option>
                  );
                })
                : null}
            </Select>
          </div>
        </Modal>
      </div>
    );
  }
}
export default withRouter(SeleCourseComp);
