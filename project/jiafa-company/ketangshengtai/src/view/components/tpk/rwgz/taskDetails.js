import React, { Component, Fragment as F, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { InputNumber, Button, Pagination, Select } from "antd";
import { connect } from "react-redux";
import moment from 'moment';
import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from "./../../../public/public-component-svg";
import PagePonent from './../../../components/pagePonent';

import "./../../../../style/tpk/rwgz/gwj_taskDetails.scss";
import noneData from './../../../../media/picture/noneData.png';
// import ChaKan from "./../zxpk/chakan";
import {
  getLeadEvaTask,
  getEvaResultTable
} from "./../../../../redux/tpk/rwgz/gwj-taskDetails.reducer";
const { Option } = Select;

@connect(state => state.taskDetailsReducer, {
  getLeadEvaTask,
  getEvaResultTable
})
class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      evaResultId: "all",
      evaClassTimes: false, //true升序 false降序
      evaClass: false, //true升序 false降序
      field: "", //待排序字段
      currentPage: 1,
      semester: '',       //学期
    };
    this.evaResult = [
      { evaResultName: "全部评选结果", evaResultId: "all", isChecked: true },
      { evaResultName: "优", evaResultId: "0", isChecked: false },
      { evaResultName: "良", evaResultId: "1", isChecked: false },
      { evaResultName: "中", evaResultId: "2", isChecked: false },
      { evaResultName: "合格", evaResultId: "3", isChecked: false },
      { evaResultName: "不合格", evaResultId: "4", isChecked: false }
    ];
  }
  componentDidMount() {
    const { semester, taskId } = this.props.match.params;
    this.node.scrollIntoView()
    this.props.getLeadEvaTask({ taskId, semester });
    this.props.getEvaResultTable({
      taskId: this.props.match.params.taskId,
      evaResult: this.state.evaResultId,
      field: this.state.field,
      sort:
        this.state.field == ""
          ? ""
          : this.state[this.state.field]
            ? "asc"
            : "desc",
      pageIndex: this.state.currentPage,
      pageNum: 20,
      semester
    });
  }

  onClickEvaResult = id => {
    // console.log(id);
    let _evaResultId = this.state.evaResultId;
    if (_evaResultId !== id) {
      this.evaResult.map(item => {
        if (item.evaResultId == id) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      });
      this.setState({
        evaResultId: id
      }, () => this.queryData());
    }
  };

  queryData = () => {
    // console.log("查询数据！");
    const { semester } = this.state;
    this.props.getEvaResultTable({
      taskId: this.props.match.params.taskId,
      evaResult: this.state.evaResultId,
      field: "",
      sort: "",
      pageIndex: 1,
      pageNum: 20,
      semester
    });
    this.setState({
      currentPage: 1,
      field: ""
    });
  };

  sort = (value, title) => {
    const { semester } = this.state;
    this.setState({
      field: title,
      [title]: value,
      currentPage: 1
    });
    this.props.getEvaResultTable({
      taskId: this.props.match.params.taskId,
      evaResult: this.state.evaResultId,
      field: title,
      sort: value ? "asc" : "desc",
      pageIndex: 1,
      pageNum: 20,
      semester
    });
  };

  onchangePage = page => {
    const { semester } = this.state;
    this.props.getEvaResultTable({
      taskId: this.props.match.params.taskId,
      evaResult: this.state.evaResultId,
      field: this.state.field,
      sort:
        this.state.field == ""
          ? ""
          : this.state[this.state.field]
            ? "asc"
            : "desc",
      pageIndex: page,
      pageNum: 20,
      semester
    });
    this.setState({
      currentPage: page
    });
    this.node.scrollIntoView();
  };

  seeMore = item => {
    // `/home/tpk/rwgz/rwjg/rwjggrxq/${perId}/${this.props.match.params.taskId}`
    // 课程 任务 人员 课堂
    this.props.history.push(
      `/home/tpk/video/${item.studyId}/${item.jobId}/${item.perId}/${item.classId}`
    );
  };

  render() {
    let { leadEvaTask, pageData } = this.props;
    const { evaResultId } = this.state;
    return (
      <div className='mj-td-content'>
        <div className="gwj-taskResult-details" ref={node => (this.node = node)}>
          <div className="gwj-taskDetails-title">
            <span className="gwj-title-span">任务结果详情</span>
            {/* <Button
              className="gwj-seleCourse-btn"
              onClick={() => {
                this.props.history.goBack(-1);
              }}
            >
              返回
            </Button> */}
          </div>
          <ul className="gwj-taskDetails-content">
            <li>
              <div className='mj-td-xqTxtCon'>
                <div className='mj-td-xqTxt'>
                  <span>任务名称：</span>
                  <span>{leadEvaTask.taskName || "-"}</span>
                </div>
              </div>
              <div className='mj-td-xqTxtCon'>
                <div className='mj-td-xqTxt'>
                  <span>任务类型：</span>
                  <span>{leadEvaTask.taskType || "-"}</span>
                </div>
                <div className='mj-td-xqTxt'>
                  <span>任务状态：</span>
                  <span>
                    {
                      leadEvaTask.taskState == 0 ? "未发布"
                        : leadEvaTask.taskState == 1 ? "进行中"
                          : leadEvaTask.taskState == 2 ? "已结束"
                            : leadEvaTask.taskState || "-"
                    }
                  </span>
                </div>
              </div>
              {/* <div>任务名称：{leadEvaTask.taskName || "-"}</div>
              <div>任务类型：{leadEvaTask.taskType || "-"}</div>
              <div>
                任务状态：
                {leadEvaTask.taskState == 0
                  ? "未发布"
                  : leadEvaTask.taskState == 1
                    ? "进行中"
                    : leadEvaTask.taskState == 2
                      ? "已结束"
                      : leadEvaTask.taskState || "-"}
              </div> */}
            </li>
            <li>
              <div style={{ display: 'inline-block', width: 'calc(100% - 1px)' }}>
                <div className='mj-td-num'>
                  <span>{leadEvaTask.evaClassNumt || 0}</span>
                  <span>人</span>
                </div>
                <div className='mj-td-numTxt'>累计评课人数</div>
              </div>
              <span className='mj-td-line'></span>
              {/* <SVG type="rs" title="人数" />
                累计评课人数
                <span className="gwj-magnifyFont">
                  {leadEvaTask.evaClassNumt || 0}
                </span>
                人 */}
            </li>
            <li>
              <div className='mj-td-num'>
                <span>{leadEvaTask.evaClassTimes || 0}</span>
                <span>次</span>
              </div>
              <div className='mj-td-numTxt'>累计评课次数</div>
              {/* <div>
                <SVG type="pkcs" title="评课次数" />
                累计评课次数
                <span className="gwj-magnifyFont">
                  {leadEvaTask.evaClassTimes || 0}
                </span>
                次
              </div> */}
            </li>
            {/* <li>
              <div>
                <SVG type="pkkc" title="评课课程" />
                累计评课课程
                <span className="gwj-magnifyFont">
                  {leadEvaTask.evaClass || 0}
                </span>
                门
              </div>
            </li> */}
          </ul>
        </div>
        <div className="gwj-taskDetails-taskList">
          <div className="gwj-taskDetails-title mj-td-titleTable">
            <span className="gwj-title-span">评课结果</span>
            <Select
              onChange={(value) => this.onClickEvaResult(value)}
              value={evaResultId}>
              {
                this.evaResult.map(item => {
                  return <Option key={item.evaResultId} value={item.evaResultId}>{item.evaResultName}</Option>
                })
              }
            </Select>
          </div>
          {/* <div className="gwj-taskDetails-taskList-search">
            <ul>
              <li className="gwj-evaClass-search-evaResult">
                评课结果筛选：
                {this.evaResult.map((item, index) => {
                return (
                  <span
                    className={
                      item.isChecked
                        ? "gwj-evaClass-search-evaResult-span gwj-checked"
                        : "gwj-evaClass-search-evaResult-span"
                    }
                    key={index}
                    onClick={() => this.onClickEvaResult(item.evaResultId)}
                  >
                    {item.evaResultName}
                  </span>
                );
              })}
              </li>
              <li>
                <Button type="primary" onClick={this.queryData}>
                  筛选
                </Button>
              </li>
            </ul>
          </div> */}
          <div className="gwj-taskDetails-table">
            <div className="gwj-taskDetails-table-fixedHeight">
              {
                pageData.pageList && pageData.pageList.length ? (
                  <Fragment>
                    <div style={{ height: 'calc(100% - 50px)' }}>
                      <PerfectScrollbar>
                        <ul className="gwj-ul">
                          <li>序号</li>
                          <li>评课人</li>
                          <li>开课院系</li>
                          <li>课程名称</li>
                          <li>课程类别</li>
                          <li>教师</li>
                          <li>节次</li>
                          <li>评课时间</li>
                          <li>评价</li>
                          <li>操作</li>
                        </ul>

                        {pageData.pageList.map((item, index) => {
                          return (
                            <ul key={index} className="gwj-ul gwj-ul-c">
                              <li title={item.evaluateNum}>{item.evaluateNum || '-'}</li>
                              <li title={item.classOne}>{item.classOne || '-'}</li>
                              <li title={item.schoolName}>{item.schoolName || '-'}</li>
                              <li title={item.studyName}>{item.studyName || '-'}</li>
                              <li title={item.studyType}>{item.studyType || '-'}</li>
                              <li title={item.teacher}>{item.teacher || '-'}</li>
                              <li title={item.classNum}>{item.classNum || '-'}</li>
                              <li>{item.evaluateTime && moment(new Date(item.evaluateTime)).format('YYYY-MM-DD HH:MM:SS') || '-'}</li>
                              <li>
                                {
                                  item.evaluateAll === 'A' ? '优' :
                                    item.evaluateAll === 'B' ? '良' :
                                      item.evaluateAll === 'C' ? '中' :
                                        item.evaluateAll === 'D' ? '合格' : '不合格'
                                }
                              </li>
                              <li>
                                <span className='mj-td-iconCon' onClick={() => this.seeMore(item)}>
                                  <SVG
                                    type="ck"
                                    className='mj-tr-icon'
                                    title='查看评议表'
                                    style={{ width: '18px', height: '18px' }}
                                  />
                                查看评议表
                                </span>
                              </li>
                            </ul>
                          );
                        })}
                      </PerfectScrollbar>
                    </div>
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
                        total={pageData.total} />
                    </div>
                  </Fragment>
                ) : (
                    <div className='mj-rxq-noneData'>
                      <img src={noneData} />
                      <div>暂无数据</div>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TaskDetails);
