import React, { Component } from 'react'

export default class OverviewContainer extends Component {
  render() {
    const {width,height,title,style}=this.props;
    return (
      <div className="yh-overview-container" style={{width:width,height:height,...style}}>
        <div className="yh-overview-wrap">
          <h6 className="clearfix">
            {/* <span className="yh-line"></span> */}
            <span>{title}</span>
          </h6>
          {this.props.children}
        </div>
      </div>
    )
  }
}
