import React, { useState, useEffect } from "react"
// import "../../../../style/pajs/aqsz/aqszFormWork.scss"
import { Button, Input, Radio, TimePicker, message, Tree } from "antd"
import PerfectScrollbar from "react-perfect-scrollbar"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"
import SVG from "../../public/public-component-svg"
import { request } from "../../../util/request"
import _ from "lodash";
import noneData from "../../../media/picture/noneData.png"

const { TextArea } = Input
const { TreeNode } = Tree

export default function PermissionSet(props) {
  const [tableData, setTableData] = useState([])
  const [treeData, setTreeData] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  // const [selectId, setSelectId] = useState([treeData[0].permissionId.toString()])
  const [visible, setVisible] = useState(false)
  const [clickName, setClickName] = useState("")
  const [clickId, setClickId] = useState("")
  const [halfCheckedList, setHalfCheckedList] = useState([])


  let temp = []

  // useEffect(() => {
  //     setCheckedKeys(temp)
  // }, [])

  useEffect(() => {
    getCheckedKeys(treeData)
    setCheckedKeys([...temp])
    temp = []
  }, [treeData])

  useEffect(() => {
    getRoleList()
    // let a = document.querySelector(".ll-aqsz-content")
    // a.addEventListener("click",(e)=>{
    //     console.log(e.target)
    // })
  }, [])

  useEffect(() => {
    if (clickId) {
      let pr = { roleId: clickId }
      getTreeData(pr)
    }
  }, [clickId])

  function OpenModal(item) {
    setVisible(true)
    setClickId(item?.roleId ?? "")
    // setClickOne(item ?? null)
    setClickName(item?.role ?? "")
    // setClickPermission(item?.permission ?? "")
  }

  function getTreeNode(data) {
    if (data.length > 0) {
      return data?.map(item => {
        if (item.childList) {
          return <TreeNode
            title={
              <div>
                <div style={{
                  width: "100%"
                }}>
                  {/* <span>{item ? item.permissionName : ''}</span> */}
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

  function modalVi(type, data) {
    // console.log(type, data);
    if (type === 'cancel') {
      setVisible(false)
    } else {
      //   this.getTableData(page);
      setVisible(false)
    }
  }

  function unique(arr) {
    return Array.from(new Set(arr))
  }

  //获取角色列表
  const getRoleList = async pr => {
    let { data } = await request("powerSet/getRoleList", pr)
    if (data.result) {
      setTableData(data.data)
    }
    else {
      message.warning(data.message)
    }
  }

  //获取权限树
  const getTreeData = async pr => {
    let { data } = await request("powerSet/getPowerTree", pr)
    if (data.result) {
      setTreeData([...data.data])
    }
    else {
      message.warning(data.message)
    }
  }

  //设置权限
  const setPermission = async pr => {
    console.log(pr)
    let { data } = await request("powerSet/setPower", pr)
    if (data.result) {
      message.success("设置权限成功！")
      getRoleList()
    }
    else {
      message.warning(data.message)
    }
  }



  //从拿到的treeData中取checkedKeys
  function getCheckedKeys(arr) {
    arr?.map((item, index) => {
      if (item.checked == 1) {
        temp.push(item?.permissionId.toString())
      }
      if (item.childList) {
        getCheckedKeys(item.childList)
      }
      // if (index == arr.length - 1) {
      //     let checkedList = [...temp]
      //     return checkedList
      // }
    })
  }

  function onCheck(checkedKeys, info) {
    // console.log(checkedKeys)
    // if (info.checked) {
    //     checkedKeys.push(info.node.dataRef?.permissionId.toString())
    // }
    // else {
    //     _.pull(checkedKeys, info.node.dataRef?.permissionId.toString())
    // }
    // console.log(checkedKeys)
    setHalfCheckedList(info.halfCheckedKeys)
    setCheckedKeys(checkedKeys)
  }

  function confirm() {
    console.log(checkedKeys)
    let pr = {
      roleId: clickId,
      permissionIdList: checkedKeys.concat(halfCheckedList)
    }
    setPermission(pr)
    setClickId("")
  }

  return <div className="ll-aqsz-outer">
    <div className="ll-aqsz-content">
      <div className="ll-aqsz-firstFloor">
        <h2 style={{ margin: 0 }}>权限设置列表</h2>
      </div>
      {
        tableData?.length > 0 ?
          <div className="ll-aqsz-table">
            <div className="ll-aqsz-rank" style={{ backgroundColor: "#fafafa", borderTop: "1px solid #ebebeb" }}>
              <div className="ll-aqsz-userName">角色</div>
              <div className="ll-aqsz-range">权限</div>
              <div className="ll-aqsz-operation">操作</div>
            </div>
            <PerfectScrollbar style={{ height: "100%" }}>
              {

                tableData?.map((item, index) =>
                  <div className="ll-aqsz-rank" key={index} >
                    <div className="ll-aqsz-userName">{item.role}</div>
                    <div className="ll-aqsz-range">{item.permission?.map(item2 => <span key={Math.random()}>{item2}&nbsp;&nbsp;&nbsp;</span>)}</div>
                    {/* <div className="ll-aqsz-controlEvent">{item.controlEvent}</div> */}
                    <div className="ll-aqsz-operation">
                      <div
                        className="ll-aqsz-bj"
                        onClick={() => {
                          OpenModal(item)
                        }}
                      >
                        <SVG
                          type="szfw"
                          width={16}
                          height={16}
                          fill="aaaeb3"
                          style={{ marginRight: 5 }} />设置权限
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
    </div>
    {visible ? <Modal
      width={500}
      title={`设置权限 - ${clickName}`}
      footer={null}
      visible={visible}
      onCancel={() => {
        setVisible(false)
        setCheckedKeys([])
        setClickId("")
      }}
    >
      <div className="ll-controlTimeModal">
        <Tree
          defaultExpandAll={false}
          defaultExpandParent={false}
          checkable
          selectable={false}
          onCheck={(a, b) => { onCheck(a, b) }}
          checkedKeys={checkedKeys}
        >
          {getTreeNode(treeData)}
        </Tree>
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
        </div>
        <div className="ll-modalBTNCTN">
          <Button type="primary" onClick={() => { setVisible(false); confirm() }}>确定</Button>
          <Button onClick={() => { setVisible(false), setClickId("") }}>取消</Button>
        </div>
      </div>
    </Modal> : null}
  </div>
}