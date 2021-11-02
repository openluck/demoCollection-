/*
 * @Author: your name
 * @Date: 2021-07-29 10:47:39
 * @LastEditTime: 2021-09-27 17:11:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Table, Tree, message } from "antd";
const { TreeNode } = Tree;

import { flattenTreeDataClosure, findParent } from './../../../data/zxxk/ryapReq';
import './../../../../style/zxxk/xksz/mj-setPlace.scss';

export default function AddPlace(props) {
  const [treeData, setTreeData] = useState([]); // 树数据处理
  const [treeLists, setTreeLists] = useState([]); // 树数据 平级列表
  const [expandedKeys, setExpandedKeys] = useState([]); //展开的树节点
  const [expandedToSele, setExpandedToSele] = useState([]);//当前选中节点的父节点
  const [checkedItem, setCheckedItem] = useState([]);//当前选中节点的父级
  const [checkedKeys, setCheckedKeys] = useState([]); //选中节点

  const [dataSource, setDataSource] = useState([]); //表格数据
  const [total, setTotal] = useState(0);  // 表格数据总数
  const [pageIndex, setPageIndex] = useState(1);  //页码
  const [selectedInit, setSelectedInit] = useState([]);  //选中项初始化
  const [deleteList, setDeleteList] = useState([]);  //删除 已设置的场所(要进行删除的)
  const [selectedLists, setSelectedLists] = useState([]);  //选中项（要进行添加的）
  const [selectedIds, setSelectedIds] = useState([]);  //选中了的id
  const [searchKey, setSearchKey] = useState(''); //搜索值

  const treeList = (list) => {
    return list.map(item => {
      if (item.children && item.children.length) {
        return <TreeNode
          key={item.value}
          title={
            <div className="mj-sp-treeTitle">
              <span>{item.title}</span>
              <span>{`(${item.placeNum}间)`}</span>
            </div>
          }
          parentId={item.parentId}
          // selectable={item.type !== 3 ? false : true}
          treeType={item.type}
          value={item.value}
        >
          {treeList(item.children)}
        </TreeNode>
      } else {
        return <TreeNode
          key={item.value}
          // selectable={item.type !== 3 ? false : true}
          treeType={item.type}
          title={
            <div className="mj-sp-treeTitle">
              <span>{item.title}</span>
              <span>{`(${item.placeNum}间)`}</span>
            </div>
          }
          parentId={item.parentId}
          value={item.value} />
      }
    })
  }

  const columns = [
    { title: '场所名称', dataIndex: 'placeName', key: 'placeName', ellipsis: true },
    { title: '场所地址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '容量', dataIndex: 'capacity', key: 'capacity', },
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
    const fetchData = async () => {
      const { treeList } = props;
      // const treeList = JSON.parse(JSON.stringify(props.treeList));
      // console.log(JSON.stringify(treeList), JSON.stringify(treeData));
      if (JSON.stringify(treeList) !== JSON.stringify(treeData)) {
        const list = await flattenTreeDataClosure(treeList);
        //找到起对应的所有父级id
        let seleId = '';
        list.map(item => {
          if (item.type === 3 && seleId === '') {
            seleId = item.value;
          }
        })
        const { parentArr, arr } = await findParent(seleId, list);

        setExpandedKeys(parentArr)
        setExpandedToSele(parentArr)
        setCheckedKeys([seleId])
        setCheckedItem(arr);
        setTreeLists(list);
        setTreeData(treeList);
      }
    }
    fetchData();
  }, [props.treeList])
  useEffect(() => {
    const { list } = props;
    if (JSON.stringify(list) !== JSON.stringify(dataSource)) {
      let arr = [], arrId = [];
      list.map(item => {
        if (item.isChecked === 1) {
          arr.push(item);
          arrId.push(item.placeId);
        }
      })
      // console.log();
      setSelectedInit(arr);
      setSelectedLists([]);
      // setSelectedLists(arr);
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


  /**
   * @desc 树节点选中
   * @param {String} checkedKeys 选中节点
   * @param {JSON} e 节点相关
   */
  const treeSele = async (checkedKeys, e) => {
    // console.log(checkedKeys);
    // console.log( e);
    if (e.selected) {
      const { treeType } = e.node;
      const list = JSON.parse(JSON.stringify(treeLists))
      const { parentArr, arr } = await findParent(checkedKeys[0], list);
      // console.log(parentArr);
      let val = treeType === 3 ? checkedKeys[0].match(/\/(\S*)/)[1] : '';

      props.getPlaceLists(parentArr[1] || '', parentArr[2] || '', val, '', 1);
      setExpandedToSele(parentArr)
      setCheckedItem(arr)
      setSearchKey('');
      setPageIndex(1);
      setCheckedKeys(checkedKeys);
    }
  }
  const treeExpend = (keys) => {
    setExpandedKeys(keys)
  }

  /**
   * @desc 表格单项选中：区分：未设置的选中，已设置的取消，已设置的取消后再次选中
   * @param {JSON} record 选择项  
   * @param {Boolean} selected true选中 false取消选中 
   */
  const listSelect = (record, selected) => {
    let list = [], listId = [], deleList = [];
    // console.log(selected);
    let index = selectedInit.findIndex(item => {
      return record.placeId === item.placeId;
    })
    //不是已设置的场所
    if (index === -1) {
      if (selected) {//选中 - 则添加至selectedLists、selectedIds
        list = JSON.parse(JSON.stringify(selectedLists));
        list.push(record);

        listId = JSON.parse(JSON.stringify(selectedIds));
        listId.push(record.placeId);
      } else {//取消选中 - 则从selectedLists、selectedIds中移除
        selectedLists.map(item => {
          if (item.placeId !== record.placeId) {
            list.push(item);
          }
        })
        selectedIds.map(item => {
          if (item !== record.placeId) {
            listId.push(item);
          }
        })
      }
    } else {//已设置场所选择
      if (selected) {//选中 - 则从 deleteList 中移除
        listId = JSON.parse(JSON.stringify(selectedIds))
        deleteList.map(item => {
          if (item.placeId !== record.placeId) {
            deleList.push(item);
          }
        })
        listId.push(record.placeId);
      } else {//取消选中 - 则添加至deleteList,并从selectedIds中删除
        deleList = JSON.parse(JSON.stringify(deleteList))
        deleList.push(record);

        selectedIds.map(item => {
          if (item !== record.placeId) {
            listId.push(item);
          }
        })
      }
    }
    // console.log(list, listId, deleList);
    setSelectedLists(list);
    setSelectedIds(listId);
    setDeleteList(deleList);
  }
  /**
   * @desc 表格全选：全部未设置全选，部分已设置全选，全选取消,
   * @param {Boolean} selected  true选中 false取消选中
   */
  const listSelectAll = (selected) => {
    // console.log(selected);
    let list = [], listId = [], deleList = [];

    if (selected) {
      if (!selectedInit.length) {//全部未设置 - 则全部添加至 selectedLists  
        list = JSON.parse(JSON.stringify(dataSource));
        dataSource.map(item => {
          listId.push(item.placeId);
        })
      } else {//部分已设置全选 - 则非 selectedInit 的添加至 selectedLists
        dataSource.map(item => {
          let index = selectedInit.findIndex(initItem => {
            return initItem.placeId === item.placeId;
          })
          if (index === -1) {
            list.push(item)
          } 
          listId.push(item.placeId);
        })
      }
    } else {//取消全选 - 则 selectedLists、selectedIds为空， deteLelist 为初始化数据
      deleList = JSON.parse(JSON.stringify(selectedInit))
    }
    // console.log(list, deleList);
    setSelectedLists(list);
    setSelectedIds(listId);
    setDeleteList(deleList);
  }

  /**
   * @desc 页码切换
   * @param {Number} page 页码
   */
  const pageChan = async (page) => {
    setPageIndex(page);
    
    const list = JSON.parse(JSON.stringify(treeLists))
    const { parentArr, arr } = await findParent(checkedKeys[0], list);
    let val = parentArr[3] ? parentArr[3].match(/\/(\S*)/)[1] : '';

    props.getPlaceLists(parentArr[1] || '', parentArr[2] || '', val || '', searchKey, page);
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
  const onSearch = async () => {
    const list = JSON.parse(JSON.stringify(treeLists))
    const { parentArr, arr } = await findParent(checkedKeys[0], list);
    let val = parentArr[3] ? parentArr[3].match(/\/(\S*)/)[1] : '';

    props.getPlaceLists(parentArr[1] || '', parentArr[2] || '', val || '', searchKey, 1);
    setPageIndex(1);
  }

  /**
   * @desc 点击确定/取消
   * @param {Boolean} type false点击取消
   */
  const dataSure = async (type) => {
    if (type) {
      // if (selectedLists.length || deleteList.length) {
        const params = await getParams();
        let data = JSON.parse(JSON.stringify(selectedLists));
        let deleData = JSON.parse(JSON.stringify(deleteList));
        let lists = [], deleLsts = [];
        data.map(item => {
          lists.push({ ...params, ...{ classroomId: item.placeId, classroomName: item.placeName } })
        })
        deleData.map(item => {
          deleLsts.push({ ...params, ...{ classroomId: item.placeId, classroomName: item.placeName } })
        })
        // console.log(lists, deleLsts);
        props.onOk(lists, deleLsts);
      // } else {
      //   message.warning('请先选择场所！')
      // }
    } else props.onCancel();
  }
  /**
   * @desc 根据树选中，拆分出各字段
   */
  const getParams = () => {
    let campusId = '', buildingId = '', floorId = '',
      campusName = '', buildingName = '', floorName = '';
    const seleList = JSON.parse(JSON.stringify(checkedItem));
    seleList.map(item => {
      if (item.type === 1) {
        campusId = item.value;
        campusName = item.title;
      } else if (item.type === 2) {
        buildingId = item.value;
        buildingName = item.title;
      } else if (item.type === 3) {
        let val = item.value;
        floorId = val.match(/\/(\S*)/)[1];
        floorName = item.title;
      }
    })
    return { campusId, buildingId, floorId, campusName, buildingName, floorName }
  }

  /**
   * @desc 教学机构为空不可选
   * @param {*} record 行数据
   */
  const getCheckboxProps = (record) => {
    return { disabled: false }
    // return { disabled: record.insName === '' || record.isChecked ? true : false }
  }

  // console.log(selectedLists);
  return <Modal
    className="mj-sp-addPerson"
    width='1020px'
    title="设置范围"
    visible={props.visible}
    footer={null}
    onCancel={() => dataSure(false)}
  >
    <div className="mj-sp-content">
      {/* 树 */}
      <div className="mj-sp-treeCon">
        <label>选择场所</label>
        <Tree
          showLine={true}
          showIcon={false}
          selectedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onExpand={(expandedKeys) => treeExpend(expandedKeys)}
          onSelect={(checkedKeys, e) => treeSele(checkedKeys, e)}
        >
          {treeList(treeData)}
        </Tree>
      </div>

      {/* 列表 */}
      <div className='mj-sp-rightCon'>
        <div className="mj-sp-rightTop">
          <label>{`已选中${selectedLists.length}条数据`}</label>
          <div>
            <Input
              placeholder="场所名称"
              value={searchKey}
              onChange={(e) => searchChan(e)}
              onPressEnter={() => onSearch()}
            />
            <Button onClick={() => onSearch()}>查询</Button>
          </div>
        </div>

        <div className="mj-sp-tableCon">
          <Table
            rowKey={(record) => record.placeId}
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

        <div className="mj-sp-btnCon">
          <Button onClick={() => dataSure(true)}>确定</Button>
          <Button onClick={() => dataSure(false)}>取消</Button>
        </div>
      </div>
    </div>
  </Modal>
}