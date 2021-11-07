/*
 * @Author: wangsong 
 * @Date: 2020-02-14 15:07:12 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-24 17:22:38
 * 滚动容器组件
 */
import React, { Component } from 'react';
import RightNav from "../../components/image/rightNav";
import "../../../style/wsPortrayal.scss";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ws_saveGlobalData } from "../../../redux/ws-global.reducer";
import { connect } from "react-redux";
import TopSelImg from "../../components/image/topSelImg";
import NoImgData from "../../components/image/noImgData";
import G from "../../../config/g";
let timer;
@connect(state => state,
  {
    ws_saveGlobalData,
  })
class RollContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navData: [],//右侧菜单数据
      skipId: "",//跳转目标id
      currentPot: 0,//记录跳转点
      direction: "",//记录方向，1下，2上
      stick: false//置顶和未置顶
    };
    this.scrollToAnchor = this.scrollToAnchor.bind(this);
    this.editNavData = this.editNavData.bind(this);
    this.scroll = this.scroll.bind(this);
    this.scrollLinkage = this.scrollLinkage.bind(this);

  }
  componentDidMount() {
    let portrayal = document.getElementById("ws-portrayal");
    portrayal.addEventListener("scroll", this.scroll);
    //可视化中心进入跳转锚点
    let typeId = this.props.match ? this.props.match.params.typeId : "";
    if (typeId) {
      setTimeout(() => {
        this.scrollToAnchor(typeId);
      }, 100);
    }
  }
  componentWillUnmount() {
    let portrayal = document.getElementById("ws-portrayal");
    portrayal.removeEventListener("scroll", this.scroll);
    clearTimeout(timer);
  }
  /**
   * @description 滚动条联动导航
   */
  scrollLinkage(navData) {
    let currentPot = document.getElementById("ws-portrayal").scrollTop;//目前滚动位置
    navData.map(item => { item.active = false });
    for (let i = navData.length - 1; i >= 0; i--) {
      if (currentPot + 100 >= navData[i].offsetTop) {
        navData[i].active = true;
        break;
      }
    }
    this.setState({
      navData
    });
  }
  /**
   * @description 滚动条滚动
   */
  scroll(e) {
    let currentPot = document.getElementById("ws-portrayal").scrollTop;//目前滚动位置
    let stickNav = document.getElementById("stick-nav");//需要置顶的导航
    let externu = document.getElementById("ws-externu");//外层容器
    let portrayal = document.getElementById("ws-portrayal");
    let topTypeDown = document.getElementsByClassName("ws-topType-down")[0];
    let { navData, stick } = this.state;
    let jbxxHeight = 260;
    if (currentPot >= jbxxHeight) {
      if (!stick) {//置顶后减去导航置顶之前所占的高度
        stickNav.classList.add("ws-nav-fixed");
        portrayal.classList.add("ws-paddingTop70");//添加导航fixed脱离内容区的高度
        if (topTypeDown) {//导航位置及position变动固定课程类型
          topTypeDown.style.left = "10px";
          topTypeDown.style.top = "67px";
        }
        navData.map(item => {
          if (item.offsetTop !== 0) {
            item.offsetTop = item.offsetTop - 70;
          }
        })
        currentPot = this.state.currentPot;
      }
      stick = true;
      this.setState({
        stick
      });
    } else {
      if (stick) {
        stickNav.classList.remove("ws-nav-fixed");
        portrayal.classList.remove("ws-paddingTop70");//添加导航fixed脱离内容区的高度
        if (topTypeDown) {
          topTypeDown.style.left = "30px";
          topTypeDown.style.top = "323px";
        }
        navData.map(item => {
          if (item.offsetTop !== 0) {
            item.offsetTop = item.offsetTop + 70;
          }
        })
      }
      stick = false;
      this.setState({
        stick
      });
    }
    this.setState({ currentPot });
    let { skipId, direction } = this.state;
    if (skipId) {//如果有需要跳转的目标
      let targetPot = document.getElementById(skipId).offsetTop;//跳转目标位置
      if (direction === "1" ? currentPot >= targetPot : currentPot <= targetPot) {//跳转锚点完成
        this.setState({ skipId: "" });
      } else {//跳转锚点未完成
        timer = setTimeout(() => {//对比距离是否更新
          if (currentPot === this.state.currentPot) {
            this.setState({ skipId: "" });
            this.scrollLinkage(navData);
          }
        }, 300);
      }
    } else {
      this.scrollLinkage(navData);
    }

  }
  /**
   * @description 滚动条平滑到某个位置
   * @param {String} skipId 对象id 
   */
  scrollToAnchor(skipId) {
    let { navData } = this.state;
    let anchorElement = document.getElementById(skipId);
    let portrayal = document.getElementById("ws-portrayal");
    if (anchorElement) {
      if (skipId === "jbxx") {//如果跳转到第一个则清楚paddingtop
        document.getElementById("ws-portrayal").classList.remove("ws-paddingTop70");
        skipId = "topSelImg";
        anchorElement = document.getElementById(skipId);
      }
      let targetPot = anchorElement.offsetTop;//跳转目标位置
      let currentPot = document.getElementById("ws-portrayal").scrollTop;//目前滚动位置
      this.setState({
        skipId,
        direction: currentPot < targetPot ? "1" : "2"//记录方向，1下，2上
      });
      if (!anchorElement.scrollTo) {
        Element.prototype.scrollTo = function (option) {
          this.scrollTop = option.top;
          this.behavior = option.behavior
        };
      }
      portrayal.scrollTo({
        top: anchorElement.offsetTop - 90,
        behavior: "smooth"
      });

    }

  }
  /**
   * @description 修改菜单数据
   * @param {Arry} navData 数据
   */
  editNavData(navData) {
    this.setState({
      navData
    })
  }
  render() {

    let { navData } = this.state;
    let { noData, type, match } = this.props;
    return (
      <div style={{ height: "100%" }} id="ws-externu">
        <div className="ws-portrayal" id="ws-portrayal">
          <TopSelImg match={match} editTopParams={this.props.editTopParams} type={type}></TopSelImg>
          {
            noData ?
              <NoImgData
                typeName={
                  type === "conllege" ? "开课单位" :
                    type === "course" ? "课程" :
                      type === "teacher" ? "教师" : ""
                } />
              :
              <React.Fragment>
                <div className="ws-portrayal-container">
                  {this.props.children}
                </div>
                <RightNav navData={navData} type={type} editNavData={this.editNavData} scrollToAnchor={this.scrollToAnchor}></RightNav>
              </React.Fragment>
          }

        </div>
      </div>
    );
  }
}

export default RollContainer;
