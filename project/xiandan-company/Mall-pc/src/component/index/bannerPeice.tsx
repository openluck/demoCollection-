import React, {Component} from 'react';
import '../../sass/index/Tide.scss';
import '../../sass/index/BannerPrice.scss';

interface IndexPriceProps {
    current_price: number,
    original_price: number,
    size:string,
}

interface IndexPriceState {

}

class Price extends Component<IndexPriceProps, IndexPriceState> {
    constructor(props:any) {
        super(props);
        this.state = {
            current_price: 0,
            original_price: 0,
            size: "big",
        };
    }

    componentDidMount(): void {

    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const getPrice = (price:number) => {
            return price.toFixed(2);
        }
        return (

            <div className="recommend-price">
                                <span className="current-price">
                                    <span className="price-icon">&yen;</span>
                                    <span>{getPrice(this.props.current_price)}</span>
                                </span>
                <s className={this.props.size === "big" ? "origin-price-big" : "origin-price-normal"}>
                    <span className="price-icon">&yen;</span>
                    <span>{getPrice(this.props.original_price)}</span>
                </s>
            </div>
        )
    }
}

export default Price;