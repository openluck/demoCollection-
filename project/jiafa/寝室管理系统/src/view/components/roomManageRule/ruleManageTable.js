/*
 * @Author: xq 
 * @Date: 2021-01-18 14:20:48 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-04-28 16:14:22
 * 住宿管理 - 房间规则 - 宿舍管理员设置 列表
 */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Popover, Drawer, message, Input, Table, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PaginationPonent,InitScroll } from './../../components/common'
import SVG from "./../../public/public-component-svg";
import { StepCom, BuildTree } from './ruleManagePub'
import { getPersonList_request, deleManage_request } from './../../../request/page-room/ruleManage'
import { dataHandle } from './ruleManagePub'
import { ruleManageTree_action } from './../../../redux/actions/ruleManage.action'
import { submitAdd_request } from './../../../request/page-room/ruleManage'

const { confirm } = Modal;

export const RuleManageTable = withRouter(props => {
    const { data } = props;
    const [delImg, setDelImg] = useState(false);
    const [popStep, setPopStep] = useState('1');
    const [newPop, setNewPop] = useState(false);
    const [editPop, setEditPop] = useState(false);
    const [personList, setPersonList] = useState([]);
    const [personTotal, setPersonTotal] = useState(0);
    const [personIdx, setPersonIdx] = useState(1);
    const [personLoading, setPersonLoading] = useState(false);
    const [personSearch, setPersonSearch] = useState('');
    const [paramPerson, setParamPerson] = useState([]);
    const [paramBuildKeys, setParamBuildKeys] = useState([]);
    const [editInfo, setEditInfo] = useState({});
    const buildTreeStore = useSelector((state) => state.buildTree_reducer);
    const ruleManageStore = useSelector((state) => state.ruleManageTree_reducer);
    const dispatch = useDispatch();
    const columns = [
        {
            title: '教师姓名：',
            dataIndex: 'name',
            render: (text) => text
        },
        {
            title: '性别：',
            dataIndex: 'sex',  // 1-男,2-女 2020-2-25 改
            render: (text) => text === '2' ? '女' : (text === '1' ? '男' : '--')
        },
        {
            title: '证件号：',
            dataIndex: 'codeID',
            render: (text) => text || '--'
        },
        {
            title: '手机号：',
            dataIndex: 'telNumber',
            render: (text) => text || '--'
        }
    ]
    const editInfoTitle = [
        { title: '教师姓名', key: 'name' },
        { title: '性别', key: 'sex' },
        { title: '证件号', key: 'codeID' },
        { title: '手机号', key: 'telNumber' }
    ]

    /**
     * @desc 列表复选
     */
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setParamPerson(selectedRows)
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    useEffect(() => {
        if (!ruleManageStore || !ruleManageStore.list || ruleManageStore.list.length === 0) {
            let data = dataHandle(buildTreeStore.buildTree)
            dispatch(ruleManageTree_action({ list: data }))
        }

    }, [])


    /**
    * @desc 新增 - 弹框显示
    * @param {string} step 步骤索引 '1' 第一步、'2' 第二步 
    */
    const showDrawer = step => {
        setNewPop(true);
        setPopStep(step);
        getPersonList(1);
    };

    /**
     * @desc 获取宿管人员列表
     * @param {number} idx 查询的页码
     */
    const getPersonList = async idx => {
        setPersonLoading(true);
        let param = {
            pageIndex: idx,
            pageSize: 10,
            searchName: personSearch
        };
        let resData = await getPersonList_request(param);
        if (resData.result) {
            let { list, total } = resData.data;
            list.map(item => {
                item.key = item.uid
            })
            setPersonList(list);
            setPersonTotal(total);
            setPersonIdx(idx)
            InitScroll();
        } else {
            message.warning(resData.message || '获取数据失败！')
        }
        setPersonLoading(false)
    }

    // 人员 - 切换页码
    const personIdxChange = idx => {
        setPersonIdx(idx)
        getPersonList(idx)
    }

    /**
     * @desc 弹框关闭
     */
    const onCloseAdd = () => {
        setNewPop(false);
        setEditPop(false);
        setPopStep('');
        setPersonSearch('');
        setEditInfo({})
        setPersonList([]);
        setParamPerson([])
        setParamBuildKeys([])
    };

    // title渲染
    const titleRender = list => {
        if (list.length === 0) return false;
        return <div>
            {
                list.map((item, index) => {
                    return <p key={index}>{item}</p>
                })
            }
        </div>
    }

    /**
     * @desc 点击编辑
     * @param {object} data 单个宿管信息
     */
    const editPerson = data => {
        let buildKeys = data.floorIds.split(',');
        data.buildKeys = buildKeys;
        setEditInfo(data);
        // 初始化入参
        let _pakeys = [];
        buildKeys.map((item, index) => {
            _pakeys.push({
                buildName: data.buildList[index],
                buildId: item
            })
        })
        setParamBuildKeys(_pakeys)
        setEditPop(true);
    }

    /**
     * @desc 删除单个宿管 - 删除
     * @param {*} id 
     */
    const deleHandleEeq = async (id) => {
        let param = {
            uid: id
        }
        const resData = await deleManage_request(param);
        if (resData.result) {
            message.success('操作成功！');
            props.initList();
        } else {
            message.warning('操作失败！');
        }
    }

    /**
     * @desc 删除单个宿管 - 二次确认
     * @param {*} type 
     */
    const deleHandle = id => {
        confirm({
            title: '是否要删除？',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                deleHandleEeq(id);
            },
            onCancel() { },
        });
    }

    /**
     * @desc 提交
     */
    const submitHandle = async (type) => {
        let params = {}, url = '';

        if (type === 'edit') {
            url = 'manageRule/editManage';
            params = {
                uid: editInfo.uid,
                buildList: paramBuildKeys
            }
        } else {
            url = 'manageRule/addManageList';
            let persons = [];
            paramPerson.map(item => {
                persons.push(item.uid)
            })
            params = {
                manageList: persons,
                buildList: paramBuildKeys
            }
        }
        onCloseAdd();
        const resData = await submitAdd_request(params, url);
        if (resData.result) {
            message.success('操作成功！');
            props.initList();
        } else {
            message.warning(resData.message || '操作失败！');
        }
    }

    return (
        <>
            <div className='xq-rule-lists'>
                <div className='xq-rule-list-add' onClick={() => showDrawer('1')}>
                    <SVG
                        type={'tianjiarenyuan'}
                        style={{
                            width: 44,
                            height: 44,
                            color: '#919599'
                        }}
                    />
                    <span>添加宿管人员</span>
                </div>
                {
                    data.map(item => {
                        let build = [];
                        if (item.buildList && item.buildList.length > 3) {
                            build = item.buildList.slice(0, 3);
                            build[3] = '...';
                        } else {
                            build = item.buildList;
                        }
                        return <div className='xq-rule-list' key={item.uid}>
                            <div className='xq-rule-list-img'>
                                {
                                    item.imgSrc
                                    ? <img
                                        alt='宿管员'
                                        onError={()=> setDelImg(true)}
                                        src={`${G.dataServices}/public/getAvatar/${orgCode}/${item.imgSrc}`} 
                                        className='xq-modal-head-img'
                                    />
                                    : <SVG
                                        type='nantouxiang'
                                        style={{ width: 64, height: 64 }}
                                        title='头像'
                                    />
                                }
                            </div>
                            <div className='xq-rule-list-r'>
                                <div className='xq-rule-list-name'>
                                    {item.name}
                                </div>
                                <div className='xq-rule-list-edit'>
                                    管辖范围：
                                    <div
                                        className='xq-rule-edit-svg'
                                        onClick={() => editPerson(item)}
                                    >
                                        <SVG
                                            type='bianji'
                                            style={{ width: 14, height: 14, color: '#358ee6' }}
                                        />
                                    </div>
                                </div>
                                {
                                    build && build.length
                                        ? (
                                            build.length > 3
                                                ? <Popover content={titleRender(item.buildList)} title="" placement="top">
                                                    {
                                                        build.map((it, index) => {
                                                            return <div
                                                                key={index}
                                                                className='xq-rule-list-build'>
                                                                {it}
                                                            </div>
                                                        })
                                                    }
                                                </Popover>
                                                : (
                                                    build.map((it, index) => {
                                                        return <div
                                                            key={index}
                                                            title={it}
                                                            className='xq-rule-list-build'>
                                                            {it}
                                                        </div>
                                                    })
                                                )
                                        )
                                        : '暂无宿舍信息'
                                }

                            </div>
                            {/* 删除颜色 #f7f9fa  删除高度48 li*/}
                            <div
                                className='xq-rule-list-dele'
                                onClick={() => deleHandle(item.uid)}
                            >
                                <SVG
                                    type='shanchu'
                                    style={{ width: 13, height: 15, color: '#747779' }}
                                />
                            删除
                        </div>
                        </div>
                    })
                }
            </div>

            {/* 弹框 新增 */}
            {
                newPop
                    ? <Drawer
                        title="设置管辖楼层"
                        placement="right"
                        closable={true}
                        maskClosable={false}
                        onClose={onCloseAdd}
                        visible={newPop}
                        width={640}
                        getContainer={false}
                        className='xq-rule-pop'
                    >
                        <div style={{ 
                            // height: '100%'
                             }}>
                            {/* 进度栏 */}
                            <StepCom step={popStep} />

                            {/* 搜索框 || 职工信息展示 */}
                            {
                                popStep === '1'
                                    ? <div className='xq-rule-pop-search'>
                                        <Input
                                            placeholder="教职工/证件号"
                                            value={personSearch}
                                            onPressEnter={() => getPersonList(1)}
                                            onChange={(e) => {
                                                setPersonSearch(e.target.value)
                                            }}
                                        />
                                        <span onClick={() => getPersonList(1)}>
                                            <SVG
                                                type='sousuokaobei2'
                                                color={'#bfc0c2'}
                                            />
                                        </span>
                                    </div>
                                    : null
                            }

                            {/* 人员列表 */}
                            <div className='xq-rule-person-table' style={{ display: popStep === '2' ? 'none' : 'block' }}>
                                <Table
                                    pagination={false}
                                    rowSelection={{
                                        type: 'checkbox',
                                        ...rowSelection,
                                    }}
                                    bordered={true}
                                    loading={personLoading}
                                    columns={columns}
                                    dataSource={personList}
                                />
                            </div>

                            {/* 楼栋树 */}
                            {
                                popStep === '2'
                                    ? <BuildTree buildChange={list => setParamBuildKeys(list)} />
                                    : null
                            }

                            {/* 页码 */}
                            {
                                popStep === '1' && !personLoading
                                    ? <div className='xq-rule-pop-pagination'>
                                        <PaginationPonent
                                            pageIndex={personIdx}
                                            pageSize={10}
                                            total={personTotal}
                                            pageChange={value => personIdxChange(value)}
                                        />
                                    </div>
                                    : null
                            }
                        </div>

                        {/* 底部按钮 */}
                        {
                            popStep === '1'
                                ? <div className='xq-rule-pop-btns'>
                                    <Button
                                        type="primary"
                                        onClick={() => setPopStep('2')}
                                        disabled={paramPerson.length === 0}
                                    >
                                        下一步
                            </Button>
                                    <Button onClick={onCloseAdd}>
                                        取消
                            </Button>
                                </div>
                                : <div className='xq-rule-pop-btns'>
                                    <Button
                                        type="primary"
                                        onClick={() => {setPopStep('1');setParamBuildKeys([])}}
                                    >
                                        上一步
                            </Button>
                                    <Button
                                        disabled={paramBuildKeys.length === 0}
                                        onClick={() => submitHandle('add')}
                                    >
                                        完成
                            </Button>
                                </div>
                        }
                    </Drawer>
                    : null
            }

            {/* 弹框 编辑 */}
            {
                editPop
                    ? <Drawer
                        title="设置管辖楼层"
                        placement="right"
                        closable={true}
                        maskClosable={false}
                        onClose={onCloseAdd}
                        visible={editPop}
                        width={640}
                        getContainer={false}
                        className='xq-rule-pop'
                    >
                        <div style={{ height: '100%' }}>
                            {/* 职工信息展示 */}
                            <div className='xq-rule-person-info'>
                                {
                                    editInfoTitle.map(item => {
                                        return <div className='xq-rule-person-info-li' key={item.key}>
                                            <span>{item.title}</span>
                                            <span>{editInfo[item.key] || '--'}</span>
                                        </div>
                                    })
                                }
                            </div>

                            {/* 楼栋树 要加一个入参  默认选中*/}
                            <BuildTree
                                buildChange={list => setParamBuildKeys(list)}
                                clsName='xq-edit-pop'
                                editBuildKey={editInfo.buildKeys}
                            />
                        </div>
                        {/* 底部按钮 */}
                        <div className='xq-rule-pop-btns'>
                            <Button
                                type="primary"
                                disabled={paramBuildKeys.length === 0}
                                onClick={() => submitHandle('edit')}
                            >
                                确认
                            </Button>
                            <Button onClick={onCloseAdd}>
                                取消
                            </Button>
                        </div>
                    </Drawer>
                    : null
            }
        </>
    )
})