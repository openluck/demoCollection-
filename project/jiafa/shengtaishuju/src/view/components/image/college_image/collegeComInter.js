/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: lxx
 * @Last Modified time: 2020-07-24 09:52:03
 */

/**
 * @description 学院画像-课堂互动
 */

import React, { Fragment as F, useState, useEffect } from "react";
import CollegeComHead from "./collegeComHead";
import CollegeComClu from "./collegeComClu";
import CollegeComLine from "./collegeComLine";
import CollegeInterPart1 from "./collegeInterPart1";
import { message } from "antd";
import {
  getCollegeInterAtten,
  getCollegeInterAttenAna,
  getCollegeInterAna,
  getCollegeInterAttenLine
} from "./../../../../request/yrj_college_request";
import { getXyQsData } from './../scl_image/scl_public_function.js';

const selArr = [...Array(2).keys()].map((i, index) => i = {
  courseId: undefined, courseName: undefined, ind: index + 1
})
export default function CollegeComInter(props) {
  const [stuCountValue, setStuCountValue] = useState("0");
  const [teaCountValue, setTeaCountValue] = useState("0");
  const [sortClassValue, setSortClassValue] = useState("0");
  const [sortTeaValue, setSortTeaValue] = useState("0");
  const [collegeIdOne, setCollegeIdOne] = useState([]);
  const [collegeIdTwo, setCollegeIdTwo] = useState([]);
  const [stuCheckType, setStuCheckType] = useState(1); //1学生起立 2老师走下讲台
  const [teaCheckType, setTeaCheckType] = useState(1); //1学生起立 2老师走下讲台
  const [lineCheckType, setLineCheckType] = useState(1); //1学生起立 2老师走下讲台
  const [teacherPatrolCont, setTeacherPatrolCont] = useState("loading"); //p1 老师
  const [studentStandCont, setStudentStandCont] = useState("loading"); //p1 学生
  const [classBarData, setClassBarData] = useState(); //课程对比分析 柱状图数据
  const [teaBarData, setTeaBarData] = useState("loading"); //课程对比分析 柱状图数据
  const [lineData, setLineData] = useState({
    xData: [],
    data: []
  }); //线图数据
  // 下拉选中对象 [{teaClaId: '', teaClaName: '', ind: 0}]
  const [selClass, setSelClass] = useState([{ courseId: '', courseName: '全部', ind: 0 }, ...selArr]); 
  const [params, setParams] = useState(); //监听参数

  //课程改变
  function classSortChange(e) {
    setSortClassValue(e);
    // let params={
    //   semesterId: '2019_2020_2',
    //   collegeId: '0507000',
    //   couTypeId: '0',
    //   selTime: '2020-02-24',
    //   timeType: '1',
    //   courseId: '',
    //   checkType: stuCheckType,
    //   sortType:  String(e)
    // }
    let params = {
      ...props.params, checkType: stuCheckType, sortType: String(e)
    }
    getCollegeInterAttenAnaData(params)
    //请求数据
  }

  // 教室切换类型
  function classCheckChange(e) {
    setStuCheckType(e);
    // let params={
    //   semesterId: '2019_2020_2',
    //   collegeId: '0507000',
    //   couTypeId: '0',
    //   selTime: '2020-02-24',
    //   timeType: '1',
    //   courseId: '',
    //   checkType: e,
    //   sortType:  String(sortClassValue)
    // }
    let params = {
      ...props.params, checkType: String(e), sortType: String(sortClassValue)
    }
    getCollegeInterAttenAnaData({ ...params, checkType: String(e) })
    //请求数据
  }

  //教师对比改变
  function teaSortChange(e) {
    setSortTeaValue(e);
    // let params={
    //   semesterId: '2019_2020_2',
    //   collegeId: '0507000',
    //   couTypeId: '0',
    //   selTime: '2020-02-24',
    //   timeType: '1',
    //   courseId: '',
    //   checkType: teaCheckType,
    //   sortType:  String(e)
    // }
    let params = {
      ...props.params, checkType: teaCheckType, sortType: String(e)
    }
    getCollegeInterAnaData(params)
    //请求数据
  }

  function teaCheckChange(e) {
    setTeaCheckType(e);
    let params = {
      ...props.params, checkType: String(e), sortType: String(sortTeaValue)
    }
    getCollegeInterAnaData(params)
    //请求数据
  }

  //趋势下拉
  const onChangeSelect = (v,index) => {
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
    if(index == 1){
      setCollegeIdOne(v);
    }else{
      setCollegeIdTwo(v);
    }
    getCollegeAttenTrendData(v,index);
  }
  
  /**
   * 请求折线数据
   * @param {*} id 选中id
   * @param {*} index 下拉下标
   */
  const getCollegeAttenTrendData = (id, index, type) => {
    let params = {
      ...props.params, checkType: type || lineCheckType, courseId: id
    }
    getCollegeInterAttenLine(params).then(res => {
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
      // setQsLoading(false)
    })
  }

  // 趋势图切换类型
  function lineCheckChange(v) {
    setLineCheckType(v);
    selClass.map(dt => {
      if(!dt.courseId && !dt.courseName) {
        return
      }
      getCollegeAttenTrendData(dt.courseId, dt.ind, v)
    })
  }

  // 获取课堂互动基础数据
  function getCollegeInterAttenData(params) {
    getCollegeInterAtten(params).then(res => {
      let data = res.data;
      if (data.data && data.result) {
        setStuCountValue(data.data.stuProp)
        setTeaCountValue(data.data.teaProp)
        setStudentStandCont({
          name: data.data.checkStuProp.name,
          prop: data.data.checkStuProp.changeProp,
          sortType: data.data.checkStuProp.sortType
        })
        setTeacherPatrolCont({
          name: data.data.checkTeaProp.name,
          prop: data.data.checkTeaProp.changeProp,
          sortType: data.data.checkTeaProp.sortType
        })
      } else {
        setStudentStandCont()
        setTeacherPatrolCont()
      }
    }, () => {
      setStudentStandCont()
      setTeacherPatrolCont()
    })
  }

  // 获取课程分析
  function getCollegeInterAttenAnaData(params) {
    getCollegeInterAttenAna(params).then(res => {
      let data = res.data;
      if (data.data.length && data.result) {
        let xData = [], yData = []
        data.data.forEach(item => {
          xData.push(item.name)
          yData.push(item.prop || 0)
        });
        setClassBarData({
          xData,
          yData
        })
      } else {
        setClassBarData()
      }

    }, () => {
      setClassBarData()
    })
  }

  // 获取课程对比分析
  function getCollegeInterAnaData(params) {
    getCollegeInterAna(params).then(res => {
      let data = res.data;
      if (data.data.length && data.result) {
        let xData = [], yData = []
        data.data.forEach(item => {
          xData.push(item.name)
          yData.push(item.prop || 0)
        });
        setTeaBarData({
          xData,
          yData
        })
      }else{
        setTeaBarData()
      }
    },()=>{
      setTeaBarData()
    })
  }

  // 获取趋势图
  function getCollegeInterAttenLineData(params) {
    getCollegeInterAttenLine(params).then(res => {
      let data = res.data;
      if (data.data && data.result) {
        let xData = []; let yData = []
        data.data.lineList.forEach(item => {
          xData.push(item.name)
          yData.push(item.prop)
        })
        let obj = {
          name: '全部',
          list: yData
        }
        setLineData({
          xData: xData,
          data: [obj]
        })

      }else{
        setLineData({})
      }
    })
  }

  


  useEffect(() => {
    if (props.params) {
      console.log(props)
      // console.log("页面加载",JSON.stringify(props.params),params,JSON.stringify(props.params)!==params)
      if (JSON.stringify(props.params) !== params) {
        let params = {
          ...props.params
        }
        getCollegeInterAttenData(params)
        getCollegeInterAttenAnaData({ ...params, sortType: '0', checkType: String(stuCheckType) })
        getCollegeInterAnaData({ ...params, sortType: '0', checkType: String(teaCheckType) })
        getCollegeInterAttenLineData({ ...params, checkType: String(lineCheckType) })

        //重置
        setSortClassValue("0")
        setSortTeaValue("0")
        setCollegeIdOne([])
        setCollegeIdTwo([])
        setStuCheckType(1) //1学生起立 2老师走下讲台
        setTeaCheckType(1) //1学生起立 2老师走下讲台
        setLineCheckType(1) //1学生起立 2老师走下讲台
        setLineData({})
        setParams(JSON.stringify(props.params)); //比对 且请求数据
      }
    }
  });

  return (
    <F>
      {/* <CollegeComHead title={"课堂互动"} /> */}
      <CollegeInterPart1
        studentStandNum={stuCountValue}
        teacherPatrolNum={teaCountValue}
        teacherPatrolCont={teacherPatrolCont}
        studentStandCont={studentStandCont}
      />
      <CollegeComClu
        title={"课程对比分析"}
        showTeaCheck={true}
        showTable={false}
        sort={sortClassValue}
        sortCallback={e => classSortChange(e)}
        checkType={stuCheckType}
        checkCallback={e => classCheckChange(e)}
        barData={classBarData}
      />
      <CollegeComClu
        title={"教师对比分析"}
        showTeaCheck={true}
        showTable={false}
        sort={sortTeaValue}
        sortCallback={e => teaSortChange(e)}
        checkType={teaCheckType}
        checkCallback={e => teaCheckChange(e)}
        barData={teaBarData}
      />
      <CollegeComLine
        title={"课堂互动趋势"}
        showTeaCheck={true}
        showTable={false}
        collegeIdOne={collegeIdOne}
        collegeIdTwo={collegeIdTwo}
        idCallBack={onChangeSelect}
        checkType={lineCheckType}
        checkCallback={e => lineCheckChange(e)}
        color={["#3385ff", "#4ecc7b", "#cfdd68"]}
        xData={lineData.xData}
        yName={'次/课程'}
        data={lineData.data}
        selectList={props.selectList}
        timeType={props.params.timeType}
      />
    </F>
  );
}
