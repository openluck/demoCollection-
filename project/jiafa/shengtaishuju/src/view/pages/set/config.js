/*
 * @Author: lxx 
 * @Date: 2021-01-14 11:14:10 
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-18 16:15:32
 * 角色分配
 */
import React, { useState, useEffect } from 'react'
import RoleComp from '../../components/set/role_comp';
import '../../../style/kyl_msg_setting.scss'
const Config = (props) => {
    return <div className='kyl-msg-box'>
        <RoleComp></RoleComp>
    </div>
}
export default Config;