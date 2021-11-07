/*
 * @Author: luolei 
 * @Date: 2021-01-13 13:34:50 
 * @Last Modified by: xq
 * @Last Modified time: 2021-03-12 17:04:57
 */
import React, { useEffect, useState } from "react"
import "../../../style/schoolOverview.scss"
import SituationCard from "./situationCard"
import ReactEcharts from "echarts-for-react"
import { Radio, Modal, DatePicker, Button, Table, message } from "antd"
import LatePersonCard from "./latePersonCard"
import { request } from "../../../util/request"
import moment from "moment"
import { PaginationPonent } from "../common"
import PerfectScrollbar from 'react-perfect-scrollbar';


export default function SchoolOverview(props) {
    const [visible, setVisible] = useState(false)
    const [timeIntervalType, setTimeIntervalType] = useState(1)
    // const temp = moment().unix()
    const [timeList, setTimeList] = useState([])
    // const [curDate, setCurDate] = useState(moment(timeList[timeList?.length - 1]))

    //早午寝卡片数据
    const [cardData, setCardData] = useState({})

    //出寝人统计
    const [normalSignList, setNormalSignList] = useState([])
    const [notSignList, setNotSignList] = useState([])
    const [lateSignList, setLateSignList] = useState([])

    //晚寝未归弹窗页码及total
    const [curPage, setCurPage] = useState(1)
    const [total, setTotal] = useState(0)

    //晚寝最后一次时间
    const [nightTime, setNightTime] = useState("")
    const [standarTime, setStandardTime] = useState("")
    const [curDate, setCurDate] = useState("")

    //晚寝未归人员不刷新四人名片数据
    const [fourData, setFourData] = useState([])

    function getUsefulTimeList() {
        let temp = []
        timeList.map(item => {
            temp.push(moment(item).format("MM-DD"))
        })
        return temp
    }
    const usefulTimeList = getUsefulTimeList()

    const option = {
        title: {
            text: '出勤人统计',
            textStyle: {
                color: "#464849",
                fontSize: 20,
                fontWeight: "normal"
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['正常签到', '晚签到', '未签到'],
            left: "1%",
            top: 45
        },
        grid: {
            left: '1%',
            top: '30%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeList,
        },
        yAxis: {
            type: 'value',
            left: "5%"
        },
        series: [
            {
                name: '正常签到',
                type: 'line',
                // stack: '总量',
                data: normalSignList
            },
            {
                name: '晚签到',
                type: 'line',
                // stack: '总量',
                data: lateSignList
            },
            {
                name: '未签到',
                type: 'line',
                // stack: '总量',
                data: notSignList
            },
        ],
        color: ["#3687d9", "#ab64de", '#fc7272']
    }
    const [lastPersonList, setLastPersonList] = useState([])

    const columns = [
        {
            title: "学生姓名",
            dataIndex: "stuName"
        },
        {
            title: "所属宿舍",
            dataIndex: "roomName"
        },
        {
            title: "所属班级",
            dataIndex: "className"
        }
    ]

    const [modalData, setModalData] = useState([])

    useEffect(() => {
        getOverview()
        // getLastResult()
    }, [])

    // useEffect(() => {
    //     if (nightTime?.length > 0) {
    //         getNotReturnList({
    //             pageIndex: 1,
    //             pageSize: 4,
    //             lastDate: nightTime,
    //             // lastDate: "2021-01-20",
    //             isLast: 1
    //         })
    //     }
    // }, [nightTime])

    useEffect(() => {
        getStastics({ ruleType: timeIntervalType })
    }, [timeIntervalType])

    useEffect(() => {
        console.log("!!!!!")
        if (curDate) {
            let pr = {
                lastDate: moment(curDate).format("yyyy-MM-DD"),
                pageIndex: curPage,
                pageSize: 20
            }
            console.log(moment(curDate).format("yyyy-MM-DD"))
            getNotReturnList(pr)
        }
    }, [curDate, curPage])

    //获取统计概览
    const getOverview = async pr => {
        let { data } = await request("schoolView/getOverview", pr)
        if (data.result) {
            setCardData(data.data)
            setNightTime(data.data.night.time)
            setCurDate(moment(data.data.night.time))
            setStandardTime(moment(data.data.night.time))

        }
        else {
            message.warning(data.message)
        }
    }

    //获取出勤人数统计列表(折线图)
    const getStastics = async pr => {
        let { data } = await request("schoolView/getStastics", pr);
        console.log("00000", data)
        if (data.result) {
            setTimeList(data.data.timeList)
            setNormalSignList(data.data.normalSign)
            setLateSignList(data.data.lateSignList)
            console.log(data.data.notSignList);
            setNotSignList(data.data.notSignList)
        }
        else {
            message.warning(data.message)
        }
    }

    //获取晚寝未归人员列表
    const getNotReturnList = async pr => {
        let { data } = await request("schoolView/getNotReturnList", pr)
        if (data.result) {
            // console.log(data.data)
            // if (pr.isLast == 1) {
            //     setLastPersonList(data.data.list)
            // }
            // else {
            let temp = []
            data.data.list.map((item, index) => {
                if (index < 4) {
                    temp.push({
                        ...item,
                        key: index
                    })
                }
            })
            console.log(cardData?.night?.time, moment(curDate).format("yyyy-MM-DD"))
            if (curPage == 1 && cardData?.night?.time == moment(curDate).format("yyyy-MM-DD")) {
                setLastPersonList(temp)
            }
            setModalData(data.data.list.map((item, index) => {
                return {
                    ...item,
                    key: index
                }
            }))
            setTotal(data.data.total)
            // }
        }
        else {
            message.warning(data.message)
        }
    }
    //导出晚寝未归名单
    const exportNotReturnList = pr => {
        // console.log('开始DBF下载 id:',id)
        request('schoolView/exportNotReturnList', pr, (res, resHead) => {
            if (res) {
                let filename = resHead['content-disposition'];
                let blob = new Blob([res], { type: 'application/x-xlsx' });
                let newname = filename.split('=')[1];
                saveAs(blob, decodeURI(newname));
                // saveAs(blob, "isijsijsijs");
            } else {
                // console.log('该模板不存在！')
                message.warning('下载失败！')
            }
        }, err => {
            message.warning('下载失败!');
            // console.log('err :',err)
        }, true, null, true)
    }

    const InitScroll = pr => {
        document.getElementsByClassName("scrollbar-container")[1].scrollTop = 0
        console.log(document.getElementsByClassName("scrollbar-container"))
    }
    return <div className="ll-schoolOverview">
        <div className="ll-schoolOverview-first">
            <SituationCard
                name="早寝出寝"
                time={`${cardData?.morning?.time ?? "--"} ${cardData?.morning?.ruleStartTime ?? "--"}~${cardData?.morning?.ruleEndTime ?? "--"}`}
                shouldSign={cardData?.morning?.shouldSign}
                normalSign={cardData?.morning?.normalSign}
                notSign={cardData?.morning?.notSign}
                earlySign={cardData?.morning?.earlySign}
                lateSign={cardData?.morning?.lateSign}
            />
            <SituationCard
                name="午寝出寝"
                time={`${cardData?.afternoon?.time ?? "--"} ${cardData?.afternoon?.ruleStartTime ?? "--"}~${cardData?.afternoon?.ruleEndTime ?? "--"}`}
                shouldSign={cardData?.afternoon?.shouldSign}
                normalSign={cardData?.afternoon?.normalSign}
                notSign={cardData?.afternoon?.notSign}
                earlySign={cardData?.afternoon?.earlySign}
                lateSign={cardData?.afternoon?.lateSign}
            />
            <SituationCard
                name="晚寝归寝"
                time={`${cardData?.night?.time ?? "--"} ${cardData?.night?.ruleStartTime ?? "--"}~${cardData?.night?.ruleEndTime ?? "--"}`}
                shouldSign={cardData?.night?.shouldSign}
                normalSign={cardData?.night?.normalSign}
                notSign={cardData?.night?.notSign}
                earlySign={cardData?.night?.earlySign}
                lateSign={cardData?.night?.lateSign}
            />
        </div>
        <div className="ll-schoolOverview-second">

            <div >
                <ReactEcharts
                    option={option}
                />
            </div>
            <div
                style={{ float: "right", marginTop: -270, marginRight: 33 }}
            >
                <Radio.Group
                    onChange={e => setTimeIntervalType(e.target.value)}
                    value={timeIntervalType}
                >
                    <Radio.Button value={1}>早寝</Radio.Button>
                    <Radio.Button value={2}>午寝</Radio.Button>
                    <Radio.Button value={3}>晚寝</Radio.Button>
                </Radio.Group>
            </div>
        </div>
        <div className="ll-schoolOverview-third">
            <div className="ll-schoolOverview-third-top">
                <div>
                    <span className="ll-bigFont" style={{ marginRight: 10 }}>晚寝未归人员</span>
                    <span className="ll-smallFont">{
                        // moment(timeList[timeList.length - 1]).format("YYYY-MM-DD")
                        cardData?.night?.time ?? "--"
                    }</span>
                </div>
                <div>
                    <span
                        className="ll-smallFont"
                        style={{ cursor: "pointer" }}
                        onClick={() => setVisible(true)}
                    >{"查看更多>"}</span>
                </div>
            </div>
            <div className="ll-schoolOverview-third-cardCTN">
                {
                    lastPersonList?.map((item, index) =>
                        <div key={index}>
                            <LatePersonCard
                                name={item?.stuName}
                                exactClass={item?.className}
                                dorm={item?.roomName}
                                sex={item?.sex}
                            />
                        </div>


                    )
                }
            </div>
        </div>
        <Modal
            title="晚寝未归人员名单"
            footer={null}
            onCancel={() => { setVisible(false); setCurDate(standarTime) }}
            visible={visible}
            width={600}
        >
            <PerfectScrollbar style={{ height: 600 }}>
                <div className="ll-latePersonModal">
                    <div className="ll-lateFirst">
                        <div>日期：<DatePicker
                            value={curDate}
                            allowClear={false}
                            onChange={value => { setCurDate(value); setCurPage(1); InitScroll() }}
                        /></div>
                        <div>
                            <Button
                                type="primary"
                                onClick={() => {
                                    if (modalData?.length > 0) {
                                        exportNotReturnList({
                                            lastDate: moment(curDate).format("yyyy-MM-DD")
                                        })
                                    }
                                    else {
                                        message.warning("暂无数据，无法导出！")
                                    }
                                }}
                            >
                                导出
                        </Button>
                        </div>
                    </div>
                    <div className="ll-latePersonModal">
                        <Table
                            columns={columns}
                            dataSource={modalData}
                            pagination={false}
                        />
                    </div>
                    <div>
                        <PaginationPonent
                            total={total}
                            pageSize={20}
                            pageIndex={curPage}
                            pageChange={value => { setCurPage(value); InitScroll() }}
                        />
                    </div>

                </div>
            </PerfectScrollbar>
            <div className="ll-btnctn">
                <Button onClick={() => { setVisible(false) }}>返回</Button>
            </div>
        </Modal>
    </div>


}