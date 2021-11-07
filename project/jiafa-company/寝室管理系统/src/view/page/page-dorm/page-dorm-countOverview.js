/*
 * @Author: xq 
 * @Date: 2021-01-08 13:27:57 
 * @Last Modified by: luolei
 * @Last Modified time: 2021-01-18 17:17:39
 * @desc 在寝管理 - 在寝统计 - 学校总览
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import SchoolOverview from '../../components/dormManage/schoolOverview'
import { PublicTbs } from './../../components/common'
export default withRouter( props => {
    return (
        <>
            <PublicTbs menuPath={['dorm','count','countOverview']} />
            <SchoolOverview />
        </>
    )
})
