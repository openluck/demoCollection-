/*
 * @Author: yhc 
 * @Date: 2021-01-15 14:06:33 
 * @Last Modified by: luolei
 * @Last Modified time: 2021-03-10 10:26:02
 */
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Select, Button, Table, Space, Tree, message, Empty } from 'antd'
import './../../../style/roomStudentRule.scss'
import { CaretDownOutlined } from '@ant-design/icons';
import { PaginationPonent, PublicTbs } from './../../../view/components/common'
import { useSelector } from "react-redux";
import { getRoomList, setsRoomType } from './../../../request/page-room/stuManage'
export default function StudentRule() {
    const buildTree = useSelector(({ buildTree_reducer }) => buildTree_reducer).buildTree;
    const { Option } = Select
    const dataArr = []
    const pageSize = 20
    const pageIndex = useRef(1)
    const [total, setTotal] = useState(0)
    //宿舍类型
    const roomType = useRef(-1)
    //复选框选择项
    const roomArr = useRef([])
    const [defaultFloor, setDefaultFloor] = useState([])
    const [defaultFloorSel, setDefaultFloorSel] = useState('')
    //楼层选择
    const selectFloor = useRef([])
    const [loading, setLoading] = useState(true)
    const column = [
        {
            title: '宿舍名称',
            dataIndex: 'roomName',
            key: 'roomName',
            render: (e) => {
                return (
                    <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{e}</Space>
                )
            }
        },
        {
            title: '宿舍类型',
            dataIndex: 'roomType',
            key: 'roomType',
            render: (e) => {
                return (
                    <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{e == 2 ? '女' : (e == 1 ? '男' : e == 0 ? '暂未分配' : '--')}</Space>
                )
            }
        },
        {
            title: '宿舍容量',
            dataIndex: 'roomCapacity',
            key: 'roomCapacity',
            render: (e) => {
                return (
                    <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{e}</Space>
                )
            }
        },
    ]
    const [dataList, setDataList] = useState([])
    const [treeData, setTreeData] = useState([])
    const speId = useRef([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const addArr = useRef([])
    //楼栋-递归
    function buildCircle(val, childrenList) {
        let arr = childrenList?.map((value, index) => {
            value['title'] = value.buildName
            value['key'] = value.buildId
            if (value?.childrenList?.length) {
                buildCircle(value, value.childrenList)
            }
            return value
        })
        val['children'] = arr
        return val
    }
    //楼栋树修改
    function buildingTreeRe() {
        let arr = buildTree.map((val, index) => {
            val['title'] = val.buildName
            val['key'] = val.buildId
            if (val?.childrenList?.length) {
                val = buildCircle(val, val.childrenList)
            }
            return val
        })
        setTreeData(arr)
        console.log(arr)
    }
    function circleIds(arr) {
        arr?.map((val, index) => {
            if (val?.plaType == 1) {
                if (val?.childrenList?.length) {
                    val.childrenList?.map((vals, index) => {
                        speId.current.push(vals.buildId)
                    })
                }
            }
            else {
                speId.current.push(val.buildId)
            }
        })
    }
    function circleId(id, arr) {
        if (arr?.length) {
            arr?.map((val, index) => {
                if (val.buildId == id) {
                    if (val?.plaType == 2) {
                        speId.current.push(val.buildId)
                    }
                    else if (val?.childrenList?.length) {
                        circleIds(val.childrenList)
                    }
                    else {
                        speId.current = []
                    }
                }
                else {
                    if (val?.childrenList?.length) {
                        circleId(id, val.childrenList)
                    }
                }
            })
        }
    }
    //寝室列表修改
    async function roomListRe() {
        setLoading(true)
        let obj = {
            roomType: roomType.current,
            pageSize,
            pageIndex: pageIndex.current,
            floorId: selectFloor.current
        }
        let res = await getRoomList(obj)
        // setDataList(res)
        console.log(res)
        if (res?.code == 200) {
            if (res.data.list.length == 0) {
                res.data.list = dataArr
            }
            let arr = res.data.list?.map((val, index) => {
                val['key'] = val.roomId + 'room'
                return val
            })
            setTotal(res.data.total)
            setLoading(false)
            setDataList(arr)
        }
        else {
            message.warn(res.message)
        }
        document.getElementById('scroll-content').scrollTop = 0;
    }
    async function sexMark(type, e) {
        let dataList = [...roomArr.current]
        let obj = {
            roomId: [],
            roomType
        }
        dataList = dataList?.map((val, index) => {
            val.roomType = type
            return val
        })
        if (dataList?.length) {
            let res = await setsRoomType(dataList)
            console.log(res)
            if (res?.code == 200) {
                // message.success(res.message)
                addArr.current = []
                setSelectedRowKeys([])
                roomListRe()
                setSelectedRowKeys([])
                roomArr.current = []
                if (res?.result) {

                }
                else {
                    message.warn(res.message)
                }
            }
            else {
                message.warn(res.message)
            }
        }
        else {
            message.warn('请选择宿舍')
        }
    }
    function defaultValueSet() {
        if (buildTree?.length > 0) {
            if (buildTree[0]?.plaType == 1) {
                setDefaultFloorSel(buildTree[0]?.childrenList[0]?.buildId)
            }
            if (buildTree[0]?.childrenList?.length) {
                defaultCircle(buildTree[0]?.childrenList)
            }
            else {
                setDefaultFloor([])
            }
        }
    }
    function defaultCircle(params) {
        if (params?.length > 0) {
            if (params[0]?.plaType == 1) {
                setDefaultFloorSel(params[0]?.childrenList[0]?.buildId)
                // if(params[0]?.childrenList?.length){
                //     defaultCircle(params[0]?.childrenList)
                // }
                // else {
                //     setDefaultFloor([])
                // }            
            }
            else if (params[0]?.plaType == 2) {
                setDefaultFloor([params[0]?.buildId])
            }

        }
    }
    useEffect(() => {
        if (buildTree?.length) {
            circleId(buildTree[0].buildId, buildTree)
            selectFloor.current = speId.current
            buildingTreeRe()
        }
        defaultValueSet()
        roomListRe()
    }, [])
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%', backgroundColor: 'rgb(248, 250, 250)' }}>
            <div style={{ width: '80%', backgroundColor: 'white' }}>
                <PublicTbs
                    menuPath={['room', 'rule', 'studentRule']}
                />
                <div className='yhc-roomType' style={{ padding: '0 20px' }}>
                    <div>
                        <span>宿舍类型：</span>
                        <Select
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            onChange={(e) => {
                                pageIndex.current = 1
                                roomType.current = e;
                                // selectFloor.current = defaultFloor
                                roomListRe();
                            }} defaultValue={-1} style={{ width: '150px' }}>
                            <Option value={-1}>全部</Option>
                            <Option value={1}>男生宿舍</Option>
                            <Option value={2}>女生宿舍</Option>
                            <Option value={0}>暂未分配</Option>
                        </Select>
                    </div>
                    <div>
                        <Button type="primary" onClick={sexMark.bind(this, 1)}>标记男生宿舍</Button>
                        <Button style={{ marginLeft: '15px' }} type="primary" onClick={sexMark.bind(this, 2)}>标记女生宿舍</Button>
                    </div>
                </div>
                <div className='yhc-setTableHeader' style={{ padding: '0 20px' }}>
                    <Table loading={loading} pagination={false} bordered rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys,
                        onChange: (e) => {
                            // setSelectedRowKeys(e)
                            // addArr.current[pageIndex.current - 1] = e
                            // let arr = []
                            // let arrr = []
                            // for(let i = 0;i<addArr.current.length;i++){
                            //     addArr.current[i]?.map((val,index)=>{
                            //         arr.push(val)
                            //         arrr.push({roomId:val.replace('room',''),roomType:0})
                            //     })
                            // }
                            // setSelectedRowKeys(arr)
                            // roomArr.current = arrr
                            let arr = []
                            e?.map((val, index) => {
                                arr.push({ roomId: val.replace('room', ''), roomType: 0 })
                            })
                            roomArr.current = arr
                            setSelectedRowKeys(e)
                        }
                    }} style={{ marginTop: '20px' }} columns={column} dataSource={dataList}></Table>
                    <div style={{ marginTop: '10px' }}>
                        <PaginationPonent total={total} pageSize={pageSize} pageIndex={pageIndex.current} pageChange={(e) => { pageIndex.current = e; roomListRe() }}></PaginationPonent>
                    </div>
                </div>
            </div>
            <div style={{ width: '18%', backgroundColor: 'white' }} className='yhc-tree'>
                {
                    treeData.length ?
                        <Tree defaultExpandedKeys={[defaultFloorSel]} defaultSelectedKeys={[defaultFloorSel]} onSelect={(e) => {
                            pageIndex.current = 1
                            speId.current = []
                            let arr = [...treeData]
                            e?.length > 0 && circleId(e[0], arr)
                            selectFloor.current = speId.current
                            roomListRe();
                        }} showIcon={true} showLine switcherIcon={<CaretDownOutlined />} treeData={treeData} />
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
                }
            </div>
        </div>
    )
}