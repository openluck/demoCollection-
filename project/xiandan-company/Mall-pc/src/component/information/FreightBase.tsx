import React, {Component} from 'react';
import '../../sass/information/FreightBase.scss';
import {I18nReceiver as Receiver, I18nLocalFreightBase} from '../../i18n';

interface FreightBaseProps {

}

interface FreightBaseState {

}

class FreightBase extends Component<FreightBaseProps, FreightBaseState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="FreightBase">
                {(i18n:I18nLocalFreightBase) => (
                    <div className="freight-base">
                        <div className="title">{i18n.title}</div>
                        <div className="info">{
                            i18n.info.map((item,index) => {
                                return (<p key={index}>{item}</p>)
                            })
                        }</div>
                        <div className="announcements">
                            {i18n.announcements.map((item,index) => {
                                return (<p key={index}>{item}</p>)
                            })}
                        </div>
                    </div>
                )}
            </Receiver>
        );
    }
}

export default FreightBase;