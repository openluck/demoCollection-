import React, { useState, useEffect } from "react"
import "../../../style/ll-report.scss"
import { Radio, DatePicker, Select, message, Button } from "antd"
import ClassOrBuildingTable from "./classOrBuildingTable"
import OrgTreeSingle from "./ll-tree"
import { useDispatch, useSelector } from "react-redux"
import moment from "moment"
import { InitScroll, PaginationPonent } from "../common"
import { request } from "../../../util/request"
import { getRoomDetail_action } from "../../../redux/actions/inRoomManage.action"
const { RangePicker } = DatePicker

export default function ClassOrBuildingReport({
    type
}) {
    const data = useSelector(store => type == 1 ? store.classesTree_reducer.list : store.buildTree_reducer.buildTree)
    // const newData=[{gradeId:}]
    //日周月
    const [curTimeType, setCurTimeType] = useState("3")
    // const [curStartTime, setCurStartTime] = useState("")
    // const [curEndTime, setCurEndTime] = useState("")
    const [timeRange, setTimeRange] = useState([moment(), moment()])
    const [curSearchId, setCurSearchId] = useState("all")
    const [curDetailId, setCurDetailId] = useState("")
    const [curPage, setCurPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [tableData, setTableData] = useState([])
    const [modalData, setModalData] = useState([])
    const [tempObj, setTempObj] = useState({})
    const [curTime, setCurTime] = useState(moment())
    const dispatch = useDispatch()
    const buildData = useSelector(store => store.buildTree_reducer.buildTree)

    useEffect(() => {
        console.log(type)
        let param = {
            startTime: curTimeType == 2 ? moment(curTime).startOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).startOf("month").format("yyyy-MM-DD"),
            endTime: curTimeType == 2 ? moment(curTime).endOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).endOf("month").format("yyyy-MM-DD"),
            pageIndex: curPage,
            pageSize: 20
            // pageIndex: "0",
            // pageSize: "5"
        }
        let newParam = type == 1 ?
            {
                ...param,
                gradeId: tempObj.gradeId,
                classId: tempObj.classId
                // gradeId: "GZ_1"
            } :
            getNewPr(buildData, param, curSearchId)
        console.log(type, newParam)
        getTableData(newParam)
    }, [timeRange, curSearchId, curPage, tempObj, curTime])

    let newPr = {}

    const getNewPr = (arr, pr, id) => {
        if(arr?.length>0){
            for (let i = 0; i < arr?.length; i++) {
                if (arr[i].buildId == id) {
                    if (arr[i]?.plaType == 1) {
                        newPr = {
                            ...pr,
                            buildingId: id
                        }
                        break
                    } else if (arr[i]?.plaType == 2) {
                        newPr = {
                            ...pr,
                            floorId: id
                        }
                        break
    
                    } else {
                        newPr = {
                            ...pr,
                            buildingId: id,
                            floorId: id
                        }
                        break
    
                    }
                }
                else if(id == "all"){
                    newPr = {
                        ...pr,
                        buildingId: id,
                        floorId: id
                    }
    
                }
                if (arr[i].childrenList) {
                    getNewPr(arr[i].childrenList, pr, id)
                }
            }
            return newPr
        }
        else{
            return pr
        }
    }

    useEffect(() => {
        setCurTime(moment())
    }, [curTimeType])
    // useEffect(() => {
    //     let param = {
    //         startTime: curTimeType == 2 ? moment(curTime).startOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).startOf("month").format("yyyy-MM-DD"),
    //         endTime: curTimeType == 2 ? moment(curTime).endOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).endOf("month").format("yyyy-MM-DD"),
    //         classId: "",
    //         buildingId: ""
    //     }
    //     let newParam = type == 1 ?
    //         {
    //             ...param,
    //             classId: curDetailId
    //         } :
    //         {
    //             ...param,
    //             buildingId: curDetailId,
    //         }
    //     getDetail(newParam)
    // }, [curDetailId])

    const onDetailIdChange = (curDetailId, floorId) => {
        console.log(curDetailId, floorId)
        let param = {
            startTime: curTimeType == 2 ? moment(curTime).startOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).startOf("month").format("yyyy-MM-DD"),
            endTime: curTimeType == 2 ? moment(curTime).endOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).endOf("month").format("yyyy-MM-DD"),
            classId: "",
            buildingId: ""
        }
        let newParam = type == 1 ?
            {
                ...param,
                classId: curDetailId
            } :
            {
                ...param,
                buildingId: curDetailId,
                floorId: floorId
            }
        getDetail(newParam)
    }

    //获取表格数据
    const getTableData = async pr => {
        let { data } = type == 1 ? await request("classReport/getClassList", pr) : await request("buildingReport/getBuildingList", pr)
        console.log(data)
        if (data.result) {
            setTableData(data.data.list.map((item, index) => {
                return { ...item, key: index }
            }))
            setTotal(data.data.total)
        }
        else {
            message.warning(data.message)
        }
    }

    //获取详情数据
    const getDetail = async pr => {
        let { data } = await request("report/getDetail", pr)
        console.log(data)
        if (data.result) {
            dispatch(getRoomDetail_action(data.data))
        }
        else {
            message.warning(data.message)
        }
    }

    //导出晚寝未归名单
    const exportReport = pr => {
        // console.log('开始DBF下载 id:',id)
        request(type == 1 ? "classReport/export" : "buildingReport/export", pr, (res, resHead) => {
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

    return <div className="ll-classOrBuildingReport">
        <div className="ll-title">
            {type == 1 ? "班级报告" : "楼栋报告"}
        </div>
        <div className="ll-content">
            <div className="ll-searchCondition">
                <div>
                    <div>
                        <Radio.Group
                            value={curTimeType}
                            onChange={e => {
                                setCurTimeType(e.target.value)
                                setCurPage(1)
                                InitScroll()
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
                            //     <RangePicker
                            //         value={timeRange}
                            //         picker={
                            //             // curTimeType == 1 ?
                            //             //     "month" :
                            //             //     curTimeType == 2 ?
                            //             //         "week" : "date"
                            //             "week"
                            //         }
                            //         onChange={(value,kk) => {
                            //             setCurPage(1)
                            //             let temp = [moment(value[0]), moment(value[1])]
                            //             // console.log(moment(value[0]), moment(value[1]))
                            //             // console.log(temp)
                            //             setTimeRange([...temp])
                            //             // let pr = type == 1 ? {
                            //             //     time: {
                            //             //         startTime: value[0].unix(),
                            //             //         endTiem: value[1].unix()
                            //             //     },
                            //             //     gradeId: curSearchId
                            //             // }
                            //             //     : {
                            //             //         time: {
                            //             //             startTime: value[0].unix(),
                            //             //             endTiem: value[1].unix()
                            //             //         },
                            //             //         buildingId: curSearchId
                            //             //     }
                            //             // console.log(pr)
                            //         }}
                            //     /> :
                            <DatePicker
                                // showNow={false}
                                // picker={curTimeType == 1 ? "month" : ""}
                                picker={curTimeType == 1 ? "month" : curTimeType == 2 ? "week" : ""}
                                value={curTime}
                                allowClear={false}
                                onChange={(value) => {
                                    setCurPage(1)
                                    InitScroll()
                                    setCurTime(value)
                                }}
                            />
                        }

                    </div>
                    <div>
                        {
                            type == 1 ? "年/班级：" : "楼栋："
                        }
                        <OrgTreeSingle
                            type={type}
                            onChange={
                                (a) => {
                                    // let pr = type == 1 ? {
                                    //     time: {
                                    //         startTime: moment(timeRange[0]).unix(),
                                    //         endTime: moment(timeRange[1]).unix()
                                    //     },
                                    //     gradeId: a
                                    // } : {
                                    //         time: {
                                    //             startTime: moment(timeRange[0]).unix(),
                                    //             endTime: moment(timeRange[1]).unix()
                                    //         },
                                    //         buildingId: a
                                    //     }
                                    // setCurSearchId(a)
                                    if (type == 2) {
                                        setCurPage(1)
                                        InitScroll()
                                        setCurSearchId(a)
                                    }
                                    else {
                                        setCurPage(1)
                                        InitScroll()
                                        setTempObj(a)
                                    }
                                }}
                        />
                    </div>
                </div>
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            let param = {
                                startTime: curTimeType == 2 ? moment(curTime).startOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).startOf("month").format("yyyy-MM-DD"),
                                endTime: curTimeType == 2 ? moment(curTime).endOf("weeks").format("yyyy-MM-DD") : curTimeType == 3 ? moment(curTime).format("yyyy-MM-DD") : moment(curTime).endOf("month").format("yyyy-MM-DD"),
                                pageIndex: curPage,
                                pageSize: 20
                                // pageIndex: "0",
                                // pageSize: "5"
                            }
                            let newParam = type == 1 ?
                                {
                                    ...param,
                                    gradeId: tempObj.gradeId,
                                    classId: tempObj.classId
                                    // gradeId: "GZ_1"
                                } :
                                {
                                    ...param,
                                    buildingId: curSearchId,
                                }
                            if (tableData?.length > 0) {
                                exportReport(newParam)
                            }
                            else {
                                message.warning("暂无数据，无法导出！")
                            }
                        }}
                    >导出</Button>
                </div>
            </div>

            <ClassOrBuildingTable
                type={type}
                dataSource={tableData}
                modalData={modalData}
                onClick={(value, value2) => onDetailIdChange(value, value2)}
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
}