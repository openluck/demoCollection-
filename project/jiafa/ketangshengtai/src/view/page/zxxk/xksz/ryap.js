/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-22 15:02:01
 * 人员安排
 */
import React, { useEffect, useState } from 'react';
import { Button, message, Table, Modal, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SVG from './../../../public/public-component-svg';
const { confirm } = Modal;

import AddPerson from './../../../components/zxxk/xksz/addPerson';
import SetPlace from '../../../components/zxxk/xksz/setPlace';
import {
  getPermission, setPermission, getPermissionList, getArrangeList,
  getUserList, addUser, delectUser, getSchoolList, getPlaceList,
  setRange, flattenTreeDataClosure, findParent
} from './../../../data/zxxk/ryapReq';
import './../../../../style/zxxk/xksz/mj-ryapNew.scss';

export default function Ryap() {
  const [checkValue, setCheckValue] = useState('0'); //checkBox选中项
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
    { title: '姓名', dataIndex: 'perName', key: 'perName', width: '18%', ellipsis: true },
    {
      title: '巡课范围', dataIndex: 'sourExtent', key: 'sourExtent', ellipsis: true,
      render: (text, row) => {
        return <span>{text || '-'}</span>
      }
    },
    {
      title: '操作', dataIndex: 'option', key: 'option', align: 'center',
      width: `${checkValue === "0" && (roleSele.roleId === 3 || roleSele.roleId === 4) ? '10%' : '16%'}`,
      render: (text, record) => {
        return <div className="mj-ryap-tableBtn">
          {
            checkValue === "0" && (roleSele.roleId === 3 || roleSele.roleId === 4)
              ? null
              : <div className="mj-ryap-btnHigh" onClick={() => addPlaceClick(record)}>
                <SVG type="dx01" />
                <label>设置范围</label>
              </div>
          }
          <div className="mj-ryap-btnDele" onClick={() => deleUsersSure(record)}>
            <SVG type="sc" />
            <label>删除</label>
          </div>
        </div>
      }
    },
  ];

  useEffect(() => {
    getPermissions();
  }, [])

  /**
   * @desc 获取权限分组
   */
  const getPermissions = async () => {
    let { data } = await getPermission();
    if (data.code === '200') {
      let val = data.data || '0'
      setCheckValue(val);
      getPermissionLists(val);
    } else {
      message.warning(data.message)
    }
  }

  /**
   * @desc 设置权限分组
   * @param {string} permissionGroup 权限分组，0表示默认权限，1表示自定义权限
   */
  const setPermissionData = async (permissionGroup) => {
    let { data } = await setPermission({ permissionGroup });
    if (data.code === '200') {
      getPermissionLists(permissionGroup);
    } else {
      message.warning(data.message);
    }
  }

  /**
   * @desc 获取权限对应角色列表
   * @param {String} val 权限分组，1表示自定义权限，0表示默认权限:用于请求人员安排列表数据
   */
  const getPermissionLists = async (val) => {
    let { data } = await getPermissionList();
    if (data.code === '200') {
      const list = data.data,
        role = list.length ? list[0] : {};
      setRoleSele(role);
      setPermissionList(list);
      setPageIndex(1);
      role.roleId ? getArrangeLists(1, val, role.roleId) : null;
    } else {
      message.warning(data.message);
    }
  }

  /**
   * @desc 获取人员安排列表数据
   * @param {Number} pageIndex 当前页
   * @param {String} permissionGroup 权限分组，1表示自定义权限，0表示默认权限
   * @param {String} roleId 角色id
   */
  const getArrangeLists = async (pageIndex, permissionGroup, roleId) => {
    let params = {
      pageIndex,
      pageSize: 20,
      permissionGroup,
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
      permissionGroup: checkValue,
      roleId: roleSele.roleId,
      userId: item.perId
    };
    const { data } = await delectUser(params);
    if (data.code === '200') {
      message.warning('删除成功！');
      const page = await toSurePage();
      setPageIndex(page);
      getArrangeLists(page, checkValue, roleSele.roleId);
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
   * @desc 权限选择
   * @param {Json} e 选中值
   */
  const checkChan = (e) => {
    let val = e.target.value;
    // let index = checkedValue.findIndex(item => {
    //   return item === checkValue[0];
    // })
    // if (index !== -1) {
    //   val = checkedValue.length > 1 ? checkedValue[1] : checkValue
    // }
    val !== checkValue ? setPermissionData(val) : null;
    setCheckValue(val);
  }

  /**
   * @desc 角色选中切换
   * @param {Object} params 选中项
   */
  const roleChan = (params) => {
    setRoleSele(params);
    setPageIndex(1);
    // console.log(params.roleId);
    setIsCollege(params.roleId === 3 ? true : false);
    getArrangeLists(1, checkValue, params.roleId);
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
      permissionGroup: checkValue,
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
      permissionGroup: checkValue,
      roleId: roleSele.roleId,
      userList: list
    };
    const { data } = await addUser(params);
    if (data.code === '200') {
      message.success('添加成功');
      setIsAddPerson(false);
      getArrangeLists(pageIndex, checkValue, roleSele.roleId);
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
    getTreeData(record.perId);
  }
  /**
   * @desc 获取权限场所树
   * @param {String} userId 人员id
   */
  const getTreeData = async (userId) => {
    let params = {
      userId,
      roleId: roleSele.roleId,
      permissionGroup: checkValue,
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
      const { parentArr, arr } = await findParent(seleId, lists);
      let val = seleId.match(/\/(\S*)/)[1];
      // console.log(parentArr);
      getPlaceLists(parentArr[1], parentArr[2], val, '', 1, userId);
    } else {
      message.warning(data.message);
    }
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
    // console.log(userId, setItem);
    let params = {
      userId: userId || setItem.perId,
      campusId,
      buildingId,
      floorId,
      keyword,
      permissionGroup: checkValue,
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
    // console.log(setItem);
    const params = {
      userId: setItem.perId,
      userName: setItem.perName,
      permissionGroup: checkValue,
      roleId: roleSele.roleId,
      classroomList,
      deleteList
    }
    const { data } = await setRange(params);
    if (data.code === '200') {
      setIsSetPlace(false);
      getArrangeLists(pageIndex, checkValue, roleSele.roleId);
      message.info('设置成功')
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
    getArrangeLists(page, checkValue, roleSele.roleId);
  }

  // console.log(dataSourceSet);
  return <div className="mj-ryap-content">
    {/* 头部 */}
    <div className="mj-ryap-topCon">
      <div className="mj-ryap-title">人员列表</div>
      <div className="mj-ryap-seleCon">
        <label>请选择方案：</label>
        {/* <Checkbox.Group value={checkValue} onChange={(checkedValue) => checkChan(checkedValue)}>
          <Checkbox value="0">
            默认权限
            <Tooltip title='校级可看全校数据，院级可看本院数据，巡课员需设置范围' color="#fff" overlayClassName="mj-ryap-tipInfo">
              <span><SVG type="info" /></span>
            </Tooltip>
          </Checkbox>
          <Checkbox value="1">自定义权限</Checkbox>
        </Checkbox.Group> */}

        <Radio.Group value={checkValue} onChange={(e) => checkChan(e)}>
          <Radio value="0">
            默认权限
            {/* <Tooltip title='校级可看全校数据，院级可看本院数据，巡课员需设置范围' color="#fff" overlayClassName="mj-ryap-tipInfo"> */}
            <div className="mj-ryap-toolTxt">
              <SVG type="info" />
              <div className='mj-ryap-toolTip'>
                <span></span>
                <label>校级可看全校数据，院级可看本院数据，巡课员需设置范围</label>
              </div>
            </div>
            {/* </Tooltip> */}
          </Radio>
          <Radio value="1">自定义权限</Radio>
        </Radio.Group>
      </div>
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
            rowKey={(record) => record.perId}
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
          // listIndex={addPageIndex}
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
          getPlaceLists={(campusId, buildingId, floorId, keyword, pageIndex) => getPlaceLists(campusId, buildingId, floorId, keyword, pageIndex,)}
          onOk={(list, deleLsts) => setRanges(list, deleLsts)}
          onCancel={() => setCancel()}
        />
        : null
    }
  </div>
}