/*
 * @Author: lxx 
 * @Date: 2020-07-22 17:31:51 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-04-12 14:05:34
 * 跟踪-回复展示弹窗
 * visible 是否显示弹窗(Bealoon)
 * onCancel 取消函数回调（Function）
 * onOk 提交成功回调（Function）
 * id 课程id（String）
 * type 回复状态（String） 0未回复 1已回复
 * rpType 考勤状态(String) 1教师考勤 2学生课堂秩序
 */

import React, { useState, useEffect } from 'react'
import { Input, message, Spin, Modal, Radio, InputNumber } from 'antd'
import _ from 'lodash'
import ModalPub from '../../modalPub'
import { request, formtRequst } from "../../../../util/request";
import { getFileSuffix } from '../../../../util/file'
import SVG from '../../../public/svg'
import './../../../../style/lxx_handleModal.scss'
import G from '../../../../config/g';
import { IMG } from '../../../public/imgPub'
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

const ReplyDetail = (props) => {
    const [info, setInfo] = useState({ colInfo: null, sclInfo: null }) // 问题详情
    const [showFile, setShowFile] = useState('') // 浏览文件id
    const [rpType, setRpType] = useState('') // 回复类型
    const [cfgData, setCfgData] = useState([]) // 回复指标

    useEffect(() => {
        console.log(props)
        let arr = _.filter(configList, o => { return o.type === props.rpType })
        setCfgData(arr)
        setRpType(props.rpType)
        if (props.type === '0') {
            // 未回复
            setInfo({ reason: '', files: [] })
        }
        getDetailInfo(props.id);
        return compentWillUnmount
    }, [])

    /**
     * 重置条件
     */
    const compentWillUnmount = () => {
        setInfo(null)
        setCfgData([])
    }

    /**
     * 获取问题详情
     * @param {String} id 课程id
     */
    const getDetailInfo = (id) => {
        request('api/improve/getTrackDetail', { claRoomId: id || '', attType: props.rpType }, (res) => {
            if (res && res.data && res.result) {
                let data = res.data
                let arr = _.cloneDeep(_.filter(configList, o => { return o.type === props.rpType }))
                arr.map(dt => {
                    if (data.colInfo[dt.cnt[0].id] !== null && data.colInfo[dt.cnt[1].id] !== null) {
                        // 判断异常情况及回复类型非空
                        if (data.colInfo[dt.cnt[1].id] === "2") {
                            // 情况不属实
                            if ((dt.type === '2' && data.colInfo[dt.cnt[2].id] !== null) || dt.type === '1') {
                                // 学生秩序有回复内容，或类型是教师考勤
                                dt.isShow = true
                                dt.cnt.map(item => {
                                    let value = data.colInfo[item.id] === null ? "" : data.colInfo[item.id]
                                    item.value === undefined ? Object.assign(item, { value }) : item.value = value
                                })
                            } else {
                                dt.isShow = false
                            }
                        } else if (data.colInfo[dt.cnt[1].id] === "1") {
                            // 情况属实
                            if ((dt.type === '2' && (data.colInfo[dt.cnt[2].id] === null || data.colInfo[dt.cnt[2].id])) || (dt.type === '1')) {
                                // 学生秩序真实存在数据，或类型是教师考勤
                                dt.isShow = true
                                dt.cnt.map(item => {
                                    let value = data.colInfo[item.id] === null ? "" : data.colInfo[item.id]
                                    item.value === undefined ? Object.assign(item, { value }) : item.value = value
                                })
                            } else {
                                dt.isShow = false
                            }
                        } else {
                            dt.isShow = false
                        }
                    } else {
                        dt.isShow = false
                    }
                })

                data.colInfo.files.map(dt => {
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
     * 关闭弹窗
     */
    const onCancel = () => {
        props.onCancel();
    }

    /**
     * 下载文件
     * @param {*} id 
     */
    const downFile = (id) => {
        // console.log(`${G.dataService}/api/improve/downloadById/${G.ISCED_orgcode}/${id}`)
        window.open(`${G.dataService}/api/improve/downloadById/${G.ISCED_orgcode}/${id}`, "_self")
    }
    return <React.Fragment>
        {
            props.visible
                ? <ModalPub
                    className="lxx-imp-modal"
                    width={675}
                    title={props.title || '回复意见'}
                    visible={true}
                    onOk={onCancel}
                    onCancel={onCancel}
                    footer={
                        { ok: '确定', okIcon: <SVG type="queding" />, onlyOk: true }
                    }
                    content={<div>
                        <div>【开课单位回复】{info && info.colInfo && info.colInfo.replier || '--'}回复：</div>
                        {
                            cfgData.map(item => {
                                let text = item.cnt[0].value
                                return <div className="lxx-g-flex" key={item.key} style={{ marginTop: 10 }}>
                                    <div style={item.type === '1' && text === '7' ? {width: 190} : {width: 150} }>
                                        <span className="lxx-re-m-name" style={item.cnt[0].id === 'attenName' ? { width: 75 } : {}}>{item.name}：</span>
                                        <span className={item.cnt[0].id === 'attenName' ? 'lxx-re-m-no' : ''}>
                                            {item.cnt[0].id === 'attenName' ? getAttCodeName(text) : (text || 0)}
                                        </span>
                                    </div>
                                    <div style={item.type === '1' && item.cnt[1].value === '2' ? { width: 190 } : { width: 80 }}>
                                        {
                                            item.type === '1' && item.cnt[1].value === '2'
                                                ? <span style={{ color: '#FF4141' }}>情况不属实，我要申请为正常</span>
                                                : item.cnt[1].value === '2'
                                                    ? <span style={{ color: '#FF4141' }}>情况不属实</span>
                                                    : item.cnt[1].value === '1'
                                                        ? '情况属实'
                                                        : null
                                        }
                                    </div>
                                    {
                                        item.type === '2' && item.cnt[1].value === '2'
                                            ? <div>
                                                <span className="lxx-re-m-name">（实际人数为：</span>
                                                <span>{item.cnt[2].value}）</span>
                                            </div>
                                            : null
                                    }

                                </div>
                            })
                        }
                        {
                            props.type === '1' && (!info || !info.colInfo || !info.colInfo.reason) // 已回复且无回复内容
                                ? null
                                : <TextArea
                                    maxLength={300}
                                    value={info && info.colInfo.reason}
                                    rows={4}
                                    disabled={true}
                                    style={{ marginTop: 10 }}
                                />
                        }
                        <div className="lxx-g-flex lxx-imp-g-file">
                            {
                                info && info.colInfo && info.colInfo.files.map((item, index) => {
                                    return <div key={index}>
                                        <SVG type={getFormatSvg(item.format)} />
                                        <span className="lxx-imp-u-name" title={item.fileName}>{item.fileName}</span>
                                        {
                                            getFormatSvg(item.format) !== 'jpg'
                                                ? <span className="lxx-imp-u-down" onClick={() => downFile(item.fileId)}>下载</span>
                                                : <>
                                                    <span className="lxx-imp-u-down" onClick={() => setShowFile(item.fileId)}>浏览</span>
                                                    <span className="lxx-imp-u-down" onClick={() => downFile(item.fileId)}>下载</span>
                                                </>
                                        }

                                    </div>
                                })
                            }
                        </div>
                        <div style={{ marginBottom: 10, marginTop: 20 }}>
                            {
                                info.sclInfo
                                    ? info.sclInfo.replyResult === '0' || !info.sclInfo.replyResult
                                        ? "【学校回复】：尚未回复"
                                        : info && info.sclInfo && !info.sclInfo.replier
                                            ? `【学校回复】自动回复:`
                                            : `【学校回复】${info && info.sclInfo && info.sclInfo.replier || '--'}回复：`
                                    : null
                            }
                            {
                                info.sclInfo
                                    ? info.sclInfo.replyResult === '1'
                                        ? <span className="lxx-re-m-pass">同意</span>
                                        : info.sclInfo.replyResult === '2'
                                            ? <span className="lxx-re-m-no">不同意</span>
                                            : null
                                    : null
                            }
                        </div>
                        {
                            props.type === '1' && (!info || !info.sclInfo || !info.sclInfo.reason) // 已回复且无回复内容
                                ? null
                                : <TextArea
                                    maxLength={100}
                                    value={info && info.sclInfo.reason}
                                    rows={2}
                                    disabled={true}
                                />
                        }
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
export default ReplyDetail