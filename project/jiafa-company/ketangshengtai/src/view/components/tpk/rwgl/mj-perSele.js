/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-29 14:36:39
 * 听评课V2.2——创建评课任务-第二步  
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Input, Tree, Button } from 'antd';
import PerfectScrollbar from "react-perfect-scrollbar";
import _ from 'lodash'
import { List } from 'react-virtualized';
import SVG from './.././../../public/public-component-svg';
import noneData from './../../../../media/picture/noneData.png';

import './../../../../style/tpk/rwgl/zq-selePer.scss';
import { perChan } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';
import {
  getPostData, getPersonData, propPerSet, changeData, handleSelectPerson,
  handleInit
} from './../../../../redux/tpk/rwgl/zq-perSele.reducer';

const { TreeNode } = Tree;
const indexList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

@connect(state => ({
  addTask: state.addTask,
  personSele: state.personSele
}), {
  perChan, getPostData, getPersonData, propPerSet, changeData, handleSelectPerson,
  handleInit
})
export default class PerSele extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      nodeId: '',
      nodeName: '',
      selectedKeys: [],
      expandedKeys: [],
    }
    this.renderTreeNodes = this.renderTreeNodes.bind(this)
    this.onCheck = this.onCheck.bind(this)
    this.rowRenderer_person = this.rowRenderer_person.bind(this)
  }

  componentDidMount() {
    const {perList} = this.props;
    let list =JSON.parse(JSON.stringify(perList));
    list.map(item=>{
      item.personId = item.perId;
      item.personName = item.perName;
      item.postName = item.work;
      // item.postId = item.perId;
    })
    
    this.props.propPerSet(list);
    //职务树请求
    this.props.getPostData();
  }

  componentWillUnmount() {
    this.props.handleInit()
  }
  /**
   * 树节点渲染
   */
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} dataRef={item} />;
    });

  /**
   * 职务树多选
   */
  onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
    this.props.getPersonData({ curPostList: checkedKeys })
  };
  /**
   * List 插件list
   */
  rowRenderer_person = (params) => {
    const { personData_handle } = this.props.personSele;
    const { index, key, style, parent } = params;
    const { curPerList } = parent.props;

    return <div key={key} style={style}>
      {
        personData_handle[index].map((item, i) => {
          let isSelect = _.findIndex(curPerList, { personId: item.personId })
          let title = item.postName ? item.personName + '（' + item.postName + '）' : item.personName
          return <div
            key={item.personId}
            className={isSelect === -1 ? 'zq-person-item' : 'zq-person-item zq-person-select'}
            title={title}
            onClick={() => this.props.handleSelectPerson(item)}
          >
            <p>{item.personName}</p>
            <p>{item.postName}</p>
          </div>
        })
      }
    </div>
  }
  render() {
    const { personModal } = this.props.addTask;
    const { index, personData, personData_handle, curPerList, propPer, curPostList } = this.props.personSele;
    // console.log(personData, curPerList);
    
    return <Modal
      title='选择评课人员'
      centered={true}
      wrapClassName='mj-scl-seleModal zq-scl-seleModal'
      visible={personModal}
      cancelText={'取消'}
      okText={'确定'}
      onCancel={() => this.props.perChan('perModal', false)}
      onOk={() => this.props.perChan('perChecked', curPerList)}
    >
      <div className='zq-psModal-body'>
        <p>指定的评课人员：</p>
        <div className='zq-psModal-cont'>
          <div className='zq-cont-left'>
            <p>选中机构/职务</p>
            <div className='zq-left-treeBox'>
              <div className='zq-left-treeSearch'>
                <SVG type='sousuo-2' title='搜索' />
                <Input placeholder="请输入机构/职务"
                  onChange={(e) => this.props.changeData({ postKey: e.target.value })}
                // onPressEnter={this.props.getPostData}
                />
                <Button type="primary" onClick={this.props.getPostData}>搜索</Button>
              </div>
              <div className='zq-left-tree'>
                <PerfectScrollbar>
                  <Tree
                    checkable
                    autoExpandParent
                    // onSelect={this.onSelect}
                    onCheck={this.onCheck}
                  >
                    {this.renderTreeNodes(this.props.personSele.treeData)}
                  </Tree>
                </PerfectScrollbar>
              </div>
            </div>
            <div className='zq-person-nexticon'>
              <SVG type='nextWeek' title='下一步' />
              <SVG type='nextWeek' title='下一步' />
            </div>
          </div>
          <div className='zq-cont-middle'>
            <div className='zq-left-treeSearch'>
              <SVG type='sousuo-2' title='搜索' />
              <Input placeholder="请输入人名"
                onChange={(e) => this.props.changeData({ perKey: e.target.value })}
              // onPressEnter={this.props.getPostData}
              />
              <Button type="primary"
                onClick={() => this.props.getPersonData({ curPostList})}
              >搜索</Button>
            </div>
            <div className='zq-person-index'>
              {
                index === '' ?
                  <span>
                    <SVG type='qb' title='全部' />
                  </span> :
                  <span onClick={() => this.props.getPersonData({ index: '', curPostList })}>
                    <SVG type='pingfen' title='全部' />
                  </span>
              }
              <div className='zq-person-indexItem'>
                {
                  indexList.map((item, i) => {
                    return <span
                      onClick={() => this.props.getPersonData({ index: item, curPostList })}
                      className={index === item ? 'zq-itemActive' : ''}
                      key={item}>{item}</span>
                  })
                }
              </div>
            </div>
            <div className='zq-person-list'>
              {
                personData.length ?
                  <List
                    className='zq-personList'
                    width={448}
                    height={326}
                    rowCount={personData_handle.length}
                    rowHeight={74}
                    curPerList={curPerList}
                    rowRenderer={this.rowRenderer_person}
                    overscanRowCount={20}
                  /> : <div className='mj-rxq-noneData'>
                    <img src={noneData} />
                    <div>暂无数据</div>
                  </div>
              }
            </div>
            <div className='zq-person-nexticon'>
              <SVG type='nextWeek' title='下一步' />
              <SVG type='nextWeek' title='下一步' />
            </div>
          </div>
          <div className='zq-cont-right'>
            <div>
              <p>已选择评课人员</p>
              <div className='zq-selePerNum'>
                已选<span>{curPerList.length}</span>人
              </div>
            </div>
            <div>
              <PerfectScrollbar>
                {
                  curPerList.length ?
                    <div>
                      {
                        curPerList.map(item => {
                          let title = item.postName ? item.personName + '（' + item.postName + '）' : item.personName
                          return <div
                            key={item.personId}
                            className='zq-person-item zq-person-select'
                            title={title}
                          >
                            <p>{item.personName}</p>
                            <p>{item.postName}</p>
                            <span
                              onClick={() => this.props.handleSelectPerson(item)}
                            >
                              <SVG type='quxiao' title='取消' />
                            </span>
                          </div>
                        })
                      }

                    </div> : <div className='mj-rxq-noneData'>
                      <img src={noneData} />
                      <div>暂无数据</div>
                    </div>
                }
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  }
}
