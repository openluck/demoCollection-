/*
 * @Author: JudyC 
 * @Date: 2017-09-12 15:16:38 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-22 17:08:48
 */
import React, { Component } from 'react';
import { Tree } from 'antd';
// import { G } from "../../../../js/g"
import './../../../style/tpk/mj_researchTree.css';
// import { v1 } from "node-uuid";

const TreeNode = Tree.TreeNode;

class ResearchTree extends Component {
  
  render() {
    const { treeData } = this.props
    return (
      <div className="cjy-rt-treeBox">
        <Tree onSelect={this.onSelect.bind(this)} >
          {
            this.props.treeData == null
              // G.sections == null 
              ? ''
              : this.props.treeData.map((item1) => {
                return (
                  <TreeNode title={item1.name} key={item1.id} level="1">
                    {
                      item1.children.map((item2) => {
                        return (
                          <TreeNode title={item2.name} key={item2.id} level="2">
                            {
                              item2.children.map((item3) => {
                                return (<TreeNode grade={item1.name} title={item3.name} key={item3.id} level="3" />)
                              })
                            }
                          </TreeNode>
                        )
                      })
                    }
                  </TreeNode>
                )
              })
          }
        </Tree>
      </div>
    )
  }

  onSelect(selectedKeys, info) {
    // console.log('selectedKeys', selectedKeys)
    // if (selectedKeys[0] && selectedKeys[0].indexOf('/') > -1) {
    //   selectedKeys[0] = selectedKeys[0].split('/')[0]
    // }
    this.props.handleChangeGrade(selectedKeys, info.node.props.grade + info.node.props.title, info.node.props.level);
  }
}

export default ResearchTree;