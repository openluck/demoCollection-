import React, {Component} from 'react';
import '../../sass/information/ServiceAgreement.scss';
import {I18nReceiver as Receiver, I18nLocalServiceAgreement} from '../../i18n';
import Logo from './Logo';

interface ServiceAgreementProps {

}

interface ServiceAgreementState {

}

class ServiceAgreement extends Component<ServiceAgreementProps, ServiceAgreementState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="ServiceAgreement">
                {(i18n:I18nLocalServiceAgreement) => (
                    <div className="service">
                        <div className="service-title title">{i18n.title}</div>
                        <div className="service-info">
                            {i18n.info.map((item,index) => {
                                return (
                                    <p className="info-item" key={index}>{item}</p>
                                )
                            })}
                        </div>
                        <div className="title">{i18n.mallTitle}</div>
                        <p>{i18n.mallInfo}</p>
                        <div className="title">{i18n.normTitle}</div>
                        <div>
                            {i18n.normInfo.map((item,index) => {
                                return (
                                    <p className="info-item" key={index}>{item}</p>
                                )
                            })}
                        </div>
                        <div className="title">{i18n.useTitle}</div>
                        <div>
                            {i18n.useInfo.map((item,index) => {
                                return (
                                    <p className="info-item" key={index}>{item}</p>
                                )
                            })}
                        </div>
                        <div className="title">{i18n.otherTitle}</div>
                        <div>
                            {i18n.otherInfo.map((item,index) => {
                                return (
                                    <p className="info-item" key={index}>{item}</p>
                                )
                            })}
                        </div>
                        <Logo/>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default ServiceAgreement;