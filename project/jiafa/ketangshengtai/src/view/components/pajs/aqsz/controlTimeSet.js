import React, { useState } from "react"
import "../../../../style/pajs/aqsz/aqszFormWork.scss"
import { Button, Input, Radio, TimePicker, message } from "antd"
import SVG from "../../../public/public-component-svg"
import PagePonent from "../../pagePonent"
import PerfectScrollbar from "react-perfect-scrollbar"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"
import { request } from "../../../../util/request"
import noneData from "../../../../media/picture/noneData.png"
import DelectConfirmModal from "../../deletConfirmModal"


export default function ControlTimeSet(props) {
  const [tableData, setTableData] = useState([])
  const [curPage, setCurPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [optionType, setOptionType] = useState("")
  const [clickOne, setClickOne] = useState({})
  const [stValue, setStValue] = useState("")
  const [edValue, setEdValue] = useState("")
  const [clickName, setClickName] = useState("")
  const [clickEvent, setClickEvent] = useState("")
  const [clickId, setClickId] = useState("")
  const [total, setTotal] = useState(0)
  const [delVisible, setDelVisible] = useState(false)

  let param = {
    pageIndex: curPage,
    pageSize: 20
  }

  useEffect(() => {
    getTimeList(param)
  }, [curPage])

  function OpenModal(item) {
    setVisible(true)
    setClickId(item?.timeId)
    setClickOne(item ?? null)
    setStValue(item ? item.startTime : null)
    setEdValue(item ? item.endTime : null)
    setClickName(item ? item.timeName : "")
    setClickEvent(item ? item.controlEvent : "")
    if (item) {
      setOptionType(1)
    }
    else {
      setOptionType(0)
    }
  }

  //获取时间列表
  const getTimeList = async pr => {
    let { data } = await request("timeSet/getTimeList", pr)
    if (data.data.length == 0 && curPage > 1) {
      setCurPage(curPage - 1)
    }
    if (data.result) {
      let temp = []
      data.data.map(item => {
        temp.push({
          ...item,
          startTime: item.startTime.substring(0, 5),
          endTime: item.endTime.substring(0, 5)
        })
      })
      setTableData([...temp])
      setTotal(data.total)
    }
    else {
      message.warning(data.message)
    }
  }

  //删除控制时间
  const delControlTime = async pr => {
    let { data } = await request("timeSet/delectTime", pr)
    if (data.result) {
      getTimeList(param)
    }
    else {
      message.warning(data.message)
    }
  }

  //编辑或添加时间
  const addOrEdit = async pr => {
    let { data } = await request("timeSet/editOrAddTime", pr)
    if (data.result) {
      getTimeList(param)
    }
    else {
      message.warning(data.message)
    }
  }

  function confirm() {
    if (!clickName) {
      message.warning("请输入时段名称！")
    }
    else if (!stValue) {
      message.warning("请输入开始时间！")
    }
    else if (!edValue) {
      message.warning("请输入结束时间！")
    }
    else if (!clickEvent) {
      message.warning("请输入监控事件！")
    }
    else if (stValue > edValue) {
      message.warning("结束时间不得早于开始时间，请重新设置！")
    }
    else {
      let pr = {
        timeId: clickId ?? "",
        timeName: clickName,
        startTime: stValue,
        endTime: edValue,
        controlEvent: clickEvent,
        optionType: clickId ? 1 : 0
      }
      addOrEdit(pr)
      setVisible(false)
    }
  }

  return <div className="ll-aqsz-outer">
    <div className="ll-aqsz-content">
      <div className="ll-aqsz-firstFloor">
        <h2 style={{ margin: 0 }}>监控时段设置</h2>
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
          />添加时段</Button>
      </div>
      {
        tableData.length > 0 ?
          <div className="ll-aqsz-table">

            <div className="ll-aqsz-rank" style={{ backgroundColor: "#fafafa", borderTop: "1px solid #ebebeb" }}>
              <div className="ll-aqsz-timeName">名称</div>
              <div className="ll-aqsz-controlTime">监控时段</div>
              <div className="ll-aqsz-controlEvent">监控事件</div>
              <div className="ll-aqsz-operation">操作</div>
            </div>
            <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
              {
                tableData.map((item, index) =>
                  <div className="ll-aqsz-rank" key={index}
                  // 
                  >
                    <div className="ll-aqsz-timeName">{item.timeName}</div>
                    <div className="ll-aqsz-controlTime">{`${item.startTime}~${item.endTime}`}</div>
                    <div className="ll-aqsz-controlEvent">{item.controlEvent == 1 ? "空室异常" : item.controlEvent == 2 ? "人员滞留" : "--"}</div>
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
                        onClick={() => { setClickId(item.timeId); setDelVisible(true) }}
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
        title={optionType == 0 ? "添加监控时段" : "编辑监控时段"}
        footer={null}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <div className="ll-controlTimeModal">
          <div style={{ paddingTop: 0 }}>
            名称：<Input
              maxLength={10}
              style={{ width: 200 }}
              value={clickName}
              onChange={e => {
                setClickName(e.target.value)
              }}
            ></Input>
          </div>
          <div>
            监控时段：<TimePicker
              style={{ width: 100 }}
              value={stValue ? moment(stValue, "HH:mm") : null}
              onChange={(a) => {
                setStValue(a._d.toString().substring(16, 21))
              }}
              format={"HH:mm"}
            ></TimePicker>
            <span>~</span>
            <TimePicker
              style={{ width: 100 }}
              value={edValue ? moment(edValue, "HH:mm") : null}
              onChange={(a) => {
                console.log(a._d.toString().substring(16, 21))
                setEdValue(a._d.toString().substring(16, 21))
              }}
              format={"HH:mm"}
            ></TimePicker>
          </div>
          <div>
            监控事件：<Radio.Group
              value={
                // clickOne?.controlEvent == "空室异常" ? 1
                //     : clickOne?.controlEvent == "人员滞留" ? 2
                //         : null
                clickEvent
              }
              onChange={e => {
                setClickEvent(e.target.value)
              }}
            >
              <Radio value={"1"}>空室异常</Radio><SVG
                type="ts"
                width={16}
                height={16}
                fill="aaaeb3"
                style={{ marginRight: 20 }}
                title="通过红外摄像机监控教室，有人进入则进行报警，白天夜晚场景均适用。"
              />
              <Radio value="2">人员滞留</Radio><SVG
                type="ts"
                width={16}
                height={16}
                fill="aaaeb3"
                style={{ marginRight: 5 }}
                title="通过AI算法识别教室内是否有人，适用于白天或光线充足场景。"
              />
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
          delControlTime({ timeId: clickId })
          setDelVisible(false)
        }}
        onCancel={() => {
          setDelVisible(false)
        }}
        text="确定删除该时段？"
      />
    </div>
  </div>
}