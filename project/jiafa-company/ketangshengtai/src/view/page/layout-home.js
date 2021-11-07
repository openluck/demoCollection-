/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:47
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-22 13:05:51
 */
import React, { Component } from "react";
import { Route, Switch, Redirect, matchPath } from "react-router-dom";
import { Layout, message, Select } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import _ from 'lodash';
import { request as Ajax } from "./../../util/request";
import { G, findGlobalData } from './../../config/g';
import SVG from './../public/public-component-svg';
import Menu from './../page/menu';
import { connect } from 'react-redux';

import TpkIndexLatest from './tpk/index';
import JxfsIndex from './jxfs/index.jsx';
import ZxxkIndex from './zxxk/index';
import PajsIndex from './pajs/index';
import XtszIndex from './xtsz/index';
import { LeftMenu } from './../components/leftMenu';
import JXFSMSVideo from './jxfs/jxfsVideoMs.jsx';
import "./../../style/index.scss";
import "./../../style/home.scss";

const { Sider, Content } = Layout;
const { Option } = Select;

@connect(state => state.home, {})
class Home extends Component {
  constructor() {
    super();
    this.state = {
      sider: true,
      roleId: '',
      sysName: sessionStorage.getItem('systemname') || '',
    };
    this.topMenuChan = this.topMenuChan.bind(this);
    this.findRedirect = this.findRedirect.bind(this);
    this.roleChan = this.roleChan.bind(this);

    // if (!G.modelConfig || !G.modelConfig.length) {
    //   findGlobalData()
    //   .then(res => {
    //       console.log(G);
    //     })
    //     .catch(err => {
    //       message.warning("用户信息异常，请重新登录！");
    //       setTimeout(() => {
    //         window.close();
    //       }, 2000);
    //     });
    // }
  }
  componentWillUpdate() {
    if (!G.modelConfig || !G.modelConfig.length) {
      findGlobalData()
        .then(res => {
          // console.log(G);
        })
        .catch(err => {
          message.warning("用户信息异常，请重新登录！");
          setTimeout(() => {
            window.close();
          }, 2000);
        });
    }
  }

  componentDidMount() {
    const roleInfo = JSON.parse(sessionStorage.getItem('roleInfo')),
      roleId = roleInfo && roleInfo.roleId ? roleInfo.roleId : '';
    this.setState({ roleId, sysName: sessionStorage.getItem('systemname') || '', })
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props, state);
    if (props.sysName !== '' && props.sysName !== state.nextProps) {
      return {
        sysName: props.sysName
      }
    }

    const path = props.location.pathname;
    const match = matchPath(path, { path: `/home/:path` });
    if (match) {
      if (
        (match.params.path && match.params.path === "jxfs") ||
        match.params.path === "jxfsVideo" || match.params.path == 'jxfsVideoMs'
      ) {
        return {
          ...state,
          sider: false
        };
      } else {
        return {
          ...state,
          sider: true
        };
      }
    } else {
      return {
        ...state,
        sider: true
      };
    }
  }

  /**
   * @desc 角色切换
   * @param {*} value 角色id
   */
  roleChan(value) {
    const baseinfo = JSON.parse(sessionStorage.getItem('baseinfo')),
      roles = baseinfo ? baseinfo.role : [];

    let role = _.find(roles, { roleId: value });
    if (role) {
      new Promise(resolve => {
        G.modelConfig = Menu(role.function);
        sessionStorage.setItem('modelConfig', JSON.stringify(G.modelConfig));

        G.roleInfo = { roleId: value, roleLevel: role.roleLevel };
        sessionStorage.setItem('roleInfo', JSON.stringify(G.roleInfo));

        resolve();
      }).then(() => {
        console.log('12356');
        this.props.history.push('/loading');
      })
    } else {
      message.error("切换身份异常!", 2);
    }
    this.setState({ roleId: value });
  }

  /**
   * 头部一级导航切换
   */
  topMenuChan(item) {
    this.setState({ sider: true });
    let itemChild = item.children;
    if (itemChild && itemChild.length) {
      let FirstTarget = _.find(itemChild, { display: true });
      this.props.history.push(`/home/${item.path}/${FirstTarget.path}`);
    } else {
      this.props.history.push(`/home/${item.path}`);
    }
  }

  /**
   * @desc  根据 modelConfig 找到第一个可展示的模块
   * @param { array } model  模块配置
   */
  findRedirect(model) {
    let FirstTarget = _.find(model, { display: true });
    let firChild = FirstTarget && FirstTarget.children ? FirstTarget.children : null;
    // 如果这个目录下的第一个目录下还有子目录， /group/page/menu
    if (firChild && firChild.length) {
      // 展开 /group/page/menu
      let nextTarget = _.find(firChild, { display: true });
      // console.log(`/admin/${FirstTarget.path}/${nextTarget.path}`);

      // return <Redirect to={`/home/${FirstTarget.path}`} />
      return <Redirect to={`/home/${FirstTarget.path}/${nextTarget.path}`} />
    } else {
      // 没有 /group/page
      return <Redirect to={`/home/zxxk`} />;
    }
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(nextProps, prevState);
  //   if (nextProps.sysName !== '' && nextProps.sysName !== prevState.nextProps) {
  //     return {
  //       sysName: nextProps.sysName
  //     }
  //   }
  //   return null
  // }

  render() {
    const headerNav = JSON.parse(sessionStorage.getItem('modelConfig'));
    // const headerNav = G.modelConfig;
    const path = this.props.location.pathname;
    const match = matchPath(path, { path: `/home/:path` });
    const baseinfo = JSON.parse(sessionStorage.getItem('baseinfo')),
      roles = baseinfo ? baseinfo.role : [];
    const { roleId, sider, sysName } = this.state;

    // console.log(G);

    return (
      <React.Fragment>
        <div className='mj-home-content'>
          {/* 头部 */}
          <div className='mj-home-header'>
            {/* 标题 */}
            <div className='mj-home-title' title={sysName}>{sysName}</div>
            {/* <div className='mj-home-title'>{sessionStorage.getItem('systemname')}</div> */}
            {/* 头部一级导航 */}
            <div className='mj-home-headerNav'>
              <ul>
                {
                  headerNav && headerNav.length ?
                    headerNav.map(item => {
                      let paramPath = "";
                      if (match) {
                        paramPath = match.params.path;
                      }
                      if (item.display) {
                        return <li key={item.path}
                          onClick={() => this.topMenuChan(item)}
                          className={paramPath === item.path ? 'mj-home-navActive' : null}>
                          <div className='mj-home-top'>{item.group}</div>
                          {paramPath === item.path ? <div className='mj-home-bottom'></div> : null}
                        </li>
                      }
                    }) : null
                }
              </ul>
            </div>
            {/* 账号角色 */}
            <div className='mj-home-roleCon'>
              <SVG type='user' />
              <Select defaultValue="lucy"
                onChange={(value) => this.roleChan(value)}
                value={roleId}
                dropdownClassName='mj-home-rolesDrop'
                bordered={false}
                style={{ width: 240 }}
                suffixIcon={<SVG type='xl' />}>
                {
                  roles && roles.length ?
                    roles.map(item => {
                      return <Option key={item.roleId} value={item.roleId}>
                        {`${item.roleName} - ${item.roleId === 'admin' ? 'admin' : baseinfo.userName}`}
                      </Option>
                    }) : null
                }
              </Select>
            </div>
          </div>

          {/* 侧边栏 内容 */}
          <div className='mj-home-contain'>
            <Layout>
              {/* 导航 */}
              {
                sider ?
                  <Sider>
                    <div className='mj-home-leftMenu'>
                      <div>
                        <LeftMenu />
                      </div>
                    </div>
                  </Sider> : null
              }

              {/* 内容 */}
              <Content>
                <PerfectScrollbar className='xm-contentScrollBar'>
                  <div style={{ height: '100%' }} id='scrool'>
                    <div className="mj-home-wrap" style={{ height: '100%' }}>
                      <Switch>
                        {/* 二级目录 */}
                        <Route path={`/home/zxxk`} component={ZxxkIndex} />
                        <Route path={`/home/tpk`} component={TpkIndexLatest} />
                        <Route path={`/home/jxfs`} component={JxfsIndex} />
                        <Route path={`/home/pajs`} component={PajsIndex} />
                        <Route path={`/home/xtsz`} component={XtszIndex} />

                        {/* 教学反思播放页 type  1 教研课  2 随堂听  3日常授课*/}
                        <Route exact path={`/home/jxfsVideo/:id/:type`} component={JXFSMSVideo} />

                        {/* 右上角的设置按钮点击跳转地址 */}
                        {/* <Route path="/home/setting" component={Setting} /> */}

                        {
                          headerNav && headerNav.length
                            ? this.findRedirect(headerNav)
                            : null
                        }
                      </Switch>
                    </div>
                  </div>
                </PerfectScrollbar>
              </Content>
            </Layout>
          </div>
        </div>
      </React.Fragment>
    );

  }
}

export default Home;
