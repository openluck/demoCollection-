/*
 * @Author: lxx 
 * @Date: 2020-01-22 16:54:03 
 * @Last Modified by: tj
 * @Last Modified time: 2020-08-03 15:30:59
 * 报表统计路由
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import OrderCourseData from './../pages/data/orderCourseData';
import OrderTeaData from "./../pages/data/orderTeaData";
import QuaCourseData from "./../pages/data/quaCourseData";
import QuaTeaData from "./../pages/data/quaTeaData";
import ResClassData from "./../pages/data/resClassData";
import ResTeaData from "./../pages/data/resTeaData";
import PlayPage from './../pages/playPage'

@withRouter
class DataRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        let t = _.find(G.ISCED_curRoleInfo.menuData, { key: 'ISCED02' })
        if (!this.redi) {
            if (t) {
                this.redi = t.children[0].children[0].path
            } else {
                this.redi = 'ordcour';
            }
        }
    }
    render() {
        let root = this.props.match.url;
        // console.log(root)
        return (
            <Switch>
                <Route path={root + '/:pType/:claRoomId'} component={PlayPage} />
                {/* 教学秩序-课程统计 */}
                <Route path={root + '/ordcour'} component={OrderCourseData} />
                {/* 教学秩序-教师统计 */}
                <Route path={root + '/ordtea'} component={OrderTeaData} />
                {/* 教学质量-课程统计 */}
                <Route path={root + '/quacour'} component={QuaCourseData} />
                {/* 教学质量-教师统计 */}
                <Route path={root + '/quatea'} component={QuaTeaData} />
                {/* 资源情况-教室统计 */}
                <Route path={root + '/resclass'} component={ResClassData} />
                {/* 资源情况-教师统计 */}
                <Route path={root + '/restea'} component={ResTeaData} />

                {this.redi ? <Redirect to={root + `/${this.redi}`} /> : null}
            </Switch>
        );
    }
}

export default DataRouter;
