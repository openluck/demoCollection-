import React,{Component} from "react";
import '../../sass/information/LogisticsTracking.scss';
import {I18nReceiver as Receiver, I18nLocalLogisticsTracking} from '../../i18n';

interface LogisticsTrackingProps {

}

interface LogisticsTrackingState {

}

class LogisticsTracking extends Component<LogisticsTrackingProps, LogisticsTrackingState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="LogisticsTracking">
                {(i18n:I18nLocalLogisticsTracking) => (
                    <div className="logistics-tracking">
                        <div className="title">{i18n.title}</div>
                        <div className="info">
                            {i18n.info.map((item,index) => {
                                return (
                                    <div className="info-item" key={index}>
                                        {item}
                                    </div>
                                )
                            })}
                        </div>
                    </div>)}
            </Receiver>
        );
    }
}

export default LogisticsTracking;