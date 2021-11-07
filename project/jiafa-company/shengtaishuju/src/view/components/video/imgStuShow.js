/*
 * @Author: lxx 
 * @Date: 2021-03-19 13:02:18 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 15:15:57
 * 学生图片信息展示 
 * data 图片数据（Object） 
 */

import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, Col, Row } from 'antd'
import SVG from '../../public/svg'
import { IMG } from '../../public/imgPub';
import G from '../../../config/g';
import NoDataAndLoading from '../image/public/noDataAndLoading';
import { func } from 'prop-types';

const ImgStuShow = (props) => {
    const [attImg, setAttImg] = useState({ num: null, max: null, min: null }) // 学生到课情况
    const [seatImg, setSeatImg] = useState({ num: null, max: null, min: null }) // 学生前排就坐情况
    const [sleepImg, setSleepImg] = useState({ num: null, max: null }) // 学生低头情况
    const [boxObj, setBoxObj] = useState({ width: 170, height: 125 }) // 学生低头情况
    const boxRef = useRef(null)

    useEffect(() => {
        changeViewBox()
        // 监听窗口变化，修改视频占比
        window.addEventListener("resize", changeViewBox, false);
        return () => {
            window.removeEventListener('resize', changeViewBox)
        }
    }, [])

    useEffect(() => {
        getImgData(props.data)
    }, [props.data])

    /**
     * 计算自适应
     */
    function changeViewBox() {

        if (boxRef && boxRef.current) {
            let parw = boxRef.current.clientWidth;
            let wd = parw / 2 - 8
            let ht = wd * (9 / 19)
            console.log('boxRef', { height: ht, width: wd })
            setBoxObj({ height: ht, width: wd })
        }
    }

    /**
     * 处理学生图片
     * @param {*} data 
     */
    function getImgData(data) {
        let { stuOnAttInfo, frontSeatInfo, sleepInfo } = data
        if (stuOnAttInfo && stuOnAttInfo.imgs) {
            // 处理学生到课情况
            let len = stuOnAttInfo.imgs.length
            setAttImg({
                num: stuOnAttInfo.planNum,
                max: len ? stuOnAttInfo.imgs[0] : null,
                min: len > 1 ? stuOnAttInfo.imgs[len - 1] : null
            })
        }
        if (frontSeatInfo && frontSeatInfo.imgs) {
            // 处理学生前排就坐情况
            let len = frontSeatInfo.imgs.length
            setSeatImg({
                num: frontSeatInfo.planNum,
                max: len ? frontSeatInfo.imgs[0] : null,
                min: len > 1 ? frontSeatInfo.imgs[len - 1] : null
            })
        }
        if (sleepInfo && sleepInfo.length) {
            // 处理学生低头情况
            setSleepImg({
                num: sleepInfo[0].realNum,
                max: sleepInfo[0]
            })
        } else {
            setSleepImg({
                num: null,
                max: null
            })
        }
    }

    return <div className="lxx-g-sImg lxx-g-flex">
        <div className="lxx-sm-g-box" ref={boxRef}>
            <div className="lxx-g-flex" style={{ marginBottom: 10 }}>
                <span className="lxx-m-flex" style={{ fontSize: 16 }}>学生到课情况</span>
                <span>应到人数：{(attImg.num || attImg.num === 0) ? attImg.num : '--'}</span>
            </div>
            <div className="lxx-g-flex" style={{ justifyContent: 'space-between' }}>
                <div className="lxx-b-g-img">
                    <div style={{ height: boxObj.height }}>
                        <IMG src={G.dataService + (attImg.max && attImg.max.imgUrl)} alt="picture" isEnlarge={true} />
                    </div>
                    <p>实到最大人数：{attImg.max && (attImg.max.num || attImg.max.num === 0) ? attImg.max.num : '--'}</p>
                </div>
                <div className="lxx-b-g-img">
                    <div style={{ height: boxObj.height }}>
                        <IMG src={G.dataService + (attImg.min && attImg.min.imgUrl)} alt="picture" isEnlarge={true} />
                    </div>

                    <p>实到最小人数：{attImg.min && (attImg.min.num || attImg.min.num === 0) ? attImg.min.num : '--'}</p>
                </div>
            </div>

        </div>
        <div className="lxx-sm-g-box">
            <div className="lxx-g-flex" style={{ marginBottom: 10 }}>
                <span className="lxx-m-flex" style={{ fontSize: 16 }}>学生前排就坐情况</span>
                <span>前排座位数：{(seatImg.num || seatImg.num === 0) ? seatImg.num : '--'}</span>
            </div>
            <div className="lxx-g-flex" style={{ justifyContent: 'space-between' }}>
                <div className="lxx-b-g-img">
                    <div style={{ height: boxObj.height }}>
                        <IMG src={G.dataService + (seatImg.max && seatImg.max.imgUrl)} alt="picture" isEnlarge={true} />
                    </div>
                    <p>实坐最大人数：{seatImg.max && (seatImg.max.num || seatImg.max.num === 0) ? seatImg.max.num : '--'}</p>
                </div>
                <div className="lxx-b-g-img">
                    <div style={{ height: boxObj.height }}>
                        {console.log('11111', G.dataService + (seatImg.min && seatImg.min.imgUrl))}
                        <IMG src={G.dataService + (seatImg.min && seatImg.min.imgUrl)} alt="picture" isEnlarge={true} />
                    </div>
                    <p>实坐最小人数：{seatImg.min && (seatImg.min.num || seatImg.min.num === 0) ? seatImg.min.num : '--'}</p>
                </div>
            </div>
        </div>
        <div className="lxx-sm-g-box" style={{ width: '25%', marginRight: 0 }}>
            <div className="lxx-g-flex" style={{ marginBottom: 10 }}>
                <span className="lxx-m-flex" style={{ fontSize: 16 }}>学生低头情况</span>
                {
                    sleepImg.max && (sleepImg.max.num === 0 || !sleepImg.max.num)
                        ? null
                        : <span>此图实到人数：{(sleepImg.num || sleepImg.num === 0) ? sleepImg.num : '--'}</span>

                }
            </div>
            <div className="lxx-b-g-img" style={{ margin: '0 auto', width: '74.5%' }}>
                {
                    sleepImg.max && sleepImg.max.num !== 0
                        ? <>
                            <div style={{ height: boxObj.height }}>
                                <IMG src={G.dataService + (sleepImg.max && sleepImg.max.imgUrl)} alt="picture" isEnlarge={true} />
                            </div>
                            <p>低头趴桌子人数：{sleepImg.max && sleepImg.max.num || '--'}</p>
                        </>
                        : <>
                            <div className="lxx-b-m-normal" style={{ height: boxObj.height }}>
                                <SVG type="normal" height="44" width="44" />
                            </div>
                            <p>暂无低头趴桌子情况</p>
                        </>
                }
            </div>
        </div>
    </div>
}
export default ImgStuShow
