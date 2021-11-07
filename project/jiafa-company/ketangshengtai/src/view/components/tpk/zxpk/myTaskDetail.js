import React, { Component, Fragment } from "react";
import { Button, Pagination } from "antd";
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
import { connect } from "react-redux";
// import ChaKan from "./chakan";
// import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from "./../../../public/public-component-svg";
import { G } from './../../../../config/g';
import noneData from './../../../../media/picture/noneData.png';
import PagePonent from './../../../components/pagePonent';

import "./../../../../style/tpk/zxpk/myTaskDetailComp.scss";
import {
  getSemesterEvaTask,
  getEvaTaskTable
} from "./../../../../redux/tpk/zxpk/gwj-myTaskDetail.reducer";

@connect(state => state.myTaskDetailReducer, {
  getSemesterEvaTask,
  getEvaTaskTable
})
class MyTaskDetailComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: [],
      isAsc: false, //评课日期是否正序，进来默认倒序
      currentPage: 1
    };
  }

  componentDidMount() {
    this.props.getSemesterEvaTask({ taskId: this.props.match.params.taskId });
    this.props.getEvaTaskTable({
      taskId: this.props.match.params.taskId,
      sort: this.state.isAsc ? "asc" : "desc",
      field: "evaTaskTime",
      pageIndex: this.state.currentPage,
      pageSize: 20
    });
    // this.getData();
  }

  chooseCourse = () => {
    const { taskId, perId } = this.props.match.params;
    this.props.history.push(`/home/tpk/zxpk/wdrw/xzkc/${taskId}/${perId}`);
  };

  seeMore = item => {
    // console.log("taskId", taskId);
    // const { taskId, perId } = this.props.match.params;
    this.props.history.push(
      `/home/tpk/video/${item.courseId}/${item.evaTaskId}/${item.perId}/${item.classId}/1`
    );
  };

  onchangePage = page => {
    this.props.getEvaTaskTable({
      taskId: this.props.match.params.taskId,
      sort: this.state.isAsc ? "asc" : "desc",
      field: "evaTaskTime",
      pageIndex: page,
      pageSize: 20
    });
    this.setState({
      currentPage: page
    });
    this.node.scrollIntoView();
  };

  sort = (value, name) => {
    this.setState({
      isAsc: value,
      currentPage: 1
    });
    this.props.getEvaTaskTable({
      taskId: this.props.match.params.taskId,
      sort: value ? "asc" : "desc",
      field: name,
      pageIndex: 1,
      pageSize: 20
    });
  };

  render() {
    let { semesterEvaTask, taskName, pageData } = this.props;
    let taskTypeList = JSON.parse(JSON.stringify(G.taskTypeList)),
      evaTask = '-';
    semesterEvaTask && semesterEvaTask.evaTask && taskTypeList && taskTypeList.length ?
      taskTypeList.map(item => {
        if (item.taskTypeId === semesterEvaTask.evaTask) {
          evaTask = item.tasktype;
        }
      }) : null;

    return (
      <div style={{ padding: 16, height: 'calc(100% - 40px)' }}>
        <div className="gwj-evaTaskDetail">
          <div className="gwj-evaTaskDetail-title">
            {semesterEvaTask.taskName || "-"}
          </div>

          <div className="gwj-evaTaskDetail-content">
            <ul>
              <li>
                <span>职务：</span>
                <span>{semesterEvaTask.duties || "-"}</span>
              </li>
              <li>
                <span>所属任务：</span>
                <span>{evaTask || "-"}</span>
              </li>
              <li>
                <span>最低评课次数：</span>
                <span>
                  {semesterEvaTask.evaCourseTimes || 0}次
                </span>
              </li>
              <li>
                <span>指定课程最低次数：</span>
                <span>{semesterEvaTask.miniNum || 0}次</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="gwj-evaTaskDetail-list" ref={node => (this.node = node)}>
          <div className="gwj-evaTaskDetail-title">
            <span className="gwj-titleName">评课记录</span>
            <Button
              type="primary"
              className="gwj-evaTaskDetail-btn"
              onClick={this.chooseCourse}
            >
              选择课程
            </Button>
          </div>
          <div className="gwj-evaTaskDetail-table">
            <div className="gwj-evaTaskDetail-table-fixedHeight">
              {pageData.pageList && pageData.pageList.length ? (
                <Fragment>
                  {/* <PerfectScrollbar> */}
                  <ul className="gwj-ul">
                    <li>序号</li>
                    <li>
                      评课日期
                      <div className="gwj-sort">
                        <p onClick={() => this.sort(true, "evaTaskTime")}>
                          <SVG
                            type="play"
                            title="播放"
                            className={
                              this.state.isAsc ? "gwj-iconColor" : null
                            }
                          />
                        </p>
                        <p onClick={() => this.sort(false, "evaTaskTime")}>
                          <SVG
                            type="play"
                            title="播放"
                            className={
                              this.state.isAsc ? null : "gwj-iconColor"
                            }
                          />
                        </p>
                      </div>
                    </li>
                    <li>开课院系</li>
                    <li>课程名称</li>
                    <li>课程类型</li>
                    <li>教师</li>
                    <li>节次</li>
                    <li>评课状态</li>
                    <li>操作</li>
                  </ul>
                  {pageData.pageList.map((item, index) => {
                    return (
                      <ul className="gwj-ul gwj-ul-c" key={index}>
                        <li title={item.serialNum}>{item.serialNum || '-'}</li>
                        <li title={moment(new Date(item.evaTaskTime)).format("YYYY-MM-DD HH:mm:ss")}>
                          {
                            item.evaTaskTime && moment(new Date(item.evaTaskTime)).format("YYYY-MM-DD HH:mm:ss") ?
                              moment(new Date(item.evaTaskTime)).format("YYYY-MM-DD HH:mm:ss") : '-'
                          }
                        </li>
                        <li title={item.department}>{item.department || '-'}</li>
                        <li title={item.courseName}>{item.courseName || '-'}</li>
                        <li title={item.courseType}>{item.courseType || '-'}</li>
                        <li title={item.teacher}>{item.teacher || '-'}</li>
                        <li title={item.classNum}>{item.classNum || '-'}</li>
                        <li
                          className={
                            item.evaClassStatus == "0"
                              ? "gwj-fontColor-green"
                              : item.evaClassStatus == "1"
                                ? "gwj-fontColor-red"
                                : null
                          }
                        >
                          {item.evaClassStatus == 1 ? "未提交" : "已评课"}
                        </li>
                        <li>
                          <Link
                            className='mj-td-iconCon'
                            to={`/home/tpk/video/${item.courseId}/${item.evaTaskId}/${item.perId}/${item.classId}/1`}>
                            <SVG
                              type="ck"
                              className='mj-icon'
                              title='查看'
                              style={{ width: '18px', height: '18px' }}
                            />
                           查看
                          </Link>
                        </li>
                      </ul>
                    );
                  })}
                  {/* </PerfectScrollbar> */}
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
        </div>
      </div>
    );
  }
}
export default withRouter(MyTaskDetailComp);
