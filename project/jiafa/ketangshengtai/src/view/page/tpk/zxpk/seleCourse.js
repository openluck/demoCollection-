/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-31 09:42:57
 * 听评课V2.2——选择课程
 */

import React, { Component } from 'react';
import { BreadPonent } from './../../../components/topPonent';
import SeleCourseComp from './../../../components/tpk/zxpk/seleCourse';

export default class SeleCourse extends Component {
  render() {
    return <>
      <BreadPonent pages={['我的任务', '个人任务详情', '选择课程']} />

      <SeleCourseComp />
    </>;
  }
}
