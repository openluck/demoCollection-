import React, { useState, useEffect } from "react"
import "../../../../style/pajs/aqsz/aqszFormWork.scss"
import { Button, Input, Radio, TimePicker, message } from "antd"
import SVG from "../../../public/public-component-svg"
import PagePonent from "../../pagePonent"
import PerfectScrollbar from "react-perfect-scrollbar"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"
import { request } from "../../../../util/request"
import LimitsModal from "../../limitsModal"
import DelectConfirmModal from "../../deletConfirmModal"
import noneData from "../../../../media/picture/noneData.png"
import { v4 as uuidv4 } from 'uuid'


const { TextArea } = Input

export default function UserSet(props) {
    const [tableData, setTableData] = useState([])
    const [curPage, setCurPage] = useState(1)
    const [visible, setVisible] = useState(false)
    const [optionType, setOptionType] = useState("")
    const [clickOne, setClickOne] = useState({})
    const [clickName, setClickName] = useState("")
    const [clickrange, setClickrange] = useState("")
    const [clickId, setClickId] = useState("")
    const [userTreeData, setUserTreeData] = useState([])
    const [rangeTreeData, setRangeTreeData] = useState([])
    // const [selected, setSelected] = useState([])
    const [userSelected, setUserSelected] = useState([])
    const [rangeSelected, setRangeSelected] = useState([])
    const [total, setTotal] = useState(0)
    const [delVisible, setDelVisible] = useState(false)

    let param = {
        pageIndex: curPage,
        pageSize: 20
    }

    let tempPerson = []
    let sum = 0
    useEffect(() => {
        getEventList(param)
    }, [curPage])

    function OpenModal(item) {
        // 
        setClickId(item?.userId ?? "")
        setClickOne(item ?? null)
        setClickName(item?.userName ?? "")
        setClickrange(item?.range ?? "")
        if (item) {
            setOptionType(1)
            getRangeSelectedAndRangeTree({
                userId: item.userId
            })
        }
        else {
            setOptionType(0)
        }
    }

    function modalVi(type, data) {
        console.log(data);
        if (type === 'cancel') {
            setVisible(false)
            setClickId("")
        } else {
            //   this.getTableData(page);
            setVisible(false)
            //user
            confirm(data)
        }
        // setUserTreeData([])
    }

    //(弹窗右侧)获取所有角色下已选中人员
    function getSelectPerson(arr) {
        arr.map(item => {
            sum++
            if (item.children) {
                getSelectPerson(item.children)
            }
            if (item.isChecked == 1) {
                let flag = true
                for (let i = 0; i <= tempPerson.length; i++) {
                    if (tempPerson[i]?.value == item.value) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    tempPerson.push(item)
                }
            }
        })
    }


    const getUserSelected = async pr => {
        let { data } = await request("public/getSelectUserAllRole", pr)
        if (data.result) {
            setUserSelected(data.data)
        }
        else {
            message.warning(data.message)
        }
    }

    const getRangeSelectedAndRangeTree = pr => {
        Promise.all([request("public/getSelectBuilding", pr), request("public/getSchoolList", pr)]).then(data => {
            console.log('data', data)
            if (data[0]) {
                let one = data[0].data
                if (one.result) {
                    setRangeSelected([...one.data])
                } else {
                    message.warning(one.message)
                }
                let two = data[1].data
                if (two.result) {
                    setRangeTreeData([...two.data])
                } else {
                    message.warning(two.message)
                }
                setVisible(true)
            }
        })
    }



    //获取人员tree
    const getPerList = async pr => {
        let { data } = await request("public/getPerList", pr)
        if (!data.data && pr.pageIndex > 1) {
            setCurPage(curPage - 1)
        }
        if (data.result) {
            const dataList = data.data
            setUserTreeData(dataList)
            getSelectPerson(dataList)
            setUserSelected([...tempPerson])
            setVisible(true)
        }
        else {
            message.warning(data.message)
        }
    }

    //获取人员列表
    const getEventList = async pr => {
        let { data } = await request("userSet/getUserList", pr)
        if (data.data.length == 0 && curPage > 1) {
            setCurPage(curPage - 1)
        }
        if (data.result) {
            setTableData([...data.data])
            setTotal(data.total)
        }
        else {
            message.warning(data.message)
        }
    }

    //删除控制人员
    const delEvent = async pr => {
        let { data } = await request("userSet/delectUser", pr)
        if (data.result) {
            getEventList(param)
            let baseInfo = sessionStorage.getItem('baseinfo')
            if (baseInfo) {
                baseInfo = JSON.parse(baseInfo)
                let userId = baseInfo.userId
                if (userId === pr.userId) {
                    sessionStorage.setItem('paArrangeFlag', JSON.stringify(false))
                }
            }
        }
        else {
            message.warning(data.message)
        }
    }

    //添加人员
    const addOrEdit = async pr => {
        let { data } = await request("userSet/addUser", pr)
        if (data.result) {
            getEventList(param)
        }
        else {
            message.warning(data.message)
        }
    }

    //设置范围
    const setRange = async pr => {
        console.log('pr001', pr)
        let { data } = await request("userSet/setRange", pr)
        if (data.result) {
            let baseInfo = sessionStorage.getItem('baseinfo')
            if (baseInfo) {
                baseInfo = JSON.parse(baseInfo)
                let userId = baseInfo.userId
                if (userId === pr.userId) {
                    if (pr.buildingList && pr.buildingList[0]) {
                        sessionStorage.setItem('paArrangeFlag', JSON.stringify(true))
                    } else {
                        sessionStorage.setItem('paArrangeFlag', JSON.stringify(false))
                    }
                }
            }
            getEventList(param)
        }
        else {
            message.warning(data.message)
        }
    }

    //弹窗确定
    function confirm(arr) {
        if (optionType == 0) {
            addOrEdit({ roleIdList: arr })
        } else {
            setRange({ userId: clickId, buildingList: arr })
        }
    }



    return <div className="ll-aqsz-outer">
        <div className="ll-aqsz-content">
            <div className="ll-aqsz-firstFloor">
                <h2 style={{ margin: 0 }}>人员列表</h2>
                <Button
                    type="primary"
                    onClick={() => {
                        getPerList()
                        OpenModal()
                        setOptionType(0)
                    }}
                ><SVG
                        type="tj"
                        width={16}
                        height={16}
                        fill="white"
                        style={{ marginRight: 5 }}
                    />添加人员</Button>
            </div>
            {
                tableData.length > 0 ?
                    <div className="ll-aqsz-table">
                        <div className="ll-aqsz-rank" style={{ backgroundColor: "#fafafa", borderTop: "1px solid #ebebeb" }}>
                            <div className="ll-aqsz-userName">姓名</div>
                            <div className="ll-aqsz-range">安全管辖范围</div>
                            {/* <div className="ll-aqsz-controlEvent">监控人员</div> */}
                            <div className="ll-aqsz-operation">操作</div>
                        </div>
                        <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
                            {
                                tableData.map((item, index) =>
                                    <div className="ll-aqsz-rank" key={index} >
                                        <div className="ll-aqsz-userName">{item.userName}</div>
                                        <div className="ll-aqsz-range">{item.range}</div>
                                        {/* <div className="ll-aqsz-controlEvent">{item.controlEvent}</div> */}
                                        <div className="ll-aqsz-operation">
                                            <div
                                                className="ll-aqsz-bj"
                                                onClick={() => {
                                                    setOptionType(1)
                                                    OpenModal(item)
                                                }}
                                            >
                                                <SVG
                                                    type="bj"
                                                    width={16}
                                                    height={16}
                                                    fill="aaaeb3"
                                                    style={{ marginRight: 5 }} />设置范围
                                    </div>
                                            <div
                                                className="ll-aqsz-sc"
                                                onClick={() => { setClickId(item.userId); setDelVisible(true) }}
                                            >
                                                <SVG
                                                    type="sc"
                                                    width={16}
                                                    height={16}
                                                    fill="aaaeb3"
                                                    style={{ marginRight: 5 }} />移除
                                    </div>
                                        </div>
                                    </div>
                                )
                            }
                        </PerfectScrollbar>
                    </div> :
                    <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
                        <img src={noneData} />
                        <p>暂无数据</p>
                    </div>
            }

            <div className="ll-paginationCTN" style={{ display: tableData > 0 ? "block" : "none" }}>
                <PagePonent
                    pageIndex={curPage}
                    pageSize={20}
                    pageChan={value => {
                        setCurPage(value)
                    }}
                    len={tableData && tableData.length || 0}
                    total={total}
                />
            </div>
            {
                visible ? <LimitsModal
                    visible={visible}
                    modalVi={(type, data) => modalVi(type, data)}
                    treeData={optionType == 0 ? userTreeData : rangeTreeData}
                    selected={optionType == 0 ? userSelected : rangeSelected}
                    type={optionType == 0 ? "per" : "place"}
                /> : ''
            }

            <DelectConfirmModal
                visible={delVisible}
                onOk={() => {
                    delEvent({ userId: clickId })
                    setDelVisible(false)
                }}
                onCancel={() => {
                    setDelVisible(false)
                }}
                text="确定移除该人员？"
            />
        </div>
    </div>
}