import React, { useState, useEffect } from 'react'
import './../../../../style/zxxk/zxxk/checkCourseRecord.scss'
import Pageponent from './../../pagePonent'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { toHHmmss } from './format'

const $ = selector => document.querySelector(selector)

const Record = props => {
  const orgCode = sessionStorage.getItem('orgCode')
  const { tabList, pageIndex, total, courseList, currentTabKey, type, pageSize, len, kind } = props
  const { pageChan, handleOneCourseInfo, handleRecordTabChange } = props
  // useEffect(() => {
  //   window.addEventListener('resize', () => {
  //     const tag = $('.xm-checkrecordbox-tag')
  //     const listscroll = $('.xm-checkrecordbox-listscroll')
  //     const xm_checkrecordboxlist = $('.xm-checkrecordboxlist')
  //     if (listscroll && xm_checkrecordboxlist) {

  //       const boxlistHeight = xm_checkrecordboxlist.clientHeight
  //       const tagHeight = tag.clientHeight
  //       console.log('xm_checkrecordboxlist', boxlistHeight)
  //       listscroll.style.height = xm_checkrecordboxlist.clientHeight - tagHeight - 32 + 'px'
  //     }
  //   })

  // }, [])
  return (
    <div className={type === 2 ? 'xm-checkrecordboxlist' : 'xm-checkrecordbox'}>
      <ul className='xm-checkrecordbox-tag'>
        {
          tabList && tabList[0] && tabList.map(item => {
            return (
              <li key={item.icidentId} className={currentTabKey === item.icidentId ? 'active' : ''} onClick={() => handleRecordTabChange(item.icidentId)}>
                <span>{item.icidentName}</span>
                {
                  item.icidentId === '' ? '' : <span>{item.num}</span>
                }

              </li>
            )
          })
        }
      </ul>
      {
        type === 2 ? ( // type === 2， 巡课结果详情页
          <PerfectScrollbar className='xm-checkrecordbox-listscroll'>
            {
              courseList && courseList[0] && courseList.map((item, index) => {
                return (
                  <li key={index} onClick={() => handleOneCourseInfo(item, 1)}>
                    <div className='xm-imgbox'>
                      <img src={G.serverUrl + '/pic/findById/' + item.imgUrl + '/' + orgCode} alt='' />
                    </div>

                    <div className='xm-checkrecordbox-list-content'>
                      <div className='xm-checkrecordbox-list-content-tag'>
                        {
                          item.icidentList && item.icidentList[0] && item.icidentList.map(ele => {
                            return <span key={ele.icidentId}>{ele.icidentName}</span>
                          })
                        }
                      </div>
                      <p>{item.remark}</p>
                      <div className='xm-checkrecordbox-list-content-teacherdate'>
                        <span>{item.teacherName}</span>
                        <span>{isNaN(item.time) ? item.time : toHHmmss(item.time)}</span>
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </PerfectScrollbar>
        ) : (
            <ul className='xm-checkrecordbox-list'>
              {
                courseList && courseList[0] && courseList.map((item, index) => {
                  return (
                    <li key={index} onClick={() => handleOneCourseInfo(item, 1)}>

                      <div className='xm-imgbox'>
                        <img src={G.serverUrl + '/pic/findById/' + item.imgUrl + '/' + orgCode} alt='' />
                      </div>
                      <div className='xm-checkrecordbox-list-content'>
                        <div className='xm-checkrecordbox-list-content-tag'>
                          {
                            item.icidentList && item.icidentList[0] && item.icidentList.map(ele => {
                              return <span key={ele.icidentId}>{ele.icidentName}</span>
                            })
                          }
                        </div>
                        <p>{item.remark}</p>
                        <div className='xm-checkrecordbox-list-content-teacherdate'>
                          <span>{kind === 'rgaq' ? item.personName : item.teacherName}</span>
                          <span>{isNaN(item.time) ? item.time : toHHmmss(item.time)}</span>
                        </div>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          )
      }
      <Pageponent total={total} pageIndex={pageIndex} pageSize={pageSize} pageChan={pageChan} len={len} />
    </div>
  )
}

export default Record