/*
 * @Author: mzc
 * @Date: 2021-07-13 09:45:28
 * @Last Modified by: mzc
 * @Last Modified time: 2021-10-19 13:12:49
 */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ScrollBar from "react-perfect-scrollbar";

import { Tag, message, Spin, Button } from "antd";
import "./../../../../style/zxxk/zxxk/zxxk.scss";

import CourseRecord from "./../../../components/zxxk/zxxk/checkCourseRecord";
import Modal from "./../../../components/modalPonent";
import RightSider from "./zxxkComponent/rightSider";

import moment from "moment";

import VlcVideo from "./vlcVideo";
import HlsVideo from "./../../../xgVideo/index";

import SVG from "./../../../public/public-component-svg";
import notdata from "./../../../../media/picture/noneData.png";
import nodata2 from "./../../../../media/picture/nodata2.png";
import fullScreenImg from "./../../../../media/picture/fullScreen.png";
import no_permission from "./../../../../media/picture/no_permission.png";
import i_robot from "./../../../../media/picture/robot.png";

import {
  getDate,
  placeMap,
  getClassroomId,
  toHHmmss,
  animate,
  tourMap,
} from "./format";
import {
  getTourcourseList,
  getTourCourseDetail,
  getAttendance,
  getRecordList,
  saveRecord,
  getRecordTabList,
  getIcidentList,
  getTourCourseVideo,
  getRobotStatus,
} from "./zxxk-req";

const $ = (selector) => document.querySelector(selector);
const getWindowWidth = () => window.innerWidth - 555;
const orgCode = sessionStorage.getItem("orgCode");
let sectionTimer = null;

const Zxxk = (props) => {
  const [baseWidth, setBaseWidth] = useState(
    getWindowWidth() < 800 ? 800 : getWindowWidth()
  );
  const [date, setDate] = useState(getDate()); // 日期
  const [tourCourseInfo, setTourCourseInfo] = useState({
    courseTabsIndex: 1,
    expandedKeys: [""],
    tourCourseList: [],
    placeLoading: true,
    checkedKeys: [],
  });

  const [sectionList, setSectionList] = useState([]); // 小节课程列表
  const [sectionOne, setSectionOne] = useState({}); // 一小节课程
  const [courseId, setCourseId] = useState(""); // 大节次id
  const [sectionId, setSectionId] = useState(""); // 小节次id

  const [tabList, setTabList] = useState([]); // tab列表
  const [icidentId, setIcidentId] = useState(""); // 事件id
  const [courseListInfo, setCourseListInfo] = useState({
    list: [],
    total: 0,
    pageIndex: 1,
  }); // 巡课列表数据
  const [pageIndex, setPageIndex] = useState(1); // 分页页码

  const [modalVisible, setModalVisible] = useState(false); // 截屏视图显隐
  const [textareaValue, setTextareaValue] = useState("");
  const [icidentList, setIcidentList] = useState([]); // 事件所有列表
  const [shotTime, setShotTime] = useState(""); // 截屏有效时间
  const [selectedTags, setSelectedTags] = useState([]); //事件点击列表
  const [modalType, setModalType] = useState(2); // 1:查看 2：截屏
  const [modalURL, setModalURL] = useState("");
  const [displayIcidentList, setDisplayIcidentList] = useState([]);

  const [isFull, setIsFull] = useState(false);
  const [fullSrc, setFullSrc] = useState("");
  const [messageType, setMessageType] = useState(2); // 1暂无课程 2 暂无视频地址 3 暂无视频地址

  const [kindScreenList, setKindScreenList] = useState({
    teaScreenList: [],
    stuScreenList: [],
    otherScreenList: [],
  });

  const [slideWidth, setSlideWidth] = useState(250); // 小节视频设置宽度
  const [slideMarginL, setSlideMarginL] = useState(5); // 小节视频设置左间距
  const [sectionNum, setSectionNum] = useState(1); // 滑动位置点击index
  const [bgNum, setBgNum] = useState(0); // 滑动背景色index

  const [attendance, setAttendance] = useState({}); // 考勤信息
  const [attendanceFlag, setAttendanceFlag] = useState(false);

  const [rtspRtmpFlag, setrtspRtmpFlag] = useState(false); // true vlc, false rtmp
  const [dataVideoLoading, setDataVideoLoading] = useState(false);

  const [selectFlag, setSelectFlag] = useState(false);

  const [robotStatus, setRobotStatus] = useState("0");
  /* 初始化场所树 */
  useEffect(() => {
    getTourCourseListFun(
      { date, type: tourCourseInfo.courseTabsIndex },
      tourCourseInfo
    );
    getIcidentListFun();
    getRobotStatusFun();
    window.addEventListener("resize", getBaseWidth);
    return () => {
      window.removeEventListener("resize", getBaseWidth);
    };
  }, []);
  const getBaseWidth = () => {
    const videoBaseWidth = window.innerWidth - 555;
    if (videoBaseWidth < 800) {
      videoBaseWidth = 800;
    }
    setBaseWidth(videoBaseWidth);
  };

  /* 设置小节视频宽度和间距 */
  useEffect(() => {
    if (sectionList.length) {
      const wrapperWidth = $(".swiper-wrapper").clientWidth;
      const swiper_wrapper_box = $(".swiper-wrapper-box");
      const allWidth =
        (wrapperWidth * 0.3289 + wrapperWidth * 0.0065) * sectionList.length -
        wrapperWidth * 0.0065;
      swiper_wrapper_box.style.width = allWidth + "px";
      setSlideWidth(wrapperWidth * 0.3289);
      setSlideMarginL(wrapperWidth * 0.0065);
    }
  }, [sectionList, baseWidth]);

  /* 动态设置swiperbox的left-运动函数animate */
  useEffect(() => {
    if (sectionList && sectionList[0]) {
      const swiperbox = $(".swiper-wrapper-box");
      if (sectionList.length >= 4) {
        const left = (slideMarginL + slideWidth) * sectionNum;
        animate(swiperbox, { left }, 150);
      } else {
        animate(swiperbox, { left: 0 }, 150);
      }
    }
  }, [sectionList, slideMarginL, slideWidth, sectionNum]);

  useEffect(() => {
    if (sectionList.length) {
      const secNum = localStorage.getItem("secNum"); //点击后的节次顺序
      const needFresh = localStorage.getItem("needFresh"); //是否需要刷新
      let liveIndex = secNum ? secNum - 0 : sectionList.length - 1;
      let listOne = sectionList[sectionList.length - 1]; // 加载视频地址参数
      /* 定位和色块 */
      setSectionOne(sectionList[liveIndex]);
      listOne = sectionList[liveIndex];
      if (sectionList.length > 3) {
        if (sectionList.length - liveIndex <= 3) {
          setSectionNum(-(sectionList.length - 3));
        } else {
          setSectionNum(-liveIndex);
        }
      } else {
        setSectionNum(0);
      }
      setBgNum(liveIndex);
      /* 获取巡课信息 */
      setCourseId(listOne.courseId);
      setSectionId(listOne.id);
      setShotTime(toHHmmss(listOne.shotTime));
      /* 加载视频地址和更新摄像头实现 */
      if (needFresh && secNum - 0 === sectionList.length - 1) {
        getRecordTabListFun({
          courseId: listOne.courseId,
          sectionId: listOne.id,
        });
        getTourCourseVideoFun({
          classroomId: listOne.classroomId,
          rcId: listOne.id,
        });
      }
    }
  }, [sectionList]);

  //定时刷新课程列表
  useEffect(() => {
    if (sectionList.length) {
      if (sectionTimer) clearInterval(sectionTimer);
      if (!sectionList[0].isPassTime) {
        sectionTimer = setInterval(() => {
          getSectionTimer(
            sectionList[sectionList.length - 1],
            sectionList.length
          );
        }, 10000);
      }
    }
    return () => {
      if (sectionTimer) clearInterval(sectionTimer);
    };
  }, [sectionList]);
  /**
   * @desc 定时刷新课程列表
   */
  const getSectionTimer = async (listOne, length) => {
    const { data } = await getTourCourseDetail(listOne.params);
    if (data.result) {
      let dataList = data.data && data.data[0] ? data.data.reverse() : [];
      const list = [];
      dataList.map((item) => {
        if (item.videoData && item.videoData[0]) {
          const videoData = item.videoData;
          videoData.map((ele) => {
            ele.classRoomName = item.classRoomName;
            ele.courseId = item.courseId;
            ele.courseName = item.courseName;
            ele.schoolTime = item.schoolTime;
            ele.params = listOne.params;
            list.push(ele);
          });
        }
      });
      if (!list.length || !list[list.length - 1].isLive) {
        list.push({
          courseId: "",
          classRoomName: listOne.params.title,
          id: "",
          isLive: true,
          classroomId: listOne.params.classroomId,
          isKj: true,
          params: listOne.params,
        });
      }
      let _one = list[list.length - 1];

      if (listOne.courseId !== _one.courseId) {
        const secNum = localStorage.getItem("secNum") - 0;
        if (secNum === list.length - 1) {
          localStorage.setItem("needFresh", "1");
        }
        if (secNum === list.length - 2) {
          localStorage.setItem("secNum", secNum + 1 + "");
          localStorage.setItem("needFresh", "1");
        }
        if (secNum < length - 1) {
          localStorage.removeItem("needFresh");
        }
        setSectionList(list);
      } else {
        localStorage.removeItem("needFresh");
      }
    } else {
      message.warning(data.message);
    }
  };
  /* 截屏 */
  const handleScreenShot = (url) => {
    setModalURL(url);
    setModalVisible(true);
    setModalType(2);
  };
  /**
   * @desc 是否展示机器人
   */
  const getRobotStatusFun = async () => {
    const { data } = await getRobotStatus();
    if (data.code == 200) {
      setRobotStatus(data.data);
    } else {
      message.warning(data.message);
    }
  };
  /* 日期切换 */
  const handleChangeDate = useCallback(
    (datemoment, dateString, tourCourseInfo) => {
      // console.log(datemoment, dateString)
      setDate(dateString);
      getTourCourseListFun(
        { date: dateString, type: tourCourseInfo.courseTabsIndex },
        tourCourseInfo,
        1
      );
    },
    []
  );

  /* 查课切换 */
  const handleCourseTabs = useCallback(
    (key) => {
      if (tourCourseInfo.courseTabsIndex === key || tourCourseInfo.placeLoading)
        return;
      setTourCourseInfo({ ...tourCourseInfo, courseTabsIndex: key });
      getTourCourseListFun({ date, type: key }, tourCourseInfo);
    },
    [date, tourCourseInfo]
  );

  /* 获取场所树 */
  const getTourCourseListFun = async (params, tourCourseInfo, dateType) => {
    setTourCourseInfo({
      ...tourCourseInfo,
      courseTabsIndex: params.type,
      placeLoading: true,
    });
    let roleId = "";
    let roleInfo = sessionStorage.getItem("roleInfo");
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo);
      roleId = roleInfo.roleId;
    }
    params.roleId = roleId;
    const { data } = await getTourcourseList(params);

    let keys = [],
      tourCourseList = [];

    if (data.result) {
      let newdata = data.data;
      if (newdata[0]) {
        const tourMapList = newdata.map((item) => {
          return tourMap(item, params.type);
        });
        let { id, expandedKeys } = getClassroomId(tourMapList[0], []);
        keys = expandedKeys;
        tourCourseList = tourMapList.map((item) => {
          return placeMap(item, params.type);
        });
      }
      setSelectFlag(false);
      setSectionList([]);
      setSectionOne({});
      setCourseListInfo({
        list: [],
        total: 0,
      });
    } else {
      message.warning(data.message);
    }
    let obj = {
      checkedKeys: [""],
      courseTabsIndex: params.type,
      tourCourseList,
      expandedKeys: keys,
      placeLoading: false,
    };
    // dateType ? obj.checkedKeys = [''] : null
    setTourCourseInfo(obj);
  };

  /* 获取截屏事件列表 */
  const getIcidentListFun = async (params) => {
    const { data } = await getIcidentList(params);
    if (data.result) {
      setIcidentList(data.data);
    } else {
      message.warning(data.message);
    }
  };

  /* 选择教室 */
  const handlePlaceSelect = useCallback(
    (selector, e) => {
      let select = selector[0];
      if (!select || select.indexOf(" A") > -1 || dataVideoLoading) {
        return;
      }
      setTourCourseInfo({
        ...tourCourseInfo,
        checkedKeys: [select],
      });
      let req = {
        classroomId: select,
        date,
        title: e.node.title.props.title,
        type: tourCourseInfo.courseTabsIndex,
      };
      if (tourCourseInfo.courseTabsIndex !== 1 && select.indexOf("/" > -1)) {
        select = select.split("/");
        req.classroomId = select[1];
        req.teacherId = select[0];
        req.SubjectId = select[2];
      }
      setSectionList([]);
      setSectionOne({});
      if (!selectFlag) setSelectFlag(true);

      getTourCourseDetailFun(req, slideMarginL, slideWidth);
    },
    [
      date,
      slideMarginL,
      slideWidth,
      dataVideoLoading,
      selectFlag,
      tourCourseInfo,
    ]
  );

  /* 获取课程列表 */
  const getTourCourseDetailFun = async (params) => {
    setDataVideoLoading(true);
    const { data } = await getTourCourseDetail(params);
    if (data.result) {
      let dataList = data.data && data.data[0] ? data.data.reverse() : [];
      const list = [];
      dataList.map((item) => {
        if (item.videoData && item.videoData[0]) {
          const videoData = item.videoData;
          videoData.map((ele) => {
            ele.classRoomName = item.classRoomName;
            ele.courseId = item.courseId;
            ele.courseName = item.courseName;
            ele.schoolTime = item.schoolTime;
            ele.params = params;
            list.push(ele);
          });
        }
      });
      let selectDate = new Date(params.date).getTime();
      let today = new Date();
      let nowDate = moment(today.getTime()).format("YYYY-MM-DD");
      let now = new Date(nowDate).getTime();
      if (selectDate == now) {
        if (!list.length || !list[list.length - 1].isLive) {
          list.push({
            courseId: "",
            classRoomName: params.title,
            id: "",
            isLive: true,
            classroomId: params.classroomId,
            isKj: true,
            params,
          });
        }
      } else {
        list.length ? (list[0].isPassTime = true) : "";
      }
      localStorage.setItem("needFresh", "1");
      localStorage.setItem("secNum", list.length - 1 + "");
      setSectionList(list);
    } else {
      message.warning(data.message);
      setDataVideoLoading(false);
    }
  };

  /* 切换课程url和背景色 */
  const handleSetWrapper = useCallback(
    (item, index, bgNum, sectionList, dataVideoLoading) => {
      if (bgNum === index || dataVideoLoading) return;

      setBgNum(index);
      setSectionId(item.id);
      setSectionOne(item);
      setCourseId(item.courseId);
      const shotTime = item.actureStartTime;
      setShotTime(toHHmmss(shotTime));
      const params = {
        classroomId: item.classroomId,
        rcId: item.id,
      };
      getTourCourseVideoFun(params);
      getRecordTabListFun({ courseId: item.courseId, sectionId: item.id }); //获取巡课记录栏目列表
    },
    []
  );

  /**
   * @desc 获取详细视频地址
   */
  const getTourCourseVideoFun = async (params) => {
    setDataVideoLoading(true);
    let { data } = await getTourCourseVideo(params);
    if (data.result) {
      data = data.data;
      if (data.url && data.url[0]) {
        const stuScreen = [],
          teaScreen = [],
          otherScreen = [];
        data.url.map((ele) => {
          ele.id = ele.classmctype + ele.id; // 辨别镜头类别
          let urlInfo = {};
          urlInfo.id = ele.id;
          urlInfo.name = ele.name;
          let url = data.isLive ? ele.url : ele.urlList;
          if (url && url.length && url[0].list && url[0].list.length) {
            let list = url[0].list;
            let type = !data.isLive && data.isNvr ? "rtsp" : "hls";
            let hlsInfo = list.find((e) => e.videotype === type);
            urlInfo.url = hlsInfo ? hlsInfo.url : "";
          } else {
            urlInfo.url = "";
          }
          switch (ele.classmctype) {
            case 1:
              teaScreen.push(urlInfo);
              // teaScreen.push(ele);
              break;
            case 2:
              stuScreen.push(urlInfo);
              // stuScreen.push(ele);
              break;
            default:
              otherScreen.push(urlInfo);
            // otherScreen.push(ele);
          }
        });
        setKindScreenList({
          teaScreenList: teaScreen,
          stuScreenList: stuScreen,
          otherScreenList: otherScreen,
        });
      } else {
        setKindScreenList({
          teaScreenList: [],
          stuScreenList: [],
          otherScreenList: [],
        });
      }
      let t = data.isLive ? false : data.isNvr ? true : false;
      setrtspRtmpFlag(t);
    } else {
      message.warning(data.message);
      setKindScreenList({
        teaScreenList: [],
        stuScreenList: [],
        otherScreenList: [],
      });
    }
    setDataVideoLoading(false);
  };

  /* 滚动 */
  const handleSwiperL = useCallback((sectionNum, sectionList) => {
    if (sectionList && sectionList[0] && sectionList.length <= 3) return;
    if (sectionNum >= 0) {
      return;
    } else {
      let num = sectionNum + 1;
      setSectionNum(num);
    }
  }, []);

  const handleSwiperR = useCallback((sectionNum, sectionList) => {
    if (sectionList && sectionList[0] && sectionList.length <= 3) return;
    if (sectionNum <= -(sectionList.length - 3)) {
      return;
    } else {
      let num = sectionNum - 1;
      setSectionNum(num);
    }
  }, []);

  /* 获取考勤信息 */
  const getAttendanceFun = async (params) => {
    const { data } = await getAttendance(params);
    if (data.result) {
      setAttendance(data.data);
    } else {
      setAttendance({});
      message.info(data.message);
    }
  };

  /* 获取巡课记录栏目列表 */
  const getRecordTabListFun = async (params) => {
    setCourseListInfo({
      total: 0,
      list: [],
    });
    const { data } = await getRecordTabList(params);
    if (data.result) {
      if (data.data && data.data[0]) {
        setTabList(data.data);
        setIcidentId("");
        setPageIndex(1);
        getRecordListFun({
          courseId: params.courseId,
          sectionId: params.sectionId,
          icidentId: "",
          pageIndex: 1,
          pageSize: 5,
        });
      } else {
        setTabList([]);
      }
    } else {
      message.warning(data.message);
    }
  };

  /* 获取巡课记录列表 */
  const getRecordListFun = async (params) => {
    const { data } = await getRecordList(params);
    if (data.result) {
      let info = {
        list: data.data,
        total: data.total,
      };
      setCourseListInfo(info);
    } else {
      message.warning(data.message);
    }
  };

  /* page切换 */
  const handleChangePage = useCallback(
    (page) => {
      setPageIndex(page);
      // setCourseListInfo({ ...courseListInfo, pageIndex: page })
      getRecordListFun({
        courseId,
        sectionId,
        icidentId,
        pageIndex: page,
        pageSize: 5,
      });
    },
    [courseId, sectionId, icidentId]
  );

  /* 事件Tab切换 */
  const handleRecordTabChange = useCallback(
    (code) => {
      setIcidentId(code);
      setPageIndex(1);
      getRecordListFun({
        courseId,
        sectionId,
        icidentId: code,
        pageIndex: 1,
        pageSize: 5,
      });
    },
    [courseId, sectionId]
  );

  /* 查看单个列表信息 */
  const handleCheckdetail = useCallback((item) => {
    setModalType(1);
    setModalURL(item.imgUrl);
    setTextareaValue(item.remark);
    setDisplayIcidentList(item.icidentList);
    setModalVisible(true);
  });

  /* 选中事件标签 */
  const handleChangeCheck = useCallback(
    (id, checked) => {
      if (modalType === 2) {
        const nextSelectedTags = checked
          ? [...selectedTags, id]
          : selectedTags.filter((t) => t !== id);
        setSelectedTags(nextSelectedTags);
      }
    },
    [selectedTags, modalType]
  );

  /* 关闭弹窗 */
  const modalCancel = useCallback(() => {
    setModalVisible(false);
    setSelectedTags([]);
    setTextareaValue("");
    // setModalType(2)
  });

  /* 提交弹窗信息 */
  const handleModalOnOK = useCallback(() => {
    if (selectedTags.length === 0) {
      message.info("请选择事件");
      return;
    }
    saveRecordFun({
      date: shotTime,
      remark: textareaValue,
      imgUrl: modalURL,
      icidentList: selectedTags,
      courseId,
      sectionId,
    });
    setModalVisible(false);
  }, [
    date,
    textareaValue,
    modalURL,
    selectedTags,
    courseId,
    sectionId,
    shotTime,
  ]);

  /* 鼠标移入机器人 */
  const handleRobotEnter = useCallback((courseId, sectionId) => {
    setAttendanceFlag(true);
    getAttendanceFun({ sectionId, courseId });
  }, []);

  /* 鼠标移出机器人 */
  const handleRobotLeave = () => {
    setAttendanceFlag(false);
    setAttendance({});
  };

  /* 提交截屏信息 */
  const saveRecordFun = async (params) => {
    const { data } = await saveRecord(params);
    if (data.result) {
      message.info("保存成功");
      getRecordTabListFun({
        courseId: params.courseId,
        sectionId: params.sectionId,
      });
    } else {
      message.warning(data.message);
    }
    setSelectedTags([]);
    setTextareaValue("");
  };
  const modalCon = useMemo(() => {
    return (
      <div className="mzc-modalCon">
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
        {modalType === 2 ? "选择事件：" : null}
        {modalType === 2
          ? icidentList &&
            icidentList[0] &&
            icidentList.map((item) => {
              return (
                <Tag.CheckableTag
                  className="mzc-checktag"
                  key={item.icidentId}
                  checked={
                    selectedTags
                      ? selectedTags.indexOf(item.icidentId) > -1
                      : []
                  }
                  onChange={(checked) =>
                    handleChangeCheck(item.icidentId, checked)
                  }
                >
                  {item.icidentName}
                </Tag.CheckableTag>
              );
            })
          : displayIcidentList[0] &&
            displayIcidentList.map((item) => {
              return (
                <Tag.CheckableTag
                  className="mzc-checktag"
                  key={item.icidentId}
                  checked
                >
                  {item.icidentName}
                </Tag.CheckableTag>
              );
            })}
        {modalType === 2 ? (
          <div className="mzc-textarea">
            <textarea
              placeholder="请输入备注（非必填）"
              value={textareaValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 200) {
                  message.warning("不得超过200字符");
                } else {
                  setTextareaValue(value);
                }
              }}
            />
          </div>
        ) : (
          <p className="mzc-textareainfo">{textareaValue}</p>
        )}
      </div>
    );
  }, [
    modalType,
    modalURL,
    icidentList,
    selectedTags,
    textareaValue,
    displayIcidentList,
  ]);

  const leftCourseCon = useMemo(() => {
    return (
      <div className="xm-videobox-left-course">
        <p className="xm-videobox-left-course-title">
          {tourCourseInfo.courseTabsIndex === 1
            ? sectionOne.className
              ? sectionOne.className
              : "--"
            : sectionOne.courseName
            ? sectionOne.courseName
            : "--"}
        </p>
        <ul className="xm-videobox-left-course-class">
          <li>
            <SVG fill="#8f9094" type="sj" width="15px" height="15px" />
            <span>
              {tourCourseInfo.courseTabsIndex === 1 ? "节次：" : "教师："}
              {tourCourseInfo.courseTabsIndex === 1
                ? sectionOne.lessonOrder
                  ? sectionOne.lessonOrder
                  : "-"
                : sectionOne.teacherName
                ? sectionOne.teacherName
                : "-"}
            </span>
            {/* <span>{sectionOne.schoolTime ? (isNaN(sectionOne.schoolTime) ? sectionOne.schoolTime : toHHmmss(sectionOne.schoolTime)) : '-'}</span> */}
          </li>
          {/* <li>
      <SVG fill='#8f9094' type='js' width='15px' height='15px' /> 
      <span>{sectionOne.teacherName ? sectionOne.teacherName : '-'}</span>
    </li> */}
          <li>
            <SVG fill="#8f9094" type="dz" width="15px" height="15px" />
            <span>
              教室：{sectionOne.classRoomName ? sectionOne.classRoomName : "-"}
            </span>
          </li>
        </ul>
      </div>
    );
  }, [sectionOne, rtspRtmpFlag, tourCourseInfo]);

  const swiperContainer = useMemo(() => {
    return (
      <div className="swiper-container">
        {sectionList && sectionList[0] ? (
          <>
            <div
              className="swiper-button-prev"
              onClick={() => {
                handleSwiperL(sectionNum, sectionList);
              }}
            >
              &lt;
            </div>
            <div className="swiper-wrapper">
              <div className="swiper-wrapper-box">
                {sectionList.map((item, index) => {
                  return (
                    <Button
                      className="swiper-slide"
                      disabled={item.isVideo === 0}
                      style={{
                        backgroundColor: bgNum === index ? "#2d645a" : null,
                        width: slideWidth,
                        marginLeft: index !== 0 ? slideMarginL : 0,
                      }}
                      key={item.id}
                      onClick={() => {
                        handleSetWrapper(
                          item,
                          index,
                          bgNum,
                          sectionList,
                          dataVideoLoading
                        );
                      }}
                    >
                      <p>
                        {tourCourseInfo.courseTabsIndex === 1
                          ? item.subjetcName
                            ? item.lessonOrder + "." + item.subjetcName
                            : "-"
                          : item.lessonOrder}
                        （{item.isLive ? "直播" : "回放"}）
                      </p>
                      <p>
                        {tourCourseInfo.courseTabsIndex === 1
                          ? item.teacherName
                            ? item.teacherName
                            : "-"
                          : item.className
                          ? item.className
                          : "-"}
                      </p>
                      <p
                        style={{
                          display: item.isVideo === 0 ? "block" : "none",
                        }}
                      >
                        暂无视频
                      </p>
                    </Button>
                  );
                })}
              </div>
            </div>
            <div
              className="swiper-button-next"
              onClick={() => {
                handleSwiperR(sectionNum, sectionList);
              }}
            >
              &gt;
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    );
  }, [
    bgNum,
    slideWidth,
    sectionList,
    slideMarginL,
    sectionNum,
    dataVideoLoading,
    tourCourseInfo,
  ]);

  const recordboxCon = useMemo(() => {
    return (
      <div className="xm-recordbox">
        <p className="xm-recordbox-title">巡课记录</p>
        {courseListInfo.list && courseListInfo.list[0] ? (
          <CourseRecord
            tabList={tabList}
            pageIndex={pageIndex}
            total={courseListInfo.total}
            currentTabKey={icidentId}
            pageChan={handleChangePage}
            pageSize={5}
            len={courseListInfo.list.length}
            courseList={courseListInfo.list}
            handleOneCourseInfo={handleCheckdetail}
            handleRecordTabChange={handleRecordTabChange}
          />
        ) : (
          <div className="xm-recordbox-imgbox">
            <img src={notdata} alt="" />
            <p>暂无数据</p>
          </div>
        )}
      </div>
    );
  }, [courseListInfo, tabList, icidentId, pageIndex]);

  const robotCon = useMemo(() => {
    return sectionList[0] && !sectionList[bgNum].isKj && robotStatus === "1" ? (
      <div className="xm-robot">
        <img
          onMouseEnter={() => handleRobotEnter(courseId, sectionId)}
          onMouseLeave={() => handleRobotLeave()}
          src={i_robot}
        />{" "}
        {attendanceFlag ? (
          <div className="xm-robot-box">
            <div className="xm-robot-teacher">
              {" "}
              教师考勤
              <span>
                {attendance.teacherAttendance
                  ? attendance.teacherAttendance
                  : "进行中"}
              </span>
            </div>
            {/* <div className="xm-robot-stu">
              <p>学生考勤</p>
              <div></div>
              <ul>
                <li>
                  <p>系统更新时间</p>
                  <p>{toHHmmss(attendance.freTime)}</p>
                </li>
              </ul>
            </div> */}
          </div>
        ) : null}
      </div>
    ) : (
      ""
    );
  }, [sectionList, attendanceFlag, courseId, sectionId, robotStatus, bgNum]);

  return (
    <ScrollBar className="xm-zxxk">
      <div
        className="xm-videobox"
        style={{ height: (baseWidth / 1080) * 600 + 152 + 15 }}
      >
        <div className="xm-videobox-left" style={{ width: baseWidth }}>
          {selectFlag ? (
            <>
              {dataVideoLoading ? (
                <div className="xm-videobox-left-loading">
                  <Spin size="middle" />
                  <span className="xm-span">Loading...</span>
                </div>
              ) : (
                <div className="xm-videobox-left-video">
                  {robotCon}

                  {rtspRtmpFlag ? (
                    <VlcVideo
                      urlList={[
                        ...kindScreenList.teaScreenList,
                        ...kindScreenList.stuScreenList,
                        ...kindScreenList.otherScreenList,
                      ]}
                      width={baseWidth}
                      height={(baseWidth / 1080) * 600}
                    />
                  ) : (
                    <HlsVideo
                      width={baseWidth}
                      height={(baseWidth / 1080) * 600}
                      teaList={kindScreenList.teaScreenList}
                      stuList={kindScreenList.stuScreenList}
                      otherList={kindScreenList.otherScreenList}
                      needSreenShot={true}
                      screenShot={handleScreenShot}
                    />
                  )}
                </div>
              )}
              {/* <div
                style={{
                  height: (baseWidth / 1080) * 600 + "px",
                  lineHeight: (baseWidth / 1080) * 600 + "px",
                  backgroundColor: "#000",
                  color: "#30bf99",
                  textAlign: "center",
                }}
              >
                {messageType === 1
                  ? "课程还未开始"
                  : messageType === 2
                  ? "抱歉，无法找到视频"
                  : "抱歉，无法找到视频"}
              </div> */}
            </>
          ) : (
            <div
              className="mzc-rightTips"
              style={{
                height: (baseWidth / 1080) * 600 + "px",
              }}
            >
              请在右侧选择巡课内容
            </div>
          )}

          {leftCourseCon}

          {swiperContainer}
        </div>
        <RightSider
          date={date}
          tourCourseInfo={tourCourseInfo}
          handleChangeDate={handleChangeDate}
          handleCourseTabs={handleCourseTabs}
          setTourCourseInfo={setTourCourseInfo}
          handlePlaceSelect={handlePlaceSelect}
        />
      </div>
      {recordboxCon}

      {/* 屏幕截屏/点击列表显示 */}
      <Modal
        title="巡课记录"
        className="xm-zzxkModal"
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

export default Zxxk;
