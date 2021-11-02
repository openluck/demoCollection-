import React, { Component } from 'react'
import OverviewContainer from './overviewContainer';
import OverviewProgress from './overviewProgress';
import CommonPie from './../../yrj_CommonPie'

export default class TaskProgress extends Component {
  render() {
    const { progressData } = this.props;
    return (
      <OverviewContainer
        width="100%"
        height="240px"
        title="任务进度"
      >
        <div className="yh-progress-wrap">
          <div className="yh-progress-info clearfix">
            <div className="yh-progress-item">
              <div className='mj-tp-title'>任务总进度</div>
              <div className="yh-item-data">
                <CommonPie
                  radius={['65%', '80%']}
                  center={["50%", "50%"]}
                  color={["#47cca9", "#edeef2"]}
                  // data={20}
                  data={progressData.task && progressData.task.rate ? progressData.task.rate : 0}
                  title='完成率'
                />
              </div>
              <div className="yh-item-label">
                <p>
                  <span>{`${progressData.task && progressData.task.complete ? progressData.task.complete : 0}`}</span>
                  <span>{`/${progressData.task && progressData.task.total ? progressData.task.total : 0}`}</span>
                </p>
                <p>已完成/总数</p>
              </div>
            </div>

            <div className="yh-progress-item">
              <div className='mj-tp-title'>领导任务进度</div>
              <div className="yh-item-data">
                <CommonPie
                  radius={['65%', '80%']}
                  center={["50%", "50%"]}
                  color={["#47cca9", "#edeef2"]}
                  data={progressData.leader && progressData.leader.rate ? progressData.leader.rate : 0}
                  title='完成率'
                />
              </div>
              <div className="yh-item-label">
                <p>
                  <span>{`${progressData.leader && progressData.leader.complete ? progressData.leader.complete : 0}`}</span>
                  <span>{`/${progressData.leader && progressData.leader.total ? progressData.leader.total : 0}`}</span>
                </p>
                <p>已完成/总数</p>
              </div>
            </div>

            <div className="yh-progress-item">
              <div className='mj-tp-title'>督导任务进度</div>
              <div className="yh-item-data">
                <CommonPie
                  radius={['65%', '80%']}
                  center={["50%", "50%"]}
                  color={["#47cca9", "#edeef2"]}
                  data={progressData.supervise && progressData.supervise.rate ? progressData.supervise.rate : 0}
                  title='完成率'
                />
              </div>
              <div className="yh-item-label">
                <p>
                  <span>{`${progressData.supervise && progressData.supervise.complete ? progressData.supervise.complete : 0}`}</span>
                  <span>{`/${progressData.supervise && progressData.supervise.total ? progressData.supervise.total : 0}`}</span>
                </p>
                <p>已完成/总数</p>
              </div>
            </div>

            <div className="yh-progress-item">
              <div className='mj-tp-title'>基层教学负责人及同行任务进度</div>
              <div className="yh-item-data">
                <CommonPie
                  radius={['65%', '80%']}
                  center={["50%", "50%"]}
                  color={["#47cca9", "#edeef2"]}
                  data={progressData.substrate && progressData.substrate.rate ? progressData.substrate.rate : 0}
                  title='完成率'
                />
              </div>
              <div className="yh-item-label">
                <p>
                  <span>{`${progressData.substrate && progressData.substrate.complete ? progressData.substrate.complete : 0}`}</span>
                  <span>{`/${progressData.substrate && progressData.substrate.total ? progressData.substrate.total : 0}`}</span>
                </p>
                <p>已完成/总数</p>
              </div>
            </div>
          </div>
        </div>
      </OverviewContainer>
    )
  }
}
