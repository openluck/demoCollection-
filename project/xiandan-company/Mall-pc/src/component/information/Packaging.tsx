import React, {Component} from 'react';
import '../../sass/information/Packaging.scss';
import {I18nReceiver as Receiver, I18nLocalPackaging} from '../../i18n';
import Logo from './Logo';

interface PackagingProps {

}

interface PackagingState {

}

class Packaging extends Component<PackagingProps, PackagingState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="Packaging">
                {(i18n:I18nLocalPackaging) => (<div className="packaging">
                    <div className="title">
                        {i18n.title}
                    </div>
                    <div className="info">
                        {i18n.info.map((item,index) => {
                            return (<p className="info-item" key={index}>
                                {item}
                            </p>)
                        })}
                    </div>
                    <Logo/>
                </div>)}
            </Receiver>
        )
    }
}

export default Packaging;