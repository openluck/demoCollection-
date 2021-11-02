/*
 * @Author: JC.Liu
 * @Date: 2017-09-12 10:54:38 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 16:35:38
 */
import React, { Component } from 'react';
import { Button, Table, Modal, message, Pagination } from 'antd';
import { SVG, ModalTip } from './../../../components/tpk/base.jsx';
import { request, requestForListen } from './../../../../util/request_2.12';
// import util from './../../../../../js/_x/index.js';
// const Request = util.util.request.request;
import ReModGroup from './../../../components/tpk/reModGroup.jsx';
import './../../../../style/tpk/mj_tpkResearchGroupManage.css';
// const requestForListen = util.util.request.requestForListen

export default class GroupCtro extends Component {
  constructor() {
    super();
    this.total = 0;         //页数总数
    this.state = {
      visible: false,       //模态框显示
      tableData: [],         //表格数据
      checked: [],           //选中的老师
      reGroupName: '',       //教研组名
      note: '',               //备注
      loading: false,      //表格加载中
      current: 1
    };
    this.groupId = '';      //教研组Id
    this.oprt = '';         //当前操作
    this.handleData = this.handleData.bind(this);
    this.submitData = this.submitData.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.modGroup = this.modGroup.bind(this);
    this.delcon = this.delcon.bind(this);
    this.judgeRepeat = this.judgeRepeat.bind(this);
    this.columns = [{
      title: '教研组',
      dataIndex: 'groupName',
      key: 'groupName',
      width: '23%',
      render: (text) => (
        <span title={text} className='cjy-trgm-planName'>{text}</span>
      )
    }, {
      title: '组成员',
      dataIndex: 'groupMember',
      key: 'groupMember',
      width: '34%',
      render: (text) => (
        <span title={text} className='cjy-trgm-perCon'>{text}</span>
      )
    }, {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      width: '34%',
      render: (text) => (
        <span title={text} className='cjy-trgm-note'>{text}</span>
      )
    }, {
      title: '操作',
      key: 'caozuo',
      width: '9%',
      render: (text, record) => (
        <div className="zoe-cjy-rgm-aBox-action">
          <p className="cjy-rgm-aBox" onClick={() => this.modGroup(record.key)}>
            <SVG type='bj' />
          </p>
          <p className="cjy-rgm-aBox" onClick={() => this.delcon(record.key)}>
            <SVG type='sc' />
          </p>
        </div>
      ),
    }]
  };

  componentDidMount() {
    this.getData(1);
  };

  /**
   * 获取表格数据
   */
  getData(n) {
    this.setState({
      loading: true,
      current: n
    });
    var req = {
      pageNumber: n,
      pageSize: 20
    };
    requestForListen('api/web/teacher_group/get', req, function (ret) {
      // let ret = {
      //   result: true,
      //   data: [{ groupName: "是的", teacherNameList: "尼古拉斯二", id: "205187b7-eea1-4127-bd51-7e6dbf58cdd1", mark: "" }],
      //   total: 0
      // }
      if (ret.result) {
        this.total = ret.total;
        var groupData = ret.data;
        //重新构造表格数据
        var newTableData = [];
        groupData.map((item) => {
          var groupMember = '';
          if (item.teacherNameList) {
            var teaList = item.teacherNameList.split(',');
            teaList.map(item => {
              groupMember += item + '/'
            });
            groupMember = groupMember.substring(0, groupMember.length - 1);  //删除最后一根拼接斜线
          } else {
            groupMember = '';
          }
          newTableData.push({
            key: item.id,
            groupName: item.groupName,
            groupMember: groupMember,
            note: item.mark
          });
        });
        this.setState({
          tableData: newTableData
        });
      } else {
        message.info(ret.message, 2);
      }
      this.setState({
        loading: false
      });
    }.bind(this));
  };

  render() {
    // 分页样式
    function itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>;
      } else if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    }
    return (
      <div className="cjy-rgm-tableBox" ref={node => this.node = node}>
        <div className="cjy-rgm-headLine">
          <Button onClick={this.addGroup}>新增教研组</Button>
          {this.state.visible ? <Modal
            className="cjy-rgm-modal"
            footer={[
              <Button key='sure' type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={this.handleOk}>保 存</Button>,
              <Button key='ohno' type="button" className="ant-btn ant-btn-lg" onClick={this.handleCancel}>取 消</Button>
            ]}
            title={this.oprt}
            visible={this.state.visible}
            onCancel={this.handleCancel}>
            <ReModGroup
              checkData={this.state.checked}
              reGroupName={this.state.reGroupName}
              note={this.state.note}
              handleData={this.handleData}
              ref="clearChild" />
          </Modal> : null}
        </div>
        <div className='cjy-trgm-table'>
          <Table
            pagination={false}
            loading={this.state.loading}
            columns={this.columns}
            dataSource={this.state.tableData}
          />
          <div className='ll-buttom'>
            <span className='ll-buttomSpan'>
              {`每页20条数据，共${this.total}条`}
            </span>
            <Pagination
              defaultCurrent={1}
              total={this.total}
              className='ll-PageStyle ll-Pg'
              itemRender={itemRender}
              pageSize={20}
              current={this.state.current}
              onChange={(page) => {
                this.onChange(page);
                this.node.scrollIntoView();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  onChange(page) {
    //数据请求
    this.getData(page);
  };

  /**
   * 新增教研组按钮
   */
  addGroup = () => {
    this.oprt = '新增教研组';
    this.setState({
      visible: true
    });
    this.groupId = '';
  };

  /**
   * 修改教研组
   */
  modGroup = (value) => {
    this.oprt = '修改教研组';
    this.groupId = value;
    this.getGroupData();
  }

  /**
   * 获取教研组信息
   */
  getGroupData() {
    var req = {
      id: this.groupId
    }
    request('api/web/teacher_group/get_one', req, function (ret) {
      // let ret = {
      //   result: true,
      //   data: {
      //     teacherList: [],
      //     groupName: [],
      //     mark: ''
      //   }
      // }
      if (ret.result) {
        var checked = [];
        if (ret.data.teacherList) {
          var teacherList = ret.data.teacherList;
          teacherList.map((item) => {
            checked.push({
              teacherName: item.teacherName,
              teacherId: item.teacherId
            });
          });
        };
        this.setState({
          reGroupName: ret.data.groupName,
          checked: checked,
          note: ret.data.mark,
          visible: true
        });
      };
    }.bind(this));
  }

  /**
   * 提示框确定按钮
   */
  handleOk = () => {
    //判断是否填写教研组名称和选择教研组组员
    var val = this.state.reGroupName.trim();
    if (val === '') {
      message.info('请填写教研组名称', 2);
      this.setState({ reGroupName: val });
    } else if (this.state.checked.length === 0) {
      message.info('请选择教研组组员', 2);
    } else {
      this.judgeRepeat();
    }
  };

  /**
   * 判断教研组名是否重复
   */
  judgeRepeat() {
    var req = {
      name: this.state.reGroupName,
      id: this.groupId
    }
    request('api/web/teacher_group/check_name', req, function (ret) {
      // let ret = {
      //   data: { flag: false },
      //   message: null,
      //   result: true,
      // }
      if (ret.result) {
        if (ret.data.flag) {
          message.info('教研组名称重复', 2);
        } else {
          this.setState({
            visible: false,
          });
          this.submitData();
        }
      }
    }.bind(this));
  }

  /**
   * 提交所填信息
   */
  submitData() {
    var teacherList = [];
    this.state.checked.map((item) => {
      teacherList.push({ teacherId: item.teacherId });
    });
    var req = {
      groupName: this.state.reGroupName,//教研组名称
      id: this.groupId,//如果更新带上更新的字段id
      teacherList: teacherList,//教研组中的教师id集合(update)
      mark: this.state.note,//备注
    }
    requestForListen('api/web/teacher_group/save_or_update', req, function (ret) {
      // let ret = {
      //   data: null,
      //   message: null,
      //   result: true,
      // }
      if (ret.result) {
        message.success('保存成功', 2);
        this.getData(1);
        this.handleCancel();
      }
    }.bind(this));
  }

  /**
   * 取消按钮清除弹出框组件中内容
   */
  handleCancel = () => {
    this.setState({
      visible: false,
      checked: [],
      reGroupName: '',
      note: ''
    });
  };

  /**
   * 删除按钮
   */
  delcon = (keyValue) => {
    ModalTip({
      tit: '操作提示',
      ctn: '删除后教研组将会自动解散，确定删除？',
      ot: '确定',
      ct: '取消',
      okFun: () => {
        var req = {
          id: keyValue
        }
        request('api/web/teacher_group/delete', req, function (ret) {
          if (ret.result) {
            message.success('删除成功', 2);
            this.getData(1);
          }
        }.bind(this));
      },
      canFun: () => { }
    })
  };

  /**
   * 子组件提交上来的数据
   * tea表示提交的选中教师
   * groupName表示提交的教研组名
   * note表示提交的备注
   */
  handleData(dataType, value) {
    if (dataType === 'tea') {
      this.setState({
        checked: value
      });
    } else if (dataType === 'groupName') {
      this.setState({
        reGroupName: value
      });
    } else if (dataType === 'note') {
      this.setState({
        note: value
      })
    }
  };

}