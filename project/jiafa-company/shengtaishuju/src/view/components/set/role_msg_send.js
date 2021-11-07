/*
 * @Author: kyl 
 * @Date: 2021-01-18 15:44:52 
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-08 12:57:45
 */

import React, { useState, useEffect } from 'react';
import { withRouter, useParams, Link } from "react-router-dom";
import { Tabs, Table, Modal, Input, Button } from 'antd';
import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from '../../public/svg';
import { connect } from 'react-redux';
import { kyl_queryRole, kyl_queryAllRole, kyl_add_role, kyl_change_tab, kyl_del_role, kyl_get_role_list, kyl_set_phone, clean_data } from '../../../redux/kyl-role.reducer';
import CollageNoData from '../image/college_image/collegeNoData';
import Fy from '../../public/fy';
import _ from 'lodash';

const { TabPane } = Tabs;
const Role_Send_Comp = (props) => {
  const [curId, setCurId] = useState([]);
  const [data, setData] = useState([]);
  const [oldData, setOldData] = useState([]);
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'left',
      render: (text, record) => {
        return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
      }
    },
    {
      title: '证件号',
      dataIndex: 'idCard',
      align: 'left',
      render: (text, record) => {
        return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
      }
    },
    {
      title: '行政机构',
      dataIndex: 'admOrgName',
      align: 'left',
      render: (text, record) => {
        return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
      }
    },
    {
      title: '教学机构',
      dataIndex: 'teachOrgName',
      align: 'left',
      render: (text, record) => {
        return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
      }
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'left',
      render: (text, record) => {
        // console.log(curId)
        return <div className='kyl-roleMsgSend-operate'>
          <input placeholder='请输入' maxLength={11}
            className={`kyl-${record.id}`}
            style={{ border: curId.indexOf(record.id) > -1 ? '1px solid #3498db' : '1px solid #d7dcde' }}
            value={record.phone ? record.phone : ''}
            onChange={(e) => changeData(e.target.value, record)}
            onFocus={(e) => {
              let i = _.cloneDeep(curId);
              if (i.indexOf(record.id) === -1) {
                i.push(record.id)
                setCurId(i);
              }
            }}></input>
          {
            curId.indexOf(record.id) > -1 ?
              <div>
                <SVG type='queding' title={'确定'}
                  onClick={() => {
                    let i = _.cloneDeep(curId);
                    let idx = i.indexOf(record.id);
                    _.pull(i, i[idx]);
                    setCurId(i)
                    props.kyl_set_phone({ id: record.id, phone: document.getElementsByClassName(`kyl-${record.id}`)[0].value });
                  }}
                  width={20} height={20} color={'#06ba49'}></SVG>
                <SVG type='quxiao' title={'取消'}
                  onClick={() => {
                    let i = _.cloneDeep(curId);
                    let idx = i.indexOf(record.id);
                    _.pull(i, i[idx]);
                    setCurId(i)
                    backToData(record.id);
                  }}
                  width={20} height={20} color={'#ff3f3f'}></SVG>
              </div> : null
          }
        </div>
      }
    }

  ]

  useEffect(() => {
    props.kyl_get_role_list('2');
  }, [])

  useEffect(() => {
      setData(props.list);
      setOldData(props.list);
  }, [props.list])

  //返回原数据的电话
  const backToData = (id) => {
    console.log(oldData);
    let datas = _.cloneDeep(oldData);
    let datat = _.cloneDeep(data);
    let val = datas[_.findIndex(datas, { id })].phone;  //旧值
    datat[_.findIndex(datat, { id })].phone = val;      //用于展示的数据
    setData(datat);
  }

  //改变展示数据的值
  const changeData = (val, record) => {
    let datas = _.cloneDeep(data);
    datas[_.findIndex(datas, { id: record.id })].phone = val;
    setData(datas);
  }

  const callback = (v) => {
    props.clean_data(v)
  }

  return <div className='kyl-setting-comp'>
    <Tabs activeKey={props.roleId} onChange={callback}>
      { 
        props.roleList.map((item) => {
          return <TabPane tab={item.roleName} key={item.roleId}>
          <div style={{height:'100%',paddingBottom:20}}>
          <PerfectScrollbar>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={data}
              loading={props.loading}
              pagination={false}
              locale={{ emptyText: <CollageNoData /> }}
              className={'ll-aT-table'}
              style={{ marginTop: 20 }}
            />
            </PerfectScrollbar>
            </div>

          </TabPane>
        })
      }
    </Tabs>
  </div>
}

export default connect(
  state => {
    console.log(state.kyl_role_reducer)
    return {
      list: state.kyl_role_reducer.list,
      loading: state.kyl_role_reducer.loading,
      allRole: state.kyl_role_reducer.allRole,
      allLoading: state.kyl_role_reducer.allLoading,
      roleId: state.kyl_role_reducer.roleId,
      roleList: state.kyl_role_reducer.roleList
    }
  },
  { kyl_queryAllRole, kyl_queryRole, kyl_add_role, kyl_change_tab, kyl_del_role, kyl_get_role_list, kyl_set_phone, clean_data }
)(Role_Send_Comp)
