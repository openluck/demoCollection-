/*
 * @Author: mzc 
 * @Date: 2021-04-06 11:18:37 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-04-12 17:25:48
 */
/**
 * @desc 三屏组件
 * @param TeaScenariosList {Array} 教师场景列表
 * @param StuScenariosList {Array} 学生场景列表
 * @param OtherScenariosList {Array} 其他场景列表
 * @param screenShot {function} 截屏
 * @param baseWidth {number} 基础宽度
 * @param isLive {boolean} 基础宽度
 */
import React from 'react'
import OneScreen from './oneScreen'
import './multiScreen.css'

const MultiScreen = props => {
  const { baseWidth, TeaScenariosList, StuScenariosList, OtherScenariosList, isLive } = props
  const { screenShot } = props
  return (
    <div className='mzc-multiVideoBox' style={{ width: baseWidth, height: baseWidth / 1371 * 551 }}>
      <div className='mzc-multiVideoBoxLeft'>
        <OneScreen
          scenariosList={TeaScenariosList}
          baseWidth={baseWidth / 1369 * 921}
          baseHeight={baseWidth / 1369 * 981 * 9 / 16}
          ckId='CKX2_multiOnePlayer'
          screenShot={screenShot}
          isLive={isLive}
        />
      </div>
      <div className='mzc-multiVideoBoxRight'>
        <div className='mzc-multiVideoBoxTwo'>
          <OneScreen
            scenariosList={StuScenariosList}
            baseWidth={baseWidth / 1369 * 448}
            baseHeight={baseWidth / 1369 * 448 * 9 / 16}
            ckId='CKX2_multiTwoPlayer'
            screenShot={screenShot}
            isLive={isLive}
          />
        </div>
        <div className='mzc-multiVideoBoxThree'>
          <OneScreen
            scenariosList={OtherScenariosList}
            baseWidth={baseWidth / 1369 * 448}
            baseHeight={baseWidth / 1369 * 448 * 9 / 16}
            ckId='CKX2_multiThreePlayer'
            screenShot={screenShot}
            isLive={isLive}
          />
        </div>
      </div >

    </div>
  )
}

export default MultiScreen