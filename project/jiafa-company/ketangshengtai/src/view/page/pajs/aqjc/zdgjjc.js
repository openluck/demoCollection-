/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-03 16:57:23
 * 自动告警检查
 */
import React, { useState, useCallback, useEffect } from 'react';
import './../../../../style/pajs/aqjc/zdgjjc.scss'
import Modal from './../../../components/modalPonent'
import StaticData from './../../../components/zxxk/xkjg/staticdata'
import SVG from './../../../public/public-component-svg'
import { PaDatesPonent } from './../../../components/topPonent'
import Pageponent from './../../../components/pagePonent'
import Scrollbar from 'react-perfect-scrollbar'
import nodata from './../../../../media/picture/noneData.png'
import { zdPlaceMap, toHHmmss2 } from './format'
import fullSceenImg from './../../../../media/picture/fullScreen.png'
import IMG from "./../../../components/IMG";

import { getWarningList, getPlaceSelectList, getStatisticData, handleWarning } from './zdgjjc-req'

import { Button, Select, TreeSelect, message } from 'antd'
import { G } from '../../../../config/g';
const { TreeNode } = TreeSelect
const { Option } = Select

const $ = selector => document.querySelector(selector)

const Zdgjjc = props => {
  const orgCode = sessionStorage.getItem('orgCode');
  const [textValue, setTextValue] = useState('')

  const [modalVisible, setModalVisible] = useState(false)

  const [disposeCrr, setDiposeCrr] = useState('') // 当前处理情况index
  const [treeSelectId, setTreeSelectId] = useState('') // 场所树id
  const [icidentId, setIcidentId] = useState('') // 事件id

  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const [pageIndex, setPageIndex] = useState(1)
  const [total, setTotal] = useState(100)

  const [statisticData, setStatisticData] = useState({})

  const [warningList, setWarningList] = useState([]) // 列表数据
  const [placeContent, setPlaceContent] = useState() // 下拉节点树

  const [modalContent, setModalContent] = useState({}) // 弹窗内部内容数据
  const [imgHeight, setImgHeight] = useState(0)

  const [fullScreenFlag, setFullScreenFlag] = useState(false)

  /* 弹窗内部内容 */
  const content = (
    <div className='xm-zdgjjc-modal-content'>
      <div style={{
        cursor: 'pointer', position: 'absolute', width: '50px', padding: '8px', right: '70px', top: '80px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px',
      }} onClick={() => setFullScreenFlag(true)}>
        <img src={fullSceenImg} alt='' style={{ width: '100%' }} />
      </div>
      <div
        className='xm-zdgjjc-modal-content-imgbox'
        style={{ height: 500 * (221 / 393) + 'px', width: '100%' }}>
        <IMG src={G.serverUrl + '/pic/findById/' + modalContent.imgUrl + '/' + orgCode} width={500} height={280} />
      </div>
      <p className='xm-zdgjjc-modal-content-time'>时间：<span>{isNaN(modalContent.warnTime) ? modalContent.warnTime : toHHmmss2(modalContent.warnTime)}</span></p>
      <p className='xm-zdgjjc-modal-content-icident'>告警事件：<span>{modalContent.warnType === '1' ? '空室异常' : '人员滞留'}</span></p>
      <textarea className='xm-zdgjjc-modal-content-textarea' value={textValue} onChange={e => {
        const value = e.target.value
        if (value.length > 200) {
          message.warning('不得超过200字')
        } else {
          setTextValue(value)
        }
      }} />
      <Button className='xm-zdgjjc-modal-content-sure' loading={false} onClick={() => handleWarningFun({ singleId: modalContent.singleId, type: 2, remark: textValue })}>确认告警</Button>
      <Button className='xm-zdgjjc-modal-content-invalid' onClick={() => handleWarningFun({ singleId: modalContent.singleId, type: 1, remark: textValue })}>无效告警</Button>
      <Button className='xm-zdgjjc-modal-content-cancel' onClick={() => modalCancel()}>取消</Button>
    </div>
  )

  useEffect(() => {
    getPlaceSelectListFun()
  }, [])

  /* 图片高度 */
  useEffect(() => {
    if (warningList && warningList[0]) {
      setTimeout(() => {
        const li = $('.xm-zdgjjc-detail-bottom-content-ul li')
        const width = li.clientWidth
        setImgHeight(width * (221 / 393))
      }, 0);
    }
  }, [warningList])

  /* 切换日期 */
  const getDate = value => {
    setDiposeCrr('')
    setIcidentId('')
    setTreeSelectId('')
    setStartTime(value[0])
    setEndTime(value[1])
    setPageIndex(1)
    getStatisticDataFun({ startTime: value[0], endTime: value[1] })
    getWarningListFun({ startTime: value[0], endTime: value[1], placeId: '', dispose: '', icidentId: '', pageIndex: 1, pageSize: 12 })
  }

  /* 获取场所下拉列表 */
  const getPlaceSelectListFun = async () => {
    const { data } = await getPlaceSelectList()
    if (data.result) {
      if (data.data[0]) {
        const newTree = data.data.map(item => {
          return zdPlaceMap(item)
        })
        setPlaceContent(newTree)
      } else {
        setPlaceContent([])
      }
    } else {
      message.warning(data.message)
    }
  }

  /* 获取统计数据 */
  const getStatisticDataFun = async params => {
    const { data } = await getStatisticData(params)
    if (data.result) {
      setStatisticData(data.data)
    } else {
      message.warning(data.message)
    }
  }

  /* 获取告警列表 */
  const getWarningListFun = async params => {
    const { data } = await getWarningList(params)
    if (data.result) {
      setTotal(data.total)
      if (data.data && data.data[0]) {
        for (let i = 0; i < data.data.length; i++) {
          for (let j = 0; j + 1 < data.data.length - i; j++) {
            if (data.data[j].warnTime < data.data[j + 1].warnTime) {
              const temp = data.data[j]
              data.data[j] = data.data[j + 1]
              data.data[j + 1] = temp
            }
          }
        }
        setWarningList(data.data)
      } else {
        setWarningList([])
      }

    } else {
      message.warning(data.message)
    }
  }

  /* 取消弹窗 */
  const modalCancel = useCallback(() => {
    setModalVisible(false)
    setTextValue('')
  })

  /* 打开弹窗 */
  const handleModal = useCallback(params => {
    setModalContent(params)
    setTextValue(params.remark)
    setModalVisible(true)
  }, [])

  /* 切换处理类型 */
  const handleDispose = useCallback(value => {
    setDiposeCrr(value)
    setPageIndex(1)
    getWarningListFun({ startTime, endTime, placeId: treeSelectId, dispose: value, icidentId: icidentId, pageIndex: 1, pageSize: 12 })
  }, [icidentId, treeSelectId, startTime, endTime])

  /* 选择场所 */
  const handleTreeSelectId = useCallback(value => {
    setTreeSelectId(value)
    setPageIndex(1)
    getWarningListFun({ startTime, endTime, placeId: value, dispose: disposeCrr, icidentId, pageIndex: 1, pageSize: 12 })
  }, [startTime, endTime, disposeCrr, icidentId])

  /* 选择事件 */
  const handleIcidentId = useCallback(value => {
    setIcidentId(value)
    setPageIndex(1)
    getWarningListFun({ startTime, endTime, placeId: treeSelectId, dispose: disposeCrr, icidentId: value, pageIndex: 1, pageSize: 12 })
  }, [startTime, endTime, disposeCrr, treeSelectId])

  /* 切换页码 */
  const handlePageChange = useCallback(page => {
    getWarningListFun({ startTime, endTime, placeId: treeSelectId, dispose: disposeCrr, icidentId, pageIndex: page, pageSize: 12 })
    setPageIndex(page)
  }, [total, startTime, endTime, disposeCrr, treeSelectId, icidentId])

  /* 提交告警类型 */
  const handleWarningFun = useCallback(async params => {
    setModalVisible(false)

    console.log('params', params)
    const { data } = await handleWarning(params)
    if (data.result) {
      message.info('操作成功')
      setPageIndex(1)
      setTextValue('')
      getStatisticDataFun({ startTime, endTime })
      getWarningListFun({ startTime, endTime, placeId: treeSelectId, dispose: disposeCrr, icidentId, pageIndex: 1, pageSize: 12 })
    } else {
      message.warning(data.message)
    }
  }, [startTime, endTime, disposeCrr, treeSelectId, icidentId])

  return (
    <div className='xm-zdgjjc'>
      <PaDatesPonent
        paDateChan={getDate}
      />
      <div className='xm-zdgjjc-content'>
        <ul className='xm-zdgjjc-content-tongji'>
          <li>
            <StaticData name='告警教室' tip='间' num={statisticData.classRoomNum} />
            <SVG type='js1' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='告警总数' tip='条' num={statisticData.totalNum} />
            <SVG type='gj' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='已处理告警' tip='条' num={statisticData.hadDealt} />
            <SVG type='ycl' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='处理进度' tip='%' num={statisticData.progress} />
            <SVG type='jd' width='20px' height='20px' fill='#4ad8b2' />
          </li>
        </ul>
        <div className='xm-zdgjjc-content-detail'>
          <div className='xm-zdgjjc-detail-top'>
            <div className='xm-zdgjjc-detail-top-l'>
              <span>告警列表</span>
              <ul>
                <li className={disposeCrr === '' ? 'active' : ''} onClick={() => handleDispose('')}>全部</li>
                <li className={disposeCrr === '1' ? 'active' : ''} onClick={() => handleDispose('1')}>待处理</li>
                <li className={disposeCrr === '2' ? 'active' : ''} onClick={() => handleDispose('2')}>已处理</li>
              </ul>
            </div>
            <div className='xm-zdgjjc-detail-top-r'>
              <TreeSelect
                className='xm-zdgjjc-detail-treeselect'
                value={treeSelectId}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                onChange={handleTreeSelectId}
              >
                <TreeNode value='' title='全部场所' />
                {placeContent}
              </TreeSelect>
              <Select defaultValue="" style={{ width: 120 }} value={icidentId} onChange={handleIcidentId}>
                <Option value="">全部事件</Option>
                <Option value="1">空室异常</Option>
                <Option value="2">人员滞留</Option>
              </Select>
            </div>
          </div>
          <div className='xm-zdgjjc-detail-bottom'>
            {
              warningList && warningList[0] ?
                (
                  <>
                    <Scrollbar
                      className='xm-zdgjjc-detail-bottom-content'
                    >
                      <ul className='xm-zdgjjc-detail-bottom-content-ul'>
                        {
                          warningList.map((item, index) => {
                            return (
                              <li key={index}>
                                {
                                  item.warningId === '0' ? null : (
                                    <div className='xm-zdgjjc-detail-bottom-content-ul-pos'
                                      style={{
                                        backgroundColor: item.warningId === '0' ? '' : (item.warningId === '2' ? 'rgba(232, 40, 24, .5)' : 'rgba(34, 32, 30, .5)')
                                      }}
                                    >
                                      {item.warningId === '1' ? '无效告警' : '确认告警'}
                                    </div>
                                  )
                                }
                                <div className='li-imgbox' style={{ height: imgHeight + 'px', width: '100%' }} onClick={() => handleModal(item)}>
                                  <IMG src={G.serverUrl + '/pic/findById/' + item.imgUrl + '/' + orgCode} width='100%' height={imgHeight} />
                                </div>
                                <div className='xm-zdgjjc-detail-bottom-content-ul-box'>
                                  <div className='xm-zdgjjc-detail-bottom-content-ul-info'>
                                    <span>{isNaN(item.warnTime) ? item.warnTime : toHHmmss2(item.warnTime)}</span>
                                    <p>{item.warnType === '1' ? '空室异常' : '人员滞留'}</p>
                                  </div>
                                  <div className='xm-zdgjjc-detail-bottom-content-ul-address'>{item.classRoomName}</div>
                                  <Button className='xm-zdgjjc-detail-bottom-content-ul-invalid' onClick={() => handleWarningFun({ singleId: item.singleId, type: 1, remark: item.remark })}>无效告警</Button>
                                  <Button className='xm-zdgjjc-detail-bottom-content-ul-sure' onClick={() => handleWarningFun({ singleId: item.singleId, type: 2, remark: item.remark })}>确认告警</Button>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </Scrollbar>
                    <Pageponent
                      pageIndex={pageIndex}
                      pageSize={12}
                      total={total}
                      len={warningList && warningList[0] ? warningList.length : 0}
                      pageChan={handlePageChange}
                    />
                  </>
                )
                :
                <div className='xm-nodata'>
                  <img src={nodata} alt='' />
                  <p>暂无数据</p>
                </div>
            }
          </div>
        </div>
      </div>
      <Modal
        title='告警详情'
        visible={modalVisible}
        content={content}
        width={600}
        onCancel={modalCancel}
      />
      <div className='xm-fullSceen' style={{ display: fullScreenFlag ? 'block' : 'none' }}>
        <div className='xm-imgbox'>
          <img src={G.serverUrl + '/pic/findById/' + modalContent.imgUrl + '/' + orgCode} alt='' />
        </div>

        <p onClick={() => setFullScreenFlag(false)}>x</p>
      </div>
    </div>
  )
}

export default Zdgjjc;
