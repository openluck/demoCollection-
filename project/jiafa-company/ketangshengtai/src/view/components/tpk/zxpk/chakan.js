import React, { Component, Fragment } from "react";
import { SVG } from "./../../../../../base";

export default class ChaKan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMoveIn: false
    };
  }
  render() {
    return (
      <div
        // onMouseOver={() => {
        //   this.setState({
        //     isMoveIn: true
        //   });
        // }}
        // onMouseOut={() => {
        //   this.setState({
        //     isMoveIn: false
        //   });
        // }}
      >
        <SVG
          type="icon-chakanxq"
          className='mj-icon'
          title='查看'
          style={{ width: '20px', height: '20px' }}
          onClick={() => {
            this.props._seeMore();
          }}
        ></SVG>
        {/* {this.state.isMoveIn ? (
          <SVG
            type="ck"
            title='查看'
            style={{ width: '20px', height: '20px' }}
            onClick={() => {
              this.props._seeMore();
            }}
          ></SVG>
        ) : (
            <SVG title='查看' style={{ width: '20px', height: '20px', color: '#a6a6a6' }} 
            type="icon-chakanxq"></SVG>
          )} */}
      </div>
    );
  }
}
