/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-17 14:07:13
 * 听评课V2.2——创建评课任务-第二步
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button, Pagination, InputNumber } from 'antd';
import PagePonent from './../../pagePonent';

import PerSele from './mj-perSele';
import PersonSele from './mj-personSele';
import { seleChan, perChan, reqPerList } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';
import './../../../../style/tpk/rwgl/mj-stepTwo.scss';
import './../../../../style/zxxk/xkjg/mj-rycxxq.scss';

@withRouter
@connect(state => state.addTask, { seleChan, perChan, reqPerList })
export default class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }
  componentDidMount() {
    let ifId = this.props.match.params.taskId;
    if (ifId) {
      this.props.reqPerList(ifId);
    }
  }
  componentWillUnmount() {
    this.setState({ data: [] })
  }
  componentWillReceiveProps(prop) {
    // console.log(prop); 
    if (prop.ifSubmit) {
      this.props.history.goBack();
      this.props.seleChan('init');
    }
    let dataList = JSON.parse(JSON.stringify(this.state.data)),
      propDataList = JSON.parse(JSON.stringify(prop.personListData));
    // console.log(dataList, propDataList);

    if (propDataList !== dataList) {
      this.setState({
        data: prop.personListData
      })
    }
  }

  render() {
    const title = [
      { name: '人员', key: 'perName' },
      // { name: '职务', key: 'work' },
      { name: '最低评课次数', key: 'courseLow' },
      { name: '指定课程最低次数（非必填）', key: 'evaluLow' },
    ];
    const { personListData, personListTotal, personListIndex, personTable, personModal, submitDisabled, ifEdit, courseInfoTotal } = this.props;
    const { data } = this.state;
    // console.log(personListData, personTable);

    return <div className='mj-st-stepTwoCon' ref={node => (this.node = node)}>
      <div className='mj-st-titleCon mj-clearfix'>
        <span>指定的评课人员：</span>
        {
          personListData && personListData.length ?
            <Button
              disabled={ifEdit}
              onClick={() => this.props.perChan('perModal', true)}
              type='primary'>选择人员</Button> : null
        }
      </div>

      {
        personListData && personListData.length ?
          <div style={{ height: 'calc(100% - 140px)' }} className='mj-p-tables'>
            {/* 表头 */}
            <div className='mj-p-tableTitle mj-st-tableHeaderCon'>
              {
                title.map(item => {
                  return <div key={item.key}>{item.name}</div>
                })
              }
            </div>
            {/* 表格内容 */}
            <div style={{ height: 'calc(100% - 50px)' }}>
              <PerfectScrollbar>
                {
                  personTable && personTable.length ?
                    personTable.map(item => {
                      return <div key={item.perId} className='mj-st-tableCon'>
                        <div title={item.perName}>{item.perName || '-'}</div>
                        {/* <div title={item.work}>{item.work || '-'}</div> */}
                        <div>
                          <InputNumber
                            min={1}
                            max={999999999}
                            disabled={ifEdit}
                            onChange={(value) => this.props.perChan('evaluNum1', { item, value })}
                            value={item.evaluLow ? item.evaluLow : 1} />
                        </div>
                        <div>
                          <InputNumber
                            min={0}
                            max={item.evaluLow}
                            disabled={ifEdit || (item.courseLow === 0 && courseInfoTotal === 0) ? true : false}
                            onChange={(value) => this.props.perChan('courseNum1', { item, value })}
                            value={item.courseLow} />
                        </div>
                      </div>
                    }) : null
                }
              </PerfectScrollbar>
            </div>

            {/* 分页 */}
            {/* <div className='mj-ct-pagenation'>
              <span className='mj-ct-total'>{`每页20条数据，共${personListTotal}条`}</span>
              <Pagination
                defaultCurrent={1}
                total={personListTotal}
                pageSize={20}
                current={personListIndex}
                onChange={(page) => {
                  this.node.scrollIntoView();
                  this.props.perChan('pseronListChan', page)
                }}
              />
            </div> */}
            <div className='mj-p-pages'>
              <PagePonent
                pageIndex={personListIndex}
                pageSize={20}
                pageChan={(page) => {
                  this.node.scrollIntoView();
                  this.props.perChan('pseronListChan', page)
                }}
                len={personListData && personListData.length || 0}
                total={personListTotal} />
            </div>
          </div> :
          <div className='mj-st-seleBox'>
            <Button
              disabled={ifEdit}
              onClick={() => this.props.perChan('perModal', true)}
              type='primary' >选择人员</Button>
          </div>
      }

      <div className='mj-st-stepBtn'>
        <Button
          onClick={() => {
            this.props.scrollTop(true);
            this.props.seleChan('stepNext', 1);
          }}
          className='mj-st-pre'>上一步</Button>
        <Button
          disabled={!personListData || !personListData.length || submitDisabled || ifEdit ? true : false}
          onClick={(page) => this.props.perChan('submitData', 1)}
          className={!personListData || !personListData.length || ifEdit ? 'mj-st-submitNo' : 'mj-st-submit'}>保存</Button>
      </div>

      {/* 人员选择弹框 */}
      {!personModal ? null : <PersonSele visible={personModal} perList={personListData || []} />}
      {/* {
        !personModal ? null : <PersonSele visible={true} perList={
          [
            { perId: '1', perName: '姓名1', work: '' },
          ]
        } />
      } */}
    </div>
  }
}
