import React, {Component} from 'react'
import axious from "../../axios";
import '../../sass/index/IndexRecommend.scss';
import Price from './bannerPeice';

interface IndexRecommendProps {
    history:{
        push:Function,
    },
    recommendText: string,
}

interface IndexRecommendState {
    recommend:[{
        id: number,
        commodity_current_price: number,
        commodity_img: string,
        commodity_name: string,
        commodity_number: number,
        commodity_original_price: number,
        commodity_stock_number: number,
        commodity_country: string,
        source: string,
    }]
}

class IndexRecommend extends Component<IndexRecommendProps, IndexRecommendState> {
    constructor(props:any) {
        super(props);
        this.state = {
            recommend: [{
                id:0,
                commodity_current_price: 0,
                commodity_img: "",
                commodity_name: "",
                commodity_number: 0,
                commodity_original_price: 0,
                commodity_stock_number: 0,
                commodity_country: "",
                source: "",
            }]
        };
    }

    componentDidMount(): void {
        axious.get("/api/commodities/RECOMMEND",{params:{size:10}})
            .then((res) => {
                this.setState({recommend: res.data.data});
            })
    }



    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        const toDetail = (id:number) => {
            this.props.history.push(`/main/commodityDetail/${id}`)
        }

        const getSource = (source:string|number) => {
            if(source === "0" || source === 0) {
                return "现货";
            } else if (source === "1" || source === 1) {
                return "保税";
            } else {
                return "直邮";
            }
        }

        return (
            <div className="recommend-list">
                <div className="title">{this.props.recommendText}</div>
                <div className="recommend">{
                    this.state.recommend.map((item,index) => {
                        return (<div key={index} className="recommend-item"
                                     onClick={() => {toDetail(item.id)}}
                        >
                            <div className="item-img">
                                <img src={item.commodity_img} alt="#"/>
                                <div className="source-icon">{getSource(item.source)}</div>
                            </div>
                            <div className="recommend-name">
                                {item.commodity_name}
                            </div>
                            <Price current_price={item.commodity_current_price}
                                   original_price={item.commodity_original_price} size={"big"}/>
                        </div>)
                    })
                }</div>
            </div>
        )
    }
}

export default IndexRecommend;