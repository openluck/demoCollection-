/*
 * @Author: MinJ
 * @Date: 2020-07-23 14:42:30
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-20 16:27:33
 */
import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import SVG from './../public/public-component-svg';

import './../../style/breadCrumb.scss';
const { Option } = Select;

export function TpkBreadCrumb(props) {
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState('');

  useEffect(() => {
    const semesters = JSON.parse(sessionStorage.getItem('semesters')),
      semesterId = semesters && semesters.length ? semesters[0].id : '';
    // console.log(semesters);

    props.semesterChan(semesterId);
    setSemesters(semesters);
    setSemesterId(semesterId);
  }, [])

  /**
   * @desc 学期切换
   * @param {*} value 学期id
   */
  const semesterChan = (value) => {
    setSemesterId(value);
    props.semesterChan(value);
  }

  return <div className='mj-tbc-content'>
    <Select
      onChange={(value) => semesterChan(value)}
      suffixIcon={<SVG type='xl' />}
      value={semesterId}
      dropdownClassName='mj-tbc-drop'
      bordered={false}>
      {
        semesters.length ?
          semesters.map(item => {
            return <Option key={item.id} value={item.id}>{item.name}</Option>
          }) : null
      }
    </Select>
  </div>
}