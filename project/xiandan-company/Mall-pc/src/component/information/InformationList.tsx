import React,{Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalInformationList} from '../../i18n';
import '../../sass/information/InformationList.scss';

interface InformationListProps {
    history:{
        replace:Function,
        push:Function,
        location:{
            pathname:string,
        }
    },
}

interface InformationListState {
    activeGroup:number,
    activeItem:string,
}

class InformationList extends Component<InformationListProps, InformationListState> {
    constructor(props:any) {
        super(props);
        this.state = {
            activeGroup:2,
            activeItem:"",
        }
    }

    componentDidMount(): void {
        const pathname = this.props.history.location.pathname.toString();
        this.setState({activeItem: pathname});
        if(pathname === '/information/buyingGuide' ||
            pathname === "/information/payWay" ||
            pathname === "/information/attestation" ||
            pathname === "/information/tariff") {
            this.setState({activeGroup:1});
        } else if(pathname === "/information/" ||
            pathname === "/information/notification" ||
            pathname === "/information/entrust" ||
            pathname === "/information/serviceAgreement" ||
            pathname === "/information/companyProfile" ||
            pathname === "/information/packaging" ||
            pathname === "/information/taxRate"
        ) {
            this.setState({activeGroup:2});
        } else if (pathname === "/information/distributionMode" ||
            pathname === "/information/distributionService" ||
            pathname === "/information/freightBase" ||
            pathname === "/information/logisticsTracking" ||
            pathname === "/information/customizeLogistics") {
            this.setState({activeGroup:3});
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const changeGroup = (n:number) => {
            this.setState({activeGroup:this.state.activeGroup === n ? 0 :n});
        }
        const changeItem = (value:string) => {
            this.setState({activeItem:value});
        }
        return (
            <Receiver componentName="InformationList">
                {(i18n:I18nLocalInformationList) => (
                    <div className="information-list">
                        {/* 暂时隐藏 */}
                        {/*<div className="group">*/}
                        {/*    <p className={this.state.activeGroup === 1 ? "active-group" : "group-title"}*/}
                        {/*        onClick={()=>{changeGroup(1)}}*/}
                        {/*    >{i18n.beginnerGuide}</p>*/}
                        {/*    {this.state.activeGroup === 1 ? <ul className="group-list">*/}
                        {/*        {i18n.beginnerGuideItem.map((item,index) => {*/}
                        {/*            return (<li key={index}>*/}
                        {/*                <a href={item.path}*/}
                        {/*                   className={this.state.activeItem === item.path ? "active-item" : ""}*/}
                        {/*                >{item.name}</a>*/}
                        {/*            </li>)*/}
                        {/*        })}*/}
                        {/*    </ul> : ""}*/}

                        {/*</div>*/}
                        <div className="group">
                            <p className={this.state.activeGroup === 2 ? "active-group" : "group-title"}
                               onClick={()=>{changeGroup(2)}}
                            >{i18n.questions}</p>
                            {this.state.activeGroup === 2 ? <ul className="group-list">
                                {i18n.questionsItem.map((item,index) => {
                                    return (<li key={index}>
                                        <a href={item.path}
                                            className={this.state.activeItem === item.path ? "active-item" : ""}
                                           onClick={() => {changeItem(item.path)}}
                                        >{item.name}</a>
                                    </li>)
                                })}
                            </ul> : ""}
                        </div>
                        {/* 暂时隐藏 */}
                        {/*<div className="group">*/}
                        {/*    <p className={this.state.activeGroup === 3 ? "active-group" : "group-title"}*/}
                        {/*       onClick={()=>{changeGroup(3)}}*/}
                        {/*    >{i18n.logistics}</p>*/}
                        {/*        {this.state.activeGroup === 3 ? <ul className="group-list">*/}
                        {/*        {i18n.logisticsItem.map((item,index) => {*/}
                        {/*            return (<li key={index}>*/}
                        {/*                <a href={item.path}*/}
                        {/*                   className={this.state.activeItem === item.path ? "active-item" : ""}*/}
                        {/*                   onClick={() => {changeItem(item.path)}}*/}
                        {/*                >{item.name}</a>*/}
                        {/*            </li>)*/}
                        {/*        })}*/}
                        {/*    </ul> : ""}*/}
                        {/*</div>*/}
                        <div className="group">
                            <p className={this.state.activeGroup === 4 ? "active-group" : "group-title"}
                               onClick={()=>{changeGroup(4)}}
                            >{i18n.aboutUs}</p>
                                {this.state.activeGroup === 4 ? <ul className="group-list">
                                {i18n.aboutUsItem.map((item,index) => {
                                    return (<li key={index}>
                                        <a href={item.path}
                                           className={this.state.activeItem === item.path ? "active-item" : ""}
                                           onClick={() => {changeItem(item.path)}}
                                        >{item.name}</a>
                                    </li>)
                                })}
                            </ul> : ""}
                        </div>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default InformationList;