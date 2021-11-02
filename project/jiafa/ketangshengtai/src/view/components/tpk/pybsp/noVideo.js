import React, { Component } from 'react'
import  SVG  from "../../../public/public-component-svg";
export default class NoVideo extends Component {
  render() {
    return (
      <div className="yh-noVideo-wrap">
        <div>
          <span> <SVG type="sp" /></span>
          暂无录播视频
        </div>
        <style>
          {
            `
            .yh-noVideo-wrap{
              width:100%;
              height:650px;
              background-color:#000000;
              color:#585858;
              font-size:16px;
              display:flex;
              justify-content: center;
              align-items: center;
            }
            .yh-noVideo-wrap>div{
              text-align:center
            }
            .yh-noVideo-wrap>div>span{
              display:block;
            }
            .yh-noVideo-wrap>div>span svg{
              font-size:100px
            }
            `
          }
        </style>
      </div>

    )
  }
}
