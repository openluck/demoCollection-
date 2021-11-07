/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-04 13:42:01
 * 课堂查询详情
 */
import React, { useState, useEffect } from 'react';
import { BreadPonent } from './../../../components/topPonent';
import './../../../../style/zxxk/xkjg/ktcxxq.scss'
import CourseRecord from './../../../components/zxxk/zxxk/checkCourseRecord'
import Screen from './../../../components/zxxk/zxxk/checkCourseScreen'
import { toHHmmss } from './format'
import { message, Tooltip } from 'antd'
import nodata from './../../../../media/picture/noneData.png'

import { getCourseInfo, getRecordTabList, getRecordList } from './ktcxxq-req'

const Ktcxxq = props => {

  // const paramsId = props.match.params.id
  const ty = props.ty
  const paramsId = props.ktcxXqId
  const { handleGoBack } = props
  console.log('paramsId', paramsId)

  const [courseInfo, setCourseInfo] = useState({}) // 课堂数据信息

  const [pageIndex, setPageIndex] = useState(2) // 分页页码
  const [total, setTotal] = useState(50) // 分页总条数

  const [courseList, setCourseList] = useState([])// 巡课列表数据

  const [tabList, setTabList] = useState([]) // tab列表
  const [icidentId, setIcidentId] = useState('')

  const [screenData, setScreenData] = useState({}) // 弹窗信息
  const [screenVisible, setScreenVisible] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    getCourseInfoFun({ courseId: paramsId })
    getRecordTabListFun({ courseId: paramsId })
  }, [])

  /* 获取课程信息 */
  const getCourseInfoFun = async params => {
    const { data } = await getCourseInfo(params)
    if (data.result) {
      setCourseInfo(data.data)
    } else {
      message.warning(data.message)
    }
  }

  /* 获取tabs */
  const getRecordTabListFun = async params => {
    const { data } = await getRecordTabList(params)
    // console.log(data)
    if (data.result) {
      console.log('66666')
      setTabList(data.data)
      setIcidentId('')
      setPageIndex(1)
      getRecordListFun({ icidentId: '', courseId: params.courseId, pageIndex: 1, pageSize: 20 })
    } else {
      message.warning(data.message)
    }
  }

  /* 获取巡课列表 */
  const getRecordListFun = async params => {
    const { data } = await getRecordList(params)
    // const data = jiashuju
    setTotal(data.total)
    setCourseList(data.data)
  }

  /* 切换页码 */
  const pageChan = useCallback(page => {
    setPageIndex(page)
    getRecordListFun({ icidentId: icidentId, courseId: paramsId, pageIndex: page, pageSize: 20 })
  }, [icidentId])

  /* 点击单个数据 */
  const handleOneCourseInfo = useCallback(item => {
    const icidentList = item.icidentList
    const arr = []
    icidentList[0] && icidentList.map(ele => {
      arr.push(ele.icidentId)
    })
    setSelectedTags(arr)
    setScreenVisible(true)
    setScreenData(item)
  }, [courseList])

  /* 巡课记录Tab切换 */
  const handleRecordTabChange = useCallback(code => {
    setIcidentId(code)
    getRecordListFun({ courseId: paramsId, icidentId: code, pageIndex: 1, pageSize: 20 })
  })

  return (
    <div className='xm-ktcxxq'>
      <BreadPonent pages={[ty === 'ry' ? '人员查询' : '课堂查询', ty === 'ry' ? '查看详情>查看巡课结果' : '查看巡课结果']} handleGoBack={handleGoBack}/>
      <div className='xm-ktcxxq-content'>
        <div className='xm-ktcxxq-content-class'>
          <p>课堂信息</p>
          <ul >
            <li>
              <b>班级：</b>{courseInfo.college}
            </li>
            <li><b>教室：</b>{courseInfo.classRoomName}</li>
            <li><b>上课时间：</b>{courseInfo.schoolTime ? (isNaN(courseInfo.schoolTime) ? courseInfo.schoolTime : toHHmmss(courseInfo.schoolTime)) : ''}</li>
            <li>
              <b>科目：</b>
              <Tooltip placement="topLeft" title={courseInfo.courseName}>
                {courseInfo.courseName}
              </Tooltip>
              </li>
            <li><b>教师：</b>{courseInfo.teacherName}</li>
            {/* <li>
              <b>课程号：</b>
              <Tooltip placement="topLeft" title={courseInfo.courseNum}>
                {courseInfo.courseNum}
              </Tooltip>
              </li> */}
          </ul>
        </div>
        <div className='xm-ktcxxq-content-list'>
          <p className='xm-recordbox-title'>巡课记录</p>
          {
            courseList[0] ? (
              <CourseRecord
                tabList={tabList}
                pageIndex={pageIndex}
                total={total}
                currentTabKey={icidentId}
                pageChan={pageChan}
                courseList={courseList}
                handleOneCourseInfo={handleOneCourseInfo}
                handleRecordTabChange={handleRecordTabChange}
                type={2} // 内部滚动
                pageSize={20}
                len={courseList && courseList[0] ? courseList.length : 0}
              />
            ) : (
                <div className='xm-nodata'>
                  <img src={nodata} alt='' />
                </div>
              )
          }

          <Screen
            screenVisible={screenVisible}
            setScreenVisible={setScreenVisible}
            data={screenData}
            setScreenData={setScreenData}
            type={1}
            selectedTags={selectedTags}
          />
        </div>
      </div>
    </div>
  )
}

export default Ktcxxq