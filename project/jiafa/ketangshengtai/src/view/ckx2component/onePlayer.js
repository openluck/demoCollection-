/*
 * @Author: mzc 
 * @Date: 2021-03-31 11:04:52 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-05-31 10:56:43
 */
/**
 * @desc Ck_X2 播放器单屏组件
 * @param ckId {String} 播放器id // 不得重复
 * @param url {String} 播放地址
 * @param volume {number} 音量大小 0-1
 * @param width {number} 基础宽度 
 * @param height {number} 基础高度 
 * @param autoplay {boolean} 循环播放
 * @param screenShot {function} 截屏函数
 */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import "./onePlayer.css";
import { useCallback } from 'react';

const Oneplayer = props => {
  const { url, volume, autoplay, width, height, ckId } = props
  const { screenShot } = props
  const [type, setType] = useState(1) // 1flash，2h5
  /**
   * @desc url变化
   */
  useEffect(() => {

    // 监听事件放loadedHandler里,解决作用域问题
    

    if (url) {
      let flag = url.indexOf('rtmp') > -1
      flag ? setType(1) : setType(2)
      const videoObject = {
        container: '.' + ckId, //“#”代表容器的ID，“.”或“”代表容器的class
        variable: ckId, //播放函数名称，该属性必需设置，值等于下面的new ckplayer()的对象
        flashplayer: flag,
        autoplay,
        volume,
        // live: true,
        html5m3u8: !flag, //为m3u8时需要此功能保证截图
        loaded: 'loadedHandler',
        video: url
      };

      window[ckId] = new window.ckplayer(videoObject);//初始化播放器
    } else {
      window[ckId] = null
    }
    window.loadedHandler = function (id) {
      console.log(id + '播放器已加载')

      // window.screenShotHandler = obj => {
      //   if (typeof screenShot == 'function') {
      //     obj.ckId = id
      //     screenShot(obj)
      //   }
      // }
      window.screenshotHandlerFun = function (src) {
        // setSrc(src)
        console.log('src', src)
      }
      console.log('id', window[id])
      window[id].addListener('screenshot', window.screenShotHandler)


    }
  }, [url, width])

  /**
   * @desc 截图功能
   */
  const CKScreenShot = useCallback(() => {
    if (window[ckId]) {
      type == 1 ? window[ckId].screenshot() : window[ckId].screenshot('video')
    }
  }, [type, ckId])

  return (
    <div className='mzc-ckbox' style={{ width: width, height: height }}>
      {
        url ?
          <div className={`${ckId} mzc-ckVideo`} />
          :
          <div className='mzc-ckNoData'>
            抱歉，暂无视频数据！
        </div>
      }
      {/* <div className='mzc-ckScreenShot' style={{ display: url ? 'block' : 'none' }}>
        <Button onClick={CKScreenShot} type='primary'>截屏</Button>
      </div> */}
    </div>
  )
}

export default Oneplayer