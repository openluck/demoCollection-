/*
 * @Author: xq 
 * @Date: 2021-01-08 13:30:27 
 * @Last Modified by: luolei
 * @Last Modified time: 2021-01-20 09:40:24
 * @desc 在寝管理 - 在寝统计 - 班级报告
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import ClassOrBuildingReport from '../../components/dormManage/classOrBuildingReport'
import { PublicTbs } from './../../components/common'

export default withRouter(props => {
    return <>
        <PublicTbs menuPath={['dorm', 'count', 'countClass']} />
        <ClassOrBuildingReport type={1} />
    </>
})
