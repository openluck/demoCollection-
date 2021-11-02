import React, { Component, Fragment } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Pagination } from "antd";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PagePonent from './../../../components/pagePonent';

import CommmonPie from "./../../../components/yrj_CommonPie";
import SVG from "./../../../public/public-component-svg";
import noneData from './../../../../media/picture/noneData.png';
// import ChaKan from "./chakan";

import { getEvaTask, getTaskTable } from "./../../../../redux/tpk/zxpk/gwj-myTask.reducer";
import { getTaskName } from "./../../../../redux/tpk/zxpk/gwj-myTaskDetail.reducer";
import { getTaskId } from "./../../../../redux/tpk/zxpk/gwj-seleCourse.reducer";
import "./../../../../style/tpk/zxpk/myTaskComp.scss";
// const roleTxt = sessionStorage.getItem("roleTxt");

@connect(state => state.myTaskReducer, {
  getEvaTask,
  getTaskTable,
  getTaskName,
  getTaskId
})
class MyTaskComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: [],
      currentPage: 1
    };
  }
  componentDidMount() {
    this.props.getEvaTask({});
    this.props.getTaskTable({
      pageIndex: this.state.currentPage,
      pageSize: 20
    });
    // this.getData();
  }

  seeMore = (taskId, taskName, perId) => {
    // const roleTxt = sessionStorage.getItem('roleTxt');
    const roleTxt = 'home';
    this.props.getTaskName(taskName);
    this.props.getTaskId(taskId);
    this.props.history.push(`/${roleTxt}/tpk/zxpk/wdrw/grrwxq/${taskId}/${perId}`);
  };

  onchangePage = page => {
    this.props.getTaskTable({
      pageIndex: page,
      pageSize: 20
    });
    this.setState({
      currentPage: page
    });
    this.node.scrollIntoView();
  };

  render() {
    let { evaTask, pageData } = this.props;
    return (
      <div style={{ height: '100%', padding: 16 }}>
        <div className="gwj-evaTask">
          <div className="gwj-evaTask-title">
            <span>评课任务</span>
          </div>
          <div className="gwj-evaTask-content">
            <div className='mj-mt-txtLine'>
              <div className='mj-mt-numCon'>
                <span>{evaTask && evaTask.taskInProgress || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-mt-txt'>进行中任务</div>
              <span className='mj-mt-line'></span>
            </div>

            <div className='mj-mt-txtLine'>
              <div className='mj-mt-numCon'>
                <span>{evaTask && evaTask.fulfilTask || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-mt-txt'>已完成任务</div>
              <span className='mj-mt-line'></span>
            </div>

            <div className='mj-mt-txtLine'>
              <div className='mj-mt-numCon'>
                <span>{evaTask && evaTask.percentageComplete && (evaTask.percentageComplete * 100).toFixed(1) || 0}</span>
                <span>%</span>
              </div>
              <div className='mj-mt-txt'>任务完成率</div>
            </div>




            {/* <div>
              <CommmonPie
                radius={[50, 63]}
                center={("50%", "50%")}
                color={["#72b3f1", "#f0f2f5"]}
                data={evaTask && (evaTask.percentageComplete * 100).toFixed(1) || 0}
                title="任务完成率"
              />
            </div>
            <div>
              <div>
                <SVG type="jxz" title='进行中' style={{ width: "26px", height: "26px" }}></SVG>
                <span style={{ paddingLeft: "10px" }}>
                  进行中的任务
                  <span style={{ fontSize: "20px", paddingLeft: "10px" }}>
                    {evaTask && evaTask.taskInProgress || 0}
                  </span>
                  条
                </span>
              </div>
            </div>
            <div>
              <div>
                <SVG
                  type="ywc1"
                  title='已完成'
                  style={{ width: "26px", height: "26px" }}
                ></SVG>
                <span style={{ paddingLeft: "10px" }}>
                  完成任务
                  <span style={{ fontSize: "20px", paddingLeft: "10px" }}>
                    {evaTask && evaTask.fulfilTask || 0}
                  </span>
                  条
                </span>
              </div>
            </div> */}
          </div>
        </div>

        <div className="gwj-evaTask-List" ref={node => (this.node = node)}>
          <div className="gwj-evaTask-title">
            <span>任务列表</span>
          </div>
          <div className="gwj-evaTask-table">
            <div className="gwj-evaTask-table-fixedHeight">
              {
                pageData && pageData.pageList && pageData.pageList.length ? (
                  <Fragment>
                    <div style={{ height: 'calc(100% - 40px)' }}>
                      <PerfectScrollbar>
                        <ul className="gwj-ul">
                          <li>序号</li>
                          <li>任务名称</li>
                          <li>创建者</li>
                          <li>任务类型</li>
                          <li>状态</li>
                          <li>完成状态</li>
                          <li>操作</li>
                        </ul>
                        {
                          pageData.pageList.map((item, index) => {
                            return (
                              <ul key={index} className="gwj-ul gwj-ul-c">
                                <li>{item.serialNum || '-'}</li>
                                <li>{item.taskName || '-'}</li>
                                <li>{item.creator || '-'}</li>
                                <li>{item.taskType || '-'}</li>
                                <li>
                                  {
                                    item.taskStatus == "0"
                                      ? <span className='mj-mt-gray'>未发布</span>
                                      : item.taskStatus == "1"
                                        ? <span className='mj-mt-orange'>进行中</span>
                                        : item.taskStatus == "2"
                                          ? <span className='mj-mt-green'>已结束</span>
                                          : item.taskStatus
                                  }
                                </li>
                                <li>
                                  {
                                    item.fulfilStatus == "1" ?
                                      <span className='mj-mt-green'>已完成</span>
                                      : item.fulfilStatus == "0" ?
                                        <span className='mj-mt-orange'>未完成</span>
                                        :
                                        item.fulfilStatus
                                  }
                                </li>
                                <li>
                                  <Link
                                    className='mj-mt-iconCon'
                                    to={{
                                      pathname: `/home/tpk/zxpk/wdrw/grrwxq/${item.taskId}/${item.perId}`,
                                      state: { from: this.props.location.pathname }
                                    }}>
                                    <SVG
                                      type="ck"
                                      className='mj-icon'
                                      title='查看'
                                      style={{ width: '18px', height: '18px' }}
                                    ></SVG>
                                    查看详情
                                  </Link>
                                </li>
                              </ul>
                            );
                          })
                        }
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
                        len={pageData && pageData.pageList && pageData.pageList.length || 0}
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

export default withRouter(MyTaskComp);
