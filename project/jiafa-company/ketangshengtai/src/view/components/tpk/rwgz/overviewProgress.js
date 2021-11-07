import React, { Component } from 'react'
import { Progress } from 'antd';
export default class OverviewProgress extends Component {
  render() {
    const {progress} = this.props
    return (
      <div>
        <Progress type="circle" percent={progress} />
      </div>
    )
  }
}
