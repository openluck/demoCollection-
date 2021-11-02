import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Modal, Tag, Button } from 'antd'
import './../../../../style/zxxk/zxxk/screen.scss'
import fullScreenImg from './../../../../media/picture/fullScreen.png'

const { CheckableTag } = Tag
const Screen = props => {
  const orgCode = sessionStorage.getItem('orgCode')
  const textarea = useRef('')
  const { data, type, textareaValue, screenVisible, icidentList, selectedTags } = props
  const { setScreenVisible, setTextareaValue, setSelectedTags, handleSaveRecord, setScreenData } = props
  const [isFull, setIsFull] = useState(false)
  useEffect(() => {
    console.log(icidentList)
  }, [])
  // const [selectedTags, setSelectedTags] = useState(['1', '2'])

  const handleSetTextareaValue = useCallback(() => {
    console.log(666)
    const value = textarea.current.value
    console.log(value)
    if (type === 2) {

      setTextareaValue(value)
    }
  }, [type, textarea])


  const handleChangeCheck = useCallback((id, checked) => {
    if (type === 2) {
      const nextSelectedTags = checked ? [...selectedTags, id] : selectedTags.filter(t => t !== id);
      setSelectedTags(nextSelectedTags);
      console.log(nextSelectedTags)
    }
  }, [selectedTags])
  const oncancelbutton = () => {
    setScreenVisible(false)
    let newdata = JSON.parse(JSON.stringify(data))
    newdata.remark = ''
    setScreenData(newdata)
  }
  return (
    <Modal
      className='xm-screenbox'
      title="巡课记录"
      style={{ top: 85 }}
      width={800}
      visible={screenVisible}
      onCancel={() => oncancelbutton()}
    >
      <p className='xm-sceen-hr' />
      <div className='xm-screen-content'>
        <div className='xm-imgbox'>
          <div
            style={{ cursor: 'pointer', position: 'absolute', width: '50px', padding: '8px', right: '95px', top: '85px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}
            onClick={() => {
              setIsFull(true)
            }}
          >
            <img style={{ width: '100%' }} src={fullScreenImg} alt='' />
          </div>
          <img src={type === 2 ? data.imgUrl : G.serverUrl + '/pic/findById/' + data.imgUrl + '/' + orgCode} alt='' />
        </div>
        <div className='xm-checkableTag'>
        {
          type === 2 ? (
            icidentList && icidentList[0] && icidentList.map(item => {
              return (
               
                  <CheckableTag
                    key={item.icidentId}
                    checked={selectedTags ? selectedTags.indexOf(item.icidentId) > -1 : []}
                    onChange={checked => handleChangeCheck(item.icidentId, checked)}
                  >
                    {item.icidentName}
                  </CheckableTag>
           

              )
            })
          ) : (
              data.icidentList && data.icidentList[0] && data.icidentList.map(item => {
                return (
                  <CheckableTag
                    key={item.icidentId}
                    checked={selectedTags ? selectedTags.indexOf(item.icidentId) > -1 : []}
                  >
                    {item.icidentName}
                  </CheckableTag>
                )
              })
            )
        }
        </div>
        
        <div className='xm-screen-content-textarea'>
          <textarea className='xm-textarea' placeholder={type === 2 ? '请输入备注（非必填）' : ''} value={data.remark} ref={textarea} onChange={handleSetTextareaValue} />
        </div>
        {
          type === 2 ? (
            <>
              <Button type='primary' onClick={() => handleSaveRecord()}>确定</Button>
              <Button className='xm-btn-cancel' onClick={() => oncancelbutton()}>取消</Button>
            </>
          ) : null
        }
      </div>
      <div className='xm-fullSceen' style={{ display: isFull ? 'block' : 'none' }}>
        <div className='xm-imgbox'>
          <img src={type === 2 ? data.imgUrl : G.serverUrl + '/pic/findById/' + data.imgUrl + '/' + orgCode} alt='' />
        </div>

        <p onClick={() => setIsFull(false)}>x</p>
      </div>
    </Modal>
  )
}

export default Screen