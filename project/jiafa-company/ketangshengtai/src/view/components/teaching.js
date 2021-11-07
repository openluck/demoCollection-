import React from 'react'
import './../../style/teaching.scss'

const Teaching = props => {
  const { title, isLive } = props
  return (
    <div className='teaching'>
      <span>{title}</span>
      {
        isLive === 1 ?
          <div className='teaching-content'>
            <div className='teaching-p'>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <div className='teaching-word'>授课中</div>
          </div>
          :
          isLive === 0 ?
            <div className='teaching-content'>未开始</div>
            : null
      }
    </div>
  )
}

export default Teaching