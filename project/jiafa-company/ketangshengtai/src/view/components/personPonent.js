/*
 * @Author: MinJ
 * @Date: 2020-05-13 13:37:16 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-15 13:42:01
 * 职务管理：添加职务弹窗、系统设置-人员设置：添加人员弹窗
 * type xtsz系统设置  zwgl职务管理
 */
import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Input, Tabs, Checkbox } from 'antd';
import _ from 'lodash';
import SVG from "./../public/public-component-svg";
import ModalPonent from './modalPonent';

import './../../style/personPonent.scss';
const { TabPane } = Tabs;

class PersonPonent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobName: '',        //职务名称
      orgTab: '0',          //tab值
      orgKey: '',         //机构搜索值
      perKey: '',         //人员搜索值
      seleOrg: '',        //选中机构id
      orgLists: [],       //机构列表
      perLists: [],       //机构下人员列表
      selePer: [],        //全部已选择人员
      isClear: false,     //用于清空
      // checkList: [],      //勾选列表
    };
    this.tabNodes = this.tabNodes.bind(this);
    this.orgChan = this.orgChan.bind(this);
    this.orgSearch = this.orgSearch.bind(this);
    this.tabChan = this.tabChan.bind(this);
    this.checkChan = this.checkChan.bind(this);
    this.perSearch = this.perSearch.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  componentDidMount() {
    const { orgList, perList, selePers, jobName } = this.props;
    this.setState({
      orgLists: orgList,
      seleOrg: orgList.length && orgList[0].orgId || '',
      perLists: perList,
      selePer: selePers,
      jobName
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { orgList, perList, selePers } = nextProps;
    const { orgLists, perLists, selePer, isClear } = prevState;
    // console.log(nextProps, prevState);

    if (orgList.length !== orgLists.length || JSON.stringify(orgList) !== JSON.stringify(orgLists)) {
      return {
        ...prevState,
        orgLists: orgList,
        seleOrg: orgList.length && orgList[0].orgId || ''
      }
    }
    if (JSON.stringify(perList) !== JSON.stringify(perLists)) {
      return {
        ...prevState,
        perLists: perList
      }
    }
    return null;
  }

  /**
   * @desc tab切换
   */
  tabChan(key) {
    const { orgKey } = this.state;
    this.props.orgSearch(orgKey, key);
    this.setState({
      orgTab: key
    })
  }

  /**
   * @desc 机构搜索
   */
  orgSearch() {
    const { orgKey, orgTab } = this.state;
    this.props.orgSearch(orgKey, orgTab);
    this.setState({ perKey: '' })
  }

  /**
   * @desc 机构切换
   * @param {*} orgId 点击机构ID
   */
  orgChan(orgId) {
    const { perKey } = this.state;
    this.props.orgChan(orgId, '');
    this.setState({
      seleOrg: orgId,
      perKey: ''
    });
  }

  /**
   * @desc tabs
   */
  tabNodes() {
    const content = [{ tab: '行政机构', key: 0 }, { tab: '教学机构', key: 1 }];
    const { seleOrg, orgLists, perLists, selePer, orgKey, perKey } = this.state;

    return content.map(item => {
      return <TabPane tab={item.tab} key={item.key}>
        <div className='mj-person-tabCon'>
          <PerfectScrollbar>
            {
              orgLists && orgLists.length ?
                orgLists.map(item => {
                  return <div
                    title={item.orgName}
                    className={seleOrg === item.orgId ? 'mj-percon-org mj-percon-orgHigh' : 'mj-percon-org'}
                    onClick={() => this.orgChan(item.orgId)}
                    key={item.orgId}>{item.orgName}</div>
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
    this.props.perSearch(perKey, seleOrg);
  }

  /**
   * 复选框
   * @param {*} type all全选 one复选框 clear清空 sc删除
   */
  checkChan(type, event, item) {
    // console.log(event, item);
    const { perLists, selePer, orgId } = this.state;
    let list = selePer;
    if (type === 'all') {
      perLists.map(item => {
        let index = _.findIndex(selePer, { perId: item.perId });
        if (index === -1) {
          item.orgId = orgId;
          list.push(item);
        }
      })
    } else if (type === 'one') {
      if (event.target.checked) {
        item.orgId = orgId;
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
    const { selePer, jobName } = this.state;
    let list = [];
    selePer.map(item => {
      list.push(item.perId);
    })
    this.props.onOk(list, jobName);
  }

  render() {
    const { visible, type } = this.props;
    const { orgLists, perLists, selePer, orgKey, perKey, orgTab, jobName } = this.state;
    // console.log(selePer);

    return <div>
      <ModalPonent
        title={type === 'xtsz' ? '添加人员' : '创建职务'}
        visible={visible}
        onOk={() => this.onOk()}
        onCancel={() => this.props.modalVi()}
        footer={{ ok: '确定', cancel: '取消' }}
        width={'900px'}
        content={
          <div className='mj-person-content'>
            {
              type === 'zwgl' ?
                <div className='mj-person-nameCon'>
                  <span>职务名称：</span>
                  <Input
                    value={jobName}
                    maxLength={20}
                    onChange={(e) => this.setState({ jobName: e.target.value })}
                    placeholder='请输入名称' />
                </div> : null
            }
            <div className='mj-person-perCon'>
              {type === 'zwgl' ? <span>选择人员：</span> : null}
              <div className='mj-person-ponent'>
                {/* 机构列表 */}
                <div className='mj-person-orgCon'>
                  <div className='mj-person-orgSearch'>
                    <Input
                      suffix={
                        <span onClick={() => this.orgSearch()}>
                          <SVG type='xkjg' />
                        </span>
                      }
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
                      suffix={
                        <span onClick={() => this.perSearch()}>
                          <SVG type='xkjg' />
                        </span>
                      }
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

export default PersonPonent;
