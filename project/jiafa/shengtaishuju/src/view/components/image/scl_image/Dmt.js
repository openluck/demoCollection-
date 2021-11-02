/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: yrj
 * @Last Modified time: 2020-08-06 09:55:42
 */

/**
 * @description 多媒体使用组件
 */
import React, { Fragment as F, useState, useEffect } from "react";
import XqLine from './../public/xqLine.js'
import ColorsPieEcharts from './../public/ColorsPieEcharts.js';
import PreBar from './../public/preBar';
import Tea_btm_cont from './../public/tea_btm_cont';
import NoDataAndLoading from './../public/noDataAndLoading';
import SVG from './../../../public/svg.js';
import { Select, message, Spin } from "antd";
import {getQsData,realData} from './scl_public_function.js';
import CollegeMediaPie from "./../college_image/collegeMediaPie";
import { getSchMedia, getSchMediaAna, getSchMediaTrend, getSchMediaTea, getSchMediaCour } from './../../../../request/lj_scl_image_request';
const { Option } = Select;

const selArr = [...Array(2).keys()].map((i, index) => i = {
  collegeId: undefined, collegeName: undefined, ind: index + 1
})

export default function Dmt(props) {
  //学院考勤红黑榜-红黑下拉状态
  const [hhSelect, setHhSelect] = useState(0);

  //基本信息数据
  const [infoData, setInfoData] = useState({});

  //开课单位对比分析数据
  const [dbfxData, setDbfxData] = useState({});

  //趋势数据
  const [qsData, setQsData] = useState({});

  //红黑课程数据
  const [hhkcData, setHhkcData] = useState([]);

  //红黑课程数据
  const [hhjsData, setHhjsData] = useState([]);

  //排序
  const [sortValue, setSortValue] = useState('0');

  //趋势下拉1
  const [qsSelectOne, setQsSelectOne] = useState(undefined);

  //趋势下拉2
  const [qsSelectTwo, setQsSelectTwo] = useState(undefined);

  //基础loading
  const [jcLoading, setJcLoading] = useState(true);

  //对比分析loading
  const [dbLoading, setDbLoading] = useState(true);

  //趋势loading
  const [qsLoading, setQsLoading] = useState(true);

  //红黑课程loading
  const [hhkcLoading, setHhkcLoading] = useState(true);

  //红黑教师loading
  const [hhjsLoading, setHhjsLoading] = useState(true);

  // 下拉选中对象 [{teaClaId: '', teaClaName: '', ind: 0}]
  const [selClass, setSelClass] = useState([{ collegeId: '', collegeName: '全校', ind: 0 }, ...selArr]); 

  useEffect(() => {
    setHhSelect(0);
    setSortValue('0');
    setQsSelectOne(undefined);
    setQsSelectTwo(undefined);
    getSchMediaa();
    getSchMediaTrenda('',0);
  }, [props.params])

    //对比分析数据更新
    useEffect(()=>{
      getSchMediaAnaa();
    },[sortValue]);
  
    //红黑榜数据更新
    useEffect(()=>{
      getSchMediaCoura();
      getSchMediaTeaa();
    },[hhSelect]);
  
    
  //红黑榜下拉切换
  const hhChange = (v) => {
    setHhSelect(v);
  }
  //排序
  const onSort = (v) => {
    if(v !== sortValue){
      setSortValue(v);
    }
  }

  //趋势下拉
  const onChangeQsSelect = (v,index) => {
    // 存储下拉筛选数据
    let t = _.find(props.list, { collegeId: v })
    let obj = Object.assign(t, { ind: index })
    if (selClass.length) {
        selClass[index] ? selClass[index] = obj : selClass.push(obj);
    } else {
        selClass.push(obj)
    }
    // console.log(selClass)
    setSelClass(selClass)
    if(index == 1){
      setQsSelectOne(v);
    }else{
      setQsSelectTwo(v);
    }
    getSchMediaTrenda(v,index);
  }

  //获取基本信息
  const getSchMediaa = () => {
    let params = {
      ...props.params
    }
    setJcLoading(true);
    getSchMedia(params).then((res) => {
      setJcLoading(false);
      if (res.data.result) {
        setInfoData(res.data.data);
      } else {
        message.error(res.data.message)
      }
    })
  }

  //获取开课单位对比分析
  const getSchMediaAnaa = () => {
    let params = {
      ...props.params,
      sortType: sortValue
    }
    setDbLoading(true);
    getSchMediaAna(params).then((res) => {
      setDbLoading(false);
      if (res.data.result) {
        let dbfxData = {
          xData: [],
          yData: []
        }
        res.data.data.map((t, i) => {
          dbfxData.xData.push(t.name);
          dbfxData.yData.push(t.prop);
        })
        setDbfxData(dbfxData);
      } else {
        message.error(res.data.message)
      }
    })
  }

  //获取考勤趋势
  const getSchMediaTrenda = (id,index) => {
    let param = {
      ...props.params,
      checkCollegeId:id,
    } 
    setQsLoading(true);
    getSchMediaTrend(param).then((res) => {
      if (res.data.result) {
        if(id){
          let collegeIndex = _.findIndex(props.list, { collegeId: id });
          let data = getQsData(
            qsData,
            res.data.data,
            index,
            props.list[collegeIndex].collegeName,
            id,
            selClass
          );
          setQsData({})
          setQsData(data)
          console.log(qsData);
        }else{
          setQsData(getQsData(qsData,res.data.data,index,'',id,selClass));
        }
      } else {
        message.error(res.data.message)
      }
      setQsLoading(false);
    })
  }

  //获取考勤红黑榜课程排名
  const getSchMediaCoura = () => {
    let params = {
      ...props.params,
      colortType: hhSelect
    }
    setHhkcLoading(true);
    getSchMediaCour(params).then((res) => {
      setHhkcLoading(false);
      if (res.data.result) {
        setHhkcData(res.data.data)
      } else {
        message.error(res.data.message)
      }
    })
  }

  //获取考勤红黑榜教师排名
  const getSchMediaTeaa = () => {
    let params = {
      ...props.params,
      colortType: hhSelect
    }
    setHhjsLoading(true);
    getSchMediaTea(params).then((res) => {
      setHhjsLoading(false);
      if (res.data.result) {
        setHhjsData(res.data.data)
      } else {
        message.error(res.data.message)
      }
    })
  }

  return (
    <div className="image_public dmt">
      {
        !jcLoading ?
          <div className="dmt_info">
            <div className="p1_box_head">多媒体使用率</div>
            {
              infoData && infoData.checkProp ?
                <div className="p1_box_con">
                  <div className="p1_left">
                    <div className="p1_echarts">
                      <CollegeMediaPie
                        radius={["55", "65"]}
                        center={["50%", "80"]}
                        color={["#56bbee", "#fbfcfd"]}
                        fontSize={18}
                        data={infoData.normalProp || infoData.normalProp == 0 ? infoData.normalProp : 0}
                        title=""
                      />
                    </div>
                    <div>多媒体使用率</div>
                  </div>
                  <div className="p1_right">
                    <span>{infoData.checkProp.name}</span>
                    <span>
                      {
                        infoData && infoData.checkProp && infoData.checkProp.sortType == 1 ?
                          <SVG
                            type={'imgUp'}
                          /> : infoData && infoData.checkProp && infoData.checkProp.sortType == 2 ? <SVG
                            type={'imgDown'}
                          />
                          :null
                      }
                    </span>
                    <span>{ infoData && infoData.checkProp ? `${realData(infoData.checkProp.changeProp)}%` : '--' }</span>
                  </div>
                </div>
                : null
            }

          </div>
          : <div style={{ 'height': '276px', 'width': '100%' }}>
            <NoDataAndLoading loading={true} />
          </div>
      }

      <div className='scl_xydb'>
        <div className='header'>
          <div>
            <span>开课单位对比分析</span>
            <span className='sort_svg'>
              <SVG
                type={'de_sort3'}
                color={sortValue == '1' ? "#1890ff" : "#a1adb3"}
                onClick={() => onSort('1')}
              />
              <SVG
                type={'de_sort2'}
                color={sortValue !== '1' ? "#1890ff" : "#a1adb3"}
                onClick={() => onSort('0')}
              />
            </span>
          </div>
        </div>
        <div className='content'>
          {
            !dbLoading && dbfxData && dbfxData.xData && dbfxData.xData.length !== 0 ?
              <Tea_btm_cont
                barData={{   //数据   Object
                  xData: dbfxData.xData,    //x轴数据  Array
                  yData: dbfxData.yData   //y轴数据  Array
                }} />
              : <NoDataAndLoading loading={dbLoading} />
          }
        </div>
      </div>
      <div className='scl_kqqs'>
        <div className='header'>
          <div><span>多媒体使用趋势</span></div>
          <div>
            <span>全校</span>
            &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
            <Select
              style={{ width: 120 }}
              value={qsSelectOne}
              placeholder='请选择'
              onChange={(v) => onChangeQsSelect(v, 1)}
              getPopupContainer={triggerNode => triggerNode.parentNode} >
              {
                props.list.length !== 0 ?
                  props.list.map((t, i) => {
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectTwo ? true :false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
            &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
            <Select
              style={{ width: 120 }}
              value={qsSelectTwo}
              placeholder='请选择'
              onChange={(v) => onChangeQsSelect(v, 2)}
              getPopupContainer={triggerNode => triggerNode.parentNode} >
              {
                props.list.length !== 0 ?
                  props.list.map((t, i) => {
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectOne ? true :false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
          </div>
        </div>
        <div className='content'>
        {
            !qsLoading && qsData && qsData.xData && qsData.yData && qsData.yData.length !== 0 ? 
            <XqLine
            color={['#3385ff', '#4ecc7b', '#cfdd68']}
            xData={qsData.xData}
            data={qsData.yData}
            type={props.params.timeType}
          />:<NoDataAndLoading loading={qsLoading} />
          }
        </div>
      </div>
      <div className="scl_kq_hhb">
        <div className='header'>
          <div style={{ 'width': '140px' }}><span>多媒体使用红黑榜</span></div>
          <div>
          <Select 
            defaultValue={hhSelect} 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            style={{ width: 80 }} 
            onChange={(e) => hhChange(e)}>
              <Option value={0}>红榜</Option>
              <Option value={1}>黑榜</Option>
            </Select>
          </div>
        </div>
        <div className="content">
          <div>
            <div className='title'>
              <div>课程排名</div>
            </div>
            <div className='pm'>
              {
                !hhkcLoading && hhkcData.length !== 0 ?
                  hhkcData.map((t, i) => {
                    return <div key={`${t.name}${i}`}>
                      <PreBar
                        data={t.prop}
                        name={t.name}
                        rank={i + 1} />
                    </div>
                  })
                  : <NoDataAndLoading loading={hhkcLoading} />
              }
            </div>
          </div>
          <div>
            <div className='title'>
              <div>教师排名</div>
            </div>
            <div className='pm'>
              {
                !hhjsLoading && hhjsData.length !== 0 ?
                  hhjsData.map((t, i) => {
                    return <div key={`${t.name}${i}`}>
                      <PreBar
                        data={t.prop}
                        name={t.name}
                        rank={i + 1} />
                    </div>
                  })
                  : <NoDataAndLoading loading={hhjsLoading} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
