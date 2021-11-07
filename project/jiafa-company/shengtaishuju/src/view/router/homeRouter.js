/*
 * @Author: lxx 
 * @Date: 2020-01-22 14:08:45 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-07-28 14:38:03
 * 除可视化的二级菜单页面
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import ImageRouter from './imageRouter'
import DataRouter from './dataRouter'
import ReportRouter from './reportRouter'
import DetailsRouter from './detailsRouter'
import SetRouter from './setRouter'
import ImproveRouter from './improveRouter'
// import PlayPage from './../pages/playPage'

@withRouter
class HomeRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        let root = this.props.match.url;
        return (
            <Switch>
                {/* 画像中心 */}
                <Route path={root + '/img'} component={ImageRouter} />
                {/* 报表统计 */}
                <Route path={root + '/data'} component={DataRouter} />
                {/* 明细结果 */}
                <Route path={root + '/det'} component={DetailsRouter} />
                {/* 报告中心 */}
                <Route path={root + '/rep'} component={ReportRouter} />
                 {/* 教学改进 */}
                <Route path={root + '/imp'} component={ImproveRouter} />
                {/* 设置 */}
                <Route path={root + '/set'} component={SetRouter} />
                {/* 课堂播放 courseId:课堂id */}
                {/* <Route path={root + '/play/:courseId'} component={PlayPage} /> */}

                <Redirect to={root + `/${this.props.firSel || 'img'}`} /> 
            </Switch>
        );
    }
}

export default HomeRouter;