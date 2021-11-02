/*
 * @Author: JC.Liu 
 * @Date: 2019-02-26 12:02:58 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-29 08:56:04
 * 老师 - 教学检查
 */

import React, { Component } from 'react';
import Edutitle from '../../components/jxfs/Edutitle.jsx';
import TeachingOrder from '../../components/jxfs/teachingOrder';
import TeachingQuality from '../../components/jxfs/teachingQuality';
import Timetable from '../../components/jxfs/timetable';
import Search from '../../components/jxfs/search'

import './../../../style/tpk/jxfs.scss'

class JxfsIndex extends Component {
  render() {
    return (
      <div className='clearfix' style={{ background: '#fff' }}>
        <Search />
        <Edutitle />
        <TeachingOrder />
        <TeachingQuality />
        <Timetable />
      </div>
    )
  }
}

export default JxfsIndex;
