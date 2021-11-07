/*
 * @Author: wangsong 
 * @Date: 2020-02-09 17:10:12 
 * @Last Modified by: wangsong
 * @Last Modified time: 2020-04-22 13:48:04
 * 菜单组件
 */
import _ from 'lodash';
import React, { Component } from 'react';
import navList from "../../components/image/rightNavData";
class RightNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navData: []
    };
    this.scrollToAnchor = this.scrollToAnchor.bind(this);
    this.getAllNodeTop = this.getAllNodeTop.bind(this);
    this.filterNavData = this.filterNavData.bind(this);
  }
  componentDidMount () {
    console.log("this.props.navData", this.props.navData)
    this.setState({
      navData: this.props.navData
    })
    this.getAllNodeTop();
  }
  componentWillReceiveProps (props) {
    if (this.state.navData != props.navData) {
      this.setState({
        navData: props.navData
      })
    }
  }
  /**
   * @description 设置rightNav数据并获取所有节点的位置
   */
  getAllNodeTop () {
    let navData = [];
    let { type } = this.props;
    switch (type) {
      case "organ":
        navData = JSON.parse(JSON.stringify(navList.organNavData));
        break;
      case "college":
        navData = JSON.parse(JSON.stringify(navList.collegeNavData));
        break;
      case "course":
        navData = JSON.parse(JSON.stringify(navList.courseNavData));
        break;
      case "teacher":
        navData = JSON.parse(JSON.stringify(navList.teacherNavData));
        break;
    }
    let qualityArr = ["jxfx", "xstjfk"];//未启用课堂分析过滤数据
    let multimeArr = ["dmtsy"];//未启用多媒体使用过滤数据
    let classDiscArr = ["ktwj"];//未启用课堂违纪过滤数据
    let teaCheckArr = ["jskq"];//未启用教师考勤过滤数据
    let headLowArr = ["sjl"];//未启用低头率过滤数据
    let frontRateArr = ["qpjzl"];//未启用前排就坐率过滤数据
    let fileData = [];
    if (G.ISCED_setInfo.dataAnalyze === "0") {
      fileData = fileData.concat(qualityArr);
    }
    if (G.ISCED_setInfo.multimediaUse === "0") {
      fileData = fileData.concat(multimeArr);
    }
    if (G.ISCED_setInfo.ifClassroomDiscipline === "0") {
      fileData = fileData.concat(classDiscArr);
    }
    if (G.ISCED_setInfo.isTeacherCheck === "0") {
      fileData = fileData.concat(teaCheckArr);
    }
    if (G.ISCED_setInfo.isHeadLow === "0") {
      fileData = fileData.concat(headLowArr);
    }
    if (G.ISCED_setInfo.isFrontRate === "0") {
      fileData = fileData.concat(frontRateArr);
    }
    console.log("fileData", JSON.stringify(fileData))
    if (fileData.length) {
      navData = this.filterNavData(navData, fileData);
    }
    navData.map((item, index) => {
      let temp = document.getElementById(item.id);
      if (temp) {
        item.offsetTop = temp.offsetTop;
      }
    })
    this.props.editNavData(navData);
  }
  /**
   * @description 筛选过滤菜单数据
   * @param {Array} data 数组 
   * @param {Array} screen 过滤数组id集合 
   */
  filterNavData (data, screen) {
    let i = data.length;
    while (i--) {
      for (let j = 0; j < screen.length; j++) {
        if (data[i] && data[i].id === screen[j]) {
          data.splice(i, 1);
          if (data[i - 1].level === "1") {
            // 无子级菜单，删除主菜单
            if (!_.find(data, { parentId: data[i - 1].id })) {
              data.splice(i - 1, 1);
            }
          }
        }
      }
    }
    return data;
  }
  /**
   * @description 滚动条平滑到某个位置
   * @param {String} item 当前集合
   * @param {Number} index 索引
   */
  scrollToAnchor (item, index) {
    let anchorElement = document.getElementById(item.id);
    let id = "";
    let { navData } = this.state;
    navData.map(item => { item.active = false });
    if (anchorElement) {
      item.active = true;
      id = item.id;
    } else {
      navData[index + 1].active = true;
      id = navData[index + 1].id;
    }
    this.props.editNavData(navData);
    this.props.scrollToAnchor(id);
  }
  render () {
    let { navData } = this.state;
    return (
      <div className="ws-rightNav">
        {
          navData.map((item, index) => (
            <div
              onClick={() => { this.scrollToAnchor(item, index) }}
              className={item.level === "1"
                ? "ws-firstLine"
                : (item.active
                  ? "ws-active ws-secondLine"
                  : "ws-secondLine")
              }
              key={item.id}
            >
              <span>{item.name}</span>
            </div>
          ))
        }
      </div>
    );
  }
}

export default RightNav;
