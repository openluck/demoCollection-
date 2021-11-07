/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:11:02 
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-22 16:02:36
 * 报告中心
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import SysReport from './../pages/report/sysReport';
import CusReport from './../pages/report/cusReport';
import MasterReport from './../pages/report/masterReport';
@withRouter
class ReportRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        let t = _.find(G.ISCED_curRoleInfo.menuData, { key: 'ISCED04' })
        if (!this.redi) {
            if (t) {
                this.redi = t.children[0].path
            } else {
                this.redi = 'sysrep';
            }
        }
    }
    render() {
        let root = this.props.match.url;
        return (
            <Switch>
                {/* 报告中心-系统报告 */}
                <Route path={root + '/sysrep'} component={SysReport} />
                {/* 报告中心-自定义报告 */}
                <Route path={root + '/custom'} component={CusReport} />
                {/* 报告中心-校长报告 */}
                <Route path={root + '/master'} component={MasterReport} />
                {this.redi ? <Redirect to={root + `/${this.redi}`} /> : null}
            </Switch>
        );
    }
}

export default ReportRouter;
