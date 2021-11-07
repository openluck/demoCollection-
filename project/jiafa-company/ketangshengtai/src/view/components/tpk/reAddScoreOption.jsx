/*
 * @Author: JudyC 
 * @Date: 2017-09-11 18:14:14 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-21 13:51:09
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Input, InputNumber, Button, message } from 'antd';
import { SVG } from './../../components/tpk/base.jsx';
import './../../../style/tpk/mj_reAddScoreOption.css';
import { request } from './../../../util/request_2.12';
const { TextArea } = Input;

class ReAddScoreOption extends Component {
  constructor() {
    super();
    this.state = {
      litNum: 0,
      bigMenu: '',
      litMenu: '',
      discription: '',
      itemData: {},
    }
    this.total = 0;
  };

  componentDidMount() {
    this.total = 0;
    const childModelList = this.props.itemData.childModelList;
    // console.log(this.props, childModelList);
    childModelList.map(item => {
      this.total = Number(this.total) + Number(item.score);
    })
    this.setState({
      litNum: this.total
    })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(nextProps, prevState);
    if (JSON.stringify(nextProps.itemData) !== JSON.stringify(prevState.itemData)) {
      const itemData = nextProps.itemData;
      const modalList = itemData.childModelList && itemData.childModelList[0] || {};
      console.log(itemData);
      return {
        ...prevState,
        litNum: itemData.score,
        bigMenu: itemData.evaluateModelName,
        litMenu: modalList.evaluateModelName,
        discription: modalList.evaluateModelDescription,
        itemData: nextProps.itemData,
      }
    }
    return null
  }

  submit = () => {
    const { bigMenu, litMenu, litNum, discription } = this.state
    const { tableData, itemData } = this.props
    let all = 0
    tableData.map(item => {
      if (item.prtKey !== itemData.evaluateModelId) {
        all += item.score
      }
    })
    all += litNum
    if (all > 100) {
      message.info('评价总分不能超过100分！');
    } else if (bigMenu === litMenu) {
      message.info('输入评价大项和子项名称存在重复！');
    } else if (bigMenu === '') {
      message.info('请输入评价大项名称！');
    } else if (litMenu === '') {
      message.info('请输入评价子项名称！');
    } else {
      let childModelList = [{ evaluateModelName: litMenu, score: litNum, evaluateModelDescription: discription }];
      let commentData = {
        evaluateModelId: this.props.itemData.evaluateModelId || '',
        evaluateModelName: bigMenu,
        evaluateModelDescription: '',
        childModelList: childModelList
      };
      this.props.submitData(commentData);
    }
  }

  render() {
    const { bigMenu, litMenu, litNum, discription } = this.state

    return (
      <div className='mj-raso-content'>
        <div className='mj-raso-bigMenu'>
          <label>评分大项：</label>
          <Input
            maxLength={30}
            placeholder='请输入评分大项'
            value={bigMenu}
            onChange={(e) => this.setState({ bigMenu: e.target.value })}
          />
          <span>
            <label>{litNum}</label>
            {/* <label>{Number(this.total) + Number(litNum) || 0}</label> */}
            <label>分</label>
          </span>
        </div>

        <div className='mj-raso-litContent'>
          <div className='mj-raso-litMenu'>
            <label>评分子项：</label>
            <Input className='mj-raso-liNum' maxLength={30} placeholder='请输入评分子项' value={litMenu}
              onChange={(e) => this.setState({ litMenu: e.target.value })} />
            <InputNumber min={0} max={100} defaultValue={0} value={litNum}
              onChange={(value) => this.setState({ litNum: value })}
            />
            <label>分</label>
          </div>

          <div className='mj-raso-textCon'>
            <label>评分标准：</label>
            <TextArea rows={4} placeholder='输入请勿超过200字' maxLength={200} value={discription}
              onChange={(e) => this.setState({ discription: e.target.value })} />
          </div>
        </div>

        <div className='mj-raso-btns'>
          <Button onClick={() => this.submit()}>保存</Button>
          <Button onClick={() => this.props.handleCancel()}>取消</Button>
        </div>
      </div>
    );
  }
}
export default ReAddScoreOption;