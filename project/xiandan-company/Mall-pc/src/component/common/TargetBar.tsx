import React, { Component } from 'react';
import {I18nReceiver as Receiver, I18nLocalTargetBar} from '../../i18n';
import {Link} from 'react-router-dom';
import '../../sass/common/TargetBar.scss';


interface TargetBarProps {
    active:string,
}

interface TargetState {

}

class TargetBar extends Component<TargetBarProps,TargetState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="TargetBar">
                {(i18n:I18nLocalTargetBar) => (
                    <div className="target-bar">
                        <Link to={"/"} className={this.props.active === "index" ? "active" : ""}>{i18n.index}</Link>
                        <Link to={"/main/commodity"} className={this.props.active === "all" ? "active" : ""}>{i18n.all}</Link>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default TargetBar;