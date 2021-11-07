/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-18 16:38:02
 * 听评课V2.2——任务结果个人详情
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Divider, Tag, Pagination, Button, } from 'antd';
import noneData from './../../../../media/picture/noneData.png';
import { BreadPonent } from './../../../components/topPonent';
import PagePonent from './../../../components/pagePonent';

import BreadCrumb from './../../../components/breadCrumb';
import './../../../../style/tpk/rwgz/fyl-rwgzgrxq.scss';
import { getdetaData, getRecordData } from './../../../../redux/tpk/rwgz/fyl-resukltPerDetail.reducer';
import moment from 'moment';

@connect(state => state.fyl_resultReducer, { getdetaData, getRecordData })
export default class ResultPerDetail extends Component {
  constructor(props) {
    super(props)
    this.getPageIndex = this.getPageIndex.bind(this);
  }
  componentDidMount() {
    let evaClassId = this.props.match.params.perId;
    let jobId = this.props.match.params.jobId;
    this.props.getdetaData(evaClassId, jobId, 2);
    this.props.getRecordData(evaClassId, jobId, 1, 2)
  }

  getPageIndex(page) {
    let evaClassId = this.props.match.params.perId;
    let jobId = this.props.match.params.jobId;
    this.props.getRecordData(evaClassId, jobId, page, 2)
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
        render: (txt) => {
          return <span>
            {
              txt === '1' ? '公共基础' :
                txt === '2' ? '公共选修' :
                  txt === '3' ? '专业基础' : '专业选修'
            }
          </span>
        }
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
          <span className='fyl-ckpybwz' onClick={() => this.props.history.push(`/home/tpk/video/${record.studyId}/${record.jobId}/${evaClassId}/${record.classId}`)}>查看评议表</span>//人员id、任务id、课程id
        ),
      },

    ]
    const { detailsList, recordList, total } = this.props;
    // console.log(recordList);

    return <div className='fyl-grxq' ref={node => (this.node = node)}>
      <BreadPonent pages={['任务概览', '任务详情', '个人详情']} />

      <div className='mj-rpd-content'>
        <div className='fyl-pkxq'>
          <div className='fyl-fh'>
            <div className='fyl-pkxqwenz'><div className='fyl-hk'></div>评课详情</div>
            <Button onClick={() => this.props.history.goBack()} className='fyl-fhButton'>返回 </Button>
          </div>
          <div>
            <div>
              <div className='fyl-tkr'>
                <div className='fyl-yq'></div>
                {`听课人 : ${detailsList && detailsList.listen ? detailsList.listen : '-'}`}
              </div>
              <div className='fyl-zw'>
                <div className='fyl-yq'></div>
                {`职务 : ${detailsList && detailsList.duty ? detailsList.duty : '-'}`}
              </div>
            </div>
            <div>
              <div className='fyl-ssrw' title={detailsList && detailsList.task ? detailsList.task : '-'}>
                <div className='fyl-yq'></div>
                {`所属任务 : ${detailsList && detailsList.task ? detailsList.task : '-'}`}
              </div>
              <div className='fyl-cs'>
                <div className='fyl-yq'></div>
                {`最低评课次数 : ${detailsList && detailsList.mixDegree ? detailsList.mixDegree : '0'} 次`}
              </div>
              <div className='fyl-zdcs'>
                <div className='fyl-yq'></div>
                {`指定课程最低次数 : ${detailsList && detailsList.assignDegree ? detailsList.assignDegree : '0'} 次`}
              </div>
            </div>
          </div>
        </div>

        <div className='fyl-pkjl'>
          <div className='fyl-fh'>
            <div className='fyl-pkxqwenz'><div className='fyl-hk'></div>评课记录</div>
          </div>
          {recordList && recordList.length ? <div className='fyl-pkjldata'>
            <Table
              columns={columns}
              dataSource={recordList}
              className='fyl-table'
              rowKey='evaluateNum'
              pagination={false}
            />
            <div className='mj-ct-pagenation'>
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
            </div>
          </div> :
            <div className='mj-rxq-noneData'>
              <img src={noneData} />
              <div>暂无数据</div>
            </div>
          }
        </div>
      </div>
    </div>;
  }
}
