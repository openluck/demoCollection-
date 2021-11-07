import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalTariff} from '../../i18n';
import '../../sass/information/Logo.scss';
import logo from '../../assets/images/xiandan.jpg';

interface LogoProps {

}

interface LogoState {

}

class Logo  extends Component<LogoProps, LogoState>{
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="Tariff">
                {(i18n:I18nLocalTariff) => (
                    <div className="logo">
                        <img src={logo} alt="alt"/>
                        <p>{i18n.focus}</p>
                        <p>{i18n.slogan}</p>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default Logo;

