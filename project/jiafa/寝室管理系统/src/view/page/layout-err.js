/*
 * @Author: xq 
 * @Date: 2021-01-22 14:47:25 
 * @Last Modified by: xq
 * @Last Modified time: 2021-01-22 15:45:52
 * 无权限
 */
import React from "react";
import NoData from './../../media/picture/noJuris.png'

const ErrPage = () => {
    return <div className='xq-err-page'>
        <img src={NoData} />
        <div>
            您暂时无权查看此系统，请联系管理人员
        </div>
    </div>
}
export default ErrPage