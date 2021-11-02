/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: yrj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 学院画像-通用头部组件
 */

import React, { Fragment as F, useState, useEffect } from "react";

export default function CollageComHead(props) {
    return(
        <div className="col_head">
              <span></span>
              <span>{props.title}</span>
        </div>
    )

}