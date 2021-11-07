/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-10 15:09:04
 */

/**
 * @description 学院画像-通用无数据
 */

import React, { Fragment as F, useState, useEffect } from "react";
import noData from "./../../../../media/picture/img_noData.png"
export default function CollageNoData(props) {
    return(
        <div className="noData" style={props.style}>
             <img src={noData}  />
             {/* <p style={{color:"#595959"}}>暂时还没有任何数据</p> */}
        </div>
    )

}