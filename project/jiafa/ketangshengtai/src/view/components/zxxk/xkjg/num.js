import React from 'react'


const Num = props => {
  const { name, num, tip } = props
  return (
    <div className='xm-ktcxbox-content-breaklist-info xm-rycxbox-content-breaklist-info xm-zdgjjc-content-tongji-info'>
      <p>
        <span>{num}</span>
        <span>{tip}</span>
      </p>
      <p>{name}</p>
    </div>
  )
}

export default Num