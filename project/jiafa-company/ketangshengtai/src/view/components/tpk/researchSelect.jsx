/*
 * @Author: JudyC 
 * @Date: 2017-09-12 14:57:27 
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-01 16:52:48
 */
import React, { Component } from 'react';
import { Select } from 'antd';
import './../../../style/tpk/mj_researchSelect.css';

const Option = Select.Option;

class ResearchSelect extends Component {

  render() {
    const { width, defaultValue, selectData, text } = this.props

    return (
      <div id='reserchSelect' className="cjy-rselect-slctBox">
        {
          text == null
            ? ''
            : <span className="cjy-rselect-slctSp">{text}<span>：</span></span>
        }
        <Select
          getPopupContainer={() => document.getElementById('reserchSelect')}
          value={defaultValue}
          style={{ width: width }}
          onChange={this.handleChange.bind(this)}>
          {
            selectData.map((item, index) => (
              <Option key={index} title={item.text} value={item.value}>{item.text}</Option>
            ))
          }
        </Select>
      </div>
    );
  }

  handleChange(value) {
    this.props.handleSelect(value);
  }
}

export default ResearchSelect;