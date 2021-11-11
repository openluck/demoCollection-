/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-09 14:42:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-09 16:22:06
 */
/**
 * 
 * 路由核心页面
 */
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Index from '../pages/index/index' // 欢迎页面
import Home from '../pages/home/home' // layout页面

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/home" component={Home} />
        </Switch>
    </HashRouter>
);


export default BasicRoute;