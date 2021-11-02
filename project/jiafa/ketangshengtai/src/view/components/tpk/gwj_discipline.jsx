import React, { Component } from 'react'
import moment from 'moment'
import './../../../style/tpk/gwj_discipline.css'
import { G } from './../../../config/g';
import { IMG } from './../../components/tpk/base.jsx';
// import _x from './../../../../js/_x/index';
// const Format = _x.util.date.format;

export default class MyDiscipline extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    let { info } = this.props;
    // console.log(info, info.picturePath, info.pictures)
    let sumScore = 0, eventName = '', description = '';
    const style = {
      verticalAlign: "top",
      // width: "240px",
    }
    return (
      <div className="gwj-discipline-box">
        <div className="gwj-discipline">
          <div style={style} >
            <IMG height='110px'
              src={`${G.serverUrl}/pic/findById/${info.picturePath ? info.picturePath :
                // 管理员 - 听评课 - 教学反思 - 返回字段问题（单独处理）
                info && info.pictures && info.pictures.length ? info.pictures[0] : ''
                }`} />
          </div>
          <div>
            <div><span>发生事件：</span>
              {info.eventTypeList ? info.eventTypeList.length ?
                info.eventTypeList.map((item, index) => {
                  eventName += item.eventName + `${index + 1 === info.eventTypeList.length ? '' : '、'}`
                }) : null : null}
              <span>{eventName || '--'}</span>
            </div>
            <div><span>扣分：</span>
              {info.eventTypeList ? info.eventTypeList.length ? info.eventTypeList.map(item => {
                sumScore += item.deductScore;
              }) : null : null}
              <span>{sumScore || '--'}</span>
            </div>
            <div><span>备注：</span>
              <span style={{ wordBreak: "break-all" }}>{info.description ? info.description : ''}</span>
            </div>
            <div><span>记录人：</span><span>{info.recordUsername ||
              // 管理员 - 听评课 - 教学反思 - 返回字段问题（单独处理）
              info.name
              || '--'}</span><span>记录时间：</span><span>
                {moment(new Date(info.lastUpdateTime)).format('YYYY-MM-DD HH:mm:ss') || '--'}
                </span><span>类型：</span><span>{info.sourceType !== null ? info.sourceType == 1 ? '在线巡课'
                  : info.sourceType == 2 ? '人脸巡课' : '定时巡课' : '--'}</span></div>
          </div>
        </div>
      </div>
    );
  }
}