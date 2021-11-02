/*
 * @Author: xq 
 * @Date: 2021-01-19 15:34:32 
 * @Last Modified by: xq
 * @Last Modified time: 2021-03-12 13:51:02
 * 房间规则页 - 公共组件
 */
import React, { useState } from "react";
import { CheckOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Tree } from 'antd';

// 弹框 - step栏
export const StepCom = props => {
    const { step } = props;
    return (
        <div className='xq-rule-pop-heads'>
            <div className='xq-rule-pop-head'>
                <span className={step === '1' ? 'xq-rule-pop-idx curr' : 'xq-rule-pop-idx curr gou'}>
                    {
                        step !== '1'
                            ? <CheckOutlined style={{ fontSize: '20px', color: '#2e8ae6' }} />
                            : '1'
                    }
                </span>
                添加宿管人员
            </div>
            <div className='xq-rule-pop-head'>
                <span className={step === '2' ? 'xq-rule-pop-idx curr' : 'xq-rule-pop-idx'}>
                    2
                </span>
                设置管辖楼层
            </div>
        </div>
    )
}

// 弹框 - 楼栋树
export const BuildTree = props => {
    const { clsName,editBuildKey } = props;   // 全部树
    const initKeys = clsName && clsName === 'xq-edit-pop' ? editBuildKey : [];
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState(initKeys);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [paramKeys,setParamKeys] = useState(initKeys);
    const ruleManageStore = useSelector((state) => {
        console.log('state:',state)
        return state.buildTree_reducer
    });

    // 初始化数
    const initTreeAdd =  () => {
        console.log('原数据 ruleManageStore.list',ruleManageStore.buildTree)
        if(ruleManageStore.buildTree.length === 0) return false;
        // return []
        const recursion = (lists) => {
            let newList = [];
            newList = lists.map(item => {
                if(item.plaType === 0 || item.plaType === 1){
                    return {
                        title: item.buildName,
                        key:item.buildId,
                        plaType:item.plaType	,
                        children: recursion(item.childrenList)
                    }
                } 
                if(item.plaType === 2){
                    return {
                        title: item.buildName,
                        key:item.buildId,
                        plaType:item.plaType,
                        children: []
                    }
                }
            })
            console.log('输出数据 newList：',newList)
        return newList
        }
        
        return recursion(ruleManageStore.buildTree)
    }

    // 展开key数组
    const onExpand = (expandedKeys) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    // 复选框 选中key 数组
    const onCheck = (checkedKeys,e) => {
        setCheckedKeys(checkedKeys);
        let _paramKeys = [];
        if(e.checkedNodes && e.checkedNodes.length){
            e.checkedNodes.map(item => {
                if(item.plaType === 2 ){
                    _paramKeys.push({
                        buildName:item.title,
                        buildId	: item.key
                    })
                }
            })
        } 
        setParamKeys(_paramKeys)
        props.buildChange(_paramKeys)
    };
    
    return <div className={`xq-rule-pop-trees ${clsName}`}>
        <div className='xq-rule-pop-tree'>
            <Tree
                checkable
                onExpand={onExpand}
                showIcon={true} 
                selectable={false}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={initTreeAdd()}
            />
        </div>
        <div className='xq-rule-pop-tree-total'>
            已选择{paramKeys.length}层
        </div>
    </div>
}

export const dataHandle = data => {
    let resultData = [];
    data.map( item => {
        switch(item.plaType){
            case 0:
                let ldList = item.childrenList;
                if(ldList.length){
                    for(let i=0;i<ldList.length;i++){
                        let ldItem = ldList[i].childrenList;
                        if(ldItem && ldItem.length){
                            resultData.push(item);
                        }
                        break;
                    }
                }
                break;
            case 1:
                let lcList = item.childrenList;
                if(lcList.length > 0 ) resultData.push(item);
                break;
        }
    })
    return resultData;
}