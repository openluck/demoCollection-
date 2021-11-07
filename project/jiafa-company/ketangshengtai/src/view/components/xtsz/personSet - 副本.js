import React, { useState, useEffect } from "react"
import "../../../style/pajs/aqsz/aqszFormWork.scss"
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

const { TreeNode } = Tree
const { TextArea, Search } = Input
const { Option } = Select
const { TabPane } = Tabs;
let idList = []
let selectList = []

export default function PersonSet(props) {
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

  useEffect(() => {
    if (curRoleId && curOrgId) {
      getUserList(param)
      getOrgPerList({
        orgId: curOrgId,
        orgType: curOrgType,
        roleId: curRoleId,
        keyword: keyName
      })
    }
  }, [curPage, curRoleId])

  useEffect(() => {
    if (curOrgType != "3") {
      getOrgList({
        orgType: curOrgType,
        keyword: keyOrg
      })
    }
  }, [curOrgType])

  useEffect(() => {
    if (curOrgId && curRoleId) {
      getOrgPerList({
        orgId: curOrgId,
        orgType: curOrgType,
        roleId: curRoleId,
        keyword: keyName
      })
    }
  }, [curOrgId])

  useEffect(() => {
    getRoleList()
    // getUserSelected()
  }, [])

  useEffect(() => {
    if (clickId) {
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
    let { data } = await request("public/getRoleList", pr)
    if (data.result) {
      let roleId = data.data && data.data.length && data.data[0].roleId || ''
      setRoleList(data.data)
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
      console.log(idList)
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
      message.success("设置权限成功！")
      getUserList(param)
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
    if (!data.data && pr.pageIndex > 1) {
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
    setCurOrgId('')
  }

  //获取机构
  const getOrgList = async pr => {
    setThrottle(true)
    let { data } = await request("public/getOrgList", pr)
    if (data.result) {
      setOrgList(data.data)
      setCurOrgId(data.data[0] ? data.data[0].orgId : '')
    }
    else {
      message.warning(data.message)
    }
    setThrottle(false)
  }

  //获取当前角色机构下人员列表
  const getOrgPerList = useCallback(async (pr) => {
    // setOptData([])
    setThrottle(true)
    console.log('optData', optData)
    setDisData([])
    setUserDataInOrg([])
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

  function confirm() {
    console.log(idList)
    let data = [...checkedKeys.concat(halfCheckedList)]
    console.log(data)
    setVisible(false)

    let temp = []
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


    console.log(temp)
    // console.log(idList)
    let new_arr = idList.filter((x) => !data.some((item) => x == item))
    console.log(new_arr)
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


  //分离数组（disable和可操作）
  // function seperate(arr) {
  //   let optArr = []
  //   let disArr = []
  //   arr?.map(item => {
  //     if (item.isChecked == 1) {
  //       disArr.push(item)
  //     }
  //     else {
  //       optArr.push(item)
  //     }
  //   })
  //   // console.log(optArr, disArr)
  //   setOptData([...optArr])
  //   setDisData([...disArr])
  // }

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
              onClick={() => { setCurRoleId(item?.roleId) }}
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
            // OpenModal()
            // setOptionType(0)
            setVisible2(true)
            setCurOrgType("0")
            setCurOrgId(orgList[0] ? orgList[0].orgId : '')
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
                // onSelect={(id, info) => {
                //     // console.log(info.node.dataRef)
                //     // console.log(id)
                //     // setSelectId(id)
                //     // chooseArea(info.node.dataRef)
                // }}
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
      <Modal
        title="添加人员"
        visible={visible2}
        onCancel={() => {
          setVisible2(false)
          // setCurOrgType("3")
        }}
        footer={null}
        width={800}
      >
        <div className="ll-addPersonModal">
          <div className="ll-modal-left" style={{ width: 440 }}>
            <div className="ll-left-org">
              <Search
                placeholder="机构名称"
                style={{ width: "100%" }}
                onChange={e => {
                  console.log(e.target.value)
                  setKeyOrg(e.target.value)
                }}
                onSearch={() => {
                  getOrgList({
                    orgType: curOrgType,
                    keyword: keyOrg
                  })
                }}
              >

              </Search>
              <Tabs
                // defaultActiveKey="0"
                activeKey={curOrgType}
                onChange={value => {
                  // getOrgList({ orgType: value, keyword: keyOrg }),
                  if (throttle) return
                  setTimeout(() => {
                    setCurOrgType(value)
                  }, 0);

                }}

              >
                <TabPane tab="行政机构" key="0" style={{ width: "50%" }}>
                </TabPane>
                <TabPane tab="教学机构" key="1" style={{ width: "50%" }}>
                </TabPane>
              </Tabs>
              <div className="ll-aqsz-content-role" style={{ width: "100%", padding: 0, height: "calc(100% - 72px)" }}>
                <PerfectScrollbar style={{ height: "100%" }}>
                  {
                    orgList?.map(item => <div
                      className={item.orgId == curOrgId ? "ll-roleItem ll-select" : "ll-roleItem"}
                      key={item.orgId}
                      title={item.orgName}
                      onClick={() => {
                        if (throttle) return
                        setCurOrgId(item.orgId)
                        console.log('8888', 88888)
                      }}
                      style={{
                        padding: 0,
                        margin: "0 20px",
                        padding: "0 10px",
                        // overflow: "hidden",
                        // textOverflow: "ellipsis",
                        // whiteSpace: "nowrap"
                      }}
                    >
                      {item.orgName}
                    </div>)
                  }
                </PerfectScrollbar>
              </div>
            </div>
            <div className="ll-left-name">
              <Search placeholder="姓名"
                style={{ width: "100%" }}
                onChange={e => {
                  console.log(e.target.value)
                  setKeyName(e.target.value)
                }}
                onSearch={() => {
                  getOrgPerList({
                    orgId: curOrgId,
                    orgType: curOrgType,
                    roleId: curRoleId,
                    keyword: keyName
                  })
                }}
              >
              </Search>
              <div className='mj-lm-seleCon' style={{ height: "calc(100% - 30px)" }}>
                <div className='mj-lm-textCon'>
                  <div>{`共（${userDataInOrg?.length > 0 ? userDataInOrg.length : "-"}）人`}</div>
                  <div onClick={() => { selectAll(1) }}>全选</div>
                </div>
                <div className='mj-lm-places' style={{ height: "calc(100% - 42px)" }}>
                  <PerfectScrollbar
                    // onScroll={(e) => userDataInOrgScroll(e)} 
                    style={{ height: "100%" }}
                  >
                    <div className='mj-lm-placesSele'>
                      {
                        userDataInOrg?.length > 0 ?
                          <div>
                            {
                              userDataInOrg?.map(
                                item =>
                                  <div key={item.perId} className='mj-lm-place' title={item.perName}>
                                    <Checkbox
                                      checked={item.isChecked == 1 ? true : false}
                                      disabled={item.disabled}
                                      onChange={e => checkBoxOnChange(e, item.perId, 1)}
                                    >
                                      {item.perName}
                                    </Checkbox>
                                  </div>
                              )
                            }

                            {/* {
                              optData?.map(
                                item =>
                                  <div key={item.perId} className='mj-lm-place' title={item.perName}>
                                    <Checkbox
                                      checked={item.isChecked == 1 ? true : false}
                                      onChange={e => { checkBoxOnChange(e, item.perId, 1) }}
                                    >
                                      {item.perName}
                                    </Checkbox>
                                  </div>
                              )
                            } */}
                          </div>
                          : <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
                            <img src={noneData} />
                            <p>暂无数据</p>
                          </div>
                      }
                    </div>
                    {/* {
                      perListLoading ? <div className='mj-lm-loading'>
                        <Spin type='small' style={{ marginRight: 10 }} /><div>Loading...</div>
                      </div> : ''
                    } */}

                  </PerfectScrollbar>
                </div>
              </div>
            </div>
          </div>
          <SVG
            type="xz"
            width={30}
            height={30}
            fill="#d4d7d9"
          />
          <div className="ll-modal-right" style={{ width: 220 }}>
            <div className='mj-lm-seleCon'>
              <div className='mj-lm-textCon'>
                <div>{`已选择（${getSelectTotal(optData)}）`}</div>
                <div onClick={() => { selectAll(0) }}>清空</div>
              </div>
              <div className='mj-lm-places' style={{ height: "100%" }}>
                <PerfectScrollbar style={{ height: "calc(100% - 40px)" }}>
                  <div className='mj-lm-placesSele'>
                    {
                      optData?.length ?
                        optData?.map(item => {
                          if (item.isChecked == 1) {
                            return <div key={item.perId} className='mj-lm-place'>
                              <div className='mj-lm-placeName'>{item.perName}</div>
                              <div className='mj-lm-placeIcon' onClick={e => { checkBoxOnChange(e, item.perId, 0) }} >
                                <SVG type='sc' />
                              </div>
                            </div>
                          }
                        }) : <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
                          <img src={noneData} />
                          <p>暂无数据</p>
                        </div>
                    }
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
          </div>
        </div>
        <div className="ll-modalBTNCTN" style={{ paddingTop: 20 }}>
          <Button type="primary" onClick={() => { setVisible2(false); addConfirm() }}
            style={{ backgroundColor: "#30bf99", borderColor: "#30bf99" }}
          >确定</Button>
          <Button onClick={() => {
            setVisible2(false);
            setTimeout(() => {
              setOptData([])
              setUserDataInOrg([])
            }, 300);
            // setCurOrgType("3")
          }}>取消</Button>
        </div>
      </Modal>


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