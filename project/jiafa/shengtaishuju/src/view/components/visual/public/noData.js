/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-05 13:22:34
 */

/**
 * @description 可视化中心-通用无数据
 */

import React, { Fragment as F, useState, useEffect } from "react";
import noData from "./../../../../media/picture/img_noData.png";
import SVG from "./../../../public/svg";

export default function NoData(props) {
    return(
        <div className="noData" style={props.style}>
             <SVG type="noData" />
             {
                 props.msg? <p>{props.msg||'暂无数据'}</p>:''
             }
            
        </div>
    )

}