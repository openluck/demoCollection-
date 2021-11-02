import React, { useEffect, useState } from 'react'

const TreeControl = props => {

  const { title, isTeaching } = props
  const [dis, setDis] = useState(false)

  useEffect(() => {
    setDis(true)

    const $ = selector => document.querySelector(selector)

    const leftEle = $('.controltreeleft')
    const centerEle = $('.controltreecenter')
    const rightEle = $('.controltreeright')

    setInterval(() => {
      leftEle.style.height = 0
      leftEle.style.transition = '0.5s'
      setTimeout(() => {
        leftEle.style.height = '15px'
      }, 500)
    }, 1000)
    setInterval(() => {
      centerEle.style.height = 0
      centerEle.style.transition = '0.3s'
      setTimeout(() => {
        centerEle.style.height = '15px'
      }, 300)
    }, 600)
    setInterval(() => {
      rightEle.style.height = 0
      rightEle.style.transition = '0.4s'
      setTimeout(() => {
        rightEle.style.height = '15px'
      }, 400)
    }, 800)
  }, [title, isTeaching])

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center',
      // backgroundColor: '#24252b',
      justifyContent: 'space-between',
      // marginLeft: '-4px'
      // paddingLeft: 10
      // justifyContent: 'space-between' 
    }}>
      <span>{title}</span>
      <div style={{ width: '80px', display: 'flex', height: '100%', alignItems: 'flex-end', justifyContent: 'space-between', marginRight: 10}}>
        <div style={{ width: 30, height: 24, position: 'relative', display: dis ? 'block' : 'none', marginRight: 5 }}>
          <div className='controltree controltreeleft' style={{ backgroundColor: '#afafb1', height: 15, width: 4, position: 'absolute', left: 10, bottom: 4 }}></div>
          <div className='controltree controltreecenter' style={{ backgroundColor: '#afafb1', height: 15, width: 4, position: 'absolute', left: 16, bottom: 4 }}></div>
          <div className='controltree controltreeright' style={{ backgroundColor: '#afafb1', height: 15, width: 4, position: 'absolute', left: 22, bottom: 4 }}></div>
        </div>
        <span>{isTeaching === 1 ? '授课中' : null}</span>
      </div>
    </div>
  )
}

export default TreeControl
