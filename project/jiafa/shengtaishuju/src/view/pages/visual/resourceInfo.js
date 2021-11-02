/*
 * @Author: lxx 
 * @Date: 2020-01-22 15:08:37 
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-02-20 20:58:06
 * 资源情况
 */
import React, { Component } from 'react';
import './../../../style/visual_com.scss';
import "../../../style/zoe-visual.scss"
import ZoeTod from "../../components/visual/zoe-tod"
import ZoeRec from "../../components/visual/zoe-rec"
import VisualHeaer from './../../components/visual/visualHeader';
import {connect} from "react-redux"
import {zoe_getResMes,zoe_getResTodayMes,zoe_getResTodayOpen,zoe_getResTodayEff,zoe_getResTodayLeisure} from "../../../redux/zoe-recInfo.reducer"
@connect(state=>state.zoe_recInfo,{
    zoe_getResMes,
    zoe_getResTodayMes,
    zoe_getResTodayOpen,
    zoe_getResTodayEff,
    zoe_getResTodayLeisure
})
class ResourceInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount(){
        this.props.zoe_getResMes()
        this.props.zoe_getResTodayMes()
        this.props.zoe_getResTodayOpen()
        this.props.zoe_getResTodayEff()
        this.props.zoe_getResTodayLeisure()
    }
    render() {
        return (
            <div className='visual-container'>
                <VisualHeaer />
                <div className='visual-cnt'>
                    <div className="zoe-visual-cnt">
                        {/* 资源概况 */}
                       <ZoeRec history={this.props.history}/>
                       {/* 今日概况 */}
                       <ZoeTod history={this.props.history}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ResourceInfo;
