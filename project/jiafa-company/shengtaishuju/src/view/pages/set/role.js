/*
 * @Author: lxx 
 * @Date: 2021-01-14 11:07:04 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-02-07 01:46:17
 */
import React, { Component } from 'react'
import './../../../style/ynj_role.scss';
import { Tabs, Checkbox, Button, message, Tree } from 'antd';
import SVG from './../../public/svg'
import _ from 'lodash';
import { request } from '../../../util/request';
import NoDataAndLoading from './../../components/image/public/noDataAndLoading';


const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;
const { TreeNode } = Tree;

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnFlag: true,
            selValue: '', // tab选中值
            data: [],
            roles: [],
            expandedKeys: [], // 菜单展开项
            checkedKeys: []
        }
    }
    componentDidMount() {
        this.getRolesArr()
    }

    /**
     * 获取角色预置数据
     */
    getRolesArr = () => {
        request('api/system/getRoles', { type: "" }, res => {
            if (res.data && res.data.length && res.result) {
                let id = res.data[0].roleId
                this.getRoleData(id)
                this.setState({
                    roles: res.data,
                    selValue: id
                })
            } else {
                this.setState({
                    roles: [],
                    selValue: ''
                })
            }
        })
    }

    /**
     * 获取各角色权限数据
     * @param {String} id 角色id
     */
    getRoleData = (id) => {
        this.setState({
            selValue: id,
            btnFlag: true
        })
        request('api/system/getEachRoleMenu', { roleId: id }, (res) => {
            if (res.result && res.data && res.data.length) {
                let data = res.data;
                const updateData = (arr) => {
                    arr.map(item => {
                        Object.assign(item, { checked: [], halfChecked: [] })
                        if (item.children && item.children.length) {
                            // 获取子项checkType为1的选中项
                            let arr = _.filter(item.children, o => { return o.checkType === '1' }) || []
                            if (arr.length && arr.length === item.children.length) {
                                // 全部选中
                                arr.map(dt => {
                                    // 选中的子项push到父级
                                    item.checked.push(dt.id)
                                })
                                item.checked.unshift(item.id)
                            } else {
                                // 子项未全部选中
                                arr.map(dt => {
                                    // 选中的子项push到父级
                                    item.checked.push(dt.id)
                                })
                                item.halfChecked.push(item.id)
                            }
                            updateData(item.children)
                        } else {
                            item.checkType === '1' ? item.checked.unshift(item.id) : null
                        }

                    })
                }
                updateData(data);
                console.log(data)
                this.setState({
                    data: data
                })
            } else {
                this.setState({
                    data: []
                })
            }
        })
    }

    /**
     * 父级菜单选中或取消
     * @param {*} handleAllCheck {*} 父级菜单
     */
    handleAllCheck = (e, ind) => {
        let { data } = this.state
        if (e.target.checked) {
            // 全选
            let arr = data[ind].children.map(item => item.id) || []
            data[ind].checkType = '1'
            data[ind].checked = arr
            const checkAll = (list) => {
                list.map(dt => {
                    if (dt.children && dt.children.length) {
                        // 有子级
                        dt.checkType = '1'
                        dt.checked = dt.children.map(item => item.id)
                        dt.checked.unshift(dt.id)
                        dt.halfChecked = []
                        checkAll(dt.children)
                    } else {
                        // 最后一级
                        dt.checkType = '1'
                        dt.checked = [dt.id]
                    }
                })
            }
            checkAll(data[ind].children)
        } else {
            // 取消选中
            data[ind].checkType = '0'
            data[ind].checked = []
            const unCheckAll = (list) => {
                list.map(dt => {
                    if (dt.children && dt.children.length) {
                        // 有子级
                        dt.checkType = '0'
                        dt.checked = []
                        dt.halfChecked = []
                        unCheckAll(dt.children)
                    } else {
                        // 最后一级
                        dt.checkType = '0'
                        dt.checked = []
                    }
                })
            }
            unCheckAll(data[ind].children)
        }
        this.setState({
            data,
            btnFlag: false
        })
    }

    /**
     * 保存编辑菜单数据
     */
    onClicked = () => {
        let { data, selValue } = this.state
        const delCheck = (arr) => {
            arr.map(dt => {
                if(dt.children && dt.children.length) {
                    delCheck(dt.children)
                }
                delete dt.checked
                delete dt.halfChecked
            })
        }
        delCheck(data)
        console.log('data', data)
        request('api/system/updateRolesMenu', { roleId: selValue, roleData: data }, res => {
            if (res.result) {
                message.success('保存成功')
                this.getRoleData(selValue)
            } else {
                message.warning(res.message)
            }
        })
    }

    /**
     * 生成树
     * @param {Array} data 
     */
    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode title={item.name} key={item.id} dataRef={item} selectable={item.checkType === '1' ? true : false}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={item.name} selectable={item.checkType === '1' ? true : false} />;
        });
    }

    /**
     * 展开项
     * @param {Array} expandedKeys 
     */
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys
        });
    };

    /**
     * 二级菜单及以下树勾选操作
     * @param {*} e 
     * @param {Number} ind 一级菜单下标
     * @param {Number} chInd 二级菜单下标
     */
    onCheck = (checkedKeys, e, ind, chInd) => {
        let { data } = this.state
        let { checked, node } = e
        // console.log('onCheck', ind, chInd, checked, node);
        let props = node.props;
        let childArr = data[ind].children[chInd].children
        if (checked) {
            if (childArr && childArr.length) {
                // 有三级菜单
                if (props.dataRef) {
                    // 选中二级菜单，本级及所有下级选中
                    data[ind].children[chInd].checkType = '1'
                    let arr = [props.eventKey]
                    data[ind].children[chInd].children.map(dt => {
                        dt.checkType = '1'
                        arr.push(dt.id)
                    })
                    data[ind].children[chInd].checked = arr
                    // 一级菜单子项选中项
                    if (_.findIndex(data[ind].checked, o => o === data[ind].children[chInd].id) === -1) {
                        data[ind].checked.push(data[ind].children[chInd].id)
                    }
                } else {
                    // 选中三级菜单
                    data[ind].children[chInd].children.map(dt => {
                        if (dt.id === props.eventKey) {
                            dt.checkType = '1'
                        }
                    })
                    data[ind].children[chInd].checked.push(props.eventKey)
                    if (data[ind].children[chInd].checked.length === childArr.length) {
                        // 总勾选项等于总长度，置空半勾项，勾选项加入父级id
                        data[ind].children[chInd].checked.unshift(data[ind].children[chInd].id)
                        data[ind].children[chInd].halfChecked = []
                        data[ind].children[chInd].checkType = '1'
                    } else {
                        // 半勾值加入父级id
                        data[ind].children[chInd].halfChecked = [data[ind].children[chInd].id]
                        data[ind].children[chInd].checkType = '2'
                    }
                    // 一级菜单子项选中项
                    let fd = _.findIndex(data[ind].checked, o => o === data[ind].children[chInd].id)
                    console.log(fd)
                    if (fd === -1) {
                        data[ind].checked.push(data[ind].children[chInd].id)
                    }
                }
            } else {
                // 只有二级菜单
                data[ind].children[chInd].checkType = '1'
                data[ind].children[chInd].checked = [props.eventKey]
                // 一级菜单子项选中项
                if (_.findIndex(data[ind].checked, props.eventKey) === -1) {
                    data[ind].checked.push(props.eventKey)
                }
            }
        } else {
            if (childArr && childArr.length) {
                // 有三级菜单
                if (props.dataRef) {
                    // 取消二级菜单选中，所有下级菜单取消
                    data[ind].children[chInd].checkType = '0'
                    data[ind].children[chInd].children.map(dt => {
                        dt.checkType = '0'
                    })
                    data[ind].children[chInd].checked = []
                    data[ind].children[chInd].halfChecked = []
                    // 删除一级菜单中二级菜单选中项
                    let fd = _.findIndex(data[ind].checked, o => o === props.eventKey)
                    if (fd > -1) {
                        data[ind].checked.splice(fd, 1)
                    }
                } else {
                    // 取消三级菜单选中
                    data[ind].children[chInd].children.map(dt => {
                        if (dt.id === props.eventKey) {
                            dt.checkType = '0'
                        }
                    })
                    if (data[ind].children[chInd].checked.length > childArr.length) {
                        // 全选情况下三级菜单取消选中
                        // 删除第一项父级项
                        data[ind].children[chInd].checked.shift()
                        if (data[ind].children[chInd].checked.length === 1) {
                            // 只有一个三级菜单
                            data[ind].children[chInd].halfChecked = []
                            data[ind].children[chInd].checkType = '0'
                        } else {
                            // 父级项添加至半勾项项
                            data[ind].children[chInd].halfChecked = [data[ind].children[chInd].id]
                            data[ind].children[chInd].checkType = '2'
                        }
                    } else {
                        // 非全选情况三级菜单取消选中
                        if (data[ind].children[chInd].checked.length === 1) {
                            // 全部取消
                            data[ind].children[chInd].halfChecked = []
                            data[ind].children[chInd].checkType = '0'
                        }
                    }
                    data[ind].children[chInd].checked.map((it, index) => {
                        if (it === props.eventKey) {
                            // 删除选择项
                            data[ind].children[chInd].checked.splice(index, 1);
                        }
                    })
                    // 删除一级菜单中二级菜单选中项
                    let fd = _.findIndex(data[ind].checked, o => o === props.eventKey)
                    if (fd > -1) {
                        data[ind].checked.splice(fd, 1)
                    }
                }
            } else {
                // 无三级菜单
                data[ind].children[chInd].checkType = '0'
                data[ind].children[chInd].checked = []
                // 删除一级菜单中二级菜单选中项
                let fd = _.findIndex(data[ind].checked, o => o === props.eventKey)
                // console.log(_.findIndex(data[ind].checked, o => o === props.eventKey), fd)
                if (fd > -1) {
                    data[ind].checked.splice(fd, 1)
                }
            }

        }
        let checkArr = _.filter(data[ind].children, o => { return o.checkType === '1' })
        let notArr = _.filter(data[ind].children, o => { return o.checkType === '0' })
        if (notArr.length === data[ind].children.length) {
            data[ind].checkType = '0'
        } else if (checkArr.length === data[ind].children.length) {
            data[ind].checkType = '1'
        } else {
            data[ind].checkType = '2'
        }
        console.log('data', data)
        this.setState({
            data,
            btnFlag: false
        });
    };

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    };

    /**
     * 渲染菜单数据
     * @param {Array} data 菜单数据
     */
    getDom = (data) => {
        let { expandedKeys } = this.state
        return <div className="ynj_subMenu">
            {
                data && data.length
                    ? data.map((item, index) => {
                        return <div className="ynj_menu" key={index}>
                            <Checkbox
                                onChange={(e) => this.handleAllCheck(e, index)}
                                checked={item.checkType === '1' ? true : false}
                                indeterminate={item.checkType === '2' ? true : false}>
                                {item.name}
                            </Checkbox>
                            <div className="lxx-s-g-child lxx-g-flex-le">
                                {
                                    item.children && item.children.length
                                        ? item.children.map((dt, ind) => {
                                            return <Tree
                                                key={dt.id}
                                                checkable
                                                checkStrictly
                                                onExpand={this.onExpand}
                                                expandedKeys={expandedKeys}
                                                autoExpandParent={false}
                                                onCheck={(checkedKeys, e) => this.onCheck(checkedKeys, e, index, ind)}
                                                checkedKeys={{ checked: dt.checked, halfChecked: dt.halfChecked }}
                                            >
                                                {this.renderTreeNodes([dt])}
                                            </Tree>
                                        })
                                        : null
                                }
                            </div>

                        </div>
                    })
                    : <div style={{ height: 200 }}><NoDataAndLoading loading={false} /></div>
            }
        </div>
    }

    render() {
        let { data, roles, selValue } = this.state
        return (
            <div>
                <div className="head">
                    <Tabs value={selValue} onChange={this.getRoleData}>
                        {
                            roles.map(dt => {
                                return <TabPane tab={dt.roleName} key={dt.roleId}>
                                    {this.getDom(data)}
                                </TabPane>
                            })
                        }
                    </Tabs>
                </div>
                {/**按钮默认为灰色
                      功能：
                      内容改变 ：变为蓝色，可点击
                               ：点击保存，提示保存成功 */}
                <Button
                    className="ynj_button"
                    onClick={this.onClicked}
                    disabled={this.state.btnFlag}
                >
                    <SVG type='baocun'></SVG>
                    &nbsp;&nbsp;保存
                </Button>
            </div>



        );
    }
}
export default Role;