/*
 * @Author: xq 
 * @Date: 2021-01-08 13:31:27 
 * @Last Modified by: luolei
 * @Last Modified time: 2021-01-20 09:40:33
 * @desc 在寝管理 - 在寝统计 - 楼栋报告
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import ClassOrBuildingReport from '../../components/dormManage/classOrBuildingReport'
import { PublicTbs } from './../../components/common'

export default withRouter(props => {
    return <>
        <PublicTbs menuPath={['dorm', 'count', 'countBuilding']} />
        <ClassOrBuildingReport type={2} />
    </>
})
