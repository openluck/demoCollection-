/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-30 13:17:45
 */

/**
 * @description 学院画像-教学分析
 */

import React, { Fragment as F, useState, useEffect } from "react";
import CollegeComHead from "./collegeComHead";
import { message } from "antd";
import { getConfigData } from './../../../../config/actionConfig.js';
import CollegeComTeaAna_Module from "./collegeComTeaAna_Module";
import {
  getCollegeTeaBehPie,
  getCollegeDesPie,
  getCollegeTypePie,
  getCollegeTeaBehLine,
  getCollegeDesLine,
  getCollegeTypehLine
} from "./../../../../request/yrj_college_request";
export default function CollegeComTeaAna (props) {
  const pieColor = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137'],
    lineColor = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137']

  const [teaBehPie, setTeaBehPie] = useState({
    legend: ["板书", "巡视", "多媒体"],
    pieScaleData: "loading"
  }); //老师行为饼图
  const [teaBehLine, setTeaBehLine] = useState({
    legend: ["板书", "巡视", "多媒体"],
    xData: "loading",
    yData: "loading",
  }); //老师行为线路

  const [teaDesPie, setTeaDesPie] = useState({
    legend: ["学生自习", "学生展示", "生生互动", "教师讲授", "师生互动"],
    pieScaleData: "loading"
  }); //老师设计饼图

  const [teaDesLine, setTeaDesLine] = useState({
    legend: ["学生自习", "学生展示", "生生互动", "教师讲授", "师生互动"],
    xData: "loading",
    yData: "loading",
  }); //老师设计线图

  const [classTypePie, setClassTypePie] = useState({
    legend: ['讲授型', '对话型', '混合型', '练习型'],
    pieScaleData: "loading"
  }); //课堂类型饼图

  const [classTypeLine, setClassTypeLine] = useState({
    legend: ['讲授型', '对话型', '混合型', '练习型'],
    xData: "loading",
    yData: "loading",
  }); //课堂类型线图
  useEffect(() => {
    // getCollegeTeaBehPieData();
    getCollegeDesPieData();
    getCollegeTypePieData();
    // getCollegeTeaBehLineData();
    getCollegeDesLineData();
    getCollegeTypehLineData();
  }, [props.couTypeId, props.selTime, props.semesterId, props.timeType])
  //教师行为饼图
  const getCollegeTeaBehPieData = () => {
    let params = {
      ...props.params
    }
    setTeaBehPie({
      ...teaBehPie,
      pieScaleData: "loading"
    });
    getCollegeTeaBehPie(params).then((res) => {
      let data = res.data.data;
      if (data && res.data.result) {
        if ((data.boardWrite || data.boardWrite == 0) &&
          (data.boardWrite || data.boardWrite == 0) &&
          (data.patrol || data.patrol == 0)
        ) {
          setTeaBehPie({
            ...teaBehPie,
            pieScaleData: [{
              name: '板书',
              prop: data.boardWrite,
            },
            {
              name: "巡视",
              prop: data.patrol,
            },
            {
              name: "多媒体",
              prop: data.media,
            }]
          })
        } else {
          setTeaBehPie({
            ...teaBehPie,
            pieScaleData: ""
          });
        }

      } else {
        setTeaBehPie({
          ...teaBehPie,
          pieScaleData: ""
        });
        if (!res.data.result) {
          message.error(data.message);
        }
      }
    })
  }
  //教学设计饼图
  const getCollegeDesPieData = () => {
    let params = {
      ...props.params
    }
    setTeaDesPie({
      ...teaDesPie,
      pieScaleData: "loading"
    });
    getCollegeDesPie(params).then((res) => {
      let data = res.data.data;
      if (data && res.data.result) {
        if ((data.stuLearn || data.stuLearn == 0) &&
          (data.stuShow || data.stuShow == 0) &&
          (data.stuInteract || data.stuInteract == 0) &&
          (data.teaching || data.teaching == 0) &&
          (data.tsInteract || data.tsInteract == 0)
        ) {
          setTeaDesPie(
            {
              ...teaDesPie,
              pieScaleData: [{
                name: '学生自习',
                prop: data.stuLearn
              },
              {
                name: "学生展示",
                prop: data.stuShow
              },
              {
                name: "生生互动",
                prop: data.stuInteract
              },
              {
                name: "教师讲授",
                prop: data.teaching
              },
              {
                name: "师生互动",
                prop: res.data.data.tsInteract
              }]
            }
          );
        } else {
          setTeaDesPie({
            ...teaDesPie,
            pieScaleData: ""
          });
        }

      } else {
        setTeaDesPie({
          ...teaDesPie,
          pieScaleData: ""
        });
        if (!res.data.result) {
          message.error(data.message);
        }
      }
    })
  }
  //课堂类型饼图
  const getCollegeTypePieData = () => {
    let params = {
      ...props.params
    }
    setClassTypePie({
      ...classTypePie,
      pieScaleData: "loading"
    });
    getCollegeTypePie(params).then((res) => {
      let data = res.data.data;
      if (data && res.data.result) {
        if ((data.teachingT || data.teachingT == 0) &&
          (data.exeT || data.exeT == 0) &&
          (data.mixT || data.mixT == 0) &&
          (data.chatT || data.chatT == 0)
        ) {
          setClassTypePie(
            {
              ...classTypePie,
              pieScaleData: [{
                name: '讲授型',
                prop: res.data.data.teachingT
              },
              {
                name: "练习型",
                prop: res.data.data.exeT
              },
              {
                name: "混合型",
                prop: res.data.data.mixT
              },
              {
                name: "对话型",
                prop: res.data.data.chatT
              }]
            });
        } else {
          setClassTypePie({
            ...classTypePie,
            pieScaleData: ""
          });
        }

      } else {
        setClassTypePie({
          ...classTypePie,
          pieScaleData: ""
        });
        if (!res.data.result) {
          message.error(data.message);
        }
      }
    })
  }
  //教师行为线图
  const getCollegeTeaBehLineData = () => {
    let params = {
      ...props.params
    }
    setTeaBehLine({
      ...teaBehLine,
      xData: "loading",
      yData: "loading",
    });
    getCollegeTeaBehLine(params).then((res) => {
      if (res.data.data && res.data.result) {
        let teaData = getConfigData(res.data.data, 1)
        if (teaData.boardWrite && teaData.boardWrite.date.length !== 0) {
          setTeaBehLine({
            ...teaBehLine,
            xData: teaData.boardWrite.date,
            yData: [
              teaData.boardWrite.num,
              teaData.patrol.num,
              teaData.media.num,
            ]
          })
        } else {
          setTeaBehLine({
            ...teaBehLine,
            xData: "",
            yData: "",
          });
        }
      } else {
        setTeaBehLine({
          ...teaBehLine,
          xData: "",
          yData: "",
        });
        if (!res.data.result) {
          message.error(data.message);
        }
      }
    })
  }
  //教师设计线图
  const getCollegeDesLineData = () => {
    let params = {
      ...props.params
    }
    setTeaDesLine({
      ...teaDesLine,
      xData: "loading",
      yData: "loading",
    });
    getCollegeDesLine(params).then((res) => {
      if (res.data.data && res.data.result) {
        let teaData = getConfigData(res.data.data, 2)
        if (teaData && teaData.stuShow && teaData.stuShow.date.length !== 0) {
          setTeaDesLine({
            ...teaDesLine,
            xData: teaData.stuShow.date,
            yData: [
              teaData.stuLearn.num,
              teaData.stuShow.num,
              teaData.stuInteract.num,
              teaData.teaching.num,
              teaData.tsInteract.num,
            ]
          })
        } else {
          setTeaDesLine({
            ...teaDesLine,
            xData: "",
            yData: "",
          });
        }
      } else {
        setTeaDesLine({
          ...teaDesLine,
          xData: "",
          yData: "",
        });
        if (!res.data.result) {
          message.error(data.message);
        }
      }
    })
  }
  //课堂类型线图
  const getCollegeTypehLineData = () => {
    let params = {
      ...props.params
    }
    setClassTypeLine({
      ...classTypeLine,
      xData: "loading",
      yData: "loading",
    });
    getCollegeTypehLine(params).then((res) => {
      if (res.data.data && res.data.result) {
        let teaData = getConfigData(res.data.data, 3)
        if (teaData && teaData.teachingT && teaData.teachingT.date.length !== 0) {
          setClassTypeLine({
            ...classTypeLine,
            xData: teaData.teachingT.date,
            yData: [
              teaData.teachingT.num,
              teaData.chatT.num,
              teaData.mixT.num,
              teaData.exeT.num
            ]
          })
        } else {
          setClassTypeLine({
            ...classTypeLine,
            xData: "",
            yData: "",
          });
        }
      } else {
        setClassTypeLine({
          ...classTypeLine,
          xData: "",
          yData: "",
        });
        if (!res.data.result) {
          message.error(data.message);
        }
      }
    })

  }
  return (
    <F>
      {/* <CollegeComHead title={"教学分析"} /> */}
      {/* v1.21版本删除 */}
      {/* <CollegeComTeaAna_Module
        title="教师行为"
        legend={teaBehPie.legend}
        lineColor={lineColor}
        xData={teaBehLine.xData}
        yData={teaBehLine.yData}
        pieColor={pieColor}
        pieRadius={[45, 60]}
        pieType={2}
        pieTitle={"课程"}
        pieScaleData={teaBehPie.pieScaleData}
        type={props.params.timeType}
      /> */}
      <CollegeComTeaAna_Module
        title="教师设计"
        legend={teaDesPie.legend}
        lineColor={lineColor}
        xData={teaDesLine.xData}
        yData={teaDesLine.yData}
        pieColor={pieColor}
        pieRadius={[45, 60]}
        pieType={2}
        pieTitle={"课程"}
        pieScaleData={teaDesPie.pieScaleData}
        type={props.params.timeType}
      />
      <CollegeComTeaAna_Module
        title="课堂类型"
        legend={classTypePie.legend}
        lineColor={lineColor}
        xData={classTypeLine.xData}
        yData={classTypeLine.yData}
        pieColor={pieColor}
        pieRadius={[45, 60]}
        pieType={2}
        pieTitle={"课程"}
        pieScaleData={classTypePie.pieScaleData}
        type={props.params.timeType}
      />
    </F>
  );
}
