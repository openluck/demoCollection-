import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalPayWay} from '../../i18n';
import '../../sass/information/PayWay.scss';

interface PayWayProps {

}

interface PayWayState {

}

class PayWay extends Component<PayWayProps, PayWayState> {
    constructor(props:any) {
        super(props);
        this.state = {

        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="PayWay">
                {(i18n:I18nLocalPayWay) => (
                    <div className="pay-way">
                        <div className="title">
                            {i18n.title}
                        </div>
                        <div className="pay-way">
                            <div className="way-title">{i18n.payWayTile}</div>
                            <div className="way">{i18n.payWay}</div>
                        </div>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default PayWay;