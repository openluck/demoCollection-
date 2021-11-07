import React, {Component} from 'react';
import '../../sass/information/Notification.scss';
import {I18nReceiver as Receiver, I18nLocalNotification} from '../../i18n';

import Logo from './Logo';

interface NotificationProps {

}

interface NotificationState {

}

class Notification extends Component<NotificationProps, NotificationState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="Notification">
                {(i18n:I18nLocalNotification) => (
                    <div className="notification">
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
                        <Logo/>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default Notification;