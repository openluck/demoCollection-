/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-08 15:44:18
 */

/**
 * @description 教室情况组件
 */
import React, { Fragment as F, useState, useEffect } from "react";
import SVG from './../../../public/svg.js';
import NoDataAndLoading from './../public/noDataAndLoading';
import { message } from "antd";
import { getSchRoomSituation } from './../../../../request/lj_scl_image_request';
export default function Tjfk(props) {
    //教室使用情况数据
    const [jssyData, setJssyData] = useState({});

    //教室使用情况loading
    const [jssyLoading, setJssyLoading] = useState(true);
    
    useEffect(() => {
        getSchRoomSituationa();
      }, [props.params])

    const getSchRoomSituationa = () => {
        let params = {
            ...props.params
        }
        setJssyLoading(true);
        getSchRoomSituation(params).then((res) => {
            setJssyLoading(false);
            if (res.data.result) {
                setJssyData(res.data.data);
            } else {
                message.error(res.data.message)
            }
        })
    }
    return (
        <div className="image_public jsqk">
            {
                !jssyLoading && jssyData ?
                <div className='jsqk_con'>
                <div>
                    <div><SVG type={'classroom'} /><span>教室开课率</span></div>
                    <div>
                        <div>
                            <p>{(jssyData && jssyData.aiKk) || jssyData.aiKk == 0 ? (jssyData.aiKk).toFixed(2) : '--'}%</p>
                            <p>AI录播教室</p>
                        </div>
                        <div>
                            <p>{(jssyData && jssyData.xcKk) || jssyData.xcKk == 0 ? (jssyData.xcKk).toFixed(2) : '--'}%</p>
                            <p>标考录播教室</p>
                        </div>
                        <div>
                            <p>{(jssyData && jssyData.lbKk) || jssyData.lbKk == 0 ? (jssyData.lbKk).toFixed(2) : '--'}%</p>
                            <p>常态录播教室</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div><SVG type={'classroom'} /><span>教室有效利用率</span></div>
                    <div>
                        <div>
                            <p>{(jssyData && jssyData.aiLy) || jssyData.aiLy == 0 ? (jssyData.aiLy).toFixed(2) : '--'}%</p>
                            <p>AI录播教室</p>
                        </div>
                        <div>
                            <p>{(jssyData && jssyData.xcLy) || jssyData.xcLy == 0 ? (jssyData.xcLy).toFixed(2) : '--'}%</p>
                            <p>标考录播教室</p>
                        </div>
                        <div>
                            <p>{(jssyData && jssyData.lbLy) || jssyData.lbLy == 0 ? (jssyData.lbLy).toFixed(2) : '--'}%</p>
                            <p>常态录播教室</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div><SVG type={'classroom'} /><span>教室闲时利用率</span></div>
                    <div>
                        <div>
                            <p>{(jssyData && jssyData.aiSy) || jssyData.aiSy == 0 ? (jssyData.aiSy).toFixed(2) : '--'}%</p>
                            <p>AI录播教室</p>
                        </div>
                        <div>
                            <p>{(jssyData && jssyData.xcSy) || jssyData.xcSy == 0 ? (jssyData.xcSy).toFixed(2) : '--'}%</p>
                            <p>标考录播教室</p>
                        </div>
                        <div>
                            <p>{(jssyData && jssyData.lbSy) || jssyData.lbSy == 0 ? (jssyData.lbSy).toFixed(2) : '--'}%</p>
                            <p>常态录播教室</p>
                        </div>
                    </div>
                </div>
                <p className='jsqk_bz'>【备注】教室开课率反应了教室的使用情况，计算方式为实际开课的课时数/教室可排课的课时数；教室有效利用率反应了上课期间，教室的利用情况，计算方式为到课的学生人数/座位数；教室闲时使用率反应了学生上自习的情况；计算方式为上自习的学生人数/座位数</p>
            </div>
            :
                <div style={{'height':'260px','width':'100%'}}>
                    <NoDataAndLoading loading={jssyLoading} />
                </div>
            
            }
            
        </div>
    );

}
