/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 16:07:50
 */

/**
 * @description 学院画像-课堂违纪
 */

import React, { Fragment as F, useState, useEffect } from "react";
import { withRouter } from 'react-router-dom'
import CollegeComHead from "./collegeComHead";
import CollegeComPart1 from "./collegeComPart1";
import CollegeComClu from "./collegeComClu";
import CollegeComLine from "./collegeComLine";
import CollegeComBottom from "./collegeComBottom";
import { getXyQsData } from './../scl_image/scl_public_function.js';
import { message } from "antd";
import {
  getCollegeVioAtten,
  getCollegeVioAttenAna,
  getCollegeVioAna,
  getCollegeVioAttenLine
} from "./../../../../request/yrj_college_request";
import G from './../../../../config/g';
import _ from 'lodash'
import _util from './../../../../util/_util'
import { jumpFun } from './../public/jumpFun'
const { getMonthDate } = _util
const selArr = [...Array(2).keys()].map((i, index) => i = {
  courseId: undefined, courseName: undefined, ind: index + 1
})

function CollegeComClassVio(props) {
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
    getCollegeVioAttenData();
    getCollegeVioAttenLineData('', 0);
  }, [props.params])

  //课程对比分析数据更新
  useEffect(() => {
    getCollegeVioAttenAnaData();
  }, [sortClassValue]);

  //教师对比分析数据更新
  useEffect(() => {
    getCollegeVioAnaData();
  }, [sortTeaValue]);

  //课程改变
  function classSortChange(e) {
    setSortClassValue(e);
    //请求数据
  }
  //教师对比改变
  function teaSortChange(e) {
    setSortTeaValue(e);
    //请求数据
  }
  //线图内置变化e
  // function oneSelectChange(e) {
  //   setCollegeIdOne(e);
  //   getCollegeVioAttenLineData(e, 1);
  // }
  // function twoSelectChange(e) {
  //   setCollegeIdTwo(e);
  //   getCollegeVioAttenLineData(e, 2);
  // }
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
    getCollegeVioAttenLineData(v, index);
  }
  //请求基础数据
  function getCollegeVioAttenData() {
    let params = {
      ...props.params
    }
    setClassPie('loading');
    setTeacherPie('loading');
    setScaleData('loading');
    getCollegeVioAtten(params).then(res => {
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
  function getCollegeVioAttenAnaData() {
    let params = {
      ...props.params,
      sortType: sortClassValue
    }
    setClassBarData('loading')
    getCollegeVioAttenAna(params).then(res => {
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
        //message.error(data.message);
      }
    });
  }

  //请求教师对比分析数据
  function getCollegeVioAnaData() {

    let params = {
      ...props.params,
      sortType: sortTeaValue
    }
    setTeaBarData('loading')
    getCollegeVioAna(params).then(res => {
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
        // message.error(data.message);
      }
    });
  }
  //请求趋势数据
  function getCollegeVioAttenLineData(id, index) {
    let params = {
      ...props.params,
      courseId: id
    }
    setQsLoading(true)
    getCollegeVioAttenLine(params).then(res => {
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
  function goRouter(index) {
    let keyValue = jumpFun(scaleData[index].name)
    let { timeType, selTime, collegeId,semesterId,couTypeId  } = props.params;
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
    props.history.push(`/home/det/ordbre/null/${startT}/${endT}/${colId}/${teaId}/${courId}/${breType}/${semId}/${couTypeId}`)


  }
  return (
    <F>
      {/* <CollegeComHead title={"课堂违纪"} /> */}
      <CollegeComPart1
        title_part1_headColor={"rgb(247,183,71)"}
        title_part1_l={"违纪率"}
        title_part1_r={"违纪事件分布"}
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
        title={"违纪率趋势"}
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
      />
      <CollegeComBottom
        ftitle_l={"违纪课堂共计"}
        tobig={abnormalHour}
        ftitle_r={"课程"}
        title={"违纪课堂分析"}
        classPie={classPie}
        teacherPie={teacherPie}
      />
    </F>
  );
}
export default withRouter(CollegeComClassVio)
