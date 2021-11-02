/*
 * @Author: xq 
 * @Date: 2021-01-08 14:54:13 
 * @Last Modified by: xq
 * @Last Modified time: 2021-02-24 10:12:50
 * @desc 左侧菜单
 * @desc roleTypeFront '管理员 0'、'班主任 1'、'宿管 2'、'班主任&&宿管 3'
 */
import React, { useEffect, useState } from "react";
import { withRouter, NavLink, useLocation } from "react-router-dom";
import { Menu } from "antd";
import SVG from "./../view/public/public-component-svg";
const { SubMenu } = Menu;

// 新菜单
const menuAll = [
    {
        title: "住宿管理",
        key: "room",
        iconName: "zu303",
        children: [
            {
                title: "配置向导",
                key: "configGuide",
                children:[]
            },
            {
                title: "学生入住管理",
                key: "studentCheckIn",
                children:[]
            },
            {
                title: "房间分配管理",
                key: "distributeManage",
                children:[]
            },
            {
                title: "房间规则设置",
                key: "rule",
                children:[]
            }
        ]
    },
    {
        title: "设备管理",
        key: "device",
        iconName: "shebeiguanli",
        children:[]
    },
    {
        title: "在寝管理",
        key: "dorm",
        iconName: "renyuanzu",
        children:[
            {
                title: "在寝统计",
                key: "count",
                children:[]
            },
            {
                title: "学生在寝明细",
                key: "studentDetail",
                children:[]
            },
            {
                title: "在寝计算规则",
                key: "dormRule",
                children:[]
            }
        ]
    }
]

// 新菜单-班主任/宿管员
const menu = [
    {
        title: "在寝管理",
        key: "dorm",
        iconName: "renyuanzu",
        children:[
            {
                title: "在寝统计",
                key: "count",
                children:[]
            },
            // {
            //     title: "学生在寝明细",
            //     key: "studentDetail",
            //     children:[]
            // }
        ]
    }
]

export default withRouter(props => {
    let {  roleTypeFront } = props;
    const location = useLocation();
    const [seleKey, setSeleKey] = useState('');

    /**
     * @desc 处理url切换
     */
    useEffect(() => {
        
        let pathnames = location.pathname;
        let pathArr = pathnames.substr(1).split('/');
        if(pathArr.length === 1){
            // 初始化
            switch(roleTypeFront){
                case '0':
                    setSeleKey('configGuide');
                    break;
                case '1':
                case '2':
                case '3':
                    setSeleKey('count');
                    break;
            }
        } else {
            // 非初始化
            if(pathArr[1] === 'device'){
                setSeleKey('device')
            } else {
                setSeleKey(pathArr[2]);
            }
        }
    }, [location])

    /**
     * @desc menu菜单渲染
     * @param {Array} list menuData
     */
    const menuRender = _list => {
        let list = roleTypeFront === '0' ? menuAll : menu;
        return list.map(item => {
            if (item.children.length) {
                return <SubMenu
                    key={item.key}
                    icon={
                        <SVG
                            type={item.iconName}
                            style={{
                                width: 15,
                                height: 15,
                                verticalAlign: "middle",
                                marginRight: 10,
                            }}
                        />
                    } 
                    title={item.title}
                >
                    {
                        item.children.map(it => {
                            let _url = '';
                            if(item.key === 'room' && it.key === 'rule'){
                                // 房间规则
                                _url = 'rule/studentRule';
                            } else if(item.key === 'dorm' && it.key === 'count'){
                                // 在寝统计
                                switch(roleTypeFront){
                                    case '0':
                                        _url = 'countOverview';
                                        break;
                                    case '1':
                                    case '3':
                                        _url = 'countClass';
                                        break;
                                    case '2':
                                        _url = 'countBuilding';
                                        break;
                                }
                                _url = 'count/' + _url;
                            } else {
                                _url = it.key;
                            }
                            return <Menu.Item key={it.key}>
                                <NavLink to={`/home/${item.key}/${_url}`}>
                                    {it.title}
                                </NavLink>
                            </Menu.Item>
                        })
                    }
                </SubMenu>
            } else {
                return <Menu.Item key={item.key}>
                    <NavLink to={`/home/${item.key}/${item.key}`}>
                        {
                            item.key === 'device'
                            ?<SVG
                                type={item.iconName}
                                style={{
                                    width: 15,
                                    height: 15,
                                    verticalAlign: "middle",
                                    marginRight: 10,
                                }}
                            />
                            :null
                        }
                        {item.title}
                    </NavLink>
                </Menu.Item>
            }
        })
    }

    return (
        <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={'configGuide'}
            selectedKeys={[seleKey]}
            defaultOpenKeys={['dorm','room']}
            style={{ height: '100%', borderRight: 0 }}
        >
            {
                menuRender(roleTypeFront)
            }
        </Menu>
    )
})

