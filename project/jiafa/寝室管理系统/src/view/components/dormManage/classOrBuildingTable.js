import React, { useState } from "react"
import { Table, Modal, Button } from "antd"
import PaginationPonent from "../common"
import { useSelector } from "react-redux";
import ClassOrBuildingDetail from "./classOrBuildingDetail"
import PerfectScrollbar from 'react-perfect-scrollbar';
import Nodata from "../../../media/picture/noData.png"

const { Column, ColumnGroup } = Table

export default function ClassOrBuildingTable({
    //type 1班级 2楼栋
    type, dataSource, onClick
}) {
    const [visible, setVisible] = useState(false)
    const modalData = useSelector(state => state.detailData_reducer)
    // const modalData = {}

    //判断是否显示nodata组件
    function showData(data) {
        let show = true
        for (let i in data) {
            for (let k in data[i]) {
                if (data[i][k]?.length > 0) {
                    show = false
                }
            }
        }
        return show
    }

    return <div className="ll-table">
        <Table
            bordered
            pagination={false}
            dataSource={dataSource}
        >
            <Column
                title={type == 1 ? "班级" : "楼栋"}
                // dataIndex={type == 1 ? "className" : "building"}
                render={rank =>{
                    if(type == 1){
                        return rank.className ?? "-"
                    }else{
                        return rank.building ?? "-"
                    }
                }
                }
            />
            <Column
                title={type == 1 ? "班主任" : "宿管人员"}
                // dataIndex={type == 1 ? "classTeacher" : "buildingManager"}
                render={rank =>{
                    if(type == 1){
                        return rank.classTeacher ?? "-"
                    }else{
                        return rank.buildingManager ?? "-"
                    }
                }
                }
            />
            <ColumnGroup title="早寝状态">
                <Column
                    title="未签"
                    render={rank =>
                        rank.morningState.notSign == 0 ?
                            <div >{`${rank.morningState.notSign}人次`}</div>
                            : <div className="ll-redFont">{`${rank.morningState.notSign}人次`}</div>
                    }
                />
                <Column
                    title="晚签/早签"
                    render={rank => <div>{`${rank.morningState.lateSign}/${rank.morningState.earlySign}人次`}</div>}
                />
            </ColumnGroup>
            <ColumnGroup title="午寝状态">
                <Column
                    render={rank =>
                        rank.afternoonState.notSign == 0 ?
                            <div >{`${rank.afternoonState.notSign}人次`}</div>
                            : <div className="ll-redFont">{`${rank.afternoonState.notSign}人次`}</div>
                    }
                    title="未签"
                />
                <Column
                    render={rank => <div>{`${rank.afternoonState.lateSign}/${rank.afternoonState.earlySign}人次`}</div>}
                    title="晚签/早签"
                />
            </ColumnGroup>
            <ColumnGroup title="晚寝状态">
                <Column
                    render={rank =>
                        rank.nightState.notSign == 0 ?
                            <div >{`${rank.nightState.notSign}人次`}</div>
                            : <div className="ll-redFont">{`${rank.nightState.notSign}人次`}</div>
                    }
                    title="未签"
                />
                <Column
                    render={rank => <div>{`${rank.nightState.lateSign}/${rank.nightState.earlySign}人次`}</div>}
                    title="晚签/早签"
                />
            </ColumnGroup>
            <Column
                title="操作"
                render={(rank) => <div
                    className="ll-cursorP"
                    onClick={() => {
                        // onClick(type == 1 ? rank.classId : (rank.exactBuildingId, rank.floorId))
                        if(type ==1) {
                            onClick(rank.classId)
                        }
                        else{
                            onClick(rank.exactBuildingId, rank.floorId)
                        }
                        setVisible(true)
                    }}
                >详情</div>}
            />
        </Table>
        <Modal
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
        // title={}
        >
            <PerfectScrollbar style={{ height: 600, marginTop: 20, position: "relative", marginBottom: 40 }}>
                {
                    showData(modalData) ? <div
                        style={{
                            textAlign: "center",
                            height: 200,
                            marginTop: 150
                        }}
                    >
                        <img src={Nodata} width={300} />
                        <div>暂无数据</div>
                    </div> : null
                }
                {
                    modalData.morningState?.notSignList?.length > 0 || modalData.morningState?.earlySignList?.length > 0 || modalData.morningState?.lateSignList?.length > 0 ?
                        <ClassOrBuildingDetail
                            title="早寝状态"
                            detailData={modalData.morningState}
                        /> : null
                }
                {
                    modalData.afternoonState?.notSignList?.length > 0 || modalData.afternoonState?.earlySignList?.length > 0 || modalData.afternoonState?.lateSignList?.length > 0 ?
                        <ClassOrBuildingDetail
                            title="午寝状态"
                            detailData={modalData.afternoonState}
                        /> : null
                }
                {
                    modalData.nightState?.notSignList?.length > 0 || modalData.nightState?.earlySignList?.length > 0 || modalData.nightState?.lateSignList?.length > 0 ?
                        <ClassOrBuildingDetail
                            title="晚寝状态"
                            detailData={modalData.nightState}
                        /> : null
                }
            </PerfectScrollbar>
            <div className="ll-modal-btnctn" style={{
                position: "absolute",
                bottom: 0,
                width: "calc(100% - 48px)",
                marginBottom: 20
            }}>
                <Button
                    onClick={() => setVisible(false)}
                >返回</Button>
            </div>
        </Modal>

    </div>
}