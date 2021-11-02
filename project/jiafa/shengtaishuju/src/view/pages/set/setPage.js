/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:45:30 
 * @Last Modified by: tj
 * @Last Modified time: 2021-04-09 17:00:01
 * 设置
 */
import React, { Component } from 'react';
import "../../../style/wsSetPage.scss";
// import PerfectScrollbar from "react-perfect-scrollbar";
import { InputNumber, Radio, message, Spin, Switch, Modal } from 'antd';
import SVG from '../../public/svg';
import { request } from '../../../util/request';
import G from "../../../config/g";
import { connect } from "react-redux";
import { ws_saveGlobalData } from "../../../redux/ws-global.reducer";
const { confirm, info } = Modal
const formatBoolean = (value) => {
  if (typeof value == 'boolean') {
    if (value) {
      return '1'
    } else {
      return '0'
    }
  }
  if (typeof value == 'string') {
    if (value == 0) {
      return false
    } else {
      return true
    }
  }

}
@connect(state => state,
  {
    ws_saveGlobalData,
  })
class SetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAnalyze: formatBoolean(G.ISCED_setInfo.dataAnalyze),//AI教学分析
      isTeacherCheck: formatBoolean(G.ISCED_setInfo.isTeacherCheck), // 功能-教师考勤
      isHeadLow: formatBoolean(G.ISCED_setInfo.isHeadLow), // 功能-低头率
      isFrontRate: formatBoolean(G.ISCED_setInfo.isFrontRate), // 功能-前排就座率
      multimediaUse: formatBoolean(G.ISCED_setInfo.multimediaUse),//多媒体使用
      attenRaleUnder: G.ISCED_setInfo.attenRaleUnder, //到课率阈值
      seatedRateUnder: G.ISCED_setInfo.seatedRateUnder,//就座率阈值
      sleepRateOver: G.ISCED_setInfo.sleepRateOver,//睡觉率阈值
      ifClassroomDiscipline: formatBoolean(G.ISCED_setInfo.ifClassroomDiscipline),//巡课违纪
      isStuOnAttRate: formatBoolean(G.ISCED_setInfo.isStuOnAttRate), //到课率
      isSeatedRate: formatBoolean(G.ISCED_setInfo.isSeatedRate), //就座率
      isSleepRate: formatBoolean(G.ISCED_setInfo.isSleepRate), //睡觉率
      isTeaAttLate: formatBoolean(G.ISCED_setInfo.isTeaAttLate), //教师迟到
      isTeaEarly: formatBoolean(G.ISCED_setInfo.isTeaEarly), //教师早退
      isTeaAttAbsence: formatBoolean(G.ISCED_setInfo.isTeaAttAbsence), //教师缺勤
      isTeaAttExchange: formatBoolean(G.ISCED_setInfo.isTeaAttExchange),  //教师调换课
      isClassDiscipline: formatBoolean(G.ISCED_setInfo.isClassDiscipline), //巡课违纪
      isClassAuto: formatBoolean(G.ISCED_setInfo.isClassAuto), //自动下发
      isClassAutoTime: G.ISCED_setInfo.isClassAutoTime, //自动下发时间
      isClassOrder: formatBoolean(G.ISCED_setInfo.isClassOrder), //课程号课序号
      isAllowColApply: formatBoolean(G.ISCED_setInfo.isAllowColApply), //同意开课单位申请
      isReportStuOn: G.ISCED_setInfo.isReportStuOn, //校长报告学生到课率低于
      // isReportStuOn: '',
      loading: false,
      isEdit: false
    };
    this.onChangeDataAnalyze = this.onChangeDataAnalyze.bind(this);
    this.onChangeMultimediaUse = this.onChangeMultimediaUse.bind(this);
    this.onChangeAttenRaleUnder = this.onChangeAttenRaleUnder.bind(this);
    this.onChangeSeatedRateUnder = this.onChangeSeatedRateUnder.bind(this);
    this.onChangeSleepRateOver = this.onChangeSleepRateOver.bind(this);
    this.onChangeIfClassroomDiscipline = this.onChangeIfClassroomDiscipline.bind(this);
    this.onChangeReportValue = this.onChangeReportValue.bind(this)
    this.onChangeAutoTime = this.onChangeAutoTime.bind(this)
    this.saveSet = this.saveSet.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.getMedioInfo = this.getMedioInfo.bind(this)
    this.getMessage = this.getMessage.bind(this)
  }

  componentDidMount () {
    this.getSetInfo()
  }


  /**
   * 获取设置配置项
   */
  getSetInfo () {
    request("/api/system/getSetInfo", {}, res => {
      if (res.result) {
        let data = res.data
        this.setState({
          dataAnalyze: formatBoolean(data.dataAnalyze),
          isTeacherCheck: formatBoolean(data.isTeacherCheck), // 教师考勤
          isHeadLow: formatBoolean(data.isHeadLow), // 低头率
          isFrontRate: formatBoolean(data.isFrontRate), // 前排就座率
          multimediaUse: formatBoolean(data.multimediaUse),
          attenRaleUnder: data.attenRaleUnder,
          seatedRateUnder: data.seatedRateUnder,
          sleepRateOver: data.sleepRateOver,
          ifClassroomDiscipline: formatBoolean(data.ifClassroomDiscipline),
          isStuOnAttRate: formatBoolean(data.isStuOnAttRate),
          isSeatedRate: formatBoolean(data.isSeatedRate),
          isSleepRate: formatBoolean(data.isSleepRate),
          isTeaAttLate: formatBoolean(data.isTeaAttLate),
          isTeaEarly: formatBoolean(data.isTeaEarly),
          isTeaAttAbsence: formatBoolean(data.isTeaAttAbsence),
          isTeaAttExchange: formatBoolean(data.isTeaAttExchange),
          isClassDiscipline: formatBoolean(data.isClassDiscipline),
          isClassAuto: formatBoolean(data.isClassAuto),
          isClassAutoTime: data.isClassAutoTime, //自动下发时间
          isClassOrder: formatBoolean(data.isClassOrder), //课程号课序号
          isAllowColApply: formatBoolean(data.isAllowColApply), //同意开课单位申请
          isReportStuOn: data.isReportStuOn, //校长报告学生到课率低于
          loading: false,
        })
        if (data) {
          this.props.ws_saveGlobalData(data, "ISCED_setInfo");
        }
      } else {
        message.warning(res.message);
      }
    }).catch(() => { this.setState({ loading: false }) });
  }

  /**
   * 开关改变 
   * @param {*} value 
   * @param {String} type 操作开关具体类型
   */
  checkChange (type, value) {
    let { isFrontRate, isHeadLow, isTeacherCheck, ifClassroomDiscipline } = this.state
    // console.log(value, type, isFrontRate, isHeadLow, isTeacherCheck)
    if (type === "isTeacherCheck") {
      // 关闭功能配置-教师考勤，预警设置-教师考勤全部关闭
      confirm({
        title: `确定要${value ? "开启" : "关闭"
          }教师考勤吗？该操作将同步${value ? "开启" : "关闭"
          }预警设置-教师考勤模块`,
        okText: "确定",
        icon: "exclamation-circle",
        onCancel: () => {
          return
        },
        onOk: () => {
          this.setState({
            isTeaAttLate: value,
            isTeaEarly: value,
            isTeaAttAbsence: value,
            isTeaAttExchange: value,
            [type]: value,
            isEdit: true
          })
        }
      })
    } else if (type === "isHeadLow") {
      // 关闭功能配置-低头率，学生课堂秩序-低头率
      confirm({
        title: `确定要${value ? "开启" : "关闭"
          }低头率吗？该操作将同步${value ? "开启" : "关闭"
          }学生课堂秩序-低头率`,
        okText: "确定",
        icon: "exclamation-circle",
        onCancel: () => {
          return
        },
        onOk: () => {
          this.setState({
            isSleepRate: value,
            [type]: value,
            isEdit: true
          })
        }
      })
    } else if (type === "isFrontRate") {
      // 关闭功能配置-前排就座率，学生课堂秩序-前排就座率
      confirm({
        title: `确定要${value ? "开启" : "关闭"
          }前排就座率吗？该操作将同步${value ? "开启" : "关闭"
          }学生课堂秩序-前排就座率`,
        okText: "确定",
        icon: "exclamation-circle",
        onCancel: () => {
          return
        },
        onOk: () => {
          this.setState({
            isSeatedRate: value,
            [type]: value,
            isEdit: true
          })
        }
      })
    } else if (type === "ifClassroomDiscipline") {
      // 关闭功能配置-前排就座率，学生课堂秩序-前排就座率
      confirm({
        title: `确定要${value ? "开启" : "关闭"
          }巡课违纪吗？该操作将同步${value ? "开启" : "关闭"
          }在线巡课-巡课违纪`,
        okText: "确定",
        icon: "exclamation-circle",
        onCancel: () => {
          return
        },
        onOk: () => {
          this.setState({
            isClassDiscipline: value,
            [type]: value,
            isEdit: true
          })
        }
      })
    } else if (!isFrontRate && type === "isSeatedRate") {
      // 功能前排就座率关闭，预警前排就座率不可单独打开
      return this.getMessage("前排就座率")
    } else if (!isHeadLow && type === "isSleepRate") {
      // 功能低头率关闭，预警低头率不可单独打开
      return this.getMessage("低头率")
    } else if (!ifClassroomDiscipline && type === "isClassDiscipline") {
      // 功能巡课违纪关闭，在线巡课-巡课违纪不可单独打开
      return this.getMessage("巡课违纪")
    } else if (!isTeacherCheck
      && (type === "isTeaAttLate" || type === "isTeaEarly" || type === "isTeaAttAbsence" || type === "isTeaAttExchange")
    ) {
      // 功能低头率关闭，预警低头率不可单独打开
      return this.getMessage("教师考勤")
    } else {
      this.setState({
        [type]: value,
        isEdit: true
      })
    }
  }
  /**
   * 提示信息
   * @param {String} text 类型
   */
  getMessage (text) {
    info({
      title: `请开启功能设置中的${text}设置!`,
      onOk () {

      },
    });
  }

  /**
   * @description 改变课堂数据分析
   */
  onChangeDataAnalyze (e) {
    this.setState({
      dataAnalyze: e.target.value,
      isEdit: true
    });
  };
  /**
   * @description 改变多媒体使用
   */
  onChangeMultimediaUse (e) {
    this.setState({
      multimediaUse: e.target.value,
      isEdit: true
    });
  };
  /**
   * @description 改变课堂违纪
   */
  onChangeIfClassroomDiscipline (e) {
    this.setState({
      ifClassroomDiscipline: e.target.value,
      isEdit: true
    });
  }
  /**
   * @description 改变学生到课率
   */
  onChangeAttenRaleUnder (value) {
    this.setState({
      attenRaleUnder: value,
      isEdit: true
    });
  }
  /**
   * @description 改变前排就座率
   */
  onChangeSeatedRateUnder (value) {
    this.setState({
      seatedRateUnder: value,
      isEdit: true
    });
  }
  /**
   * @description 改变低头率
   */
  onChangeSleepRateOver (value) {
    this.setState({
      sleepRateOver: value,
      isEdit: true
    });
  }
  /**
  * @description 校长报告 到课率阈值
  */
  onChangeReportValue (value) {
    this.setState({
      isReportStuOn: value,
      isEdit: true
    });
  }
  /**
  * @description 改变下发时间
  */
  onChangeAutoTime (value) {
    this.setState({
      isClassAutoTime: value,
      isEdit: true
    });

  }
  /**
   * @description 保存
   */
  saveSet () {
    let { dataAnalyze, multimediaUse, attenRaleUnder, seatedRateUnder, sleepRateOver, ifClassroomDiscipline, isStuOnAttRate, isSeatedRate, isSleepRate,
      isTeaAttLate, isTeaEarly, isTeaAttAbsence, isTeaAttExchange, isClassDiscipline, isClassAuto,
      isClassAutoTime, isClassOrder, isAllowColApply, isReportStuOn, isTeacherCheck, isHeadLow, isFrontRate
    } = this.state;
    let params = {
      dataAnalyze: formatBoolean(dataAnalyze),
      isTeacherCheck: formatBoolean(isTeacherCheck), // 教师考勤
      isHeadLow: formatBoolean(isHeadLow), // 低头率
      isFrontRate: formatBoolean(isFrontRate), // 前排就座率
      multimediaUse: formatBoolean(multimediaUse),
      attenRaleUnder,
      seatedRateUnder,
      sleepRateOver,
      ifClassroomDiscipline: formatBoolean(ifClassroomDiscipline),
      isStuOnAttRate: formatBoolean(isStuOnAttRate),
      isSeatedRate: formatBoolean(isSeatedRate),
      isSleepRate: formatBoolean(isSleepRate),
      isTeaAttLate: formatBoolean(isTeaAttLate),
      isTeaEarly: formatBoolean(isTeaEarly),
      isTeaAttAbsence: formatBoolean(isTeaAttAbsence),
      isTeaAttExchange: formatBoolean(isTeaAttExchange),
      isClassDiscipline: formatBoolean(isClassDiscipline),
      isClassAuto: formatBoolean(isClassAuto),
      isClassAutoTime,
      isClassOrder: formatBoolean(isClassOrder),
      isAllowColApply: formatBoolean(isAllowColApply),
      isReportStuOn,
    }
    this.setState({ loading: true });
    request("/api/system/saveSetInfo", params, res => {
      this.setState({ loading: false });
      if (res.result) {
        message.success("保存成功");
        // this.props.ws_saveGlobalData(params, "ISCED_setInfo");
        // AI教学关闭，菜单关闭
        if (params.dataAnalyze == '0') {
          let curInfo = JSON.parse(JSON.stringify(G.ISCED_curRoleInfo));
          curInfo = this.getInfo(curInfo)
          // 更新全局
          this.props.ws_saveGlobalData(curInfo, "ISCED_curRoleInfo");
        } else if (params.dataAnalyze == '1') {
          let info = G.ISCED_curRoleInfo;
          info = _.find(JSON.parse(JSON.stringify(G.ISCED_roleData.roleData)), { roleId: info.roleId })
          // // 更新全局
          this.props.ws_saveGlobalData(info, "ISCED_curRoleInfo");
        }
        //多媒体使用关闭，菜单关闭
        if (params.multimediaUse == '0') {
          let curInfo = JSON.parse(JSON.stringify(G.ISCED_curRoleInfo));
          curInfo = this.getMedioInfo(curInfo);
          // 更新全局
          this.props.ws_saveGlobalData(curInfo, "ISCED_curRoleInfo");
        } else if (params.multimediaUse == '1') {
          let info = G.ISCED_curRoleInfo;
          info = _.find(JSON.parse(JSON.stringify(G.ISCED_roleData.roleData)), { roleId: info.roleId })
          // // 更新全局
          this.props.ws_saveGlobalData(info, "ISCED_curRoleInfo");
        }
        this.setState({
          isEdit: false
        })
        this.getSetInfo()
      } else {
        message.warning(res.message);
      }
    }).catch(() => { this.setState({ loading: false }) });
  }

  getInfo (data) {
    // 根据课堂数据分析配置关闭菜单明细及报表的教学质量
    let t1 = _.findIndex(data.menuData, { key: "ISCED02" })
    let t2 = _.findIndex(data.menuData, { key: "ISCED03" })
    if (t1 > -1) {
      // 删除报表中的教学质量
      let ind1 = _.findIndex(data.menuData[t1].children, { key: "ISCED021" });
      if (ind1 > -1) {
        data.menuData[t1].children.splice(ind1, 1)
      }
    }
    if (t2 > -1) {
      // 删除明细中的教学质量
      let ind2 = _.findIndex(data.menuData[t2].children, { key: "ISCED031" });
      if (ind2 > -1) {
        data.menuData[t2].children.splice(ind2, 1)
      }
    }
    return data;
  }

  getMedioInfo (data) {
    // 根据多媒体使用配置关闭报表的资源情况
    let t1 = _.findIndex(data.menuData, { key: "ISCED03" })
    if (t1 > -1) {
      // 删除明细中的资源情况多媒体
      let ind1 = _.findIndex(data.menuData[t1].children, { key: "ISCED032" });
      if (ind1 > -1) {
        data.menuData[t1].children.splice(ind1, 1)
      }
    }
    return data;
  }
  render () {
    let { isEdit, dataAnalyze, isStuOnAttRate, isSeatedRate, isSleepRate, isTeaAttLate, isTeaEarly, isTeaAttAbsence, isTeaAttExchange,
      multimediaUse, attenRaleUnder, seatedRateUnder, sleepRateOver, ifClassroomDiscipline, loading, isClassDiscipline, isClassAuto
      , isClassAutoTime, isClassOrder, isAllowColApply, isReportStuOn, isTeacherCheck, isHeadLow, isFrontRate
    } = this.state;
    return (
      <Spin wrapperClassName="ws-spin" spinning={loading} >
        <div className="ws-setPage">
          <div className="ws-setPage-box">
            <div>
              <div className="ws-setPage-fun">
                <div className="ws-setPage-hint">功能配置</div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <span>AI教学分析：</span>
                    <Switch checked={dataAnalyze} onChange={this.checkChange.bind(this, 'dataAnalyze')} />
                    <span className='tit-text'>{dataAnalyze == 0 ? '关闭' : '开启'}</span>
                  </div>
                </div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <span>教师考勤：</span>
                    <Switch checked={isTeacherCheck} onChange={this.checkChange.bind(this, 'isTeacherCheck')} />
                    <span className='tit-text'>{isTeacherCheck == 0 ? '关闭' : '开启'}</span>
                  </div>
                </div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <span>低头率：</span>
                    <Switch checked={isHeadLow} onChange={this.checkChange.bind(this, 'isHeadLow')} />
                    <span className='tit-text'>{isHeadLow == 0 ? '关闭' : '开启'}</span>
                  </div>
                </div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <span>前排就座率：</span>
                    <Switch checked={isFrontRate} onChange={this.checkChange.bind(this, 'isFrontRate')} />
                    <span className='tit-text'>{isFrontRate == 0 ? '关闭' : '开启'}</span>
                  </div>
                </div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <span>多媒体使用：</span>
                    <Switch checked={multimediaUse} onChange={this.checkChange.bind(this, 'multimediaUse')} />
                    <span className='tit-text'>{multimediaUse == 0 ? '关闭' : '开启'}</span>
                  </div>
                </div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <span>巡课违纪：</span>
                    <Switch checked={ifClassroomDiscipline} onChange={this.checkChange.bind(this, 'ifClassroomDiscipline')} />
                    <span className='tit-text'>{ifClassroomDiscipline == 0 ? '关闭' : '开启'}</span>

                  </div>
                </div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <span>课程号、课序号：</span>
                    <Switch checked={isClassOrder} onChange={this.checkChange.bind(this, 'isClassOrder')} />
                    <span className='tit-text'>{isClassOrder == 0 ? '关闭' : '开启'}</span>
                    <span className="ws-setPage-remark">备注 : 开启则页面展示课程号、课序号</span>
                  </div>
                </div>

                {/* <div className="ws-setPage-singleRadio">
                                <span>课堂数据分析</span>
                                <Radio.Group onChange={this.onChangeDataAnalyze} value={dataAnalyze}>
                                    <Radio value={"1"}>是</Radio>
                                    <Radio value={"0"}>否</Radio>
                                </Radio.Group>
                                <span className="ws-setPage-remark">备注 : 课堂数据分析包含数学设计分析、学生听讲反馈、课堂互动</span>
                            </div>
                            <div className="ws-setPage-singleRadio">
                                <span>多媒体使用</span>
                                <Radio.Group onChange={this.onChangeMultimediaUse} value={multimediaUse}>
                                    <Radio value={"1"}>是</Radio>
                                    <Radio value={"0"}>否</Radio>
                                </Radio.Group>
                            </div>
                            <div className="ws-setPage-singleRadio">
                                <span>课堂违纪</span>
                                <Radio.Group onChange={this.onChangeIfClassroomDiscipline} value={ifClassroomDiscipline}>
                                    <Radio value={"1"}>是</Radio>
                                    <Radio value={"0"}>否</Radio>
                                </Radio.Group>
                            </div> */}
              </div>
              <div className="ws-setPage-prewarning">
                <div className="ws-setPage-hint">预警设置</div>
                <div className='tj-warn-block'>
                  <div style={{ fontWeight: 'bold', marginBottom: 20 }}>教师考勤</div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span>教师迟到：</span>
                      <Switch checked={isTeaAttLate} onChange={this.checkChange.bind(this, 'isTeaAttLate')} />
                      <span>{isTeaAttLate == 0 ? '关闭' : '开启'}</span>
                    </div>
                  </div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span>教师早退：</span>
                      <Switch checked={isTeaEarly} onChange={this.checkChange.bind(this, 'isTeaEarly')} />
                      <span>{isTeaEarly == 0 ? '关闭' : '开启'}</span>
                    </div>
                  </div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span>教师缺勤：</span>
                      <Switch checked={isTeaAttAbsence} onChange={this.checkChange.bind(this, 'isTeaAttAbsence')} />
                      <span>{isTeaAttAbsence == 0 ? '关闭' : '开启'}</span>
                    </div>
                  </div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span>教师调换课：</span>
                      <Switch checked={isTeaAttExchange} onChange={this.checkChange.bind(this, 'isTeaAttExchange')} />
                      <span>{isTeaAttExchange == 0 ? '关闭' : '开启'}</span>
                    </div>
                  </div>

                </div>
                <div className='tj-warn-block'>
                  <div style={{ fontWeight: 'bold', marginBottom: 20 }}>学生课堂秩序</div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span>学生到课率：</span>
                      <Switch checked={isStuOnAttRate} onChange={this.checkChange.bind(this, 'isStuOnAttRate')} />
                      <span>{isStuOnAttRate == 0 ? '关闭' : '开启'}</span>
                    </div>
                    <span>学生到课率低于(含)</span>
                    <InputNumber
                      value={attenRaleUnder}
                      min={0}
                      max={100}
                      disabled
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      onChange={this.onChangeAttenRaleUnder}
                    />
                  </div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span>前排就座率：</span>
                      <Switch checked={isSeatedRate} onChange={this.checkChange.bind(this, 'isSeatedRate')} />
                      <span>{isSeatedRate == 0 ? '关闭' : '开启'}</span>
                    </div>
                    <span>前排就座率低于(含)</span>
                    <InputNumber
                      value={seatedRateUnder}
                      min={0}
                      max={100}
                      disabled
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      onChange={this.onChangeSeatedRateUnder}
                    />
                  </div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span>低头率：</span>
                      <Switch checked={isSleepRate} onChange={this.checkChange.bind(this, 'isSleepRate')} />
                      <span>{isSleepRate == 0 ? '关闭' : '开启'}</span>
                    </div>
                    <span>低头率高于(含)</span>
                    <InputNumber
                      value={sleepRateOver}
                      min={0}
                      max={100}
                      disabled
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      onChange={this.onChangeSleepRateOver}
                    />
                  </div>

                </div>
                <div className='tj-warn-block'>
                  <div style={{ fontWeight: 'bold', marginBottom: 20 }}>在线巡课</div>
                  <div className="ws-setPage-single">
                    <div className='tj-setPage-switch'>
                      <span style={{ width: 71 }}>巡课违纪：</span>
                      <Switch checked={isClassDiscipline} onChange={this.checkChange.bind(this, 'isClassDiscipline')} />
                      <span>{isClassDiscipline == 0 ? '关闭' : '开启'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ws-setPage-fun">
                <div className="ws-setPage-hint">教学改进设置</div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <div style={{ fontWeight: 'bold', marginBottom: 20 }}>预警课程设置</div>
                    <span>是否自动下发：</span>
                    <Switch checked={isClassAuto} onChange={this.checkChange.bind(this, 'isClassAuto')} />
                    <span className='tit-text'>{isClassAuto == 0 ? '关闭' : '开启'}</span>
                    <div style={{ display: 'inline-block' }}>
                      <span className='auto-text'>教师考勤实时下发，学生课堂秩序（到课率，前排就座率，低头率）课后</span>
                      <InputNumber
                        max={999}
                        disabled={true}
                        value={isClassAutoTime}
                        style={{ width: 100 }}
                      // onChange={this.onChangeAutoTime}

                      />
                      <span style={{ marginLeft: 5 }}>分钟下发</span>
                    </div>
                  </div>
                </div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <div style={{ fontWeight: 'bold', marginBottom: 20 }}>开课单位申请处置</div>
                    <span>默认同意开课单位申请：</span>
                    <Switch checked={isAllowColApply} onChange={this.checkChange.bind(this, 'isAllowColApply')} />
                    <span className='tit-text'>{isAllowColApply == 0 ? '关闭' : '开启'}</span>
                  </div>
                </div>
                {/* <div className="ws-setPage-singleRadio">
                            <span>课堂数据分析</span>
                            <Radio.Group onChange={this.onChangeDataAnalyze} value={dataAnalyze}>
                                <Radio value={"1"}>是</Radio>
                                <Radio value={"0"}>否</Radio>
                            </Radio.Group>
                            <span className="ws-setPage-remark">备注 : 课堂数据分析包含数学设计分析、学生听讲反馈、课堂互动</span>
                        </div>
                        <div className="ws-setPage-singleRadio">
                            <span>多媒体使用</span>
                            <Radio.Group onChange={this.onChangeMultimediaUse} value={multimediaUse}>
                                <Radio value={"1"}>是</Radio>
                                <Radio value={"0"}>否</Radio>
                            </Radio.Group>
                        </div>
                        <div className="ws-setPage-singleRadio">
                            <span>课堂违纪</span>
                            <Radio.Group onChange={this.onChangeIfClassroomDiscipline} value={ifClassroomDiscipline}>
                                <Radio value={"1"}>是</Radio>
                                <Radio value={"0"}>否</Radio>
                            </Radio.Group>
                        </div> */}
              </div>
              <div className="ws-setPage-fun">
                <div className="ws-setPage-hint">报告设置</div>
                <div className="ws-setPage-single">
                  <div className='tj-setPage-switch'>
                    <div style={{ fontWeight: 'bold', marginBottom: 20 }}>明细表阈值</div>
                    <span>学生到课率低于（含）：</span>
                    <InputNumber
                      value={isReportStuOn}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      onChange={this.onChangeReportValue}
                      max={999}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ws-setPage-save">
            <button onClick={this.saveSet} disabled={isEdit ? false : true} className="ws-save-btn" style={isEdit ? {} :
              {
                background: '#f5f5f5',
                color: 'rgba(0, 0, 0, 0.25)',
                cursor: 'not-allowed',
                border: '1px solid #d9d9d9'
              }}>
              <SVG type='baocun'></SVG>
              <span style={isEdit ? {} :
                {
                  color: 'rgba(0, 0, 0, 0.25)',
                }}>保存</span>
            </button>
          </div>
        </div>
      </Spin>
    );
  }
}

export default SetPage;
