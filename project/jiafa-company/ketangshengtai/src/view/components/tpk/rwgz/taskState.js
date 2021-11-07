import React, { Component } from 'react'
import OverviewContainer from './overviewContainer';
import CommonPie from './../../yrj_CommonPie';
import SVG from "./../../../public/public-component-svg";
export default class TaskState extends Component {
  render() {
    const { stateData } = this.props;
    return (
      <OverviewContainer
        width={`50%`}
        height="250px"
        title="任务状态"
        style={{ paddingLeft: 10 }}
      >
        <div className="yh-overview-info clearfix">
          <div className='mj-tp-con'>
            {/* line */}
            <div className='mj-tp-lineOne'>
              <div className='mj-tp-num'>
                <span>{stateData && stateData.task || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>进行中任务</div>
            </div>
            <span className='mj-tp-line'></span>
            {/* line */}
            <div className='mj-tp-lineOne'>
              <div className='mj-tp-num'>
                <span>{stateData && stateData.leader || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>进行中领导任务</div>
            </div>
            <span className='mj-tp-line'></span>
            {/* line */}
            <div className='mj-tp-lineOne'>
              <div className='mj-tp-num'>
                <span>{stateData && stateData.supervise || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>进行中督导任务</div>
            </div>

            {/* line */}
            <div className='mj-tp-lineOne' style={{ marginTop: 30 }}>
              <div className='mj-tp-num'>
                <span>{stateData && stateData.over || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>已结束</div>
            </div>
            <span className='mj-tp-line'></span>
            {/* line */}
            <div className='mj-tp-lineOne' style={{ marginTop: 30, width: '66%' }}>
              <div className='mj-tp-num'>
                <span>{stateData && stateData.substrate || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>进行中基层教学负责人及同行任务</div>
            </div>
          </div>


          {/* <div className="yh-overview-pie" style={{ width: 135, height: 135 }}>
            <CommonPie
              radius={['60%', '80%']}
              center={["50%", "50%"]}
              color={["#fc8d91", "#fbc378"]}
              data={stateData && stateData.rate || 0}
              total={stateData && stateData.task || 0}
              title='进行中任务'
            />
          </div>
          <div className="yh-task-type">
            <p><span className="yh-dot yh-color-pink"></span> 进行中领导任务<span>{stateData && stateData.leader || 0}</span>条</p>
            <p><span className="yh-dot yh-color-orange"></span> 进行中督导任务<span>{stateData && stateData.supervise || 0}</span>条</p>
          </div>
          <div className="yh-task-type">
            <p><span><SVG type="yjs" title="已结束" /></span> 已结束<span>{stateData && stateData.over || 0}</span>条</p>
          </div> */}
        </div>
      </OverviewContainer>
    )
  }
}
