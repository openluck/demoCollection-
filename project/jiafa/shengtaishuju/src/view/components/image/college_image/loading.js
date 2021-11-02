

/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: yrj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 学院画像-通用无数据
 */

import React, { Fragment as F, useState, useEffect } from "react";
import noData from "./../../../../media/picture/img_noData.png"
import { Icon } from 'antd';
import { Spin } from 'antd';

export default function loading(props) {
    return(
        <div className="noData" style={props.style}>
            <div className="loadingBox">
                 <Spin/>
            </div>
        </div>
    )

}