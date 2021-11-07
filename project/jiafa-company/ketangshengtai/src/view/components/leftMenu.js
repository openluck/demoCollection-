import React, { Component } from "react";
import { Menu, Modal, Icon, Spin } from "antd";
import { G } from "./../../config/g";
import { withRouter, NavLink, matchPath, Link } from "react-router-dom";
import _ from "lodash";
import SVG from './../public/public-component-svg';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

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
    this.renderMenu = this.renderMenu.bind(this);
    this.menuItemClick = this.menuItemClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  componentDidUpdate() {
    const path = this.props.location.pathname;
    if (path !== this.state.path) {
      this.setState({
        path
      });
      const match1 = matchPath(path, { path: `/home/:group` }),
        match2 = matchPath(path, { path: `/home/:group/:menu` }),
        match3 = matchPath(path, {
          path: `/home/:group/:menu/:page`
        }),
        match4 = matchPath(path, { path: `/home` });
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
  menuItemClick({ item, key, keyPath }) {
    this.setState({
      selectedKeys: [`${key}`]
    });
  };

  /**
   * @desc menu 展开函数
   * @param {array} openKeys 选中过的展开项
   */
  onOpenChange(openKeys) {
    // console.log(openKeys);
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
  renderMenu() {
    const path = this.props.location.pathname;
    const match = matchPath(path, { path: `/home/:group` });
    // console.log(match);
    const headerNav = JSON.parse(sessionStorage.getItem('modelConfig'));
    let model = [];
    if (headerNav && headerNav.length) {
      headerNav.map((item, index) => {
        if (item.display) {
          model.push(item);
        }
      });
    }
    // console.log(model);

    if (match && match.params) {
      const group = match.params.group;
      let target = _.find(model, { path: group });
      // console.log(target);

      return (
        <div>
          <Menu
            className={null}
            mode="inline"
            onOpenChange={this.onOpenChange}
            // openKeys={['tpk_rwgl', 'tpk_rwgz', 'tpk_zxpk', 'tpk_pksz']}
            openKeys={this.state.openKeys}
            selectedKeys={[]}
          >
            {
              target && target.children && target.children.length ?
                // 左侧一级
                target.children.map((item, index) => {
                  // console.log(item)
                  if (item.display) {
                    if (item.children && item.children.length) {
                      return (
                        <SubMenu
                          key={`${group}_${item.path}`}
                          title={item.modelName}
                          icon={<span className="mj-leftMenuSpan">
                            <SVG type={item.icon} />
                          </span>}
                        >
                          {
                            // 左侧二级遍历
                            item.children.map(it => {
                              if (it.display) {
                                // 左侧三级
                                if (it.children && it.children.length) {
                                  return (
                                    <SubMenu
                                      key={`${group}_${item.path}_${it.path}`}
                                      style={{ paddingLeft: 30 }}
                                      title={it.modelName}
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
                                                  to={`/home/${group}/${item.path}/${it.path}/${list.path}`}
                                                  activeClassName="mj-menuNavLink"
                                                >
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
                                        to={`/home/${group}/${item.path}/${it.path}`}
                                        activeClassName="mj-menuNavLink"
                                      >
                                        {it.modelName}
                                      </NavLink>
                                    </MenuItem>
                                  );
                                }
                              }
                            })
                          }
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
                            to={`/home/${group}/${item.path}`}
                            activeClassName="mj-menuNavLink"
                            activeStyle={{ color: "#1890ff" }}
                          >
                            <span className="mj-leftMenuSpan">
                              <SVG type={item.icon} />
                            </span>
                            {item.modelName}
                          </NavLink>
                        </MenuItem>
                      );
                    }
                  }
                })
                : // 只有一级导航
                null
            }
          </Menu>
        </div>
      );
    }
  };

  render() {
    // return <div>1111</div>;
    return <div>{this.renderMenu()}</div>;
  }
}
export const LeftMenu = withRouter(LeftM);