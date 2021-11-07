import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalCompanyResume} from '../../i18n';
import '../../sass/company/CompanyResume.scss';
import CommonBanner from "../common/CommonBanner";
import company from '../../assets/images/company.jpg';
import customs from '../../assets/images/customs.jpg';
import enterEntrepot from '../../assets/images/enterEntrepot.jpg';
import entrepot from '../../assets/images/entrepot.jpg';
import online from '../../assets/images/online.jpg';
import Serve from '../../assets/images/Serve.jpg';
import start from '../../assets/images/start.jpg';
import anniversary from '../../assets/images/anniversary.jpg';
import next from '../../assets/images/next.svg';
import preImg from '../../assets/images/pre.svg';

interface CompanyResumeProps {
    history: {
        push: Function,
        replace: Function,
    }
}

interface CompanyResumeState {
    active:number,
    imgList:string[],
}

class CompanyResume extends Component<CompanyResumeProps, CompanyResumeState> {
    constructor(props:any) {
        super(props);
        this.state = {
            active: 0,
            imgList: []
        }
    }

    componentDidMount(): void {
        this.setState({imgList:[start, customs, Serve, entrepot, enterEntrepot, online,anniversary]})
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const changeActive = (n:number) => {
            const active =this.state.active + n;
            if(active >= 0 && active <7) {
                this.setState({active:active});
            }
        }
        return (
            <Receiver componentName="CompanyResume">
                {(i18n:I18nLocalCompanyResume) => (
                    <div className="company-resume">
                        <CommonBanner history={this.props.history}/>
                        <div className="about-us">
                            <div className="about-img">
                                <img src={company} alt="img"/>
                            </div>
                            <div className="about-text">
                                <div className="about-title">{i18n.aboutTitle}</div>
                                <div className="about-desc">{i18n.aboutDesc}</div>
                            </div>
                        </div>
                        <div className="progress">
                            <div className="progress-title">{i18n.progress}</div>
                            <div className="time-list">
                                <img className="pre-icon" src={preImg} alt="img"
                                    onClick={() => {changeActive(-1)}}
                                />
                                {i18n.timeList.map((item, index) => {
                                    return (<span key={index} className={
                                        this.state.active === index ? "active" : "item"
                                    }
                                        onClick={() => {this.setState({active:index})}}
                                    >
                                        {this.state.active === index ? item.active : item.time}
                                    </span>)
                                })}
                                <img src={next} className="next-icon"
                                     alt="img"
                                      onClick={() => {changeActive(1)}}
                                />
                            </div>
                            <div className="progress-info">
                                {i18n.progressInfo.map((item,index) => {
                                    if(index === this.state.active) {
                                        return (<div className="info-right" key={index}>
                                            <div className="title">{item.title}</div>
                                            <div className="info">{item.info}</div>
                                        </div>);
                                    } else {
                                        return "";
                                    }
                                })}
                                <div className="right-img">
                                    {this.state.imgList.map((item,index) => {
                                        if(index === this.state.active) {
                                            return <img src={item} alt="img" key={index}/>
                                        } else {
                                            return ""
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="contact">
                            <div className="contact-title">{i18n.contact}</div>
                            <div className="contact-list">
                                <div className="contact-way">
                                    <span className="iconfont iconaddress address"/>
                                    <p>{i18n.contactAddress}</p>
                                </div>
                                <div className="contact-way">
                                    <span className="iconfont iconphone phone"/>
                                    <p>+ (86) 28 67649839</p>
                                </div>
                                <div className="contact-way">
                                    <span className="iconfont iconemail email"/>
                                    <p>official@hopeyoo.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
            </Receiver>
        )
    }
}

export default CompanyResume;