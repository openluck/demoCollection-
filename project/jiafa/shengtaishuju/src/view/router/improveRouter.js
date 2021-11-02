/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:11:02 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-01-14 10:36:46
 * 报告中心
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import ImproveTotal from '../pages/improve/total';
import Allot from './../pages/improve/allot';
import AllotDetails from './../components/improve/allotComponent/allotDetails'
import Handle from './../pages/improve/handle';
import Follow from './../pages/improve/follow';
import Reply from './../pages/improve/reply';
import FollowDetails from './../components/improve/follow/followDetails'
import PlayPage from './../pages/playPage'
@withRouter
class ImproveRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        let t = _.find(G.ISCED_curRoleInfo.menuData, { key: 'ISCED05' })
        if (!this.redi) {
            if (t) {
              this.redi = t.children[0].path
            } else {
                this.redi = 'total';
            }
        }
    }
    render() {
        let root = this.props.match.url;
        return (
            <Switch>
                {/* 首页 */}
                <Route path={root + '/total'} component={ImproveTotal} />

                {/* 问题下发 claRoomId：课堂id collegeId 学院id */}
                <Route path={root + '/allot/:collegeId/:claRoomId'} component={PlayPage} />
                <Route path={root + '/allot/:collegeId'} component={AllotDetails}/>
                <Route path={root + '/allot'} component={Allot} />              

                {/* 问题处理 claRoomId：课堂id */}
                <Route path={root + '/handle/:claRoomId'} component={PlayPage} />
                <Route path={root + '/handle'} component={Handle} />
                {/* 视频播放 id:学院id claRoomId：课堂id  */}
                <Route path={root + '/follow/:id/:claRoomId'} component={PlayPage} />
                {/* 问题跟踪 */}
                <Route path={root + '/follow/:id'} component={FollowDetails} />
                <Route path={root + '/follow'} component={Follow} />
                {/* 问题回复 */}
                <Route path={root + '/reply/:claRoomId'} component={PlayPage} />
                <Route path={root + '/reply'} component={Reply} />
                
                {this.redi ? <Redirect to={root + `/${this.redi}`} /> : null}
                {/* <Redirect to={root + '/total'} /> */}
            </Switch>
        );
    }
}

export default ImproveRouter;
