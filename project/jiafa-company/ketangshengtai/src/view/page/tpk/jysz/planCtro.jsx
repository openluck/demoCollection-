/*
 * @Author: JudyC 
 * @Date: 2017-09-12 10:53:23 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-21 15:41:19
 */
import React, { Component } from 'react';
import { Modal, Button, Table, message, Pagination } from 'antd';
// import { Link } from 'react-router-dom';
import { NavLink, Link } from "react-router-dom";
import { ModalTip } from './../../../components/tpk/base.jsx';
import SVG from './../../../public/public-component-svg';
import { request, requestForListen } from './../../../../util/request_2.12';
import _util from './../../../../util/_util';
const {toChinese} = _util;
// const Request = util.util.request.request;
// const requestForListen = util.util.request.requestForListen
import ResearchSearch from './../../../components/tpk/researchSearch.jsx';
import ResearchClass from './../../../components/tpk/researchClass.jsx';
import './../../../../style/tpk/mj_tpkResearchPlanManage.css';
// import './../../../../../css/admin/mj_tpkResearchPlanManage.css';

export default class PlanCtro extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,    //模态框状态
      tableData: [],     //表格数据
      loading: false,      //表格加载中
      current: 1         //当前页数
    };
    this.choseKey = ''; //要查询的计划id
    this.keyword = '';  //查询关键字
    this.total = 0;     //页面总数
    this.delcon = this.delcon.bind(this);
    this.handleOk = this.handleOk.bind(this);

    this.columns = [
      {
        title: '计划名称',
        dataIndex: 'planName',
        width: '37%'
      }, {
        title: '教研员数',
        dataIndex: 'researchNumber',
        width: '14%'
      }, {
        title: '教研课程数',
        dataIndex: 'lessonNumber',
        width: '14%'
      }, {
        title: '计划持续时间',
        dataIndex: 'planTime',
        width: '24%'
      }, {
        title: '操作',
        render: (text, record) => (
          <span>
            <a className="cjy-rpm-aBox" onClick={() => this.handleShowDetail(record.key)}>
              <SVG type='ck' />
            </a>
            <Link to={`/home/tpk/jysz/jyjhgl/reAddPlan/${record.key}`} className="cjy-rpm-aBox">
              <SVG type='bj' />
            </Link>
            <a className="cjy-rpm-aBox" onClick={() => this.delcon(record.key)}>
              <SVG type='sc' />
            </a>
          </span>
        ),
        width: '11%'
      }
    ]
  };

  componentDidMount() {
    this.getData(1);
  }

  /**
   * 获取当前页数据
   * @param {Number} n 页数
   */
  getData(n) {
    this.setState({
      loading: true,
      current: n
    });
    var req = {
      pageNumber: n,
      pageSize: 20,
      keyword: this.keyword
    };
    requestForListen('api/web/research_lesson/setting/get_plan_list', req, function (ret) {
      // const ret = {
      //   message: null, result: true, total: 2,
      //   data: [
      //     { endTime: 3, id: "6ce72d27-f5a6-4d46-869b-c2eb777e9656", lessonNumber: 10, planName: "BBB", researchNumber: 2, startTime: 1 }
      //   ]
      // }
      if (ret.result) {
        this.total = ret.total;
        var planData = ret.data;
        var newTableData = [];
        planData.map((item) => {
          let sWeek = item.startTime,
            eWeek = item.endTime;
          let getWeek = (week) => {
            let chWeek;
            if (week) {
              chWeek = toChinese(week);
              if (chWeek.indexOf('一') > -1 && chWeek.indexOf('一') < 1 && chWeek !== '一') {
                chWeek = chWeek.substring(1, chWeek.length);
              }
              return chWeek;
            }
          }
          newTableData.push({
            key: item.id,
            planName: item.planName,
            researchNumber: item.researchNumber,
            lessonNumber: item.lessonNumber,
            planTime: `第${getWeek(sWeek)}周 到 第${getWeek(eWeek)}周`
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
      <div
        className="cjy-rpm-tableBox"
        ref={node => this.node = node}>
        <div className="cjy-rpm-headLine">
          <Button style={{ background: '#3498db' }} onClick={() => {
            this.props.history.push('/home/tpk/jysz/jyjhgl/reAddPlan')
          }}>
           新增教研计划
          </Button>
          <ResearchSearch
            placeholder={'教研计划：输入关键字'}
            resChange={this.resChange}
            search={this.search} />
        </div>
        <div className='cjy-trpm-table'>
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
        {
          this.state.visible
            ? <Modal
              footer={false}
              className="cjy-rpm-modal"
              visible={true}
              title="查看教研计划"
              onCancel={this.handleOk}>
              <ResearchClass choseKey={this.choseKey} />
            </Modal>
            : ''
        }
      </div>
    );
  }

  onChange(page) {
    //数据请求
    this.getData(page);
  };

  /**
 * 教研员输入框变化
 */
  resChange = (value) => {
    this.keyword = value;
  };

  /**
   * 查询按钮
   */
  search = () => {
    this.getData(1);
  }

  /**
   * 查看图标
   */
  handleShowDetail = (key) => {
    this.choseKey = key;
    this.setState({
      visible: true
    });
  };

  /**
   * 确定按钮
   */
  handleOk = () => {
    this.setState({
      visible: false,
    });
  };


  /**
   * 删除操作
   */
  delcon = (key) => {
    ModalTip({
      tit: '操作提示',
      ctn: '删除计划后，计划下的所有数据，包括点评等都将被删除，确定删除？',
      ot: '确定',
      ct: '取消',
      okFun: () => {
        var req = {
          planId: key
        }
        request('api/web/teaching_research_plan/delete_teaching_research_plan', req, function (ret) {
          if (ret.result) {
            message.success('删除成功', 2);
            this.getData(1);
          }
        }.bind(this));
      },
      canFun: () => { }
    })
  };

}