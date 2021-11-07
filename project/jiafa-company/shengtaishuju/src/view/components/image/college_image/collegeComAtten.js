/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 15:29:59
 */

/**
 * @description 学院画像-通用头部组件
 */

import React, { Fragment as F, useState, useEffect } from "react";
import {withRouter} from 'react-router-dom'
import CollegeComHead from "./collegeComHead";
import CollegeComPart1 from "./collegeComPart1";
import CollegeComClu from "./collegeComClu";
import CollegeComLine from "./collegeComLine";
import CollegeComBottom from "./collegeComBottom";
import {getAttCode} from './../public/jumpFun'
import CollageZhqk from './college_zhqk';
import { getXyQsData } from './../scl_image/scl_public_function.js';
import { getConfigData } from './../../../../config/actionConfig.js';
import { message } from "antd";
import G from './../../../../config/g.js';
import _ from 'lodash'
import {
  getCollegeTeaAtten,
  getCollegeAttenAna,
  getCollegeTeachAna,
  getCollegeAttenTrend,
} from "./../../../../request/yrj_college_request";
import _util from './../../../../util/_util'
const {getMonthDate}=_util
const selArr = [...Array(2).keys()].map((i, index) => i = {
  courseId: undefined, courseName: undefined, ind: index + 1
})

 function CollegeComAtten(props) {
  const [params, setParams] = useState(); //监听参数
  const [sortClassValue, setSortClassValue] = useState('0');
  const [sortTeaValue, setSortTeaValue] = useState('0');
  const [collegeIdOne, setCollegeIdOne] = useState(undefined);
  const [collegeIdTwo, setCollegeIdTwo] = useState(undefined);

  const [stuCheckType, setStuCheckType] = useState(1); //1	正常 2	迟到 3	早退 4	缺勤 5	调换课
  const [teaCheckType, setTeaCheckType] = useState(1); //1	正常 2	迟到 3	早退 4	缺勤 5	调换课
  const [lineCheckType, setLineCheckType] = useState(1); //1	正常 2	迟到 3	早退 4	缺勤 5	调换课
  const [scaleData, setScaleData] = useState("loading"); //part1 饼图
  const [normalProp, setNormalProp] = useState(0); //part1 normalProp
  const [checkProp, setCheckProp] = useState("loading"); //part1 checkProp
  const [classBarData, setClassBarData] = useState("loading"); //课程对比分析 柱状图数据
  const [teaBarData, setTeaBarData] = useState("loading"); //课程对比分析 柱状图数据
  const [classPie, setClassPie] = useState("loading"); //bottom组件 饼图数据
  const [teacherPie, setTeacherPie] = useState("loading"); //bottom组件 饼图数据
  const [lineData, setLineData] = useState({}); //线图数据
  const [qsLoading, setQsLoading] = useState(true); //线图数据
  const [abnormalHour, setAbnormalHour] = useState(0);


  // 下拉选中对象 [{teaClaId: '', teaClaName: '', ind: 0}]
  const [selClass, setSelClass] = useState([{ courseId: '', courseName: '全部', ind: 0 }, ...selArr]);

  //数据请求
  useEffect(() => {
    getCollegeTeaAttenData();

  }, [props.params])

  //课程对比分析数据更新
  useEffect(() => {
    getCollegeAttenAnaData();
  }, [sortClassValue, stuCheckType]);

  //教师对比分析数据更新
  useEffect(() => {
    getCollegeTeachAnaData();
  }, [sortTeaValue, teaCheckType]);

  //趋势数据更新
  useEffect(() => {
    getCollegeAttenTrendData('', 0);
    if (collegeIdOne && collegeIdOne !== '0') {
      getCollegeAttenTrendData(collegeIdOne, 1);
    }
    if (collegeIdTwo && collegeIdTwo !== '0') {
      getCollegeAttenTrendData(collegeIdTwo, 2);
    }
  }, [lineCheckType]);

  //课程改变
  function classSortChange(e) {
    setSortClassValue(e);
  }
  function classCheckChange(e) {
    setStuCheckType(e);
  }
  //教师对比改变
  function teaSortChange(e) {
    setSortTeaValue(e);
  }
  function teaCheckChange(e) {
    setTeaCheckType(e);
  }
  //线图内置变化e
  function lineCheckChange(e) {
    setLineCheckType(e);
  }
  //趋势下拉
  const onChangeSelect = (v, index) => {
    // console.log(index,':选择拉的东西')
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
    getCollegeAttenTrendData(v, index);
  }
  //重构p1考勤环状饼图数据
  function rebuildP1Data(obj) {
    // console.log(obj)
    if (obj) {
      let arr = [
        {
          name: "正常",
          prop: obj.teaAttNormal || 0,
          key:getAttCode('teaAttNormal')
        },
        {
          name: "早退",
          prop: obj.teaEarly,
          key:getAttCode('teaEarly')
        },
        {
          name: "缺勤",
          prop: obj.teaAttAbsence,
          key:getAttCode('teaAttAbsence')
        },
        {
          name: "迟到",
          prop: obj.teaAttLate,
          key:getAttCode('teaAttLate')
        },
        {
          name: "调换课",
          prop: obj.teaAttExchange,
          key:getAttCode('teaAttExchange')
        },
        {
          name: "请假",
          prop: obj.leave || 0,
          key:getAttCode('leave')
        }
      ];
      return arr;
    } else {
      return null;
    }
  }
  //请求基础数据
  function getCollegeTeaAttenData() {
    let params = {
      ...props.params
    }
    setClassPie('loading');
    setTeacherPie('loading');
    setScaleData('loading');
    getCollegeTeaAtten(params).then(res => {
      //获取基础数据
      let data = res.data;
      if (data.data && data.result) {
        setClassPie(data.data.classPie); //bottom组件 饼图数据
        setTeacherPie(data.data.teacherPie); //bottom组件 饼图数据
        setScaleData(rebuildP1Data(data.data.attenPie)); //part1 饼图
        setCheckProp(data.data.checkProp); //p1左侧
        setNormalProp(data.data.normalProp); //p1 normal
        setAbnormalHour(data.data.abnormalHour); //考勤异常数据
      } else {
        setClassPie();
        setScaleData();
        setTeacherPie();
        setCheckProp();
        setAbnormalHour(0);
      }
    });
  }



  //请求课程对比分析数据
  function getCollegeAttenAnaData() {
    let params = {
      ...props.params,
      sortType: sortClassValue,
      checkType: stuCheckType
    }
    setClassBarData('loading')
    getCollegeAttenAna(params).then(res => {
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
  function getCollegeTeachAnaData() {
    let params = {
      ...props.params,
      sortType: sortTeaValue,
      checkType: teaCheckType
    }
    setTeaBarData('loading')
    getCollegeTeachAna(params).then(res => {
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
  function getCollegeAttenTrendData(id, index) {
    let params = {
      ...props.params,
      courseId: id,
      checkType: lineCheckType
    }
    setQsLoading(true)
    getCollegeAttenTrend(params).then(res => {
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
          setLineData({})
          setLineData(getXyQsData(lineData, res.data.data, index, '全部', id, selClass));
        }
      } else {
        message.error(data.message);
      }
      setQsLoading(false)
    });
  }

  function goRouter(index){
    console.log(props)
    let value=scaleData[index].key;
    let {timeType,selTime,semesterId,couTypeId} = props.params;
    let startT,endT,colId=null,teaId=null,courId=null,semId=semesterId;
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
     props.history.push(`/home/det/ordtea/${value}/null/${startT}/${endT}/${colId}/${teaId}/${courId}/${semId}/${couTypeId}`)
  }
  return (
    <F>
      {/* <CollegeComHead title={"教师考勤"} /> */}
      <CollegeComPart1
        scaleData={scaleData}
        normalProp={normalProp}
        checkProp={checkProp}
        goRouter={goRouter}
      />
      <CollegeComClu
        title={"课程对比分析"}
        showTable={true}
        sort={sortClassValue}
        sortCallback={e => classSortChange(e)}
        checkType={stuCheckType}
        checkCallback={e => classCheckChange(e)}
        barData={classBarData}
      />
      <CollegeComClu
        title={"教师对比分析"}
        showTable={true}
        sort={sortTeaValue}
        sortCallback={e => teaSortChange(e)}
        checkType={teaCheckType}
        checkCallback={e => teaCheckChange(e)}
        barData={teaBarData}
      />
      <CollegeComLine
        title={"教师考勤趋势"}
        showTable={true}
        collegeIdOne={collegeIdOne}
        collegeIdTwo={collegeIdTwo}
        idCallBack={onChangeSelect}
        checkType={lineCheckType}
        loading={qsLoading}
        checkCallback={e => lineCheckChange(e)}
        color={["#3385ff", "#4ecc7b", "#cfdd68"]}
        xData={lineData.xData}
        data={lineData.data}
        selectList={props.selectList}
        timeType={props.params.timeType}
      />
      <CollegeComBottom
        ftitle_l={"考勤异常共计"}
        tobig={abnormalHour}
        ftitle_r={"课程"}
        title={"考勤异常分析"}
        classPie={classPie}
        teacherPie={teacherPie}
      />
    </F>
  );
}
export default withRouter(CollegeComAtten)