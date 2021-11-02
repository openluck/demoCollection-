/*
 * @Author: JudyC 
 * @Date: 2017-09-14 17:36:21 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-27 09:30:15
 */
import React, { Component } from 'react';
import { Tabs, Modal, Table, Button, message, Spin } from 'antd';
import _ from 'lodash';
import { SVG } from './../../components/tpk/base.jsx';
import PerfectScrollbar from "react-perfect-scrollbar";
import { saveAs } from 'file-saver';
import { G } from "../../../config/g"
import { request, requestForListen, formRequest } from './../../../util/request_2.12';
// import util from './../../../../js/_x/index.js';
// const Request = util.util.request.request;
// const formRequest = util.util.request.formRequest
// const requestForListen = util.util.request.requestForListen

import ListenGroupName from './listenGroupName.jsx';
import ListenSearchKey from './listenSearchKey.jsx';
import ListenPerName from './listenPerName.jsx';
import ListenCheckName from './listenCheckName.jsx';
import './../../../style/tpk/mj_listenCheckCon.css';
import './../../../style/tpk/mj_listenCheckedName.css';
import './../../../style/tpk/mj_listenPerCon.css';
import excel from './../../../media/picture/excel.png';

const TabPane = Tabs.TabPane;

function callback(key) {
}

class RePlanSlctTea extends Component {
  constructor(props) {
    super(props);
    var checkPer = this.props.defaultData;
    this.state = {
      allPerson: [],    //初始化获取所有老师（值不变）
      groups: [],       //教研组
      teachers: [],     //所有老师
      // personLists1: data1.person,
      // checkData: data1.person[0].relaTeachers,
      checkPer: checkPer,    // 已选择成员
      warningLen: -1,
      selTeaVisible: false,//选择听课老师的弹窗
      daoruVisible: false,//导入弹窗
      repeatVisible: false,//重复弹窗
      chosedData: [],//选择的课表数据
      selectedRowKeys: [],//选择的课程数据id
      selFileName: undefined,               //选择文件名字
      selFile: undefined,                   //选择的文件
      pointInfo: '',//提示信息 code 
      repeatTeaList: [],//重名的老师的数据
      matchList: [],//上传的数据匹配上返回的data
      uploadSign: 1,//上传成功的标志
      resSign: '',//上传的文件匹配的标识
      daoruBtn: true,//导入弹窗的确定操作
      spinning: false,//是否加载中
      selTeach: '',//选中的教研组id

      orgCode: sessionStorage.getItem('orgCode'),
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnTeasKey = this.handleOnTeasKey.bind(this);
    this.handleOnDel = this.handleOnDel.bind(this);
    this.handleGroup = this.handleGroup.bind(this);
    this.requestGroups = this.requestGroups.bind(this);
    this.requstTeachers = this.requstTeachers.bind(this);
  }

  //获取所有教研组
  requestGroups() {
    requestForListen('api/web/research_lesson/setting/get_all_research_groups', {}, function (ret) {
      if (ret.result) {
        const data = ret.data;
        data.map((item) => {
          item.perNum = item.teacherList.length;
        })
        this.setState({
          groups: data
        })
      }
    }.bind(this));
  }
  //获取所有老师
  requstTeachers() {
    requestForListen('api/web/research_lesson/setting/get_all_teachers',
      { orgId: sessionStorage.getItem("baseinfo").orgId || '' }, function (ret) {
        if (ret.result) {
          this.setState({
            teachers: ret.data,
            allPerson: ret.data
          })
        }
      }.bind(this));
  }

  //listenPerName组件的change事件
  handleOnChange(e, item) {
    // e.target.disabled = true;
    // var curData = JSON.parse(e.target.value);
    // console.log('curData', curData)
    var datalist = _.cloneDeep(this.state.checkPer);
    datalist.push(item);
    this.setState({
      checkPer: datalist
    });
    // this.props.page2Data(this.state.checkPer, 'add', curData);
  }
  //ListenSearchKey组件用于备选人员姓名首字母检索
  handleOnTeasKey(e) {
    const itemLists = [];
    const allPerson = this.state.allPerson;
    if (e.target.value) {
      for (var i = 0; i < allPerson.length; i++) {
        if (allPerson[i].nameStartChat === e.target.value) {
          itemLists.push(allPerson[i]);
        }
      }
      this.setState({
        teachers: itemLists
      });
    } else {
      this.setState({
        teachers: allPerson
      });
    }
    //请求得到的数据赋值给  personLists
    // this.setState({
    //   personLists1: this.getData(1)
    // });
  }
  //listenCheckName组件的点击删除事件
  handleOnDel(e) {
    var data = _.cloneDeep(this.state.checkPer);//初始化默认通过人员
    const curData = JSON.parse(e.currentTarget.getAttribute('data-item'));
    var warningLength = this.props.warningData.length;
    if (warningLength && e.currentTarget.getAttribute('data-warning')) {
      var num;
      if (this.state.warningLen !== -1) {
        num = this.state.warningLen - 1;
        if (num == 0) {
          this.props.cleanWarning(true);
        }
        num = num ? num : -1;
      } else {
        num = warningLength - 1;
      }
      this.setState({
        warningLen: num
      });
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].teacherId === curData.teacherId) {
        data.splice(i, 1);
        break;
      }
    };
    this.setState({
      checkPer: data
    });
    // this.props.page2Data(this.state.checkPer, 'del', curData.teacherId);
  }
  // 教研组点击事件
  handleGroup(val, key, e) {
    const defulVal = this.state.checkPer;
    var addTea = _.differenceBy(val.teacherList, defulVal, 'teacherId');
    var newCheckPer = defulVal.concat(addTea);
    this.setState({
      checkPer: newCheckPer,
      selTeach: val.id
    });
    // this.props.page2Data(newCheckPer, 'add', addTea);
  }
  componentWillMount() {
    this.requestGroups();
    this.requstTeachers();
    // this.props.page2Data(this.state.checkPer);
  }
  componentDidMount() {
    const { haveChosedData, oldDetails } = this.props
    if (oldDetails.length) {//当前为编辑状态
      let delArr = []//删除的计划数组
      let addArr = []//新增的计划数组
      //新的在原来里面找 没有的是新增的
      haveChosedData.map(item => {
        let idx = _.findIndex(oldDetails, { rcursId: item.key })
        if (idx == -1) {
          addArr.push(item.key)
        }
      })
      //编辑点击下一步过来的课程数据 将新增的teacherList变为空数组
      addArr.map(key => {
        let addItem = _.find(haveChosedData, { key })
        addItem.teacherList = []
      })
      this.setState({
        chosedData: haveChosedData
      })
    } else {//新增状态
      this.setState({
        chosedData: this.props.haveChosedData
      })
    }

  }
  /**
   * 打开听课老师弹窗 添加听课老师
   */
  addLisTea = () => {
    this.setState({
      selTeaVisible: false
    })
    const { checkPer, chosedData, selectedRowKeys } = this.state
    let copyData = _.cloneDeep(chosedData);
    selectedRowKeys.map(id => {
      let item = _.find(copyData, { key: id })
      item.teacherList = checkPer
    });
    this.setState({
      chosedData: copyData
    }, () => {
      this.props.changeHasData(copyData)
    })
  }
  /**
   * 编辑听课老师 打开选择听课老师弹窗
   */
  onEdit = (key) => {
    const { checkPer, chosedData, selectedRowKeys } = this.state
    let item = _.find(chosedData, { key })
    this.setState({
      selTeaVisible: true,
      checkPer: item.teacherList,
      selTeach: '',
      selectedRowKeys: [key]
    })
  }
  /**
   * 打开选择听课老师弹窗  或 导入听课老师弹窗 逻辑 先判断是否选择了课程
   */
  selTea = (type) => {
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length) {
      if (type == 1) {
        this.setState({
          selTeaVisible: true,
          checkPer: [],
          selTeach: ''
        })
      }
      if (type == 2) {
        this.setState({
          daoruVisible: true,
          selFileName: undefined,               //选择文件名字
          selFile: undefined,                   //选择的文件
          uploadSign: 1,
          pointInfo: ''
        })
      }
    } else {
      message.warn('请至少选择一门课程')
      return false
    }
  }
  /**
       * 下载听课列表
       */
  downLoad = () => {
    console.log(this.props.page1)
    const { selectedRowKeys, chosedData } = this.state
    let data = {}
    data.planName = this.props.page1
    data.details = []
    selectedRowKeys.map(key => {
      let item = _.find(chosedData, { key })
      let listenTeachers = []
      item.teacherList.map(t => {
        listenTeachers.push({
          id: t.teacherId,
          name: t.teacherName
        })
      })
      data.details.push({
        rcursId: key,
        teacherName: item.name,
        courseName: item.subject,
        courseTime: item.time.replace(/\s+/g, '/'),
        coursePlace: item.gradeClass,
        courseClass: item.className,
        listenTeachers
      })
    })
    request('api/web/teaching_research_plan/download_plan_excel', data, (res) => {
      var blob = new Blob([res], { type: 'application/x-xls' });
      // saveAs(blob, "巡课统计123.xlsx");
      saveAs(blob, `${this.props.page1}.xlsx`);
    }, () => { }, true)
  }
  /**
   * 导入文件选择
   */
  selFile = (e) => {
    if (e.target.files.length) {
      if (e.target.files[0].name) {
        let name = this.getFileSuffix(e.target.files[0].name)
        if (name === 'xls' || name === 'xlsx') {
          this.setState({
            selFileName: e.target.files[0].name,
            selFile: e.target.files[0],
            spinning: true,
            pointInfo: '',
            uploadSign: 1,
            daoruBtn: true
          }, () => {
            let params = {
              file: this.state.selFile
            }
            formRequest('api/web/teaching_research_plan/load_plan_excel', params, (res) => {
              if (res.result) {
                this.setState({
                  spinning: false
                }, () => {
                  if (res.code == '199') {//上传的数据存在重名的老师
                    res.data.map(item => {
                      item.sameTeachers.map(items => {
                        items.teachers.map(dt => {
                          dt.checked = false
                        })
                      })
                    })
                    this.setState({
                      repeatVisible: true,
                      pointInfo: res.message,
                      repeatTeaList: res.data,
                      uploadSign: 1,
                      resSign: 199,
                      matchList: []
                    })

                  }
                  if (res.code == "200") {//上传数据成功
                    this.setState({
                      daoruBtn: false
                    })
                    if (res.data.length) {//匹配成功 返回了数据
                      this.setState({
                        resSign: 198,
                        matchList: res.data
                      })
                    } else {  //匹配失败 未返回数据
                      this.setState({
                        resSign: 200,
                        matchList: [],
                      })
                    }
                    this.setState({
                      pointInfo: res.message,
                      uploadSign: 2,
                      repeatTeaList: [],
                    })
                  }
                })

              }
            }, () => {
              this.setState({
                spinning: false,
                pointInfo: '请上传正确的excel文件',
                uploadSign: 3,
                daoruBtn: false
              })
            })
          })
        } else {
          message.warn('请上传excel格式的文件');
        }
        this.files.value = '';
      }
    }
  }
  /**
   * 返回文件后缀
   * @param {*String} fileName 上传的文件名字
   */
  getFileSuffix = (fileName) => {
    if (typeof (fileName) === 'string' && fileName.indexOf('.') > -1) {
      let args = fileName.split('.');
      return args[args.length - 1];
    } else {
      alert('传入参数必须为文件名且不能为空且必须为字符串！');
    }
  }
  /**
   * 在重复的听课老师列表中 点击勾选听课老师
   */
  selReTea = (rcursId, id, checked) => {
    const { repeatTeaList } = this.state
    let item = _.find(repeatTeaList, { rcursId })
    item.sameTeachers.map(items => {
      items.teachers.map(dt => {
        if (dt.id == id) {
          dt.checked = !dt.checked
        }
      })
    })
    this.setState({
      repeatTeaList,
    })
  }
  /**
   * 重复的弹窗中做确定操作
   */
  onSureSel = () => {
    let selTeachers = []
    const { repeatTeaList } = this.state
    console.log(repeatTeaList)
    let n = 0
    repeatTeaList.map(item => {
      item.sameTeachers.map(items => {
        let judgeArr = []
        items.teachers.map(t => {
          judgeArr.push(t.checked)
        })
        if (judgeArr.indexOf(true) == -1) {
          n = 1
        }
      })
    })
    if (n) {
      message.warn('当前重复的教师中存在还未确认的，请进行确认', 1.5)
      return false
    } else {
      repeatTeaList.map(item => {
        item.sameTeachers.map(items => {
          items.teachers.map(dt => {
            if (dt.checked) {
              item.listenTeachers.push(dt)
            }
          })
        })
      })
      console.log(repeatTeaList)
      // console.log('selTeachers',selTeachers)
      // let arr = []
      // let set = new Set(selTeachers)
      // set.forEach((value) => { arr.push(value) })
      // console.log('arr',arr)
      // arr.map(id => {
      //   repeatTeaList.map(item => {
      //     item.sameTeachers.map(items => {
      //       items.teachers.map(dt => {
      //         if (dt.id == id) {
      //           item.listenTeachers.push(dt)
      //         }
      //       })
      //     })
      //   })
      // })
      this.setState({
        repeatTeaList,
        repeatVisible: false,
        daoruBtn: false,
        uploadSign: 2
      })
    }
  }
  /**
   * 导入听课老师的弹窗 做确定操作
   */
  onSureLis = () => {
    const { repeatTeaList, matchList, resSign, chosedData, selectedRowKeys, uploadSign } = this.state
    if (uploadSign !== 3) {
      if (resSign == 198) { //不存在重复的听课老师 且匹配上返回了数据
        selectedRowKeys.map(key => {
          let item = _.find(chosedData, { key })
          let changeItme = _.find(matchList, { rcursId: key })
          if (!changeItme) {
            message.warn('当前上传的模板中未匹配到勾选的课程数据')
          } else {
            let teacherList = []
            if (changeItme.listenTeachers && changeItme.listenTeachers.length) {
              changeItme.listenTeachers.map(items => {
                teacherList.push({
                  teacherName: items.name,
                  teacherId: items.id,
                  cardId: items.cardId
                })
                item.teacherList = teacherList
              })
            }
          }
        })
        this.setState({
          chosedData
        }, () => {
          this.props.changeHasData(chosedData)
        })
      }
      if (resSign == 199) { //存在重复的听课老师 选择了之后的数据 
        selectedRowKeys.map(key => {
          let item = _.find(chosedData, { key })
          let changeItme = _.find(repeatTeaList, { rcursId: key })
          console.log(changeItme)
          if (!changeItme) {
            message.warn('当前上传的模板中未匹配到勾选的课程数据')
          } else {
            let teacherList = []
            changeItme.listenTeachers.map(items => {
              teacherList.push({
                teacherName: items.name,
                teacherId: items.id,
                cardId: items.cardId
              })
              item.teacherList = teacherList
            })
          }
        })
        this.setState({
          chosedData
        }, () => {
          this.props.changeHasData(chosedData)
        })
      }
    }

    this.setState({
      daoruVisible: false,
      daoruBtn: true
    })
  }
  render() {
    const { selectedRowKeys, repeatTeaList, chosedData, selTeaVisible, orgCode} = this.state;
    // console.log(chosedData)
    const selLisTh = [
      {
        title: '任课老师',
        dataIndex: 'name'
      }, {
        title: '课程',
        dataIndex: 'subject'
      },
      {
        title: '上课日期',
        dataIndex: 'time'
      },
      {
        title: '地点',
        dataIndex: 'gradeClass'
      },
      {
        title: '班级',
        dataIndex: 'className'
      }, {
        title: '听课老师',
        dataIndex: 'teacherList',
        render: (text, record) => {
          if (text && text.length) {
            let arr = []
            text.map(item => {
              arr.push(item.teacherName)
            })
            return <div style={{ alignItems: 'center' }}>
              <div title={arr.join('、')}
                style={{
                  maxWidth: 340,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  marginRight: 20,
                  display: 'inline-block',
                  verticalAlign: "middle"
                }}>
                {arr.join('、')}
              </div>
              <SVG style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} type='bj' onClick={() => this.onEdit(record.key)} />
            </div>
          } else {
            return <SVG style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} type='bj' onClick={() => this.onEdit(record.key)} />
          }
        }
      }
    ]
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys })
      },
    };
    return (
      <div>
        <div className="zoe-sel-lis">
          <div className="zoe-sel-lis-header">
            <div style={{ display: 'flex' }}>
              <p className="zoe-sel-btn" style={{ marginRight: 20 }} onClick={() => this.selTea(1)}>选择听课老师</p>
              <p className="zoe-sel-btn" onClick={() => this.selTea(2)}>导入听课老师</p>
            </div>
            <p style={{ margin: 0, marginTop: 20 }}>已选&nbsp;{this.state.chosedData.length}&nbsp;节课</p>
          </div>
          <Table
            pagination={false}
            className="zoe-table"
            columns={selLisTh}
            rowSelection={rowSelection}
            dataSource={this.state.chosedData}
          />
        </div>
        {/* 选择听课老师的弹窗 */}
        {selTeaVisible ? <Modal
          className="zoe-selTeacher-modal"
          title="选择听课老师"
          visible={this.state.selTeaVisible}
          onCancel={() => this.setState({
            selTeaVisible: false
          })}
          footer={null}
        >
          <div>
            <div style={{ marginLeft: '3%', color: '#000', fontSize: 15 }}>
              {'已选课程（' + `${selectedRowKeys.length}` + '）节'}
            </div>
            {/* 左边部分 */}
            <div className='mj-lpc-nameCon' style={{ marginTop: 20 }}>
              <Tabs onChange={callback} type="card">
                {/* 教研组 */}
                <TabPane tab="教研组" key="1">
                  {
                    this.state.groups.map((item, index) => {    //教研组所有内容
                      // console.log('groups',this.state.groups)
                      const weState = [];
                      const { selTeach } = this.state;
                      // console.log('checkPer',this.state.checkPer)
                      var we = 1;
                      //循环比较教研组中是否有老师已经被选择
                      // if(_.isEqual(item.teacherList,selTeach))we=-1
                      // else we=1
                      if (item.id === selTeach) we = -1
                      else we = 1
                      // for (var i = 0, len = item.teacherList.length; i < len; i++) {   //item.teacherList 单个教研组下面的老师列表
                      //   for (var j = 0, leng = checkPer.length; j < leng; j++) {
                      //     if (item.teacherList[i].teacherId === checkPer[j].teacherId) {
                      //       we = 1;
                      //     } else {
                      //       we = -1;
                      //     }
                      //     weState.push(we);
                      //   }
                      // }
                      // console.log('weState',weState)
                      {/* for (var i = 0, len = item.teacherList.length; i < len; i++) {   //item.teacherList 单个教研组下面的老师列表
                    if (len !== 0) {
                      var we = _.findIndex(this.state.checkPer, item.teacherList[i]);  //checkPer 已选择的老师
                      weState.push(we);
                    }
                  } */}
                      // const max = Math.max.apply(null, weState);
                      // console.log('max',max)
                      if (we !== -1) {
                        return <ListenGroupName key={index} index={index} datas={item} handleGroup={this.handleGroup.bind(this)} groupCla={false}></ListenGroupName>
                      } else {
                        return <ListenGroupName key={index} index={index} datas={item} handleGroup={this.handleGroup.bind(this)} groupCla={true}></ListenGroupName>
                      }
                    })
                  }
                  <div className='mj-lpc-clear'></div>
                </TabPane>
                {/* 成员 */}
                <TabPane tab="成员" key="2">
                  <ListenSearchKey handleOnTeaKey={this.handleOnTeasKey}></ListenSearchKey>
                  {this.state.teachers.length ? <ListenPerName
                    classNa='mj-lpc-nameCon'
                    height={290}
                    data={this.state.teachers}
                    handleOnChange={this.handleOnChange}
                    checkData={this.state.checkPer}
                    curPerson=''></ListenPerName> : null}
                </TabPane>
              </Tabs>
            </div>
            {/* 图标 */}
            <div className='mj-lcc-icon'>
              {/* <i className='iconfont'>&#xe60c;</i> */}
              <SVG type='icon' />
            </div>
            {/* 右边部分 */}
            <div className='mj-lcn-nameCon' style={{ marginTop: 20 }}>
              <div className='mj-lcn-tit'>已选成员</div>

              <div className='mj-lcn-name'>
                <div>
                  <ListenCheckName data={this.state.checkPer} warningData={this.props.warningData} handleOnDel={this.handleOnDel} />
                </div>
                {
                  this.props.warningData.length !== 0
                    ?
                    <span className='mj-lcn-span'>{(this.state.warningLen !== -1) ? this.state.warningLen : this.props.warningData.length}位老师已有任务，不能再安排新任务</span>
                    :
                    <span></span>
                }
              </div>
            </div>
            {/* 清除浮动 */}
            <div style={{ clear: 'both' }}></div>
            <div className="mj-lts-btnCon">
              <Button className='mj-lts-btn' onClick={() => this.setState({ selTeaVisible: false })}>取消</Button>
              <Button className='mj-lts-next mj-lts-btn' type="primary" onClick={this.addLisTea} >确定</Button>
            </div>
          </div>
        </Modal> : null}
        {/* 导入听课老师的弹窗 */}
        <Modal
          className="zoe-daoruTeacher-modal"
          title="导入听课老师"
          visible={this.state.daoruVisible}
          onCancel={() => this.setState({
            daoruVisible: false,
            daoruBtn: true
          })}
          footer={null}
        >
          <p style={{ marginBottom: 20 }}>第&nbsp;&nbsp;<span style={{ fontSize: 25 }}>①</span>&nbsp;&nbsp;步<span style={{ color: '#ccc', marginLeft: 15 }}>请下载听课课程列表</span></p>
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <img src={excel} />
            <p onClick={this.downLoad} style={{ textDecoration: 'underline', color: '#4e9eff', margin: 0, marginLeft: 20, cursor: 'pointer' }}>下载听课列表</p>
          </div>
          <p style={{ marginBottom: 20 }}>第&nbsp;&nbsp;<span style={{ fontSize: 25 }}>②</span>&nbsp;&nbsp;步<span style={{ color: '#ccc', marginLeft: 15 }}>请将听课老师填入听课课程列表中，然后上传</span></p>
          <div style={{ display: 'flex', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: 360, height: 40, borderWidth: 1, borderRadius: 3, borderColor: '#ccc', borderStyle: 'solid', textAlign: 'center', lineHeight: '40px' }}>
              <div title={this.state.selFileName} style={{ marginLeft: 10, display: 'inlineBlock', maxWidth: 250, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{this.state.selFileName}</div>
              <Spin style={{ lineHeight: '45px', marginRight: 10 }} spinning={this.state.spinning}></Spin>
              {
                this.state.uploadSign == 2 ?
                  <div style={{ color: '#14cc8f', marginRight: 10 }}>
                    <SVG type="ok" color='#14cc8f'></SVG>
                    上传成功</div>
                  : this.state.uploadSign == 3 ?
                    <div style={{ color: '#e7931c', marginRight: 10 }}>
                      <SVG type="quxiao" color='#e7931c'></SVG>
                      上传失败</div>
                    : null
              }
            </div>
            <p
              style={{ marginLeft: 10, marginBottom: 0, width: 80, height: 40, position: 'relative', borderStyle: 'solid', borderWidth: 1, borderColor: '#ccc', borderRadius: 3, textAlign: 'center', lineHeight: '40px' }}>
              选择文件
            <input ref={(files) => this.files = files} onChange={this.selFile} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0, cursor: 'pointer' }} type='file'></input>
            </p>
          </div>
          <p style={{ marginBottom: 20, color: '#e7931c', fontSize: 13 }}>{this.state.pointInfo}</p>
          <div className="mj-lts-btnCon">
            <Button className='mj-lts-btn' onClick={() => this.setState({ daoruVisible: false, daoruBtn: true })}>放弃导入</Button>
            <Button disabled={this.state.daoruBtn} className='mj-lts-next mj-lts-btn' type="primary" onClick={this.onSureLis}>确定</Button>
          </div>
        </Modal>
        {/* 存在听课老师重名的弹窗 */}
        <Modal
          className="zoe-info-modal"
          title='提示'
          visible={this.state.repeatVisible}
          onCancel={() => this.setState({
            repeatVisible: false,
            daoruBtn: false,
            uploadSign: 3,
            pointInfo: '未进行重复的教师确认'
          })}
          footer={null}
        >
          <span style={{ color: '#ccc', fontSize: 13, position: 'absolute', top: 17, left: 70 }}>上传的听课老师列表中有重复的老师，请进行确认</span>
          <div style={{ height: 'calc(100% - 60px)' }}>
            <PerfectScrollbar>
              {
                this.state.repeatTeaList.map((item, index) => (
                  <div key={'a' + Math.random()} style={{ background: '#fff' }}>
                    <div style={{ background: '#fff', padding: '24px 24px 18px 24px' }}>
                      <div className="zoe-repeat-header">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: '#bec1c3', width: 25, height: 25, borderRadius: '50%', position: 'absolute', top: 10, left: 10 }}>0{index + 1}</div>
                        <div className="zoe-repeat-les">
                          <div className="zoe-repeat-lesName" title={item.courseName}>{item.courseName}</div>
                          <div className="zoe-repeat-teaName" title={item.teacherName}>({item.teacherName})</div>
                        </div>
                        <div className="zoe-repeat-lesdetail">
                          <p title={item.courseClass} style={{ width: '75%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.courseClass}</p>
                          <p title={item.courseTime} style={{ width: '75%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.courseTime}</p>
                          <p title={item.coursePlace} style={{ width: '75%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.coursePlace}</p>
                        </div>
                      </div>
                    </div>
                    <p style={{ paddingLeft: 24, fontSize: 16, marginBottom: 12 }}>请确认听课老师</p>
                    {
                      item.sameTeachers.map(items => (
                        <div key={'b' + Math.random()} className="zoe-repeat-selTea">
                          {
                            items.teachers.map(dt => (
                              <div key={'c' + Math.random()} className={dt.checked ? "zoe-repeat-tea-sel" : "zoe-repeat-tea"} onClick={() => this.selReTea(item.rcursId, dt.id, dt.checked)}>
                                <div style={{ width: '100%', height: 85, lineHeight: '85px', textAlign: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                                  {
                                    dt.image ?
                                      <img style={{ width: 75, height: 75 }} src={G.serverUrl + '/pic/findById/' + dt.image + "/" + orgCode}></img>
                                      :
                                      <img style={{ width: 75, height: 75 }} src={require('../../../../icon/default_head.png')}></img>
                                  }
                                </div>
                                <p style={{ display: 'flex', textAlign: 'center', padding: '0 5px' }}>
                                  <span title={dt.name} style={{ display: 'inlineBlock', width: '35%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{dt.name}</span>
                                  <span title={dt.cardId} style={{ display: 'inlineBlock', width: '65%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{dt.cardId}</span>
                                </p>
                              </div>
                            ))
                          }
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </PerfectScrollbar>
            <div className="mj-lts-btnCon">
              <Button className='mj-lts-btn' onClick={() => this.setState({ repeatVisible: false, daoruBtn: false, uploadSign: 3, pointInfo: '未进行重复的教师确认' })}>取消</Button>
              <Button className='mj-lts-next mj-lts-btn' type="primary" onClick={this.onSureSel}>确定</Button>
            </div>
          </div>
        </Modal>
      </div>

    );
  }
}

export default RePlanSlctTea;