/*
 * @Author: mzc 
 * @Date: 2021-04-02 14:51:38 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-04-12 17:18:02
 */
/**
 * @desc 单屏组件
 * @param scenariosList {Array} 场景列表
 * @param screenShot {function} 截屏
 * @param baseWidth {number} 基础宽度
 * @param ckId {String} 播放器ID
 */
import React, { useState, useEffect, useCallback } from 'react'
import OnePlayer from './onePlayer'
import { Select, Spin } from 'antd'
import './oneScreen.css'

const OneScreen = props => {
  const { scenariosList, baseWidth, baseHeight, ckId, isLive } = props
  console.log('scenariosList', scenariosList)
  const { screenShot } = props
  const [sceneId, setSceneId] = useState('')
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  // 场景列表数据变化
  useEffect(() => {
    // console.log('scenariosList', scenariosList)
    setLoading(true)
    let sceneId = '', url = ''
    if (scenariosList.length) {
      sceneId = scenariosList[0].id
      url = handleGetSceneURL(scenariosList[0], isLive)
    }
    setSceneId(sceneId)
    setUrl(url)
    setLoading(false)
  }, [scenariosList, isLive])

  // 切换场景
  const handleChangeScene = useCallback(id => {
    setLoading(true)
    setSceneId(id)
    const urlObj = scenariosList.find(item => item.id == id)
    const url = handleGetSceneURL(urlObj, isLive)
    console.log('url', url)
    setUrl(url)
    setLoading(false)
  }, [scenariosList, isLive])

  // 获取地址功能函数
  const handleGetSceneURL = (urlObj, live) => {
    // console.log('urlObj', urlObj)
    let url = ''
    let _list = live ? 'list' : 'urlList'
    if (urlObj.url && urlObj.url[0] && urlObj.url[0][_list] && urlObj.url[0][_list][0]) {
      url = urlObj.url[0][_list][0].url
    }
    return url
  }
  return (
    <div className='mzc-video' style={{ width: baseWidth, height: baseWidth * 9 / 16 }}>
      {
        loading ?
          <div className='mzc-loading'>
            <Spin />
            <span className='mzc-loadingTips'>loading...</span>
          </div>
          :
          <OnePlayer
            url={url}
            volume={0.5}
            width={baseWidth}
            height={baseHeight}
            autoplay={true}
            scenariosList={scenariosList}
            screenShot={screenShot}
            ckId={ckId}
          />
      }
      <div className='mzc-scenariosList' style={{ display: scenariosList.length ? 'block' : 'none' }}>
        <Select
          style={{ width: 120 }}
          getPopupContainer={triger => triger.parentNode}
          value={sceneId}
          onChange={handleChangeScene}
        >
          {
            scenariosList.map(el => {
              return <Select.Option key={el.id} value={el.id}>{el.name}</Select.Option>
            })
          }
        </Select>
      </div>
    </div>
  )
}



export default OneScreen