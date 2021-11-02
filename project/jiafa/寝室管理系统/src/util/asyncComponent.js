/*
 * @Author: junjie.lean
 * @Date: 2021-01-25 09:40:17
 * @Last Modified by:   junjie.lean
 * @Last Modified time: 2021-01-25 09:40:17
 */

import React, { Component } from "react";

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
