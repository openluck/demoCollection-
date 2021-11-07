/*
 * @Author: lxx 
 * @Date: 2020-01-22 16:02:18 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-24 16:58:07
 * 画像中心
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import CollegeImg from './../pages/image/collegeImg';
import CourseImg from "./../pages/image/courseImg";
import TeacherImg from "./../pages/image/teacherImg";
import OrganImg from "./../pages/image/organImg";
import G from './../../config/g'

@withRouter
class ImageRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        let t = _.find(G.ISCED_curRoleInfo.menuData, { key: 'ISCED01' })
        if (!this.redi) {
            if (t) {
                this.redi = t.children[0].path
            } else {
                this.redi = 'org';
            }
        }
    }
    render() {
        let root = this.props.match.url;
        // console.log(root)
        return (
            <Switch>
                {/* 学校画像 typeId: 锚点对应的配置id*/}
                <Route path={root + '/org/:typeId'} component={OrganImg} />
                <Route path={root + '/org'} component={OrganImg} />
                {/* 学院画像 collgeId:开课单位id */}
                <Route path={root + '/col/:collegeId'} component={CollegeImg} />
                <Route path={root + '/col'} component={CollegeImg} />
                {/* 课程画像 */}
                <Route path={root + '/cour'} component={CourseImg} />
                {/* 教师画像 teaId:教师id, collgeId:开课单位id*/}
                <Route path={root + '/tea/:teacherId/:collegeId'} component={TeacherImg} />
                <Route path={root + '/tea'} component={TeacherImg} />
                
                {this.redi ? <Redirect to={root + `/${this.redi}`} /> : null}
            </Switch>
        );
    }
}

export default ImageRouter;

