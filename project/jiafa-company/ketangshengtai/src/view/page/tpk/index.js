/*
 * @Author: MinJ
 * @Date: 2020-01-19 14:03:47
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-26 13:13:09
 * 听评课 V2.2
 */

import React, { Component } from 'react';
import { Route, Switch, Redirect, } from 'react-router-dom';
import { G } from './../../../config/g';

// import { TaskRoute, TaskFlow, EvaluOnline, EvaluRoute } from './../index';
import TaskRoute from './rwgl/taskRoute';
import TaskFlow from './rwgz/taskFlow';
import EvaluOnline from './zxpk/evaluOnline';
import EvaluRoute from './pksz/evaluRoute';
// import AddForm from './pksz/addForm';
import TpkVideo from './tpkVideo';

// tpk2.12
import { TpkTeaTask } from './jyrw/teachTask.jsx';
import TpkResearchPlanDetail from './jyrw/tpkResearchPlanDetail.jsx';
import TpkResearchLessonDetail from './jyrw/tpkResearchLessonDetail.jsx';
import TpkResearchersDetail from './jyrw/tpkResearchersDetail.jsx';
import TpkResearchBook from './jyrw/tpkResearchBook.jsx';

import { TpkTeaSetting } from './jysz/teachSetting.jsx';

import { SttTask } from './sttrw/sttTask.jsx';
import ListenNote from './../../components/tpk/listenNote.jsx';
import TpkManaOverListenerInfo from './sttrw/tpkManaOverListenerInfo.jsx';
import TpkManaLisInfo from './sttrw/tpkManaLisInfo.jsx';
import TpkManaDetListenerInfo from './sttrw/tpkManaDetListenerInfo.jsx';

import { SttSetting } from './sttsz/sttSetting.jsx';

import Admin_tplPlayer from './admin_tplPlayer.jsx';

import { MyTask } from './tea/myTask.jsx';
import TpkTeachTasksApplyListen from './tea/tpkTeachTasksApplyListen';
import TpkTeachTasksVerifyListen from './tea/tpkTeachTasksVerifyListen';

import { MyClass } from './tea/myClass.jsx';
import TpkTeachResearchComment from './tea/tpkTeachResearchComment';

import { MyListen } from './tea/myListen.jsx'; 
import TpkTeachListenComment from './tea/tpkTeachListenComment';

import TpkPlayer from './tpkPlayer'

class TpkIndexLatest extends Component {
  constructor() {
    super();
    this.findRedirect = this.findRedirect.bind(this);
  }
  /**
   * @desc  根据 modelConfig 找到第一个可展示的模块
   * @param { array } model  模块配置
   */
  findRedirect() {
    let model = _.find(G.modelConfig, { path: "tpk" });
    let FirstTarget = _.find(model.children, { display: true });
    // console.log(model, FirstTarget);
    if (FirstTarget && FirstTarget.length) {
      return <Redirect to={`/home/tpk/${FirstTarget.path}/${FirstTarget.children[0].path}`} />
    } else {
      return <Redirect to={`/home/tpk`} />
    }
  };
  render() {
    // console.log(G);
    return (
      <div style={{ height: '100%' }}>
        <Switch>
          {/* 教研任务 */}
          <Route exact path="/home/tpk/jyrw" component={TpkTeaTask} />
          <Route path="/home/tpk/jyrw/rePlanDe" component={TpkResearchPlanDetail} />
          <Route path="/home/tpk/jyrw/reLessonDe/:passData?" component={TpkResearchLessonDetail} />
          <Route path="/home/tpk/jyrw/rePerDe" component={TpkResearchersDetail} />
          <Route path='/home/tpk/jyrw/reBook/:teaId/:name' component={TpkResearchBook} />

          {/* 教研设置 */}
          <Route path="/home/tpk/jysz" component={TpkTeaSetting} />

          {/* 随堂听任务 */}
          <Route exact path="/home/tpk/sttrw" component={SttTask} />
          <Route exact path="/home/tpk/sttrw/ListenNote/:id:teaId/:name" component={ListenNote} />
          {/* 听课员详情 */}
          <Route path="/home/tpk/sttrw/TpkManaOverListenerInfo" component={TpkManaOverListenerInfo} />
          {/* 听课详情 id  teacher：老师姓名  teaId：老师id */}
          <Route path="/home/tpk/sttrw/TpkManaLisInfo/:id:teacher/:teaId" component={TpkManaLisInfo} />
          <Route path='/home/tpk/sttrw/TpkManaDetListenerInfo' component={TpkManaDetListenerInfo} />

          {/* 随堂听设置 */}
          <Route path="/home/tpk/sttsz" component={SttSetting} />

          {/* 我的任务 */}
          <Route exact path="/home/tpk/wdrw" component={MyTask} />
          <Route path="/home/tpk/wdrw/tpkTeachTasksApplyListen" component={TpkTeachTasksApplyListen} />
          <Route path="/home/tpk/wdrw/tpkTeachTasksVerifyListen" component={TpkTeachTasksVerifyListen} />

          {/* 我的教研课 */}
          <Route exact path="/home/tpk/wdjyk" component={MyClass} />
          <Route path="/home/tpk/wdjyk/tpkTeachResearchComment/:teacherId/:curriculumallId/:uid" component={TpkTeachResearchComment} />

          {/* 我的随堂听 */}
          <Route exact path="/home/tpk/wdsst" component={MyListen} />
          <Route path="/home/tpk/wdsst/tpkTeachListenComment/:teacherId/:curriculumallId/:uid" component={TpkTeachListenComment} />

          {/* 管理员 播放 */}
          <Route path="/home/tpk/video/:id/:type?" component={Admin_tplPlayer} />
          {/* 教师 播放页 type  1 我的教研课  2 我的随堂听  3教研评课  4随堂听课 */}
          <Route path={`/home/tpk/teaVideo/:id/:type`} component={TpkPlayer} />

          {/* 任务管理 */}
          {/* <Route path={`/home/tpk/rwgl`} component={TaskRoute} /> */}

          {/* 任务跟踪 */}
          {/* <Route path={`/home/tpk/rwgz`} component={TaskFlow} /> */}

          {/* 在线评课 */}
          {/* <Route path={`/home/tpk/zxpk`} component={EvaluOnline} /> */}

          {/* 评课设置 */}
          {/* <Route path={`/home/tpk/pksz`} component={EvaluRoute} /> */}

          {/* 播放页 id课程id   jobId任务id   perid人员id  classId课堂ID isEdit0不可编辑1查看 */}
          {/* <Route path={`/home/tpk/video/:id/:jobId/:perId/:classId/:isEdit?`} component={TpkVideo} /> */}

          {/* <Redirect to="/home/tpk/zxpk" /> */}
          {
            G.modelConfig && G.modelConfig.length
              ? this.findRedirect(G.modelConfig)
              : null
          }
        </Switch>
      </div>
    )
  }
}

export default TpkIndexLatest;
