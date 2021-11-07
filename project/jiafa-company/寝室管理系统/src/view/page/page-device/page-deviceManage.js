/*
 * @Author: xq 
 * @Date: 2021-01-08 13:26:56 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-01-12 14:19:59
 * @desc 设备管理
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import PageDevice from './../../components/components-device/page-device'
export default withRouter( props => {
    return <div style={{height:'100%'}}><PageDevice></PageDevice></div>
})
