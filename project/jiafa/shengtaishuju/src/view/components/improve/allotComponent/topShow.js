/*
 * @Author: lilu 
 * @Date: 2020-07-23 09:33:48 
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-08 10:30:31
 */
import React, { useState, useEffect } from 'react';
import './../../../../style/ll-topShow.scss';
import SVG from './../../../public/svg'
export default function TopShow(props) {

    return (
        <div className='ll-topShow'>
            <div className='ll-topShow-bor'>
                <div className='ll-topShow-con'>
                    <SVG type={props.type === '2' ? 'yckc' : 'yujing'} />
                    <div className='ll-topShow-total'>
                        <div>{props.type === '2' ? (props.data.errorStateNum || 0) : (props.data.alertCourseNum || 0)}</div>
                        <div>{props.type === '2' ? '异常情况课程' : '预警课程数'}</div>
                    </div>
                </div>

            </div>
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
    )
}