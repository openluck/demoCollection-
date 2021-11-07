/*
 * @Author: zoe ღ
 * @Date: 2020-02-12 14:33:12
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-30 16:27:33
 * 暂未使用 2021/07/20 
 */

import React, { Component } from "react";
import SVG from "../../../public/svg";
import G from "../../../../config/g";
class ZoeQuaNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 获取当前页面位置
  getpage = (pageType, curSign) => {
    var page = "";
    var nav = "";
    var nav1 = "";
    var nav2 = "";
    var nav3 = "";
    if (pageType === 1) {
      page = "课程统计";
      switch (curSign) {
        case 1:
          nav = "";
          return { page, nav };
        case 2:
          nav1 = "课程";
          return { page, nav1 };
        case 3:
          nav1 = "课程";
          nav2 = "教学班";
          return { page, nav1, nav2 };
        case 4:
          nav1 = "课程";
          nav2 = "教学班";
          nav3 = "课堂";
          return { page, nav1, nav2, nav3 };
        default:
          return { page, nav };
      }
    }
    if (pageType === 2) {
      page = "教师统计";
      switch (curSign) {
        case 1:
          nav = "";
          return { page, nav };
        case 2:
          nav1 = "教师";
          return { page, nav1 };
        case 3:
          nav1 = "教师";
          nav2 = "教学班";
          return { page, nav1, nav2 };
        case 4:
          nav1 = "教师";
          nav2 = "教学班";
          nav3 = "课堂";
          return { page, nav1, nav2, nav3 };
        default:
          return { page, nav };
      }
    }
  };
  //点击返回函数
  goBack = curSign => {
    const { record, pageType } = this.props;
    switch (curSign) {
      case 4:
        pageType === 1
          ? this.props.getCurSign(3, record.courRecord)
          : pageType === 2
          ? this.props.getCurSign(3, record.teaRecord)
          : "";
        break;
      case 3:
        this.props.getCurSign(2, record.colRecord);
        break;
      case 2:
        this.props.getCurSign(1, {});
        break;
    }
  };
  //点击面包削函数
  clickBread = curSign => {
    this.props.changeSign(curSign);
  };
  render() {
    const { pageType, curSign } = this.props;
    const { roleType } = G.ISCED_curRoleInfo;
    let obj = this.getpage(pageType, curSign);
    return (roleType==="1" || roleType === '2') ? (
      <div className="zoe-nav">
        {curSign !== 1 ? (
          <p
            className="zoe-goBack zoe-goBack1"
            onClick={() => this.goBack(curSign)}
          >
            <SVG type="back"></SVG>
          </p>
        ) : null}
        <span style={{ color: "#adafb0" }}>当前位置：</span>
        {curSign === 1 ? ( //首页
          <p>
            <span
              onClick={() => this.clickBread(1)}
              style={{ color: "#adafb0" }}
            >
              {obj.page}
            </span>
          </p>
        ) : curSign === 2 ? ( //首页+2级页面
          <p>
            <span onClick={() => this.clickBread(1)}>{obj.page}</span>
            <span>&nbsp;>&nbsp;</span>
            <span
              onClick={() => this.clickBread(2)}
              style={{ color: "#adafb0" }}
            >
              {obj.nav1}
            </span>
          </p>
        ) : curSign === 3 ? ( //首页+2级页面+3级页面
          <p>
            <span onClick={() => this.clickBread(1)}>{obj.page}</span>
            <span>&nbsp;>&nbsp;</span>
            <span onClick={() => this.clickBread(2)}>{obj.nav1}</span>
            <span>&nbsp;>&nbsp;</span>
            <span
              onClick={() => this.clickBread(3)}
              style={{ color: "#adafb0" }}
            >
              {obj.nav2}
            </span>
          </p>
        ) : curSign === 4 ? ( //首页+2级页面+3级页面+4级页面
          <p>
            <span onClick={() => this.clickBread(1)}>{obj.page}</span>
            <span>&nbsp;>&nbsp;</span>
            <span onClick={() => this.clickBread(2)}>{obj.nav1}</span>
            <span>&nbsp;>&nbsp;</span>
            <span onClick={() => this.clickBread(3)}>{obj.nav2}</span>
            <span>&nbsp;>&nbsp;</span>
            <span
              onClick={() => this.clickBread(4)}
              style={{ color: "#adafb0" }}
            >
              {obj.nav3}
            </span>
          </p>
        ) : (
          <></>
        )}
      </div>
    ) : (roleType==="3" || roleType === '4') ? (
      <div className="zoe-nav">
        {curSign !== 2 ? (
          <p
            className={curSign === 1 ? "zoe-goBack" : "zoe-goBack zoe-goBack1"}
            onClick={() => this.goBack(curSign)}
          >
            <SVG type="back"></SVG>
          </p>
        ) : null}
        <span style={{ color: "#adafb0" }}>当前位置：</span>
        {curSign === 2 ? ( //课程或教师作首页
          <p>
            <span
              onClick={() => this.clickBread(2)}
              style={{ color: "#adafb0" }}
            >
              {obj.nav1}
            </span>
          </p>
        ) : curSign === 3 ? ( //首页+2级页面
          <p>
            <span onClick={() => this.clickBread(2)}>{obj.nav1}</span>
            <span>&nbsp;>&nbsp;</span>
            <span
              onClick={() => this.clickBread(3)}
              style={{ color: "#adafb0" }}
            >
              {obj.nav2}
            </span>
          </p>
        ) : curSign === 4 ? ( //首页+2级页面+3级页面
          <p>
            <span onClick={() => this.clickBread(2)}>{obj.nav1}</span>
            <span>&nbsp;>&nbsp;</span>
            <span onClick={() => this.clickBread(3)}>{obj.nav2}</span>
            <span>&nbsp;>&nbsp;</span>
            <span
              onClick={() => this.clickBread(4)}
              style={{ color: "#adafb0" }}
            >
              {obj.nav3}
            </span>
          </p>
        ) : (
          <></>
        )}
      </div>
    ) : null;
  }
}

export default ZoeQuaNav;
