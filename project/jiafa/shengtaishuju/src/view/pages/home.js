/*
 * @Author: junjie.lean
 * @Date: 2019-07-24 14:40:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 10:52:23
 */

import React from "react";
import "./../../style/home.scss";
import { Layout, Popover, Input, message, Icon } from "antd";
import { Route, withRouter, matchPath } from "react-router-dom";
import { connect } from 'react-redux';
import _, { split } from 'lodash';
import LeftMenu from "./../components/leftMenu";
import HomeRouter from './../router/homeRouter';
import SVG from "./../public/svg";
import PerfectScrollbar from 'react-perfect-scrollbar';
import G from './../../config/g';
import RoleChange from './../components/roleChange';
import { setConfig } from "./../../util/request";
import { ws_saveGlobalData } from './../../redux/ws-global.reducer'
const { Sider, Content, Header } = Layout;
let isShow, pathNum = 0;
@withRouter
@connect(state => state, { ws_saveGlobalData })
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // topMenu: [], // 顶部菜单
      selMenu: '', // 选中菜单id
      firSel: '', // 一级菜单选中path
      leftMenu: [], // 左侧菜单
    };
    this.getProps();
    this.menuChange = this.menuChange.bind(this);
    this.getMenuData = this.getMenuData.bind(this);
    this.getProps = this.getProps.bind(this);
  }

  /**
   * 获取菜单等数据
   */
  getProps () {
    let token = this.props.token;
    let orgcode = this.props.orgcode;
    if (orgcode && token) {
      setConfig(G.dataService, token, orgcode);
      let menu = G.ISCED_curRoleInfo.menuData;
      let url = this.props.location.pathname
      // 获取二级目录path
      const match = matchPath(url, { path: `/home/:path` });
      console.log(match)
      // 判断是否显示可视化
      if (menu.length) {
        let ind = _.findIndex(menu, { key: 'ISCED00' })
        if (ind > -1) {
          isShow = true
        } else {
          isShow = false
        }
      }
      if (match) {
        // 刷新
        let path = match.params.path;
        if (menu && menu.length) {
          let ind = _.findIndex(menu, { path: path })
          this.getMenuData('1', menu, ind)
        }
      } else {
        // 初始化进入页面
        let ind = 0;
        isShow ? ind = 1 : null
        this.getMenuData('1', menu, ind)
      }
    }
  }
  componentDidMount () {

  }

  componentDidUpdate () {
    let root = this.props.match.url;
    if (root) {
      let url = window.location.hash
      let arr = url.split('/')
      let par = arr.length ? arr[2] : ''
      let topMenu = G.ISCED_curRoleInfo.menuData;
      let t = _.find(topMenu, { path: par })
      if (t && !pathNum) {
        if (par === 'imp' || par === 'det') {
          // 跳转教学改进和课堂明细
          pathNum = 1
          this.setState({
            selMenu: t.key,
            leftMenu: t.children,
            firSel: t.path
          })
          let newArr = arr.splice(3, arr.length) // 提出路由前三项
          let info = ''
          newArr.map(dt => {
            info = info + `/${dt}`
          })
          this.props.history.push(`/home/${par}${info}`);
        }
      }
    }
  }

  /**
   * 获取选中一级菜单id、左侧菜单数据等
   * @param {String} type 类型
   * @param {Array} data 菜单数据
   * @param {Number} ind 下标 
   */
  getMenuData (type, data, ind) {
    pathNum = 0
    let leftMenu = data[ind]
    // 设置课堂违纪关闭，明细结果-课堂违纪菜单屏蔽
    if (G.ISCED_setInfo && G.ISCED_setInfo.ifClassroomDiscipline === '0' && leftMenu.key === 'ISCED03') {
      leftMenu.children.map(dt => {
        dt.key === 'ISCED030'
          ? dt.children = _.filter(dt.children, o => o.key !== 'ISCED0304')
          : null
      })
    }
    // 设置多媒体关闭，明细结果-多媒体菜单屏蔽
    if (G.ISCED_setInfo && G.ISCED_setInfo.multimediaUse === '0' && leftMenu.key === 'ISCED03') {
      // 删除明细中的资源情况多媒体
      let ind1 = _.findIndex(leftMenu.children, { key: "ISCED032" });
      if (ind1 > -1) {
        leftMenu.children.splice(ind1, 1)
      }
    }
    // 设置教师考勤关闭，明细结果-教师考勤屏蔽
    if (G.ISCED_setInfo && G.ISCED_setInfo.isTeacherCheck === '0' && leftMenu.key === 'ISCED03') {
      leftMenu.children.map(dt => {
        dt.key === 'ISCED030'
          ? dt.children = _.filter(dt.children, o => o.key !== 'ISCED0300')
          : null
      })
    }
    // 设置教师考勤关闭，明细结果-低头率屏蔽
    if (G.ISCED_setInfo && G.ISCED_setInfo.isHeadLow === '0' && leftMenu.key === 'ISCED03') {
      leftMenu.children.map(dt => {
        dt.key === 'ISCED030'
          ? dt.children = _.filter(dt.children, o => o.key !== 'ISCED0303')
          : null
      })
    }
    // 设置教师考勤关闭，明细结果-前排就座率屏蔽
    if (G.ISCED_setInfo && G.ISCED_setInfo.isFrontRate === '0' && leftMenu.key === 'ISCED03') {
      leftMenu.children.map(dt => {
        dt.key === 'ISCED030'
          ? dt.children = _.filter(dt.children, o => o.key !== 'ISCED0302')
          : null
      })
    }
    // 设置关闭，报表统计、明细结果-教学质量屏蔽
    if (G.ISCED_setInfo && G.ISCED_setInfo.dataAnalyze === '0') {
      if (leftMenu.key === 'ISCED03') {
        // 明细
        leftMenu.children = _.filter(leftMenu.children, o => o.key !== 'ISCED031')
      } else if (leftMenu.key === 'ISCED02') {
        // 统计
        leftMenu.children = _.filter(leftMenu.children, o => o.key !== 'ISCED021')
      }
    }
    if (type === '1') {
      this.state = {
        ...this.state,
        selMenu: leftMenu.key,
        leftMenu: leftMenu.children,
        firSel: leftMenu.path
      }
    } else {
      console.log('我是左侧数据', leftMenu)
      this.setState({
        selMenu: leftMenu.key,
        leftMenu: leftMenu.children,
        firSel: leftMenu.path
      })
    }
  }

  /**
   * 切换菜单
   * @param {String} id 选中菜单id
   */
  menuChange (id) {
    console.log(id)
    if (id == 'ISCED00') {
      window.open(window.location.origin + window.location.pathname + '#/visual')
    } else {
      let topMenu = G.ISCED_curRoleInfo.menuData;
      let ind = _.findIndex(topMenu, { key: id });
      this.getMenuData('2', topMenu, ind)
      this.props.history.push(`/home/${topMenu[ind].path}`);
      // sessionStorage.setItem('tabArray',null)
    }
    this.props.ws_saveGlobalData([], 'ISCED_tabArray')
    this.props.ws_saveGlobalData({}, 'ISCED_detailCondition')
  }

  render () {
    let root = this.props.match.url;
    let { selMenu, leftMenu, firSel } = this.state;
    // console.log('leftMenu',this.props.match)
    let topMenu = G.ISCED_curRoleInfo.menuData

    return (
      <Layout className="lxx-layout">
        <Header className="lxx-g-cntTop lxx-g-flex">
          <div className="lxx-g-sysName" style={G.ISCED_sysNameConfig}>
            <span>{G.ISCED_sysName}</span>
          </div>
          <div className="lxx-g-topMenu lxx-m-flex">
            {
              topMenu.length
                ? topMenu.map((dt, index) => {
                  {/* if (index==0&&!isShow) {
                    return null
                  } */}
                  return <div
                    key={dt.key}
                    className={selMenu === dt.key ? 'mlist selected' : 'mlist'}
                    style={{ width: `${100 / topMenu.length - 2}%` }}
                  >
                    <div onClick={() => this.menuChange(dt.key)}>{dt.name}</div>
                  </div>
                })
                : null
            }
          </div>
          <div className='lxx-g-user'>
            <RoleChange />
          </div>
        </Header>
        <Layout>
          <Sider width={220}>
            {/* {
              isShow
                ? <div className="lxx-g-vis" onClick={() => window.open(window.location.origin + window.location.pathname + '#/visual')}>
                  <span>可视化中心</span>
                </div>
                : null
            } */}
            {
              leftMenu.length
                ? <Route path={`${root}/${firSel}/:func`}><LeftMenu data={leftMenu} parSel={firSel} /></Route>
                : null
            }
          </Sider>
          <Content>
            <div className="lxx-g-cnt">
              <PerfectScrollbar style={{ position: 'relation', height: '100%' }}>
                <HomeRouter firSel={firSel} />
              </PerfectScrollbar>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default connect(state => ({ token: state.ws_global_reducer.ISCED_token, orgcode: state.ws_global_reducer.ISCED_orgcode }), {})(Home)