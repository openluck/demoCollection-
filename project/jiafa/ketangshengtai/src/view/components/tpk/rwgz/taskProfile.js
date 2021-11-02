import React, { Component } from 'react'
import OverviewContainer from './overviewContainer';
import CommonPie from './../../yrj_CommonPie';
import SVG from "./../../../public/public-component-svg";

export default class TaskProfile extends Component {
  render() {
    const { overViewData } = this.props;
    return (
      <OverviewContainer
        width={`50%`}
        height="250px"
        title="任务概况"
      >
        <div className="yh-overview-info clearfix">
          <div className='mj-tp-con'>
            {/* line */}
            <div className='mj-tp-lineOne'>
              <div className='mj-tp-num'>
                <span>{overViewData && overViewData.task || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>任务总数</div>
            </div>
            <span className='mj-tp-line'></span>
            {/* line */}
            <div className='mj-tp-lineOne'>
              <div className='mj-tp-num'>
                <span>{overViewData && overViewData.evaluate || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>评课人数</div>
            </div>
            <span className='mj-tp-line'></span>
            {/* line */}
            <div className='mj-tp-lineOne'>
              <div className='mj-tp-num'>
                <span>{overViewData && overViewData.leader || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>领导任务</div>
            </div>

            {/* line */}
            <div className='mj-tp-lineOne' style={{ marginTop: 30 }}>
              <div className='mj-tp-num'>
                <span>{overViewData && overViewData.supervise || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>督导任务</div>
            </div>
            <span className='mj-tp-line'></span>
            {/* line */}
            <div className='mj-tp-lineOne' style={{ marginTop: 30, width: '66%' }}>
              <div className='mj-tp-num'>
                <span>{overViewData && overViewData.substrate || 0}</span>
                <span>个</span>
              </div>
              <div className='mj-tp-numTitle'>基层教学负责人及同行任务</div>
            </div>
          </div>


          {/* <div className="yh-overview-pie" style={{ width: 135, height: 135 }}>
            <CommonPie
              radius={['60%', '80%']}
              center={["50%", "50%"]}
              color={["#fc8d91", "#fbc378"]}
              data={overViewData && overViewData.rate || 0}
              total={overViewData && overViewData.task || 0}
              percent={false}
              title='任务总数'
            />
          </div>
          <div className="yh-task-type">
            <p><span className="yh-dot yh-color-pink"></span> 领导任务<span>{overViewData && overViewData.leader || 0}</span>条</p>
            <p><span className="yh-dot yh-color-orange"></span> 督导任务<span>{overViewData && overViewData.supervise || 0}</span>条</p>
          </div>
          <div className="yh-task-type">
            <p><span><SVG type="rs" title="评课人数" /></span> 评课人数<span>{overViewData && overViewData.evaluate || 0}</span>人</p>
          </div> */}
        </div>
      </OverviewContainer>
    )
  }
}
