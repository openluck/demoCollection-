/*
 * @Author: lxx 
 * @Date: 2020-03-02 16:30:28 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-02-07 17:21:41
 * 顶部人员切换
 */
import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { Select } from 'antd';
import { withRouter } from "react-router-dom";
import G from './../../config/g';
// import { setConfig } from './../../util/request'

const { Option } = Select;


const RoleChange = (props) => {
  const [selValue, setSelValue] = useState(''); // 当前用户选中

  useEffect(() => {
    let curInfo = G.ISCED_curRoleInfo;
    if (curInfo) {
      setSelValue(curInfo.roleId)
    }
  })

  /**
   * 切换角色 跳转loading页重新加载数据
   * @param {String} value 
   */
  function changeSel (value) {
    let t = _.find(G.ISCED_roleData.roleData, { roleId: value });
    console.log(t)
    if (t && value !== selValue) {
      // 存在角色id，并与当前选中id不同
      new Promise((resolve, reject) => {
        setSelValue(value)
        G.ISCED_curRoleInfo = t;
        // setConfig(G.dataService, G.ISCED_token)
        resolve();
      }).then(() => {
        // 跳转loading，获取部分公共数据
        props.history.push('/loading/1')
      })
    }
  }
  return <>
    <span>{G.ISCED_roleData.userName}</span>
    <Select
      style={{ width: 95 }}
      value={selValue}
      onChange={changeSel}
      dropdownClassName={"lxx-switchRole-down"}
    >
      {
        G.ISCED_roleData && G.ISCED_roleData.roleData.length
        && G.ISCED_roleData.roleData.map(item => {
          return <Option key={item.roleId} title={item.roleName}>{item.roleName}</Option>
        })
      }
    </Select>
  </>
}

export default withRouter(RoleChange);
