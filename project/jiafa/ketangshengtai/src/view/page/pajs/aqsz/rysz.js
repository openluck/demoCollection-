/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-22 15:02:01
 * 人员设置
 */
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, message, Tooltip, Table, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SVG from './../../../public/public-component-svg';
const { confirm } = Modal;

import AddPerson from './../../../components/zxxk/xksz/addPerson';
import SetPlace from '../../../components/zxxk/xksz/setPlace';
import {
  getPermissionList, getArrangeList,
  getUserList, addUser, delectUser, getSchoolList, getPlaceList,
  setRange, flattenTreeDataClosure, findParent
} from './../../../data/pajs/ryszReq';
import './../../../../style/pajs/aqsz/aqszFormWorkNew.scss';

export default function Rysz() {
  const [permissionList, setPermissionList] = useState([]); //权限对应角色列表
  const [roleSele, setRoleSele] = useState({}); //  选中角色
  const [dataSource, setDataSource] = useState([]); //表格数据
  const [pageIndex, setPageIndex] = useState(1); //人员安排列表页码
  const [total, setTotal] = useState(0);//人员安排列表数据总数
  // 添加人员相关变量
  const [isAddPerson, setIsAddPerson] = useState(false); //是否弹出添加人员弹窗
  // const [addPageIndex, setAddPageIndex] = useState(0); //添加人员 - 页码
  const [addKeyword, setAddKeyword] = useState(''); //添加人员 - 搜索关键字
  const [addDataSource, setAddDataSource] = useState([]); //添加人员 - 列表数据
  const [addTotal, setAddTotal] = useState(0);  //添加人员 - 数据总数
  const [isCollege, setIsCollege] = useState(false);//添加人员 - 是否是院系角色
  //设置范围相关变量
  const [isSetPlace, setIsSetPlace] = useState(false);  //是否弹出设置范围弹窗
  const [setItem, setSetItem] = useState({}); //需设置范围的数据项
  const [setTreeData, setSetTreeData] = useState([]); // 设置范围 - 树数据
  const [dataSourceSet, setSetDataSource] = useState([]); //设置范围 - 列表数据
  const [totalSet, setSetTotal] = useState(0);  //设置范围 - 数据总数

  const columns = [
    { title: '姓名', dataIndex: 'userName', key: 'userName', width: '18%', ellipsis: true },
    {
      title: '巡课范围', dataIndex: 'sourExtent', key: 'sourExtent', ellipsis: true,
      render: (text, row) => {
        return <span>{text || '-'}</span>
      }
    },
    {
      title: '操作', dataIndex: 'option', key: 'option', align: 'center',
      width: '16%',
      render: (text, record) => {
        return <div className="mj-ryap-tableBtn">
          <div className="mj-ryap-btnHigh" onClick={() => addPlaceClick(record)}>
            <SVG type="dx01" />
            <label>设置范围</label>
          </div>
          <div className="mj-ryap-btnDele" onClick={() => deleUsersSure(record)}>
            <SVG type="sc" />
            <label>删除</label>
          </div>
        </div>
      }
    },
  ];

  useEffect(() => {
    getPermissionLists();
  }, [])

  /**
   * @desc 获取权限对应角色列表
   */
  const getPermissionLists = async () => {
    let { data } = await getPermissionList();
    if (data.code === '200') {
      const list = data.data,
        role = list.length ? list[0] : {};
      setRoleSele(role);
      setPermissionList(list);
      setPageIndex(1);
      role.roleId ? getArrangeLists(1, role.roleId) : null;
    } else {
      message.warning(data.message);
    }
  }

  /**
   * @desc 获取人员安排列表数据
   * @param {Number} pageIndex 当前页
   * @param {String} roleId 角色id
   */
  const getArrangeLists = async (pageIndex, roleId) => {
    let params = {
      pageIndex,
      pageSize: 20,
      roleId,
    }
    const { data } = await getArrangeList(params);
    if (data.code === '200') {
      let { list, pagenation } = data.data,
        { total } = pagenation;
      setDataSource(list)
      setTotal(total);
    } else {
      message.warning(data.message);
    }
  }

  /**
   * @desc 删除人员
   * @param {JSON} item 删除项
   */
  const deleUsersSure = (item) => {
    confirm({
      title: '确定删除该人员？',
      icon: <ExclamationCircleOutlined />,
      content: null,
      onOk() { deleUsers(item) },
      onCancel() { },
    });
  }
  const deleUsers = async (item) => {
    let params = {
      roleId: roleSele.roleId,
      userId: item.userId
    };
    const { data } = await delectUser(params);
    if (data.code === '200') {
      message.warning('删除成功！');
      const page = await toSurePage();
      setPageIndex(page);
      getArrangeLists(page, roleSele.roleId);
    } else {
      message.warning(data.message);
    }
  }
  /**
   * @desc 删除数据时确定页码
   */
  const toSurePage = () => {
    let page = 1;
    if (pageIndex === 1) {
      page = 1;
    } else {
      if (dataSource.length === 1) {
        page = pageIndex - 1;
      } else {
        page = pageIndex;
      }
    }
    return page;
  }

  /**
   * @desc 角色选中切换
   * @param {Object} params 选中项
   */
  const roleChan = (params) => {
    setRoleSele(params);
    setPageIndex(1);
    setIsCollege(params.roleId === 3 ? true : false);
    getArrangeLists(1, params.roleId);
  }

  /**
   * @desc 添加人员
   */
  const AddPersonClick = () => {
    getUserLists(1, '');
    // setAddPageIndex(1);
    setAddKeyword('');
    setIsAddPerson(true);
  }

  /**
   * @desc 添加人员 - 获取人员列表
   * @param {Number} pageIndex 页码
   * @param {String} keyword 搜索关键字
   */
  const getUserLists = async (pageIndex, keyword) => {
    let params = {
      pageIndex,
      pageSize: 20,
      roleId: roleSele.roleId,
      keyword
    }
    let { data } = await getUserList(params);
    if (data.code === '200') {
      const { list, pagenation } = data.data,
        { total } = pagenation;
      setAddDataSource(list);
      setAddTotal(total);
    } else {
      message.warning(data.message);
    }
  }

  /**
   * @desc 添加人员
   * @param {Array} list 选中人员列表
   */
  const addUsers = async (list) => {
    let params = {
      roleId: roleSele.roleId,
      userList: list
    };
    const { data } = await addUser(params);
    if (data.code === '200') {
      message.success('添加成功');
      setIsAddPerson(false);
      getArrangeLists(pageIndex, roleSele.roleId);
    } else {
      message.warning(data.message);
    }
  }

  /**
   * @desc 添加人员取消
   */
  const addCancel = () => {
    setIsAddPerson(false);
    setAddDataSource([]);
    setAddKeyword('');
    setAddTotal(0);
  }

  /**
   * @desc 设置范围 - 点击弹出弹窗
   * @param {JSON} record 设置项
   */
  const addPlaceClick = (record) => {
    setIsSetPlace(true);
    setSetItem(record);
    // console.log(record);
    getTreeData(record.userId);
  }
  /**
   * @desc 获取权限场所树
   * @param {String} userId 人员id
   */
  const getTreeData = async (userId) => {
    let params = {
      userId,
      roleId: roleSele.roleId,
    }
    const { data } = await getSchoolList(params);
    if (data.code === '200') {
      const list = data.data || [];
      setSetTreeData(list);

      const lists = await flattenTreeDataClosure(list);
      let seleId = '';
      lists.map(item => {
        if (item.type === 3 && seleId === '') {
          seleId = item.value;
        }
      })
      const { parentArr } = await findParent(seleId, lists);
      let val = seleId.match(/\/(\S*)/)[1];
      // console.log(parentArr);
      getPlaceLists(parentArr[1], parentArr[2], val, '', 1, userId);
    } else {
      message.warning(data.message);
    }
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
   * @desc 获取场所树下场所列表
   * @param {String} campusId 校区id
   * @param {String} buildingId 楼栋id
   * @param {String} floorId 楼层id
   * @param {String} keyword 关键字
   * @param {Number} pageIndex 页码
   * @param {String} userId 人员id（传：uerID，不传：state的perId）
   */
  const getPlaceLists = async (campusId, buildingId, floorId, keyword, pageIndex, userId) => {
    // console.log(userId);
    let params = {
      userId: userId || setItem.userId,
      campusId,
      buildingId,
      floorId,
      keyword,
      roleId: roleSele.roleId,
      pageIndex,
      pageSize: 20,
    };
    const { data } = await getPlaceList(params);
    if (data.code === '200') {
      const { pagenation, list } = data.data;
      setSetDataSource(list);
      setSetTotal(pagenation.total || 0);
    } else {
      message.warning(data.message);
    }
  }
  /**
   * @desc 设置范围
   * @param {Array} classroomList 要添加的场所列表
   * @param {Array} deleteList 要删除的场所列表
   */
  const setRanges = async (classroomList, deleteList) => {
    const params = {
      userId: setItem.userId,
      userName: setItem.userName,
      roleId: roleSele.roleId,
      classroomList, deleteList
    }
    const { data } = await setRange(params);
    if (data.code === '200') {
      setIsSetPlace(false);
      getArrangeLists(pageIndex, roleSele.roleId);
      message.info('设置成功');
    } else {
      message.warning(data.message);
    }
  }
  const setCancel = async () => {
    setIsSetPlace(false);
    setSetDataSource([]);
    setSetTotal(0);
    setSetItem({});
    setSetTreeData([]);
  }

  /**
  * @desc 页码切换
  * @param {Number} page 页码
  */
  const pageChange = (page) => {
    setPageIndex(page);
    getArrangeLists(page, roleSele.roleId);
  }

  // console.log(addDataSource);
  return <div className="mj-ryap-content">
    {/* 头部 */}
    <div className="mj-ryap-topCon">
      <div className="mj-ryap-title">人员列表</div>
    </div>

    <div className="mj-ryap-listContent">
      {/* 左侧 */}
      <div className="mj-ryap-roleList">
        {
          permissionList.map(item => {
            return <div
              key={item.roleId}
              className={`${item.roleId === roleSele.roleId ? 'mj-ryap-role mj-ryap-roleHigh' : 'mj-ryap-role'}`}
              onClick={() => roleChan(item)}
            >
              {item.roleName}
            </div>
          })
        }
      </div>

      {/* 右侧 */}
      <div className="mj-ryap-rightCon">
        {/* 头部 */}
        <div className="mj-ryap-title">
          <label>{roleSele.roleName}</label>
          <Button
            icon={<SVG type='tj' />}
            onClick={() => AddPersonClick()}
          >
            添加人员
          </Button>
        </div>

        {/* 表格 */}
        <div className="mj-ryap-tableCon">
          <Table
            rowKey={(record) => record.userId}
            bordered={true}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              pageSize: 20,
              current: pageIndex,
              total,
              showTotal: total => `当前显示${dataSource.length}条，共${total}条`,
              onChange: (page) => pageChange(page)
            }}
          />
        </div>
      </div>
    </div>

    {/* 添加人员 */}
    {
      isAddPerson
        ? <AddPerson
          visible={isAddPerson}
          listTotal={addTotal}
          list={addDataSource}
          isCollege={isCollege}
          getUserLists={(pageIndex, keyword) => getUserLists(pageIndex, keyword)}
          onOk={(list) => addUsers(list)}
          onCancel={() => addCancel()}
        />
        : null
    }

    {/* 设置范围 */}
    {
      isSetPlace
        ? <SetPlace
          visible={isSetPlace}
          treeList={setTreeData}
          list={dataSourceSet}
          listTotal={totalSet}
          getPlaceLists={(campusId, buildingId, floorId, keyword, pageIndex) => getPlaceLists(campusId, buildingId, floorId, keyword, pageIndex)}
          onOk={(list, deleLsts) => setRanges(list, deleLsts)}
          onCancel={() => setCancel()}
        />
        : null
    }
  </div>
}