import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalAttestation} from '../../i18n';
import '../../sass/information/Attestation.scss';
import attestationImg from '../../assets/images/attestation.png';

interface AttestationProps {

}

interface AttestationState {

}

class Attestation extends Component<AttestationProps, AttestationState> {
    constructor(props:any) {
        super(props);
        this.state = {

        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="Attestation">
                {(i18n:I18nLocalAttestation) => (
                    <div className="attestation">
                        <div className="attestation-title">
                            {i18n.title}
                        </div>
                        <div className="why">
                            <div className="title">{i18n.whyTitle}</div>
                            <div className="desc">{i18n.whyDesc}</div>
                        </div>
                        <div className="how">
                            <div className="title">{i18n.howTitle}</div>
                            <div className="desc">{i18n.howDesc}</div>
                            <img src={attestationImg} alt="img"/>
                        </div>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default Attestation;

