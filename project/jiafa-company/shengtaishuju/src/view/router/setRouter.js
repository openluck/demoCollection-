/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:44:51 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-02-07 00:37:11
 * 设置
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import SetPage from './../pages/set/setPage';
import Role from './../pages/set/role';
import Config from './../pages/set/config';
import MsgPage from './../pages/set/msgPage';

@withRouter
class SetRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        let t = _.find(G.ISCED_curRoleInfo.menuData, { key: 'ISCED06' })
        if (!this.redi) {
            if (t) {
                this.redi = t.children[0].path
            } else {
                this.redi = 'role';
            }
        }
    }
    render() {
        let root = this.props.match.url;
        return (
            <Switch>
                {/* 设置-角色权限 */}
                <Route path={root + '/role'} component={Role} />
                {/* 设置-角色分配 */}
                <Route path={root + '/config'} component={Config} />
                {/* 设置-功能设置 */}
                <Route path={root + '/sz'} component={SetPage} />
                {/* 设置-消息设置 */}
                <Route path={root + '/msg'} component={MsgPage} />
                
                {this.redi ? <Redirect to={root + `/${this.redi}`} /> : null}
            </Switch>
        );
    }
}

export default SetRouter;
