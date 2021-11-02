/*
 * @Author: lilu 
 * @Date: 2020-07-23 09:33:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 17:03:26
 */
import React, { useState, useEffect } from 'react';
import './../../../../style/ll-topShow.scss';
import SVG from './../../../public/svg'
import ColorsPieEcharts from './allotPie';
import TopShow from './topShow';
import ImpPie from '../../improve/impPie';
export default function SchTopShow(props) {

  return (
    <div className='kyl-topShow'>
      <div>
        <div className='kyl-topShow-title'><span>开课单位回复</span><span>（课程数）</span></div>
        <div className='kyl-schTopShow-box'>
          {
            props.type === '2' // 院级回复屏蔽异常情况课程数
              ? null
              : <div className='ll-topShow-bor'>
                <div className='ll-topShow-con'>
                  <SVG type={props.type === '2' ? 'yckc' : 'yujing'} />
                  <div className='ll-topShow-total'>
                    <div>{props.type === '2' ? (props.data.errorStateNum || 0) : (props.data.alertCourseNum || 0)}</div>
                    <div>{props.type === '2' ? '异常情况课程' : '预警课程数'}</div>
                  </div>
                </div>
              </div>
          }
          <div className='ll-topShow-bor'>
            <div className='ll-topShow-con'>
              <SVG type='zongshu' />
              <div className='ll-topShow-total'>
                <div>{props.type === '2' ? (props.data.replyNum || 0) : (props.data.allotCourseNum || 0)}</div>
                <div>{props.type === '2' ? '已回复课程' : '下发课程数'}</div>
              </div>
            </div>

          </div>
          <div className='ll-topShow-bor'>
            <div className='ll-topShow-con'>
              <SVG type={props.type === '2' ? 'whf' : 'jindu'} />
              <div className='ll-topShow-total'>
                <div>{props.type === '2' ? (props.data.expireReplyNum || 0) : (props.data.allotCourseProp || 0)} <span>{props.type === '1' ? '%' : ''}</span> </div>
                <div>{props.type === '2' ? '过期未回复课程' : '下发课程数占比'} </div>
              </div>
            </div>

          </div>
          {
            props.type === '2' ?
              <div className='ll-topShow-bor'>
                <div className='ll-topShow-con'>
                  <SVG type='sqwzc' />
                  <div className='ll-topShow-total'>
                    <div>{props.type === '2' ? (props.data.applyNorNum || 0) : (props.data.allotCourseProp || 0)} </div>
                    <div>{props.type === '2' ? '申请为正常课程' : '下发课程数占比'} </div>
                  </div>
                </div>
              </div> : null
          }
        </div>
      </div>
      <div>
        <div className='kyl-topShow-title'><span>校级回复</span><span>（课程数）</span></div>
        <div className='kyl-topShow-pie'>
          <div style={{ height: '100%' }}>
            {/* <ColorsPieEcharts
              title="课程"//title="人次" title="%"
              color={[
                "#5ab1ee",
                "#ff4c4c"
              ]}//每一个，对应scaleData对应下标的颜色
              radius={[27, 33]}
              type={3} //  1 2 不传type 3种样式
              scaleData={[props.data.allowApplyNum, props.data.noApplyNum]}
            /> */}
            <ImpPie data={{ noApplyNum: props.data.noApplyNum, allowApplyNum: props.data.allowApplyNum }} />
          </div>
          <div className='kyl-pie-label'>
            <div><span style={{ background: "#5ab1ee" }}></span><span> 同意申请 </span><span style={{ fontSize: 18 }}>{props.data.allowApplyNum || 0}</span></div>
            <div><span style={{ background: "#ff4c4c" }}></span><span> 不同意申请 </span><span style={{ fontSize: 18 }}>{props.data.noApplyNum || 0}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}