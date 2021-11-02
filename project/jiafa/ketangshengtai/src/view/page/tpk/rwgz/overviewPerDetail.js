/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-16 13:40:59
 * 听评课V2.2——任务进度个人详情
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PerfectScrollbar from "react-perfect-scrollbar";
import { BreadPonent } from './../../../components/topPonent';
import noneData from './../../../../media/picture/noneData.png';
import PagePonent from './../../../components/pagePonent';

import './../../../../style/tpk/rwgz/fyl-rwgzgrxq.scss';
import { Table, Divider, Tag, Pagination, Button, } from 'antd';
import { getdetaData, getRecordData } from './../../../../redux/tpk/rwgz/fyl-resukltPerDetail.reducer';
@connect(state => state.fyl_resultReducer, { getdetaData, getRecordData })

export default class OverviewPerDetail extends Component {
  constructor(props) {
    super(props)
    this.getPageIndex = this.getPageIndex.bind(this);
  }
  componentDidMount() {
    let evaClassId = this.props.match.params.perId;
    let jobId = this.props.match.params.jobId;
    this.props.getdetaData(evaClassId, jobId, 1);
    this.props.getRecordData(evaClassId, jobId, 1, 1)
  }
  getPageIndex(page) {
    let evaClassId = this.props.match.params.perId;
    let jobId = this.props.match.params.jobId;
    this.props.getRecordData(evaClassId, jobId, page, 1)
  }
  render() {
    let evaClassId = this.props.match.params.perId;
    const columns = [
      {
        title: '序号',
        dataIndex: 'evaluateNum',
        key: 'evaluateNum',
        // align: 'center',
        width: '6%',
        ellipsis: true,

      },
      {
        title: '开课院系',
        dataIndex: 'schoolName',
        key: 'schoolName',
        // align: 'center',
        width: '14%',
        ellipsis: true,
      },
      {
        title: '课程名称',
        dataIndex: 'studyName',
        key: 'studyName',
        // align: 'center',
        width: '19%',
        ellipsis: true,
      },
      {
        title: '课程类型',
        dataIndex: 'studyType',
        key: 'studyType',
        align: 'center',
        width: '8%',
        ellipsis: true,
        // render: (txt) => {
        //   return <span>
        //     {
        //       txt === '1' ? '公共基础' :
        //         txt === '2' ? '公共选修' :
        //           txt === '3' ? '专业基础' : '专业选修'
        //     }
        //   </span>
        // }
      },
      {
        title: '教师',
        dataIndex: 'teacher',
        key: 'teacher',
        // align: 'center',
        width: '14%',
        ellipsis: true,
      },
      {
        title: '节次',
        dataIndex: 'classNum',
        key: 'classNum',
        // align: 'center',
        width: '13%',
        ellipsis: true,
      },
      {
        title: '评课时间',
        dataIndex: 'evaluateTime',
        key: 'evaluateTime',
        align: 'center',
        width: '12%',
        ellipsis: true,
        render: (text, record) => (
          <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        title: '总体评价',
        dataIndex: 'evaluateAll',
        key: 'evaluateAll',
        align: 'center',
        width: '6%',
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'caozuo',
        align: 'center',
        width: '8%',
        render: (text, record) => (
          <span
            className='fyl-ckpybwz'
            onClick={() => this.props.history.push(`/home/tpk/video/${record.studyId}/${record.jobId}/${evaClassId}/${record.classId}`)}>
            查看评议表
          </span>//人员id、任务id、课程id
        ),
      },

    ]
    const { detailsList, recordList, total, pageIndex } = this.props;
    return <div className='fyl-grxq' ref={node => (this.node = node)}>
      <BreadPonent pages={['任务进度', '任务详情', '评课详情']} />

      <div className='mj-opd-content'>
        <div className='fyl-pkxq'>
          <div className='fyl-fh'>
            <div className='fyl-pkxqwenz'>
              {/* <div className='fyl-hk'>          </div> */}
              评课详情
            </div>
            {/* <Button onClick={() => this.props.history.goBack()} className='fyl-fhButton'>返回 </Button> */}
          </div>
          <div>
            <div>
              <div className='fyl-tkr'>
                <div className='fyl-yq'>听课人 : </div>
                {`${detailsList && detailsList.listen ? detailsList.listen : '-'}`}
              </div>
              <div className='fyl-ssrw' title={detailsList && detailsList.task ? detailsList.task : '-'}>
                <div className='fyl-yq'>所属任务 : </div>
                {`${detailsList && detailsList.task ? detailsList.task : '-'}`}
              </div>
              <div className='fyl-cs'>
                <div className='fyl-yq'>最低评课次数 : </div>
                {`${detailsList && detailsList.mixDegree ? detailsList.mixDegree : '0'} 次`}
              </div>
              <div className='fyl-zdcs'>
                <div className='fyl-yq'>指定课程最低次数 : </div>
                {`${detailsList && detailsList.assignDegree ? detailsList.assignDegree : '0'} 次`}
              </div>
            </div>
          </div>
        </div>

        <div className='fyl-pkjl'>
          <div className='fyl-fh'>
            <div className='fyl-pkxqwenz'>
              {/* <div className='fyl-hk'></div> */}
              评课记录
            </div>
          </div>
          <div style={{ padding: '0 16px', height: 'calc(100% - 40px)' }}>
            {
              recordList && recordList.length ?
                <div className='fyl-pkjldata'>
                  <div className='mj-opd-tableCon'>
                    <PerfectScrollbar>
                      <Table
                        columns={columns}
                        dataSource={recordList}
                        className='fyl-table mj-opd-table'
                        rowKey='evaluateNum'
                        pagination={false}
                      />
                    </PerfectScrollbar>
                  </div>
                  {/* <div className='mj-ct-pagenation'>
                    <span className='mj-ct-total'>{`每页20条数据，共${total}条`}</span>
                    <Pagination
                      defaultCurrent={1}
                      total={total}
                      pageSize={20}
                      onChange={(page) => {
                        this.node.scrollIntoView();
                        this.getPageIndex(page)
                      }}
                    />
                  </div> */}
                  <div className='mj-p-pages'>
                    <PagePonent
                      pageIndex={pageIndex}
                      pageSize={20}
                      pageChan={(page) => {
                        this.node.scrollIntoView();
                        this.getPageIndex(page)
                      }}
                      len={recordList && recordList.length || 0}
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
      </div >
    </div >;
  }
}
