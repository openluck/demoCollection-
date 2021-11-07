import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalTariff} from '../../i18n'
import '../../sass/information/CustomsPolicy.scss';
import Logo from './Logo';

interface CustomsPolicyProps {

}

interface CustomsPolicyState {

}

class CustomsPolicy extends Component<CustomsPolicyProps, CustomsPolicyState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName='Tariff'>
                {(i18n:I18nLocalTariff) => (
                    <div className="customs-policy">
                        <div className="title">{i18n.titleCustomsPolicy}</div>
                        <div className="question">{i18n.question}</div>
                        <div className="info">
                            {i18n.info.map((item,index) => {
                                return (<div className="info-item" key={index}>
                                    <div className="item-tile">{item.title}</div>
                                    <p className="item-info">{item.info}</p>
                                </div>)
                            })}
                        </div>
                        <a href="/information/taxRate" className="tips">{i18n.tips}</a>
                        <Logo/>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default CustomsPolicy;