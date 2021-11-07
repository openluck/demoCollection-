/*
 * @Author: lxx 
 * @Date: 2020-01-22 14:04:15 
 * @Last Modified by: tj
 * @Last Modified time: 2020-09-01 17:35:16
 * 菜单组件
 */
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link, NavLink, withRouter } from 'react-router-dom';
import SVG from './../public/svg';
import _ from 'lodash'
import { connect } from 'react-redux';
import { lxx_saveInfo,ws_saveGlobalData } from "./../../redux/ws-global.reducer";

const { SubMenu } = Menu;

@withRouter
@connect(state => state,
  {
    lxx_saveInfo, ws_saveGlobalData 
  })
class LeftMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: props.data,
            selectedKeys: [], // 选中菜单
            selFunc: '', // 选中项path
            isSec: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.getSelectKey = this.getSelectKey.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
    }

    componentDidMount() {
        let { menus } = this.state;
        console.log(menus)

        // 获取菜单配置
        if (this.props.match) {
            let func = this.props.match.params.func;
            this.getSelectKey(func);
        } else {
            // 初始进入项目
            const getChild = (item) => {
                if (item.children && item.children.length) {
                    getChild(item.children[0]);
                } else {
                    this.getSelectKey(item.path);
                }
            }
            // 获取配置菜单第一项路由
            if (menus.length) {
                getChild(menus[0]);
            }
        }

    }

    componentDidUpdate() {
        let data = this.props.data;
        let info = this.props.lxx_lev_reducer.ISCED_saveInfo;
        let func = this.props.match.params.func;
        // console.log(func, this.props.lxx_lev_reducer.ISCED_saveInfo, this.state.selFunc)
        if(data && data !== this.state.menus) {
            this.setState({
                menus: data
            })
            // 初始进入项目
            const getChild = (item) => {
                if (item.children && item.children.length) {
                    getChild(item.children[0]);
                } else {
                    this.getSelectKey(item.path);
                }
            }
            // 获取配置菜单第一项路由
            if (data.length) {
                getChild(data[0]);
            }
        }
        // if(
        //     (func === 'ordcour' || func === 'ordtea' || func === 'quacour' || func === 'quatea' || func === 'resclass' || func === 'restea') 
        //     && this.state.selFunc === func && info !== '1' ) {
        //     console.log('22222')
        //     this.props.lxx_saveInfo('1')
        // }
    }

    /**
     * 查询菜单当前选中项并匹配
     * @param {*} func 
     */
    getSelectKey(func) {
        // console.log(func)
        let { menus } = this.state;
        let selKeys = [], i, openKeys = [], selFunc = '';
        // 获取打开项
        const getOpenKeys = (parmenu) => {
            // console.log(parmenu)
            if (parmenu.children && parmenu.children.length) {
                let arr = parmenu.children
                let i = _.findIndex(arr, { key: selKeys[0] });
                if (i !== -1) {
                    openKeys.push(parmenu.key);
                };
                let k = _.findIndex(menus, { key: parmenu.key });
                if (k !== -1 && menus[k].key === parmenu.key) {
                    openKeys.push(menus[k].key);
                }
            } else {
                openKeys.push(parmenu.key);
            }

        }
        // parmenu 父级菜单
        const findInd = (parmenu, item) => {
            if (item.children && item.children.length) {
                item.children.map(li => {
                    findInd(item, li);
                })
            } else {
                if (item.path === func) {
                    selKeys.push(item.key);
                    // 改变页面明显
                    // this.props.changePageName(item.name);
                    selFunc = item.path;
                    openKeys.push(item.key);
                    getOpenKeys(parmenu);

                };
            }
        }
        menus.map(item => {
            findInd(item, item);
        });
        // 更新组织机构数据
        // this.updateGlobe();
        this.setState({
            selectedKeys: selKeys,
            selFunc,
            openKeys
        });

    }

    /**
     * 菜单选中
     */
    handleClick(e) {
        let { menus } = this.state;
        let keyPath = e.keyPath;
        let selFunc = '';
        // console.log(keyPath)
        
        // parmenu 父级菜单
        const findInd = (parmenu, item) => {
            if (item.children && item.children.length) {
                item.children.map(li => {
                    findInd(item, li);
                })
            } else {
                if (item.key === keyPath[0]) {
                    selFunc = item.path;
                };
            }
        }
        menus.map(item => {
            findInd(item, item);
        });

        this.setState({
            selectedKeys: [keyPath[0]],
            selFunc
        });
        // 更新组织机构数据
        if (keyPath && keyPath.length > 1) {
            let len = keyPath.length;
            this.setState({
                openKeys: keyPath.splice(1, len)
            });
        } else {
            this.setState({
                openKeys: [keyPath[0]]
            });
        }
        sessionStorage.setItem('conditions',null)
        sessionStorage.setItem('isSelect',false)
        sessionStorage.setItem('isHistoryTime', false)
        // sessionStorage.setItem('tabArray',null)
        this.props.ws_saveGlobalData([],'ISCED_tabArray')
        this.props.ws_saveGlobalData({}, 'ISCED_detailCondition')
    }
    /**
     * 菜单打开项目
     * @param {*} openKeys 
     */
    onOpenChange(openKeys) {
        // console.log(openKeys);
        let latestOpenKey;
        openKeys.map(key => {
            if (this.state.openKeys.indexOf(key) === -1) {
                latestOpenKey = key;
            }
        });
        if (_.findIndex(this.menu, { key: latestOpenKey }) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    render() {
        let key = this.state.selectedKeys;
        let { menus } = this.state;
        let { parSel } = this.props;
        // console.log(parSel)
        return (
            <Menu
                mode="inline"
                // theme="dark"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.handleClick}
                selectedKeys={key || [menus[0].key]}
            >
                {
                    menus.map(item => {
                        return item.children && item.children.length
                            ? <SubMenu key={item.key} title={<span>{item.name}</span>}>
                                {
                                    item.children.map(list => {
                                        return <Menu.Item key={list.key} className="lxx-m-list">
                                            <NavLink to={`/home/${parSel}/${list.path}`}><SVG type={list.icon} />{list.name}</NavLink>
                                        </Menu.Item>

                                    })
                                }
                            </SubMenu>
                            : <Menu.Item key={item.key} className="lxx-m-item">
                                <NavLink to={`/home/${parSel}/${item.path}`}>{item.name}</NavLink>
                            </Menu.Item>

                    })
                }
            </Menu>
        );
    }
}

export default LeftMenu;
