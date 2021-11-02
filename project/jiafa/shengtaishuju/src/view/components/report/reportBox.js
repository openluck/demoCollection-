import React from 'react';
import './../../../style/tj-masterReport.scss'
function ReportBox(props) {
    return (
        <div className='tj-report-box'>
            <div className='box-tit'>{props.title}</div>
            <div className='box-content'>{props.content}</div>
        </div>
    )
}
export default ReportBox;