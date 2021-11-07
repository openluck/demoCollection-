import React, {Component} from 'react';
import '../../sass/information/DistributionService.scss';
import {I18nReceiver as Receiver, I18nLocalDistributionService} from '../../i18n';

interface DistributionServiceProps {

}

interface DistributionServiceState {

}

class DistributionService extends Component<DistributionServiceProps, DistributionServiceState>{
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="DistributionService">
                {(i18n:I18nLocalDistributionService) => (
                    <div className="distribution-service">
                        <div className="title">{i18n.title}</div>
                        <div className="info">
                            <div className="item-title">{i18n.serviceName}</div>
                            <div>
                                {i18n.serviceMean.map((item,index) => {
                                    return (
                                        <p key={index}>{item}</p>
                                    )
                                })}
                            </div>
                            <div  className="item-title">{i18n.areaTitle}</div>
                            <div>
                                {i18n.serviceArea.map((item,index) => {
                                    const city = [];
                                    for(let i= 0;i<item.content.length;i++) {
                                        city.push(<div key={i}>{item.content[i]}</div>)
                                    }
                                    return (
                                        <div key={index}>
                                            <div className="item-title">{item.title}</div>
                                            <div>{city}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div  className="item-title">{i18n.other}</div>
                            <div>{i18n.otherInfo}</div>
                        </div>
                    </div>
                 )}
            </Receiver>
        );
    }
}

export default DistributionService;