import React, {Component, lazy} from "react";
import Search from "./common/Search";

import {Route} from 'react-router-dom';


const Home = lazy(() => import('../component/Home'));
const Commodity = lazy(() => import('../component/Commodity'));
const CommodityDetail = lazy(() => import('./commodity/CommodityDetail'));
const ActiveList =lazy(() => import('../component/index/ActiveList'));

interface MainProps {
    history: {
        push: Function,
        replace: Function,
    }
}

interface MainState {

}

class Main extends Component<MainProps, MainState> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                <Search history={this.props.history}/>
                <Route exact path="/main" component={Home}/>
                <Route exact path="/main/commodity" component={Commodity}/>
                <Route exact path="/main/commodityDetail/:id" component={CommodityDetail}/>
                <Route exact path='/main/activeList/:id' component={ActiveList}/>
            </div>
        )
    }
}

export default Main;