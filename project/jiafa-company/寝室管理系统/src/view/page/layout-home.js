/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:47
 * @Last Modified by: xq
 * @Last Modified time: 2021-02-25 13:47:19
 * @desc roleTypeFront '管理员 0'、'班主任 1'、'宿管 2'、'班主任&&宿管 3'
 */

import React, { useEffect, useState } from "react";
import { withRouter,useLocation } from "react-router-dom";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import "./../../style/index.scss";
import { useSelector } from "react-redux";
import { Layout, Select  } from 'antd';

import { WithoutLayoutRouter } from './../router/router-home'
import CustomerMenu from './../../config/menu'

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const Home = withRouter(props => {
    const location = useLocation();
    const {
        history: { push },
    } = props;
    const userInfoStore = useSelector((state) => state.userInfo_reducer);

    /**
     * @desc 路由变更的处理
     */
    useEffect(()=>{
        let pathnames = location.pathname;
        let pathArr = pathnames.substr(1).split('/');
        let { roleTypeFront } = userInfoStore;

        if(pathArr.length === 1){
            // 初始化 - 管理员：重定向到配置向导
            // 初始化 - 非管理: 取角色类型，重定向路由
            switch (roleTypeFront){
                case '0':
                    push('/home/room/configGuide');
                    break;
                case '1':
                case '3':
                    push('/home/dorm/count/countClass');
                    break;
                case '2':
                    push('/home/dorm/count/countBuilding');
                    break;
            }
        } 
    },[])

    /**
     * @desc 退出当前系统
     */
    const signout = () => {
        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {  
            window.location.href="about:blank";  
            window.close();  
        } else {  
            window.opener = null;  
            window.open("", "_self").close();
        }  
    }
    
    return (
        <Layout className='xq-layout'>
            <Header className="xq-g-header xq-g-flex">
                <div className="xq-g-logo">
                    宿舍管理系统
                </div>
                <div className='xq-g-header-acount'>
                    <div className='xq-g-header-name'>
                        {
                            userInfoStore && userInfoStore.accPtname
                            ? userInfoStore.accPtname 
                            : '--'
                        }
                    </div>
                    <Select value='-1' style={{ width: 120 }} onChange={signout}>
                        <Option value="signout">退出系统</Option>
                    </Select>
                </div>

            </Header>
            <Layout style={{height:'calc(100% - 64px)'}}>
                <Sider width={235} className="xq-g-left-menu">
                    <CustomerMenu 
                        roleTypeFront={userInfoStore.roleTypeFront}
                    />
                </Sider>
                <Layout style={{ padding: 0 }}>
                    <Content className='xq-g-content'>
                        <PerfectScrollbar className='xq-g-scroll' id='scroll-content'>
                            <WithoutLayoutRouter />
                        </PerfectScrollbar>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
})

export default Home;
