import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalTariff} from '../../i18n';
import '../../sass/information/Tariff.scss';

interface TariffProps {

}

interface TariffState {

}

class Tariff extends Component<TariffProps, TariffState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName='Tariff'>
                {(i18n:I18nLocalTariff) => (
                    <div className="tariff">
                        <div className="title">{i18n.titleTariff}</div>
                        <div className="tariff-info">
                            {i18n.info.map((item,index) => {
                                return (
                                    <div className="info-item" key={index}>
                                        <div className="item-title">{item.title}</div>
                                        <p className="item-info">{item.info}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default Tariff;