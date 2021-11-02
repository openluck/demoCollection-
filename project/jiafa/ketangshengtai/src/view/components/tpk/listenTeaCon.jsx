/*
 * @Author: zhengqi 
 * @Date: 2017-09-14 17:30:30 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 09:49:41
 * 听评课-管理员部分-随堂设置-授课员审批权限设置-老师课程权限设置
 */
import React, { Component } from 'react';
import { Row, Col, Button, notification, message } from 'antd';
import _ from 'lodash';
import { SVG } from './../../components/tpk/base.jsx';
import { request, requestMultiple } from './../../../util/request_2.12';
// import util from './../../../../js/_x/index.js';
// const Request = util.util.request.request;
// const RequestMultiple = util.util.request.requestMultiple;
import ListenPerName from './listenPerName.jsx';
import ListenHandelPerson from './listenHandelPerson.jsx';
import ListenSearchKey from './listenSearchKey.jsx';
import ListenCheckName from './listenCheckName.jsx';
import './../../../style/tpk/mj_listenTeaCon.css';

class ListenTeaCon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personList: [],//设置权限所属教师（初始化值不变）
      allList: [],//全部教师（初始化值不变）
      personLists: [],//设置权限所属教师
      allLists: [],//全部教师
      personIndex: 0,
      checkData: [],//默认通过人员
      curPerson: {},//当前被设置人员
    };
    this.initChoose = [];//最初数据里选中老师的默认关联人员
    this.handleOntTea = this.handleOntTea.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnDel = this.handleOnDel.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  /**
   * 权限所属老师 
   */
  //ListenSearchKey组件用于老师姓名首字母检索
  handleOnTeaKey(flag, e) {
    clearInterval(this.timer);
    var itemLists = [];
    var baseData = flag ? this.state.allList : this.state.personList;
    if (e.target.value) {
      for (var i = 0; i < baseData.length; i++) {
        if ((flag ? baseData[i].nameStartChat : baseData[i].firstLetter) === e.target.value) {
          itemLists.push(baseData[i]);
        }
      }
      if (flag) {
        this.setState({
          allLists: itemLists
        });
      } else {
        this.getData(false);
        this.setState({
          personLists: itemLists,
          curPerson: itemLists[0],
          checkData: itemLists.length ? itemLists[0].relaTeachers : []
        });
        if (itemLists.length) {
          this.initChoose = [];
          itemLists[0].relaTeachers.map(item => {
            if (this.initChoose.indexOf(item.teacherId) === -1) {
              this.initChoose.push(item.teacherId);
            }
          });
        } else {
          this.initChoose = [];
        }
      }
    } else {
      if (flag) {
        this.setState({
          allLists: this.state.allList
        });
      } else {
        this.getData(false);
        this.setState({
          personLists: this.state.personList,
          curPerson: this.state.personList[0],
          checkData: this.state.personList.length ? this.state.personList[0].relaTeachers : []
        });
        if (this.state.personList.length) {
          this.initChoose = [];
          this.state.personList[0].relaTeachers.map(item => {
            if (this.initChoose.indexOf(item.teacherId) === -1) {
              this.initChoose.push(item.teacherId);
            }
          });
        } else {
          this.initChoose = [];
        }
      }
    }
  }

  //ListenHandelPerson组件--老师切换（提交数据+显示初始化默认通过人员）
  handleOntTea(e, item) {
    this.getData(false);
    //根据点击的老师得到他原本的默认通过人员  ---赋值给  checkData
    // var checked = e.target.datai;
    var checked = item;

    this.setState({
      checkData: checked.relaTeachers,
      curPerson: checked
    });
    this.initChoose = [];
    checked.relaTeachers.map(item => {
      if (this.initChoose.indexOf(item.teacherId) === -1) {
        this.initChoose.push(item.teacherId);
      }
    });
  }

  /**
  * 选择默认通过人员
  */

  //listenCheckName组件的点击删除事件
  handleOnDel(e) {
    var data = this.state.checkData;//初始化默认通过人员
    const curData = JSON.parse(e.currentTarget.getAttribute('data-item'));
    for (var i = 0; i < data.length; i++) {
      if (data[i].teacherId === curData.teacherId) {
        data.splice(i, 1);
        break;
      }
    };
    this.setState({
      checkData: data
    });
  }

  //listenPerName组件的change事件
  handleOnChange(e, item) {
    // e.target.disabled = true;
    // var curData = JSON.parse(e.target.value);
    var datalist = this.state.checkData;
    datalist.push(item);
    this.setState({
      checkData: datalist
    });
  }

  /*保存按钮*/
  handleOnClick() {
    this.getData(true);
    this.initChoose = [];
    this.state.checkData.map(item => {
      if (this.initChoose.indexOf(item.teacherId) === -1) {
        this.initChoose.push(item.teacherId);
      }
    });
  }

  //提交数据
  getData(flag) {
    var stringIds = [];
    var checkDatas = this.state.checkData;//当前权限老师默认人员的最终数据
    for (var i = 0; i < checkDatas.length; i++) {
      if (stringIds.indexOf(checkDatas[i].teacherId) === -1) {
        stringIds.push(checkDatas[i].teacherId);
      }
    }
    var flag1 = false;
    stringIds.sort();
    this.initChoose.sort();
    for (var i = 0; i < (stringIds.length > this.initChoose.length ? stringIds.length : this.initChoose.length); i++) {
      if (this.initChoose[i] !== stringIds[i]) {
        flag1 = true;
        break;
      }
    }
    if (flag1) {
      request('api/web/listenJob/listen_auth_setting_update',
        { autoAuth: 1, teacherId: this.state.curPerson.teacherId, listenTeacherId: stringIds.join(",") },
        (ret) => {
          // let ret = { data: "", message: "更新成功", result: true, total: 0, }
          if (ret.result) {
            if (flag) {
              message.success('数据保存成功', 2);
            } else {
              this.openNotificationWithIcon('success', '数据保存成功');
            }
          } else {
            if (flag) {
              message.error(ret.message, 2);
            } else {
              this.openNotificationWithIcon('error', ret.message);
            }
          }
        });
    } else {
      if (flag) {
        message.warning('数据未作任何修改', 2);
      }
    }
  }

  //提示信息
  openNotificationWithIcon = (type, info) => {
    notification[type]({
      duration: 3,
      placement: 'bottomLeft',
      // message: message ? message : this.state.curPerson.teacherName + '老师数据保存成功',
      message: info ? info : '数据保存成功',
      description: '当你切换至下一个老师时，上一个老师的数据会自动保存',
    });
  };


  //组件加载完毕后获取初始化数据
  componentDidMount() {
    const _this = this;
    requestMultiple([{
      method: 'api/web/listenJob/listen_auth_setting_teachers',
      success: (ret => {
        if (ret.result) {
          if (this._isMounted) {
            if (ret.data.length) {
              ret.data[0].relaTeachers.map(item => {
                this.initChoose.push(item.teacherId);
              });
            }
            this.setState({
              personList: ret.data,
              personLists: ret.data,
              checkData: ret.data.length ? ret.data[0].relaTeachers : [],
              curPerson: ret.data.length ? ret.data[0] : {}
            });
          }
        }
      })
    }, {
      method: 'api/web/research_lesson/setting/get_all_teachers',
      params: { orgId: sessionStorage.getItem("baseinfo").orgId || '' },
      success: (ret => {
        if (ret.result) {
          if (this._isMounted) {
            this.setState({
              allList: ret.data,
              allLists: ret.data
            });
          }
        }

      })
    }], function (res1, res2) {
      // if (res1.data.result) {
      //   if (_this._isMounted) {
      //     const ret = res1.data;
      //     if (ret.data.length) {
      //       ret.data[0].relaTeachers.map(item => {
      //         _this.initChoose.push(item.teacherId);
      //       });
      //     }
      //     _this.setState({
      //       personList: ret.data,
      //       personLists: ret.data,
      //       checkData: ret.data.length ? ret.data[0].relaTeachers : [],
      //       curPerson: ret.data.length ? ret.data[0] : {}
      //     }, () => {
      //       _this.timer = setTimeout(() => {
      //         const ret1 = res2.data;
      //         if (ret1.result) {
      //           if (_this._isMounted) {
      //             _this.setState({
      //               allList: ret1.data,
      //               allLists: ret1.data
      //             });
      //           }
      //         }
      //       }, 20);
      //     });
      //   }
      // }
    });
  };

  componentWillMount() {
    this._isMounted = true;
  };
  componentWillUnmount() {
    this._isMounted = false;
  };

  render() {
    // console.log(new Date() - dt)
    // console.log(111,this.state.personLists)
    return (
      <div>
        <Row>
          <Col span={10}>
            <div className='zq-lpc-container'>
              <p>权限所属老师</p>
              <ListenSearchKey handleOnTeaKey={this.handleOnTeaKey.bind(this, false)} />
              {
                this.state.personLists.length ?
                  <ListenHandelPerson
                    classNa='zq-lpn-perName'
                    handleOntTea={this.handleOntTea}
                    perLists={this.state.personLists}
                    curPerson={this.state.curPerson} />
                  : null
              }
            </div >
          </Col>
          <Col span={3} className='zq-ltc-next'><SVG type='jt1' /></Col>
          <Col span={10}>
            <div className='zq-lpc-container'>
              <div className='zq-ltc-tit'>
                <span>选择默认通过人员</span>
                <div className='zq-ltc-choseInfo'>已选<span className='zq-ltc-choseteacherId'>{this.state.checkData.length}</span>人</div>
              </div>
              {/* 人员里若有任务的老师--warningData是由这些老师id组成的数组，若无则传一个空数组 */}
              <ListenCheckName data={this.state.checkData} handleOnDel={this.handleOnDel} warningData={[]} />
              <div className='zq-ltc-perName'>
                <ListenSearchKey handleOnTeaKey={this.handleOnTeaKey.bind(this, true)} />
                {/* data用于循环(已有的数据)   handleOnChange函数    checkData已经选择了的  curPerson当前被设置的老师(没有的赋值'')*/}
                <ListenPerName
                  classNa='zq-ltc-perName'
                  height={160}
                  data={this.state.allLists}
                  handleOnChange={this.handleOnChange}
                  checkData={this.state.checkData}
                  curPerson={this.state.curPerson} />
              </div>
            </div>
          </Col>
        </Row>
        <div className='zq-ltc-btn'>
          <Button type="primary" onClick={this.handleOnClick}>保存</Button>
        </div>
      </div>
    );
  }
}

export default ListenTeaCon;
