/*
 * @Author: lxx 
 * @Date: 2020-07-22 17:31:51 
 * @Last Modified by: tj
 * @Last Modified time: 2021-04-09 13:47:18
 * 问题回复弹窗
 * visible 是否显示弹窗(Bealoon)
 * onCancel 取消函数回调（Function）
 * onOk 提交成功回调（Function）
 * id 课程id（String）
 * type 回复状态（String） 0未回复 1已回复
 * onlyShow 是否只读(Boolean) 默认是false
 * rpType 考勤状态(String) 1教师考勤 2学生课堂秩序
 */

import React, { useState, useEffect } from 'react'
import { Input, message, Spin, Modal, Radio, InputNumber } from 'antd'
import _ from 'lodash'
import ModalPub from './../../modalPub'
import { request, formtRequst } from "../../../../util/request";
import { getFileSuffix } from './../../../../util/file'
import SVG from './../../../public/svg'
import './../../../../style/lxx_handleModal.scss'
import G from '../../../../config/g';
import { IMG } from './../../../public/imgPub'
import { getAttCodeName } from './../../../../config/actionConfig'

const { TextArea } = Input
const { Group } = Radio

const configList = [{
    type: '1',
    key: 'teaAtt',
    name: '教师考勤',
    isShow: false,
    cnt: [{
        id: "attenName"
    }, {
        id: "attenType"
    }]
}, {
    type: '2',
    key: 'stuAtt',
    name: '到课人数',
    isShow: false,
    cnt: [{
        id: "stuOnAttNum"
    }, {
        id: "stuOnAttType"
    }, {
        id: "realStuOnAttNum"
    }]
}, {
    type: '2',
    key: 'seat',
    name: '前排就坐人数',
    isShow: false,
    cnt: [{
        id: "frontSeatNum"
    }, {
        id: "frontSeatType"
    }, {
        id: "realFrontSeatNum"
    }]
}, {
    type: '2',
    key: 'sleep',
    name: '低头人数',
    isShow: false,
    cnt: [{
        id: "sleepNum"
    }, {
        id: "sleepType"
    }, {
        id: "realSleepNum"
    }]
}]

const HandleModal = (props) => {
    const [info, setInfo] = useState(null) // 问题详情
    const [isEdit, setIsEdit] = useState(false) // 是否可编辑
    const [delFiles, setDelFiles] = useState([]) // 待删除已提交处理的文件
    const [isLoad, setIsLoad] = useState(false) // 文件上传状态
    const [showFile, setShowFile] = useState('') // 浏览文件id
    const [rpType, setRpType] = useState('') // 考勤类型
    const [cfgData, setCfgData] = useState([]) // 回复指标

    useEffect(() => {
        console.log('弹窗useEffect', props)
        let arr = _.filter(configList, o => { return o.type === props.rpType })
        setRpType(props.rpType)
        setCfgData(arr)
        if (props.type === '0') {
            // 未回复
            setInfo({ reason: '', files: [] })
            setIsEdit(true)
        }
        getDetailInfo(props.id);
        return compentWillUnmount
    }, [])

    /**
     * 重置条件
     */
    const compentWillUnmount = () => {
        setInfo(null)
        setIsEdit(false)
        setDelFiles([])
        setIsLoad(false)
        setCfgData([])
    }

    /**
     * 获取问题详情
     * @param {String} id 课程id
     */
    const getDetailInfo = (id) => {
        request('api/improve/getReplyDetail', { claRoomId: id || '', attType: props.rpType }, (res) => {
            if (res && res.data && res.result) {
                let data = res.data
                let arr = _.cloneDeep(_.filter(configList, o => { return o.type === props.rpType }))
                arr.map((dt, index) => {
                    if(data[dt.cnt[0].id] !== null) {
                        dt.isShow = true
                        dt.cnt.map(item => {
                            let value = data[item.id] === null ? "" : data[item.id]
                            item.value === undefined ? Object.assign(item, { value }) : item.value = value
                        })
                    } else {
                        dt.isShow = false
                    }
                })
                data.files.map(dt => {
                    // 获取文件后缀，并添加类型 type 1接口获取文件 2新增未上传文件
                    Object.assign(dt, { format: getFileSuffix(dt.fileName), type: 1 })
                })
                arr = _.filter(arr, o => { return o.isShow })
                console.log('arr', arr)
                setInfo(data)
                setCfgData(arr)
            } else {
                setInfo({ reason: '', files: [] })
            }
        })
    }

    /**
     * 上传文件-上传校验
     * @param {*} e 
     */
    const handleUpload = (e) => {
        setIsLoad(true)
        let files = e.target.files,
            file = files[0];
        console.log('file', file)
        if (!file) {
            message.warning('未选中任何文件')
            setIsLoad(false)
            return
        } else {
            let size = file.size / 1024;
            if (size < 307201) {
                // 文件小于300M，上传文件
                // setTimeout(() => {
                uploadFile({ file: [file] })
                // }, 2000)
            } else {
                message.warning('单个文件不能超过300M')
                setIsLoad(false)
            }
        }
        // 清空上传输入框内容
        let inp = document.getElementById('upload');
        inp.value = "";
    }

    /**
     * 上传文件
     * @param {Object} file 文件
     */
    const uploadFile = (file) => {
        if (file) {
            console.log(file)
            formtRequst('api/improve/addFile', file, (res) => {
                // let res = {
                //     data: {
                //         fileId: '1215454541',
                //         fileName: '我是新上传图片.png'
                //     },
                //     result: true
                // }
                if (res.data && res.result) {
                    let dt = res.data;
                    // 获取文件后缀，并添加类型 type 1接口获取文件 2新增未上传文件
                    Object.assign(dt, { format: getFileSuffix(dt.fileName), type: 2 })
                    let data = JSON.parse(JSON.stringify(info))
                    data.files.push(dt)
                    setInfo(data)
                } else {
                    message.warning(res.message)
                }
                setIsLoad(false)
            }, () => {
                message.warning('上传文件失败')
            })
        }
    }

    /**
     * 根据文件格式匹配svg图标
     * @param {String} f 
     */
    const getFormatSvg = (f) => {
        let type = 'qita'
        if (f === 'jpg' || f === 'png') {
            type = 'jpg';
        } else if (f === 'txt') {
            type = 'txt';
        } else if (f === 'xlsx' || f === 'xls') {
            type = 'xlsx';
        } else if (f === 'docx' || f === 'doc') {
            type = 'Word';
        } else if (f === 'pdf') {
            type = 'pdf';
        } else if (f === 'ppt') {
            type = 'ppt';
        }
        return type
    }

    /**
     * 删除文件
     * @param {Number} ind 文件下标
     */
    const delFile = (ind) => {
        let data = JSON.parse(JSON.stringify(info));
        let t = data.files[ind];
        if (t.type === 2) {
            // 删除未提交处理的文件,需调接口
            delNotSubmitFiles([t.fileId])
        } else if (t.type === 1) {
            let arr = JSON.parse(JSON.stringify(delFiles));
            arr.push(t.fileId)
            setDelFiles(arr)
        }
        // 删除列表中
        data.files.splice(ind, 1);
        console.log(data)
        setInfo(data)
    }

    /**
     * 未提交文件删除
     * @param {Array} params 请求参数
     */
    const delNotSubmitFiles = (params) => {
        request('api/improve/deleteFile', params, (res) => {
            if (!res.result) {
                message.warning(res.message)
            }
        })
    }

    /**
     * 修改回复意见
     * @param {*} e 
     */
    const changeText = (e) => {
        let val = e.target.value;
        let data = JSON.parse(JSON.stringify(info));
        data.reason = val
        setInfo(data)
    }

    /**
     * 关闭弹窗
     */
    const onCancel = () => {
        // 筛选type为2，新上传文件
        // delNotSubmitFiles(['4d64b2c9bf7649ffa2327548818e1ea7'])
        if (info && info.files.length) {
            let arr = _.filter(info.files, { type: 2 })
            if (arr && arr.length) {
                let param = [];
                arr.map(dt => {
                    param.push(dt.fileId)
                })
                // 删除未提交处理的文件,需调接口
                delNotSubmitFiles(param)
            }
        }
        props.onCancel();
    }

    /**
     * 提交回复意见
     */
    const submitInfo = () => {
        let data = JSON.parse(JSON.stringify(info))
        data.files.map(dt => {
            delete dt.type
            delete dt.format
        })
        cfgData.map(item => {
            item.cnt.map(dt => {
                data[dt.id] = dt.value
            })
        })
        if (data.stuOnAttNum!==null&&!data.stuOnAttType) {
            message.warn('请选择是否属实！')
            return;
        } 
        if (data.frontSeatNum!==null&&!data.frontSeatType) {
            message.warn('请选择是否属实！')
            return;
        } 
        if (data.sleepNum!==null&&!data.sleepType) {
            message.warn('请选择是否属实！')
            return;
        }
        if (data.frontSeatType == '2' && (data.realFrontSeatNum == null || data.realFrontSeatNum == "")) {
            message.warn('请填写实际前排就坐人数！')
            return;
        } 
        if (data.sleepType == '2' && (data.realSleepNum==null || data.realSleepNum == "") ) {
            message.warn('请填写实际低头人数！')
            return;
        } 
        if (data.stuOnAttType == '2') {
            if(data.realStuOnAttNum == null || data.realStuOnAttNum == "" ) {
                message.warn('请填写实际到课人数！')
                return;
            }
            if(data.realStuOnAttNum == 0) {
                message.warn('到课人数不能为0！')
                return;
            }
            
        } 
        let params = Object.assign(data,
            {
                delFiles,
                userId: G.ISCED_roleData.accountId,
                userName: G.ISCED_roleData.userName,
                claRoomId: props.id,
                attType: props.rpType
            }
        )
        console.log(params)
        // return;
        request('api/improve/updateReplyResult', params, (res) => {
            if (res.result) {
                props.onOk()
                props.onCancel()
            } else {
                message.warning(res.message)
            }
        })
    }

    /**
     * 下载文件
     * @param {*} id 
     */
    const downFile = (id) => {
        // console.log(`${G.dataService}/api/improve/downloadById/${G.ISCED_orgcode}/${id}`)
        window.open(`${G.dataService}/api/improve/downloadById/${G.ISCED_orgcode}/${id}`, "_self")
    }


    /**
     * 修改回复内容值
     * @param {*Number} cnt 输入框和选择值
     * @param {String} ind 下标
     * @param {Number} type 对应数组字段 1回复类型 2实际值
     */
    const changeType = (cnt, ind, type) => {
        console.log(cnt, ind, type, cfgData[ind])
        let value = ''
        if (cnt!== null && typeof cnt === 'number') {
            value = cnt.toString()
        } else if (cnt) {
            value = cnt.target.value
        }
        console.log(value)
        
        let arr = JSON.parse(JSON.stringify(cfgData))
        
        if (arr[ind]) {
            arr[ind].cnt[type].value = value
            if(value=='1'&&type=='1'){
                if(arr[ind].cnt[2]){
                    arr[ind].cnt[2].value=null
                }
            }
        }
        setCfgData(arr)
    }

    return <React.Fragment>
        {
            props.visible
                ? <ModalPub
                    className="lxx-imp-modal"
                    width={675}
                    title={props.title || '回复意见'}
                    visible={props.visible}
                    onOk={submitInfo}
                    onCancel={onCancel}
                    footer={
                        props.onlyShow
                            ? { isOnly: props.onlyShow }
                            : isEdit
                                ? { ok: '提交', cancel: '取消', okIcon: <SVG type="tijiao" />, cancelIcon: <SVG type="quxiao" /> }
                                : { ok: '确定', cancel: '修改', onCancel: () => setIsEdit(true), okIcon: <SVG type="queding" />, cancelIcon: <SVG type="quchuli" /> }
                    }
                   
                    content={<div>
                        
                        {
                            cfgData.map((item, index) => {
                                let text = item.cnt[0].value
                                return <div className="lxx-g-flex" key={item.key} style={{ marginBottom: 10 }}>
                                    <div style={{ width: 190 }}>
                                        <span
                                            className="lxx-re-m-name"
                                            style={cfgData.length > 1 ? {} : { textAlign: 'left', width: 'auto' }}
                                        >{item.name}：</span>
                                        <span className={item.cnt[0].id === 'attenName' ? 'lxx-re-m-no' : ''}>
                                            {item.cnt[0].id === 'attenName' ? getAttCodeName(text) : text}
                                        </span>
                                    </div>
                                    <div className="lxx-m-flex">
                                        <Group
                                            value={item.cnt[1].value}
                                            disabled={props.type === '0' || isEdit ? false : true}
                                            onChange={(e) => changeType(e, index, 1)}
                                        >
                                            <Radio value={'1'}>情况属实</Radio>
                                            <Radio value={'2'}>{item.type === '1' ? '情况不属实，我要申请为正常' : '情况不属实'}</Radio>
                                        </Group>
                                    </div>
                                    {
                                        item.type === '2'
                                            ? <div>
                                                <span className="lxx-re-m-name">实际人数为：</span>
                                                <InputNumber
                                                    disabled={
                                                        (props.type === '0' && item.cnt[1].value === '2') ||
                                                            (isEdit && item.cnt[1].value === '2')
                                                            ? false : true
                                                    }
                                                    min={0}
                                                    max={200}
                                                    value={item.cnt[2].value}
                                                    onChange={(value) => changeType(value, index, 2)} />
                                            </div>
                                            : null
                                    }

                                </div>
                            })
                        }
                        <TextArea
                            maxLength={300}
                            value={info && info.reason}
                            placeholder={isEdit ? "填写申请内容" : ''}
                            rows={5}
                            onChange={changeText}
                            disabled={isEdit ? false : true}
                        />
                        {
                            isEdit && (info && info.files && info.files.length < 10)
                                ? <div className="lxx-g-flex" style={{ marginTop: 20 }}>
                                    <div className="lxx-imp-g-import" style={{ position: 'relative', with: '100%' }}>
                                        {
                                            isLoad
                                                ? <Spin />
                                                : <React.Fragment>
                                                    <input
                                                        id='upload'
                                                        type="file"
                                                        accept="*"
                                                        onChange={handleUpload}
                                                    />
                                                    <SVG className="lxx-u-down" type="xinzeng" />
                                                </React.Fragment>
                                        }
                                    </div>
                                    <div className="lxx-imp-g-txt">
                                        <p>添加附件</p>
                                    </div>
                                </div>
                                : null
                        }

                        <div className="lxx-g-flex lxx-imp-g-file">
                            {
                                info && info.files.map((item, index) => {
                                    return <div key={index}>
                                        <SVG type={getFormatSvg(item.format)} />
                                        <span className="lxx-imp-u-name" title={item.fileName}>{item.fileName}</span>
                                        {
                                            !isEdit
                                                ? getFormatSvg(item.format) !== 'jpg'
                                                    ? <span className="lxx-imp-u-down" onClick={() => downFile(item.fileId)}>下载</span>
                                                    : <>
                                                        <span className="lxx-imp-u-down" onClick={() => setShowFile(item.fileId)}>浏览</span>
                                                        <span className="lxx-imp-u-down" onClick={() => downFile(item.fileId)}>下载</span>
                                                    </>
                                                : <SVG
                                                    type="shanchu"
                                                    className="lxx-imp-u-del"
                                                    onClick={() => delFile(index)} />
                                        }

                                    </div>
                                })
                            }
                        </div>
                    </div>}
                />
                : null
        }
        {
            showFile
                ? <Modal
                    className="lxx-md-g-img"
                    visible={true}
                    onCancel={() => setShowFile('')}
                    footer={null}
                >
                    <IMG src={`${G.dataService}/api/improve/downloadById/${G.ISCED_orgcode}/${showFile}`} />
                </Modal>
                : null
        }
    </React.Fragment>
}
export default HandleModal