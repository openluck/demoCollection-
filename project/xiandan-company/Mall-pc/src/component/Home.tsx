import React, { Component } from 'react';
import {I18nReceiver as Receiver, I18nLocalHome} from '../i18n';
import IndexCarousel from './index/IndexCarousel';
import IndexBanner from "./index/IndexBanner";
import IndexRecommend from "./index/IndexRecommend";
import End from "./common/End";
import TargetBar from "./common/TargetBar";


interface HomeProps {
    history:{
        push:Function
    }
}

interface HomeState {

}

class Home extends Component<HomeProps,HomeState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }
    componentDidMount(): void {
        window.scrollTo(0, 0);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="Home">
                {(i18n:I18nLocalHome) => (
                    <div>
                        <TargetBar active={"index"}/>
                        <IndexCarousel history={this.props.history}/>
                        <IndexBanner history={this.props.history} text={i18n}/>
                        <IndexRecommend history={this.props.history} recommendText={i18n.recommend}/>
                        <End text={i18n.end}/>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default Home;