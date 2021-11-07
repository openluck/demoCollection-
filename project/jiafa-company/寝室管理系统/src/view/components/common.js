/*
 * @Author: xq
 * @Date: 2021-01-14 12:51:18
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-18 16:42:45
 */

import React, { Component, useEffect, useState } from "react";
import { Pagination, Select } from "antd";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import "./../../style/pagination.scss";
const { Option } = Select;

const tabsRule = [
  { name: "男女宿舍设置", key: "studentRule" },
  { name: "宿舍管理员设置", key: "manageRule" },
];

// 含管理员
const tabsCountAll = [
  { name: "学校总览", key: "countOverview" },
  { name: "班级报告", key: "countClass" },
  { name: "楼栋报告", key: "countBuilding" },
];

// 班主任
const tabsCountZr = [{ name: "班级报告", key: "countClass" }];

// 宿管
const tabsCountSg = [{ name: "楼栋报告", key: "countBuilding" }];

// 班主任 && 宿管
const tabsCount = [
  { name: "班级报告", key: "countClass" },
  { name: "楼栋报告", key: "countBuilding" },
];

/**
 * @desc 页码组件
 * @props total Number
 * @props pageSize Nubmer
 * @props pageIndex Number
 * @props pageChange Function
 * @returns React.Component JSX
 */
export class PaginationPonent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageList: [], //下拉列表数据
      total: 0,
    };
    this.pageChange = this.pageChange.bind(this);
  }

  componentDidMount() {
    const { total, pageSize } = this.props;
    let pages = Math.ceil(total / pageSize),
      list = [];
    for (let i = 0; i < pages; i++) {
      list.push({ text: i + 1, value: i + 1 });
    }
    this.setState({ pageList: list, total });
  }

  componentWillReceiveProps(nextProps) {
    const { total, pageSize } = nextProps;
    const stateTotal = this.state.total;
    if (total !== stateTotal) {
      let pages = Math.ceil(total / pageSize),
        list = [];
      for (let i = 0; i < pages; i++) {
        list.push({ text: i + 1, value: i + 1 });
      }
      this.setState({ pageList: list, total });
    }
  }

  pageChange(page) {
    this.props.pageChange(page);
  }

  render() {
    const { total, pageSize, pageIndex } = this.props;
    const { pageList } = this.state;

    return total ? (
      <div className="mj-pp-content">
        <label>{`每页显示${pageSize}条，共${total}条`}</label>

        <Pagination
          current={pageIndex}
          total={total}
          pageSize={pageSize}
          onChange={(val) => this.pageChange(val)}
          showSizeChanger={false}
        />
      </div>
    ) : (
      <div className="mj-pp-content">
        <label>{`每页显示${pageSize}条，共${total}条`}</label>
      </div>
    );
  }
}

/**
 * @description 翻页滚动初始化
 */
export const InitScroll = () => {
  document.getElementById("scroll-content").scrollTop = 0;
};

/**
 * @desc 住宿管理 - 房间规则设置
 * @param {array}   menuPath 菜单路径 [param1,param2,param3]
 * @param {string}  param1   菜单路径：'room' 住宿管理、'dorm' 在寝管理
 * @param {string}  param2   菜单路径：'rule' 房间设置规则、'count' 在寝统计
 * @param {string}  param3   菜单路径：'studentRule' 男女设置、'manageRule' 管理员设置、
 * @param {string}  param3   菜单路径：'countOverview' 学校总览、'countClass' 班级报告、'countBuilding' 楼栋报告
 */
export const PublicTbs = ({ menuPath }) => {
  if (menuPath.length < 3) return false;
  const [list, setList] = useState([]);
  const userInfoStore = useSelector((state) => state.userInfo_reducer);

  useEffect(() => {
    if (menuPath[1] === "rule") {
      setList(tabsRule);
    } else {
      if (userInfoStore && userInfoStore.roleTypeFront) {
        switch (userInfoStore.roleTypeFront) {
          case "0":
            setList(tabsCountAll);
            break;
          case "1":
            setList(tabsCountZr);
            break;
          case "2":
            setList(tabsCountSg);
            break;
          case "3":
            setList(tabsCount);
            break;
        }
      }
    }
  }, []);

  return (
    <div className="xq-pub-tabs">
      <TabsCom list={list} menuPath={menuPath} />
    </div>
  );
};

// tab切换渲染
const TabsCom = withRouter((props) => {
  const { list, menuPath } = props;
  const {
    history: { push },
  } = props;

  const tabChange = (type) => {
    if (type !== menuPath[2]) {
      let url = menuPath[0] + "/" + menuPath[1] + "/" + type;
      push(`/home/${url}`);
    }
  };
  return list.map((item) => {
    let clsName =
      menuPath[1] === "rule" ? "xq-pub-tab long" : "xq-pub-tab short";
    return (
      <div
        className={item.key === menuPath[2] ? `${clsName} curr` : clsName}
        key={item.key}
        onClick={() => tabChange(item.key)}
      >
        {item.name}
      </div>
    );
  });
});
