/*
 * @Author: lxx 
 * @Date: 2021-01-14 11:16:52 
 * @Last Modified by: kyl
 * @Last Modified time: 2021-02-05 17:02:56
 * 消息推送
 */

import React, { useState, useEffect } from 'react'
import Outside from '../../components/set/msg_setting_outside';
import Role_Send_Comp from '../../components/set/role_msg_send';
import '../../../style/kyl_msg_setting.scss'
import { Button, message } from 'antd';
import SVG from '../../public/svg';
import { request } from '../../../util/request';
import _ from 'lodash';
const MesPage = (props) => {
    const tabs = [{ name: '消息内容', id: '1' }, { name: '设置电话', id: '2' }];
    const [active, setActive] = useState('1');
    const [disabled, setDisabled] = useState(true);
    const [params, setParams] = useState(
        {
            msgSumSending: {
                status: "1",
                timeType: "1",
                selTime: "8：00",
                template: "1",
                tempCont: ""
            },
            msgInTimeSending: {
                status: "1",
                notifyPerson: ['1', '2'],
                template: "1",
                tempCont: ""
            },
        }
    )
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMsgInfo();
    }, [])

    const getMsgInfo = () => {
        request('/api/system/getInfoSetting', {}, (res) => {
            if (res.result) {
                setParams(res.data);
            } else {
                message.warn(res.message);

            }
        }, () => {
            message.warn('服务出错~');
        })
    }

    //保存
    const save = () => {
        if (params.msgSumSending.template === '2' && params.msgSumSending.tempCont === '') {
            message.warn('消息汇总发送消息内容为必填项');
            return
        }
        setLoading(true);
        setDisabled(true);
        request('/api/system/saveInfoSetting', params, (res) => {
            if (res.result) {
                message.success('操作成功')
            } else {
                message.warn(res.message);
            }
            setLoading(false)
        }, () => {
            message.warn('服务出错~');
            setLoading(false)
        })
    }

    //条件更变
    const changeSel = (val, type, p) => {
        setDisabled(false);
        // console.log(val, type, p)
        let cloneParams = _.cloneDeep(params);
        cloneParams[p][type] = val;
        console.log(cloneParams)
        if (type === 'timeType') {
            cloneParams['msgSumSending']['selTime'] = undefined;
        }
        if (type === 'template') {
            if (p === 'msgSumSending') {
                if (val === '2') {
                    cloneParams[p]['tempCont'] = '';
                }
            } else {
                if (val === '2') {
                    cloneParams[p]['tempCont'] = '';
                }
            }
        }
        setParams(cloneParams);
    }



    return <div className='kyl-msg-box'>
        <div className='kyl-tabs'>
            {
                tabs.map((item, index) => {
                    return <span key={item.id}
                        onClick={() => { setActive(item.id); getMsgInfo(); }}
                        style={active === item.id ? { color: '#77b3e2' } : {}}
                        className='kyl-msg-tab' > {item.name} {
                            active === item.id ?
                                <div className='kyl-underline'></div> : null
                        }</span>
                })
            }
        </div>
        {
            active === '1' ?
                <div style={{ height: 'calc(100% - 104px)', overflow: 'auto' }}>
                    <Outside obj={params} changeSel={changeSel}></Outside>
                </div>
                :
                <div style={{ height: 'calc(100% - 50px)', overflow: 'auto' }} >
                    <Role_Send_Comp />
                </div>
        }
        {
            active === '1' ?
                <Button style={{ marginTop: 20 }}
                    onClick={save}
                    loading={loading}
                    disabled={disabled}
                    className='kyl-btn'><SVG type='baocun'></SVG>&nbsp;&nbsp;保 存</Button> : null
        }
    </div>
}
export default MesPage;
