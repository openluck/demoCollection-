import React, {Component} from 'react';
import '../../sass/information/CompanyProfile.scss';
import {I18nReceiver as Receiver, I18LocalCompanyProfile} from '../../i18n';
import system from '../../assets/images/system.jpg';
import table from '../../assets/images/table.svg';
import Logo from './Logo';

interface CompanyProfileProps {

}

interface CompanyProfileState {

}

class CompanyProfile extends Component<CompanyProfileProps, CompanyProfileState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="CompanyProfile">
                {(i18n:I18LocalCompanyProfile) => (
                    <div className="company-profile">
                        <div className="title">{i18n.title}</div>
                        <div className="about-hope">
                            {i18n.aboutHope.map((item,index) => {
                                return (
                                    <p key={index} className={item.type === 1 ? "item-blank" : ""}>
                                        {item.info}
                                    </p>
                                )
                            })}
                        </div>
                        <div className="hope-title">{i18n.hopeTitle}</div>
                        <div className="hope-info">{i18n.hopeInfo}</div>
                        <div className="more-info">
                            {i18n.more.map((item,index) => {
                                return (
                                    <p key={index} className="more-item">
                                        {item}
                                    </p>
                                )
                            })}
                        </div>
                        <div className="img-title">{i18n.imgList}</div>
                        <div className="img-list">
                            <img src={system} alt="img"/>
                            <img src={table} alt="img"/>
                        </div>
                        <Logo/>
                    </div>
                )}
            </Receiver>
        );
    }
}

export default CompanyProfile;