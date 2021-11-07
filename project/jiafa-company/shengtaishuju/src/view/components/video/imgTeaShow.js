/*
 * @Author: lxx 
 * @Date: 2020-07-28 17:29:32 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-02-09 11:21:46
 * 课堂图片展示
 * name 展示名称（String）
 * data 图片数据（Array） 
 */
import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'antd'
import SVG from '../../public/svg'
import { IMG } from '../../public/imgPub';
import G from '../../../config/g';
import NoDataAndLoading from '../image/public/noDataAndLoading';

const ImgTeaShow = (props) => {
    // const [data, setData] = useState([]) // 图片数据
    const [saveData, setSaveData] = useState([]) // 存储图片数据
    const [dataIndex, setDataIndex] = useState(0) // 分页
    const [isUpdate, setIsUpdate] = useState(false) // 是否更新数据
    const [showData, setShowData] = useState([]) // 图片数据
    const [isHide, setIsHide] = useState(false) // 是否隐藏
    const [page, setPage] = useState(1) //加载页
    const [imgCount, setImgCount] = useState(0) // 每行条数
    const boxRef = useRef(null)

    useEffect(() => {
        // 初次加载，获取每行可显示图片数量
        getSizeNum()
        window.addEventListener("resize", () => getSizeNum(), false);
        return () => {
            window.removeEventListener('resize', () => getSizeNum())
        }
    }, [])

    useEffect(() => {
        // 更新数据
        if (isUpdate) {
            getShowData(dataIndex, page)
        } else {
            let data = props.data;
            getArrData(data, imgCount)
            setSaveData(data)
            setPage(1)
        }
    }, [props.data, isUpdate])

    useEffect(() => {
        // 监听每行数据
        getArrData(saveData, imgCount)
    }, [imgCount])

    /**
     * 计算考勤展示时间
     * @param {Number} timestamp 
     */
    function getTextTime(timestamp) {
        let reg = function (v) {
            if (v >= 10) {
                return v
            } else {
                return '0' + v
            }
        }
        if (timestamp && typeof timestamp == 'number') {
            let hour = new Date(timestamp).getHours()
            let min = new Date(timestamp).getMinutes()
            return reg(hour) + ':' + reg(min);
        } else {
            return timestamp;
        }

    }
    /**
     * 分割数组方法
     * @param {*} arr 需要分割的数组
     * @param {*} num  几个为一组
     */
    function spArr(arr, num) {
        let newArr = []
        for (let i = 0; i < arr.length;) {
            newArr.push(arr.slice(i, i += num));
        }
        return newArr
    }

    /**
     * 获取当前页面宽度下每行个数
     */
    function getSizeNum() {
        // 兼容页面宽度，改变每行条数，初次渲染减200
        let isHasNav = document.getElementsByClassName('ant-layout-sider') ? true : false
        let allWidth = document.body && document.body.clientWidth  ? document.body.clientWidth : 0
        let parw = boxRef && boxRef.current.clientWidth
        let num = 10; // 左侧菜单宽度
        if (isHasNav && (allWidth - parw) < 220) {
            num = 220
        }
        let wd = parw - num
        let sizNum = parseInt(wd / 172)
        // console.log('1111', parw, sizNum, imgCount)
        if (sizNum !== imgCount) {
            // 每行数据与当前每行数据不一致
            setImgCount(sizNum)
        }
    }

    /**
     * 处理分组数据
     * @param {Array} data 图片数据
     * @param {Number} size 每行可显示数据
     */
    function getArrData(data, size) {
        let teaData = []; let allData = [];
        data.forEach((item, index) => {
            let spliceArr = item.imgs.length ? spArr(item.imgs, size || imgCount) : [];
            teaData.push({
                name: item.name,
                time: getTextTime(item.time),
                spltImg: spliceArr.slice(0, 1),
                imgs: spliceArr.length ? spliceArr.slice(0, 1).toString().split(',') : [],
                page: 1,
                allImgs: item.imgs
            })
            allData.push({
                name: item.name,
                time: getTextTime(item.time),
                imgs: item.imgs
            })
        })
        // console.log(teaData)
        // setData(allData)
        setSaveData(data)
        setShowData(teaData)
    }


    /**
     * 第几个考勤类型时间的加载更多
     * @param {*} index
     * @param {*} dataPage 当前数据的页码
     */
    function getMore(index, dataPage) {
        // console.log(index)
        let nextPage = dataPage + 1
        setPage(nextPage)
        setDataIndex(index)
        getShowData(index, nextPage)
    }

    /**
     * 获得需要展示的图片格式
     * @param {*} index 需要渲染的数据index
     * @param {*} dataPage  第几页
     */
    function getShowData(index, dataPage) {
        let spliceArr = spArr(showData[index].allImgs, imgCount);
        let result = spliceArr.slice(0, dataPage)
        showData[index].imgs = result.toString().split(',');
        showData[index].page = dataPage
        console.log(showData[index])
        setShowData(showData)
        setIsUpdate(true)
    }

    return <div className="lxx-g-img" style={props.style}>
        <div style={{ paddingBottom: 20 }}>
            <span>{props.name || ''}</span>
            <span
                className="lxx-im-m-hide"
                onClick={() => {
                    setIsHide(!isHide);
                }}
            >
                {/* {isHide ? "展开" : "收起"} */}
                <SVG type="de_drop" className={isHide ? "" : "hide"} />
            </span>
        </div>
        <div className="lxx-im-g-box" ref={boxRef} style={{ display: isHide ? 'none' : 'block', height: showData.length ? 'auto' : '200px', width: '100%' }}>
            {
                showData && showData.length
                    ? showData.map((dt, index) => {
                        return <div key={index} className={dt.allImgs && dt.allImgs.length ? "lxx-im-g-list pic" : "lxx-im-g-list"}>
                            <p><span></span>{dt.name} {dt.time}</p>
                            <div className="lxx-g-flex tea">
                                {
                                    (dt.imgs || []).map((singleImg, ind) => {
                                        return (
                                            <div className='tj-im-wrap' style={{ display: 'inline-block' }}>
                                                <div key={singleImg + ind} className="lxx-im-m-pic">
                                                    <IMG src={G.dataService + singleImg} alt="picture" isEnlarge={true} />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {
                                dt.allImgs && dt.allImgs.length > imgCount && Math.ceil(dt.allImgs.length / imgCount) !== dt.page ?
                                    <div className='tj-im-more'><span onClick={() => getMore(index, dt.page)}>加载更多</span></div> : null
                            }

                        </div>

                    })
                    : <NoDataAndLoading loading={false} />
            }
        </div>
    </div>
}
export default ImgTeaShow