import React, { Component } from 'react'
import SVG from '../../../public/svg';
import '../../../../style/tea_than_comp.scss';
import ColorsPieEcharts from '../public/ColorsPieEcharts';

export default class Tea_than_comp extends Component {
  render() {
    let { type, cond, data } = this.props;
    let dklRate = '--'
    if (G.ISCED_setInfo) {
      let $cond = String(cond)
      switch ($cond) {
        case '1':
          dklRate = G.ISCED_setInfo.attenRaleUnder || '--'
          break;
        case '2':
          dklRate = G.ISCED_setInfo.seatedRateUnder || '--'
          break;
        case '3':
          dklRate = G.ISCED_setInfo.sleepRateOver || '--'
          break;
      }
    }
    // console.log(data)
    let titleName = cond === 1 ? '到课率' : cond === 2 ? '前排就座率' : cond === 3 ? '低头率' : '违纪课堂'
    return (
      <div>
        {
          type === '3' ?
            <div className='kyl-ttc-leftInfo'>
              <div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: "26px",
                    fontWeight: "500",
                    color: "#ff4c4c",
                    marginRight:3
                  }}>{data && data.abnormalHour || 0}</span>
                  <span>课程</span>
                </div>
                <p className='kyl-ttc-rateWord' style={{fontSize: 17}}>{titleName}{cond === 4 ? '共计' : cond === 3 ? `高于${dklRate}%共计` : `低于${dklRate}%共计`}</p>
              </div>
            </div>
            :
            <div className='kyl-ttc-leftInfo' style={{ marginTop: type === '2' ? '80px' : '' }}>
              <div>
                <p className='kyl-ttc-rate'>{data && data.normalProp || 0}%</p>
                <p className='kyl-ttc-rateWord'>{
                  cond === 1 ? '学生到课率' :
                    cond === 2 ? '前排就座率' :
                      cond === 3 ? '低头率' :
                        cond === 4 ? '违纪率' :
                          '正常率'
                }</p>
              </div>
              <div>
                <p className='kyl-ttc-rateWord kyl-ttc-rate-right'><span style={{
                  display: 'inline-block'
                }}>{data.checkProp && data.checkProp.name || '--'}&nbsp;&nbsp;&nbsp;</span>
                  {
                    data.checkProp && data.checkProp.sortType === '1' ? <SVG type="imgUp" /> :
                    data.checkProp && data.checkProp.sortType === '2' ? <SVG type="imgDown" /> : ""
                  }
                  {data.checkProp && data.checkProp.changeProp || 0}%</p>

              </div>
              {
                type === '2'||type === '1' ?
                  <div>
                    <p className='kyl-ttc-rate' style={{ color: '#313233' }}>{data.rank || '--'}</p>
                    <p className='kyl-ttc-rateWord'>院排名</p>
                  </div> : null
              }
            </div>
        }
        {
          type === '1' ?
            <div className='kyl-ttc-all'>考勤异常共计&nbsp;&nbsp;&nbsp;
            <span>{data && data.abnormalHour || 0}</span> <span>课程</span>
            </div> 
            : null
        }
      </div>
    )
  }
}
