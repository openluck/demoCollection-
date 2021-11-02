/*
 * @Author: kyl 
 * @Date: 2021-01-18 15:44:52 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-31 10:05:41
 */

import React, { useState, useEffect } from 'react';
import { withRouter, useParams, Link } from "react-router-dom";
import { Tabs, Table, Modal, Input, Button } from 'antd';
import SVG from '../../public/svg';
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from 'react-redux';
import { kyl_queryRole, kyl_queryAllRole, kyl_add_role, kyl_change_tab, kyl_del_role, kyl_get_role_list } from '../../../redux/kyl-role.reducer';
import CollageNoData from '../image/college_image/collegeNoData';
import Fy from '../../public/fy';
import _ from 'lodash';

const { TabPane } = Tabs;

const RoleComp = (props) => {
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState({
    pageNum: 1, pageSize: 20, searchText: ''
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
      title: '操作',
      dataIndex: 'operate',
      align: 'left',
      render: (text, record) => {
        return <div style={{ cursor: 'pointer' }} onClick={() => remove(record.id)}><SVG type={'yichu'}></SVG>&nbsp;移除</div>
      }
    }
  ]


  const remove = (id) => {
    Modal.confirm({
      content: '是否确认移除？',
      onOk: () => {
        props.kyl_del_role({ id, roleId: props.roleId })
      },
    })
  }

  useEffect(() => {
    props.kyl_get_role_list('1');
  }, [])

  const callback = (v) => {
    props.kyl_change_tab(v)
  }

  const changeSel = (val, type) => {
    let clonePar = _.cloneDeep(params);
    clonePar[type] = val;
    setParams(clonePar);
    props.kyl_queryAllRole(clonePar);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (v) => { setSelectedRowKeys(v) },
    getCheckboxProps: record => {
      return {
        disabled: record.disabled
      }
    }
  };

  const operate = (type) => {
    if (type == '1') {
      props.kyl_add_role({ id: selectedRowKeys, roleId: props.roleId })
    }
    setVisible(false);
    setSelectedRowKeys([]);
    let clonePar = _.cloneDeep(params);
    clonePar.searchText = '';
    clonePar.pageNum = 1;
    setParams(clonePar);
  }


  return <div className='kyl-setting-comp'>
    <Tabs activeKey={props.roleId} onChange={callback}>
      {
        props.roleList.map((item) => {
          return <TabPane tab={item.roleName} key={item.roleId}>
            <div className='kyl-add-role'><span onClick={() => {
              setVisible(true)
              props.kyl_queryAllRole({ ...params, searchText: '' });
            }}>
              <SVG
                type='xinzeng'
                width={18}
                height={18}
                color='#59a6ee'></SVG> 添加人员</span></div>
            <div style={{ height: 'calc(100% - 100px)', paddingBottom: 20 }}>
              <PerfectScrollbar>
                <Table
                  columns={columns}
                  rowKey={(record) => record.id}
                  dataSource={props.list}
                  loading={props.loading}
                  pagination={false}
                  locale={{ emptyText: <CollageNoData /> }}
                  className={'ll-aT-table'}
                />
              </PerfectScrollbar>
            </div>
            {
              props.liTotal
                ? <div style={{ color: '#888' }}>共 {props.liTotal} 条数据</div>
                : null
            }
          </TabPane>
        })
      }
    </Tabs>
    <Modal
      title='添加人员'
      visible={visible}
      width={800}
      className='kyl-reaModal'
      destroyOnClose
      onCancel={() => { operate('2') }}
      footer={[
        <Button key='qd' onClick={() => {
          operate('1')
        }}><SVG type='queding'></SVG>&nbsp;&nbsp; 确定</Button>,
        <Button key='qx' onClick={() => {
          operate('2')
        }}><SVG type='quxiao'></SVG>&nbsp;&nbsp; 取消</Button>
      ]}
    >
      <Input.Search
        placeholder='教师姓名'
        style={{ width: 261, marginBottom: 20 }}
        onSearch={(searchText) => {
          let clonePar = _.cloneDeep(params);
          clonePar.pageNum = 1;
          clonePar.searchText = searchText;
          setParams(clonePar);
          props.kyl_queryAllRole(clonePar);
        }} />
      <Table
        columns={columns.slice(0, 4)}
        rowKey={(record) => record.id}
        scroll={{ y: 300 }}
        dataSource={props.allRole}
        loading={props.loading}
        rowSelection={rowSelection}
        pagination={false}
        locale={{ emptyText: <CollageNoData /> }}
        className={'ll-aT-table'}
      />
      <Fy
        pageSize={params.pageSize}
        pageIndex={params.pageNum}
        total={props.total}
        jumpPage={(p) => changeSel(p, 'pageNum')}
      />
    </Modal>
  </div>
}

export default connect(
  state => {
    console.log(state.kyl_role_reducer)
    return {
      list: state.kyl_role_reducer.list,
      liTotal: state.kyl_role_reducer.liTotal,
      loading: state.kyl_role_reducer.loading,
      allRole: state.kyl_role_reducer.allRole,
      allLoading: state.kyl_role_reducer.allLoading,
      roleId: state.kyl_role_reducer.roleId,
      roleList: state.kyl_role_reducer.roleList,
      total: state.kyl_role_reducer.total
    }
  },
  { kyl_queryAllRole, kyl_queryRole, kyl_add_role, kyl_change_tab, kyl_del_role, kyl_get_role_list }
)(RoleComp)
