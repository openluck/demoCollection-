/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 16:08:25
 */

/**
 * @description 学院画像-到课率
 */

import React, { Fragment as F, useState, useEffect } from "react";
import {withRouter} from 'react-router-dom'
import CollegeComHead from "./collegeComHead";
import CollegeComPart1 from "./collegeComPart1";
import CollegeComClu from "./collegeComClu";
import CollegeComLine from "./collegeComLine";
import CollegeComBottom from "./collegeComBottom";
import { getXyQsData } from './../scl_image/scl_public_function.js';
import G from './../../../../config/g.js';
import _ from 'lodash'
import { message } from "antd";
import {
  getCollegeClass,
  getCollegeClassAna,
  getCollegeClassTeaAna,
  getCollegeClassTrend
} from "./../../../../request/yrj_college_request";
import _util from './../../../../util/_util'
import { jumpFun } from './../public/jumpFun'
const { getMonthDate } = _util
const selArr = [...Array(2).keys()].map((i, index) => i = {
  courseId: undefined, courseName: undefined, ind: index + 1
})

 function CollegeComClassAtten(props) {
  const [sortClassValue, setSortClassValue] = useState('0');
  const [sortTeaValue, setSortTeaValue] = useState('0');
  const [collegeIdOne, setCollegeIdOne] = useState(undefined);
  const [collegeIdTwo, setCollegeIdTwo] = useState(undefined);
  // const [stuCheckType, setStuCheckType] = useState(1); //1	正常 2	迟到 3	早退 4	缺勤 5	调换课
  // const [teaCheckType, setTeaCheckType] = useState(1); //1	正常 2	迟到 3	早退 4	缺勤 5	调换课
  // const [lineCheckType, setLineCheckType] = useState(1); //1	正常 2	迟到 3	早退 4	缺勤 5	调换课
  const [scaleData, setScaleData] = useState("loading"); //part1 饼图
  const [normalProp, setNormalProp] = useState(0); //part1 normalProp
  const [checkProp, setCheckProp] = useState("loading"); //part1 checkProp
  const [classBarData, setClassBarData] = useState("loading"); //课程对比分析 柱状图数据
  const [teaBarData, setTeaBarData] = useState("loading"); //课程对比分析 柱状图数据
  const [classPie, setClassPie] = useState("loading"); //bottom组件 饼图数据
  const [teacherPie, setTeacherPie] = useState("loading"); //bottom组件 饼图数据
  const [lineData, setLineData] = useState({}); //线图数据
  const [qsLoading, setQsLoading] = useState(true); //线图数据
  const [abnormalHour, setAbnormalHour] = useState(50);
  // 下拉选中对象 [{teaClaId: '', teaClaName: '', ind: 0}]
  const [selClass, setSelClass] = useState([{ courseId: '', courseName: '全部', ind: 0 }, ...selArr]);

  //数据请求
  useEffect(() => {
    getCollegeClassData();
    getCollegeClassTrendData('', 0);
  }, [props.params])
  //课程对比分析数据更新
  useEffect(() => {
    getCollegeClassAnaData();
  }, [sortClassValue]);

  //教师对比分析数据更新
  useEffect(() => {
    getCollegeClassTeaAnaData();
  }, [sortTeaValue]);

  // //趋势数据更新
  // useEffect(() => {
  //   getCollegeClassTrendData('', 0);
  // }, [lineCheckType]);

  //课程改变
  function classSortChange(e) {
    setSortClassValue(e);
  }
  //教师对比改变
  function teaSortChange(e) {
    setSortTeaValue(e);
  }

  //趋势下拉
  const onChangeSelect = (v, index) => {
    // console.log(index, ':选择拉的东西')
    // 存储下拉筛选数据
    let t = _.find(props.selectList, { courseId: v })
    let obj = Object.assign(t, { ind: index })
    if (selClass.length) {
      selClass[index] ? selClass[index] = obj : selClass.push(obj);
    } else {
      selClass.push(obj)
    }
    // console.log(selClass)
    setSelClass(selClass)
    if (index == 1) {
      setCollegeIdOne(v);
    } else {
      setCollegeIdTwo(v);
    }
    getCollegeClassTrendData(v, index);
  }

  //请求基础数据
  function getCollegeClassData() {
    let params = {
      ...props.params
    }
    setClassPie('loading');
    setTeacherPie('loading');
    setScaleData('loading');
    getCollegeClass(params).then(res => {
      //获取基础数据
      let data = res.data;
      if (data.data && data.result) {
        setClassPie(data.data.classPie); //bottom组件 饼图数据
        setTeacherPie(data.data.teacherPie); //bottom组件 饼图数据
        setScaleData(data.data.attenPie); //part1 饼图
        setCheckProp(data.data.checkProp); //p1左侧
        setNormalProp(data.data.normalProp); //p1 normal
        setAbnormalHour(data.data.abnormalHour); //考勤异常数据
      } else {
        setClassPie();
        setTeacherPie();
        setScaleData();
        setCheckProp();
        setAbnormalHour(0);
        message.error(data.message);
      }
    });
  }
  //请求课程对比分析数据
  function getCollegeClassAnaData() {
    let params = {
      ...props.params,
      sortType: sortClassValue
    }
    setClassBarData('loading')
    getCollegeClassAna(params).then(res => {
      //获取基础数据
      let data = res.data;
      if (data.data.length !== 0 && data.result) {
        let dbfxData = {
          xData: [],
          yData: []
        }
        data.data.map((t, i) => {
          dbfxData.xData.push(t.name);
          dbfxData.yData.push(t.prop);
        })
        setClassBarData(dbfxData);
      } else {
        setClassBarData();
        // message.error(data.message);
      }
    });
  }

  //请求教师对比分析数据
  function getCollegeClassTeaAnaData() {
    let params = {
      ...props.params,
      sortType: sortTeaValue
    }
    setTeaBarData('loading')
    getCollegeClassTeaAna(params).then(res => {
      //获取基础数据
      let data = res.data;
      if (data.data.length !== 0 && data.result) {
        let dbfxData = {
          xData: [],
          yData: []
        }
        data.data.map((t, i) => {
          dbfxData.xData.push(t.name);
          dbfxData.yData.push(t.prop);
        })
        setTeaBarData(dbfxData);
      } else {
        setTeaBarData();
        //message.error(data.message);
      }
    });
  }
  //请求趋势数据
  function getCollegeClassTrendData(id, index) {
    let params = {
      ...props.params,
      courseId: id
    }
    setQsLoading(true)
    getCollegeClassTrend(params).then(res => {

      let data = res.data;
      if (data.data && data.result) {
        if (id) {
          let collegeIndex = _.findIndex(props.selectList, { courseId: id });
          let qsData = getXyQsData(
            lineData,
            res.data.data,
            index,
            props.selectList[collegeIndex].courseName,
            id,
            selClass
          );
          setLineData({})
          setLineData(qsData)
        } else {
          setLineData(getXyQsData(lineData, res.data.data, index, '', id, selClass));
        }
      } else {
        message.error(data.message);
      }
      setQsLoading(false)
    });
  }

  //获取最大值
  //  function getMax1(data){
  //   if (data.length) {
  //     let list=[]
  //     data.map((v,k)=>{
  //         if(typeof v==='number'){
  //           list.push(v)
  //         }
  //     })
  //     return Math.max(...list)
  //   }else{
  //     return 100
  //   }
  // }
  //获取最大值
  // function getmax(data) {
  //   console.log(data,'xxxxx')
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
  function goRouter(index) {
    let keyValue = jumpFun(scaleData[index].name)
    let { timeType, selTime,collegeId,semesterId,couTypeId } = props.params;
    console.log(props)
    let startT, endT, colId = collegeId, teaId = null, courId = null, breType = null,semId=semesterId;
    if (timeType == 1) {
      startT = new Date(selTime).getTime();
      endT = new Date(selTime).getTime();
    } else if (timeType == 2) {
      let item=_.find(G.ISCED_cutSemesterData.weekList,{weekId:selTime})
      startT = String(item.startTime);
      endT = String(item.endTime);
    } else {
      let monthDate = getMonthDate(selTime)
      startT = new Date(monthDate[0]).getTime();
      endT = new Date(monthDate[1]).getTime();
    }
    props.history.push(`/home/det/ordclass/${keyValue[1]}/${keyValue[0]}/null/${startT}/${endT}/${colId}/${teaId}/${courId}/${semId}/${couTypeId}`)
  //  if (type === 'jzl') {
  //     //明细 教学秩序 就座率
  //     props.history.push(`/home/det/ordsit/${keyValue[1]}/null/${keyValue[0]}/${startT}/${endT}/${colId}/${teaId}/${courId}`)
  //   } else if (type === 'sjl') {
  //     //明细 教学秩序 睡觉率
  //     props.history.push(`/home/det/ordsle/${keyValue[0]}/null/${keyValue[1]}/${startT}/${endT}/${colId}/${teaId}/${courId}`)
  //   } else if (type === 'ktwj') {
  //     //明细 教学秩序 课堂违纪
  //     props.history.push(`/home/det/ordbre/null/${startT}/${endT}/${colId}/${teaId}/${courId}/${breType}`)
  //   }

  }

  return (
    <F>
      {/* <CollegeComHead title={"到课率"} /> */}
      <CollegeComPart1
        title_part1_l={"到课率"}
        title_part1_r={"到课率分布"}
        pie_part1_type={3}
        scaleData={scaleData}
        normalProp={normalProp}
        checkProp={checkProp}
        goRouter={goRouter}
      />
      <CollegeComClu
        title={"课程对比分析"}
        showTable={false}
        sort={sortClassValue}
        sortCallback={e => classSortChange(e)}
        barData={classBarData}
      />
      <CollegeComClu
        title={"教师对比分析"}
        showTable={false}
        sort={sortTeaValue}
        sortCallback={e => teaSortChange(e)}
        barData={teaBarData}
      />
      <CollegeComLine
        title={"到课率趋势"}
        showTable={false}
        collegeIdOne={collegeIdOne}
        collegeIdTwo={collegeIdTwo}
        idCallBack={onChangeSelect}
        color={["#3385ff", "#4ecc7b", "#cfdd68"]}
        loading={qsLoading}
        xData={lineData.xData}
        data={lineData.data}
        selectList={props.selectList}
        timeType={props.params.timeType}
      // max={getmax(lineData.data)}
      />
      <CollegeComBottom
        ftitle_l={`到课率低于${G.ISCED_setInfo.attenRaleUnder || 'xx'}%共计`}
        tobig={abnormalHour}
        ftitle_r={"课程"}
        title={`到课率低于${G.ISCED_setInfo.attenRaleUnder || 'xx'}%课堂分析`}
        classPie={classPie}
        teacherPie={teacherPie}
      />
    </F>
  );
}

export default withRouter(CollegeComClassAtten)