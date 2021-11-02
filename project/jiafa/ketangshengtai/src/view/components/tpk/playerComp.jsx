/*
 * @Author: JC.Liu 
 * @Date: 2019-05-05 10:41:20 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-19 13:24:25
 * 管理员 听评课 播放器 组件
 */

import React, { Component } from 'react';
import { Row, Col, Select, Tabs, message, Pagination, Input, Modal, Rate } from 'antd';
import { withRouter } from 'react-router-dom';

import PlayerRecord from './../../publicComponent/playerRecord.jsx';
import PlayerLive from './../../publicComponent/player.jsx';
import { SVG, IMG } from './../../components/tpk/base.jsx';
// import { G } from './../../../../js/g';
import './../../../style/tpk/JC_jxjc_playerPage.scss';
import './../../../style/tpk/JC_player.scss';
import MyComments from '../../components/tpk/gwj_comments.jsx'
import PIC_noData from './../../icon/nodata1.png';
import MyInput from '../../components/tpk/gwj_input.jsx'
// import MyDiscipline from "../../../component/admin/jxjc/gwj_discipline";
import { request } from './../../../util/request_2.12';
// import _x from './../../../../js/_x/index';
// const Request = _x.util.request.request;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

let count = 0;

@withRouter
class TpkPlayerCom extends Component {

  constructor() {
    super();
    this.state = {
      classInfo: {},
      isLive: false,
      addrList: [],
      videoUrl: [],
      refresh: false,
      selectValue: "",
      currentId: "",
      type: "",
      // "1-教学检查的评论，2-教研课评论，3-随堂听评论，4-课堂秩序评论 5-我的反思"
      tab: "1",
      pageSize: 10,
      pageNumber: 1,
      // 评论的列表信息
      comment: [],
      tipScrip: "加载中..."
    }
  }

  componentDidMount() {
    let param = this.props.match.params;
    let id = param.id;
    let type = param.type;


    this.setState({
      currentId: id,
      type
    }, () => {
      // 获取视频信息
      this.getVideo(id);
      // tab 请求 
      this.getTabData();
    });
  }

  componentWillUnmount() {
    count = 0;
  }

  getVideo = id => {
    request("api/web/patroller_realtime/get_patrol_video", {
      "curriculumallId": id
    }, res => {
      if (res.result && res.code === "200") {

        // flag 播放流地址获取成功失败标识
        let classInfo = {}, isLive = false, addrList = [];
        if (res.data && res.data.flag) {
          res.data.addrList.map(item => {
            addrList.push({
              equipName: item.equipName,
              equipTypeNum: item.equipTypeNum,
              urlList: this.mapUrllist(item.urlList)
            });
          })
        } else {
          message.error(res.data.msg || "获取视频失败！");
          this.setState({
            tipScrip: "暂无视频源"
          })
        }

        // 课堂信息
        if (res.data && res.data.cfp && Object.keys(res.data.cfp).length) {
          classInfo = res.data.cfp
        };
        this.setState({
          classInfo
        })

        // 直播还是录播 标识
        if (res.data.isLive) {
          isLive = res.data.isLive
        }

        let videoUrl = [
          [addrList[0].urlList[0].url, '', addrList[0].urlList[0].playtype === "hd" ? "高清" : "标清", addrList[0].urlList[0].playtype === "hd" ? 10 : 0],
          [addrList[0].urlList[1].url, '', addrList[0].urlList[1].playtype === "hd" ? "高清" : "标清", addrList[0].urlList[0].playtype === "hd" ? 10 : 0]
        ];

        this.setState({
          isLive,
          addrList,
          selectValue: addrList[0].equipName,
          videoUrl,
          refresh: true
        });

        setTimeout(() => {
          this.setState({
            refresh: false
          })
        }, 200);

      } else {
        // 请求失败
        this.setState({
          classInfo: {},
          isLive: false,
          addrList: [],
          videoUrl: [],
          selectValue: "",
          tipScrip: "暂无视频源"
        })
      }
    })
  }

  mapUrllist = (data) => {
    return data.map(item => {
      if (item && item.list && item.list.length) {
        return { playtype: item.playtype, url: this.mapUrl(item.list) }
      }
    })
  }

  mapUrl = (data) => {
    let a = '';
    data.map(item => {
      if (item.videotype === "rtmp") {
        a = item.url
      }
    })
    return a
  }

  // 课程信息
  findData = (data, type) => {
    let name = "";
    let { curriculum } = data
    switch (type) {
      case 5:
        if (curriculum && curriculum.length) {
          curriculum.map((item, index) => {
            if (index === 0) {
              name += item.teacherName;
            } else {
              name += `,${item.teacherName}`;
            }
          });
        }
        return name || "-";
      case 1:
        if (curriculum && curriculum.length) {
          curriculum.map((item, index) => {
            if (index === 0) {
              name += item.curClassName
            } else {
              name += `,${item.curClassName}`
            }
          })
        }
        return name || "-";
      case 2:
        name = data.lessonLableType
        return name || "-";
      case 3:
        if (curriculum && curriculum.length) {
          curriculum.map((item, index) => {
            if (index === 0) {
              if (item.grdListName) {
                name += item.grdListName
              }
            } else {
              if (item.grdListName) {
                name += `,${item.grdListName}`
              }
            }
          })
        }
        return name || "-";
      case 4:
        if (curriculum && curriculum.length) {
          name = curriculum[0].subjectName;
        }
        return name || "-";
      case 6:
        let rate = '-';
        let sCount = data.curriculum && data.curriculum[0] && data.curriculum[0].stuNum ? data.curriculum[0].stuNum : 0;
        rate = sCount ? ((data.attendance / sCount) * 100).toFixed(2) + "%" : '--';
        return rate;
      default:
        return name || "-";
    }
  }

  renderList = (data) => {
    return data.map((item, index) => {
      return <Option key={index} value={item.equipName}>{item.equipName}</Option>
    })
  }

  // tab项 请求
  getTabData = () => {
    const state = this.state;
    request("api/web/teacommon/commentPage", {
      "curriculumallId": state.currentId,
      "pageNumber": state.pageNumber,
      "pageSize": state.pageSize,
      "type": state.tab
    }, res => {
      if (res.result && res.code === '200') {
        this.setState({ comment: res.data })
      } else {
        this.setState({ comment: {} })
      }
    }, err => {
      message.error('服务未连接成功，请联系管理员');
      this.setState({ comment: {} })
    });
  }

  // tab 切换
  callback = (key) => {
    this.setState({
      tab: key,
      pageNumber: 1
    }, () => {
      this.getTabData();
    })
  }

  // 提交评论后重新请求评轮
  rerenderCallback = () => {
    this.setState({
      pageNumber: 1
    }, () => {
      this.getTabData();
    })
  }

  // 翻页
  changePage = (page) => {
    this.setState({ pageNumber: page }, () => {
      this.getTabData();
    })
    this.node.scrollIntoView();
  }

  selectHandle = v => {
    const { addrList } = this.state;
    let t = _.find(addrList, { equipName: v });
    // url
    let videoUrl = [];
    if (t) {
      t.urlList.map(item => {
        videoUrl.push([
          item.url,
          "",
          item.playtype === "hd" ? "高清" : "标清",
          item.playtype === "hd" ? 10 : 0
        ]);
      });
    }

    this.setState({
      videoUrl,
      selectValue: v,
      refresh: true
    });

    setTimeout(() => {
      this.setState({
        refresh: false
      });
    }, 200);
  };

  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>;
    } if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  videoCallback = () => {
    if (this.state.tab == 4) {
      // 请求课堂秩序
      this.getTabData()
    }
  }

  endedCallback = (type) => {
    if (type === "end") {
      // 播放结束后 需要将播放器刷新
      this.setState({
        refresh: true,
      });

      setTimeout(() => {
        this.setState({
          refresh: false,
        });
      }, 50)
    } else if (type === "error") {
      // 这里需要做一个计数器，当计数器达到5次时 提示失败，
      count++
      if (count > 4) {
        this.setState({
          refresh: true,
          tipScrip: "播放失败，请刷新重试或联系管理员~"
        });

      } else {
        this.setState({
          refresh: true
        })

        setTimeout(() => {
          this.setState({
            refresh: false
          })
        }, 50)
      }
    }
  }


  render() {
    const style = {
      playerCSS: {
        display: "inline-block",
      }
    };
    const {
      selectValue, addrList, classInfo, isLive, videoUrl, refresh, currentId, comment, pageNumber, tab
    } = this.state;
    const tabbar = [
      { tab: "听课评分", key: "2" },
      { tab: "听课评议", key: "1" },
      { tab: "课堂秩序", key: "4" },
      { tab: "教学反思", key: "5" },
    ]
    // console.log(comment);


    return (
      <>
        <div className="JC-jxjc-header">
          <div className="JC-header-info" >
            <Row gutter={28} >
              <Col span={4}>
                <span onClick={() => {
                  this.props.history.goBack()
                }}>
                  <SVG type="fanhui" style={{ fontSize: "25px" }} />
                </span>
                &nbsp;&nbsp;
                <span>{this.findData(classInfo, 1) || "-"}</span>
              </Col>
              <Col span={4}><SVG type="shijian-2" title="节次" />&nbsp;<span>{this.findData(classInfo, 2) || "-"}</span></Col>
              <Col span={4}><SVG type="xueyuan" title="年级" />&nbsp;<span>{this.findData(classInfo, 3) || "-"}</span></Col>
              <Col span={4}><SVG type="icon25" title="科目" />&nbsp;<span>{this.findData(classInfo, 4) || "-"}</span></Col>
              <Col span={4}>
                <SVG type="laoshi" title="老师" />
                &nbsp;<span>{this.findData(classInfo, 5)}</span>
              </Col>
              <Col span={4}>
                <SVG type="users" title="出勤率" />
                &nbsp;<span>{`出勤率：${this.findData(classInfo, 6)}`}</span>
              </Col>
              <Col span={4}>
                <Select value={selectValue} onChange={this.selectHandle} >
                  {this.renderList(addrList)}
                </Select>
              </Col>
            </Row>
          </div>
        </div>
        <div className="JC-jxjc-content" style={{ height: 676 }} >
          {
            videoUrl && videoUrl.length ?
              !refresh ?
                isLive ?
                  <PlayerLive cid={currentId} url={videoUrl} style={style.playerCSS} robot={true} callback={this.videoCallback} endedCallback={this.endedCallback} />
                  :
                  <PlayerRecord cid={currentId} url={videoUrl} style={style.playerCSS} robot={true} callback={this.videoCallback} endedCallback={this.endedCallback} />
                :
                <div className="JC-ssxk-noVideo">
                  <div className="JC-svg">
                    <SVG
                      type="shipin"
                      style={{ fontSize: "100px" }}
                      color="#333333"
                    />
                    <p style={{ fontSize: 20, color: "#333333" }} >{this.state.tipScrip}</p>
                  </div>
                </div>
              :
              <div className="JC-ssxk-noVideo">
                <div className="JC-svg">
                  <SVG
                    type="shipin"
                    style={{ fontSize: "100px" }}
                    color="#333333"
                  />
                  <p style={{ fontSize: 20, color: "#333333" }} >{this.state.tipScrip}</p>
                </div>
              </div>
          }
        </div>

        <div className="JC-jxjc-footer gwj-tabs-box" ref={(ref) => this.node = ref}>
          <div className="JC-tabbar">
            {
              tabbar.map(item => {
                return <div key={item.key}
                  onClick={() => this.callback(item.key)}
                  className={tab === item.key ? "JC-tab tab-active" : "JC-tab"}>
                  {item.tab}
                </div>
              })
            }

          </div>
          {
            tab === "1" ?
              <MyInput curriculumallId={currentId} callback={() => this.rerenderCallback()} />
              : null
          }
          {Object.keys(comment).length == 0 ?
            <div className="JC-nodata-tip">
              <img src={PIC_noData} />
              <p>暂无数据</p>
            </div> :
            comment.page.length ?
              <div>
                {
                  comment.page.map((item, index) => (
                    // <MyDiscipline key={index} info={item} curriculumallId={currentId}
                    // // type={type} 
                    // />
                    <MyComments
                      key={index}
                      info={item}
                      type={'2'}
                      curriculumallId={currentId}
                      commentStatus="听课评议"
                    />
                  ))
                }
                <div className="gwj-tabs-pagination" style={{textAlign: 'right'}}>
                  <Pagination
                    className="ll-PageStyle ll-Pg"
                    current={pageNumber}
                    total={comment.totalElements}
                    pageSize={10}
                    itemRender={this.itemRender}
                    showTotal={total => `每页10条，共 ${total} 条数据`}
                    onChange={this.changePage}
                  />
                </div>
              </div>
              : tab === '1' ? null :
                <div className="JC-nodata-tip">
                  <img src={PIC_noData} />
                  <p>暂无数据</p>
                </div>
          }
        </div>
      </>
    )
  }
}

export default TpkPlayerCom;