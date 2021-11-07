
/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: tj
 * @Last Modified time: yyyy-11-Tu 10:15:58
 * 总计统计率
 */

import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';
import SVG from '../../../public/svg';
import G from '../../../../config/g';
const { Option } = Select;
const { MonthPicker } = DatePicker;
class Statis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selTime: null,
            changeData: true,
            teachershow: false,
            staticData: null,  //页面数据
        };


    }
    //接收父组件的数据
    componentWillReceiveProps(props) {
        console.log(props)
        this.setState({
            statisData: props.statisData
        })
    }
   
    componentDidMount() {
        if (this.props.type == "teacher") {
            this.setState({
                teachershow: true,
            })
        }
    }


    render() {  
        let {  teachershow, statisData } = this.state;
        let multimediaUse = G.ISCED_setInfo.multimediaUse;
        console.log(statisData)
        return (
            <>
            {statisData ?
                <div className="zxq-info">

                    <div className="zxq-rectbox teachersum">

                        {teachershow ? <div className="teacher-number">教师总数 <span className="rectbox-number">{statisData[0] ? statisData[0].teachersSum : "--"}</span></div>
                            : <>
                                {/* <div>楼栋数量 <span className="rectbox-number">{ data.buildingNumber}</span></div> */}
                                
                                <div className="teacher-number">教室总数 <span className="rectbox-number">{statisData[0] ? statisData[0].classRoomNumber : "--"}</span></div>
                            </>

                        }
                    </div>
                    <div className="zxq-rectbox">
                        {teachershow ? <>
                            <div className="zxq-rectsvg"><span className="rectbox-svg"> <SVG type="da_rjgzl" /></span>人均工作量</div>
                            <div><span className="rectbox-number">{statisData[0] ? statisData[0].teacherWorkLoad ? statisData[0].teacherWorkLoad : "--" :"--"}</span>课时</div>
                        </>

                            : <>
                                <div className="zxq-rectsvg"><span className="rectbox-svg"><SVG type="da_jskkl" /></span>教室开课率</div>
                                <div><span className="rectbox-number">{statisData[0] ? statisData[0].classRoomCouRate ? statisData[0].classRoomCouRate +"%" : "--%" :"--%"}</span></div>
                            </>
                        }

                    </div>
                    {teachershow && multimediaUse !=0  ?
                        <div className="zxq-rectbox">
                            <div className="zxq-rectsvg"><span className="rectbox-svg"><SVG type="da_dmtsyl" /></span>多媒体使用率</div>
                            <div><span className="rectbox-number mulRatio">{statisData[0] ? statisData[0].multiUseRatio ? statisData[0].multiUseRatio+"%" : "--%" :"--%"}</span></div>
                        </div>
                    :!teachershow ?
                    <div className="zxq-rectbox">
                       <div className="zxq-rectsvg"><span className="rectbox-svg"><SVG type="da_jsyxlyl" /></span>教室有效利用率</div>
                       <div><span className="rectbox-number claRoomRate">{statisData[0] ? statisData[0].classRoomUseRatio ? statisData[0].classRoomUseRatio +"%" : "--%":"--%" } </span></div>
                    </div>
                   :""}
                    {/* <div className="zxq-rectbox">
                        {teachershow && multimediaUse !=0  ? 
                        <>
                            <div className="zxq-rectsvg"><span className="rectbox-svg"><SVG type="da_dmtsyl" /></span>多媒体使用率</div>
                            <div><span className="rectbox-number mulRatio">{statisData[0] ? statisData[0].multiUseRatio ? statisData[0].multiUseRatio+"%" : "--%" :"--%"}</span></div>
                        </>

                            :!teachershow ?
                             <>
                                <div className="zxq-rectsvg"><span className="rectbox-svg"><SVG type="da_jsyxlyl" /></span>教室有效利用率</div>
                                <div><span className="rectbox-number claRoomRate">{statisData[0] ? statisData[0].classRoomUseRatio ? statisData[0].classRoomUseRatio +"%" : "--%":"--%" } </span></div>
                            </>
                            :""
                        }

                    </div> */}
                    {teachershow ? ""
                        : <div className="zxq-rectbox">
                            <div className="zxq-rectsvg"><span className="rectbox-svg"><SVG type="da_jsxssyl" /></span>教室闲时使用率</div>
                            <div><span className="rectbox-number claRoomRate">{statisData[0] ? statisData[0].classRoomUsageRate ?statisData[0].classRoomUsageRate +"%" : "--%":"--%" }</span></div>
                        </div>
                    }

                </div>
                    : ""}
            </>
        );
    }
}

export default Statis;