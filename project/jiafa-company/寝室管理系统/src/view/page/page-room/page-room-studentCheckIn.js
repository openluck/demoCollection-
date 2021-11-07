/*
 * @Author: xq 
 * @Date: 2021-01-08 13:21:54 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-03-25 09:21:40
 * @desc 住宿管理 - 学生入住管理
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import './../../../style/studentRoomManage.scss'
import StudentRoomManage from './../../components/component-room-studentRule/component-room-studentRoomManage'
export default withRouter( props => {
    return <div id='yhc-studentRoom'><StudentRoomManage></StudentRoomManage></div>
})
