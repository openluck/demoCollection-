/*
 * @Author: yhc 
 * @Date: 2021-01-15 14:06:36 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-03-29 11:17:01
 */
import React, { useState, useEffect, useRef } from 'react'
import './../../../style/studentRoomManage.scss'
import { Alert, Cascader, Select, Input, Button, Table, Drawer, message, Modal } from 'antd'
import { useSelector } from "react-redux";
import SVG from './../../public/public-component-svg'
import { ConfigDrag } from './../../components/configGuide/publicCom'
import { PaginationPonent } from './../../../view/components/common'
import { StuProgress } from './../../components/component-room-studentRule/stuProgress'
import { stuManegeSearch, stuManegeExit, stuManegeDel, stuManegeAdd, stuManegeInfo, stuManegeOpera } from './../../../request/page-room/stuManage'
import { cancelReq } from './../../../util/request'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {downloadConfigErr_request} from '../../../request/page-room/configGuide.js'
export default function StudentRoomManage() {
    const { Search } = Input
    const classTree = useSelector(({ classesTree_reducer }) => classesTree_reducer).list;
    const [roomInfo, setRoomInfo] = useState({
        hasBedNum: '--',
        stuTotal: '--',
        noBedNum: '--',
        freeBedNum: '--'
    })
    const [total, setTotal] = useState(0)
    const [option, setOption] = useState([])
    const { Option } = Select
    const roomState = useRef(-1)
    const [loadingOut, setLoadingOut] = useState(true)
    const [loadingIn, setLoadingIn] = useState(true)
    const [dataList, setDataList] = useState([])
    const lines = useRef({})
    const [modalVisible, setModalVisible] = useState(false)
    const [column, setColumn] = useState([
        { title: '学生姓名', dataIndex: 'stuName', key: 'stuName' },
        { title: '性别', dataIndex: 'sex', key: 'sex', render: (e) => { return (<span>{e == 2 ? '女' : (e == 1 ? '男' : '--')}</span>) } },
        { title: '证件号', dataIndex: 'IDcard', key: 'IDcard', render: (e) => { return (<span>{e ? e : '--'}</span>) } },
        { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber', render: (e) => { return (<span>{e ? e : '--'}</span>) } },
        { title: '班级', dataIndex: 'className', key: 'className', render: (e) => { return (<span>{e ? e : '--'}</span>) } },
        { title: '住宿状态', dataIndex: 'roomState', key: 'roomState', render: (e) => { return (<span>{(e == 1 || e == 2) ? <span className='yhc-stuManageFont' style={{ color: '#3687D9', backgroundColor: '#daebfc' }}>已入住</span> : (e === 0 ? <span className='yhc-stuManageFont' style={{ color: 'red', backgroundColor: '#F8E7E7' }}>未入住</span> : '--')}</span>) } },
        { title: '所在房间', dataIndex: 'buildingName', key: 'buildingName', render: (e) => { return (<span>{e ? e : '--'}</span>) } },
        {
            title: '操作', dataIndex: 'stuName', key: 'stuName', render: (e, line) => {
                return (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: (line.roomState == 2 || line.roomState == 0) ? 'space-between' : 'flex-end', width: '120px' }} >
                            {
                                line.roomState == 2 ?
                                    <div style={{ cursor: 'pointer' }} className='yhc-svgFlex' onClick={() => {
                                        modalExit()
                                        lines.current = line
                                    }}>
                                        <SVG type='piliangtuisu' style={{ height: '14px', width: '14px', color: 'black', marginRight: '3px' }} />
                                        <span>退宿</span>
                                    </div>
                                    : line.roomState == 0 ?
                                        <div style={{ cursor: 'pointer' }} className='yhc-svgFlex' onClick={() => {
                                            moveIn(line)
                                        }}>
                                            <SVG type='ruzhu' style={{ height: '14px', width: '14px', color: 'black', marginRight: '3px' }} />
                                            <span>入住</span>
                                        </div>
                                        : null
                            }

                            <div style={{ cursor: 'pointer' }} className='yhc-svgFlex' onClick={() => {
                                modalDel(line.roomState)
                                lines.current = line
                            }}><SVG type='shanchu' style={{ height: '14px', width: '14px', color: 'black', marginRight: '3px' }} /><span>删除</span></div>
                        </div>
                    </div>
                )
            }
        },
    ])
    const [columnAdd, setColumnAdd] = useState([
        { title: '学生姓名', dataIndex: 'stuName', key: 'stuName' },
        { title: '性别', dataIndex: 'sex', key: 'sex', render: (e) => { return (<span>{e == 2 ? '女' : (e == 1 ? '男' : '--')}</span>) } },
        { title: '班级', dataIndex: 'gradeName', key: 'gradeName', render: (text, line) => { return (<span>{line.className}</span>) } },
        // { title: '学号', dataIndex: 'IDcard', key: 'IDcard' },
        { title: '证件号', dataIndex: 'stuId', key: 'stuId' },
    ])
    const [addDataList, setAddDataList] = useState([])
    //添加学生时的数据量
    const [stuTotal, setStuTotal] = useState(addDataList.length)
    const [searchText, setSearchText] = useState('')
    const [searchTextIn, setSearchTextIn] = useState('')
    const [drawerVisibile, setDrawerVisibile] = useState(false)
    const [drawerVisibleDel, setDrawerVisibileDel] = useState(false)
    const [drawerVisibleAdd, setDrawerVisibileAdd] = useState(false)
    const classId = useRef('all')
    const classIdIn = useRef('all')
    const pageSize = 20
    const [title, setTitle] = useState({ title: '', type: 0 })
    const pageIndexIn = useRef(1)
    const pageIndex = useRef(1)
    const stuArr = useRef([])
    const [roomStates, setRoomStates] = useState(-1)
    const [updateStatus, setUpdateStatus] = useState({title:'',state:''});
    const [progress, setProgress] = useState(0);
    const [fileId, setFileId] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const fileUp = useRef();
    const fileDel = useRef();
    const classOption = useRef(['all'])
    const searchValue = useRef('')
    const searchState = useRef(false)
    const searchValue1 = useRef('')
    const searchState1 = useRef(false)
    const classOptions = useRef(['all'])
    const addArr = useRef([])
    const [state,setState] = useState(false)
    const [uploadVisibilty,setUploadVisibility] = useState(false)
    const uploadState = useRef(0)
    const uploadFile = useRef()
    function modalExit() {
        setModalVisible(true)
        setTitle({ title: '退宿', type: 0 })
    }
    function modalDel(e) {
        if (e == 2) {
            message.warn('需学生退宿后方可删除该学生')
        }
        else {
            setModalVisible(true)
            setTitle({ title: '删除', type: 1 })
        }
    }
    function onClose() {
        setDrawerVisibile(false)
        clearState()
    }
    // 拖拽上传
    const onExit = (files) => {
        uploadState.current = 1
        // patchOperation(files)
        console.log('exit')
        uploadFile.current = files
        setUploadVisibility(true)
    };
    const onDel = files => {  
        uploadState.current = 2
        console.log('del')
        // patchOperation(files)
        uploadFile.current = files
        setUploadVisibility(true)
    }
    //批量操作
    function patchOperation(files){
        if(uploadState.current === 1){
            let params = {
                files
            }
            setState(true)
            let obj = {
                title:'正在退宿',
                state:'3'
            }
            setUpdateStatus(obj)
            stuManegeExit(
                params,
                res => {
                    if (res.result) {
                        searchList()
                        getRoomInfo()               
                        if (res.data.errId) {
                            setFileId(res.data.errId)
                            let obj1 = {
                                title:'退宿失败，存在异常数据',
                                state:'2'
                            }
                            setUpdateStatus(obj1)
                        } else {
                            let obj2 = {
                                title:'退宿成功',
                                state:'0'
                            }
                            setUpdateStatus(obj2)
                        }
                    } else {
                        let obj3 = {
                            title:'退宿失败',
                            state:'1'
                        }
                        setUpdateStatus(obj3)
                        message.error(res.message || '退宿失败！')
                    }
                    setProgress(0);
                },
                err => {
                    if (err.message && err.message.isCancel) {
                        // 手动中断
                        message.error(err.message.message)
                    } else {
                        // 非手动中断
                        message.error(err || '退宿失败！')
                    }
                    let obj4 = {
                        title:'退宿失败',
                        state:'1'
                    }
                    setUpdateStatus(obj4)
                    setProgress(0);
                },
                pro => {
                    // console.log('回调zhi ：', pro)
                    // if(pro<98){
                    //     setProgress(pro)
                    // }
                    setProgress(pro)
                }
            )
            setUploadVisibility(false)
        }
        else if(uploadState.current === 2){
            let params = {
                files
            }
            console.log('删除 uploadState:',uploadState)
            setState(true)
            let obj = {
                title:'正在删除',
                state:'3'
            }
            setUpdateStatus(obj)
            stuManegeDel(
                params,
                res => {
                    if (res.result) {             
                        searchList()
                        getRoomInfo()
                        if (res.data.errId) {
                            setFileId(res.data.errId)
                            let obj1 = {
                                title:'删除失败，存在异常数据',
                                state:'2'
                            }
                            setUpdateStatus(obj1)
                        } else {
                            let obj2 = {
                                title:'删除成功',
                                state:'0'
                            }
                            setUpdateStatus(obj2)
                        }
                    } else {
                        let obj3 = {
                            title:'删除失败',
                            state:'1'
                        }
                        setUpdateStatus(obj3)
                        message.error(res.message || '删除失败！')
                    }
                    setProgress(0);
                },
                err => {
                    if (err.message && err.message.isCancel) {
                        // 手动中断
                        message.error(err.message.message)
                    } else {
                        // 非手动中断
                        message.error(err || '删除失败！')
                    }
                    let obj3 = {
                        title:'删除失败',
                        state:'1'
                    }
                    setUpdateStatus(obj3)
                    setProgress(0);
                },
                pro => {
                    // console.log('回调 ：', pro)
                    // if(pro<98){
                    //     setProgress(pro)
                    // }               
                    setProgress(pro)
                }
            )
            setUploadVisibility(false)
            console.log('shanchu file')
        }
        else{
            message.warn('系统错误')
        }
        if(document.getElementById('xqInput')){
            document.getElementById('xqInput').value = ''
        }
        if(document.getElementById('xqInputDele')){
            document.getElementById('xqInputDele').value = ''
        }
    }
    async function getRoomInfo() {
        let res = await stuManegeInfo()
        if (res.code == 200) {
            setRoomInfo(res.data)
        }
        else {
            message.warn(res.message)
        }

    }
    async function moveIn(e) {
        console.log(e)
        let obj = {
            listId: e.listId,
            type: 0
        }
        let res = await stuManegeOpera(obj)
        if (res.code == 200) {
            searchList()
            getRoomInfo()
        }
        else {
            message.warn(res.message)
        }

    }
    async function moveDel() {
        let e = lines.current
        if (e.roomState == 0 || e.roomState == 1) {
            console.log(e)
            let obj = {
                listId: e.listId,
                type: 2
            }
            let res = await stuManegeOpera(obj)
            if (res.code == 200) {
                searchList()
                getRoomInfo()
            }
            else {
                message.warn(res.message)
            }
        }
        else if (e.roomState == 2) {
            message.warn('请先退宿')
        }
        setModalVisible(false)
    }
    async function moveOut() {
        let e = lines.current
        console.log(e)
        let obj = {
            listId: e.listId,
            type: 1,
            buildingId: e.buildingId
        }
        let res = await stuManegeOpera(obj)
        console.log(res)
        if (res.code == 200) {
            searchList()
            getRoomInfo()
        }
        else {
            message.warn(res.message)
        }
        setModalVisible(false)
    }
    async function searchList(){
        setLoadingOut(true)
        let res = {}
        let obj = {
            classId: classId.current,
            roomState: roomState.current,
            searchText: searchValue.current,
            searchType: 0,
            pageSize,
            pageIndex: pageIndex.current
        }
        res = await stuManegeSearch(obj)
        if (res?.code == 200) {
            if(!res.data?.dataList?.length){
                if(pageIndex.current>1){
                    setModalVisible(false)
                    pageIndex.current -= 1
                    searchList()
                }
                else{
                    setDataList(res.data.dataList)
                    setLoadingOut(false)
                    setTotal(res.total)
                }
            }
            else{
                res.data.dataList = res.data.dataList.map((val, index) => {
                    val.key = val.listId
                    return val
                })
                console.log(res.data.dataList)
                setDataList(res.data.dataList)
                setLoadingOut(false)
                setTotal(res.total)                
            }

        }
        else {
            message.warn(res.message)
            setLoadingOut(false)
        }
        // setSearchText('')
        document.getElementById('scroll-content').scrollTop = 0;
    }
    async function addConfirm() {
        document.getElementById('yhc-studentRoom').style.overflow = 'hidden'
        // searchValue1.current = '';
        // classIdIn.current='all'
        // pageIndexIn.current = 1
        // classOptions.current = ['all']

        // console.log(stuArr.current)
        let arr = []
        pageIndexIn.current = 1
        stuArr.current.map((val, index) => {
            arr.push(val.listId)
        })
        let obj = {
            dataList: arr
        }
        // setDrawerVisibileAdd(false)
        let res = await stuManegeAdd(obj)
        if (res.code == 200) {
            setSelectedRowKeys([])
            stuArr.current = []
            addArr.current = []
            searchList()
            getRoomInfo()
            message.success('添加成功')
        }
        else {
            message.warn(res.message)
        }
        changeStates()
        // console.log(res)
    }
    function changeStates() {
        document.getElementById('yhc-studentRoom').style.overflow = 'auto'
        addArr.current = []
        stuArr.current = []
        setSelectedRowKeys([])
        pageIndexIn.current = 1;
        setDrawerVisibileAdd(false);
        searchValue1.current = '';
        setSearchTextIn('')
        classOptions.current = ['all'];
        classIdIn.current = 'all'
    }
    async function addSearchList(){
        // if(searchState1.current){

        // }
        // else{
        //     searchValue1.current = ''
        // }
        // setAddDataList([])
        
        // document.body.style.overflow = 'hidden'
        // document.body.style.position = 'fixed'
        document.getElementById('yhc-studentRoom').style.overflow = 'hidden'
        setDrawerVisibileAdd(true);
        setLoadingIn(true)
        let obj = {
            classId: classIdIn.current,
            roomState: roomState.current,
            searchText: searchValue1.current,
            searchType: 1,
            pageSize,
            pageIndex: pageIndexIn.current
        }
        let res = await stuManegeSearch(obj)
        if (res.code == 200) {
            // searchState1.current = false
            res.data.dataList = res.data.dataList.map((val, index) => {
                val.key = val.listId
                return val
            })
            console.log(res.data.dataList)
            setAddDataList(res.data.dataList)
            setLoadingIn(false)
            setStuTotal(res.total)
        }
        else {
            message.warn(res.message)
        }
        // setSearchTextIn('')
        document.getElementsByClassName('ant-drawer-body')[2].scrollTop = 0;
    }
    //模板下载
    const downloadTem = () => {
        let token = sessionStorage.getItem("token") || '';
        let orgcode = sessionStorage.getItem("orgcode") || '';
        var temWin = window.open(G.dataService + '/config/downloadTem?' + `token=${token}&orgCode=${orgcode}`)
        setTimeout(() => {
            temWin.close();
        }, 500);
    }
    function clearState(){
        setState(false)
    }
    // 下载错误数据
    const downloadErr =() => {
        let param = {
            errId:fileId
        };
        downloadConfigErr_request(param);
    }
    const DetailDes = props =>{
        return(
            <div className='yhc-tishi'>
                <SVG title='提示' style={{height:'22px',marginRight:'5px',width:'16px',color:'#5b9fe5'}} type={props.data.type}></SVG>
                <div>
                    <div style={{fontWeight:'600'}}>{props.data.title}说明</div>
                    <div>必填信息：学生姓名、证件号</div>
                </div>
            </div>
        )
    }
    useEffect(() => {
        getRoomInfo()
        let arr = [...classTree]
        arr = arr.map((val, index) => {
            val['label'] = val.gradeName
            val['value'] = val.gradeId
            if (val.hasOwnProperty('children')) {
                val.children = val.children.map((value, index) => {
                    value['label'] = value.className
                    value['value'] = value.classId
                    return value
                })
            }
            return val
        })
        arr.unshift({ label: '全部', value: 'all' })
        setOption(arr)
        setTotal(dataList.length)
        searchList()
    }, [])
    return (
        <div className="yhc-student" style={{ padding: '20px',height:'100%' }}>
            <div style={{ fontSize: '18px', marginBottom: '20px' }}>学生入住管理</div>
            <Alert icon={<SVG type='tishi' title='提示' style={{ height: '16px', width: '16px', color: '#3687D9', marginRight: '3px' }} />} type='info' showIcon message={
                <span>
                    <span style={{ fontWeight: 600, marginRight: '40px', color: '#3687D9' }}>已入住人数：{roomInfo.hasBedNum + '/' + roomInfo.stuTotal}</span>
                    <span style={{ fontWeight: 600, marginRight: '40px', color: '#3687D9' }}>未分配床位人数：{roomInfo.noBedNum}人</span>
                    <span style={{ fontWeight: 600, color: '#3687D9' }}>空闲床位数：{roomInfo.freeBedNum}床</span>
                </span>
            }></Alert>
            <div  className='yhc-stuRoomManageflex' style={{margin:'15px 0px'}}>
                <div className='yhc-stuRoomManageflex' style={{width:'770px'}}>
                    <div className='yhc-cascader'>
                        <span>班级：</span>
                        <Cascader
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            style={{width:'240px'}} allowClear={false} value={classOption.current} options={option} onChange={(e)=>{
                            pageIndex.current = 1
                            // searchValue.current = ''
                            searchState.current = false
                            classOption.current = e
                            classId.current = e[e.length - 1];
                            roomState.current = -1
                            searchList();
                            setRoomStates(-1)
                        }}></Cascader>
                    </div>
                    <div>
                        <span>住宿状态：</span>
                        <Select style={{width:'120px'}} value={roomStates} 
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        onChange={(e)=>{
                            // searchValue.current = ''
                            searchState.current = false
                            pageIndex.current = 1;                        
                            setRoomStates(e);
                            roomState.current = e;
                            searchList()
                        }}>
                            <Option value={-1}>全部</Option>
                            <Option value={1}>已入住</Option>
                            <Option value={0}>未入住</Option>
                        </Select>
                    </div>
                    <div>
                        <Search value={searchText} onChange={(e) => {
                            // console.log(e.target.value)
                            let specialKey = "[`%~!#$^&*()=|{}:;,\\[\\].<>/?~！#￥……&*（）——|{}【】；：”“。，、？]";
                            let flag = false
                            for (let i = 0; i < e.target.value.length; i++) {
                                if (specialKey.indexOf(e.target.value.substr(i, 1)) >= 0) {
                                    flag = true
                                }
                            }
                            if (flag) {
                                message.warn('请勿输入特殊字符：' + specialKey)
                            }
                            else {
                                let length = e.target.value.split('').length;
                                searchState.current = true
                                if(length<32){
                                setSearchText(e.target.value) 
                                searchValue.current = e.target.value.trim()
                                }                                    
                            }                      
                        }} style={{width:'260px'}} onSearch={()=>{
                            if(searchText){
                                searchState.current = true
                            }
                            else {
                                searchState.current = false
                            }
                            // classId.current = 'all'
                            // classOption.current = ['all']
                            // setRoomStates(-1)
                            // roomState.current = -1
                            pageIndex.current = 1;
                            searchList()
                        }} placeholder='学生姓名/证件号'></Search>
                    </div>
                </div>
                <div className='yhc-stuRoomManageflex yhc-svgFlex' style={{ width: '360px' }}>
                    <Button onClick={addSearchList} icon={<SVG type='icon-test' style={{ height: '14px', width: '14px', color: 'white', marginRight: '3px' }} />} type='primary'>添加学生</Button>
                    <Button onClick={() => { setDrawerVisibile(true) }} icon={<SVG type='piliangtuisu' style={{ height: '14px', width: '14px', color: 'black', marginRight: '3px' }} />}>批量退宿</Button>
                    <Button onClick={() => { setDrawerVisibileDel(true) }} icon={<SVG type='shanchu' style={{ height: '14px', width: '14px', color: 'black', marginRight: '3px' }} />}>批量删除</Button>
                </div>
            </div>
            <div className='yhc-tableCenter'>
                <Table loading={loadingOut} pagination={false} bordered columns={column} dataSource={dataList}></Table>
                <div style={{ marginTop: '10px' }}>
                    <PaginationPonent pageSize={pageSize} total={total} pageIndex={pageIndex.current} pageChange={(e) => { pageIndex.current = e; searchList() }}></PaginationPonent>
                </div>

            </div>
            <div className='yhc-exitRoom'>
                <Drawer
                    maskClosable={false}
                    closable={true}
                    title='批量退宿' footer={<div style={{display:'flex',justifyContent:'center'}}>
                        {/* <Button style={{marginRight:'20px'}} type='primary' onClick={()=>{setDrawerVisibile(false)}}>确认退宿</Button> */}
                        <Button type='primary' onClick={()=>{setDrawerVisibile(false);clearState()}}>返回</Button>
                    </div>} getContainer={false} onClose={onClose} visible={drawerVisibile}>
                    <div style={{padding:'40px'}}>
                        <DetailDes data={{type:'tishi',title:'批量退宿'}}></DetailDes>
                        <div className = 'yhc-upload'>
                            <div className='xq-guide-upload-l'>
                                <ConfigDrag
                                    className=''
                                    onUpload={files => onExit(files)}
                                    count={1}
                                    isDele={true}
                                    formats={['xls', 'xlsx']}
                                    clickRef={fileUp}
                                    downloadTem={downloadTem}
                                    fileUpload={() => {onExit(fileUp.current.files)}}
                                />
                                {
                                    state?
                                    <StuProgress
                                        status={updateStatus}
                                        progress={progress}
                                        // downloadErr={downloadErr}
                                        cancelFunc={cancelReq}
                                    />
                                    :null                                   
                                }

                            </div>
                        </div>
                    </div>
                </Drawer>                
                <Drawer 
                    maskClosable={false}
                    closable={true}
                    title='批量删除' footer={<div style={{display:'flex',justifyContent:'center'}}>
                        {/* <Button style={{marginRight:'20px'}} type='primary' onClick={()=>{setDrawerVisibileDel(false)}}>确认删除</Button> */}
                        <Button type='primary' onClick={()=>{setDrawerVisibileDel(false);clearState()}}>返回</Button>
                    </div>} getContainer={false} onClose={()=>{setDrawerVisibileDel(false);clearState()}} visible={drawerVisibleDel}>
                    <div style={{padding:'40px'}}>
                        <DetailDes data={{type:'tishi',title:'批量删除'}}></DetailDes>
                        <div className = 'yhc-upload'>
                            <div className='xq-guide-upload-l'>
                                <ConfigDrag
                                    className=''
                                    onUpload={files => onDel(files)}
                                    count={1}
                                    clickRef={fileDel}
                                    formats={['xls', 'xlsx']}
                                    downloadTem={downloadTem}
                                    fileUpload={() => {onDel(fileDel.current.files)}}
                                />
                                {
                                    state?
                                    <StuProgress
                                        status={updateStatus}
                                        progress={progress}
                                        cancelFunc={cancelReq}
                                    />                                    
                                    :null
                                }

                            </div>
                        </div>
                    </div>
                </Drawer>                
                <Drawer 
                    maskClosable={false}
                    closable={true}
                    className='yhc-addStu' title='添加学生' footer={<div style={{display:'flex',justifyContent:'center'}}>
                        <Button style={{marginRight:'20px'}} type='primary' onClick={addConfirm}>确认添加</Button>
                        <Button type='primary' onClick={()=>{changeStates()}}>取消</Button>
                    </div>} getContainer={false} onClose={()=>{changeStates()}} visible={drawerVisibleAdd}>
                    <div id = 'scrollAdd'>
                        <div>
                            <div className='yhc-stuRoomManageflex' style={{width:'540px',marginBottom:'20px'}}>
                                <div className='yhc-cascader'>
                                    <span>班级：</span>
                                    <Cascader value={classOptions.current}
                                        allowClear={false}
                                        getPopupContainer={(triggerNode) => triggerNode}
                                        onChange={(e)=>{
                                        pageIndexIn.current = 1
                                        classOptions.current = e
                                        // searchValue1.current = ''
                                        searchState1.current = false
                                        classIdIn.current = e[e.length - 1]
                                        addSearchList()
                                    }} style={{width:'240px'}} options={option} ></Cascader>
                                </div>
                                <div>
                                    <Search  onChange={(e)=>{
                                        let specialKey = "[`%~!#$^&*()=|{}:;,\\[\\].<>/?~！#￥……&*（）——|{}【】；：”“。，、？]";
                                        let flag = false
                                        for (let i = 0; i < e.target.value.length; i++) {
                                            if (specialKey.indexOf(e.target.value.substr(i, 1)) >= 0) {
                                                flag = true
                                            }
                                        }
                                        if (flag) {
                                            message.warn('请勿输入特殊字符：' + specialKey)
                                        }
                                        else{
                                            let length = e.target.value.split('').length;
                                            searchState1.current = true
                                            if(length<32){
                                                setSearchTextIn(e.target.value)  
                                                searchValue1.current = e.target.value.trim()
                                            }                                             
                                        }
                                    }}
                                    value={searchTextIn}
                                    onSearch={()=>{
                                        // pageIndexIn.current = 1
                                        // if(searchTextIn){
                                        //     searchState1.current = true
                                        // }
                                        // else{
                                        //     searchState1.current = false
                                        // }
                                        addSearchList()
                                    }}
                                    style={{width:'240px'}} placeholder='学生姓名/证件号'></Search>
                                </div>
                            </div>
                            <Table loading={loadingIn} rowSelection={{
                                type: 'checkbox',
                                selectedRowKeys,
                                onChange: (e, line) => {
                                    // let key = pageIndexIn.current
                                    // addArr.current[key - 1] = e
                                    // stuArr.current = []                         
                                    // let arr = stuArr.current
                                    // let arrr = []
                                    // for(let i = 0;i<addArr.current.length;i++){
                                    //     addArr.current[i]?.map((val,index)=>{
                                    //         arr.push({listId:val});
                                    //         arrr.push(val)
                                    //     })
                                    // }
                                    // setSelectedRowKeys(arrr)
                                    let arr = []
                                    setSelectedRowKeys(e)
                                    line?.map((val, index) => {
                                        arr.push({ listId: val.listId })
                                    })
                                    stuArr.current = arr

                                }
                            }} pagination={false} bordered columns={columnAdd} dataSource={addDataList}></Table>
                            <div style={{ marginTop: '10px' }}>
                                <PaginationPonent pageSize={pageSize} total={stuTotal} pageIndex={pageIndexIn.current} pageChange={(e) => { pageIndexIn.current = e; addSearchList() }}></PaginationPonent>
                            </div>

                        </div>
                    </div>
                </Drawer>
            </div>
            <div>
                <Modal style={{ marginTop: '7%' }} onOk={() => {
                    if (title.type) {
                        moveDel()
                    }
                    else {
                        moveOut()
                    }
                }} visible={modalVisible} okText={title.type ? '继续删除' : '继续退宿'} title={title.title} onCancel={() => { setModalVisible(false) }}>
                    <div>
                        {
                            title.type ?
                                <div>删除该学生后，将同步删除相应数据，请谨慎删除</div>
                                :
                                <div>您已选择的住宿学生将进行退宿处理，退宿后该部分学生将无宿舍可住，请谨慎操作</div>
                        }
                    </div>

                </Modal>
            </div>
            <div>
                <Modal style={{ marginTop: '7%' }} title={'批量操作'} visible={uploadVisibilty} okText={uploadState.current == 2 ? '继续删除' : '继续退宿'} onCancel={
                    () => { 
                            setUploadVisibility(false)
                            if(document.getElementById('xqInput')){
                                document.getElementById('xqInput').value = ''
                            }
                            if(document.getElementById('xqInputDele')){
                                document.getElementById('xqInputDele').value = ''
                            }
                        }
                    }
                    onOk={()=>{patchOperation(uploadFile.current)}}
                >
                        <div>确定{uploadState.current == 2 ? '继续批量删除' : '继续批量退宿'}吗？</div>
                </Modal>
            </div>
        </div>
    )
}