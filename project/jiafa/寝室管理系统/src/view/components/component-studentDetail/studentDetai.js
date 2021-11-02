/*
 * @Author: luolei 
 * @Date: 2021-02-09 09:34:05 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-04-28 13:23:36
 */
import React, { useState, useEffect } from "react"
import "../../../style/ll-report.scss"
import { Radio, DatePicker, Select, Input, Table, Modal, Button, message, TimePicker } from "antd"
import { useSelector } from "react-redux"
import SVG from "../../public/public-component-svg"
import { InitScroll, PaginationPonent } from "../common"
import OrgTreeSingle from "../dormManage/ll-tree"
import moment from "moment"
import { request } from "../../../util/request"
import { trim } from "lodash"
const { RangePicker } = DatePicker
const { Search } = Input
const { Option } = Select

export default function StudentDetail({

}) {
    // const gradeData = useSelector(store => store.classesTree_reducer.list)
    const buildingData = useSelector(store => store.buildTree_reducer.buildTree)

    //月日周
    const [curTimeType, setCurTimeType] = useState("3")

    //时间范围
    const [timeRange, setTimeRange] = useState([moment(), moment()])
    //当前日/月
    const [curTime, setCurTime] = useState(moment())
    //当前年/班级
    const [curGradeObj, setCurGradeObj] = useState({ gradeId: "all", classId: "all" })
    //当前签到结果
    const [curSignResult, setCurSignResult] = useState("all")
    //当前搜索关键词
    const [curKeyword, setCurKeyword] = useState("")
    //列表中选中的学生
    const [curStudent, setCurStudent] = useState({})
    //弹窗中的选中签到类型
    const [curSignType, setCurSignType] = useState(1)
    const [curPage, setCurPage] = useState(1)
    const [visible, setVisible] = useState(false)

    const [total, setTotal] = useState(0)
    const [tableData, setTableData] = useState([])
    const columns = [
        {
            title: "学生姓名",
            dataIndex: "stuName"
        },
        {
            title: "所属年级",
            dataIndex: "gradeName"
        },
        {
            title: "所属班级",
            dataIndex: "className"
        },
        {
            title: "日期记录",
            dataIndex: "signDay"
        },
        {
            title: "类型",
            render: ({ ruleType }) => {
                return ruleType == -1 ? "全部"
                    : ruleType == 1 ? "早寝"
                        : ruleType == 2 ? "午寝"
                            : ruleType == 3 ? "晚寝"
                                : "--"
            }
        },
        {
            title: "签到记录",
            render: ({ signDate }) => {
                return signDate ? moment(signDate).format("YYYY-MM-DD HH:mm") : "--"
            }
        },
        {
            title: "签到结果",
            render: ({ signResult }) => {
                return signResult == 1 ? "正常"
                    : signResult == 2 ? "早签"
                        : signResult == 3 ? "晚签"
                            : signResult == 4 ? "未签"
                                : "--"
            }
        },
        {
            title: "操作",
            render: (rank) => {
                return <div
                    className={rank.signResult != 4 ? "ll-disabled" : null}
                    onClick={() => {
                        console.log(rank.signResult)
                        if (rank.signResult == 4) {
                            setVisible(true)
                            console.log(rank)
                            setCurStudent({ ...rank })
                        }
                    }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: rank.signResult == 4 ? "pointer" : "auto",
                    }}>
                    <SVG type="bianji" />
                    <span style={{ marginLeft: 5 }}>编辑</span>
                </div>
            }
        },
    ]

    useEffect(() => {
        let pr = {
            startTime: curTimeType == 2 ? new Date(curTime?.startOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime?.startOf("month")).getTime(),
            endTime: curTimeType == 2 ? new Date(curTime?.endOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime?.endOf("month")).getTime(),
            gradeId: curGradeObj.gradeId ?? "",
            classId: curGradeObj.classId ?? "",
            signResult: curSignResult,
            keyword: curKeyword?.trim(),
            pageIndex: curPage,
            pageSize: 20
        }
        if (curTime) {
            getTableData(pr)
        }
    }, [curPage, timeRange, curSignResult, curGradeObj, curTimeType, curTime])

    // useEffect(() => {
    //     let pr = {
    //         studentId: curStudent.studentId,
    //         inRoomState: curSignType
    //     }
    //     console.log(pr)
    // }, [curStudent])
    useEffect(() => {
        setCurTime(moment())
    }, [curTimeType])

    const getTableData = async pr => {
        let { data } = await request("dormitoryDetail/getStudentList", pr)
        if (data.result) {
            setTableData(data.data.dataList.map((item, index) => {
                return { ...item, key: index }
            }))
            setTotal(data.data.total)
        }
        else {
            message.warning(data.message)
        }
    }

    const editInRoomState = async pr => {
        let { data } = await request("dormitoryDetail/editInRoomState", pr)
        if (data.result) {
            message.success("编辑成功！")
            let pr2 = {
                startTime: curTimeType == 2 ? new Date(curTime.startOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime.startOf("month")).getTime(),
                endTime: curTimeType == 2 ? new Date(curTime.endOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime.endOf("month")).getTime(),
                gradeId: curGradeObj.gradeId ?? "",
                classId: curGradeObj.classId ?? "",
                signResult: curSignResult,
                keyword: curKeyword,
                pageIndex: 1,
                pageSize: 20
            }
            getTableData(pr2)
        }
        else {
            message.warning(data.message)
        }
    }
    //导出
    const exportStudentList = pr => {
        // console.log('开始DBF下载 id:',id)
        request('dormitoryDetail/exportStudentList', pr, (res, resHead) => {
            if (res) {
                let filename = resHead['content-disposition'];
                console.log(filename)
                let blob = new Blob([res], { type: 'application/x-xls' });
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

    return <div className="ll-classOrBuildingReport">
        <div className="ll-title">
            学生在寝明细
        </div>
        <div className="ll-content">
            <div className="ll-searchCondition">
                <div>
                    <div>
                        <Radio.Group
                            value={curTimeType}
                            onChange={e => {
                                setCurPage(1)
                                InitScroll()
                                setCurTimeType(e.target.value)
                            }}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="3">日</Radio.Button>
                            <Radio.Button value="2">周</Radio.Button>
                            <Radio.Button value="1">月</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div>
                        {
                            curTimeType == 1 ?
                                "月范围：" :
                                curTimeType == 2 ?
                                    "周范围：" : "日期："
                        }
                        {
                            // curTimeType == 2 ?
                            // <RangePicker
                            //     value={timeRange}
                            //     picker={
                            //         // curTimeType == 1 ?
                            //         //     "month" :
                            //         //     curTimeType == 2 ?
                            //         //         "week" : "date"
                            //         "week"
                            //     }
                            //     onChange={(value) => {
                            //         let temp = [moment(value[0]), moment(value[1])]
                            //         // console.log(temp)
                            //         setCurPage(1)
                            //         setTimeRange([...temp])
                            //         // let pr = {
                            //         //     time: {
                            //         //         startTime: new Date(value[0]).getTime(),
                            //         //         endTiem: new Date(value[1]).getTime()
                            //         //     }

                            //         // }
                            //         // console.log(pr)
                            //     }}
                            // /> : 
                            <DatePicker
                                // showNow={false}
                                allowClear={false}
                                picker={curTimeType == 1 ? "month" : curTimeType == 2 ? "week" : ""}
                                value={curTime}
                                onChange={(value) => {
                                    setCurPage(1)
                                    InitScroll()
                                    setCurTime(value)
                                }}
                            />
                        }

                    </div>
                    {/* <div>
                    年级：
                    <Select style={{ width: 150 }}>

                    </Select>
                </div> */}
                    <div>
                        年/班级：
                    <OrgTreeSingle
                            type={3}
                            onChange={a => {
                                setCurPage(1)
                                InitScroll()
                                setCurGradeObj({ ...a })
                            }}
                        />
                    </div>
                    <div>
                        签到结果：
                    <Select
                            value={curSignResult}
                            onChange={e => { setCurSignResult(e); setCurPage(1); InitScroll() }}
                        >
                            <Option value="all">全部</Option>
                            <Option value={1}>正常</Option>
                            <Option value={2}>早签</Option>
                            <Option value={3}>晚签</Option>
                            <Option value={4}>未签</Option>
                        </Select>
                    </div>
                    <div>
                        <Search
                            maxLength={50}
                            placeholder="学生姓名/证件号"
                            // value={curKeyword}
                            onSearch={value => {
                                let pr = {
                                    startTime: curTimeType == 2 ? new Date(curTime?.startOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime?.startOf("month")).getTime(),
                                    endTime: curTimeType == 2 ? new Date(curTime?.endOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime?.endOf("month")).getTime(),
                                    gradeId: curGradeObj.gradeId ?? "",
                                    classId: curGradeObj.classId ?? "",
                                    signResult: curSignResult,
                                    keyword: value ? value?.trim() : "",
                                    pageIndex: curPage,
                                    pageSize: 20
                                }
                                getTableData(pr)
                                setCurPage(1); InitScroll()
                            }}
                            onChange={e => {
                                setCurKeyword(e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div>
                    <Button
                        type="primary"
                        onClick={
                            () => {
                                let pr = {
                                    startTime: curTimeType == 2 ? new Date(curTime.startOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime.startOf("month")).getTime(),
                                    endTime: curTimeType == 2 ? new Date(curTime.endOf("week")).getTime() : curTimeType == 3 ? new Date(curTime).getTime() : new Date(curTime.endOf("month")).getTime(),
                                    gradeId: curGradeObj.gradeId ?? "",
                                    classId: curGradeObj.classId ?? "",
                                    signResult: curSignResult,
                                    keyword: curKeyword,
                                    pageIndex: curPage,
                                    pageSize: 20
                                }
                                if (tableData?.length > 0) {
                                    exportStudentList(pr)
                                }
                                else {
                                    message.warning("暂无数据，无法导出！")
                                }
                            }
                        }>导出</Button>
                </div>
            </div>
            <div className="ll-table">
                <Table
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    bordered={true}
                />
                <div style={{ paddingTop: 20 }}>
                    <PaginationPonent
                        total={total}
                        pageSize={20}
                        pageIndex={curPage}
                        pageChange={value => { setCurPage(value); InitScroll() }}

                    />
                </div>
            </div>
        </div>
        <Modal
            title={`${curStudent.stuName}在寝明细`}
            onCancel={() => setVisible(false)}
            footer={null}
            visible={visible}
        >
            <div style={{ minHeight: 100, padding: "0px 20px" }}>
                {curStudent.ruleType == -1 ? "全部"
                    : curStudent.ruleType == 1 ? "早寝"
                        : curStudent.ruleType == 2 ? "午寝"
                            : curStudent.ruleType == 3 ? "晚寝"
                                : "--"}：
                <Radio.Group value={curSignType} onChange={e => setCurSignType(e.target.value)}>
                    <Radio value={1}>正常签到</Radio>
                    {/* <Radio value={3}>晚签到</Radio> */}
                </Radio.Group>
            </div>
            <div className="ll-modal-btnctn">
                <div>
                    <Button type="primary" onClick={() => {
                        let pr = {
                            stuId: curStudent.stuId,
                            inRoomState: curSignType,
                            ruleType: curStudent.ruleType,
                            queryDate: new Date(curStudent.signDay).getTime()
                        }
                        setCurPage(1)
                        editInRoomState(pr)
                        setVisible(false)
                    }}>确定</Button>
                </div>
                <div>
                    <Button onClick={() => setVisible(false)}>取消</Button>
                </div>
            </div>
        </Modal>
    </div>
}