import React, { Component } from 'react';
import '../../sass/commodity/CommodityNone.scss';
import none from '../../assets/images/commodity-none.svg';

interface CommodityNoneProps {
    none: string,

}

interface CommodityNoneState {

}

class CommodityNone extends Component<CommodityNoneProps, CommodityNoneState> {
    constructor(props:any) {
        super(props);
        this.state = {}
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="commodity-none">
                <img src={none} alt="img"/>
                <p>{this.props.none}</p>
            </div>
        )
    }
}

export default CommodityNone;