import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalCustomizeLogistics} from '../../i18n';
import '../../sass/information/CustomizeLogistics.scss';

interface CustomizeLogisticsProps {

}

interface CustomizeLogisticsState {

}

class CustomizeLogistics extends Component<CustomizeLogisticsProps, CustomizeLogisticsState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="CustomizeLogistics">
                {(i18n:I18nLocalCustomizeLogistics) => (
                    <div className="customize-logistics">
                        <div className="title">{i18n.title}</div>
                        <div className="foreword">
                            {i18n.foreword.map((item,index) => {
                                return (<p key={index}>{item}</p>)
                            })}
                        </div>
                        <div className="info">
                            {i18n.info.map((item,index) => {
                                const rules = [];
                                for (let i= 0;i<item.rule.length;i++) {
                                    rules.push(<p key={i}>{item.rule[i]}</p>)
                                }
                                return (
                                    <div key={index}>
                                        <div className="item-title">{item.title}</div>
                                        <div>{rules}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </Receiver>
        );
    }
}

export default CustomizeLogistics;