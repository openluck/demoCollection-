import React, { Component } from 'react'
import SVG from '../../../public/svg';

export default class Kthd_comp extends Component {
  render() {
    let { cond, data } = this.props;
    return (
      <div>
        <div className='kyl-ttc-leftInfo' >
          <div>
            <p>平均<span className='kyl-ttc-rate' style={{ color: '#313233' }}>{data && data.normalProp || 0}</span><span>次/课程</span> </p>
            <p className='kyl-ttc-rateWord'>{
              cond === 1 ? '学生起立' : '教师走下讲台'}</p>
          </div>
          <div>
            <p className='kyl-ttc-rateWord kyl-ttc-rate-right'><span style={{
              display: 'inline-block'
            }}>{data && data.checkProp.name}&nbsp;&nbsp;&nbsp;</span>
              {
                data && data.checkProp.sortType !== '0'
                  ? <SVG type={data && data.checkProp.sortType === '1' ? 'imgUp' : 'imgDown'}></SVG>
                  : null
              }
              {data && data.checkProp.changeProp!==null?data.checkProp.changeProp:'--'}%</p>
            {/* <p className='kyl-ttc-rateWord kyl-ttc-rate-right'><span style={{
                display: 'inline-block', width: '80px'
              }}>较上周同期</span> <SVG type={'imgUp'}></SVG> 5%</p>
              <p className='kyl-ttc-rateWord kyl-ttc-rate-right'><span style={{
                display: 'inline-block', width: '80px'
              }}>较上月</span> <SVG type={'imgUp'}></SVG> 8%</p> */}
          </div>
        </div>
      </div>
    )
  }
}
