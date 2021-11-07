import React, {Component} from 'react';
import axios from '../../axios';
import '../../sass/index/Tide.scss';
import Price from './bannerPeice';

interface IndexTideProps {
    history:{
        push:Function,
    },
    plate:{
        id:number,
        plate_img:string,
        plate_title:string,
        desc_img: string,
        title: string,
        title_img: string | null,
    },
    text:{
        tide: string,
        optimization: string,
        more: string,
        discountProduct: string,
        hotSell: string,
        recommend: string,
        activity:string,
        activeTitle: string,
        end: string,
    }
}

interface IndexTideState {
    tide:[{
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

class Tide extends Component<IndexTideProps, IndexTideState> {
    constructor(props:any) {
        super(props);
        this.state = {
            tide: [{
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
        axios.get(`/api/commodities/all`,{params:{category_id:this.props.plate.id,size:6}})
            .then((res) => {
                this.setState({tide:res.data.data});
            })

    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        const toDetail = (id:number) => {
            this.props.history.push(`/main/commodityDetail/${id}`)
        }

        return (
            <div className="tide">
                <div className="title-bar">
                    {this.props.plate.title_img ?
                        <img className="title-img" src={this.props.plate.title_img} alt="img"/>:
                        <div className="title">{this.props.text.optimization}</div>
                    }
                    <div className="more"
                        onClick={() => {
                            this.props.history.push(`/main/activeList/${this.props.plate.id}`,{plate_img:this.props.plate.desc_img});
                        }}
                    >{this.props.text.more}</div>
                </div>
                <div className="tide-list">
                    {this.state.tide.map((item,index) => {
                        return (
                            <div className="tide-item" key={index}
                                 onClick={() => {toDetail(item.id)}}
                            >
                                <img src={item.commodity_img} alt="#" className="item-img"/>
                                <div className="item-name">{item.commodity_name}</div>
                                <Price current_price={item.commodity_current_price}
                                       original_price={item.commodity_original_price} size={"normal"}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Tide;