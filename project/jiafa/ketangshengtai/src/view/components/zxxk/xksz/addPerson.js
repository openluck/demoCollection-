/*
 * @Author: your name
 * @Date: 2021-07-29 10:47:39
 * @LastEditTime: 2021-10-11 16:30:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Table, message } from "antd";

import './../../../../style/zxxk/xksz/mj-addPerson.scss';
import { stringify } from 'uuid';

export default function AddPerson(props) {
  const [dataSource, setDataSource] = useState([]); //表格数据
  const [total, setTotal] = useState(0);  // 表格数据总数
  const [pageIndex, setPageIndex] = useState(1);  //页码
  const [selectedInit, setSelectedInit] = useState([]);  //选中项初始化
  const [selectedLists, setSelectedLists] = useState([]);  //选中项
  const [selectedIds, setSelectedIds] = useState([]);  //选中项id
  const [searchKey, setSearchKey] = useState(''); //搜索值
  const [isColle, setIsColle] = useState(false); //是否是年级主任

  const columns = [
    { title: '姓名', dataIndex: 'userName', key: 'userName', ellipsis: true },
    { title: '教职工编号', dataIndex: 'cardId', key: 'cardId', ellipsis: true },
    { title: '行政机构', dataIndex: 'orgName', key: 'orgName', ellipsis: true, render: (text) => <span>{text || '-'}</span> },
    { title: '教学机构', dataIndex: 'insName', key: 'insName', ellipsis: true, render: (text) => <span>{text || '-'}</span> },
  ];
  const rowSelection = {
    type: 'checkbox ',
    getCheckboxProps: (record) => getCheckboxProps(record),
    selectedRowKeys: selectedIds,
    onSelect: (record, selected) => listSelect(record, selected),
    onSelectAll: (selected) => listSelectAll(selected),
  }

  /**
   * @desc 更新表格数据
   */
  useEffect(() => {
    const { list } = props;
    if (JSON.stringify(list) !== JSON.stringify(dataSource)) {
      setDataSource([]);
      const listArr = JSON.parse(JSON.stringify(list));
      let arr = [], arrId = [];
      listArr.map(item => {
        if (item.isChecked === 1) {
          arr.push(item);
          arrId.push(item.userId);
        }
      })
      setSelectedInit(arr);
      setSelectedLists(arr);
      setSelectedIds(arrId);
      setDataSource(list);
    }
  }, [props.list])
  useEffect(() => {
    const { listTotal } = props;
    if (listTotal !== total) {
      setTotal(listTotal);
    }
  }, [props.listTotal])
  useEffect(() => {
    const { isCollege } = props;
    // console.log(isCollege);
    if (isCollege !== isColle) {
      setIsColle(isCollege);
    }
  }, [props.isCollege])


  /**
   * @desc 表格单项选中
   * @param {JSON} record 选择项
   * @param {Boolean} selected true选中 false取消选中 
   */
  const listSelect = (record, selected) => {
    // console.log(record, selected);
    let list = [], listId = [];
    if (selected) {
      list = JSON.parse(JSON.stringify(selectedLists));
      list.push(record)
      listId = JSON.parse(JSON.stringify(selectedIds));
      listId.push(record.userId);
    } else {
      selectedLists.map(item => {
        if (item.userId !== record.userId) {
          list.push(item);
          listId.push(item.userId);
        }
      })
    }
    setSelectedLists(list);
    setSelectedIds(listId);
  }

  /**
   * @desc 表格全选
   * @param {Boolean} selected  true选中 false取消选中
   */
  const listSelectAll = (selected) => {
    // console.log(selected);
    let list = [], listId = [], seleInit = JSON.parse(JSON.stringify(selectedInit));
    if (selected) {
      list = dataSource;
      dataSource.map(item => {
        listId.push(item.userId);
      })
    } else {
      seleInit.map(item => {
        listId.push(item.userId);
      })
      list = seleInit;
    }
    // console.log(list);
    setSelectedLists(list);
    setSelectedIds(listId);
  }

  /**
   * @desc 页码切换
   * @param {Number} page 页码
   */
  const pageChan = (page) => {
    setPageIndex(page);
    props.getUserLists(page, searchKey);
  }

  /**
   * @desc 输入框变化
   * @param {JSON} event 输入框值
   */
  const searchChan = (event) => {
    const val = event.target.value;
    setSearchKey(val);
  }
  /**
   * @desc 点击搜索
   */
  const onSearch = () => {
    setDataSource([]);
    setPageIndex(1);
    props.getUserLists(1, searchKey);
  }

  /**
   * @desc 点击确定/取消
   * @param {Boolean} type false点击取消
   */
  const dataSure = (type) => {
    if (type) {
      if (selectedLists.length > selectedInit.length) {
        props.onOk(selectedLists);
      } else message.warning('请先选择人员！');
    }
    else props.onCancel();
  }

  /**
   * @desc 教学机构为空不可选
   * @param {*} record 行数据
   */
  const getCheckboxProps = (record) => {
    console.log();
    return { disabled: (isColle && !record.insName) || record.isChecked ? true : false }
    // return { disabled: (!record.insName && isColle) || record.isChecked ? true : false }
  }

  // console.log(selectedIds);
  return <Modal
    className="mj-ap-addPerson"
    width='820px'
    title="添加人员"
    visible={props.visible}
    footer={null}
    //  onOk={handleOk} 
    onCancel={() => dataSure(false)}
  >
    <div className="mj-ap-content">
      <div className="mj-ap-topCon">
        <label>{`已选中${selectedLists.length || 0}条数据`}</label>
        <div>
          <Input
            placeholder="职工姓名/编号"
            onChange={(e) => searchChan(e)}
            onPressEnter={() => onSearch()}
          />
          <Button onClick={() => onSearch()}>查询</Button>
        </div>
      </div>

      <div className="mj-ap-tableCon">
        <Table
          rowKey={(record) => record.userId}
          bordered={true}
          scroll={{ y: '400px' }}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            showSizeChanger: false,
            defaultPageSize: 20,
            current: pageIndex,
            total,
            showTotal: total => `当前显示 ${dataSource.length || 0} 条，共${total}条`,
            onChange: (page) => pageChan(page)
          }}
          rowSelection={rowSelection}
        />
      </div>

      <div className="mj-ap-btnCon">
        <Button onClick={() => dataSure(true)}>确定</Button>
        <Button onClick={() => dataSure(false)}>取消</Button>
      </div>
    </div>
  </Modal>
}