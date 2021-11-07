import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalDistributionMode} from '../../i18n';
import '../../sass/information/DistributionMode.scss';
import distribution from '../../assets/images/distribution.svg';

interface DistributionModeProps {

}

interface DistributionModeState {

}

class DistributionMode extends Component<DistributionModeProps, DistributionModeState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="DistributionMode">
                {(i18n:I18nLocalDistributionMode) => (
                    <div className="distribution-mode">
                        <div className="title">{i18n.title}</div>
                        <div className="distribution">
                            <div>{i18n.bonded}</div>
                            <img src={distribution} alt="img"/>
                        </div>
                        <div className="info">
                            {i18n.info.map((item, index) => {
                                return (
                                    <p key={index} className="item">{item}</p>
                                )
                            })}
                        </div>
                        <div className="announcements">
                            {i18n.announcements.map((item,index) => {
                                return (
                                    <p key={index} className="item">{item}</p>
                                )
                            })}
                        </div>
                    </div>
                )}
            </Receiver>
        );
    }
}

export default DistributionMode;