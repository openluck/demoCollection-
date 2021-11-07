import React, { useState, useEffect } from "react"
import "../../../../style/pajs/aqsz/aqszFormWork.scss"
import { Button, Input, Radio, TimePicker, message } from "antd"
import SVG from "../../../public/public-component-svg"
import PagePonent from "../../pagePonent"
import PerfectScrollbar from "react-perfect-scrollbar"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"
import { request } from "../../../../util/request"
import DelectConfirmModal from "../../deletConfirmModal"
import noneData from "../../../../media/picture/noneData.png"


const { TextArea } = Input

export default function SafeEventSet(props) {
  const [tableData, setTableData] = useState([])
  const [curPage, setCurPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [optionType, setOptionType] = useState("")
  const [clickOne, setClickOne] = useState({})
  const [clickName, setClickName] = useState("")
  const [clickRemark, setClickRemark] = useState("")
  const [clickId, setClickId] = useState("")
  const [total, setTotal] = useState(0)
  const [delVisible, setDelVisible] = useState(false)

  let param = {
    pageIndex: curPage,
    pageSize: 20
  }

  useEffect(() => {
    getEventList(param)
  }, [curPage])

  function OpenModal(item) {
    setVisible(true)
    setClickId(item?.eventId ?? "")
    setClickOne(item ?? null)
    setClickName(item?.eventName ?? "")
    setClickRemark(item?.remark ?? "")
    if (item) {
      setOptionType(1)
    }
    else {
      setOptionType(0)
    }
  }

  //获取事件列表
  const getEventList = async pr => {
    let { data } = await request("eventSet/getEventsList", pr)
    if (data.data.length == 0 && pr.pageIndex > 1) {
      setCurPage(curPage - 1)
    }
    if (data.result) {
      setTableData(data.data)
      setTotal(data.total)
    }
    else {
      message.warning(data.message)
    }
  }

  //删除控制事件
  const delEvent = async pr => {
    let { data } = await request("eventSet/delectEvent", pr)
    if (data.result) {
      getEventList(param)
    }
    else {
      message.warning(data.message)
    }
  }

  //编辑或添加事件
  const addOrEdit = async pr => {
    let { data } = await request("eventSet/editOrAddEvent", pr)
    if (data.result) {
      getEventList(param)
      setVisible(false)
    }
    else {
      message.warning(data.message)
    }
  }

  function confirm() {
    if (!clickName) {
      message.warning("请输入事件名称")
    }
    // else if (!clickRemark) {
    //     message.warning("请输入备注！")
    // }
    else {
      let pr = {
        eventId: clickId ?? "",
        eventName: clickName,
        remark: clickRemark,
        optionType: clickId ? 1 : 0
      }
      addOrEdit(pr)
      // setVisible(false)
    }
  }

  return <div className="ll-aqsz-outer">
    <div className="ll-aqsz-content">
      <div className="ll-aqsz-firstFloor">
        <h2 style={{ margin: 0 }}>安全事件设置</h2>
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
      {tableData.length > 0 ?
        <div className="ll-aqsz-table">
          <div className="ll-aqsz-rank" style={{ backgroundColor: "#fafafa", borderTop: "1px solid #ebebeb" }}>
            <div className="ll-aqsz-timeName">事件名称</div>
            <div className="ll-aqsz-remark">备注</div>
            {/* <div className="ll-aqsz-controlEvent">监控事件</div> */}
            <div className="ll-aqsz-operation">操作</div>
          </div>
          <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
            {
              tableData.map((item, index) =>
                <div className="ll-aqsz-rank" key={index}
                // 
                >
                  <div className="ll-aqsz-timeName">{item.eventName}</div>
                  <div className="ll-aqsz-remark">{item.remark}</div>
                  {/* <div className="ll-aqsz-controlEvent">{item.controlEvent}</div> */}
                  <div className="ll-aqsz-operation">
                    {
                      item.type === '1' ? '-' : (
                        <>
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
                            onClick={() => { setDelVisible(true), setClickId(item.eventId) }}
                          >
                            <SVG
                              type="sc"
                              width={16}
                              height={16}
                              fill="aaaeb3"
                              style={{ marginRight: 5 }} />删除
                                    </div>
                        </>
                      )
                    }

                  </div>
                </div>
              )

            }
          </PerfectScrollbar>
        </div>
        :
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
          <div style={{ paddingTop: 0, display: "flex", justifyContent: "flex-end" }}>
            事件名称：<Input
              style={{ width: 330 }}
              value={clickName}
              maxLength={10}
              onChange={e => {
                setClickName(e.target.value)
              }}
            ></Input>
          </div>
          <div style={{ paddingTop: 20, display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
            备注：<TextArea
              style={{ width: 330 }}
              value={clickRemark}
              maxLength={200}
              onChange={e => {
                setClickRemark(e.target.value)
              }}
            ></TextArea>
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
          delEvent({ eventId: clickId })
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