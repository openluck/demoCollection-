/*
 * @Author: kyl 
 * @Date: 2021-01-18 15:44:52 
 * @Last Modified by: kyl
 * @Last Modified time: 2021-02-05 17:02:14
 */

import React, { useState, useEffect } from 'react';
import { withRouter, useParams, Link } from "react-router-dom";
import { Switch, Select, Radio, Input, Checkbox } from 'antd';
import SVG from '../../public/svg';

const Option = Select.Option
const { TextArea } = Input;

const timeType = [{ name: '每日', code: '1' }, { name: '每周', code: '2' }];
const selTimeOfDay = [
  { name: '8：00', code: '8：00' },
  { name: '9：00', code: '9：00' },
  { name: '10：00', code: '10：00' },
  { name: '11：00', code: '11：00' },
  { name: '12：00', code: '12：00' },
  { name: '13：00', code: '13：00' },
  { name: '14：00', code: '14：00' },
  { name: '15：00', code: '15：00' },
  { name: '16：00', code: '16：00' },
  { name: '17：00', code: '17：00' },
  { name: '18：00', code: '18：00' },
  { name: '19：00', code: '19：00' },
  { name: '20：00', code: '20：00' }
];
const selTimeOfWeek = [
  { name: '星期一', code: '1' },
  { name: '星期二', code: '2' },
  { name: '星期三', code: '3' },
  { name: '星期四', code: '4' },
  { name: '星期五', code: '5' },
  { name: '星期六', code: '6' },
  { name: '星期日', code: '7' }
];
const notifyPerson = [
  { label: '校管理员', value: '1' }, { label: '院管理员', value: '2' }
]
export default withRouter((props) => {
  const { obj: { msgSumSending, msgInTimeSending }, changeSel } = props;
  console.log(props.obj);
  return <div>
    <div className='kyl-setting-comp'>
      <div className='kyl-setting-header'>
        <span>消息汇总发送&nbsp;&nbsp;</span>
        <div className={msgSumSending ?.status === '1' ?
          'tj-setPage-switch kyl-center kyl-switch-open' : 'tj-setPage-switch kyl-center kyl-switch-close'}>
          <Switch onChange={(val) => changeSel(val ? '1' : '0', 'status', 'msgSumSending')} checked={msgSumSending ?.status === '1' ? true : false} />
          <span>&nbsp;&nbsp;{msgSumSending ?.status === '1' ? '开启' : '关闭'}</span>
        </div>
      </div>
      <div className='kyl-setting-content'>
        <div>
          <span>发送时间：</span>
          <Select
            className='kyl-setting-select'
            style={{ marginRight: 10 }}
            value={msgSumSending ?.timeType}
            onChange={(val) => {
              changeSel(val, 'timeType', 'msgSumSending')
            }}>
            {
              timeType.map((item, index) => {
                return <Option key={item.code} value={item.code}>{item.name}</Option>
              })
            }
          </Select>
          <Select
            className='kyl-setting-select'
            placeholder={'请选择'}
            suffixIcon={<SVG type='sj' />}
            value={msgSumSending ?.selTime}
            onChange={(val) => {
              changeSel(val, 'selTime', 'msgSumSending')
            }}>
            {
              (msgSumSending ?.timeType === '1' ?
                selTimeOfDay : selTimeOfWeek).map((item, index) => {
                  return <Option key={item.code} value={item.code}>{item.name}</Option>
                })
            }
          </Select>
        </div>
        <div>
          <span>通知人员：</span>
          <span>院管理员</span>
        </div>
        <div>
          <span>消息内容：</span>
          <Radio.Group
            onChange={(e) => { changeSel(e.target.value, 'template', 'msgSumSending') }}
            value={msgSumSending ?.template}>
            <Radio value={'1'}>使用模版</Radio>
            <Radio value={'2'}>自定义</Radio>
          </Radio.Group>
        </div>
        <div style={{ paddingLeft: 70 }}>
          <TextArea
            rows={4}
            maxLength={msgSumSending ?.template === '2' ? 150 : 9999}
            style={{ height: msgSumSending ?.template === '1' ? 88 : 148 }}
            disabled={msgSumSending ?.template === '1'}
            value={msgSumSending ?.template === '1' ?
              '尊敬的领导，截至到目前为止，您还有xx节课的异常未处理。请及时登录教学诊断与改进系统进行处理。'
              : msgSumSending ?.tempCont}
            onChange={(e) => changeSel(e.target.value, 'tempCont', 'msgSumSending')}
          />
          {
            msgSumSending ?.template === '2' ?
              <div style={{ textAlign: 'right' }}>{msgSumSending ?.tempCont.length + '/' + 70}</div> : null
          }
        </div>
      </div>
    </div>


    <div className='kyl-setting-comp' style={{ marginTop: 20 }}>
      <div className='kyl-setting-header'>
        <span>消息及时发送&nbsp;&nbsp;</span>
        <div className={msgInTimeSending ?.status === '1' ?
          'tj-setPage-switch kyl-center kyl-switch-open' : 'tj-setPage-switch kyl-center kyl-switch-close'}>
          <Switch
            onChange={(val) => changeSel(val ? '1' : '0', 'status', 'msgInTimeSending')}
            checked={msgInTimeSending ?.status === '1' ? true : false} />
          <span>&nbsp;&nbsp;{msgInTimeSending ?.status === '1' ? '开启' : '关闭'}</span>
        </div>
      </div>
      <div className='kyl-setting-content'>
        <div>
          <span>发送事件：</span>
          <span>教师迟到</span>
        </div>
        <div>
          <span>通知人员：</span>
          <Checkbox.Group
            options={notifyPerson}
            onChange={(val) => { changeSel(val, 'notifyPerson', 'msgInTimeSending') }}
            value={msgInTimeSending ?.notifyPerson} />
        </div>
        <div>
          <span>消息内容：</span>
          <Radio.Group
            onChange={(e) => { changeSel(e.target.value, 'template', 'msgInTimeSending') }}
            value={msgInTimeSending ?.template}>
            <Radio value={'1'}>使用模版</Radio>
            <Radio value={'2'}>自定义</Radio>
          </Radio.Group>
        </div>
        <div style={{ paddingLeft: 70 }}>
          <TextArea
            rows={4}
            maxLength={msgInTimeSending ?.template === '2' ? 150 : 9999}
            style={{ height: msgInTimeSending ?.template === '1' ? 88 : 148 }}
            disabled={msgInTimeSending ?.template === '1'}
            value={msgInTimeSending ?.template === '1' ?
              '尊敬的领导，于望江校区基教楼A座401在上的大学英语课程，xx老师已经迟到，请及时确认。' :
              msgInTimeSending ?.tempCont}
            onChange={(e) => changeSel(e.target.value, 'tempCont', 'msgInTimeSending')}
          />
          {
            msgInTimeSending ?.template === '2' ?
              <div style={{ textAlign: 'right' }}>{msgInTimeSending ?.tempCont.length + '/' + 70}</div> : null
          }
        </div>
      </div>
    </div>

  </div>

})
