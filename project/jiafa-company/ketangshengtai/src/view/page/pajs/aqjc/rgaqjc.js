/*
 * @Author: xm
 * @Date: 2020-07-27 11:00:00
 * @Last Modified by: mzc
 * @Last Modified time: 2021-10-19 10:31:46
 * 人工安全检查
 */

import React, { useState, useEffect, useCallback } from "react";
import "./../../../../style/pajs/aqjc/rgaqjc.scss";
import SafeRecord from "./../../../components/zxxk/zxxk/checkCourseRecord";
import { Tag, Tooltip, DatePicker, Tree, message, Spin } from "antd";
import moment from "moment";
import { request } from "./../../../../util/request";
import ScrollBar from "react-perfect-scrollbar";
import Modalscreen from "./../../../components/modalPonent";
import HlsVideo from "./../../../xgVideo/index";
import VlcVideo from "./vlcVideo";

import notdata from "./../../../../media/picture/noneData.png";
import fullScreenImg from "./../../../../media/picture/fullScreen.png";
import no_permission from "./../../../../media/picture/no_permission.png";

import {
  getDate,
  placeMap,
  timeTransform,
  toHHmmss,
  animate,
  getClassroomId,
  disabledEndDate,
  toHHmmss2,
  tourMap,
} from "./format";

import {
  getPlaceTree,
  getVidiconTimeSel,
  getIcidentList,
  saveRecord,
  getRecordTabList,
  getRecordList,
} from "./rgaqjc-req";

const { CheckableTag } = Tag;

const $ = (selector) => document.querySelector(selector);

const getWindowWidth = () => {
  return window.innerWidth - 555;
};

const orgCode = sessionStorage.getItem("orgCode");

// 时间点列表
const progressList = [
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const Rgaq = (props) => {
  const [baseWidth, setBaseWidth] = useState(
    getWindowWidth() < 800 ? 800 : getWindowWidth()
  );
  const [expandedKeys, setExpandedKeys] = useState([""]);
  const [placeTree, setPlaceTree] = useState(); // 场所树
  const [classRoomId, setClassRoomId] = useState(""); // 教室id
  const [date, setDate] = useState(getDate());

  const [liveVideoList, setLiveVideoList] = useState([[], [], []]); // 直播摄像头列表
  const [videoList, setVideoList] = useState([]); // 回放摄像头列表
  const [secVideoList, setSecVideoList] = useState([]); // 小节回放视频列表
  const [crrVideoIndex, setCrrVideoIndex] = useState(0); // 当前正在播放的回放视频列表index

  const [rtspRtmpFlag, setrtspRtmpFlag] = useState(false); // true vlc, false rtmp

  const [tabList, setTabList] = useState([]); // tab列表
  const [icidentId, setIcidentId] = useState(""); // 事件id
  const [safeListInfo, setSafeListInfo] = useState({
    list: [],
    total: 0,
  });
  const [pageIndex, setPageIndex] = useState(2); // 分页页码

  const [icidentList, setIcidentList] = useState([]); // 截屏事件列表
  const [displayIcidentList, setDisplayIcidentList] = useState([]); // 截屏事件展示列表
  const [selectedTags, setSelectedTags] = useState([]); //截屏事件点击列表
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(2); // 2：截屏, 1: 显示
  const [modalURL, setModalURL] = useState("");
  const [modalInputData, setModalInputData] = useState("");
  const [modalTime, setModleTime] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [fullSrc, setFullSrc] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [messageType, setMessageType] = useState(1);

  const modalCon = useMemo(() => {
    return (
      <div className="mzc-rgmodalCon">
        <div className="mzc-modalConImgb">
          <div
            className="mzc-modalConFull"
            onClick={() => {
              const src =
                modalType === 2
                  ? modalURL
                  : G.serverUrl + "/pic/findById/" + modalURL + "/" + orgCode;
              setFullSrc(src);
              setIsFull(true);
            }}
          >
            <img src={fullScreenImg} alt="" />
          </div>

          <img
            src={
              modalType === 2
                ? modalURL
                : G.serverUrl + "/pic/findById/" + modalURL + "/" + orgCode
            }
            alt="暂无图片"
          />
        </div>
        <p className="mzc-time">
          时间：
          <span>
            {modalType === 2
              ? modalTime
              : isNaN(modalTime)
              ? modalTime
              : toHHmmss2(modalTime)}
          </span>
        </p>
        选择事件：
        {modalType === 2
          ? icidentList &&
            icidentList[0] &&
            icidentList.map((item) => {
              return (
                <CheckableTag
                  className="mzc-checktag"
                  key={item.eventId}
                  checked={
                    selectedTags ? selectedTags.indexOf(item.eventId) > -1 : []
                  }
                  onChange={(checked) =>
                    handleChangeCheck(item.eventId, checked)
                  }
                >
                  {item.eventName}
                </CheckableTag>
              );
            })
          : displayIcidentList[0] &&
            displayIcidentList.map((item) => {
              return (
                <CheckableTag
                  className="mzc-checktag"
                  key={item.icidentId}
                  checked
                >
                  {item.icidentName}
                </CheckableTag>
              );
            })}
        {modalType === 2 ? (
          <div className="mzc-textarea">
            <textarea
              placeholder="请输入备注（非必填）"
              value={modalInputData}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 200) {
                  message.warning("不得超过200字");
                } else {
                  setModalInputData(value);
                }
              }}
            />
          </div>
        ) : (
          <p className="mzc-textareainfo">{modalInputData}</p>
        )}
      </div>
    );
  }, [
    modalInputData,
    displayIcidentList,
    icidentList,
    selectedTags,
    modalType,
    modalURL,
    modalTime,
  ]);

  // 初始化
  useEffect(() => {
    getPlaceTreeFun({ date });
    getIcidentListFun();
    window.addEventListener("resize", getBaseWidth);
    return () => {
      window.removeEventListener("resize", getBaseWidth);
    };
  }, []);
  const getBaseWidth = () => {
    let innerWidth = window.innerWidth - 555;
    let baseWidth = innerWidth < 800 ? 800 : innerWidth;
    setBaseWidth(baseWidth);
    const newScale = $(".xm-timeline-progress-timescale");
    if (newScale) {
      newScale.style.left = 0;
    }
  };
  /* 动态设置高度 */
  useEffect(() => {
    const xm_rgaqjc_top = $(".xm-rgaqjc-top");
    if (rtspRtmpFlag) {
      xm_rgaqjc_top.style.height =
        (baseWidth / 1080) * 600 + 46 + 47 + 15 + "px";
    } else {
      xm_rgaqjc_top.style.height = (baseWidth / 1080) * 600 + 15 + 46 + "px";
    }
  }, [rtspRtmpFlag, baseWidth]);

  /* 弹窗里面事件标签被选中 */
  const handleChangeCheck = useCallback(
    (id, checked) => {
      if (modalType === 2) {
        const nextSelectedTags = checked
          ? [...selectedTags, id]
          : selectedTags.filter((t) => t !== id);
        setSelectedTags(nextSelectedTags);
        console.log(nextSelectedTags);
      }
    },
    [selectedTags, modalType]
  );

  /* 获取场所树 */
  const getPlaceTreeFun = async (params) => {
    const { data } = await getPlaceTree(params);
    if (data.result) {
      if (data.data[0]) {
        const tourMapList = data.data.map((item) => {
          return tourMap(item);
        });
        const { classRoomId, expandedKeys } = getClassroomId(
          tourMapList[0],
          []
        );
        setExpandedKeys(expandedKeys);
        setClassRoomId(classRoomId);
        const newArr = tourMapList.map((item) => {
          return placeMap(item);
        });
        setPlaceTree(newArr);
        getVidiconTimeSelFun({ classRoomId, date: params.date });
        getRecordTabListFun({ classRoomId, date: params.date });
      } else {
        setPlaceTree([]);
        message.info("暂无数据，请切换日期");
      }
    } else {
      message.warning(data.message);
    }
  };

  /* 获取截屏事件列表 */
  const getIcidentListFun = async () => {
    const { data } = await getIcidentList();
    if (data.result) {
      setIcidentList(data.data);
    } else {
      message.warning(data.message);
    }
  };

  /* 切换page */
  const handleChangePage = useCallback(
    (page) => {
      setPageIndex(page);
      getRecordListFun({
        classRoomId,
        date,
        icidentId,
        pageIndex: page,
        pageSize: 10,
      });
    },
    [classRoomId, date, icidentId]
  );

  /* 日期切换 */
  const handleChangeDate = useCallback((datemoment, dateString) => {
    setDate(dateString);
    // getDate() === date ? '' : setrtspRtmpFlag(true)
    // setMomentDate(moment(dateString))
    getPlaceTreeFun({ date: dateString });
  });

  /* 选择场所 */
  const handleSelectRoom = useCallback(
    (classRoomId) => {
      classRoomId = classRoomId[0];
      if (!classRoomId || classRoomId.indexOf(" A") > -1) {
        return;
      }
      setClassRoomId(classRoomId);
      getRecordTabListFun({ classRoomId, date });
      getVidiconTimeSelFun({ classRoomId, date });
    },
    [date]
  );

  /* 查看单个列表信息 */
  const handleCheckdetail = useCallback((item) => {
    setModalType(1);
    setModalURL(item.imgUrl);
    setModalInputData(item.remark);
    setDisplayIcidentList(item.icidentList);
    setModleTime(item.time);
    setModalVisible(true);
  });

  /* 获取视频列表 */
  const getVidiconTimeSelFun = async (params) => {
    // params.classRoomId = 'A18－231'
    setDataLoading(true);
    const { data } = await getVidiconTimeSel(params);
    setDataLoading(false);
    if (data.result) {
      let newData = data.data;
      let liveVideoList = [[], [], []],
        secVideoList = [];
      if (newData.live && newData.live[0]) {
        let liveList = newData.live;
        liveList.map((item) => {
          let url = "";
          if (
            item.url &&
            item.url.length &&
            item.url[0].list &&
            item.url[0].list.length
          ) {
            let urlList = item.url[0].list;
            let urlInfo = urlList.find((el) => el.videotype === "hls");
            url = urlInfo ? urlInfo.url : "";
          }
          item.url = url;
        });
        liveVideoList[0] = liveList;
      }
      if (newData.unlive && newData.unlive[0]) {
        newData.unlive.map((item) => {
          item.startTime = item.startTime.substr(11);
          item.endTime = item.endTime.substr(11);
          item.urls.map((ele) => {
            ele.startTime = item.startTime;
            ele.endTime = item.endTime;
          });
        });
        secVideoList = newData.unlive;
      }
      setLiveVideoList(liveVideoList);
      setSecVideoList(secVideoList);
      setrtspRtmpFlag(!liveVideoList[0].length);
      setCrrVideoIndex(0);
    } else {
      message.warning(data.message);
    }
  };

  /* 进度条btn左右点击 */
  const handleProgressBtnClick = useCallback(
    (type) => {
      const scale = $(".xm-timeline-progress-timescale");
      // console.log(scale.style.left)
      if (!scale.style.left) {
        scale.style.left = 0;
      }
      const newScale = $(".xm-timeline-progress-timescale");
      const newScaleLeft = parseInt(newScale.style.left);
      // console.log('newScaleLeft', newScaleLeft)
      if (type === "left") {
        if (newScaleLeft + 63 >= 0) {
          const nowLeft = 0;
          animate(newScale, { left: nowLeft }, 150);
        } else {
          const nowLeft = newScaleLeft + 63;
          animate(newScale, { left: nowLeft }, 150);
        }
      } else {
        const centerboxWidth = $(".xm-timeline-centerbox").clientWidth;
        const newScaleWidth = newScale.clientWidth;
        if (newScaleLeft - 63 <= centerboxWidth - newScaleWidth) {
          const nowLeft = centerboxWidth - newScaleWidth;
          animate(newScale, { left: nowLeft }, 150);
        } else {
          const nowLeft = newScaleLeft - 63;
          animate(newScale, { left: nowLeft }, 150);
        }
      }
    },
    [crrVideoIndex, secVideoList]
  );

  /* 点击小节视频 */
  const handleClickSecVideo = useCallback(
    (item, time, index) => {
      if (crrVideoIndex === index) return;
      setCrrVideoIndex(index);
      setVideoList(item.urls && item.urls.length ? item.urls : []);
    },
    [crrVideoIndex]
  );

  /* 切换播放类型 0: 回放， 1: 直播 */
  const handlePlayType = useCallback((id) => {
    if (id === 0) {
      setVideoList(
        secVideoList.length &&
          secVideoList[0].urls &&
          secVideoList[0].urls.length
          ? secVideoList[0].urls
          : []
      );
      setCrrVideoIndex(0);
    }
    setrtspRtmpFlag(id === 0);

    console.log("liveVideoList", liveVideoList);
    console.log("secVideoList", secVideoList);
  });

  /* 截屏 */
  const handleScreenShot = (url) => {
    setModalType(2);
    setModalURL(url);
    const time = toHHmmss();
    setModleTime(time);
    setModalVisible(true);
  };

  /* tab切换 */
  const handleTabChange = useCallback(
    (id) => {
      if (icidentId === id) return;

      setIcidentId(id);
      setPageIndex(1);
      getRecordListFun({
        classRoomId,
        date,
        icidentId: id,
        pageIndex: 1,
        pageSize: 10,
      });
    },
    [classRoomId, date, icidentId]
  );

  /* 保存弹窗巡课记录 */
  const saveRecordFun = async (params, date) => {
    const { data } = await saveRecord(params);
    if (data.result) {
      message.info("保存成功");
      getRecordTabListFun({ classRoomId: params.placeId, date });
    } else {
      message.warning(data.message);
    }
  };

  /* 关闭弹窗 */
  const modalCancel = useCallback(() => {
    setModalInputData("");
    setSelectedTags([]);
    setModalVisible(false);
  });

  /* 弹窗点击确认 */
  const handleModalOnOK = useCallback(async () => {
    if (selectedTags[0]) {
      saveRecordFun(
        {
          time: modalTime,
          placeId: classRoomId,
          imgUrl: modalURL,
          remark: modalInputData,
          icidentList: selectedTags,
        },
        date
      );
      setSelectedTags([]);
      setModalInputData("");
      setModalVisible(false);
      setModalURL("");
    } else {
      message.info("请选择事件标签");
    }
  }, [date, classRoomId, modalURL, modalInputData, selectedTags, modalTime]);

  /* 获取tab */
  const getRecordTabListFun = async (params) => {
    setSafeListInfo({
      list: [],
      total: 0,
    });
    const { data } = await getRecordTabList(params);
    if (data.result) {
      setPageIndex(1);
      setIcidentId("");
      if (data.data && data.data[0]) {
        setTabList(data.data);
        getRecordListFun({
          ...params,
          icidentId: "",
          pageIndex: 1,
          pageSize: 10,
        });
      } else {
        // setSafeList([])
        setTabList([]);
      }
    } else {
      message.warning(data.message);
    }
  };

  /* 获取记录列表 */
  const getRecordListFun = async (params) => {
    const { data } = await getRecordList(params);
    if (data.result) {
      if (data.data && data.data[0]) {
        for (let i = 0; i < data.data.length; i++) {
          //对待排序序列进行冒泡排序
          for (let j = 0; j + 1 < data.data.length - i; j++) {
            //相邻元素进行比较，当顺序不正确时，交换位置
            if (data.data[j].time < data.data[j + 1].time) {
              // swap(&a[j], &a[j + 1]);
              const temp = data.data[j];
              data.data[j] = data.data[j + 1];
              data.data[j + 1] = temp;
            }
          }
        }
        setSafeListInfo({
          list: data.data,
          total: data.total,
        });
      }
    } else {
      message.warning(data.message);
    }
  };

  const safeListCon = useMemo(() => {
    // console.log('安全事件记录组件渲染')
    return (
      <div className="xm-recordbox">
        <p className="xm-recordbox-title">安全事件记录</p>
        {safeListInfo.list[0] ? (
          <SafeRecord
            tabList={tabList}
            pageIndex={pageIndex}
            total={safeListInfo.total}
            currentTabKey={icidentId}
            pageChan={handleChangePage}
            courseList={safeListInfo.list}
            pageSize={10}
            kind="rgaq"
            len={safeListInfo.list.length}
            handleOneCourseInfo={handleCheckdetail}
            handleRecordTabChange={handleTabChange}
          />
        ) : (
          <div className="xm-recordbox-imgbox">
            <img src={notdata} alt="" />
            <p>暂无数据</p>
          </div>
        )}
      </div>
    );
  }, [safeListInfo, tabList, icidentId]);
  // console.log('平安教室组件渲染')
  return (
    <ScrollBar style={{ height: "100%", width: "100%" }} className="xm-rgaqjc">
      <div className="xm-rgaqjc-top">
        <div className="xm-rgaqjc-top-l" style={{ width: baseWidth }}>
          {dataLoading ? (
            <div
              className="xm-rgaqjc-left-loading"
              style={{ width: baseWidth }}
            >
              <Spin size="middle" />
              <span className="xm-span">Loading...</span>
            </div>
          ) : (
            <>
              <div className="xm-rgaqjc-top-l-content">
                {rtspRtmpFlag ? (
                  <VlcVideo
                    width={baseWidth}
                    height={(baseWidth / 1080) * 600}
                    urlList={videoList}
                  />
                ) : (
                  <HlsVideo
                    width={baseWidth}
                    height={(baseWidth / 1080) * 600}
                    teaList={liveVideoList[0]}
                    stuList={liveVideoList[1]}
                    otherList={liveVideoList[2]}
                    needSreenShot={true}
                    screenShot={handleScreenShot}
                  />
                )}
              </div>

              <div
                className="xm-rgaqjc-top-l-videotime"
                style={
                  {
                    // width: getDate() === date ? 150 : 75
                  }
                }
              >
                {getDate() === date ? (
                  <div className="xm-videotime-livebox">
                    <p
                      className={rtspRtmpFlag ? "" : "active"}
                      onClick={() => handlePlayType(1)}
                    >
                      直播
                    </p>
                    <p
                      className={rtspRtmpFlag ? "active" : ""}
                      onClick={() => handlePlayType(0)}
                    >
                      回放
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {rtspRtmpFlag ? (
                <div className="xm-rgaqjc-top-l-timeline">
                  <div
                    className="xm-timeline-leftbtn"
                    onClick={() => handleProgressBtnClick("left")}
                  >
                    &lt;
                  </div>
                  <div className="xm-timeline-centerbox">
                    <ul className="xm-timeline-progress-timescale">
                      <li className="timescale xm-timeline-progress-timescale-first">
                        <span></span>
                        <span></span>
                      </li>
                      {progressList.map((item, index) => {
                        return (
                          <li className="timescale" key={index}>
                            <span></span>
                            <p>{item}</p>
                            <span></span>
                          </li>
                        );
                      })}
                      <li className="timescale xm-timeline-progress-timescale-last">
                        <span></span>
                        <span></span>
                      </li>

                      {rtspRtmpFlag ? (
                        //  回放列表
                        <div className="xm-timeline-progress-oldlist">
                          {secVideoList[0] &&
                            secVideoList.map((item, index) => {
                              const startTime = timeTransform(item.startTime);
                              const endTime = timeTransform(item.endTime);
                              const width =
                                (1511 / 86400) * (endTime - startTime);
                              const left = (1511 / 86400) * startTime;

                              let flag = false;
                              if (item.urls && item.urls[0]) {
                                item.urls.some((ele) => {
                                  if (ele.url) flag = true;
                                  return true;
                                });
                              }
                              return flag ? (
                                <div
                                  key={index}
                                  className={
                                    crrVideoIndex === index ? "active" : ""
                                  }
                                  style={{ width, left }}
                                  onClick={() =>
                                    handleClickSecVideo(item, startTime, index)
                                  }
                                >
                                  <Tooltip
                                    color="#3eab91"
                                    title={
                                      item.startTime + " - " + item.endTime
                                    }
                                  >
                                    <p></p>
                                  </Tooltip>
                                </div>
                              ) : (
                                ""
                              );
                            })}
                        </div>
                      ) : null}
                    </ul>
                  </div>
                  <div
                    className="xm-timeline-rightbtn"
                    onClick={() => handleProgressBtnClick("right")}
                  >
                    &gt;
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="xm-rgaqjc-top-r">
          <div className="xm-rgaqjc-top-r-date">
            <DatePicker
              className="xm-rgaqjc-top-r-input"
              bordered={false}
              style={{ width: "100%" }}
              disabledDate={disabledEndDate}
              // defaultValue={momentDate} // 今日日期
              value={moment(date)}
              onChange={(datemoment, dateString) =>
                handleChangeDate(datemoment, dateString)
              }
            />
          </div>

          <ScrollBar className="xm-rgaqjc-top-r-treebox">
            <Tree
              className="xm-rgaqjc-top-r-tree"
              blockNode={true}
              selectedKeys={[classRoomId]}
              expandedKeys={expandedKeys}
              onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
              onSelect={(checkedKeys, e) => handleSelectRoom(checkedKeys, e)}
            >
              {placeTree}
            </Tree>
          </ScrollBar>
        </div>
      </div>
      {safeListCon}

      <Modalscreen
        title="安全事件记录"
        className="xm-rgmodle"
        visible={modalVisible}
        content={modalCon}
        width={800}
        onCancel={modalCancel}
        footer={modalType === 2 ? { ok: "确认", cancel: "取消" } : null}
        paddingLeft="75px"
        onOk={handleModalOnOK}
      />
      <div
        className="xm-fullSceen"
        style={{ display: isFull ? "block" : "none" }}
      >
        <div className="xm-imgbox">
          <img src={fullSrc} alt="" />
        </div>

        <p onClick={() => setIsFull(false)}>x</p>
      </div>
    </ScrollBar>
  );
};

export default Rgaq;
