/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-16 13:26:39
 * 听评课V2.2——任务进度详情
 */

import React, { Component, useState, useEffect } from 'react';
import { Button, Layout, Table, Pagination, Modal, message } from 'antd';
import CommonPie from './../../../components/yrj_CommonPie';
import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from "./../../../public/public-component-svg";
// import BreadCrumb from './../../../components/breadCrumb';
import { BreadPonent } from './../../../components/topPonent';
import { requestForListen } from './../../../../util/request';
import noneData from './../../../../media/picture/noneData.png';
import PagePonent from './../../../components/pagePonent';

import './../../../../style/tpk/rwgz/taskProgressRateFirstPage.scss';

const { Content } = Layout
export default function TaskOverView(props) {
  const [showModal, setShowModal] = useState(false)
  const [selectForm, setSelectForm] = useState(0)
  const [formData, setFormData] = useState([])
  const [pieData, setPieData] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  let columns = [
    { title: '序号', dataIndex: 'dataNum', key: 'dataNum', width: '9%' },
    { title: '听课人', dataIndex: 'taskListener', key: 'taskListener', width: '9%' },
    // { title: '职务', dataIndex: 'duty', key: Math.random(), width: '12%' },
    {
      title: '最低听课次数（听课次数/指定次数）', dataIndex: 'minTimes', key: Math.random(), width: '24%',
      render: (text, record) => { return `${record.minTimesReal}/${record.minTimesRequired}` }
    },
    {
      title: '指定听课次数（听课次数/指定次数）', dataIndex: 'appointTimes', key: Math.random(), width: '24%',
      render: (text, record) => { return `${record.appointTimesReal}/${record.appointTimesRequired}` }

    },
    {
      title: '任务状态', dataIndex: 'taskState', key: Math.random(), width: '10%',
      render: (text, record) => {
        if (text === 0) {
          return '未完成'
        }
        else {
          return '已完成'
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: Math.random(),
      width: '10%',
      render: (text, record) => {
        return <span
          className='mj-oo-icon'
          title='查看'
          onClick={() => props.history.push(`/home/tpk/rwgz/rwgzgl/rwjdgrxq/${record.personId}/${props.match.params.taskId}`)}
        >
          <SVG type={'ck'} style={{ width: '18px', height: '18px' }} />
          查看详情
        </span>
      }
    }
  ]


  //获取列表信息请求
  const getTaskInfoRequest = (pr) => {
    return requestForListen('get/taskInfo', pr)
  }

  //获取列表信息
  const getTaskInfo = async a => {
    let { data } = await getTaskInfoRequest(a)
    if (data.data === null) {
      message.info(data.message)
    }
    else {
      // console.log(data)
      setFormData(data.data)
      setTotal(data.total)
    }
  }

  //获取饼图数据请求
  const getPieRequest = (pr) => {
    return requestForListen('get/pieData', pr)
  }

  //获取饼图数据
  const getPieData = async a => {
    let { data } = await getPieRequest(a)
    if (data.data === null) {
      message.info(data.message)
    }
    else {
      setPieData(data.data)
      // console.log(data)
    }
  }

  //结束任务请求
  const endTaskRequest = (pr) => {
    return requestForListen('commit/endTask', pr)
  }

  //结束任务
  const endTask = async a => {
    let { data } = await endTaskRequest(a)
    getPieData(a)
  }


  //进入页面无条件调用一次获取列表信息方法
  useEffect(() => {
    let pr = {
      pageIndex: 1,
      pageSize: 20,
      taskId: props.match.params.taskId
    }
    let pr2 = {
      taskId: props.match.params.taskId
    }
    getTaskInfo(pr)
    getPieData(pr2)
  }, [])

  function passPage(e) {
    setCurrentPage(e)
    let pr = {
      pageIndex: e,
      pageSize: 20,
      taskId: props.match.params.taskId
    }
    getTaskInfo(pr)
  }

  function passAndClose() {
    let pr = {
      taskId: props.match.params.taskId
    }
    endTask(pr)
    setShowModal(false)
  }

  function viewOn(a) {
    console.log('on', a)
    setSelectForm(a)
  }

  function viewOut(a) {
    console.log('out')
    setSelectForm(a)
  }

  //根据码表显示任务类型
  function showTaskType(taskType) {
    if (taskType === '001') {
      return '督导专家'
    }
    else {
      return '领导干部'
    }
  }

  //根据码表显示任务状态
  function showTaskState(taskState) {
    if (taskState === 0) {
      return '未发布'
    }
    else if (taskState === 1) {
      return '进行中'
    }
    else {
      return '已结束'
    }
  }

  //内部表单表格组件
  function FormTable(props) {
    if (formData.length === 0) {
      return (
        <div className='mj-rxq-noneData'>
          <img src={noneData} />
          <div>暂无数据</div>
        </div>
      )
    } else {
      return <div style={{ height: '100%' }}>
        <div className='tableContainer mj-od-content' style={{ height: "calc(100% - 50px)" }}>
          <PerfectScrollbar>
            <Table
              className='mj-overViewDetail mj-od-tableCon'
              columns={columns}
              dataSource={formData}
              pagination={false}
              rowKey={record => record.taskListener}
              rowClassName={(record, index) => {
                // return index % 2 === 1 ? 'dark-row' : 'light-row'
              }}
            />
          </PerfectScrollbar>
        </div>
        <div className='mj-p-pages'>
          <PagePonent
            pageIndex={currentPage}
            pageSize={20}
            pageChan={passPage}
            len={formData && formData.length || 0}
            total={total} />
        </div>
        {/* <div className='p-text'>
          每页20条数据，共{total}条
        </div>
        <div className='paginationCoutainer'>
          <Pagination
            defaultCurrent={1}
            total={total}
            pageSize={20}
            // showTotal={total => `每页20条数据，共${total}条`}
            onChange={passPage}
            current={currentPage}
          />
        </div> */}
      </div>
    }
  }

  return <>
    <Layout>
      {/* <BreadCrumb ver='tpk' data={['任务跟踪', '任务概览', '任务详情']} /> */}
      <BreadPonent pages={['任务进度', '任务详情']} />

      <div className='mj-od-content'>
        <div className='mj-od-topCon'>
          <div className='mj-od-leftCon'>
            <div className='mj-od-title'>任务进度详情</div>
            <div className='mj-od-xqCon'>
              <div className='mj-od-txtCon'>
                <div className='mj-od-txtline'>
                  <div className='mj-od-txt'>
                    <span>任务名称：</span>
                    <span>{pieData.taskName || '-'}</span>
                  </div>
                </div>
                <div className='mj-od-txtline'>
                  <div className='mj-od-txt'>
                    <span>任务类型：</span>
                    <span>{showTaskType(pieData.taskType)}</span>
                  </div>
                  <div className='mj-od-txt'>
                    <span>任务状态：</span>
                    <span>{showTaskState(pieData.taskState)}</span>
                  </div>
                </div>
              </div>
              <div className='mj-od-numContent'>
                <div className='mj-od-numCon'>
                  <div className='mj-od-num'>
                    <span>{pieData.allNum || 0}</span>
                    <span>人</span>
                  </div>
                  <div className='mj-od-numTxt'>评课人员</div>
                </div>
                <span className='mj-od-line'></span>

                <div className='mj-od-numCon'>
                  <div className='mj-od-num'>
                    <span>{pieData.finishedNum || 0}</span>
                    <span>人</span>
                  </div>
                  <div className='mj-od-numTxt'>已完成</div>
                </div>
                <span className='mj-od-line'></span>

                <div className='mj-od-numCon'>
                  <div className='mj-od-num'>
                    <span>
                      {
                        pieData.progressRate ?
                          (pieData.progressRate * 100 === 100 ? 100 : (pieData.progressRate * 100).toFixed(1)) : 0
                      }
                    </span>
                    <span>%</span>
                  </div>
                  <div className='mj-od-numTxt'>完成进度</div>
                </div>
              </div>
            </div>
          </div>

          <div className='mj-od-btnCon'>
            {
              // pieData.taskState === 2 && pieData.isOperation === 1 ? null :
              pieData.taskState !== 2 && pieData.isOperation === 0 ?
                <Button type='primary' onClick={() => { setShowModal(true) }}>结束任务</Button> : null
            }
          </div>
        </div>

        {/* <div
        style={{
          margin: '16px 16px 0 16px',
          background: '#fff',
          height: '10%',
          position: 'relative',
          padding: 20
        }}
        className='hhh'
      >
        <span className='re-title'></span>
        <h1 className='re-name' style={{ fontSize: 23 }}>任务进度详情</h1>
        <div className='taskPR-firstFloor-BTN' style={{ paddingTop: 5 }}>
          <Button onClick={() => props.history.goBack()}>返回</Button>
        </div>
        <div className='taskPR-firstFloor-BTN' style={{ paddingTop: 5 }}>
          {pieData.taskState === 2 && pieData.isOperation === 1 ? null : <Button type='primary' onClick={() => { setShowModal(true) }}>结束任务</Button>}
        </div>
      </div> */}

        {/* <div
        style={{
          background: '#fff',
          marginTop: 2,
          height: '35%',
          padding: 20
        }}
      >

        <div className='one-right' >
          <div className='smallItem' >
            <SVG style={{ height: 30, width: 30 }} type='rs' />
            <span className='middleText'>评课人数</span>
            <span style={{ fontSize: 20 }}>{pieData.allNum} 人</span>
          </div>
          <div className='smallItem2' >
            <SVG style={{ height: 30, width: 30 }} type='ywc1' />
            <span className='middleText'>已完成</span>
            <span style={{ fontSize: 20 }}>{pieData.finishedNum} 人</span>
          </div>
        </div>
        <div className='one-middle'>
          <div className='right-picture' style={{ float: 'right', height: 170, width: 170, marginRight: '20%' }}>
            <CommonPie
              radius={["55", "65"]}
              center={["50%", "80"]}
              color={["#56bbee", "#fbfcfd"]}
              data={pieData.progressRate ?
                (pieData.progressRate * 100 === 100 ? 100 : (pieData.progressRate * 100).toFixed(1)) : 0
              }
              title='总任务进度'
            />
          </div>
        </div>
        <div className='one-left'>
          <div style={{ marginTop: 40, width: 300, marginRight: 0 }}>
            任务名称：{pieData.taskName}
          </div>
          <div style={{ marginTop: 30, width: 300, marginRight: 0 }}>
            任务类型：{showTaskType(pieData.taskType)}
          </div>
          <div style={{ marginTop: 30, width: 300, marginRight: 0 }}>
            任务状态：{showTaskState(pieData.taskState)}
          </div>

        </div>
      </div> */}

        <div style={{
          background: '#fff',
          marginTop: 16,
          padding: 16,
          height: 'calc(100% - 136px)'
        }}>
          <div style={{ height: '100%' }}>
            <div className='sec-countainer'>
              {/* <span className='re-title'></span> */}
              <h2 className='re-name'>评课进度</h2>
            </div>
            <div style={{ height: 'calc(100% - 50px)' }}>
              <FormTable />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title='提示'
        onOk={passAndClose}
        onCancel={() => { setShowModal(false) }}
        visible={showModal}
      >
        结束任务后评课人员不可再提交评议表，确定结束任务？
      </Modal>
    </Layout>
  </>;
}