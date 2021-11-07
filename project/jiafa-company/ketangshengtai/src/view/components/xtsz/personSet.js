import React, { useState, useEffect } from "react"
import "../../../style/pajs/aqsz/aqszFormWork.scss"
import { useHistory } from "react-router-dom";
import { Button, Input, Radio, TimePicker, message, Select, Tabs, Checkbox, Tree, Spin } from "antd"
import PerfectScrollbar from "react-perfect-scrollbar"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"
import SVG from "../../public/public-component-svg"
import pagePonent from "../pagePonent"
import { request } from "../../../util/request"
import LimitsModal from "../limitsModal" 
import PagePonent from "../pagePonent"
import CheckboxGroup from "antd/lib/checkbox/Group"
import noneData from "../../../media/picture/noneData.png"
import DelectConfirmModal from "../deletConfirmModal"

import { getUserListCon, addUser } from './../../data/xtsz/jsszReq';
import AddPerson from './../../components/zxxk/xksz/addPerson';

const { TreeNode } = Tree
const { TextArea, Search } = Input
const { Option } = Select
const { TabPane } = Tabs;
let idList = []
let selectList = []

export default function PersonSet(props) {
  // const prevCountRef = useRef();
  let history = useHistory();
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [curPage, setCurPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [optionType, setOptionType] = useState("")
  const [clickOne, setClickOne] = useState({})
  const [clickName, setClickName] = useState("")
  const [clickrange, setClickrange] = useState("")
  const [userTreeData, setUserTreeData] = useState([])
  const [rangeTreeData, setRangeTreeData] = useState([])
  // const [selected, setSelected] = useState([])
  const [userSelected, setUserSelected] = useState([])
  const [rangeSelected, setRangeSelected] = useState([])
  const [visible2, setVisible2] = useState(false)
  const [userDataInOrg, setUserDataInOrg] = useState([])
  const [disData, setDisData] = useState([])
  const [optData, setOptData] = useState([])
  const [allSelectUser, setAllSelectUser] = useState([])
  const [roleList, setRoleList] = useState([])
  const [curRoleId, setCurRoleId] = useState("")

  //添加人员弹窗状态
  const [orgList, setOrgList] = useState([])
  const [curOrgId, setCurOrgId] = useState("")
  const [curOrgType, setCurOrgType] = useState("0")
  const [orgPerList, setOrgPerList] = useState([])
  const [keyOrg, setKeyOrg] = useState("")
  const [keyName, setKeyName] = useState("")

  //设置权限弹窗状态
  const [clickId, setClickId] = useState("")
  const [halfCheckedList, setHalfCheckedList] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [treeData, setTreeData] = useState([])

  //删除确认弹窗状态
  const [delVisible, setDelVisible] = useState(false)

  const [throttle, setThrottle] = useState(false) // 节流

  let param = {
    pageIndex: curPage,
    pageSize: 20,
    roleId: curRoleId
  }

  /////////
  // 添加人员相关变量
  const [addKeyword, setAddKeyword] = useState(''); //添加人员 - 搜索关键字
  const [addDataSource, setAddDataSource] = useState([]); //添加人员 - 列表数据
  const [addTotal, setAddTotal] = useState(0);  //添加人员 - 数据总数
  const [isCollege, setIsCollege] = useState(false);//添加人员 - 是否是院系角色
  /**
     * @desc 添加人员 - 获取人员列表
     * @param {Number} pageIndex 页码
     * @param {String} keyword 搜索关键字
     */
  const getUserLists = async (pageIndex, keyword) => {
    let params = {
      pageIndex,
      pageSize: 20,
      roleId: curRoleId,
      keyword
    }
    let { data } = await getUserListCon(params);
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
    let arr = [];
    list.map(item => {
      arr.push(item.userId)
    })
    let params = {
      roleId: curRoleId,
      userIdList: arr
    };
    const { data } = await addUser(params);
    if (data.code === 200) {
      message.success('添加成功');
      setVisible2(false);
      getUserList(param);
    } else {
      message.warning(data.message);
    }
  }
  /**
   * @desc 添加人员取消
   */
  const addCancel = () => {
    setVisible2(false)
    setAddDataSource([]);
    setAddKeyword('');
    setAddTotal(0);
  }
  useEffect(() => {
    if (curRoleId) {
      getUserList(param)
    }
  }, [curPage, curRoleId])

  const handleChangecurOrgType = useCallback(curOrgType => {
    // setCurOrgId(curOrgType)
    // getOrgList({
    //   orgType: curOrgType,
    //   keyword: keyOrg
    // }, {
    //   orgType: curOrgType,
    //   roleId: curRoleId,
    //   keyword: keyName
    // })
  }, [keyOrg, curRoleId, keyName])

  useEffect(() => {
    let roleList = sessionStorage.getItem('rrsz_roleList')
    if (roleList) {
      roleList = JSON.parse(roleList)
      let roleId = roleList.length && roleList[0].roleId || ''
      setRoleList(roleList)
      setCurRoleId(roleId)
      getUserList({
        roleId: roleId,
        pageIndex: 1,
        pageSize: 20
      })
    } else {
      getRoleList()
    }
    // getUserSelected()
  }, [])

  useEffect(() => {
    if (clickId) {
      // console.log(12);
      let pr = {
        roleId: curRoleId,
        userId: clickId
      }
      // getRangeSelected(pr)
      getRangeTree(pr)
    }
  }, [clickId])

  useEffect(() => {
    if (userDataInOrg && userDataInOrg[0]) {
      // seperate(userDataInOrg)
      setDisData(userDataInOrg)
    } else {
      // setOptData([])
      setDisData([])
    }
  }, [userDataInOrg])

  let temp = []

  function getCheckedKeys(arr) {
    arr?.map((item, index) => {
      if (item.checked == 1) {
        temp.push(item?.permissionId.toString())
      }
      if (item.childList) {
        getCheckedKeys(item.childList)
      }
    })
  }

  useEffect(() => {
    getCheckedKeys(treeData)
    getAllId(treeData)
    setCheckedKeys([...temp])
    temp = []
  }, [treeData])

  const getRoleList = async pr => {
    // console.log(222222);
    let { data } = await request("public/getRoleList", pr)
    if (data.result) {
      let roleId = data.data && data.data.length && data.data[0].roleId || ''
      setRoleList(data.data)
      sessionStorage.setItem('rrsz_roleList', JSON.stringify(data.data))
      setCurRoleId(roleId)
      getUserList({
        roleId: roleId,
        pageIndex: 1,
        pageSize: 20
      })
    }
    else {
      message.warning(data.message)
    }
  }

  function OpenModal(item) {
    setVisible(true)
    setClickId(item?.userId ?? "")
    setClickOne(item ?? null)
    setClickName(item?.name ?? "")
    setClickrange(item?.range ?? "")
    if (item) {
      setOptionType(1)
    }
    else {
      setOptionType(0)
    }
  }

  function modalVi(type, data) {
    if (type === 'cancel') {
      setVisible(false)
      setClickId("")
    } else {
      //   this.getTableData(page);
      //从后台拿到的所有idList
      console.log(idList)
      //后台拿到选中的对象
      // console.log(selectList)
      //操作后选中的id列表
      console.log(data)
      setVisible(false)
      // let newArr = idList.filter(x => !data.some((item) => newArr?.indexOf(x) == item))
      idList?.map((item1, index) => {
        data?.map(item2 => {
          if (item2 == item1) {
            idList.splice(index, 1)
          }
        })
      })
      // console.log(idList)
      setPower({
        roleId: curRoleId,
        userId: clickId,
        permissionIdList: idList
      })
    }
  }

  const setPower = async pr => {
    let { data } = await request("public/setPower", pr)
    if (data.result) {
      message.success("设置权限成功！", 2, () => {
        getUserList(param)
        if (pr.userId === JSON.parse(sessionStorage.getItem('baseinfo')).userId) {
          message.info('您当前登录权限发生改变，即将重新登录系统！', 3, () => {
            history.push('/')
          })
        }
      })
    }
    else {
      message.warning(data.message)
    }
  }


  //获取已选择教学楼
  const getRangeSelected = async pr => {
    let { data } = await request("public/getSelectUserAllRole", pr)
    if (data.result) {
      setRangeSelected(data.data)
    }
    else {
      message.warning(data.message)
    }
  }

  //获取校区范围tree
  const getRangeTree = async pr => {
    idList = []
    selectList = []
    let { data } = await request("public/getPermissionList", pr)
    if (data.result) {
      setTreeData(data.data)
    }
    else {
      message.warning(data.message)
    }
  }

  //获取人员列表
  const getUserList = async pr => {
    let { data } = await request("public/getUserList", pr)
    if ((!data.data || !data.data.length) && pr.pageIndex > 1) {
      setCurPage(curPage - 1)
    }
    if (data.result) {
      setTableData(data.data)
      setTotal(data.total)
    }
    else {
      message.warning(data.message)
    }
  }

  //删除控制人员
  const delUser = async pr => {
    let { data } = await request("public/removePerson", pr)
    if (data.result) {
      getUserList(param)
      message.success("移除人员成功！")
    }
    else {
      message.warning(data.message)
    }
  }

  //添加人员
  const addOrEdit = async pr => {
    let { data } = await request("public/addPerson", pr)
    // setCurOrgType("3")
    if (data.result) {
      message.success("填加人员成功！")
      getUserList(param)
      getOrgPerList({
        orgId: curOrgId,
        orgType: curOrgType,
        roleId: curRoleId,
        keyword: keyName,
      })
    }
    else {
      message.warning(data.message)
    }
    setOptData([])
    setUserDataInOrg([])
  }

  //获取机构
  const getOrgList = async (pr, next) => {
    setThrottle(true)
    setDisData([])
    setUserDataInOrg([])
    let { data } = await request("public/getOrgList", pr)
    if (data.result) {
      setOrgList(data.data)
      setCurOrgId(data.data[0] ? data.data[0].orgId : '')
      if (next) {
        next.orgId = data.data[0] ? data.data[0].orgId : ''
        if (next.orgId) {
          getOrgPerList(next)
        }
      }
    }
    else {
      message.warning(data.message)
    }
    setThrottle(false)
  }

  //获取当前角色机构下人员列表
  const getOrgPerList = useCallback(async (pr) => {
    setThrottle(true)
    let { data } = await request("public/getOrgPerList", pr)
    if (data.result) {
      let newList = data.data
      newList && newList.length && newList.map(item => {
        item.isChecked === '1' ? item.disabled = true : ''
        optData[0] && optData.map(ele => {
          item.isChecked = item.perId === ele.perId ? '1' : item.isChecked
        })
      })
      setUserDataInOrg(newList)
    }
    else {
      message.warning(data.message)
    }
    setThrottle(false)
  }, [optData])

  //全选是空 全不选是所有
  function confirm() {
    let data = [...checkedKeys.concat(halfCheckedList)]
    setVisible(false)
    // console.log(idList, data);

    let temp = []
    if (!data.length) {
      temp = idList
    } else {
      for (let i = 0; i < idList.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (idList[i] == data[j]) {
            break
          }
          if (j == data.length - 1) {
            temp.push(idList[i])
          }
        }
      }
    }
    // console.log(temp);
    let new_arr = idList.filter((x) => !data.some((item) => x == item))
    setPower({
      roleId: curRoleId,
      userId: clickId,
      permissionIdList: temp
    })
  }

  function addConfirm() {
    let idList = []
    optData?.map(item => {
      if (item.isChecked == 1) {
        idList.push(item.perId)
      }
    })
    let pr = {
      roleId: curRoleId,
      userIdList: idList
    }
    addOrEdit(pr)
  }

  const checkBoxOnChange = useCallback((a, b, type) => {
    // console.log(a, b, type)
    let temp = JSON.parse(JSON.stringify(optData))
    let tempb = [...userDataInOrg]
    if (type === 1) {
      tempb.map(item => {
        if (item.perId === b) {
          if (a.target.checked) {
            item.isChecked = 1
            temp.push({
              perId: item.perId,
              isChecked: 1,
              perName: item.perName
            })
          } else {
            item.isChecked = 0
            temp = temp.filter(ele => {
              return ele.perId !== item.perId
            })
          }
        }
      })
    } else {
      temp = temp.filter(ele => ele.perId !== b)
      tempb[0] ? tempb.map(item => {
        if (!item.disabled && item.perId === b) {
          item.isChecked = '0'
        }
      }) : ''
    }

    setOptData([...temp])
    setUserDataInOrg([...tempb])
  }, [optData, userDataInOrg])
  //添加人员全选,清空
  const selectAll = useCallback((type) => {
    let temp = JSON.parse(JSON.stringify(optData))
    let temb = JSON.parse(JSON.stringify(userDataInOrg))
    if (type == 0) {
      temb[0] && temb.map(item => {
        item.isChecked = item.disabled ? item.isChecked : '0'
        temp = []
      })
    }
    else {

      temb[0] && temb.map(item => {
        item.isChecked = '1'
        let pushObj = {
          perId: item.perId,
          perName: item.perName,
          isChecked: '1'
        }
        if (!item.disabled) {
          if (temp[0]) {
            let idx = 99999
            temp.some((ele, index) => {
              if (item.perId === ele.perId) {
                idx = index
                return true
              }
            })
            if (idx === 99999) {
              temp.push(pushObj)
            }
          } else {
            temp.push(pushObj)
          }
        }
      })
    }
    setOptData([...temp])
    setUserDataInOrg([...temb])
  }, [userDataInOrg, optData])


  function getSelectTotal(arr) {
    let sum = 0
    arr?.map(item => {
      if (item.isChecked == 1) {
        sum++
      }
    })
    return sum
  }

  function getAllId(arr) {
    arr?.map(item => {
      idList.push(item.permissionId)
      if (item.isChecked == 1) {
        selectList.push(item)
      }
      if (item.childList) {
        getAllId(item.childList)
      }
    })
  }

  function onCheck(checkedKeys, info) {
    setHalfCheckedList(info.halfCheckedKeys)
    setCheckedKeys(checkedKeys)
  }

  function getTreeNode(data) {
    if (data?.length > 0) {
      return data?.map(item => {

        if (item.childList) {
          return <TreeNode
            title={
              <div>
                <div style={{
                  width: "100%"
                }}>
                  <span>{item?.permissionName}</span>
                </div>
              </div>
            }
            key={item?.permissionId}
            // key={Math.random()}
            dataRef={item}
          >
            {getTreeNode(item.childList)}
          </TreeNode>
        }
        else {
          return <TreeNode
            title={
              <div>
                <div style={{
                  width: "100%"
                }}>
                  <span>{item.permissionName}</span>
                </div>
              </div>
            }
            key={item?.permissionId}
            dataRef={item}
          // key={Math.random()}
          />
        }

      })
    }

  }


  return <div className="ll-aqsz-outer">
    <div className="ll-aqsz-content-role" style={{ height: "100%" }}>
      <PerfectScrollbar style={{ height: "100%" }}>
        {
          roleList ?
            roleList?.map(item => <div
              className={item?.roleId == curRoleId ? "ll-roleItem ll-select" : "ll-roleItem"}
              key={item?.roleId}
              onClick={() => {
                setCurRoleId(item?.roleId);
                setCurPage(1);
                setIsCollege(item?.roleId === '3' ? true : false);
              }}
            >
              {item.roleName}
            </div>) :
            <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
              <img src={noneData} />
              <p>暂无数据</p>
            </div>
        }
      </PerfectScrollbar>
    </div>
    <div className="ll-aqsz-content" style={{ width: "calc(100% - 190px)" }}>
      <div className="ll-aqsz-firstFloor">
        <h2 style={{ margin: 0 }}>人员列表</h2>
        <Button
          type="primary"
          onClick={() => {
            getUserLists(1, '');

            // setCurOrgType("0")
            // handleChangecurOrgType('0')
            setOptData([])
            setVisible2(true)
          }}
        >
          <SVG
            type="tj"
            width={16}
            height={16}
            fill="white"
            style={{ marginRight: 5 }}
          />添加人员</Button>
      </div>
      {
        tableData?.length > 0 ?
          <div className="ll-aqsz-table">
            <div className="ll-aqsz-rank" style={{ backgroundColor: "#fafafa", borderTop: "1px solid #ebebeb" }}>
              <div className="ll-aqsz-userName">姓名</div>
              <div className="ll-aqsz-normal">教职工编号</div>
              <div className="ll-aqsz-org">行政机构</div>
              <div className="ll-aqsz-org">教学机构</div>
              <div className="ll-aqsz-operation">操作</div>
            </div>
            <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
              {
                tableData?.map((item, index) =>
                  <div className="ll-aqsz-rank" key={index} >
                    <div className="ll-aqsz-userName">{item.name}</div>
                    <div className="ll-aqsz-normal">{item.teacherNum}</div>
                    <div className="ll-aqsz-org">{item.orgName}</div>
                    <div className="ll-aqsz-org">{item.teachOrg}</div>
                    <div className="ll-aqsz-operation">
                      <div
                        className="ll-aqsz-bj"
                        onClick={() => {
                          setOptionType(1)
                          OpenModal(item)
                          // idList=[]
                        }}
                      >
                        <SVG
                          type="bj"
                          width={16}
                          height={16}
                          fill="aaaeb3"
                          style={{ marginRight: 5 }} />设置权限
                      </div>
                      <div
                        className="ll-aqsz-sc"
                        onClick={() => { setDelVisible(true); setClickId(item.userId) }}
                      >
                        <SVG
                          type="sc"
                          width={16}
                          height={16}
                          fill="aaaeb3"
                          style={{ marginRight: 5 }} />移除
                      </div>
                    </div>
                  </div>
                )

              }
            </PerfectScrollbar>
          </div>
          :
          <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
            <img src={noneData} />
            <p>暂无数据</p>
          </div>
      }
      <div className="ll-paginationCTN" style={{ display: total > 0 ? "block" : "none" }}>
        <PagePonent
          pageIndex={curPage}
          pageSize={20}
          pageChan={value => {
            setCurPage(value)
          }}
          len={tableData && tableData.length || 0}
          total={total ?? 0}
        />
      </div>
      {/* <LimitsModal
                visible={visible}
                modalVi={(type, data) => modalVi(type, data)}
                treeData={rangeTreeData}
                selected={rangeSelected}
                type="place"
            /> */}
      <Modal
        width={500}
        title={`设置权限 - ${clickName}`}
        footer={null}
        visible={visible}
        onCancel={() => {
          setVisible(false)
          setClickId("")
        }}
      >
        <div className="ll-controlTimeModal">
          {
            treeData ?
              <Tree
                defaultExpandAll={true}
                checkable
                selectable={false}
                onCheck={(a, b) => { onCheck(a, b) }}
                checkedKeys={checkedKeys}
              >
                {getTreeNode(treeData)}
              </Tree> : <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
                <img src={noneData} />
                <p>暂无数据</p>
              </div>
          }
          {
            treeData ?
              <div style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fbefe9",
                height: 40,
                marginTop: 20,
                padding: "0 10px",
                color: "#f39465"
              }}>
                <SVG
                  type="ts"
                  width={20}
                  height={20}
                  fill="#f39465"
                  style={{ marginRight: 5 }}
                />修改权限后，与之关联的人员所对应的权限也将同步更新
              </div> : null
          }
          <div className="ll-modalBTNCTN">
            <Button type="primary" onClick={() => { setVisible(false); confirm() }}>确定</Button>
            <Button onClick={() => { setVisible(false), setClickId("") }}>取消</Button>
          </div>
        </div>
      </Modal>

      {/* 添加人员 */}
      {
        visible2
          ? <AddPerson
            visible={visible2}
            listTotal={addTotal}
            list={addDataSource}
            isCollege={isCollege}
            getUserLists={(pageIndex, keyword) => getUserLists(pageIndex, keyword)}
            onOk={(list) => addUsers(list)}
            onCancel={() => addCancel()}
          />
          : null
      }

      <DelectConfirmModal
        visible={delVisible}
        onOk={() => {
          delUser({ userId: clickId, roleId: curRoleId })
          setDelVisible(false)
        }}
        onCancel={() => {
          setDelVisible(false)
        }}
        text="确定移除该人员？"
      />
    </div>
  </div>
}