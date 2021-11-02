import React, { Component } from 'react'
import { Select, Input, Button, Pagination, Spin } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import PagePonent from './../../pagePonent';

import OverviewContainer from './overviewContainer';
import TaskNodata from './taskNodata';
import { G } from './../../../../config/g';
import { yh_getTaskList } from './../../../../redux/tpk/rwgz/yh-taskOveriew.reducer';
import SVG from "./../../../public/public-component-svg";
const { Option } = Select;
@connect(state => state.yh_taskOverviewReducer, {
  yh_getTaskList
})
@withRouter
export default class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: 'all',
      taskType: 'all',
      taskState: 'all',
      taskName: '',
      pageSize: 20,
      pageIndex: 1,
      sortBy: -1, //默认不排序传值
      hoverState: 0,
      semester: '',
    }
    this.taskState = [{ name: "全部状态", id: 'all' }, { name: "进行中", id: '1' }, { name: "已结束", id: '2' },]
    this.params = {
      creator: 'all',
      taskType: 'all',
      taskState: 'all',
      taskName: '',
      pageSize: 20,
      pageIndex: 1,
      sortBy: -1,
      semester: '',
    };
    this.taskNameChange = this.taskNameChange.bind(this)
    this.taskStateChange = this.taskStateChange.bind(this)
    this.viewHandle = this.viewHandle.bind(this)
    this.tableSearch = this.tableSearch.bind(this)
    this.sxClick = this.sxClick.bind(this)
    this.jxClick = this.jxClick.bind(this)
    this.viewOver = this.viewOver.bind(this)
    this.viewOut = this.viewOut.bind(this)
  }
  componentDidMount() {
    this.params = { ...this.params, semester: this.props.semester };
    // this.props.yh_getTaskList(this.params)
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
    if (prevProps.semester !== this.props.semester) {
      this.params = { ...this.params, semester: this.props.semester };
      this.props.yh_getTaskList(this.params)
    }
  }

  pageOnChange = page => {
    this.setState({
      pageIndex: page,
    });
    this.params = {
      ...this.params,
      pageIndex: page
    }
    // this.node.scrollIntoView();
    this.props.scrollTop(true)
    this.props.yh_getTaskList(this.params)
  };
  /**
   * 
   * @param {*} type change类型：creator-创建者；taskType-任务类型；taskState-任务状态;
   * @param {*} val 
   */
  selectChange = (type, val) => {
    // console.log(val);
    this.setState({
      [type]: val
    })
  }
  /**
 * @description 任务状态改变
 */
  taskStateChange(i) {
    const { params } = this.state;
    this.setState({
      taskState: i,
    })
  }
  /**
   * @description 任务名称
   * @param {*} e 
   */
  taskNameChange(e) {
    this.setState({
      taskName: e.target.value
    })
  }
  /**
   * @description 搜索
   */
  tableSearch() {
    const { creator, taskType, taskState, taskName, sortBy } = this.state;
    this.setState({
      pageIndex: 1,
      sortBy: -1
    })
    this.params = {
      creator,
      taskType,
      taskState,
      taskName,
      sortBy: -1,
      pageSize: 20,
      pageIndex: 1,
      semester: this.props.semester
    }
    this.props.yh_getTaskList(this.params)
    // console.log(this.params);
  }
  /**
   * @description 点击查看
   */
  viewHandle(id) {
    const { semester } = this.state;
    this.props.history.push(`rwgzgl/rwjdxq/${id}/${semester}`);
  }
  /**
   * @description 完成进度排序
   */
  sxClick() {
    this.setState({
      sortBy: 1
    }, () => {
      this.params = {
        ...this.params,
        sortBy: this.state.sortBy
      }
      this.props.yh_getTaskList(this.params)
      // console.log(this.params);
    })
  }
  jxClick() {
    this.setState({
      sortBy: 0
    }, () => {
      this.params = {
        ...this.params,
        sortBy: this.state.sortBy
      }
      this.props.yh_getTaskList(this.params)
      // console.log(this.params);
    })
  }
  /**
   * 查看按钮hover
   */
  viewOver(i) {
    this.setState({
      hoverState: i
    })
  }
  viewOut(i) {
    this.setState({
      hoverState: i
    })
  }
  render() {
    const { creator, taskType, taskState, taskName, pageIndex, sortBy, hoverState } = this.state;
    const { taskList, total, listLoad } = this.props;
    const roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'))
    // console.log(sortBy);
    return (
      <OverviewContainer
        width="100%"
        // height="600px"
        title="任务列表"
      >
        <div className="yh-list-container" ref={node => (this.node = node)}>
          <div className="yh-filter clearfix">
            <div className="yh-filter-wrap clearfix">
              {roleInfo.roleLevel === 2 ? null : <div className="yh-filter-item">
                {/* <span>创建者：</span> */}
                <Select
                  value={creator ? creator : G.builderList && G.builderList[0]['builderId']}
                  onChange={(value) => { this.selectChange('creator', value) }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {
                    G.builderList && G.builderList.map((item, i) => {
                      return (
                        <Option key={item.builderId} value={item.builderId}>
                          {item.builderId === 'all' ? item.builder + '创建者' : item.builder}
                        </Option>
                      )
                    })
                  }
                </Select>
              </div>}
              <div className="yh-filter-item">
                {/* <span>任务类型：</span> */}
                <Select
                  value={taskType ? taskType : G.taskTypeList && G.taskTypeList[0]['taskTypeId']}
                  onChange={(value) => { this.selectChange('taskType', value) }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {
                    G.taskTypeList && G.taskTypeList.map((item, i) => {
                      return (
                        <Option
                          key={item.taskTypeId}
                          value={item.taskTypeId}>
                          {item.taskTypeId === 'all' ? item.tasktype + '类型' : item.tasktype}
                        </Option>
                      )
                    })
                  }
                </Select>
              </div>
              <div className="yh-filter-item">
                {/* <span>任务状态：</span> */}
                <Select
                  value={taskState}
                  onChange={(value) => { this.selectChange('taskState', value) }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {
                    this.taskState.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              </div>
              {/* <div className="yh-filter-item">
                <span>任务名称：</span>
                <Input
                  className="yh-taskName"
                  value={taskName}
                  onChange={this.taskNameChange}
                  placeholder="请输入任务名称"
                />
              </div> */}
            </div>
            <div className="yh-search-wrap">
              <div className="yh-filter-item yh-search clearfix">
                <Button type="primary" onClick={this.tableSearch}>查看</Button>
              </div>
            </div>
          </div>
          <div className="yh-table-wrap">
            {
              listLoad ?
                (
                  <div className="yh-list-load">
                    <Spin size="large" />
                  </div>
                ) :
                taskList && taskList.length ?
                  <>
                    <table className="yh-table">
                      <thead>
                        <tr>
                          <th className="yh-table-index">序号</th>
                          <th>任务名称</th>
                          <th>创建者</th>
                          <th>任务类型</th>
                          <th>任务状态</th>
                          <th className="yh-table-sort clearfix">
                            <span>完成进度(完成人数/总人数)</span>
                            <span >
                              <label onClick={this.sxClick} className={sortBy === 1 ? 'yh-sx yh-sort-active' : 'yh-sx'} >
                                <CaretUpOutlined />
                                {/* <SVG className={sortBy === 1 ? 'yh-sx yh-sort-active' : 'yh-sx'} type="xl" /> */}
                              </label>
                              <label onClick={this.jxClick} className={sortBy === 0 ? 'yh-jx yh-sort-active' : 'yh-jx'}>
                                <CaretDownOutlined />
                                {/* <SVG className={sortBy === 0 ? 'yh-jx yh-sort-active' : 'yh-jx'} type="xl" /> */}
                              </label>
                            </span>
                          </th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          taskList.length && taskList.map((item, i) => {
                            return (
                              <tr key={item.id}>
                                <td className="yh-table-index">{i + 1}</td>
                                <td title={item.taskName}>{item.taskName}</td>
                                <td>{item.creator}</td>
                                <td>{item.taskType}</td>
                                <td>{item.taskState}</td>
                                <td className="yh-table-progress clearfix">
                                  <p className="yh-progress-lable clearfix">
                                    <span>{item.overProgress.over || 0}</span>
                                    <span>/{item.overProgress.total || 0}</span>
                                  </p>
                                  <p className="yh-progress-wrap">
                                    <span className="yh-line yh-zero-line"></span>
                                    <span className="yh-line yh-rate-line"
                                      style={{ width: item.rate > 100 ? 100 + '%' : item.rate + '%' }}></span>
                                  </p>
                                  {/* <span>{item.rate}%</span> */}
                                  {
                                    item.over ? <span><SVG className='mj-tl-icon' type="wc" /></span> : <span>{item.rate > 100 ? 100 : item.rate}%</span>
                                    // item.over ? <span><SVG type="wc" /></span> : <span>{item.rate > 100 ? 100 : item.rate}%</span>
                                  }
                                </td>
                                <td className="yh-table-view">
                                  <span className="yh-table-view"
                                    title="查看"
                                    onClick={() => this.viewHandle(item.id)}
                                  // onMouseOver={() => this.viewOver(item.id)}
                                  // onMouseOut={() => this.viewOut(0)}
                                  >
                                    <SVG
                                      type={"ck"}
                                      className={'yh-view-active'}
                                    />
                                    查看详情
                                  </span>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                    <div className="mj-p-pages clearfix">
                      {/* <div className="yh-page-total">每页20条数据，共{`${total || 0}`}条</div>
                      <div className="yh-page ">
                        <Pagination
                          current={pageIndex}
                          onChange={this.pageOnChange}
                          total={total || 0}
                          pageSize={20}
                        />
                      </div> */}
                      <PagePonent
                        pageIndex={pageIndex}
                        pageSize={20}
                        pageChan={this.pageOnChange}
                        len={taskList && taskList.length || 0}
                        total={total || 0} />
                    </div>
                  </> :
                  <TaskNodata />
            }

          </div>
        </div>
      </OverviewContainer>
    )
  }
}
