import React, {Component, lazy } from "react";
import {Route} from 'react-router-dom';
import CommonBanner from "./common/CommonBanner";
import InformationList from "./information/InformationList";
import '../sass/Information.scss';

const BuyingGuide = lazy(() => import('./information/BuyingGuide'));
const PayWay = lazy(() => import('./information/PayWay'));
const Attestation = lazy(() => import('./information/Attestation'));
const Tariff = lazy(() => import('./information/Tariff'));
const CustomsPolicy =lazy(() => import('./information/CustomsPolicy'));
const Notification = lazy(() => import('./information/Notification'));
const ServiceAgreement = lazy(() => import('./information/ServiceAgreement'));
const Packaging = lazy(() => import('./information/Packaging'));
const Entrust = lazy(() => import('./information/Entrust'));
const CompanyProfile = lazy(() => import('./information/CompanyProfile'));
const LogisticsTracking = lazy(() => import('./information/LogisticsTracking'));
const FreightBase =lazy(() => import('./information/FreightBase'));
const DistributionMode = lazy(() => import('./information/DistributionMode'));
const DistributionService = lazy(() => import('./information/DistributionService'));
const CustomizeLogistics = lazy(() => import('./information/CustomizeLogistics'));
const TaxRate = lazy(() => import('./information/TaxRate'));

interface InformationProps {
    history: {
        replace: Function,
        push: Function,
        location:{
            pathname:string,
        }
    }
}

interface InformationState{
    active:string,
}

class Information extends Component<InformationProps, InformationState> {
    constructor(props:any) {
        super(props);
        this.state = {
            active:"BuyingGuide",
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                <CommonBanner history={this.props.history}/>
                <div className="information-container">
                    <div><InformationList history={this.props.history}/></div>
                    <div className="rout-area">
                        <Route exact path='/information/buyingguide' component={BuyingGuide}/>
                        <Route exact path='/information/attestation' component={Attestation}/>
                        <Route exact path='/information/tariff' component={Tariff}/>
                        <Route exact path='/information' component={CustomsPolicy}/>
                        <Route exact path='/information/notification' component={Notification}/>
                        <Route exact path='/information/serviceagreement' component={ServiceAgreement}/>
                        <Route exact path='/information/packaging' component={Packaging}/>
                        <Route exact path='/information/entrust' component={Entrust}/>
                        <Route exact path='/information/companyprofile' component={CompanyProfile}/>
                        <Route exact path='/information/logisticstracking' component={LogisticsTracking}/>
                        <Route exact path='/information/freightbase' component={FreightBase}/>
                        <Route exact path='/information/distributionmode' component={DistributionMode}/>
                        <Route exact path='/information/distributionservice' component={DistributionService}/>
                        <Route exact path='/information/customizelogistics' component={CustomizeLogistics}/>
                        <Route exact path='/information/taxrate' component={TaxRate}/>
                        <Route exact path='/information/payway' component={PayWay}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Information;