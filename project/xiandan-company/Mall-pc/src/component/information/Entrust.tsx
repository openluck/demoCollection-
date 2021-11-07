import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalEntrust} from '../../i18n';
import '../../sass/information/Entrust.scss';
import Logo from './Logo';

interface EntrustProps {

}

interface EntrustState {

}

class Entrust extends Component<EntrustProps, EntrustState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="Entrust">
                {(i18n:I18nLocalEntrust) => (
                    <div className="entrust">
                        <div className="title">{i18n.title}</div>
                        <p className="info">{i18n.info}</p>
                        <Logo/>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default Entrust;