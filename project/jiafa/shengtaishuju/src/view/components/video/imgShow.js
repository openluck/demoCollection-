/*
 * @Author: lxx 
 * @Date: 2020-07-28 17:29:32 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 15:00:28
 * 课堂图片展示
 * name 展示名称（String）
 * data 图片数据（Array） 
 */
import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd'
import SVG from './../../public/svg'
import { IMG } from './../../public/imgPub';
import G from './../../../config/g';
import NoDataAndLoading from './../../components/image/public/noDataAndLoading';
const ImgShow = (props) => {
    const [data, setData] = useState([]) // 图片数据
    const [isHide, setIsHide] = useState(false) // 是否隐藏
    const [height, setHeight] = useState(0); // 展示高度

    useEffect(() => {
        // 更新数据
        // let data = [{
        //     startTime: '10:00',
        //     endTime: '10:10',
        //     imgs: ['http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg', 
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg',
        //     ]
        // }, {
        //     startTime: '10:00',
        //     endTime: '10:10',
        //     imgs: ['http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg', 'http://10.4.3.8:12201/icon/4/前端临时版大数据2020-7-23-093003.jpg']
        // }]
        // setData(data)
        let reg = function (v) {
            if (v >= 10) {
                return v
            } else {
                return '0' + v
            }
        }

        let { startTime, imgs, endTime } = props.data;
        if (imgs && imgs.length) {
            // let normalTime = imgs && imgs.length && imgs[0].imgTime; //年月日
            // let year = new Date(normalTime).getFullYear();
            // let month = new Date(normalTime).getMonth() + 1;
            // let days = new Date(normalTime).getDate();
            // let timeInfo = year + '-' + reg(month) + '-' + reg(days) + ' ';
            // let $startTime = new Date(timeInfo + startTime).valueOf(); //开始时间时间戳
            // let $endTime = new Date(timeInfo + endTime).valueOf(); //结束时间时间戳
            let $startTime = startTime //开始时间时间戳
            let $endTime = endTime //结束时间时间戳
            let count = Math.floor(($endTime - $startTime) / 600000) //根据十分钟计算间隔数
            let timeArray = [];
            for (let i = 0; i < count; i++) {
                timeArray.push({
                    startTime: $startTime + i * 600000,
                    endTime: $startTime + (i + 1) * 600000 > $endTime ? $endTime : $startTime + (i + 1) * 600000,
                    imgs: []
                })
            }
            console.log(imgs)
            //判断图片时间匹配在开始时间和结束时间之内
            for (let i in timeArray) {
                for (let j in imgs) {
                    
                    let img = imgs[j]
                    if (img.imgTime >= timeArray[i].startTime && img.imgTime <= timeArray[i].endTime) {
                        timeArray[i]['imgs'].push({
                            url:img.imgUrl,
                            stuOnAttNum:img.stuOnAttNum || 0,
                            frontSeatNum:img.frontSeatNum || 0,
                            sleepNum: img.sleepNum || 0
                        })
                        // timeArray[i]['stuOnAttNum'] = img.stuOnAttNum || 0
                        // timeArray[i]['frontSeatNum'] = img.frontSeatNum || 0
                        // timeArray[i]['sleepNum'] = img.sleepNum || 0
                    }
                }
            }
            console.log(timeArray)
            setData(timeArray)
        } else {
            setData([props.data])
        }
        // console.log(props.data)
    }, [props.data])
    // console.log(props.data)
    // 转换成展示的时间
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
        <div className="lxx-im-g-box" style={{ display: isHide ? 'none' : 'block', height: data.length ? 'auto' : '200px' }}>
            {
                data && data.length
                    ? data.map((dt, index) => {
                        return <div key={index} className={dt.imgs && dt.imgs.length ? "lxx-im-g-list pic" : "lxx-im-g-list"}>
                            <p><span></span>{getTextTime(dt.startTime)}-{getTextTime(dt.endTime)}</p>
                            <div className="lxx-g-flex">
                                {
                                    (dt.imgs || []).map((item, ind) => {
                                        return <div key={item.url + ind} className="lxx-im-m-pic">
                                            <IMG src={G.dataService + item.url} alt="picture" isEnlarge={true} />
                                            {
                                                props.name == '教师考勤' ? null :
                                                    <>
                                                        <div className='tj-im-text'><span>{item.stuOnAttNum}/{item.frontSeatNum}/{item.sleepNum}</span></div>
                                                        <div className='tj-im-tip'>
                                                            <div className='tj-im-con'>
                                                                <div>学生到课人数：{item.stuOnAttNum}</div>
                                                                <div>前排就坐人数：{item.frontSeatNum}</div>
                                                                <div>低头人数：{item.sleepNum}</div>
                                                            </div>
                                                            <div className='tj-im-icon'></div>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                    })
                                }
                            </div>

                        </div>
                    })
                    : <NoDataAndLoading loading={false} />
            }
        </div>
    </div>
}
export default ImgShow