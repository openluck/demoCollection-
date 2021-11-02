/*
 * @Author: xq 
 * @Date: 2021-01-08 13:24:57 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-01-21 17:00:44
 * @desc 住宿管理 - 房间规则 - 男女宿舍设置
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import StudentRule from '../../components/component-room-studentRule/component-room-studentRule'
export default withRouter( props => {
    return <div style={{width:'100%',height:'100%'}}>
            <StudentRule />
        </div>
})
