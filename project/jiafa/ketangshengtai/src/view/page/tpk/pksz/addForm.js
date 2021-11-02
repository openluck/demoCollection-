/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-15 13:20:02
 * 听评课V2.2——新增表单
 */

import React, { Component } from "react";
import FormCreateOrDesign from "./../../../components/tpk/pksz/form-createOrDesign";

export default class AddForm extends Component {
  render() {
    return (
      <>
        <FormCreateOrDesign {...this.props} />
      </>
    );
  }
}
