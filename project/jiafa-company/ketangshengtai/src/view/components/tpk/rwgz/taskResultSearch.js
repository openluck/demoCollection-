import React, { Component } from "react";
import { Select, Input, InputNumber, Button, message } from "antd";
import { G } from "./../../../../config/g";
import { requestForListen } from './../../../../util/request'

const { Option } = Select;

export default class TaskResultSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creatorId: "",
      taskTypeId: "",
      taskStateId: "all",
      searchValue: "",
      evaResultId: "all",
      courseTypeId: '',      //课程类型选中
    };
    this.taskState = [
      { taskStateName: "全部任务状态", taskStateId: "all" },
      { taskStateName: "进行中", taskStateId: "1" },
      { taskStateName: "已结束", taskStateId: "2" }
    ];
    this.evaResult = [
      { evaResultName: "全部评选结果", evaResultId: "all", isChecked: true },
      { evaResultName: "优", evaResultId: "0", isChecked: false },
      { evaResultName: "良", evaResultId: "1", isChecked: false },
      { evaResultName: "中", evaResultId: "2", isChecked: false },
      { evaResultName: "合格", evaResultId: "3", isChecked: false },
      { evaResultName: "不合格", evaResultId: "4", isChecked: false }
    ];
    this.courseType = []
  }

  componentDidMount() {
    this.getcourseTypeData()
    let builderList = JSON.parse(sessionStorage.getItem('builderList')),
      taskTypeList = JSON.parse(sessionStorage.getItem('taskTypeList')),
      builder = builderList.length && builderList[0].builderId || "",
      type = taskTypeList.length && taskTypeList[0].taskTypeId || "";
    this.setState({
      creatorId: builder,
      taskTypeId: type,
    }, () => {
      this.props.queryCondition({ ...this.state });
    })
  }

  /**
   * @desc 获取课程类型数据
   */
  getcourseTypeData = () => {
    requestForListen('get/getCourseType', {}, res => {
      if (res.result) {
        const { data } = res;
        this.courseType = data
        let id = data.length ? data[0].courseTypeId : ''
        this.setState({
          courseTypeId: id
        })
      } else {
        message.info(res.message)
      }
    })
  }

  /**
   * @desc 条件切换
   * @param {*} value 值
   * @param {*} name 字段
   */
  changeSelectValue = (value, name) => {
    this.setState({
      [name]: value
    });
  };

  changeSearchValue = e => {
    this.setState({
      searchValue: e.target.value
    });
  };

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
      });
    }
  };

  /**
   * @desc 点击查询
   */
  queryData = () => {
    // console.log("查询！");
    this.props.queryCondition({ ...this.state });
  };
  exportData = () => {
    // console.log("导出数据！");
  };

  render() {
    const { creatorId, taskTypeId, taskStateId, searchValue, courseTypeId, evaResultId } = this.state;
    // console.log(G.builderList);
    return (
      <div className="gwj-evaClass-search">
        <ul>
          <li>
            {/* 创建者： */}
            <Select
              style={{ width: 120 }}
              value={creatorId}
              onChange={value => this.changeSelectValue(value, "creatorId")}
            >
              {G.builderList && G.builderList.length
                ? G.builderList.map((item, index) => (
                  <Option value={item.builderId} key={index}>
                    {item.builderId === 'all' ? item.builder + '创建者' : item.builder}
                  </Option>
                ))
                : null}
            </Select>
          </li>
          <li>
            {/* 任务类型： */}
            <Select
              style={{ width: 120 }}
              value={taskTypeId}
              onChange={value => this.changeSelectValue(value, "taskTypeId")}
            >
              {G.taskTypeList && G.taskTypeList.length
                ? G.taskTypeList.map((item, index) => (
                  <Option value={item.taskTypeId} key={index}>
                    {item.taskTypeId === 'all' ? item.tasktype + '类型' : item.tasktype}
                  </Option>
                ))
                : null}
            </Select>
          </li>
          <li>
            {/* 任务状态： */}
            <Select
              style={{ width: 140 }}
              value={taskStateId}
              onChange={value => this.changeSelectValue(value, "taskStateId")}
            >
              {this.taskState.map((item, index) => (
                <Option value={item.taskStateId} key={index}>
                  {item.taskStateName}
                </Option>
              ))}
            </Select>
          </li>
          <li>
            {/* 课程类型： */}
            <Select
              style={{ width: 140 }}
              value={courseTypeId}
              onChange={value => this.changeSelectValue(value, "courseTypeId")}
            >
              {this.courseType.map((item, index) => (
                <Option value={item.courseTypeId} key={item.courseTypeId}>
                  {item.courseTypeName}
                </Option>
              ))}
            </Select>
          </li>
          <li>
            {/* 评选结果： */}
            <Select
              style={{ width: 140 }}
              value={evaResultId}
              onChange={value => this.changeSelectValue(value, "evaResultId")}
            >
              {this.evaResult.map((item, index) => (
                <Option value={item.evaResultId} key={item.evaResultId}>
                  {item.evaResultName}
                </Option>
              ))}
            </Select>
          </li>

          {/* <li>
            任务名称：
            <Input
              className="gwj-evaClass-search-input"
              placeholder="请输入任务名称"
              value={searchValue}
              onChange={this.changeSearchValue}
            />
          </li> */}
          {/* <li className="gwj-evaClass-search-evaResult">
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
          </li> */}
          <li className="gwj-evaClass-search-btn">
            <Button type="primary" onClick={this.queryData}>
              查询
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}
