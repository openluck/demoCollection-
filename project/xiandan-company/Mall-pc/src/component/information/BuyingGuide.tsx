import React,{Component} from 'react';
import '../../sass/information/BuyingGuide.scss';
import {I18nReceiver as Receiver, I18nLocalBuyingGuide} from '../../i18n';
import step from '../../assets/images/step.jpg';
import login from '../../assets/images/login.jpg';

interface BuyingGuideProps {

}
interface  BuyingGuideState {

}

class BuyingGuide extends Component <BuyingGuideProps, BuyingGuideState>{
    constructor(props:any) {
        super(props);
        this.state = {

        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="BuyingGuide">
                {(i18n:I18nLocalBuyingGuide) => (
                    <div className="buying-guide">
                        <div className="buying-title">{i18n.title}</div>
                        <div className="login model">
                            <img src={step} alt="img" className="step-img"/>
                            <div className="title">
                                <span className="title-number">1</span>
                                {i18n.loginTitle}
                            </div>
                            <div className="step">
                                {i18n.loginStep.map((item,index) => {
                                    return (<p key={index}>{item}</p>)
                                })}
                            </div>
                            <img src={login} alt="img" className="login-img"/>
                        </div>
                        <div className="add model">
                            <div className="title">
                                <span className="title-number">2</span>
                                {i18n.addTitle}
                            </div>
                            <div className="step">
                                {i18n.addStep.map((item,index) => {
                                    return (<p key={index}>{item}</p>)
                                })}
                            </div>
                        </div>
                        <div className="submit model">
                            <div className="title">
                                <span className="title-number">2</span>
                                {i18n.submitTitle}
                            </div>
                            <div className="step">
                                {i18n.submitStep.map((item,index) => {
                                    return (<p key={index}>{item}</p>)
                                })}
                            </div>
                        </div>
                        <div className="pay model">
                            <div className="title">
                                <span className="title-number">2</span>
                                {i18n.payTitle}
                            </div>
                            <div className="step">
                                {i18n.payStep.map((item,index) => {
                                    return (<p key={index}>{item}</p>)
                                })}
                            </div>
                        </div>
                        <div className="look model">
                            <div className="title">
                                <span className="title-number">2</span>
                                {i18n.lookTitle}
                            </div>
                            <div className="step">
                                {i18n.lookStep.map((item,index) => {
                                    return (<p key={index}>{item}</p>)
                                })}
                            </div>
                        </div>
                        <div className="status model">
                            <div className="title">
                                <span className="title-number">2</span>
                                {i18n.statusTitle}
                            </div>
                            <div className="step">
                                {i18n.statusStep.map((item,index) => {
                                    return (<p key={index}>{item}</p>)
                                })}
                            </div>
                        </div>
                    </div>
                    )}
            </Receiver>
        )
    }
}

export default BuyingGuide;