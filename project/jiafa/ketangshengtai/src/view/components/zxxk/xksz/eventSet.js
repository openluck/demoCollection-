import React, { useState, useEffect } from "react"
import "../../../../style/pajs/aqsz/aqszFormWork.scss"
import { Button, Input, Radio, TimePicker, message, Modal } from "antd"
import PagePonent from "../../pagePonent"
import PerfectScrollbar from "react-perfect-scrollbar"
import SVG from "../../../public/public-component-svg"
import { request } from "../../../../util/request"
import noneData from "../../../../media/picture/noneData.png"
import DelectConfirmModal from "../../deletConfirmModal"



export default function EventSet(props) {
  const [tableData, setTableData] = useState([])
  const [curPage, setCurPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [optionType, setOptionType] = useState("")
  const [clickOne, setClickOne] = useState({})
  const [clickName, setClickName] = useState("")
  const [clickrange, setClickrange] = useState("")
  const [clickId, setClickId] = useState("")
  const [curTypeId, setCurTypeId] = useState(1)
  const [delVisible, setDelVisible] = useState(false)
  const [total, setTotal] = useState(0)

  let param = {
    pageIndex: curPage,
    pageSize: 20
  }

  useEffect(() => {
    getEventList(param)
  }, [curPage])

  useEffect(() => {
    getEventList(param)
  }, [])

  useEffect(() => {
    let pr = {
      userId: clickId
    }
  }, [clickId])

  function OpenModal(item) {
    setVisible(true)
    setClickId(item?.icidentId ?? "")
    setClickOne(item ?? null)
    setClickName(item?.icidentName ?? "")
    setClickrange(item?.range ?? "")
    console.log(item?.icidentTypeId)
    setCurTypeId(item?.icidentTypeId ?? "")
    if (item) {
      setOptionType(1)
    }
    else {
      setOptionType(0)
    }
  }

  function modalVi(type, data) {
    // console.log(type, data);
    if (type === 'cancel') {
      setVisible(false)
    } else {
      //   this.getTableData(page);
      setVisible(false)
    }
  }

  //获取事件列表
  const getEventList = async pr => {
    let { data } = await request("incidentSet/getIncidentList", pr)
    if (data.result) {
      setTableData(data.data)
      setTotal(data.total)
    }
    else {
      message.warning(data.message)
    }
  }

  //删除事件
  const delEvent = async pr => {
    let { data } = await request("incidentSet/deleIncident", pr)
    if (data.result) {
      let page = curPage;
      if (tableData.length === 1) {
        if (curPage === 1) {
          page = 1;
        } else {
          page = curPage - 1;
        }
      } else {
        page = curPage;
      }
      param.pageIndex = page;
      setCurPage(page);
      getEventList(param)
    }
    else {
      message.warning(data.message)
    }
  }

  //添加/编辑事件
  const addOrEdit = async pr => {
    let { data } = await request("incidentSet/addChangeIncident", pr)
    if (data.result) {
      getEventList(param);
      setVisible(false);
    } else {
      message.warning(data.message)
    }
  }

  function confirm() {
    if (clickName && curTypeId){
    let pr = {
      icidentId: clickId ?? "",
      icidentName: clickName,
      icidentTypeId: curTypeId
    }
    addOrEdit(pr)
  }else{
    message.info('请填写完整信息');
  }
  }

  return <div className="ll-aqsz-outer">
    <div className="ll-aqsz-content">
      <div className="ll-aqsz-firstFloor">
        <h2 style={{ margin: 0 }}>事件列表</h2>
        <Button
          type="primary"
          onClick={() => {
            OpenModal()
            setOptionType(0)
          }}
        ><SVG
            type="tj"
            width={16}
            height={16}
            fill="white"
            style={{ marginRight: 5 }}
          />添加事件</Button>
      </div>
      {
        tableData.length > 0 ?
          <div className="ll-aqsz-table">
            <div className="ll-aqsz-rank" style={{ backgroundColor: "#fafafa", borderTop: "1px solid #ebebeb" }}>
              <div className="ll-aqsz-eventName">事件名称</div>
              <div className="ll-aqsz-eventType">事件类型</div>
              {/* <div className="ll-aqsz-controlEvent">监控人员</div> */}
              <div className="ll-aqsz-operation">操作</div>
            </div>
            <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
              {

                tableData.map((item, index) =>
                  <div className="ll-aqsz-rank" key={index} >
                    <div className="ll-aqsz-eventName">{item.icidentName ?? "-"}</div>
                    <div className="ll-aqsz-eventType">{item.icidentTypeName ?? "-"}</div>
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
                          style={{ marginRight: 5 }} />编辑
                                    </div>
                      <div
                        className="ll-aqsz-sc"
                        onClick={() => { setDelVisible(true), setClickId(item.icidentId) }}
                      >
                        <SVG
                          type="sc"
                          width={16}
                          height={16}
                          fill="aaaeb3"
                          style={{ marginRight: 5 }} />删除
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
      <div className="ll-paginationCTN" style={{ display: total > 0 ? "block" : "none" }}>
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
      <Modal
        width={500}
        title={optionType == 0 ? "添加事件" : "编辑事件"}
        footer={null}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <div className="ll-controlTimeModal">
          <div style={{ paddingTop: 0, display: "flex", alignItems: "center" }}>
            事件名称：<Input
              style={{ width: 330 }}
              value={clickName}
              onChange={e => {
                setClickName(e.target.value)
              }}
              maxLength={10}
            ></Input>
          </div>
          <div style={{ paddingTop: 20, display: "flex", alignItems: "flex-start" }}>
            事件类型：
            <Radio.Group value={curTypeId} onChange={e => setCurTypeId(e.target.value)} >
              <Radio value="1" style={{ paddingRight: 10 }}>教师违纪</Radio>
              <Radio value="2" style={{ paddingRight: 10 }}>学生违纪</Radio>
              <Radio value="3" style={{ paddingRight: 10 }}>其他</Radio>
            </Radio.Group>
          </div>
          <div className="ll-modalBTNCTN">
            <Button type="primary" onClick={() => { confirm() }}>确定</Button>
            <Button onClick={() => { setVisible(false) }}>取消</Button>
          </div>
        </div>
      </Modal>
      <DelectConfirmModal
        visible={delVisible}
        onOk={() => {
          delEvent({ icidentId: clickId })
          setDelVisible(false)
        }}
        onCancel={() => {
          setDelVisible(false)
        }}
        text="确定删除该事件？"
      />
    </div>
  </div>
}