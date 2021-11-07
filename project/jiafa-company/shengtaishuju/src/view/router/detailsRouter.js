/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:26:32 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 13:39:43
 * 明细结果router 
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import OrdTeaDetail from './../pages/detail/ordTeaDetail';
import OrdClassRateDetail from "./../pages/detail/ordClassRateDetail";
import OrdSiteRateDetail from "./../pages/detail/ordSiteRateDetail";
import OrdSleepRateDetail from "./../pages/detail/ordSleepRateDetail";
import OrdBreachDetail from "./../pages/detail/ordBreachDetail";
import QuaCommDetail from "./../pages/detail/quaCommDetail";
import QuaAnalyDetail from "./../pages/detail/quaAnalyDetail";
import QuaBackDetail from "./../pages/detail/quaBackDetail";
import QuaCourseDetail from "./../pages/detail/quaCourseDetail";
import ResInfo from "./../pages/detail/resInfo";
import PlayPage from "./../pages/playPage";


@withRouter
class DetailsRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        let t = _.find(G.ISCED_curRoleInfo.menuData, { key: 'ISCED03' })
        if (!this.redi) {
            if (t && t.children[0]) {
                this.redi = t.children[0].children[0].path
            } else {
                this.redi = 'ordtea';
            }
        }
    }
    render() {
        let root = this.props.match.url;
        return (
            <Switch>
                <Route path={root + '/:pType/play/:claRoomId'} component={PlayPage} />
                {/* 明细结果-教师考勤明细 
                    type: 0: 考勤状态异常 1:正常 2:迟到 3:早退 4:缺勤 5:调换课  
                    sectionId:节次id
                    start: 开始时间
                    end: 结束时间
                    colId: 学院id
                    teaId: 教师id
                    courId：课程id
                    semId:学期id
                    couTypeId:课程类别id
                */}
                <Route path={root + '/ordtea/:type/:sectionId/:start?/:end?/:colId?/:teaId?/:courId?/:semId?/:couTypeId?'} component={OrdTeaDetail} />
                <Route path={root + '/ordtea'} component={OrdTeaDetail} />
                {/* 明细结果-到课率明细 
                    max:到课率最大值 
                    min:到课率最小值 
                    sectionId:节次id
                    start: 开始时间
                    end: 结束时间
                    colId: 学院id
                    teaId: 教师id
                    courId：课程id
                    semId:学期id
                    couTypeId:课程类别id
                */}
                <Route path={root + '/ordclass/:max/:min/:sectionId/:start?/:end?/:colId?/:teaId?/:courId?/:semId?/:couTypeId?'} component={OrdClassRateDetail} />
                <Route path={root + '/ordclass'} component={OrdClassRateDetail} />
                {/* 明细结果-前排就座率明细 
                    max:前排就座率最大值 
                    min:到课率最小值 
                    sectionId:节次id
                    start: 开始时间
                    end: 结束时间
                    colId: 学院id
                    teaId: 教师id
                    courId：课程id
                    semId:学期id
                    couTypeId:课程类别id
                */}
                <Route path={root + '/ordsit/:max/:sectionId/:min?/:start?/:end?/:colId?/:teaId?/:courId?/:semId?/:couTypeId?'} component={OrdSiteRateDetail} />
                <Route path={root + '/ordsit'} component={OrdSiteRateDetail} />
                {/* 明细结果-低头率明细 
                    min:低头率最小值 
                    max:前排就座率最大值
                    sectionId:节次id
                    start: 开始时间
                    end: 结束时间
                    colId: 学院id
                    teaId: 教师id
                    courId：课程id
                    semId:学期id
                    couTypeId:课程类别id
                */}
                <Route path={root + '/ordsle/:min/:sectionId/:max?/:start?/:end?/:colId?/:teaId?/:courId?/:semId?/:couTypeId?'} component={OrdSleepRateDetail} />
                <Route path={root + '/ordsle'} component={OrdSleepRateDetail} />
                {/* 明细结果-课堂违纪明细 
                    sectionId:节次id
                    start: 开始时间
                    end: 结束时间
                    colId: 学院id
                    teaId: 教师id
                    courId：课程id
                    type: 违纪时间类型
                    semId:学期id
                    couTypeId:课程类别id
                */}
                <Route path={root + '/ordbre/:sectionId?/:start?/:end?/:colId?/:teaId?/:courId?/:type?/:semId?/:couTypeId?'} component={OrdBreachDetail} />
                {/* 明细结果-听评课明细 */}
                <Route path={root + '/quacomm'} component={QuaCommDetail} />
                {/* 明细结果-教学分析明细  clsType:课堂类型  1练习型 2对话型 3混合型 4讲授型 sectionId:节次id*/}
                <Route path={root + '/quaanaly/:clsType/:sectionId'} component={QuaAnalyDetail} />
                {/* 明细结果-教学分析明细 */}
                <Route path={root + '/quaanaly'} component={QuaAnalyDetail} />
                {/* 明细结果-学生听讲反馈明细 */}
                <Route path={root + '/quaback'} component={QuaBackDetail} />
                {/* 明细结果-课堂互动明细 */}
                <Route path={root + '/quacour'} component={QuaCourseDetail} />
                {/* 明细结果-多媒体使用 */}
                <Route path={root + '/info'} component={ResInfo} />

                


                {this.redi ? <Redirect to={root + `/${this.redi}`} /> : null}
            </Switch>
        );
    }
}

export default DetailsRouter;
