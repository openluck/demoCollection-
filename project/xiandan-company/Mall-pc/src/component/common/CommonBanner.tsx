import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalSearch} from '../../i18n';
import '../../sass/common/CommonBanner.scss';

interface CommonBannerProps {
    history: {
        replace: Function,
        push: Function,
    }
}

interface CommonBannerState {

}

class CommonBanner extends Component<CommonBannerProps, CommonBannerState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="Search">
                {(i18n:I18nLocalSearch) => (
                    <div className="common-banner">
                        <span className="iconfont iconlogo logo" onClick={() => {this.props.history.push("/main")}}/>
                        <a href={"/main"} className="index">{i18n.index}</a>
                        <a href={"/main/commodity"} className="all">{i18n.all}</a>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default CommonBanner;