/*
 * @Author: tj
 * @Date: 2020-02-13 11:49:14
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 12:58:13
 * 可视化公共头部
 */
import React, { Component } from 'react';
import './../../../style/tj_visHeader.scss';
import titleText from './../../../media/picture/top_title.png'
import { withRouter, NavLink } from 'react-router-dom';
import util from './../../../util/_util';
import { request } from './../../../util/request';
import G from './../../../config/g';
import { connect } from 'react-redux';
import { setConfig } from "./../../../util/request";

const toChinese = util.toChinese;

@withRouter
@connect(state =>({token: state.ws_global_reducer.ISCED_token, orgcode: state.ws_global_reducer.ISCED_orgcode}), {})
export default class VisualHeaer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: '',
            menu: [],
            time: '',
            week: '',
            weekNum: '',
            alreadyHour: 0,
            totalHour: 0
        }
        this.getDate = this.getDate.bind(this)
    }
    componentDidMount() {
        let token = this.props.token;
        let orgcode = this.props.orgcode;
        if (orgcode && token) {
            setConfig(G.dataService, token, orgcode);
            this.getDate()
            this.getMenu()
        }
    }

    // 获取菜单
    getMenu() {
        if (G.ISCED_curRoleInfo && G.ISCED_curRoleInfo.menuData) {
            let ovData = _.find(G.ISCED_curRoleInfo.menuData, { path: 'visual' });
            if (ovData.children.length) {
                let fndArr = ovData.children.slice(0);
                if (G.ISCED_setInfo && G.ISCED_setInfo.dataAnalyze) {
                    if (G.ISCED_setInfo.dataAnalyze == '0') {
                        fndArr.forEach((x, index) => {
                            if (x.key == 'ISCED001') {
                                delete fndArr[index]
                            }
                        });
                    }
                }
                this.setState({
                    menu: fndArr
                })
            }
        }
    }

    // 获取时间
    getDate() {
        this.formatteDate = function (value) {
            if (value < 10) {
                return '0' + value
            } else {
                return value
            }
        }
        let self = this;
        console.log(this)
        let parmas = {
            semesterId: G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.semesterId
        }
        request('/api/visual/getHeadMes', parmas, (res) => {
            if (res.result) {
                let data = res.data;
                let currentDate = new Date(data.time);
                let year = currentDate.getFullYear()
                let month = currentDate.getMonth() + 1;
                let day = currentDate.getDate();
                let week = currentDate.getDay()
                console.log("year, month, day, week", year, month, day, week)
                self.setState({
                    week: week>=0 ? week==0?'日':toChinese(week, false) : '--',
                    weekNum: data.week || '--',
                    alreadyHour: data.alreadyHour,
                    totalHour: data.totalHour,
                    time: year ? year + '-' + self.formatteDate(month) + '-' + self.formatteDate(day) : '--'
                })

                sessionStorage.setItem('sectionId', data.sectionId)
                // sessionStorage.setItem('sectionId','7')
            }
        })
    }

    render() {
        const { time, week, weekNum, alreadyHour, totalHour } = this.state;
        return (
            <div className='tj-visHeader'>
                <div className='header-info'>
                    <div className='date'>
                        <div>
                            <span>{time || '--'}</span>
                            <span>星期{week || "--"}</span>
                            <span>第{weekNum || "--"}周</span>
                        </div>
                    </div>
                    <div className='hour'>
                        <div className='hour-cont'>
                            {/* <div><p>已监测</p><p>门次</p></div><div>&nbsp;/&nbsp;</div><div><p>总开课</p><p>门次</p></div> */}
                            <span>已监测门次&nbsp;/&nbsp;总开课门次</span><br/>
                            <div className='hour-count'><span>{alreadyHour===''||alreadyHour===null?'-':alreadyHour}</span>/<span>{totalHour==null||totalHour==''?'-':totalHour}</span></div>
                        </div>
                    </div>
                </div>
                <div className='header-title'>
                    <div>
                        <img src={titleText} width='40%' />
                    </div>
                </div>
                <div className='header-menu'>
                    {
                        this.state.menu.map(item => {
                            return <NavLink key={item.path} activeClassName="menu-item active" className="menu-item" to={`/visual/${item.path}`}>
                                <span>{item.name}</span>
                            </NavLink>
                        })
                    }
                </div>
            </div>
        )
    }
}