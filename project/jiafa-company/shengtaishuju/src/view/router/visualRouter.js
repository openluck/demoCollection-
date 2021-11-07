/*
 * @Author: lxx 
 * @Date: 2020-01-22 15:00:21 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-01-22 15:45:42
 * 可视化页面路由
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import ResourceInfo from "./../pages/visual/resourceInfo";
import TeachingQua from "./../pages/visual/teachingQua";
import TeachingOrder from "./../pages/visual/teachingOrder";
// import TeachingOrderClass from "./../pages/visual/teachingOrderClass";

@withRouter
class VisualRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        let t = _.find(G.ISCED_curRoleInfo.menuData, { key: 'ISCED00' })
        if (!this.redi) {
            if (t) {
                this.redi = t.children[0].path
            } else {
                this.redi = 'order';
            }
        }
    }
    render() {
        let root = this.props.match.url;
        return (
            <Switch>
                {/* 教学秩序 */}
                <Route path={root + '/order'} component={TeachingOrder} />
                {/* 教学质量 */}
                <Route path={root + '/quality'} component={TeachingQua} />
                {/* 资源情况 */}
                <Route path={root + '/info'} component={ResourceInfo} />
                
                {this.redi ? <Redirect to={root + `/${this.redi}`} /> : null}
            </Switch>
        );
    }
}

export default VisualRouter;
