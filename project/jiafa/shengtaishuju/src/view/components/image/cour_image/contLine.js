/*
 * @Author: lxx 
 * @Date: 2020-03-05 11:05:46 
 * @Last Modified by: yrj
 * @Last Modified time: 2020-08-06 10:14:26
 * 趋势对比折线图
 */
import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { Select, Spin } from 'antd';
import G from './../../../../config/g';
import XqLine from '../public/xqLine';
import NoDataAndLoading from './../public/noDataAndLoading';

const { Option } = Select;

const newArr = [...Array(2).keys()].map(i => i = {
    id: '',
    name: '',
    list: [],
    date: []
})
const classArr = [...Array(2).keys()].map((i, index) => i = {
    teaClaId: undefined, teaClaName: undefined, ind: index + 1
})
const ContLine = (props) => {
    const [list, setList] = useState([]); // 下拉数据
    const [saveSel, setSaveSel] = useState([{ teaClaId: '', teaClaName: '全部', ind: 0 }]); // 存储上一次下拉 [{teaClaId: '', teaClaName: '', ind: 0}]
    const [selClass, setSelClass] = useState([{ teaClaId: '', teaClaName: '全部', ind: 0 }]); // 下拉选中对象 [{teaClaId: '', teaClaName: '', ind: 0}]
    const [selType, setSelType] = useState('1'); // type切换
    const [lineData, setLineData] = useState(['', '', '']); // 折线图数据 [{id: '', name: '', list: [], date: []}]

    useEffect(() => {
        // 教学班数据变更
        let arr = [];
        arr.push({ teaClaId: '', teaClaName: '全部', ind: 0 }, ...classArr)
        // console.log(arr)
        setList(props.list);
        setSelClass(arr);
        setLineData([]);
    }, [props.list])

    useEffect(() => {
        // 更新折线图数据
        if (props.liData) {
            // console.log(lineData)
            let parData = props.liData;
            let lineObj = {
                id: parData.id,
                name: parData.name,
                list: [],
                date: []
            }
            // console.log(parData)

            if (lineData.length) {
                if (parData.lineList.length) {
                    // 以全部项的日期为准
                    lineObj.date = lineData[0].date;
                    lineObj.date.map(dt => {
                        let it = _.find(parData.lineList, {date: dt})
                        if(it) {
                            lineObj.list.push(it.prop);
                        } else {
                            lineObj.list.push('--');
                        }
                    })
                }
                // 已存在折线图
                let t = _.findIndex(selClass, { teaClaId: parData.id }); // 下拉选中项查询
                // let dt = _.findIndex(lineData, { id: parData.id }); // 折线数组查询
                if (t > -1) {
                    lineObj.name = selClass[t].teaClaName;
                    lineData[t] = lineObj
                }
            } else if (!lineData.length) {
                // 无折线图数据
                if (parData.lineList.length) {
                    parData.lineList.forEach(dt => {
                        lineObj.list.push(dt.prop);
                        lineObj.date.push(dt.date);
                    })
                }
                lineObj.name = '全部'
                // lineData[0] = lineObj
                lineData.push(lineObj)
            }
            // console.log(lineData)
            setLineData(JSON.parse(JSON.stringify(lineData)))
        } else {
            // 查询失败，筛选条件回置
            setSelClass(saveSel)
        }
    }, [props.liData])



    /**
     * 修改下拉数据
     * @param {String} value 选中id
     * @param {Number} num 下拉位置下标
     */
    function classChange(value, num) {
        setSaveSel(selClass)
        let t = _.find(list, { teaClaId: value })
        let obj = Object.assign(t, { ind: num })
        if (selClass.length) {
            selClass[num] ? selClass[num] = obj : selClass.push(obj);
        } else {
            selClass.push(obj)
        }
        console.log(selClass)
        setSelClass(selClass)
        // 回调教学班id请求数据
        if (props.isHas) {
            let obj = {
                id: t.teaClaId,
                type: selType
            }
            props.onChange(obj);
        } else {
            props.onChange(t.teaClaId);
        }
    }

    /**
     * type切换
     * @param {String} val 类型值
     */
    function actionCompar(val) {
        setSelType(val);
        // 回调请求所有选中数据
        let obj = {
            arr: selClass,
            type: val
        }
        console.log(obj)
        props.onChange(obj);
    }

    //获取最大值
//  function getMax1(data){
//     if (data.length) {
//       let list=[]
//       data.map((v,k)=>{
//           if(typeof v==='number'){
//             list.push(v)
//           }
//       })
//       return Math.max(...list)
//     }else{
//       return 100
//     }
//   }
    //获取最大值
    // function getmax(data) {
    // //   console.log(data,'xxxxx')
    //   if(data&&data.length){
    //     let first=data[0]?data[0].list:[0]
    //     let sec=data[1]?data[1].list:[0]
    //     let thr=data[2]?data[2].list:[0]
    //     let max=Math.max(...[getMax1(first),getMax1(sec),getMax1(thr)])
    //     return max
    //   }else{
    //     return 100
    //   }
  
  
    // }

    return <>
        <div className='xq-kchx-li-head'>

            <div className='xq-kchx-li-t'>
                <span>{props.title}</span>
            </div>
            <div className='xq-compar-ul'>
                <span className='xq-compar-all-t'>全部</span>
                <img src={require('../../../../media/picture/img_vs.png')} />
                <div className='xq-compar-li'>
                    <Select
                        value={selClass[1] ? selClass[1].teaClaId : undefined}
                        placeholder='请选择'
                        getPopupContainer={triggerNode => triggerNode.parentElement}
                        onChange={(val) => classChange(val, 1)}
                        style={{ width: 120 }}
                    >
                        {
                            list.map((item, index) => {
                                return <Option value={item.teaClaId} key={index} title={item.teaClaName} disabled={selClass[2] ? selClass[2].teaClaId === item.teaClaId ? true : false : false}>
                                    {item.teaClaName}
                                </Option>
                            })
                        }
                    </Select>
                </div>
                <img src={require('../../../../media/picture/img_vs.png')} />
                <div className='xq-compar-li'>
                    <Select
                        value={selClass[2] ? selClass[2].teaClaId : undefined}
                        placeholder='请选择'
                        getPopupContainer={triggerNode => triggerNode.parentElement}
                        onChange={(val) => classChange(val, 2)}
                        style={{ width: 120 }}
                    >
                        {
                            list.map((item, index) => {
                                return <Option value={item.teaClaId} key={index} title={item.teaClaName} disabled={selClass[1] ? selClass[1].teaClaId === item.teaClaId ? true : false : false}>
                                    {item.teaClaName}
                                </Option>
                            })
                        }
                    </Select>
                </div>

            </div>
            {
                props.isHas
                    ? <div className='xq-kthd-types'>
                        
                        <div className={selType === '2' ? 'curr' : ''} onClick={() => actionCompar('2')}>
                            教师上下讲台
                        </div>
                        <div className={selType === '1' ? 'curr' : ''} onClick={() => actionCompar('1')}>
                            学生起立
                        </div>
                    </div>
                    : null
            }

        </div>
        <div className='xq-kchx-li' style={{ height: '340px', display: 'block' }}>
            {
                !props.load && lineData && lineData.length
                    ? <XqLine
                        color={props.color || ['#1890ff', '#4ecb73', '#fbd437']}
                        xData={lineData[0].date}
                        data={lineData}
                        yType={'per'}
                        yName={props.isHas?'次/课程':""}
                        type={props.timeType}
                        // max={getmax(lineData)}
                    />
                    : <NoDataAndLoading loading={props.load} />
            }
        </div>

    </>


}

export default ContLine;