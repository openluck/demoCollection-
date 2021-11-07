/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-25 10:06:24
 */

/**
 * @description 学院画像-多媒体
 */

import React, { Fragment as F, useState, useEffect } from "react";
import CollegeComHead from "./collegeComHead";
import CollegeComClu from "./collegeComClu";
import CollegeComLine from "./collegeComLine";
import CollegeMediaPart1 from "./collegeMediaPart1";
import { message } from "antd";
import {
  getCollegeMediaAtten,
  getCollegeMediaAttenAna,
  getCollegeMediaAna,
  getCollegeMediaAttenLine
} from "./../../../../request/yrj_college_request";
import { getXyQsData } from './../scl_image/scl_public_function.js';

const selArr = [...Array(2).keys()].map((i, index) => i = {
  courseId: undefined, courseName: undefined, ind: index + 1
})

export default function CollegeComMedia(props) {
  const [meidaUseProp, setMeidaUseProp] = useState(0);
  const [meidaUseCont, setMeidaUseCont] = useState("loading");
  const [sortClassValue, setSortClassValue] = useState("0");
  const [sortTeaValue, setSortTeaValue] = useState("0");
  const [collegeIdOne, setCollegeIdOne] = useState([]);
  const [collegeIdTwo, setCollegeIdTwo] = useState([]);

  // const [lineCheckType, setLineCheckType] = useState(1); //1	正常 2	迟到 3	早退 4	缺勤 5	调换课
  const [classBarData, setClassBarData] = useState("loading"); //课程对比分析 柱状图数据
  const [teaBarData, setTeaBarData] = useState("loading"); //教师对比分析 柱状图数据
  const [lineData, setLineData] = useState({
    xData: [],
    data: []
  }); //线图数据
  // 下拉选中对象 [{teaClaId: '', teaClaName: '', ind: 0}]
  const [selClass, setSelClass] = useState([{ courseId: '', courseName: '全部', ind: 0 }, ...selArr]);

  //课程改变
  function classSortChange(e) {
    setSortClassValue(e);
    // let params = {
    //   semesterId: '2019_2020_2',
    //   collegeId: '0507000',
    //   couTypeId: '0',
    //   selTime: '2020-02-24',
    //   timeType: '1',
    //   courseId: '',
    //   sortType: String(e)
    // }
    let params = {
      ...props.params, sortType: String(e)
    }
    getCollegeMediaAttenAnaData(params)
    //请求数据
  }

  //教师对比改变
  function teaSortChange(e) {
    setSortTeaValue(e);
    // let params = {
    //   semesterId: '2019_2020_2',
    //   collegeId: '0507000',
    //   couTypeId: '0',
    //   selTime: '2020-02-24',
    //   timeType: '1',
    //   courseId: '',
    //   sortType: String(e)
    // }
    let params = {
      ...props.params, sortType: String(e)
    }
    getCollegeMediaAnaData(params)
    //请求数据
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

  /**
   * 请求折线数据
   * @param {*} id 选中id
   * @param {*} index 下拉下标
   */
  const getCollegeAttenTrendData = (id, index) => {
    let params = {
      ...props.params, courseId: id
    }
    getCollegeMediaAttenLine(params).then(res => {
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

  // 获取多媒体基础信息
  function getCollegeMediaAttenData(params) {
    getCollegeMediaAtten(params).then(res => {
      let data = res.data;
      if (data.data && data.result) {
        setMeidaUseProp(data.data.normalProp)
        setMeidaUseCont({
          name: data.data.checkProp.name,
          prop: data.data.checkProp.changeProp,
          sortType: data.data.checkProp.sortType
        })
      } else {
        setMeidaUseProp()
        setMeidaUseCont()
      }
    })
  }

  // 获取课程对比数据
  function getCollegeMediaAttenAnaData(params) {
    getCollegeMediaAttenAna(params).then(res => {
      let data = res.data;
      if (data.data.length && data.result) {
        let xData = [], yData = [];
        data.data.forEach(item => {

          xData.push(item.name)
          yData.push(item.prop)
        });
        setClassBarData({
          xData, yData
        })

      } else {
        setClassBarData()
      }
    })
  }

  // 获取教师对比数据
  function getCollegeMediaAnaData(params) {
    getCollegeMediaAna(params).then(res => {
      let data = res.data;
      if (data.data.length && data.result) {
        let xData = [], yData = [];
        data.data.forEach(item => {

          xData.push(item.name)
          yData.push(item.prop)
        });
        setTeaBarData({
          xData, yData
        })
      } else {
        setTeaBarData()
      }
    })
  }

  function getCollegeMediaAttenLineData(params) {
    getCollegeMediaAttenLine(params).then(res => {
      let data = res.data;
      console.log(res)
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
      } else {

      }
    })
  }

  const [params, setParams] = useState(); //监听参数
  useEffect(() => {
    if (props.params) {
      // console.log("页面加载",JSON.stringify(props.params),params,JSON.stringify(props.params)!==params)
      if (JSON.stringify(props.params) !== params) {
        // setMeidaUseProp(0);//多媒体使用率
        // setMeidaUseCont({
        //   name: "较上周同期",
        //   prop: 5,
        //   sortType: 1
        // });//多媒体使用率对比
        console.log(props.params)
        // let params = {
        //   semesterId: '2019_2020_2',
        //   collegeId: '0507000',
        //   couTypeId: '0',
        //   selTime: '2020-02-24',
        //   timeType: '1',
        //   courseId: '',
        //   checkType: '1',
        //   sortType: '1'
        // }
        let params = {
          ...props.params
        }
        getCollegeMediaAttenData(params)
        getCollegeMediaAttenAnaData({ ...params, sortType: '1' })
        getCollegeMediaAnaData({ ...params, sortType: '1' })
        getCollegeMediaAttenLineData({ ...params, courseId: '' })
        //重置
        setSortClassValue("0");
        setSortTeaValue("0");
        setCollegeIdOne([]);
        setCollegeIdTwo([]);

        setParams(JSON.stringify(props.params)); //比对 且请求数据
      }
    }
  });

  return (
    <F>
      {/* <CollegeComHead title={"多媒体使用率"} /> */}
      <CollegeMediaPart1
        meidaUseProp={meidaUseProp}
        meidaUseCont={meidaUseCont}
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
        title={"多媒体使用率趋势"}
        showTable={false}
        collegeIdOne={collegeIdOne}
        collegeIdTwo={collegeIdTwo}
        idCallBack={onChangeSelect}
        // checkType={lineCheckType}
        // checkCallback={e => lineCheckChange(e)}
        color={["#3385ff", "#4ecc7b", "#cfdd68"]}
        xData={lineData.xData}
        data={lineData.data}
        selectList={props.selectList}
        timeType={props.params.timeType}
      />
    </F>
  );
}
