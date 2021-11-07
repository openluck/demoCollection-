/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-16 11:01:04
 * 职务管理
 */
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { request } from './../../../../util/request';
import SVG from './../../../public/public-component-svg';
import PersonPonent from './../../../components/personPonent';
import ModalPonent from './../../../components/modalPonent';
import PagePonent from './../../../components/pagePonent';
import noneData from './../../../../media/picture/noneData.png';

import './../../../../style/tpk/pksz/mj-jobManage.scss';

export default function Zwgl(props) {
  const [type, setType] = useState(0);                      //0行政机构 1教学机构
  const [addVisible, setAddVisible] = useState(false);      //添加职务弹框
  const [jobList, setJobList] = useState([]);               //列表数据
  const [total, setTotal] = useState(0);                    //列表数据总数
  const [deleVisible, setDeleVisible] = useState(false);    //删除职务弹框
  const [jobId, setJobId] = useState('');                   //进行编辑/删除的职务id
  const [jobName, setJobName] = useState('');               //进行编辑的职务名称
  const [orgList, setOrgList] = useState([]);               //机构列表
  const [perList, setPerList] = useState([]);               //机构下人员列表
  const [selePers, setSelePers] = useState([]);             //所有已选择人员列表
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 20;
  const title = [{ name: '序号', key: 'order' }, { name: '职务', key: 'job' }, { name: '人员', key: 'perName' }, { name: '操作', key: 'option' },];

  useEffect(() => {
    getTableData(1);
  }, [])

  /**
   * @desc 获取列表数据
   * @param {*} pageIndex 页码
   */
  const getTableData = (pageIndex) => {
    request('jobMana/getJobList', { pageIndex, pageSize }, res => {
      let res1 = {
        result: true,
        data: [],
        total: 50,
      }
      if (res.result) {
        let data = res.data;
        // for (let i = 0; i < 20; i++) {
        //   data.push({
        //     jobId: i, order: i + 1, job: '职务' + i,
        //     perList: [
        //       { perName: '人员姓名', perId: '1' }, { perName: '人员姓名', perId: '2' },
        //       { perName: '人员姓名', perId: '3' }, { perName: '人员姓名', perId: '4' },
        //       { perName: '人员姓名', perId: '5' }, { perName: '人员姓名', perId: '6' },
        //     ]
        //   })
        // }
        // data.map(item => {
        //   let txt = '';
        //   const list = item.perList;
        //   list && list.length ?
        //     list.map(perItem => {
        //       txt = txt + perItem.perName + '/';
        //     }) : null
        //   item.txt = txt;
        // })
        setJobList(data);
        setTotal(res.total);
      } else {
        message.info(res.message);
        setJobList([]);
        setTotal(0);
      }
    })
  }

  /**
   * @desc 获取所有已选择人员列表
   * @param {*} jobId 职务id
   */
  const getSelePers = (jobId) => {
    request('jobMana/getPerList', { jobId }, res => {
      let res1 = {
        result: true,
        data: [
          { perName: '姓名3', perId: '3', orgId: '1' }, { perName: '姓名4', perId: '4', orgId: '1' },
          { perName: '姓名7', perId: '7', orgId: '1' }, { perName: '姓名8', perId: '8', orgId: '1' },
        ]
      }
      if (res.result) {
        const data = res.data;
        setSelePers(data);
        setAddVisible(true);
      } else {
        message.info(res.message);
        setSelePers([]);
      }
    })
  }

  /**
   * @desc 获取机构列表
   * @param {*} jobId 职务id
   * @param {*} keyword 搜索值
   * @param {*} type 0行政 1教学
   */
  const getOrgList = (jobId, keyword, type) => {
    let ret = { jobId, keyword, type: Number(type) };
    request('jobMana/getOrgList', ret, res => {
      let res1 = {
        result: true,
        data: [
          { orgName: '机构1', orgId: '1' }, { orgName: '机构2', orgId: '2' }, { orgName: '机构3', orgId: '3' },
          { orgName: '机构4', orgId: '4' }, { orgName: '机构5', orgId: '5' }, { orgName: '机构6', orgId: '6' },
          { orgName: '机构7', orgId: '7' }, { orgName: '机构8', orgId: '8' }, { orgName: '机构9', orgId: '9' },
          { orgName: '机构0', orgId: '0' },
        ]
      }
      if (res.result) {
        const data = res.data,
          orgId = data.length ? data[0].orgId : '';
        getPerList(jobId, '', orgId, type);
        setOrgList(data);
      } else {
        message.info(res.message);
        setOrgList([]);
      }
    })
  }

  /**
   * @desc 获取机构下人员列表
   * @param {*} jobId 职务id
   * @param {*} keyword 搜索值
   * @param {*} orgCode 机构id
   */
  const getPerList = (jobId, keyword, orgCode, tabType) => {
    // console.log(orgCode);
    let ret = { jobId, keyword, orgId: orgCode, type: Number(tabType) };
    request('jobMana/getOrgPerList', ret, res => {
      let res1 = {
        result: true,
        data: [
          { perName: '姓名1', perId: '1', isChecked: '0' }, { perName: '姓名2', perId: '2', isChecked: '0' },
          { perName: '姓名3', perId: '3', isChecked: '1' }, { perName: '姓名4', perId: '4', isChecked: '1' },
          { perName: '姓名5', perId: '5', isChecked: '0' }, { perName: '姓名6', perId: '6', isChecked: '0' },
          { perName: '姓名7', perId: '7', isChecked: '1' }, { perName: '姓名8', perId: '8', isChecked: '1' },
          { perName: '姓名9', perId: '9', isChecked: '0' }, { perName: '姓名10', perId: '10', isChecked: '0' },
        ]
      }
      if (res.result) {
        const data = res.data;
        setPerList(data);
      } else {
        message.info(res.message);
        setPerList([]);
      }
    })
  }

  /**
   * @desc 保存职务信息
   * @param {*} perList 人员列表
   * @param {*} jobName 职务名称
   */
  const saveJob = (perList, jobName) => {
    let ret = {
      jobName,
      jobId,
      perList
    };
    request('jobMana/saveJobInfo', ret, res => {
      let res1 = {
        result: true,
      }
      if (res.result) {
        message.info('保存成功');
        setAddVisible(false);
        let index = jobId === '' ? 1 : pageIndex;
        getTableData(index);
        setPageIndex(index);
      } else {
        message.info(res.message);
        // setAddVisible(false);
      }
    })
  }

  /**
   * @desc 删除职务
   */
  const deleJob = () => {
    request('jobMana/deleJob', { jobId }, res => {
      let res1 = {
        result: true,
      }
      if (res.result) {
        message.info('删除成功');
        let index = 1;
        if (jobList.length === 1) {
          if (pageIndex === 1) {
            index = 1;
          } else {
            index = pageIndex - 1;
          }
        } else { index = pageIndex; }
        setPageIndex(index);
        getTableData(index);
      } else {
        message.info(res.message);
      }
      setJobId('');
      setDeleVisible(false);
    })
  }

  /**
   * @desc 页码切换
   * @param {*} page 页码
   */
  const pageChan = (page) => {
    setPageIndex(page);
    getTableData(page);
  }

  /**
   * @desc 点击添加职务
   */
  const addPerClick = () => {
    setJobId('');
    setJobName('');
    setAddVisible(true);
    setSelePers([]);
    getOrgList('', '', 0);
  }

  /**
   * @desc 编辑职务
   */
  const editClick = (jobId, jobName) => {
    setJobId(jobId);
    setJobName(jobName);
    getSelePers(jobId);
    getOrgList(jobId, '', 0);
  }

  /**
   * @desc 搜索机构
   * @param {*} orgKey 搜索值
   * @param {*} orgTab tab值
   */
  const orgSearch = (orgKey, orgTab) => {
    getOrgList(jobId, orgKey, orgTab);
    setType(orgTab);
  }

  /**
   * @desc 机构切换
   * @param {*} orgId 点击机构ID
   */
  const orgChan = (orgId, perKey) => {
    getPerList(jobId, perKey, orgId, type);
  }

  /**
   * @desc 人员搜索
   * @param {*} perKey 搜索值
   * @param {*} orgId 机构id
   */
  const perSearch = (perKey, orgId) => {
    getPerList(jobId, perKey, orgId, type);
  }

  /**
   * @desc 添加职务确定
   * @param {*} list 人员列表
   */
  const modalOk = (list, jobName) => {
    if (jobName) {
      saveJob(list, jobName);
    } else {
      message.info('请填写职务名称 !');
    }
  }

  /**
   * @desc 删除弹框
   * @param {*} visible true/false
   * @param {*} jobId 要删除的数据id
   */
  const deleModal = (visible, jobId) => {
    setDeleVisible(visible);
    setJobId(jobId);
  }

  return <div className='mj-jm-container'>
    <div className='mj-jm-content'>
      <div className='mj-jm-topCon'>
        <div>职务列表</div>
        <div className='mj-jm-btn'>
          <Button icon={<SVG type='tj' />} onClick={() => addPerClick()}>创建职务</Button>
        </div>
      </div>

      <div className='mj-jm-tableContainer'>
        {
          jobList.length ?
            <div className='mj-p-tables'>
              <div className='mj-p-tableTitle mj-jm-title'>
                {
                  title.map(item => {
                    return <div key={item.key}>{item.name}</div>
                  })
                }
              </div>
              <div className='mj-jm-tableScroll'>
                <PerfectScrollbar>
                  {
                    jobList.map(item => {
                      return <div key={item.jobId} className='mj-p-table mj-jm-line'>
                        <div>{item.order || '-'}</div>
                        <div title={item.job}>{item.job || '-'}</div>
                        <div title={item.sourExtent}>{item.sourExtent || '-'}</div>
                        <div>
                          <span onClick={() => editClick(item.jobId, item.job)}>
                            <SVG type='bj' />
                            编辑
                          </span>
                          <span onClick={() => deleModal(true, item.jobId)}>
                            <SVG type='sc' />
                            删除
                          </span>
                        </div>
                      </div>
                    })
                  }
                </PerfectScrollbar>
              </div>

              <div className='mj-p-pages'>
                <PagePonent
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  pageChan={(page) => pageChan(page)}
                  len={jobList && jobList.length || 0}
                  total={total} />
              </div>
            </div> :
            <div className='mj-rxq-noneData'>
              <img src={noneData} />
              <div>暂无数据</div>
            </div>
        }
      </div>
    </div>
    {/* 添加人员 */}
    {
      addVisible ?
        <PersonPonent
          visible={addVisible}
          type='zwgl'
          modalVi={() => setAddVisible(false)}
          onOk={(list, jobName) => modalOk(list, jobName)}
          jobName={jobName}
          orgList={orgList}
          perList={perList}
          selePers={selePers}
          orgChan={(orgId, perKey) => orgChan(orgId, perKey)}
          orgSearch={(orgKey, orgTab) => orgSearch(orgKey, orgTab)}
          perSearch={(perKey, orgId) => perSearch(perKey, orgId)}
        /> : null
    }

    {/* 删除职务 */}
    <ModalPonent
      title={'操作提示'}
      visible={deleVisible}
      onOk={() => deleJob()}
      onCancel={() => deleModal(false, '')}
      footer={{ ok: '确定', cancel: '取消' }}
      width={'610px'}
      content={
        <div style={{ paddingTop: 20, textAlign: 'center' }}>确定删除该职务？</div>
      }
    />
  </div>
}