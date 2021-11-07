/*
 * @Author: Minj 
 * @Date: 2017-09-11 10:27:54 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-22 18:31:44
 * 听评课-管理员部分-随堂设置-听课员任务指标设置
 */
import React, { Component } from 'react';
import { Input, Button, Table, Icon, Select, Popconfirm, Modal, message, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { SVG, ModalTip } from './../../../components/tpk/base.jsx';
import { request, requestForListen } from './../../../../util/request_2.12';
// import util from './../../../../../js/_x/index.js'
// const Request = util.util.request.request;
// const requestForListen = util.util.request.requestForListen

// import TpkManaNewTask from './tpkManaNewTask';
import ListenTaskDetail from './../../../components/tpk/listenTaskDetail.jsx';
import './../../../../style/tpk/mj_listenerOverTab.css';

export default class TargetSetting extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],   //表格数据
      visible: false,   //Modal是否出现
      clickData: {},    //表格一行的所有内容
      total: 0,    //表格数据总数
      loading: true,
      current: 1
    };

    this.requestTab = this.requestTab.bind(this);
    this.handleShowDetail = this.handleShowDetail.bind(this);
    this.delcon = this.delcon.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  //表格数据请求
  requestTab(pages) {
    requestForListen('api/web/listenJob/listen_mission_setting', {
      'pageSize': 20,
      'curPage': pages
    }, function (ret) {
      if (ret.result) {
        const data = ret.data;
        // const data = [
        //   {
        //     frequency: "7", planCnt: "1", planId: "7f5c84b9-c374-4247-ba1c-b6edaa00970c", planName: "huhulklk",
        //     teachIds: [{ teacherId: "2018050", teacherName: "牛头梗" }, { teacherId: "2018033", teacherName: "尼古拉斯一" },]
        //   }
        // ];
        var tabData = [];
        data.map((item, index) => {
          var nameList = '';
          var freque = '';
          if (item.frequency === '7') {
            freque = '每周';
          } else if (item.frequency === '30') {
            freque = '每月';
          } else {
            freque = '每学期';
          }
          for (var i = 0, len = item.teachIds.length; i < len; i++) {
            nameList = nameList + '/' + item.teachIds[i].teacherName;
          }
          nameList = nameList.slice(1);

          tabData.push({
            frequency: freque,
            planCnt: item.planCnt,
            planId: item.planId,
            planName: item.planName,
            nameList: nameList,   //字符串形式
            personList: item.teachIds,    //数组形式
            key: index,
            total: item.teachIds.length
          })
        })

        this.setState({
          dataSource: tabData,
          // total: 1,
          total: ret.total,
          loading: false
        });
      }
    }.bind(this));
  };
  componentDidMount() {
    this.requestTab(1);
  };

  //点击查看详情
  handleShowDetail(val) {
    this.setState({
      visible: true,
      clickData: val
    });
  };
  handleOk() {
    this.setState({
      visible: false,
    });
  };

  // 删除按钮
  delcon = (record) => {
    ModalTip({
      tit: '删除',
      ctn: '确定删除？',
      ot: '确定',
      ct: '取消',
      okFun: () => {
        request('api/web/listenJob/listen_mission_setting_delete', {
          'planId': record.planId
        }, function (ret) {
          if (ret.result) {
            message.success('删除成功', 2);
            this.requestTab(1);
          }
        }.bind(this));
      },
      canFun: () => { }
    })
  };
  //改变页码
  pageChange(page, pageSize) {
    this.setState({
      loading: true,
      curPage: page,
      current: page
    });
    this.requestTab(page);
  }


  render() {
    function itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>;
      } else if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    }
    // table表头
    const columns = [
      {
        title: '指标名',
        dataIndex: 'planName',
        key: 'planId',
        width: '22%',
        render: (text) => (
          <span className='mj-tmts-overName' title={text}>{text}</span>
        )
      }, {
        title: '计划频率',
        dataIndex: 'frequency',
        width: '13%'
      }, {
        title: '计划次数',
        dataIndex: 'planCnt',
        width: '17%',
        render: (text) => (
          <span>{text}次</span>
        )
      }, {
        title: '涉及人员',
        dataIndex: 'nameList',
        width: '34%',
        render: (text, render) => (
          text.length > 28
            ?
            <div className='mj-tmts-overflowall'>
              <div>
                <span className='mj-tmts-overflow' title={text}>{text}</span>
                <span className='mj-tmts-total'>(共{render.total}人)</span>
              </div>

            </div>
            :
            <span className='mj-tmts-noverflow' title={text}>{text}</span>
        )
      }, {
        title: '操作项',
        key: 'action',
        width: '14%',
        render: (text, record) => (
          <span>
            <SVG type='ck' onClick={() => this.handleShowDetail(record)}
              style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} />
            <Link to={{ pathname: '/home/tpk/sttsz/tkyrwzbsz/TpkManaNewTask', state: record }}>
              <SVG type='bj' style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} />
            </Link>
            <SVG type='sc' onClick={() => this.delcon(record)}
              style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} />
          </span>
        ),
      }
    ];

    const modalData = this.state.clickData;
    var perList = `${modalData.teachNames}`;
    perList = perList.split("/");

    return (
      <div className='mj-lot-tabCon'>
        {/* 新增 */}
        <div className='mj-lot-operate mj-tmlts-operate'>
          <Link to={'/home/tpk/sttsz/tkyrwzbsz/TpkManaNewTask'}>
            <Button type="primary" className='mj-tmts-btn'>新增任务指标</Button>
          </Link>
        </div>

        {/* 表格 */}
        <div className='mj-lot-tab'>
          <Table
            columns={columns}
            loading={this.state.loading}
            dataSource={this.state.dataSource}
            pagination={false}
          />
          <div className='ll-buttom'>
            <span className='ll-buttomSpan'>
              {`每页20条数据，共${this.state.total}条`}
            </span>
            <Pagination
              current={this.state.current}
              total={this.state.total}
              className='ll-PageStyle ll-Pg'
              itemRender={itemRender}
              // disabled={this.state.total <= 20}
              pageSize={20}

              onChange={(page) => this.pageChange(page)}
            />
          </div>
        </div>

        <Modal
          className='mj-lts-modalCon'
          title={this.state.clickData.planName}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          okText="关闭">
          <ListenTaskDetail
            sele={this.state.clickData.frequency}
            freque={this.state.clickData.planCnt}
            perList={this.state.clickData.personList}></ListenTaskDetail>
        </Modal>
      </div>
    );
  }
}