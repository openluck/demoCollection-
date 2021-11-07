/*
 * @Author: yrj
 * @Date: 2020-01-22 15:37:35
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 10:57:49
 * 教学秩序-课堂
 */
import React, { Component } from "react";
import "./../../../style/yrj_orderClass.scss";
import ColorsPieEcharts from "./../../components/visual/public/ColorsPieEcharts";
import { Select } from "antd";
import SVG from "./../../public/svg";
import PerfectScrollbar from "react-perfect-scrollbar";
import tea_img from "./../../../media/picture/tea_img.png";
import teaz from "./../../../media/picture/tea_forward.png";
import teaf from "./../../../media/picture/tea_reverse.png";
import G from './../../../config/g';
import MoreDataPieEcharts from "./../../components/visual/public/MoreDataPieEcharts";
import video_topLine from "./../../../media/picture/video_topLine.png";
import { withRouter } from "react-router-dom";
import video_btm from "./../../../media/picture/video_btm.png";
import video_btmLine from "./../../../media/picture/video_btmLine.png";
import video_line from "./../../../media/picture/video_line.png";
import VideoPlayer from "./../../public/videoPlayer";
import NoData from "./../../components/visual/public/noData";
import Loading from "./../../components/visual/public/loading";
import OneScreenPlayer from './../../public/videoPlayerRtmp'
import {
  getOrdClassList,
  getOrdClassVideo,
  getOrdTeachMes
} from "./../../../request/yrj_visual_request";

const { Option } = Select;
@withRouter
class TeachingOrderClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelect: true, //展示左侧搜索
      listOnclick: 0, //列表选中
      pageNum: 1, //"页码"
      pageSize: 6, //每页条数
      total: 0,
      selectValue: "", //下拉框数据
      videoList: [], //视频地址列表["我是第一页第一个的视频地址"]
      videoLoad: true, // 视频加载
      videoError: '暂无数据',
      randomList: "loading",
      OrdClassList: "loading",
      teachTeacher: "",
      exchangeTeacher: {
        imgAddress: "",
        name: "",
        work: "中级英语教师"
      },
      attenProp: "loading",
      frontProp: "loading",
      sleepProp: "loading",
      stuTotalNum: "0",
      disciplinesNum: '0', //违纪事件数
      disciplinesList: [], //违纪列表
      froneSitRate: '',
      sleepRate: '',
      attenRate: ''
    };
    this.getSetting = this.getSetting.bind(this)
  }
  /**
   * 跳转函数
   * @param {*} type
   * @param {*} value
   */
  goRouter(teaId, collgeId) {
    //教师画像
    this.props.history.push(`/home/img/tea/${teaId}/${collgeId}`);
  }
  //选中列表
  clickList = (key, item) => {
    console.log(item)
    this.setState({
      listOnclick: key,
      videoLoad: true
    }, () => {
      this.getVideo(item.courseId, item.placeId)
      this.getTeaMsg(item.collegeId, item.sectionId, item.courseId)
    });
    //请求视频
    //请求老师数据
  };

  /**
* 获取配置项
*/
  getSetting() {
    if (G.ISCED_setInfo) {
      this.setState({
        froneSitRate: G.ISCED_setInfo.seatedRateUnder,
        sleepRate: G.ISCED_setInfo.sleepRateOver,
        attenRate: G.ISCED_setInfo.attenRaleUnder,
      })
    }
  }

  //随机看和切换为select
  random = value => {
    this.setState({
      showSelect: value,
      listOnclick: 0,
      pageNum: 1
    }, () => {
      if (value) {
        this.setState({
          selectValue: '0'
        }, () => {
          this.getCollageList()
        })

      } else {
        this.getCollageList('5')
      }

    });
    //请求数据
  };


  // 根据场所id和课程id获取视频
  getVideo = (courseId, placeId) => {
    let params = {
      courseId,
      placeId
    }
    getOrdClassVideo(params).then(res => {
      let resultData = res.data;
      if (resultData.result && resultData.data) {
        this.setState({
          videoLoad: false,
          videoList: resultData.data.videoList
        })
      } else {
        this.setState({
          videoLoad: false,
          videoList: []
        })
      }
    })
  }

  // 获取授课信息
  getTeaMsg = (collegeId, sectionId, courseId) => {
    let params = {
      collegeId,
      sectionId,
      courseId,
      sectionId: sessionStorage.getItem('sectionId')
    }
    getOrdTeachMes(params).then(res => {
      let resultData = res.data;
      if (resultData.result && resultData.data) {
        this.setState({
          teachTeacher: resultData.data.teachTeacher || {},
          exchangeTeacher: resultData.data.exchangeTeacher || {},
          attenProp: resultData.data.attenProp,
          frontProp: resultData.data.frontProp,
          sleepProp: resultData.data.sleepProp,
          stuTotalNum: resultData.data.stuTotalNum,
          disciplinesNum: resultData.data.disciplinesNum,
          disciplinesList: resultData.data.disciplinesList,
        })
      } else {
        this.setState({
          teachTeacher: {},
          exchangeTeacher: {},
          attenProp: {},
          frontProp: {},
          sleepProp: {},
          stuTotalNum: '',
          disciplinesNum: '',
          disciplinesList: []
        })
      }
    }, () => {
      this.setState({
        teachTeacher: {},
        exchangeTeacher: {},
        attenProp: {},
        frontProp: {},
        sleepProp: {},
        stuTotalNum: '',
        disciplinesNum: '',
        disciplinesList: []
      })
    })

  }

  /**
   * 课堂查课列表
   */
  getCollageList = (value) => {
    let params = {
      checkType: value ? value : this.state.selectValue,
      pageNum: this.state.pageNum,
      pageSize: 6,
      sectionId: sessionStorage.getItem('sectionId')
      // sectionId: 2
    };
    // this.setState({
    //   OrdClassList: [{
    //     "objName": '违纪事件',
    //     "collegeName": "中科大第一个大学",
    //     "objProp": "25",
    //     "collegeId": "15454545",
    //     "subName": "魔偶一个课程",
    //     "teacherName": "某一个老师",
    //     "objAddress": "地方",
    //     "objSection": "第三节",
    //     "courseId": "154444",
    //     "placeId": "1",
    //     "lessonNum": "10",
    //     "courseNum": "10"
    //   }],
    //   total: 1
    // })
    // return;
    //请求列表数据
    getOrdClassList(params).then(res => {
      let resultData = res.data;
      if (resultData.result) {
        if (value == '5') {
          this.setState({
            randomList: resultData.data.OrdClassList,
            total: resultData.total,
            videoLoad: true
          }, () => {
            if (resultData.data.OrdClassList.length) {
              let data = resultData.data.OrdClassList[0]
              this.getVideo(data.courseId, data.placeId)
              this.getTeaMsg(data.collegeId, data.sectionId, data.courseId)
            } else {
              this.setState({
                videoList: [],
                videoLoad: false
              })
            }
          })
        } else {
          this.setState({
            OrdClassList: resultData.data.OrdClassList,
            total: resultData.total,
            videoLoad: true
          }, () => {
            if (resultData.data.OrdClassList.length) {
              let data = resultData.data.OrdClassList[0]
              this.getVideo(data.courseId, data.placeId)
              this.getTeaMsg(data.collegeId, data.sectionId, data.courseId)
            } else {
              this.setState({
                videoList: [],
                videoLoad: false
              })
            }
          })
        }

      } else {
        if (value == '5') {
          this.setState({
            randomList: []
          })
        } else {
          this.setState({
            OrdClassList: []
          })
        }
        this.setState({
          videoLoad: false,
          teachTeacher: {},
          exchangeTeacher: {},
          attenProp: {},
          frontProp: {},
          sleepProp: {},
          stuTotalNum: '',
          subGrade: '', //科目评分
          stuDedRes: '',
          teaDedRes: '',
          patrolPerson: '',
          patrolTime: '',
          videoList: []
        })

      }
    }, (err) => {
      if (value == '5') {
        this.setState({
          randomList: []
        })
      } else {
        this.setState({
          OrdClassList: []
        })
      }
      this.setState({
        teachTeacher: '',
        exchangeTeacher: '',
        attenProp: '',
        frontProp: '',
        sleepProp: '',
        stuTotalNum: '',
        subGrade: '', //科目评分
        stuDedRes: '',
        teaDedRes: '',
        patrolPerson: '',
        patrolTime: '',
        videoList: []
      })
    });
  }

  //select 切换
  selectChaneg = value => {
    this.setState({
      selectValue: value,
      OrdClassList: 'loading',
      randomList: 'loading',
      listOnclick: 0,
      pageNum: 1,

      // videoList: ["我是第1页第1个的视频地址"]
    }, () => {
      this.getCollageList()
    });
    //拿到入参 0 1 2 3 4
    //需要重置页码
    //请求数据
  };

  //页码切换
  pageChange = type => {
    let { pageNum, showSelect, total, pageSize } = this.state;
    let num;
    if (type === "last") {
      if (pageNum == 1) {
        num = 1;
        this.setState({
          pageNum: num,
          listOnclick: 0
        });
        return;
      }
      else {
        num = pageNum - 1
      }
    } else {
      if (total > pageNum * pageSize) {
        num = pageNum + 1;
      } else {
        num = pageNum;
        return;
      }
    }
    //请求数据，数据请求成功后 写入页码
    this.setState({
      pageNum: num,
      listOnclick: 0
    }, () => {
      if (showSelect) {
        this.setState({
          OrdClassList: "loading",
        }, () => {
          this.getCollageList()
        })

      } else {
        this.setState({
          randomList: "loading",
        }, () => {
          this.getCollageList('5')
        })

      }

    });
  };

  //计算数组中大于零的项
  getSelectValue = arr => {
    let value;
    let check = true;
    arr.map((v, key) => {
      if (v > 0 && check) {
        value = key;
        check = false;
      }
    });
    return value + "";
  };

  componentDidMount = () => {
    //请求数据
    //alertAiData 从session里获取对应预计计算左侧列表请求的入参

    let alertAiData;
    let selectValue;
    if (sessionStorage.alertAiData) {
      alertAiData = sessionStorage.getItem("alertAiData").split(",");
      selectValue = this.getSelectValue(alertAiData);
    } else {
      selectValue = 'undefined'
    }
    this.getSetting()

    //请求列表数据
    // let params = {
    //   checkType: selectValue !== "undefined" ? selectValue : "5",
    //   pageNum: this.state.pageNum,
    //   pageSize: 6,
    // };
    // //请求列表数据
    // getOrdClassList(params).then(res => {
    //   console.log(res)
    //   let resultData = res.data;
    //   if (resultData.result) {
    //     this.setState({
    //       OrdClassList: resultData.data.OrdClassList
    //     })
    //   }else{
    //     this.setState({
    //       OrdClassList: []
    //     })
    //   }
    // });


    this.setState({
      showSelect: selectValue !== 'undefined' ? true : false, //展示左侧搜索
      // listOnclick: 0, //列表选中
      // pageNum: 1, //"页码"
      // pageSize: 6, //每页条数
      selectValue: selectValue !== 'undefined' ? selectValue : "0", //下拉框数据
      // videoList: ["我是第一页第一个的视频地址"], //视频地址列表
      // teachTeacher: {
      //   //授课教师
      //   imgAddress: "",
      //   name: "王老师",
      //   work: "高级英语教师"
      // },
      // exchangeTeacher: {
      //   imgAddress: "",
      //   name: "张老师",
      //   work: "中级英语教师"
      // },
      // attenProp: {
      //   //到课率
      //   objName: "到课率",
      //   objProp: "30",
      //   sortType: "1",
      //   changeProp: "2"
      // },
      // frontProp: {
      //   //前排就坐率
      //   objName: "前排就坐率",
      //   objProp: "30",
      //   sortType: "1",
      //   changeProp: "2"
      // },
      // sleepProp: {
      //   objName: "前排就坐率",
      //   objProp: "30",
      //   sortType: "1",
      //   changeProp: "2"
      // },
      // stuTotalNum: "89",
      // subGrade: "-5", //科目评分
      // stuDedRes: "多人睡觉、上课玩手机、讲话人数较多",
      // teaDedRes: "老师未讲课、上课接电话",
      // patrolPerson: "",
      // patrolTime: "2019-08-05 10:21:31"
    }, () => {
      console.log(selectValue)
      console.log(selectValue == undefined)
      if (sessionStorage.getItem('sectionId') == 'undefined' || sessionStorage.getItem('sectionId') == 'null') {
        this.setState({
          OrdClassList: [],
          randomList: [],
          videoList: []
        })
        return;
      }
      if (selectValue !== 'undefined') {
        this.getCollageList()
      } else {
        this.getCollageList('5')
      }
      console.log(selectValue, "sel");
    });
  };
  render() {
    let {
      showSelect,
      OrdClassList,
      listOnclick,
      selectValue,
      randomList,
      videoList,
      teachTeacher,
      exchangeTeacher,
      attenProp,
      frontProp,
      sleepProp,
      stuTotalNum,
      subGrade,
      stuDedRes,
      teaDedRes,
      patrolPerson,
      patrolTime,
      videoError,
      froneSitRate,
      sleepRate,
      attenRate,
      total,
      pageNum,
      pageSize,
      videoLoad,
      disciplinesNum,
      disciplinesList
    } = this.state;
    let listData, centerHead;
    let { isClassOrder } = G.ISCED_setInfo
    if (showSelect) {
      listData = OrdClassList;
    } else {
      listData = randomList;
    }
    listData ? centerHead = listData[listOnclick] : null;
    // console.log(videoList)
    let videoRtmp, videoHls
    if (videoList.length) {
      videoRtmp = videoList.find(item => item.indexOf('rtmp') > -1)
      videoHls = videoList.find(item => item.indexOf('http') > -1)
    }

    return (
      <div className="yrj_orderclass">
        <div className="vis-head">课堂查课</div>
        <div className="content">
          <div className="left">
            <div className={showSelect ? "left_head" : "left_head left_bg"}>
              <div
                className="left_head_box"
                id="left_top_select"
                style={
                  showSelect
                    ? {}
                    : {
                      paddingLeft: "10%",
                      textAlign: "left",
                      cursor: "pointer"
                    }
                }
              >
                {showSelect ? (
                  <Select
                    value={selectValue}
                    title={selectValue}
                    dropdownClassName="tj-view"
                    getPopupContainer={() =>
                      document.getElementById("left_top_select")
                    }
                    onChange={e => this.selectChaneg(e)}
                    style={{ width: "100%" }}
                  >
                    <Option title={`前排就座率低于${froneSitRate}%`} value="0">
                      {`前排就座率低于${froneSitRate}%`}
                    </Option>
                    <Option title={`低头率高于${sleepRate}%`} value="1">
                      {`低头率高于${sleepRate}%`}
                    </Option>
                    {
                      G.ISCED_setInfo && G.ISCED_setInfo.ifClassroomDiscipline == '1' ?
                        <Option title={"巡课违纪"} value="2">
                          巡课违纪
                    </Option> : null
                    }

                    <Option title={`到课率低于${attenRate}%`} value="3">
                      {`到课率低于${attenRate}%`}
                    </Option>
                    <Option title={"教师考勤异常"} value="4">
                      教师考勤异常
                    </Option>
                  </Select>
                ) : (
                  <span onClick={() => this.random(true)}>筛选查看</span>
                )}
              </div>
              <div className="left_head_box" onClick={() => this.random(false)}>
                随机看看
              </div>
            </div>
            <ul className="left_con">
              {/* className="onclick" */}
              {listData.length ? (
                listData !== "loading" ? (
                  listData.map((item, key) => (
                    <li
                      key={key}
                      className={listOnclick === key ? "onclick" : ''}
                      onClick={() => {
                        this.clickList(key, item);
                      }}
                    >
                      <div className="con_left">
                        <div
                          className="left_box"
                          style={
                            showSelect
                              ? {}
                              : {
                                width: "60%"
                              }
                          }
                        >
                          {showSelect ? (
                            <div className="message">
                              {
                                selectValue == '4' ?
                                  <span className='tj-selectError'>{item.objProp}</span>
                                  :
                                  <>
                                    <span>
                                      {item.objProp || '--'}
                                      <i>{selectValue == 2 ? '' : '%'}</i>
                                    </span>
                                    <span>{item.objName}</span>
                                  </>
                              }

                            </div>
                          ) : null}
                          <div
                            // className="message1"
                            className={
                              showSelect ? "message1" : " message1 radomWidth"
                            }
                            style={
                              showSelect
                                ? {}
                                : {
                                  paddingLeft: "40px"
                                }
                            }
                          >
                            <span title={item.collegeName}>
                              {item.collegeName}
                            </span>
                            <span title={item.teacherName}>
                              {item.teacherName}
                            </span>
                          </div>
                        </div>
                        <div className="left_box">
                          <div
                            className="message1"
                            style={
                              showSelect ? {
                                paddingRight: '7%',
                                paddingTop: '8%',
                                height: "100%"
                              } :
                                {

                                  paddingTop: '8%',
                                  // float: "left",

                                  height: "100%"
                                }
                            }
                          >
                            <span
                              // style={
                              //   showSelect
                              //     ? {}
                              //     : {
                              //       marginTop: "15%"
                              //     }
                              // }
                              title={item.subName}
                            >
                              {item.subName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <Loading />
                )
              ) : (
                <NoData />
              )}
            </ul>
            <div className="pages">
              <span style={pageNum !== 1 ? {} : { cursor: 'not-allowed' }} onClick={() => this.pageChange("last")}>上一页</span>
              <span style={total > pageNum * pageSize ? {} : { cursor: 'not-allowed' }} onClick={() => this.pageChange("next")}>下一页</span>
            </div>
          </div>
          <div className="center">
            <div className="center_head">
              <span title={centerHead ? centerHead.collegeName : ''}>
                {" "}
                <SVG type={"college"} />
                {centerHead ? centerHead.collegeName || null : null}
              </span>
              {
                isClassOrder == '1' ?
                  <span title={centerHead ? centerHead.courseNum : ''}>
                    <SVG type={"kch"} />
                    {centerHead ? centerHead.courseNum || null : null}
                  </span> : null
              }
              <span title={centerHead ? centerHead.subName : ''}>
                <SVG type={"subject"} />
                {centerHead ? centerHead.subName || null : null}
              </span>
              {
                isClassOrder == '1' ?
                  <span title={centerHead ? centerHead.lessonNum : ''}>
                    <SVG type={"xh"} />
                    {centerHead ? centerHead.lessonNum || null : null}
                  </span> : null
              }
              <span title={centerHead ? centerHead.teacherName : ''}>
                <SVG type={"teacher"} />
                {centerHead ? centerHead.teacherName || null : null}
              </span>
              <span title={centerHead ? centerHead.objAddress : ''}>
                <SVG type={"teaBuild"} />
                {centerHead ? centerHead.objAddress || '--' : '--'}
              </span>
              <span title={centerHead ? centerHead.objSection : ''}>
                <SVG type={"time"} />
                {centerHead ? centerHead.objSection || '--' : '--'}
              </span>
            </div>

            <div className="center_video">
              <div className="top_line">
                <img
                  src={video_topLine}
                  style={{ margin: "0 auto", width: "100%" }}
                />
              </div>
              <div className="video_box">
                {/* 视频：{videoList[0]} */}
                {/* https://img.tukuppt.com/video_show/3987418/00/02/98/5b9fd2b9cf6a1.mp4 */}
                {
                  videoLoad ?
                    <Loading />
                    :
                    videoList && videoList.length ?
                      (
                        videoRtmp ?
                          <OneScreenPlayer
                            url={videoRtmp}
                          />
                          :
                          <VideoPlayer
                            url={videoHls}
                            width={100}
                            height={100}
                          />
                      )
                      :
                      <NoData style={{ width: '40%', height: '40%' }} msg={videoError} />
                }
                {/* {videoList[0] ? (
                  videoList !== "loading" ? (
                    <VideoPlayer
                      url={videoList[0]}
                      width={100}
                      height={100}
                    />
                  ) : (
                      <Loading />
                    )
                ) : ( <NoData style={{width:'40%',height:'40%'}} msg={videoError}/>)} */}
                <div className="video_box_left"></div>
                <div className="video_box_right"></div>
                <div className="bootom_l">
                  <img src={video_btm} />
                </div>
                <div className="bootom_r">
                  <img style={{ transform: "scaleX(-1)" }} src={video_btm} />
                </div>
              </div>
              <div className="line">
                <img
                  src={video_line}
                  style={{ margin: "0 auto", width: "100%" }}
                />
              </div>
              <div className="bottom">
                <img
                  src={video_btmLine}
                  style={{ margin: "0 auto", width: "100%" }}
                />
              </div>
            </div>
          </div>
          <div
            className="right"
            style={
              !exchangeTeacher.name
                ? { height: "105.5%" }
                : {
                  marginTop: "-6%"
                }
            }
          >
            {/* {teachTeacher && teachTeacher.name ? ( */}
            <div
              className="right_head"
              onClick={() =>
                this.goRouter(teachTeacher.teaId, teachTeacher.collegeId)
              }
            >
              <div className="imgbox">
                {/* <img style={{borderRadius:'50%',padding:'19%'}} src={'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1587003006&di=a6d3f004db63eaa0d61b5d7f82ebf1f7&src=http://img.kalaxing.com/5bc0698d720415167de67f79.jpeg'} /> */}
                <img style={{ borderRadius: '50%', padding: '19%' }} onError={(e) => { e.target.onerror = null; e.target.src = tea_img }} src={teachTeacher.imgAddress ? G.dataService + teachTeacher.imgAddress : tea_img} />
                <div className="roatz">
                  <img src={teaz} />
                </div>
                <div className="roatf">
                  <img src={teaf} />
                </div>
              </div>
              <div className="img_con">
                <span>正在授课</span>
                <span>姓名：{teachTeacher.name || '--'}</span>
                {/* <span>职级：{teachTeacher.work}</span> */}
              </div>
            </div>
            {/* ) : null} */}
            {exchangeTeacher && exchangeTeacher.name ? (
              <div
                className="right_head"
                style={{ background: "none", marginTop: "2.5%" }}
                onClick={() =>
                  this.goRouter(exchangeTeacher.teaId, exchangeTeacher.collgeId)
                }
              >
                <div
                  className="right_head_bg_box"
                  style={{ transform: "scaleX(-1)", opacity: " 0.5" }}
                >
                  <div className="imgbox">
                    <div className="roatz_hd">
                      <img src={teaz} />
                    </div>
                    <div className="roatf_hd">
                      <img src={teaf} />
                    </div>
                  </div>
                </div>
                <img
                  className="tea_img_posTop"
                  src={G.dataService + exchangeTeacher.imgAddress || tea_img}
                />
                <div className="title_posTopLeft">本该授课</div>
                <div className="img_con newPl" style={{ paddingLeft: "30%" }}>
                  <span style={{ color: " rgb(236,115,41)" }}>调换课</span>
                  <span>姓名：{exchangeTeacher.name}</span>
                  {/* <span>职级：{exchangeTeacher.work}</span> */}
                </div>
              </div>
            ) : null}
            <div
              className="right_con"
              style={!exchangeTeacher.name ? { marginTop: "10%" } : {}}
            >
              <div
                className="ai_box"
                style={!exchangeTeacher.name ? { margin: "5% 0" } : {}}
              >
                <div className="ai_left">
                  <span></span>
                  <span>AI巡课</span>
                </div>
                <div className="ai_right">
                  <div className="ai_right_head">
                    <SVG type={"student"} />
                    学生总数： {stuTotalNum || '--'}
                  </div>
                  <ul className="ai_right_con">
                    <li>
                      <div className="li_head">
                        {/* {attenProp.objName} */}
                        到课率
                      </div>
                      <div className="li_echarts">
                        {attenProp.objProp ? (
                          attenProp !== "loading" ? (
                            <MoreDataPieEcharts
                              center={["50%", "50%"]}
                              color={[attenProp.sortType == 1 ? "#03bf84" : attenProp.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                              data={attenProp.objProp || 0}
                              changeProp={attenProp.changeProp || 0} //改变的prop
                              up={attenProp.sortType || 0} //箭头朝向以及颜色
                            />
                          ) : (
                            <Loading />
                          )
                        ) : (
                          <NoData />
                        )}
                      </div>
                      <div className="li_bottom">较上周同期</div>
                    </li>
                    <li>
                      <div className="li_head">
                        {/* {frontProp.objName} */}
                        前排就坐率
                      </div>
                      <div className="li_echarts">
                        {frontProp.objProp ? (
                          frontProp !== "loading" ? (
                            <MoreDataPieEcharts
                              center={["50%", "50%"]}
                              color={[frontProp.sortType == 1 ? "#03bf84" : frontProp.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                              data={frontProp.objProp || 0}
                              changeProp={frontProp.changeProp || 0} //改变的prop
                              up={frontProp.sortType || 0} //箭头朝向以及颜色
                            />
                          ) : (
                            <Loading />
                          )
                        ) : (
                          <NoData />
                        )}
                      </div>
                      <div className="li_bottom">较上周同期</div>
                    </li>
                    <li>
                      <div className="li_head">
                        {/* {sleepProp.objName} */}
                        低头率
                      </div>
                      {console.log(sleepProp, sleepProp !== "loading")}
                      <div className="li_echarts">
                        {sleepProp.objProp ? (
                          sleepProp !== "loading" ? (
                            <MoreDataPieEcharts
                              center={["50%", "50%"]}
                              color={[sleepProp.sortType == 1 ? "#03bf84" : sleepProp.sortType == 2 ? "#ec7329" : "#03bf84", "transparent"]}
                              data={sleepProp.objProp || 0}
                              changeProp={sleepProp.changeProp || 0} //改变的prop
                              up={sleepProp.sortType || 0} //箭头朝向以及颜色
                            />
                          ) : (
                            <Loading />
                          )
                        ) : (
                          <NoData />
                        )}
                      </div>
                      <div className="li_bottom">较上周同期</div>
                    </li>
                  </ul>
                </div>
              </div>
              {
                G.ISCED_setInfo && G.ISCED_setInfo.ifClassroomDiscipline == '1' ?
                  <div className="ai_box">
                    <div className="ai_left" style={{ paddingTop: "14%" }}>
                      <span></span>
                      <span>在线巡课</span>
                    </div>
                    <div className="ai_right">
                      <div className="men_left">
                        <div className="men_left_head">违纪事件数</div>
                        <div className="men_left_center">
                          {disciplinesNum || "0"}
                          <span>件</span>
                        </div>
                        {/* <div className="men_left_bottom">本节课扣分</div> */}
                      </div>
                      {
                        disciplinesNum <= 0 ? null :
                          <div className="men_left" style={{ width: "65%" }}>
                            <div className="men_left_head">违纪事件</div>
                            <div className="men_right_con">
                              <PerfectScrollbar>
                                {
                                  disciplinesList.map((item) => {
                                    return <div key={item.name}>{item.name}&nbsp;{item.value}</div>
                                  })
                                }
                              </PerfectScrollbar>
                            </div>
                          </div>
                      }


                    </div>
                  </div>
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeachingOrderClass;
