/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-08-05 14:35:23
 */

/**
 * @description 学院画像-学生反馈
 */

import React, { Fragment as F, useState, useEffect } from "react";
import CollegeComHead from "./collegeComHead";
import CollegeComTeaAna_Module from "./collegeComTeaAna_Module";
import CollageZhqk from './college_zhqk';
import { getConfigData } from './../../../../config/actionConfig.js';
import { message } from "antd";
import {
  getCollegeBehPie,
  getCollegeFacPie,
  getCollegeFacLine,
  getCollegeBehLine,
  getColStuZhRade,
  getColStuZhLine
} from "./../../../../request/yrj_college_request";
export default function CollegeComStuFeedBack(props) {
  const pieColor = [
    "#975fe5",
    "#4ecb73",
    "#3aa1ff",
    "#eed46d",
    "#f47a8f",
    '#a9d13d',
    '#646fe2'
  ],
    lineColor = ["#59c99b", "#7ad8e3", "#cfa4e3", "#000"];
  const [stuBehPie, setStuBehPie] = useState({
    pieScaleData: "loading"
  }); //学生行为饼图
  const [stuBehLine, setStuBehLine] = useState({
    legend: [],
    xData: "loading",
    yData: "loading",
  }); //学生行为线图

  const [stuFacePie, setStuFacePie] = useState({
    pieScaleData: "loading"
  }); //学生表情

  const [stuFaceLine, setStuFaceLine] = useState({
    legend: [],
    xData: "loading",
    yData: "loading",
  }); //学生表情
  const [zhqkPieLoading, setZhqkPieLoading] = useState(true); //综合情况雷达图loading
  const [zhqkLineLoading, setZhqkLineLoading] = useState(true);//综合情况线图数据loading
  const [zhqkPie, setZhqkPie] = useState([]);    //综合情况雷达图数据
  const [zhqkLine, setZhqkLine] = useState({}); //综合情况线图数据
  const [params, setParams] = useState(); //监听参数


  // 学生行为饼图
  function getCollegeBehPieData(params) {
    getCollegeBehPie(params).then(res => {
      let data = res.data;
      let obj = {
        read: '阅读',
        write: '书写',
        listen: '听讲',
        handUp: '举手',
        standUp: '起立',
        playPhone: '玩手机',
        onTable: '趴桌子'
      }
      let array = []
      if (data.data && data.result) {
        delete data.data.date;
        for (let i in obj) {
          array.push({
            name: obj[i],
            prop: data.data[i]
          })
        }
        // for (let i in data.data) {
        //   array.push({
        //     name: obj[i],
        //     prop: data.data[i]
        //   })
        // }
      } else {
        for (let i in obj) {
          array.push({
            name: obj[i],
            prop: 0
          })
        }
      }
      setStuBehPie({
        pieScaleData: array
      })
    })
  }

  // 学生行为线图
  function getCollegeBehLineData(params) {
    getCollegeBehLine(params).then(res => {
      let data = res.data;
      let obj = {
        read: '阅读',
        write: '书写',
        listen: '听讲',
        handUp: '举手',
        standUp: '起立',
        playPhone: '玩手机',
        onTable: '趴桌子'
      }
      let xData = [], array = [], yData = []
      let legend = []
      let $obj = {
        read: [],
        write: [],
        listen: [],
        handUp: [],
        standUp: [],
        playPhone: [],
        onTable: []
      }
      if (data.data.length && data.result) {
        data.data.forEach(item => {
          xData.push(item.date)
        });
        for (let i in data.data) {
          let item = data.data[i]
          delete item.date;
          for (let j in item) {
            $obj[j].push(item[j])
          }
        }
        for (let i in $obj) {
          array.push({
            name: obj[i],
            value: $obj[i]
          })
          legend.push(obj[i])
          yData.push($obj[i])
        }
        setStuBehLine({
          legend:['阅读', '书写', '听讲', '举手', '起立', '玩手机', '趴桌子'],
          xData: xData,
          yData: yData
        })
       
        // setStuBehLine(getConfigData(res.data.data, 4))
      } else {
        setStuBehLine({
          legend: []
        })
      }
    })
  }

  // 学生表情饼图
  function getCollegeFacPieData(params) {
    getCollegeFacPie(params).then(res => {
      let data = res.data;
      let obj = {
        happy: '高兴',
        scare: '害怕',
        neuter: '中性',
        amzed: '惊讶',
        anger: '愤怒',
        sad: '伤心',
        detest: '厌恶'
      }
      let array = [];
      let $data;
      if (data.data && data.result) {
        delete data.data.date;
        // $data = data.data;
        // for (let i in data.data) {
        //   array.push({
        //     name: obj[i],
        //     prop: data.data[i]
        //   })
        // }
        for (let i in obj) {
          array.push({
            name: obj[i],
            prop: data.data[i]
          })
        }
        setStuFacePie({
          pieScaleData: array
        })
      } else {
         for (let i in obj) {
          array.push({
            name: obj[i],
            prop: 0
          })
        }
        setStuFacePie({
          pieScaleData: array
        })
       
      }

    })
  }

  // 学生表情线图
  function getCollegeFacLineData(params) {
    getCollegeFacLine(params).then(res => {
      let data = res.data;
      let obj = {
        happy: '高兴',
        scare: '害怕',
        neuter: '中性',
        amzed: '惊讶',
        anger: '愤怒',
        sad: '伤心',
        detest: '厌恶'
      }
      let xData = [], array = [], yData = []
      let legend = []
      let $obj = {
        happy: [],
        scare: [],
        neuter: [],
        amzed: [],
        anger: [],
        sad: [],
        detest: []
      }
      if (data.data.length && data.result) {
        data.data.forEach(item => {
          xData.push(item.date)
        });
        for (let i in data.data) {
          let item = data.data[i]
          delete item.date;
          for (let j in item) {
            $obj[j].push(item[j])
          }
        }
        for (let i in $obj) {
          array.push({
            name: obj[i],
            value: $obj[i]
          })
          legend.push(obj[i])
          yData.push($obj[i])
        }
        setStuFaceLine({
          legend: ['高兴', '害怕', '中性', '惊讶', '愤怒', '难过', '厌恶'],
          xData: xData,
          yData: yData
        })
      } else {
        setStuFaceLine({
          legend: []
        })
      }
    })
  }

   //综合情况雷达图
   function getSchStuZhRadea() {
    let params = {
      ...props.params
    }
    setZhqkPieLoading(true);
    getColStuZhRade(params).then((res) => {
      setZhqkPieLoading(false);
      if (res.data.data && res.data.result) {
        if (
          (res.data.data.involvement || res.data.data.involvement == 0) &&
          (res.data.data.concentration || res.data.data.concentration == 0) &&
          (res.data.data.activation || res.data.data.activation == 0) &&
          (res.data.data.distrust || res.data.data.distrust == 0)
        ) {
          setZhqkPie([
            res.data.data.involvement,
            res.data.data.concentration,
            res.data.data.activation,
            res.data.data.distrust]);
        } else {
          setZhqkPie([]);
        }

      } else {
        setZhqkPie([]);
      }
    },fail=>{
      setZhqkPieLoading(false);
    })
  }

  //课堂类型线图
  function getSchStuZhLinea() {
    let params = {
      ...props.params
    }
    setZhqkLineLoading(true);
    getColStuZhLine(params).then((res) => {
      setZhqkLineLoading(false);
      if (res.data.data && res.data.result) {
        setZhqkLine(getConfigData(res.data.data, 6));
      } else {
        setZhqkLine({});
      }
    },fail=>{
      setZhqkLineLoading(false);
    })
  }

  useEffect(() => {
    if (props.params) {
      // console.log("页面加载",JSON.stringify(props.params),params,JSON.stringify(props.params)!==params)
      if (JSON.stringify(props.params) !== params) {
        console.log(props.params, "params", params);
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
        getCollegeBehPieData(params)
        getCollegeBehLineData(params)
        getCollegeFacPieData(params)
        getCollegeFacLineData(params)
        getSchStuZhRadea()
        getSchStuZhLinea()
        // setStuBeh({
        //   legend: ["活跃度", "专注度", "疑惑度", "参与度"],
        //   xData: ["3-1", "3-2", "3-2", "3-2", "3-2", "3-2"],
        //   yData: [
        //     [1, 4, 19, 5, 7, 44, 123, 10],
        //     [100, 18, 154, 13, 1, 23, 44, 49],
        //     [45, 34, 21, 44, 56, 13, 16, 17]
        //   ],
        //   pieScaleData: [
        //     {
        //       name: "调换课",
        //       prop: 1300
        //     },
        //     {
        //       name: "调换课",
        //       prop: 800
        //     },
        //     {
        //       name: "调换课",
        //       prop: 700
        //     },
        //     {
        //       name: "缺勤",
        //       prop: 900
        //     }
        //   ]
        // }); //学生行为

        // setStuFace({
        //   legend: ["活跃度", "专注度", "疑惑度", "参与度"],
        //   xData: ["3-1", "3-2", "3-2", "3-2", "3-2", "3-2"],
        //   yData: [
        //     [1, 4, 19, 5, 7, 44, 123, 10],
        //     [100, 18, 154, 13, 1, 23, 44, 49],
        //     [45, 34, 21, 44, 56, 13, 16, 17]
        //   ],
        //   pieScaleData: [
        //     {
        //       name: "调换课",
        //       prop: 1300
        //     },
        //     {
        //       name: "调换课",
        //       prop: 800
        //     },
        //     {
        //       name: "调换课",
        //       prop: 700
        //     },
        //     {
        //       name: "缺勤",
        //       prop: 900
        //     }
        //   ]
        // }); //学生标签
        setParams(JSON.stringify(props.params)); //比对 且请求数据
      }
    }

  });
  return (
    <F>
      {/* <CollegeComHead title={"学生听讲反馈"} /> */}
      <CollegeComTeaAna_Module
        title="学生行为"
        legend={stuBehLine.legend}
        lineColor={pieColor}
        xData={stuBehLine.xData}
        yData={stuBehLine.yData}
        pieColor={pieColor}
        pieRadius={[45, 60]}
        pieType={2}
        pieTitle={"课程"}
        pieScaleData={stuBehPie.pieScaleData}
        type={props.params.timeType}
      />
      <CollegeComTeaAna_Module
        title="学生表情"
        legend={stuFaceLine.legend}
        lineColor={pieColor}
        xData={stuFaceLine.xData}
        yData={stuFaceLine.yData}
        pieColor={pieColor}
        pieRadius={[45, 60]}
        pieType={2}
        pieTitle={"课程"}
        pieScaleData={stuFacePie.pieScaleData}
        type={props.params.timeType}
      />
       <CollageZhqk
        zhqkPieLoading={zhqkPieLoading}
        zhqkPie={zhqkPie}
        zhqkLineLoading={zhqkLineLoading}
        params={props.params}
        zhqkLine={zhqkLine}
      />
    </F>
  );
}
