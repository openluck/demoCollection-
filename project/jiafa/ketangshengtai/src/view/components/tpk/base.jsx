/*
 * @Author: JC.Liu
 * @Date: 2019-02-26 14:49:08
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-20 13:40:09
 */
import React, { Component } from "react";
import { Menu, Modal, Icon, Spin } from "antd";
import { G } from "./../../../config/g";
import { withRouter, NavLink, matchPath, Link } from "react-router-dom";
import _ from "lodash";
import ImgK from './../../icon/kshzx.png';
import ImgS from './../../icon/schx.png';
import ImgBB from './../../icon/bbzx.png';
import ImgBG from './../../icon/bgzx.png';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;

/**
 * 字体图标
 */
export class SVG extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = {
      ...this.props.style,
      cursor: "pointer"
    };
    // if (this.props.width) style.width = this.props.width;
    // if (this.props.height) style.height = this.props.height;
    // if (this.props.color) style.color = this.props.color;
    /**增加点击事件 */
    let clickHandle = () => {
      if (this.props.onClick) {
        this.props.onClick();
        return this.props.onClick;
      } else {
        return () => { };
      }
    };

    // return (
    // 	<img className={this.props._className | ""} onClick={clickHandle} src={this.props.type} alt={this.props.title | ""} style={{ ...style }} />
    // );
    return (
      <svg
        title=""
        aria-hidden="true"
        className={`icon ${this.props.className}`}
        onClick={clickHandle}
        style={style}
      >
        <use xlinkHref={`#icon-${this.props.type}`}>
          <title>{this.props.title || ""}</title>
        </use>
      </svg>
    );
  }
}

export class IMG extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: Boolean(this.props.src),
      loading: Boolean(this.props.src)
    };
    this.onImgError = this.onImgError.bind(this);
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src != this.props.src) {
      if (nextProps.src) {
        this.setState({
          loading: true,
          success: true //cjy添加
        });
      } else {
        this.setState({
          loading: false,
          success: false
        });
      }
    }
  }

  onImgError() {
    this.setState({
      success: false,
      loading: false
    });
  }

  onImgLoad() {
    this.setState({
      success: true,
      loading: false
    });
  }

  render() {
    var alt = this.props.alt || "picture",
      style = {};
    const orgCode = sessionStorage.getItem("orgCode");
    if (this.props.width) style.width = this.props.width;
    if (this.props.height) style.height = this.props.height;
    return (
      <Spin spinning={this.state.loading}>
        {this.state.success ? (
          <img
            onError={this.onImgError}
            onLoad={this.onImgLoad}
            src={`${this.props.src}/${orgCode}`}
            style={{ ...this.props.style, ...style }}
          />
        ) : (
            <img
              src={require("./icon/xq-default-bg.png")}
              style={{ ...this.props.style, ...style }}
            />
          )}
      </Spin>
    );
  }
}

class LeftM extends Component {
  constructor() {
    super();
    this.state = {
      openKeys: [], // 打开项
      selectedKeys: [],
      overview: false,
      path: ""
    };
    this.rootSubmenuKeys = [];
  }

  componentDidUpdate() {
    const path = this.props.location.pathname;
    if (path !== this.state.path) {
      this.setState({
        path
      });
      const match1 = matchPath(path, { path: `/${this.props.role}/:group` }),
        match2 = matchPath(path, { path: `/${this.props.role}/:group/:menu` }),
        match3 = matchPath(path, {
          path: `/${this.props.role}/:group/:menu/:page`
        }),
        match4 = matchPath(path, { path: `/${this.props.role}` });
      if (match3) {
        // 有三级目录  选出 openKeys 和 selectedKeys
        let group = match3.params.group,
          menu = match3.params.menu,
          page = match3.params.page;
        this.setState({
          openKeys: [`${group}_${menu}`],
          selectedKeys: [`${group}_${menu}_${page}`]
        });
      } else if (match2) {
        // 有二级目录 选中 selectedKeys
        let group = match2.params.group,
          menu = match2.params.menu;
        this.setState({
          openKeys: [],
          selectedKeys: [`${group}_${menu}`]
        });
      } else if (match1) {
        // 只有一级目录 无需选中
        this.setState({
          openKeys: [],
          selectedKeys: []
        });
      } else if (match4) {
        console.log("match4:", match4);
        // 没有地址 默认进来， 直接open 二级第一个子菜单
        const openKeys = [];
        if (!Object.keys(match4.params).length) {
          if (
            G.modelConfig[0] &&
            G.modelConfig[0].children &&
            G.modelConfig[0].children.length
          ) {
            openKeys.push(
              `${G.modelConfig[0].path}_${G.modelConfig[0].children[0].path}`
            );
          } else {
            openKeys.push(`${G.modelConfig[0].path}`);
          }
          console.log("openKeys:", openKeys);

          this.setState({
            openKeys
          });
        }
      }
    }
  }

  /**
   * @desc menuItem 的点击事件 用于选中左侧的菜单
   * @param {object} item
   * @param {string} key
   * @param {array}  keyPath
   */
  menuItemClick = ({ item, key, keyPath }) => {
    this.setState({
      selectedKeys: [`${key}`]
    });
  };

  /**
   * @desc menu 展开函数
   * @param {array} openKeys 选中过的展开项
   */
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    } else {
      this.setState({
        openKeys
      });
    }
  };

  /**
   * @desc 根据path来渲染左侧menu
   *
   */
  renderMenu = () => {
    const path = this.props.location.pathname;
    const match = matchPath(path, { path: `/${this.props.role}/:group` });
    console.log(match)
    let model = [];
    let showKS = false;
    if (G.modelConfig && G.modelConfig.length) {
      G.modelConfig.map((item, index) => {
        if (item.display) {
          model.push(item);
        }
      });
    }

    if (match && match.params) {
      const group = match.params.group;
      let target = _.find(model, { path: group });
      // 获取大数据菜单数据及可视化中心数据
      let bigData = _.find(model, { path: 'stdsj' });
      if (bigData) {
        let ovObj = _.find(bigData.children, { path: 'kshzx' });
        // console.log(bigData, ovObj)
        if (ovObj.display) {
          showKS = true;
        }
      }
      return (
        <div>
          {// 大数据的可视化中心
            group === "stdsj" && showKS ? (
              <div className="JC-stdsj">
                {G.baseinfo.roleLevel == 1 ? (
                  <div
                    className="JC-overview"
                    onClick={() => {
                      let t = window.open(
                        `${window.location.origin}${
                        window.location.pathname
                        }#/overview`
                      );
                      setTimeout(() => {
                        t.document.title = sessionStorage.getItem("systemname");
                      }, 1000);
                    }}
                  >
                    <img src={ImgK} />
                    <span>可视化中心</span>
                    <Icon type="right" />
                  </div>
                ) : null}
              </div>
            ) : null}
          <Menu
            className={group === 'stdsj' ? 'lxx-g-item' : null}
            style={{ background: "#e3e6e9" }}
            mode="inline"
            onOpenChange={group === 'stdsj' ? null : this.onOpenChange}
            openKeys={group === 'stdsj' ? ['stdsj_schx', 'stdsj_bbzx', 'stdsj_bbzx_aikq', 'stdsj_bgzx'] : this.state.openKeys}
            // selectedKeys={this.state.selectedKeys}
            selectedKeys={[]}
          // defaultSelectedKeys={this.state.selectedKeys}
          // defaultOpenKeys={this.state.openKeys}

          // defaultOpenKeys={["stdsj_ktzxbb"]}
          >
            {target && target.children && target.children.length
              ? // 头部导航
              target.children.map((item, index) => {
                // 二级目录
                if (item.path === 'kshzx' && item.display) {
                  return false
                } else if (item.display) {
                  if (item.children && item.children.length) {
                    // 有三级目录
                    return (
                      <SubMenu
                        key={`${group}_${item.path}`}
                        title={
                          group === 'stdsj'
                            ? <div className="lxx-m-item">
                              <img src={item.path === 'schx' ? ImgS : item.path === 'bbzx' ? ImgBB : ImgBG} />
                              {item.modelName}
                            </div>
                            : item.modelName
                        }
                      >
                        {item.children.map((it, idx) => {
                          if (it.display) {
                            if (it.children && it.children.length) {
                              // 四级目录
                              return (
                                <SubMenu
                                  key={`${group}_${item.path}_${it.path}`}
                                  style={{ paddingLeft: 30 }}
                                  title={
                                    group === 'stdsj'
                                      ? <div style={{ position: 'relative' }}>
                                        <span>{it.modelName}</span>
                                        <Icon type="down" style={{ position: 'absolute', right: '-15px', top: 13 }} />
                                      </div>
                                      : it.modelName
                                  }
                                >
                                  {
                                    it.children.map((list, ind) => {

                                      if (list.display) {
                                        return (
                                          <MenuItem
                                            key={`${group}_${item.path}_${it.path}_${list.path}`}
                                            onClick={this.menuItemClick}
                                          >
                                            <NavLink
                                              key={index}
                                              to={`/${this.props.role}/${group}/${item.path}/${it.path}/${list.path}`}
                                              activeClassName="JC-menuNavLink"
                                            >
                                              <span className="JC-leftMenuSpan">
                                                <SVG
                                                  type="xztb"
                                                  width={20}
                                                  height={20}
                                                  color="#1890ff"
                                                />
                                              </span>
                                              {list.modelName}
                                            </NavLink>
                                          </MenuItem>
                                        );
                                      }

                                    })
                                  }
                                </SubMenu>
                              )
                            } else {
                              return (
                                <MenuItem
                                  key={`${group}_${item.path}_${it.path}`}
                                  onClick={this.menuItemClick}
                                >
                                  <NavLink
                                    key={index}
                                    to={`/${this.props.role}/${group}/${
                                      item.path
                                      }/${it.path}`}
                                    activeClassName="JC-menuNavLink"
                                  >
                                    <span className="JC-leftMenuSpan">
                                      <SVG
                                        type="xztb"
                                        width={20}
                                        height={20}
                                        color="#1890ff"
                                      />
                                    </span>
                                    {it.modelName}
                                  </NavLink>
                                </MenuItem>
                              );
                            }

                          }
                        })}
                      </SubMenu>
                    );
                  } else {
                    // 二级导航
                    return (
                      <MenuItem
                        key={`${group}_${item.path}`}
                        onClick={this.menuItemClick}
                      >
                        <NavLink
                          to={`/${this.props.role}/${group}/${item.path}`}
                          activeClassName="JC-menuNavLink"
                          // activeClassName={() => {
                          // 	const path = this.props.location
                          // 	console.log("");

                          // 	// const match
                          // 	return "JC-menuNavLink"
                          // }}
                          activeStyle={{ color: "#1890ff" }}
                        >
                          {item.modelName}
                        </NavLink>
                      </MenuItem>
                    );
                  }
                }
              })
              : // 只有一级导航
              null}
          </Menu>
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderMenu()}</div>;
  }
}

export const LeftMenu = withRouter(LeftM);

/**
 * @desc  全局modal提示框
 * @param {object} obj
 * @param {string} tit  提示标题
 * @param {string} ctn  提示的内容 接收传入的是 React Component
 * @param {string} oT   ok 按钮的文字展示
 * @param {string} cT   取消按钮的文字展示
 * @param {string} className  class名
 * @param {string} okFun  点击ok按钮执行函数
 * @param {string} canFun 点击取消按钮执行函数
 */
export const ModalTip = obj => {
  const {
              tit = "提示",
    ctn = "",
    oT = "确认",
    cT = "取消",
    className = "",
    okFun = () => { },
    canFun = () => { }
            } = obj;
  Modal.confirm({
    title: tit,
    content: ctn,
    okText: oT,
    className: className ? `${className} JC-modal` : "JC-modal",
    cancelText: cT,
    onOk: okFun,
    onCancel: canFun
  });
};

/**
 * @desc  全局loading代码
 */

export class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = {
      ...this.props.style,
      cursor: "pointer"
    };
    let tit = this.props.tit;

    return (
      <div className="all-loading">
        {/* <Icon type="loading-3-quarters" style={style} tit={tit ? tit : '正在查找数据...'} /> */}
        {/* <p>{tit ? tit : '正在查找数据...'}</p> */}
        <Spin spinning={true} />
      </div>
    );
  }
}
