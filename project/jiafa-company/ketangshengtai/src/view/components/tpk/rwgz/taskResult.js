import React, { Component, Fragment as F, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Pagination, Button } from "antd";
// import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from "./../../../public/public-component-svg";
import PagePonent from './../../pagePonent';

import TaskResultSearch from "./taskResultSearch";
import "./../../../../style/tpk/rwgz/gwj_taskResult.scss";
import noneData from './../../../../media/picture/noneData.png';
// import ChaKan from "./../zxpk/chakan";
import {
  getEvaSituation,
  getOverviewTable,
  exportOverviewTable
} from "./../../../../redux/tpk/rwgz/gwj-taskResult.reducer";

@connect(state => state.taskResultReducer, {
  getEvaSituation,
  getOverviewTable,
  exportOverviewTable
})
class MyTaskResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      queryArgs: {},
      semester: '',
    };
  }

  componentDidMount() {
    // console.log(this.props.semester);
    // this.props.getEvaSituation({});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const semesterId = nextProps.semester;
    const { semester } = prevState;
    if (semesterId !== semester) {
      return { ...prevState, semester: semesterId }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps.semester, '-', this.props.semester);
    if (prevProps.semester !== this.props.semester) {
      let { queryArgs } = this.state;
      let _args = {
        creator: queryArgs.creatorId,
        taskType: queryArgs.taskTypeId,
        taskState: queryArgs.taskStateId,
        evaResult: queryArgs.evaResultId,
        taskName: queryArgs.searchValue,
        courseType: queryArgs.courseTypeId,
        pageIndex: 1,
        pageNum: 20,
        semester: this.props.semester,
      };
      this.props.getEvaSituation({ semester: this.props.semester });
      _args.creator && _args.taskType ? this.props.getOverviewTable(_args) : null;
      this.setState({
        currentPage: 1
      })
    }
  }

  /**
   * @desc 查询条件改变
   * @param {*} args 条件
   */
  queryCondition = args => {
    // console.log("查询条件:", args);
    const { semester } = this.state;
    let _args = {
      creator: args.creatorId,
      taskType: args.taskTypeId,
      taskState: args.taskStateId,
      evaResult: args.evaResultId,
      taskName: args.searchValue,
      courseType: args.courseTypeId,
      pageIndex: 1,
      pageNum: 20,
      semester
    };
    this.props.getOverviewTable(_args);
    this.setState({
      currentPage: 1,
      queryArgs: args
    });
  };

  export = () => {
    // console.log("导出数据！");
    let { queryArgs, semester } = this.state;
    let _args = {
      creator: queryArgs.creatorId,
      taskType: queryArgs.taskTypeId,
      taskState: queryArgs.taskStateId,
      evaResult: queryArgs.evaResultId,
      taskName: queryArgs.searchValue,
      courseType: queryArgs.courseTypeId,
      semester,
    };
    this.props.exportOverviewTable(_args);
  };

  seeMore = taskId => {
    const { semester } = this.state;
    this.props.history.push(`/home/tpk/rwgz/rwjg/rwjgxq/${taskId}/${semester}`);
  };

  /**
   * @desc 页码改变
   * @param {*} page 
   */
  onchangePage = page => {
    let { queryArgs, semester } = this.state;
    let _args = {
      creator: queryArgs.creatorId,
      taskType: queryArgs.taskTypeId,
      taskState: queryArgs.taskStateId,
      evaResult: queryArgs.evaResultId,
      taskName: queryArgs.searchValue,
      courseTypeId: queryArgs.courseTypeId,
      semester,
      pageIndex: page,
      pageNum: 20
    };
    this.props.getOverviewTable(_args);
    this.setState({
      currentPage: page
    });
    this.node.scrollIntoView();
  };

  render() {
    let { evaSituation, pageData } = this.props;
    // console.log("pageData", pageData);
    return (
      <div className='mj-tr-content'>
        {/* 统计 */}
        <div className="gwj-evaClass-overview" ref={node => (this.node = node)}>
          <div className="gwj-evaClass-title">
            <span className="gwj-title-span">评课概况</span>
          </div>
          <ul className="gwj-evaClass-overview-content">
            <li>
              <div>
                <span className="gwj-magnifyFont">
                  {evaSituation && evaSituation.evaClassNum || 0}
                </span>
                人
              </div>
              <div>累计评课人数</div>
              <span className='mj-tr-line'></span>
            </li>
            <li>
              <div>
                <span className="gwj-magnifyFont">
                  {evaSituation && evaSituation.evaClassTimes || 0}
                </span>
                次
              </div>
              <div>累计评课次数</div>
              <span className='mj-tr-line'></span>
            </li>
            <li>
              <div>
                <span className="gwj-magnifyFont">
                  {evaSituation && evaSituation.evaClass || 0}
                </span>
                门
              </div>
              <div>累计评课课程</div>
              <span className='mj-tr-line'></span>
            </li>
            <li>
              <div>
                <span className="gwj-magnifyFont">
                  {evaSituation && evaSituation.leadEvaClass || 0}
                </span>
                次
              </div>
              <div>领导任务累计评课</div>
              <span className='mj-tr-line'></span>
            </li>
            <li>
              <div>
                <span className="gwj-magnifyFont">
                  {evaSituation && evaSituation.supervisorEvaClass || 0}
                </span>
                次
              </div>
              <div>督导任务累计评课</div>
              <span className='mj-tr-line'></span>
            </li>
            <li>
              <div>
                <span className="gwj-magnifyFont">
                  {evaSituation && evaSituation.substrateEvaClass || 0}
                </span>
                次
              </div>
              <div>基层教学负责人及同行任务评课</div>
              <span className='mj-tr-line' style={{ width: 0 }}></span>
            </li>
          </ul>
        </div>

        {/* 列表 */}
        <div className="gwj-evaClass-taskList">
          <div className="gwj-evaClass-title">
            <span className="gwj-title-span">任务列表</span>
            <div className="gwj-export-btn" onClick={this.export}>
              <SVG type="dc" />
              <span style={{ marginLeft: "5px" }}>导出明细</span>
            </div>
          </div>
          <TaskResultSearch queryCondition={this.queryCondition} />

          <div className="gwj-evaClass-table">
            <div className="gwj-evaClass-table-fixedHeight">
              {pageData && pageData.pageList && pageData.pageList.length ? (
                <Fragment>
                  <ul className="gwj-ul">
                    <li>任务名称</li>
                    <li>创建者</li>
                    <li>任务类型</li>
                    <li>状态</li>
                    <li>评课人数</li>
                    <li>评课次数</li>
                    <li>评课结果</li>
                    <li>操作</li>
                  </ul>
                  {pageData.pageList.map((item, index) => {
                    return (
                      <ul key={index} className="gwj-ul gwj-ul-c">
                        <li title={item.taskName}>{item.taskName}</li>
                        <li title={item.creator}>{item.creator}</li>
                        <li title={item.taskType}>{item.taskType}</li>
                        <li>
                          {item.taskStatus == "0"
                            ? "未发布"
                            : item.taskStatus == "1"
                              ? "进行中"
                              : item.taskStatus == "2"
                                ? "已结束"
                                : item.taskStatus}
                        </li>
                        <li>{item.evaClassNum}</li>
                        <li>{item.evaClassTimes}</li>
                        <li title={item.evaResult || '-'}>{item.evaResult || '-'}</li>
                        <li className='mj-tr-iconCon'>
                          {/* <ChaKan _seeMore={() => this.seeMore(item.taskId)} /> */}
                          <span onClick={() => this.seeMore(item.taskId)}>
                            <SVG
                              type="ck"
                              className='mj-tr-icon'
                              title='查看'
                              style={{ width: '18px', height: '18px' }}
                            />
                            查看详情
                          </span>
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
                      len={pageData && pageData.pageList && pageData.pageList.length || 0}
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
export default withRouter(MyTaskResult);
