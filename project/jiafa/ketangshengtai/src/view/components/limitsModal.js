/*
 * @Author: MinJ
 * @Date: 2020-05-13 13:37:16 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-06-01 15:23:12
 * 添加人员、设置范围弹框组件
 * type per添加人员 place设置范围弹框组件
 * modalVi 点击确定及取消按钮的回调 type取消cancel确定ok, data选中列表
 * treeData 树结构
 * selected 右侧全部已选中列表
 * visible 控制弹框显隐
 */
import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Tree } from 'antd';
import _ from 'lodash';
import SVG from "./../public/public-component-svg";
import ModalPonent from './modalPonent';

import './../../style/limitsModal.scss';

const { TreeNode } = Tree;

class LimitsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      school: '',           //学校名称
      checkedKeys: [],      //选中节点id
      expandedKeys: [],     //展开的节点
      selects: [],          //右侧所有选中 用于展示
      selectsList: [],      //用于对比
      all: 0,               //列表总数 
      perTreeList: []
    };
    this.treeSele = this.treeSele.bind(this);
    this.treeSeleAll = this.treeSeleAll.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.dele = this.dele.bind(this);
    this.onOk = this.onOk.bind(this);
    this.delRep = this.delRep.bind(this)
  }

  componentDidMount() {
    const { treeData, selected, type } = this.props;
    // console.log('treeData', treeData)
    let selects = [], all = 0;
    selected.map(item => {
      selects.push(item.value);
    })


    let newPerTreeList = []
    if (type === 'per') selects = []
    treeData.map(item => {
      let child = item.children;
      if (child && child.length) {
        all = all + child.length;
        child.map(ele => {
          if (ele.isChecked === '1' && ele.value.length > 1 && type === 'per') {
            ele.disabled = true;
            selects.push(ele.value)
          }
          newPerTreeList.push(ele.value)
        })

      } else {
        all++;
      }
      if (item.isChecked === '1' && item.value.length && type === 'per') {
        selects.push(item.value)
        item.disabled = true;
      }

    })
    let newSelected = type === 'per' ? [] : JSON.parse(JSON.stringify(selected));
    if (newSelected[0]) {
      newSelected = this.delRep(newSelected)
    }
    this.setState({
      checkedKeys: selects,
      expandedKeys: treeData.length ? [treeData[0].value] : [],
      selects: newSelected,
      selectsList: newSelected,
      all,
      treeData,
      perTreeList: newPerTreeList
    })
  }
  delRep(tP) {
    let len = tP.length
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const iVa = tP[i].value.indexOf('/') > -1 ? tP[i].value.split('/')[1] : tP[i].value
        const jVa = tP[j].value.indexOf('/') > -1 ? tP[j].value.split('/')[1] : tP[j].value
        if (iVa == jVa) {
          tP.splice(j, 1);
          len--;
          j--;
        }
      }
    }
    tP.length && tP.map(item => {
      item.value = item.value.indexOf('/') > -1 ? item.value.split('/')[1] : item.value
    })
    return tP
  }

  /**
   * @desc 树节点操作
   * @param {*} checkedKey 
   * @param {*} event 
   */
  treeSele(checkedKey, event) {
    // console.log(checkedKey, event);
    const { checkedKeys, selects, perTreeList } = this.state;
    const { type } = this.props
    const node = event.node;
    let arr = selects;
    // 选中
    if (event.checked) {
      let child = node.children;
      if (child) {
        // console.log(selects);
        if (type === 'per') {
          console.log('child', child)
          child.map(item => {

            if (!item.disabled) {
              let flag = false
              let elementValue = item.value.split('/')[1]
              arr[0] && arr.some(ele => {
                if (elementValue === ele.value) {
                  flag = true
                  return true
                }
              })
              if (!flag) {
                arr.push({ title: item.title, value: elementValue, parId: item.parId })
                let keys = []
                perTreeList.map(item => {
                  if (item.indexOf(elementValue) > -1) {
                    keys.push(item)
                  }
                })
                checkedKey = [...checkedKey, ...keys]
              }
            }
          })

        } else {
          child.map(item => {
            let index = _.findIndex(selects, { value: item.value });
            if (index === -1) {
              arr.push({ title: item.title, value: item.value, parId: item.parId });
            }
          })
        }

      } else {
        if (type === 'per') {
          let elementValue = node.value.split('/')[1]
          let newKeys = []
          perTreeList.map(item => {
            if (item.indexOf(elementValue) > -1) {
              newKeys.push(item)
            }
          })
          checkedKey = [...checkedKey, ...newKeys]
          arr.push({ title: node.title, value: elementValue, parId: node.parId });
        } else {
          arr.push({ title: node.title, value: node.value, parId: node.parId });
        }
      }
    } else {      //取消选中
      let child = node.children;

      const { type } = this.props
      const { checkedKeys } = this.state

      let list = [];
      if (child) {
        if (type === 'per') {
          checkedKey = []
          checkedKeys.map(item => {
            if (item.indexOf('/') > -1) {
              let flag = true
              let elementValue = item.split('/')[1]
              let one = child.find(ele => {
                if (!ele.disabled && ele.value.split('/')[1] === elementValue) {
                  arr = arr.filter(ol => {
                    return ol.value !== elementValue
                  })
                  return ele
                }
              })
              if (one) {
                flag = false
              }
              if (flag) {
                checkedKey.push(item)
              }
            }

          })

        } else {
          child.map(item => {
            _.remove(arr, function (params) {
              return params.value === item.value;
            })
          })
        }

      } else {
        if (type === 'per') {
          checkedKey = []
          const elementValue = node.value.split('/')[1]
          checkedKeys.map(ele => {
            if (ele.indexOf('/') > -1) {
              if (ele.split('/')[1] !== elementValue) {
                checkedKey.push(ele)
              }
            }
          })
          arr.map(item => {
            if (item.value !== elementValue) {
              list.push(item);
            }
          })
          arr = list
        } else {
          arr.map(item => {
            if (item.value !== node.value) {
              list.push(item);
            }
          })
          arr = list;
        }


      }
    }
    this.setState({
      checkedKeys: checkedKey,
      selects: arr
    })
  }

  /**
   * @desc 树节点全选操作
   */
  treeSeleAll() {
    const { selected, type } = this.props;
    let newTreeData = this.props.treeData
    newTreeData = JSON.parse(JSON.stringify(newTreeData))
    let { perTreeList } = this.state
    let arr = [], checkedKeys = [];
    if (type === 'per') {
      newTreeData.forEach(item => {
        if (item.children && item.children[0]) {
          item.children.map(ele => {
            !ele.disabled && arr.push(ele);
          });
        };
      });

      if (arr[0]) {

        arr = [...arr]
        arr.forEach(item => {
          let value = item.value.split('/')[1],
            parId = item.value.split('/')[0]
          item.key = value
          item.value = value
          item.parId = parId
        })
        let len = arr.length
        for (let i = 0; i < len; i++) {
          for (let j = i + 1; j < len; j++) {
            const iVa = arr[i].value
            const jVa = arr[j].value
            if (iVa == jVa) {
              arr.splice(j, 1);
              len--;
              j--;
            }
          }
        }
      }
    } else {
      newTreeData.map(item => {
        let child = item.children;
        checkedKeys.push(item.value);
        if (child && child.length) {
          child.map(chiItem => {
            checkedKeys.push(chiItem.value);
            chiItem.parId = item.value;
            arr.push(chiItem);
          })
        } else {
          arr.push(item);
        }
      })
    }

    this.setState({
      selects: arr,
      checkedKeys: type === 'per' ? perTreeList : checkedKeys,
      treeData: newTreeData
    })

  }

  /**
   * @dec 清空操作
   */
  clearAll() {
    this.setState({
      selects: [],
      checkedKeys: []
    })
  }

  /**
   * @desc 删除操作
   * @param {*} item 
   */
  dele(item) {
    console.log(item);
    const { selects, checkedKeys } = this.state;
    const { type } = this.props;
    let arr = selects, list = checkedKeys;
    list = JSON.parse(JSON.stringify(list))
    if (type === 'per') {

      _.remove(arr, function (params) {
        return params.value === item.value
      })
      _.remove(list, function (params) {
        return params.indexOf(item.value) > -1
      })
      _.remove(list, function (params) {
        return params === item.parId;
      })
    } else {
      _.remove(arr, function (params) {
        return params.value === item.value;
      })
      _.remove(list, function (params) {
        return params === item.value;
      })
      _.remove(list, function (params) {
        return params === item.parId;
      })
    }
    this.setState({
      selects: arr,
      checkedKeys: list,
    })
  }

  /**
   * @desc 确定操作
   */
  onOk() {
    const { selects } = this.state;
    let list = []
    selects.map(item => {
      list.push(item.value);
    })
    this.props.modalVi('ok', list);
    let that = this
    setTimeout(() => {
      that.setState({
        treeData: [],
        checkedKeys: [],
        expandedKeys: [],
        selects: [],
        all: 0,
      })
    }, 300);

  }

  render() {
    const { visible, treeData, selected, type } = this.props;
    const { checkedKeys, expandedKeys, selects, all, school } = this.state;
    console.log('模态框数据变化')
    return <div>
      <ModalPonent
        title={type === 'per' ? '添加人员' : `设置范围${school ? ' - ' + school : ''}`}
        visible={visible}
        onOk={() => this.onOk()}
        onCancel={() => this.props.modalVi('cancel')}
        footer={{ ok: '确定', cancel: '取消' }}
        width={'610px'}
        content={
          <div className='mj-lm-content'>
            <div className='mj-lm-placeCon'>
              <div className='mj-lm-textCon'>
                <div>{`共${all}${type === 'per' ? '人' : '栋'}`}</div>
                <div onClick={() => this.treeSeleAll()}>全选</div>
              </div>
              <div className='mj-lm-places'>
                <PerfectScrollbar>
                  <Tree
                    checkable
                    checkedKeys={checkedKeys}
                    expandedKeys={expandedKeys}
                    onExpand={(expandedKeys) => this.setState({ expandedKeys })}
                    onCheck={(checkedKeys, e) => this.treeSele(checkedKeys, e)}
                    onSelect={(checkedKeys, e) => this.treeSele(checkedKeys, e)}

                  >
                    {
                      treeData && treeData.length ?
                        treeData.map((item, index) => {
                          return <TreeNode
                            key={item.value}
                            title={item.title}
                            value={item.value}
                            disabled={type === 'per' && item.disabled}
                          >

                            {
                              item.children && item.children.length ?
                                item.children.map((child, childIndex) => {
                                  return <TreeNode
                                    key={child.value}
                                    title={child.title}
                                    parId={item.value}
                                    selectable={false}
                                    disabled={type === 'per' && child.disabled}
                                    value={child.value} />
                                }) : null
                            }
                          </TreeNode>
                        }) : null
                    }
                  </Tree>
                </PerfectScrollbar>
              </div>
            </div>

            <div className='mj-lm-iconCon'>
              <SVG type='xz' />
            </div>

            <div className='mj-lm-seleCon'>
              <div className='mj-lm-textCon'>
                <div>{`已选择（${selects.length}）`}</div>
                <div onClick={() => this.clearAll()}>清空</div>
              </div>
              <div className='mj-lm-places'>
                <PerfectScrollbar>
                  <div className='mj-lm-placesSele'>
                    {
                      selects.length ?
                        selects.map(item => {
                          return <div key={item.value} className='mj-lm-place'>
                            <div className='mj-lm-placeName' title={item.title}>{item.title}</div>
                            <div className='mj-lm-placeIcon' onClick={() => this.dele(item)} >
                              <SVG type='sc' />
                            </div>
                          </div>
                        }) : null
                    }
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
          </div>
        }
      />
    </div>
  }
}

export default LimitsModal;
