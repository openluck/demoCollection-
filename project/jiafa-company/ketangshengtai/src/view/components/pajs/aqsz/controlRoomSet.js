import React, { useState, useEffect, useCallback } from 'react'
import "../../../../style/pajs/aqsz/controlRoomSet.scss"
import { Select, Switch, Tree, message } from 'antd'
import PagePonent from '../../pagePonent'
import PerfectScrollbar from "react-perfect-scrollbar";
import { request } from '../../../../util/request';
import noneData from "../../../../media/picture/noneData.png"

const { Option } = Select
export default function ControlRoomSet(props) {
    const [selectState, setSelectState] = useState("")
    const [roomList, setRoomList] = useState([])
    const [treeData, setTreeData] = useState([])
    const [curSpotId, setCurSpotId] = useState(treeData[0]?.spotId.toString())
    const [curFloor, setCurFloor] = useState("")
    const [curPage, setCurPage] = useState(1)
    const [handleFlag, setHandleFlag] = useState(0)
    const [checkedKeys, setCheckedKeys] = useState([])
    const [selectId, setSelectId] = useState([
        treeData.length > 0 ? treeData[0].spotId : ""
    ])
    const [total, setTotal] = useState("")
    const { TreeNode } = Tree
    let pr = {
        state: selectState,
        spotId: selectId[0],
        floor: curFloor,
        pageIndex: curPage,
        pageSize: 20
    }

    useEffect(() => {
        if (treeData.length > 0) {
            setSelectId(treeData[0]?.spotId)
            console.log(treeData[0]?.spotId)
        }
    }, [treeData])

    useEffect(() => {
        getTreeData()
    }, [])

    useEffect(() => {
        // console.log(curSpotId,selectId)
        console.log('selectState', selectState)
        console.log('handleFlag', handleFlag)
        if (handleFlag === 1) return
        if (selectId?.length > 0) {
            getRoomList({
                ...pr,
                state: selectState,
                spotId: selectId[0].indexOf("@") < 0 ? selectId[0] : selectId[0].substring(0, selectId[0].indexOf("@")),
                floor: curFloor,
                pageIndex: curPage,
            })
        }
        console.log('9999')
    }, [selectState, curFloor, curPage, selectId, handleFlag])

    const getRoomList = async pr => {
        console.log(pr.spotId)
        if (pr.spotId != "") {
            let { data } = await request("safetySet/getRoomList", pr)
            if (data.result) {
                setRoomList([...data.data])
                setTotal(data.total)
            }
            else {
                message.warning(data.message)
            }
        }
    }

    const getTreeData = async pr => {
        let { data } = await request("safetySet/getRoomTree", pr)
        if (data.result) {
            setTreeData(data.data)
        }
        else {
            message.warning(data.message)
        }
    }

    function getTreeNode(data) {
        return data.map(item => {

            if (item.childList) {
                return <TreeNode
                    title={
                        <div>
                            <div style={{
                                width: "100%"
                            }}>
                                <span>{item.name}</span>
                                <span style={{ float: "right" }}>{item.rate}</span>
                            </div>
                        </div>
                    }
                    key={item?.spotId}
                    // key={Math.random()}
                    dataRef={item}
                >
                    {getTreeNode(item.childList)}
                </TreeNode>
            }
            else {
                console.log(item)
                return <TreeNode
                    title={
                        <div>
                            <div style={{
                                width: "100%"
                            }}>
                                <span>{item.name}</span>
                                <span style={{ float: "right" }}>{item.rate}</span>
                            </div>
                        </div>
                    }
                    key={item?.spotId}
                    dataRef={item}
                // key={Math.random()}
                />
            }

        })
    }

    const setOperationState = async (param, roomList) => {
        console.log('roomList', roomList)
        console.log('param', param)
        const classRoomId = param.classRoomId
        let { data } = await request("safetySet/setType", param)
        if (data.result) {
            // if (pr.spotId.indexOf("@") < 0) {
            //     getRoomList(pr)
            // }
            // else {
            //     getRoomList({ ...pr, spotId: curSpotId })
            // }
            roomList.map(item => {
                if (item.classRoomId === classRoomId) {
                    if (item.operationState === '1') {
                        item.operationState = '0'
                    } else {
                        item.operationState = '1'
                    }
                }
            })
            setRoomList(roomList)
            getTreeData()
        }
        else {
            message.warning(data.message)
        }
    }

    const setOpt = useCallback((item) => {
        console.log(item)
        let pr = {
            classRoomId: item.classRoomId,
            operationType: item.operationState == 0 ? 1 : 0
        }
        setOperationState(pr, roomList)
    }, [roomList])

    function chooseArea(selectObj) {
        // setCurSpotId(selectObj?.spotId)
        setSelectId([selectObj?.spotId])
        if (selectObj?.spotId.indexOf("@") < 0) {
            setCurFloor(0)
        }
        else {
            let tempIndex = selectObj?.spotId.indexOf("@")
            setCurFloor(selectObj?.spotId[tempIndex + 1])
            setCurSpotId(selectObj?.spotId.substring(0, tempIndex))
        }
    }

    useEffect(() => {
        console.log('checkedKeys', checkedKeys)
    }, [checkedKeys])
    return <div className="ll-roomSet">
        <div className="ll-roomSet-left">
            <div className="ll-left-first">
                <h2 style={{ margin: 0 }}>设置教室开启自动监控</h2>
                <Select
                    style={{ width: 100 }}
                    value={selectState}
                    onChange={value => { setSelectState(value); setHandleFlag(0); }}
                >
                    <Option value="">全部</Option>
                    <Option value="0">停用</Option>
                    <Option value="1">启用</Option>
                </Select>
            </div>
            <div className="ll-left-second" >
                {
                    roomList.length > 0 ?
                        <div className="ll-left-list">
                            <div className="ll-list-rank"
                                style={{
                                    backgroundColor: "#fafafa",
                                    borderLeft: "1px solid #ebebeb",
                                    borderBottom: "none"
                                }}
                            >
                                <div className="ll-classRoom" style={{ borderBottom: "none" }}>教室</div>
                                <div className="ll-location" style={{ borderBottom: "none" }}>位置</div>
                                <div className="ll-operation" style={{ borderBottom: "none" }}>操作</div>
                            </div>
                            <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
                                {roomList.map((item, index) =>
                                    <div className="ll-list-rank"
                                        key={index}
                                        style={{
                                            // backgroundColor: index % 2 == 0 ? "white" : "#fafafa",
                                            borderLeft: "1px solid #ebebeb",
                                            borderBottom: index == roomList.length - 1 ? "1px solid #ebebeb" : "none"
                                        }}
                                    >
                                        <div className="ll-classRoom" style={{ borderBottom: "none" }}>{item.classRoomName}</div>
                                        <div className="ll-location" style={{ borderBottom: "none" }}>{item.location}</div>
                                        <div className="ll-operation" style={{ borderBottom: "none" }}>
                                            <Switch
                                                checked={item.operationState == 1}
                                                onChange={() => { setOpt(item);console.log(item);setHandleFlag(1)}}
                                            />
                                        </div>
                                    </div>
                                )}
                            </PerfectScrollbar>
                        </div>
                        : <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
                            <img src={noneData} />
                            <p>暂无数据</p>
                        </div>
                }
            </div>
            <div className="ll-paginationCTN" style={{ display: roomList.length > 0 ? "block" : "none" }}>
                <PagePonent
                    pageIndex={curPage}
                    pageSize={20}
                    pageChan={value => {
                        setCurPage(value)
                    }}
                    len={roomList && roomList.length || 0}
                    total={total}
                />
            </div>
        </div>
        <div className="ll-roomSet-right">
            <div className="ll-universityName">
                <h2 style={{ margin: 0 }}>教室列表</h2>
            </div>
            <PerfectScrollbar style={{ height: "calc(100% - 74px)" }}>
                <Tree
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    
                    onSelect={(id, info) => {
                        // console.log(info.node.dataRef)
                        console.log(id)
                        setCheckedKeys(id)
                        setHandleFlag(0)
                        setSelectId(id)
                        chooseArea(info.node.dataRef)
                        setCurPage(1)
                    }}
                    // selectedKeys={selectId}
                >
                    {getTreeNode(treeData)}
                </Tree>
            </PerfectScrollbar>
        </div>
    </div>
}