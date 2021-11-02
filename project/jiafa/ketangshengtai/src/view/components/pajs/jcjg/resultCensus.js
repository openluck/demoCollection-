import React, { useState, useEffect } from "react"
import "../../../../style/pajs/jcjg/resultCensus.scss"
import ReactEcharts from 'echarts-for-react';
import { getAutoWarnReq, getHumanCheckReq } from "./checkResultReq"
import { PaDatesPonent } from "../../topPonent";
import { message } from "antd";
import moment from 'moment';
import noneData from "../../../../media/picture/noneData.png"

export default function ResultCensus() {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [resultInfo, setResultInfo] = useState({})


  useEffect(() => {
    let pr = {
      startTime: startTime,
      endTime: endTime
    }
    if (startTime && endTime) {
      getAutoWarn(pr)
      getHumanCheck(pr)
    }
  }, [startTime, endTime])

  //告警top5数据
  const [roomInfo, setRoomInfo] = useState([])
  const [roomNameList, setRoomNameList] = useState([])
  const [roomNumList, setRoomNumList] = useState([])

  useEffect(() => {
    if (roomInfo.length > 0) {
      let temp = [], tempXData = [], tempYData = [];
      let temp2 = []
      roomInfo?.map((item, index) => {
        tempXData.push(item.warnRoomNum);
        tempYData.push(item.warnAreaName);
      })
      // roomInfo?.map((item, index) => { temp.push(`${index + 1}、${item?.warnAreaName}`) })
      roomInfo?.map((item, index) => { temp2.push(item?.warnRoomNum) })
      // tempXData.reverse();
      // tempYData.reverse();
      temp.reverse()
      temp2.reverse()
      setRoomNameList({ xData: tempXData, yData: tempYData });
      // setRoomNameList(temp)
      setRoomNumList(temp2)
    }
  }, [roomInfo])

  //告警趋势
  const [trendInfo, setTrendInfo] = useState([])
  const [dateList, setDateList] = useState([])
  const [warnNumList, setWarnNumList] = useState([])
  useEffect(() => {
    let temp = []
    let temp2 = []
    trendInfo.map((item, index) => {
      let date = item.date;
      temp.push(date ? moment(new Date(date)).format('MM-DD') : '');
    })
    trendInfo.map((item, index) => { temp2.push(item.warnNum) })
    // console.log(temp);
    setDateList(temp)
    setWarnNumList(temp2)
  }, [trendInfo])

  // useEffect(() => {
  //   console.log(warnNumList)
  // }, [warnNumList])

  //检查教室数
  const [checkRoomNum, setCheckRoomNum] = useState("")
  const [checkRecordNum, setCheckRecordNum] = useState("")

  //安全事件分布
  const [pieData, setPieData] = useState([])
  const [usefulPie, setUsefulPie] = useState([])
  useEffect(() => {
    let temp = []
    let sum = 0
    pieData.map((item, index) => {
      if (index < 5) {
        sum += Number(item.rate)
        temp.push({
          value: Number(item.rate),
          name: `${item.eventName}(${parseInt(Number(item.rate) * 100)}%)`
        })
      }
    })
    if (pieData.length > 5) {
      console.log(Number(1 - sum).toString().ind)
      temp.push({
        value: Number(1 - sum),
        name: Number(1 - sum).toString().indexOf(".") == 1 ? `其他(${(1 - sum).toFixed(2) * 100}%)` : `其他(${(1 - sum) * 100}%)`
      })
    }
    console.log(sum)
    console.log(temp)
    setUsefulPie(temp)
  }, [pieData])

  //检查记录数top5
  const [checkRoomInfo, setCheckRoomInfo] = useState([])
  const [checkNameList, setCheckNameList] = useState([])
  const [checkNumList, setCheckNumList] = useState([])
  useEffect(() => {
    let temp = []
    let temp2 = []
    checkRoomInfo.map((item, index) => { temp.push(item.warnAreaName) })
    checkRoomInfo.map((item, index) => { temp2.push(item.warnRoomNum) })
    // temp.reverse()
    // temp2.reverse()
    setCheckNameList(temp)
    setCheckNumList(temp2)
  }, [checkRoomInfo])

  //检查记录数趋势
  const [checkTrendInfo, setCheckTrendInfo] = useState([])
  const [checkDateList, setCheckDateList] = useState([])
  const [checkWarnNumList, setCheckWarnNumList] = useState([])
  useEffect(() => {
    let temp = []
    let temp2 = []
    checkTrendInfo.map((item, index) => { temp.push(item.date ? moment(new Date(item.date)).format('MM-DD') : '') })
    checkTrendInfo.map((item, index) => { temp2.push(item.warnNum) })
    // temp.reverse()
    // temp2.reverse()
    setCheckDateList(temp)
    setCheckWarnNumList(temp2)
  }, [checkTrendInfo])


  const getAutoWarn = async pr => {
    let { data } = await getAutoWarnReq(pr)
    if (data.result) {
      setResultInfo({ ...data.data.resultInfo })
      setRoomInfo([...data.data.roomInfo])
      setTrendInfo([...data.data.trendInfo])
    }
    else {
      message.warning(data.message)
    }
  }

  const getHumanCheck = async pr => {
    let { data } = await getHumanCheckReq(pr)
    if (data.result) {
      console.log(data.data)
      setCheckRoomNum(data.data.checkRoomInfo.roomNum)
      setCheckRecordNum(data.data.checkRoomInfo.recordNum)
      setPieData([...data.data.eventPieInfo])
      setCheckRoomInfo([...data.data.checkRecordInfo])
      setCheckTrendInfo([...data.data.trendInfo])
    }
    else {
      message.warning(data.message)
    }
  }

  function SquareItem(props) {
    return <div className="ll-squareItem">
      <div>
        <span className="ll-numStyle">{props.num}</span>{props.unit}
      </div>
      <div>{props.dataName}</div>
    </div>
  }

  return <div className="ll-resultCensus">
    <div style={{ margin: -20, paddingBottom: 30 }}>
      <PaDatesPonent
        paDateChan={value => {
          setStartTime(value[0])
          setEndTime(value[1])
        }}
      />
    </div>
        自动告警统计
    <div className="ll-rc-first">
      <div className="ll-first-left">
        <div className="ll-imgTitle">结果统计</div>
        {
          resultInfo ?
            <div style={{ width: "100%", padding: "0 50px" }}>
              <SquareItem num={resultInfo?.controlRoomNum ?? "-"} dataName="监控教室数" unit="间" />
              <SquareItem num={resultInfo?.warnRoomNum ?? "-"} dataName="确认告警教室数" unit="间" />
              <SquareItem num={resultInfo?.confirmWarnNum ?? "-"} dataName="确认告警数" unit="间" />
            </div>
            : <div className='mj-scl-noneData' style={{ margin: 0, width: "100%", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ width: "100%" }}>
                <img src={noneData} />
              </div>
              <p>暂无数据</p>
            </div>
        }
      </div>
      <div className="ll-first-right">
        {
          roomInfo.length > 0 ?
            <div className='mj-scl-noneData' style={{ marginTop: 0 }}>
              <div
                className="ll-imgTitle"
                style={{ display: "flex", justifyContent: "flex-start", }}
              >确认告警数（教室）TOP5</div>
              <ReactEcharts
                option={{
                  grid: { containLabel: true, top: 20, bottom: 0 },
                  xAxis: {
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    minInterval: 1,
                    show: false,
                  },
                  yAxis: {
                    type: "category",
                    inverse: true,//倒叙
                    splitLine: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                      interval: 0,
                      // formatter: function (value, index) {
                      //   let ind = index + 1;
                      //   let txt = ind === 1 ? '{a|' + ind + '}' + ' ' + value :
                      //     ind === 2 ? '{b|' + ind + '}' + ' ' + value :
                      //       ind === 3 ? '{c|' + ind + '}' + ' ' + value :
                      //         '{d|' + ind + '}' + ' ' + value
                      //   return txt
                      // },
                      rich: {
                        a: {
                          backgroundColor: '#f98989',
                          color: '#fff',
                          padding: [4, 6, 4, 6],
                          textAlign: 'center',
                          borderRadius: 20,
                        },
                        b: {
                          backgroundColor: '#fa965f',
                          color: '#fff',
                          padding: [4, 6, 4, 6],
                          textAlign: 'center',
                          borderRadius: 20,
                        },
                        c: {
                          backgroundColor: '#eecf8c',
                          color: '#fff',
                          padding: [4, 6, 4, 6],
                          textAlign: 'center',
                          borderRadius: 20,
                        },
                        d: {
                          backgroundColor: '#d5dee6',
                          padding: [4, 6, 4, 6],
                          textAlign: 'center',
                          borderRadius: 20,
                        }
                      }
                    },
                    offset: 10,
                    nameTextStyle: { fontSize: 12 },
                    // data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
                    data: roomNameList.yData
                  },
                  splitLine: { show: false },
                  series: [
                    {
                      type: 'bar',
                      // data: [9, 7, 5, 4, 3, 1],
                      data: roomNameList.xData,
                      barBorderRadius: 4,
                      color: '#f89779',
                      barWidth: 14,
                      barGap: 10,
                      smooth: true,
                      label: {
                        normal: {
                          show: true,
                          position: "right",
                          offset: [5, -2],
                          textStyle: {
                            color: "black",
                            fontSize: 12
                          }
                        }
                      }
                    }
                  ]
                }
                }
              />
            </div> :
            <div className='mj-scl-noneData' style={{ marginTop: 0 }}>
              <div className="ll-imgTitle"
                style={{
                  display: "flex",
                  // alignSelf:"flex-start",
                  justifyContent: "flex-start",
                }}
              >确认告警数（教室）TOP5</div>
              <img src={noneData} />
              <p>暂无数据</p>
            </div>
        }
      </div>
    </div>


    <div className="ll-rc-second">
      {
        warnNumList.length > 0 ?
          <ReactEcharts
            option={{
              color: ["#30bf99"],
              title: {
                text: '确认告警趋势',
              },
              grid: { left: '3%', bottom: 20, right: 40 },
              tooltip: {
                trigger: "item",
                show: true,
                formatter: '{b0}: {c0}条'
              },
              xAxis: {
                type: 'category',
                data: dateList,
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#e6e7eb'
                  }
                },
                axisTick: { show: false },
                axisLine: {
                  lineStyle: {
                    color: '#e6e7eb'
                  }
                },
                axisLabel: {
                  color: '#797c80'
                }
              },
              yAxis: {
                type: 'value',
                axisTick: { show: false },
                splitLine: {
                  show: true,
                  lineStyle: { color: '#e6e7eb' }
                },
                axisTick: { show: false },
                axisLine: {
                  lineStyle: {
                    color: '#e6e7eb'
                  }
                },
                axisLabel: {
                  color: '#797c80'
                }
              },
              series: [{
                data: warnNumList,
                type: 'line',
                smooth: true,
                // showSymbol: false,
                clip: true,
              }]
            }}
          /> :
          <div className='mj-scl-noneData' style={{ marginTop: 0 }}>
            <div className="ll-imgTitle"
              style={{ display: "flex", justifyContent: "flex-start", }}
            >确认告警趋势</div>
            <img src={noneData} />
            <p>暂无数据</p>
          </div>
      }
    </div>

        人工检查统计
      <div className="ll-rc-third">
      <div className="ll-third-left">
        <div className="ll-imgTitle" style={{ marginTop: 0, textAlign: "left" }}>检查教室数</div>
        <div>
          <SquareItem num={checkRoomNum} dataName="检查教室数" unit="间" />
        </div>
        <div>
          <SquareItem num={checkRecordNum} dataName="检查记录条数" unit="条" />
        </div>
      </div>
      <div className="ll-third-middle">
        {
          usefulPie.length > 0 ?
            <ReactEcharts
              option={{
                color: ["#63d6d6", "#61c2f4", "#eade8c", "#f19488", "#b998fa", "#feceff"],
                title: {
                  text: '安全事件分布',
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}'
                },
                series: [
                  {
                    name: '安全事件分布',
                    type: 'pie',
                    roseType: 'area',
                    type: 'pie',
                    radius: [20, 110],
                    // center: ['75%', '50%'],
                    roseType: 'area',
                    data: usefulPie
                  }
                ]
              }}
            /> :
            <div className='mj-scl-noneData' style={{ marginTop: 0 }}>
              <div className="ll-imgTitle"
                style={{ display: "flex", justifyContent: "flex-start", }}
              >安全事件分布</div>
              <img src={noneData} />
              <p>暂无数据</p>
            </div>
        }
      </div>
      <div className="ll-third-right">
        {
          checkNumList?.length > 0 ?
            <ReactEcharts
              option={{
                grid: { containLabel: true, top: 20, bottom: 0 },
                title: {
                  text: '检查记录数（教室）TOP5',
                },
                xAxis: {
                  axisLine: { show: false },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  minInterval: 1,
                  show: false,
                },
                yAxis: {
                  type: "category",
                  inverse: true,//倒叙
                  splitLine: { show: false },
                  axisLine: { show: false },
                  axisTick: { show: false },
                  axisLabel: {
                    interval: 0,
                    // formatter: function (value, index) {
                    //   let ind = index + 1;
                    //   let txt = ind === 1 ? '{a|' + ind + '}' + ' ' + value :
                    //     ind === 2 ? '{b|' + ind + '}' + ' ' + value :
                    //       ind === 3 ? '{c|' + ind + '}' + ' ' + value :
                    //         '{d|' + ind + '}' + ' ' + value
                    //   return txt
                    // },
                    rich: {
                      a: {
                        backgroundColor: '#f98989',
                        color: '#fff',
                        padding: [4, 6, 4, 6],
                        textAlign: 'center',
                        borderRadius: 20,
                      },
                      b: {
                        backgroundColor: '#fa965f',
                        color: '#fff',
                        padding: [4, 6, 4, 6],
                        textAlign: 'center',
                        borderRadius: 20,
                      },
                      c: {
                        backgroundColor: '#eecf8c',
                        color: '#fff',
                        padding: [4, 6, 4, 6],
                        textAlign: 'center',
                        borderRadius: 20,
                      },
                      d: {
                        backgroundColor: '#d5dee6',
                        padding: [4, 6, 4, 6],
                        textAlign: 'center',
                        borderRadius: 20,
                      }
                    }
                  },
                  offset: 10,
                  nameTextStyle: { fontSize: 12 },
                  // data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
                  data: checkNameList
                },
                splitLine: { show: false },
                series: [
                  {
                    type: 'bar',
                    // data: [9, 7, 5, 4, 3, 1],
                    data: checkNumList,
                    barBorderRadius: 4,
                    color: '#30bf99',
                    barWidth: 14,
                    barGap: 10,
                    smooth: true,
                    label: {
                      normal: {
                        show: true,
                        position: "right",
                        offset: [5, -2],
                        textStyle: {
                          color: "black",
                          fontSize: 12
                        }
                      }
                    }
                  }
                ]


                // color: ["#30bf99"],
                // title: {
                //   text: '检查记录数（教室）TOP5',
                // },
                // tooltip: {
                //   trigger: 'axis',
                //   axisPointer: {
                //     type: 'shadow'
                //   }
                // },
                // grid: {
                //   left: '3%',
                //   right: '4%',
                //   bottom: '3%',
                //   containLabel: true
                // },
                // xAxis: {
                //   type: 'value',
                //   boundaryGap: [0, 0.01]
                // },
                // yAxis: {
                //   type: 'category',
                //   data: checkNameList
                // },
                // series: [
                //   {
                //     name: '确认告警数',
                //     type: 'bar',
                //     data: checkNumList
                //   },
                // ]
              }}
            /> :
            <div className='mj-scl-noneData' style={{ marginTop: 0 }}>
              <div className="ll-imgTitle"
                style={{
                  display: "flex",
                  // alignSelf:"flex-start",
                  justifyContent: "flex-start",
                }}
              >检查记录数（教室）TOP5</div>
              <img src={noneData} />
              <p>暂无数据</p>
            </div>
        }
      </div>
    </div>
    <div className="ll-rc-fourth">
      {
        checkWarnNumList.length > 0 ?
          <ReactEcharts
            option={{
              color: ["#30bf99"],
              title: {
                text: '检查记录数趋势',
              },
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: '{b0}: {c0}条'
              },
              grid: {
                left: "3%"
              },
              xAxis: {
                type: 'category',
                data: checkDateList,
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#e6e7eb'
                  }
                },
                axisTick: { show: false },
                axisLine: {
                  lineStyle: {
                    color: '#e6e7eb'
                  }
                },
                axisLabel: {
                  color: '#797c80'
                }
              },
              yAxis: {
                type: 'value',
                axisTick: { show: false },
                splitLine: {
                  show: true,
                  lineStyle: { color: '#e6e7eb' }
                },
                axisTick: { show: false },
                axisLine: {
                  lineStyle: {
                    color: '#e6e7eb'
                  }
                },
                axisLabel: {
                  color: '#797c80'
                }
              },
              series: [{
                // data: checkWarnNumList,
                data: checkWarnNumList,
                type: 'line',
                smooth: true,
                // showSymbol: false,
                clip: true,
              }]
            }}
          /> : <div className='mj-scl-noneData' style={{ marginTop: 0 }}>
            <div className="ll-imgTitle"
              style={{
                display: "flex",
                // alignSelf:"flex-start",
                justifyContent: "flex-start",
              }}
            >检查记录趋势</div>
            <img src={noneData} />
            <p>暂无数据</p>
          </div>
      }
    </div>

  </div>
}