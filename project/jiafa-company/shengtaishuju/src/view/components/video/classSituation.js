/*
 * @Author: lilu 
 * @Date: 2020-07-29 10:05:14 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-02-09 10:01:05
 */

import React, { useState, useEffect } from 'react';
import './../../../style/ll_classSituation.scss'
import SVG from '../../public/svg';
import imgUrl from './../../../media/picture/tea_img.png';
import Circle from './circle';
import RateLineChart from './rateLineChart';
import { IMG } from './../../public/imgPub';
import NoDataAndLoading from './../image/public/noDataAndLoading';
import G from './../../../config/g';

export default function ClassSituation(props) {
    let arr = [
        {
            title: '学生到课率',
            data: props.stuOnAttRate,
            color: '#59a6ee'
        },
        {
            title: '前排就坐率',
            data: props.frontSeatRate,
            color: '#14cc8f'
        },
        {
            title: '低头率',
            data: props.sleepRate,
            color: '#ff9933'
        }]
    let check = props.detailsInfo.checkName;
    console.log(G.dataService+props.detailsInfo.imgAddress)
    return <div className='ll-calssSit'>
    {
        props.replyInfo?
        <div className='ll-cs-tea' style={{ height: 100 }}>
            <div className='ll-title'>回复意见</div>
            <div className='ll-cs-content' style={{ paddingTop: 15}}>
                {props.replyInfo || '暂无回复意见'}
            </div>
        </div>
        :null
    }
        
        <div className='ll-cs-tea'>
            <div className='ll-title'>教师考勤</div>
            <div className='ll-cs-content'>
                <div className='ll-content-bor'>
                    <div className={check === '1' ? 'll-bor-div ll-zc' : 'll-bor-div'} >
                        <div style={{height:'100%'}}>
                        {
                            check==='1'||check==='2'||check==='3'||check==='4'||check==='5'||check==='6'||check==='7'?
                            check==='7'?
                            <>
                            <img  src={require('./../../../media/picture/cd.png')} style={{marginRight: 10}}/>
                            <img  src={require('./../../../media/picture/zt.png')}/>
                            </>:
                            <img  src={
                                check==='1'?require('./../../../media/picture/zc.png'):
                                check==='2'?require('./../../../media/picture/cd.png'):
                                check==='3'?require('./../../../media/picture/zt.png'):
                                check==='4'?require('./../../../media/picture/qq.png'):
                                check==='5'?require('./../../../media/picture/dhk.png'):
                                require('./../../../media/picture/qj.png')
                            }/>: <NoDataAndLoading loading={false} />
                        }
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='ll-cs-tea' style={{ marginBottom: 0 }}>
            <div className='ll-title'>学生到课率/前排就坐率/低头率</div>
            <div className='ll-total-content'>
                <div className='ll-total-bor'>
                    {
                        props.loading ?
                            <NoDataAndLoading loading={true} />
                            :
                            arr.map((value, key) => {
                                return <div style={{ width: '33%', height: '100%', display: 'inline-block' }} key={key}>
                                    <Circle title={value.title} data={value.data} color={value.color} />
                                </div>
                            })
                    }

                </div>
                <div className='ll-total-bor'>
                    {
                        props.loading ?
                            <NoDataAndLoading loading={true} /> :
                            props.identifyResults.length ?
                                <RateLineChart data={props.identifyResults} />
                                :
                                <NoDataAndLoading loading={false} />}

                </div>
            </div>
        </div>

    </div>

}

