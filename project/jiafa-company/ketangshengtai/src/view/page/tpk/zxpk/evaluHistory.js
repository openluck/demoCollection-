/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-19 14:32:50
 * 听评课V2.2——历史评课
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Pagination, Table } from 'antd';
import SVG from './../../../public/public-component-svg';
import BreadCrumb from './../../../components/breadCrumb';
import { TpkBreadCrumb } from './../../../components/tpk_breadCrumb';
import noneData from './../../../../media/picture/noneData.png';
import PagePonent from './../../../components/pagePonent';
import PerfectScrollbar from "react-perfect-scrollbar";

import './../../../../style/tpk/zxpk/fyl-evaluHistory.scss';
import './../../../../style/tpk/rwgz/fyl-rwgzgrxq.scss';
import CommmonPie from './../../../components/yrj_CommonPie';
import { getHistoryHomeShow, getHistoryHome } from './../../../../redux/tpk/zxpk/evaluHistory.reducer';
const roleTxt = 'admin';
@connect(state => state.fyl_historyData, { getHistoryHomeShow, getHistoryHome })

export default class EvaluHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      semesterId: '',
    }
    this.semesterChan = this.semesterChan.bind(this);
  }
  componentDidMount() {
    // this.props.getHistoryHomeShow();
    // this.props.getHistoryHome(1);
  };

  semesterChan(id) {
    this.props.getHistoryHomeShow(id);
    this.props.getHistoryHome(1, id);
    this.setState({ semesterId: id });
  }

  render() {
    const { historyShowData, historyHomeData, total, pageIndex } = this.props;
    const { semesterId } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'evaluateNum',
        key: 'evaluateNum',
        align: 'center',
        ellipsis: true,
        width: '14%',
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
        // align: 'center',
        width: '30%',
        ellipsis: true,
      },
      {
        title: '创建者',
        dataIndex: 'creator',
        key: 'creator',
        align: 'center',
        ellipsis: true,
        width: '20%',
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
        key: 'taskType',
        align: 'center',
        ellipsis: true,
        width: '20%',
      },
      {
        title: '完成状态',
        dataIndex: 'overPlan',
        key: 'overPlan',
        align: 'center',
        width: '10%',
        render: (text, record) => (
          record && record.overPlan === 1 ?
            <SVG type='wc' style={{ height: '15px', width: '15px' }} title='已完成' /> :
            record && record.overPlan === 0 ?
              <SVG type='wwc' style={{ height: '15px', width: '15px' }} title='未完成' /> :
              null
        )
      },
      {
        title: '操作',
        key: 'caozuo',
        align: 'center',
        width: '6%',
        render: (text, record) => (
          <span
            onClick={() => this.props.history.push(`/home/tpk/zxpk/lspk/lspkxq/${record.taskId}/${record.perId}/${semesterId}`)}
            className='fyl-ckpyb' >
            {/* <SVG type='ck' style={{ height: '20px', width: '20px' }}></SVG> */}
            <SVG type='icon-chakanxq' style={{ height: '20px', width: '20px' }}></SVG>
          </span>
        ),
      },

    ];
    const title = [
      { name: '序号', id: 'evaluateNum' },
      { name: '任务名称', id: 'taskName' },
      { name: '创建者', id: 'creator' },
      { name: '任务类型', id: 'taskType' },
      { name: '完成状态', id: 'overPlan' },
      { name: '操作', id: 'caozuo' },
    ];
    return <div className='fyl-lspk'>
      <TpkBreadCrumb semesterChan={(id) => this.semesterChan(id)} />
      {/* <BreadCrumb ver='tpk' data={['在线评课', '历史评课',]} /> */}

      <div style={{ height: 'calc(100% - 40px)', padding: 16 }}>
        <div className='fyl-bxqpklj'>
          <div className='fyl-bxqbiaoti'>评课任务累计</div>
          <div className='fyl-bxqdata'>
            <div className='mj-mt-txtLine'>
              <div className='mj-mt-numCon'>
                <span>{historyShowData && historyShowData.overAllNum ? historyShowData.overAllNum : '0'}</span>
                <span>个</span>
              </div>
              <div className='mj-mt-txt'>已结束任务总数</div>
              <span className='mj-mt-line'></span>
            </div>

            <div className='mj-mt-txtLine'>
              <div className='mj-mt-numCon'>
                <span>{historyShowData && historyShowData.overTask ? historyShowData.overTask : '0'}</span>
                <span>个</span>
              </div>
              <div className='mj-mt-txt'>已完成任务</div>
              <span className='mj-mt-line'></span>
            </div>

            <div className='mj-mt-txtLine'>
              <div className='mj-mt-numCon'>
                <span>
                  {
                    historyShowData && historyShowData.percentageComplete ?
                      (historyShowData.percentageComplete * 100 === 100 ?
                        100 : (historyShowData.percentageComplete * 100).toFixed(1)) : '0'
                  }
                </span>
                <span>%</span>
              </div>
              <div className='mj-mt-txt'>任务完成率</div>
              <span className='mj-mt-line'></span>
            </div>

            <div className='mj-mt-txtLine'>
              <div className='mj-mt-numCon'>
                <span>{historyShowData && historyShowData.evaluateAllNum ? historyShowData.evaluateAllNum : '0'}</span>
                <span>个</span>
              </div>
              <div className='mj-mt-txt'>评课总次数</div>
            </div>
            {/* <div className='fyl-wanchenglv'>
              <CommmonPie
                radius={[50, 63]}
                center={("50%", "50%")}
                color={["#72b3f1", "#f0f2f5"]}
                data={
                  historyShowData && historyShowData.percentageComplete ?
                    (historyShowData.percentageComplete * 100 === 100 ?
                      100 : (historyShowData.percentageComplete * 100).toFixed(1)) : '0'
                }
                title="任务完成率"
              />
            </div>
            <div className='fyl-datarenwu'>
              <SVG type='yjs1' style={{ width: "20px", height: "20px" }}></SVG>
              <span style={{ paddingLeft: "10px" }}>
                已结束的任务总数
              <span style={{ fontSize: "20px", paddingLeft: "6px", paddingRight: '6px' }}> {historyShowData && historyShowData.overAllNum ? historyShowData.overAllNum : '0'}</span>
              条
              </span>
            </div>
            <div className='fyl-datarenwu'>
              <SVG type='ywc1' style={{ width: "20px", height: "20px" }}></SVG>
              <span style={{ paddingLeft: "10px" }}>
                完成任务
              <span style={{ fontSize: "20px", paddingLeft: "6px", paddingRight: '6px' }}> {historyShowData && historyShowData.overTask ? historyShowData.overTask : '0'}</span>
              条
              </span>
            </div>
            <div className='fyl-datarenwu'>
              <SVG type='pkcs' style={{ width: "20px", height: "20px" }}></SVG>
              <span style={{ paddingLeft: "10px" }}>
                评课总次数
              <span style={{ fontSize: "20px", paddingLeft: "6px", paddingRight: '6px' }}> {historyShowData && historyShowData.evaluateAllNum ? historyShowData.evaluateAllNum : '0'}</span>
              次
              </span>
            </div> */}
          </div>
        </div>

        {/* 任务列表 */}
        <div className='fyl-rwlb' ref={node => (this.node = node)}>
          <div className='fyl-fh'>
            <div className='fyl-pkxqwenz'>任务列表</div>
          </div>

          <div style={{ padding: '0 16px 20px', height: 'calc(100% - 40px)' }}>
            {
              historyHomeData && historyHomeData.length ?
                <div className='fyl-pkjldata'>
                  <div className='fyl-title'>
                    {
                      title.map(item => {
                        return <div key={item.id}>{item.name}</div>
                      })
                    }
                  </div>
                  <div className='fyl-table fyl-eh-ehTable'>
                    <PerfectScrollbar>
                      {
                        historyHomeData.map(item => {
                          return <div className='fyl-tableLine' key={item.taskId}>
                            <div title={item.evaluateNum}>{item.evaluateNum}</div>
                            <div title={item.taskName}>{item.taskName}</div>
                            <div title={item.creator}>{item.creator}</div>
                            <div title={item.taskType}>{item.taskType}</div>
                            <div title={item.overPlan === 1 ? '已完成' : '未完成'}>
                              {
                                item.overPlan === 1 ?
                                  <span className='mj-mt-green'>已完成</span> :
                                  <span className='mj-mt-orange'>未完成</span>
                              }
                            </div>
                            <div title={'查看'}>
                              {
                                <span className='fyl-ckpyb'
                                  onClick={() => this.props.history.push(`/home/tpk/zxpk/lspk/lspkxq/${item.taskId}/${item.perId}/${semesterId}`)}>
                                  <SVG type='ck' style={{ height: '20px', width: '20px' }}></SVG>
                                  查看
                                </span>
                              }
                            </div>
                          </div>
                        })
                      }
                    </PerfectScrollbar>
                  </div>
                  {/* <Table
                columns={columns}
                dataSource={historyHomeData}
                className='fyl-table'
                rowKey='evaluateNum'
                pagination={false}
              /> */}
                  {/* <div className='mj-ct-pagenation'>
                    <span className='mj-ct-total'>{`每页20条数据，共${total}条`}</span>
                    <Pagination
                      defaultCurrent={1}
                      total={total}
                      pageSize={20}
                      onChange={(page) => {
                        this.props.getHistoryHome(page, semesterId);
                        this.node.scrollIntoView();
                      }}
                    />
                  </div> */}
                  <div className='mj-p-pages'>
                    <PagePonent
                      pageIndex={pageIndex}
                      pageSize={20}
                      pageChan={(page) => {
                        this.props.getHistoryHome(page, semesterId);
                        this.node.scrollIntoView();
                      }}
                      len={historyHomeData && historyHomeData.length || 0}
                      total={total} />
                  </div>
                </div> :
                <div className='mj-rxq-noneData'>
                  <img src={noneData} />
                  <div>暂无数据</div>
                </div>
            }
          </div>
        </div>
      </div>
    </div>;
  }
}
