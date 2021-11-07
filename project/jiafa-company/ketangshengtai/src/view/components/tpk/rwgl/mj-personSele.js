/*
 * @Author: MinJ
 * @Date: 2020-05-13 13:37:16 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-07 13:28:47
 * 职务管理：添加职务弹窗、系统设置-人员设置：添加人员弹窗
 * type xtsz系统设置  zwgl职务管理
 */
import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Input, Tabs, Checkbox } from 'antd';
import _ from 'lodash';
import { request } from './../../../../util/request';
import SVG from "./../../../public/public-component-svg";
import ModalPonent from './../../../components/modalPonent';
import { perChan } from './../../../../redux/tpk/rwgl/mj-addTsak.reducer';

import './../../../../style/personPonent.scss';
const { TabPane } = Tabs;

@withRouter
@connect(state => ({}), { perChan })
class PersonSele extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskId: '',
      orgTab: '2',          //tab值 0行政 1教学 2职务
      orgLists: [],       //机构列表
      perLists: [],       //机构下人员列表
      selePer: [],        //全部已选择人员
      orgKey: '',         //机构搜索值
      perKey: '',         //人员搜索值
      seleOrg: '',        //选中机构id

      isClear: false,     //用于清空
      // checkList: [],      //勾选列表
    };
    this.getOrgList = this.getOrgList.bind(this);
    this.getPerList = this.getPerList.bind(this);


    this.tabNodes = this.tabNodes.bind(this);
    this.orgChan = this.orgChan.bind(this);
    this.orgSearch = this.orgSearch.bind(this);
    this.tabChan = this.tabChan.bind(this);
    this.checkChan = this.checkChan.bind(this);
    this.perSearch = this.perSearch.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  /**
 * @desc 获取机构列表
 * @param {*} keyword 搜索值
 * @param {*} type 0行政 1教学 2职务
 */
  getOrgList(keyword, type) {
    const { taskId = '' } = this.props.match.params;
    let ret = { taskId, keyword, type };
    request('addTask/getOrgList', ret, res => {
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
        this.getPerList('', orgId);
        this.setState({
          orgLists: data,
          seleOrg: orgId,
        })
      } else {
        message.info(res.message);
        this.setState({ orgLists: [], seleOrg: '' })
      }
    })
  }

  /**
   * @desc 获取机构下人员列表
   * @param {*} keyword 搜索值
   * @param {*} orgCode 机构id
   */
  getPerList(keyword, orgId) {
    const { taskId = '' } = this.props.match.params;
    const { orgTab } = this.state;
    let ret = { taskId, keyword, orgId, type: orgTab };
    request('addTask/getOrgPerList', ret, res => {
      let res1 = {
        result: true,
        data: [
          { perName: '姓名1', perId: '1', isChecked: '0' }, { perName: '姓名2', perId: '2', isChecked: '0' },
          { perName: '姓名3', perId: '3', isChecked: '1' }, { perName: '姓名4', perId: '4', isChecked: '1' },
          { perName: '姓名5', perId: '5', isChecked: '0' }, { perName: '姓名6', perId: '6', isChecked: '0' },
          { perName: '姓名7', perId: '7', isChecked: '1' }, { perName: '姓名8', perId: '8', isChecked: '1' },
          { perName: '姓名9', perId: '9', isChecked: '0' }, { perName: '姓名10', perId: '10', isChecked: '0' },
          { perName: '姓名5', perId: '12', isChecked: '0' }, { perName: '姓名6', perId: '16', isChecked: '0' },
          { perName: '姓名7', perId: '123', isChecked: '1' }, { perName: '姓名8', perId: '38', isChecked: '1' },
          { perName: '姓名9', perId: '31', isChecked: '0' }, { perName: '姓名10', perId: '210', isChecked: '0' },
        ]
      }
      if (res.result) {
        const data = res.data;
        this.setState({ perLists: data })
      } else {
        message.info(res.message);
        this.setState({ perLists: [] })
      }
    })
  }

  componentDidMount() {
    const { perList } = this.props;
    this.getOrgList('', '2');
    this.setState({ selePer: perList });
  }

  /**
   * @desc tab切换
   */
  tabChan(key) {
    const { orgKey } = this.state;
    this.getOrgList(orgKey, key);
    this.setState({
      orgTab: key
    })
  }

  /**
   * @desc 机构搜索
   */
  orgSearch() {
    const { orgKey, orgTab } = this.state;
    this.getOrgList(orgKey, orgTab);
  }

  /**
   * @desc 机构切换
   * @param {*} orgId 点击机构ID
   */
  orgChan(orgId) {
    const { perKey } = this.state;
    this.getPerList('', orgId);
    this.setState({
      seleOrg: orgId,
      perKey: ''
    });
  }

  /**
   * @desc tabs
   */
  tabNodes() {
    const content = [{ tab: '职务', key: '2' }, { tab: '行政机构', key: '0' }, { tab: '教学机构', key: '1' }];
    const { seleOrg, orgLists, perLists, selePer, orgKey, perKey } = this.state;

    return content.map(item => {
      return <TabPane tab={item.tab} key={item.key}>
        <div className='mj-person-tabCon'>
          <PerfectScrollbar>
            {
              orgLists && orgLists.length ?
                orgLists.map(itemOrg => {
                  return <div
                    className={seleOrg === itemOrg.orgId ? 'mj-percon-org mj-percon-orgHigh' : 'mj-percon-org'}
                    onClick={() => this.orgChan(itemOrg.orgId)}
                    key={itemOrg.orgId}>{itemOrg.orgName}</div>
                }) : <></>
            }
          </PerfectScrollbar>
        </div>
      </TabPane>
    })
  }

  /**
   * @desc 人员搜索
   */
  perSearch() {
    const { perKey, seleOrg } = this.state;
    this.getPerList(perKey, seleOrg);
  }

  /**
   * 复选框
   * @param {*} type all全选 one复选框 clear清空 sc删除
   */
  checkChan(type, event, item) {
    // console.log(event, item);
    const { perLists, selePer, seleOrg } = this.state;
    let list = selePer;
    if (type === 'all') {
      perLists.map(item => {
        let index = _.findIndex(selePer, { perId: item.perId });
        if (index === -1) {
          item.orgId = seleOrg;
          list.push(item);
        }
      })
    } else if (type === 'one') {
      if (event.target.checked) {
        // console.log(seleOrg);
        item.orgId = seleOrg;
        list.push(item);
      } else {
        _.remove(list, function (params) {
          return params.perId === item.perId;
        })
      }
    } else if (type === 'sc') {
      _.remove(list, function (params) {
        return params.perId === item.perId;
      })
    } else {
      list = [];
    }
    // console.log(list);
    this.setState({ selePer: list });
  }

  /**
   * @desc 确定
   */
  onOk() {
    const { selePer } = this.state;
    let list = [];
    selePer.map(item => {
      list.push({
        personId: item.perId,
        personName: item.perName,
        orgId: item.orgId,
        postName: '',
      });
    })
    this.props.perChan('perChecked', list)
  }

  render() {
    const { visible, type } = this.props;
    const { orgLists, perLists, selePer, orgKey, perKey, orgTab } = this.state;
    // console.log(selePer);

    return <div>
      <ModalPonent
        title={type === 'xtsz' ? '添加人员' : '创建职务'}
        visible={visible}
        onOk={() => this.onOk()}
        // onCancel={() => this.props.modalVi()}
        onCancel={() => this.props.perChan('perModal', false)}
        // onOk={() => this.props.perChan('perChecked', selePer)}
        footer={{ ok: '确定', cancel: '取消' }}
        width={'900px'}
        content={
          <div className='mj-person-content'>
            <div className='mj-person-perCon'>
              <div className='mj-person-ponent'>
                {/* 机构列表 */}
                <div className='mj-person-orgCon'>
                  <div className='mj-person-orgSearch'>
                    <Input
                      suffix={<span onClick={() => this.orgSearch()}><SVG type='xkjg' /></span>}
                      onPressEnter={() => this.orgSearch()}
                      onChange={(e) => this.setState({ orgKey: e.target.value })}
                      placeholder='机构名称' />
                  </div>
                  <Tabs activeKey={orgTab}
                    onChange={(key) => this.tabChan(key)}
                  >
                    {this.tabNodes()}
                  </Tabs>
                </div>

                {/* 待选人员列表 */}
                <div className='mj-person-allPerCon'>
                  <div className='mj-person-orgSearch'>
                    <Input
                      suffix={<span onClick={() => this.perSearch()}><SVG type='xkjg' /></span>}
                      onPressEnter={() => this.perSearch()}
                      onChange={(e) => this.setState({ perKey: e.target.value })}
                      placeholder='姓名' />
                  </div>
                  <div className='mj-person-total'>
                    <div>{`共 ${perLists.length} 人`}</div>
                    <div onClick={() => this.checkChan('all')}>全选</div>
                  </div>
                  <div className='mj-person-perList'>
                    <PerfectScrollbar>
                      {
                        perLists.length ?
                          perLists.map(item => {
                            let index = _.findIndex(selePer, { perId: item.perId });
                            return <div key={item.perId} className='mj-person-per'>
                              <Checkbox
                                checked={index === -1 ? false : true}
                                onChange={(e) => this.checkChan('one', e, item)}
                              >{item.perName}</Checkbox>
                            </div>
                          }) : <></>
                      }
                    </PerfectScrollbar>
                  </div>
                </div>

                <div className='mj-person-iconCon'>
                  <SVG type='xz' />
                </div>

                {/* 全部已选择 */}
                <div className='mj-person-selePerCon'>
                  <div className='mj-person-total'>
                    <div>{`已选择 (${selePer.length})`}</div>
                    <div onClick={() => this.checkChan('clear')}>清空</div>
                  </div>
                  <div className='mj-person-seles'>
                    <PerfectScrollbar>
                      {
                        selePer.length ?
                          selePer.map(item => {
                            return <div key={item.perId} className='mj-person-selePer'>
                              <div>{item.perName}</div>
                              <div onClick={() => this.checkChan('sc', '', item)}>
                                <SVG type='sc' />
                              </div>
                            </div>
                          }) : <></>
                      }
                    </PerfectScrollbar>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  }
}

export default PersonSele;
