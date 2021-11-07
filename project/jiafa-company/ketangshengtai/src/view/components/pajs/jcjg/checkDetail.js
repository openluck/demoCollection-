import React, { useState, useEffect } from "react";
import "../../../../style/pajs/jcjg/checkDetail.scss";
import { Select, DatePicker, Button, message } from "antd"
import PagePonent from "../../pagePonent";
import PerfectScrollbar from "react-perfect-scrollbar";
import Modal from "antd/lib/modal/Modal";
import SVG from "../../../public/public-component-svg";
import {
  getSchoolAreaReq,
  getBuildingReq,
  getClassRoomReq,
  getSafetyEventReq,
  getRecordListReq,
  exportDetailReq,
  getRecordDetailsReq,
} from "./checkResultReq"
import { request } from "../../../../util/request";
import noneData from "../../../../media/picture/noneData.png"
import moment from "moment"
import { G } from "../../../../config/g";
import fullScreenImg from './../../../../media/picture/fullScreen.png'

const { Option } = Select;
// const { RangePicker } = DatePicker;

export default function CheckDetail(props) {
  // const orgCode = sessionStorage.getItem('orgCode')
  // const [schoolAreaList, setSchoolAreaList] = useState([])
  // const [curSchoolAreaId, setCurSchoolAreaId] = useState("")
  const [buildingList, setBuildingList] = useState([])
  const [curBuildingId, setCurBuildingId] = useState("")
  const [classRoomList, setClassRoomList] = useState([])
  const [curClassRoomId, setCurClassRoomId] = useState("")
  const [eventList, setEventList] = useState([])
  const [curEventId, setCurEventId] = useState("")
  const [startTime, setStartTime] = useState(moment().format('YYYY-MM-DD'))
  const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
  const [recordList, setRecordList] = useState([])
  const [curPage, setCurPage] = useState(1)
  const [visible, setVisible] = useState(false)
  // const [imgUrl, setImgUrl] = useState("")
  const [detail, setDetail] = useState({})
  const [total, setTotal] = useState([])

  const [fullSrc, setFullSrc] = useState('')

  useEffect(() => {
    // getSchoolIdList()
    getBuildingList({schoolAreaId: ''})
    getEventList()
    console.log('G', G)
  }, [])

  // useEffect(() => {
  //   getBuildingList({ schoolAreaId: curSchoolAreaId })
  // }, [curSchoolAreaId])

  useEffect(() => {
    getClassRoomList({ buildingId: curBuildingId })
  }, [curBuildingId])

  useEffect(() => {
    search()
  }, [curPage])

  function check(id) {
    setVisible(true)
    getRecordDetails({ eventId: id })
  }

  function search(param) {
    if (param) {
      console.log("!!!!!")
      setCurPage(1)
    }
    let pr = {
      school: '',
      storey: curBuildingId,
      classRoom: curClassRoomId,
      safetyEvent: curEventId,
      startDate: startTime,
      endDate: endTime,
      pageIndex: param ? 1 : curPage,
      pageSize: 20
    }
    getRecordList(pr)
  }

  // const getSchoolIdList = async pr => {
  //   let { data } = await getSchoolAreaReq(pr)
  //   if (data.result) {
  //     setSchoolAreaList(data.data)
  //   }
  //   else {
  //     message.warning(data.message)
  //   }
  // }

  const getBuildingList = async pr => {
    let { data } = await getBuildingReq(pr)
    if (data.result) {
      setBuildingList(data.data)
      setCurBuildingId('')
    }
    else {
      message.warning(data.message)
    }
  }

  const getClassRoomList = async pr => {
    let { data } = await getClassRoomReq(pr)
    if (data.result) {
      setClassRoomList(data.data)
      setCurClassRoomId('')
    }
    else {
      message.warning(data.message)
    }
  }

  const getEventList = async pr => {
    let { data } = await getSafetyEventReq(pr)
    if (data.result) {
      setEventList(data.data)
    }
    else {
      message.warning(data.message)
    }
  }

  const getRecordList = async pr => {
    let { data } = await getRecordListReq(pr)
    if (data.result) {
      setRecordList(data.data)
      setTotal(data.total)
    }
    else {
      message.warning(data.message)
    }
  }

  const exportDetailList = async params => {
    let { data } = await request("checkDetail/exportDetail", params)
    if (data.result) {
      // message.info()
      const file = data.data.excel_file
      window.open(G.serverUrl + '/' + file);
    } else {
      message.warning(data.message)
    }
  }

  const getRecordDetails = async pr => {
    let { data } = await getRecordDetailsReq(pr)
    if (data.result) {
      setDetail(data.data)
    }
    else {
      message.warning(data.message)
    }
  }
  const dateFormat = 'YYYY-MM-DD';
  return (
    <div className="ll-checkDetail" style={{ height: "100%" }}>
      <h2 className="ll-checkDetail-title">检查记录列表</h2>
      <div className="ll-conditionAndButton">
        <div className="ll-conditionAndButton-left">
          {/* <div className="ll-searchCondition">
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              style={{ width: 200 }}
              value={curSchoolAreaId}
              onChange={value => {
                setCurSchoolAreaId(value)
              }}
            >
              {
                schoolAreaList?.map(item =>
                  <Option
                    value={item.schoolAreaId}
                    key={item.schoolAreaId}
                  >
                    {item.schoolAreaName}
                  </Option>
                )
              }
            </Select>
          </div> */}
          <div className="ll-searchCondition">
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              style={{ width: 150 }}
              value={curBuildingId}
              onChange={value => {
                setCurBuildingId(value)
              }}
            >
              {
                buildingList?.map(item =>
                  <Option
                    value={item.buildingId}
                    key={item.buildingId}
                  >
                    {item.buildingName}
                  </Option>
                )
              }
            </Select>
          </div>
          <div className="ll-searchCondition">
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              style={{ width: 150 }}
              value={curClassRoomId}
              onChange={value => {
                setCurClassRoomId(value)
              }}
            >
              {
                classRoomList?.map(item =>
                  <Option
                    value={item.classRoomId}
                    key={item.classRoomId}
                  >
                    {item.classRoomName}
                  </Option>
                )
              }
            </Select>
          </div>
          <div className="ll-searchCondition">
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              style={{ width: 150 }}
              value={curEventId}
              onChange={value => {
                setCurEventId(value)
              }}
            >
              {
                eventList?.map(item =>
                  <Option
                    value={item.eventId}
                    key={item.eventId}
                  >
                    {item.eventName}
                  </Option>
                )
              }
            </Select>
          </div>
          <div className="ll-searchCondition">
            {/* <RangePicker
              getCalendarContainer={triggerNode => triggerNode.parentNode}
              defaultValue={[moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')]}
              onChange={value => {
                setStartTime(moment(value[0]._d).format('YYYY-MM-DD'))
                setEndTime(moment(value[1]._d).format('YYYY-MM-DD'))
                // console.log(moment(value[0]._d).format('YYYY-MM-DD'))
                // console.log(value)
              }}
            /> */}
            <DatePicker
              defaultValue={moment(new Date(), dateFormat)}
              format={dateFormat}
              allowClear={false}
              onChange={(date, dateString) => {
                setStartTime(moment(new Date(dateString)).format('YYYY-MM-DD'))
                setEndTime(moment(new Date(dateString)).format('YYYY-MM-DD'))
              }}
            />
          </div>
          <div>
            <Button
              className="ll-searchBTN"
              type="primary"
              onClick={() => {
                search(true)
              }}
            >
              查询
                        </Button>
          </div>
        </div>
        <div className="ll-conditionAndButton-right">
          <Button
            type="primary"
            style={{
              display: "flex",
              alignItems: "center"
            }}
            onClick={() => {
              exportDetailList({
                school: '',
                storey: curBuildingId,
                classRoom: curClassRoomId,
                safetyEvent: curEventId,
                startDate: startTime,
                endDate: endTime
              })
            }}
          >
            <SVG
              width={16}
              height={16}
              type="dc"
              style={{ marginRight: 5 }}
              fill="white"
            />导出明细
                            </Button>
        </div>
      </div>
      {recordList.length > 0 ?
        <div className="ll-recordList" style={{ height: "calc(100% - 140px)" }}>
          <div className="ll-recordList-header" style={{ backgroundColor: "#fafafa" }}>
            <div className="ll-recordList-classRoom"
              style={{ borderLeft: "#ebebeb 1px solid" }}
            >教室</div>
            <div className="ll-recordList-writePerson">记录人</div>
            <div className="ll-recordList-recordTime">事件发生时间</div>
            <div className="ll-recordList-safeEvent">安全事件</div>
            <div className="ll-recordList-remark">备注</div>
            <div className="ll-recordList-operation">操作</div>
          </div>
          <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
            {

              recordList?.map((item, index) => <div className="ll-recordList-header" key={Math.random()}>
                <div
                  className="ll-recordList-classRoom"
                  style={{ borderLeft: "#ebebeb 1px solid", borderTop: "none" }}
                >{item.classRoom}</div>
                <div className="ll-recordList-writePerson" style={{ borderTop: "none" }}
                >{item.writePerson}</div>
                <div className="ll-recordList-recordTime" style={{ borderTop: "none" }}>{moment(item.writeTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                <div className="ll-recordList-safeEvent" style={{ borderTop: "none" }} title={item.safetyEvent}>{item.safetyEvent}</div>
                <div className="ll-recordList-remark" style={{ borderTop: "none" }} title={item.remark}>{item.remark}</div>
                <div className="ll-recordList-operation" style={{ borderTop: "none" }}><span onClick={() => { check(item.eventId) }}>
                  <SVG
                    width={16}
                    height={16}
                    type="ck"
                    style={{ marginRight: 5 }}
                    fill="#aaaeb3"
                  />查看结果
                                    </span></div>
              </div>)

            }
          </PerfectScrollbar>
        </div> : <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
          <img src={noneData} />
          <p>暂无数据</p>
        </div>
      }
      <div className="ll-paginationCTN" style={{ display: recordList.length > 0 ? "block" : "none" }}>
        <PagePonent
          pageIndex={curPage}
          pageSize={20}
          pageChan={value => {
            setCurPage(value)
          }}
          len={recordList && recordList.length || 0}
          total={total}
        />
      </div>
      <Modal
        width={550}
        title="记录详情"
        visible={visible}
        footer={null}
        onCancel={
          () => { setVisible(false) }
        }
      >
        <div className="ll-detailModal">
          <div>
            <img src={G.serverUrl + "/pic/findById/" + detail.imgUrl + "/" + sessionStorage.getItem('orgCode')} style={{ width: "100%", height: 280 }} />
          </div>
          <div>
            时间：{moment(detail.time).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div>
            告警事件：{detail.warnEvent?.map((item, index) => index == detail.warnEvent.length - 1 ? item : `${item}、`)}
          </div>
          <div>
            备注：{detail.remark}
          </div>
          <div className="ll-confirmBTN" style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(false)
              }}
            >确定</Button>
          </div>
          <div className='ll-detailModalFull' onClick={() => {
            let src = G.serverUrl + "/pic/findById/" + detail.imgUrl + "/" + sessionStorage.getItem('orgCode')
            setFullSrc(src)
          }}>
            <img src={fullScreenImg} />
          </div>
          <div className='ll-detailModalAllFull' style={{ display: fullSrc ? 'block' : 'none' }}>
            <img src={fullSrc} />
            <div onClick={() => setFullSrc('')}>X</div>
          </div>
        </div>

      </Modal>


    </div>
  )
}