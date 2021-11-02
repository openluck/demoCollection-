/*
 * @Author: zhengqi 
 * @Date: 2017-09-19 09:35:47 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 11:03:14
 * 听评课-管理员部分-随堂设置-授课员审批权限设置-字母检索
 */
import React, { Component } from 'react';
import { Row, Col, Radio } from 'antd';
import { SVG } from './../../components/tpk/base.jsx';
import './../../../style/tpk/mj_listenPerName.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const data = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class ListenSearchKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAll: '',      //权限所属是不是全部
    };
  }


  render() {
    console.log(this.state.isAll === '', this.state.isAll);

    return (
      <div>
        <div className='zq-lpn-identificationKey'>
          <Row>
            <Col span={3}></Col>
            <Col span={21} className={this.state.isAll === '' ? 'zq-lpn-letter zq-lpn-all' : 'zq-lpn-letter'}>
              <RadioGroup defaultValue={0} size="large" onChange={
                (e) => {
                  this.props.handleOnTeaKey(e)
                  this.setState({ isAll: e.target.value })
                }
              }>
                {
                  data.map((value, index) => (
                    index === 0 ?
                      <RadioButton value={value} key={index}>
                        <SVG type='fenzhi' 
                          style={{ width: 20, height: 20, fill: this.state.isAll === '' ? 'ff794c' :'#000000a6'}} />
                      </RadioButton> :
                      <RadioButton value={value} key={index}>{value}</RadioButton>
                  ))
                }
              </RadioGroup>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ListenSearchKey;