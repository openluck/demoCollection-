import React, {Component} from 'react';
import axios from '../../axios';
import '../../sass/index/IndexActive.scss';
import Price from './bannerPeice';

interface ActiveProps {
    history: {
        push: Function,
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
    },
    plate:{
        id:number,
        plate_img:string,
        plate_title:string,
        desc_img: string,
        title: string,
        title_img: string | null,
    },
}

interface ActiveState {
    commodity:[{
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

class IndexActive extends Component<ActiveProps, ActiveState> {
    constructor(props:any) {
        super(props);
        this.state = {
            commodity: [{
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
        }
    }

    componentDidMount(): void {
        axios.get('/api/commodities/all',{params:{id:this.props.plate.id,size:5}})
            .then((res) => {
                this.setState({commodity:res.data.data});
            })
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const activeList = () => {
            this.props.history.push(`/main/activeList/${this.props.plate.id}`,{plate_img:this.props.plate.desc_img});
        }
        return (
            <div className="index-active">
                <div className="active-img">
                    <img src={this.props.plate.plate_img} alt="img"
                         onClick={() => {activeList()}}
                    />
                </div>
                <div className="active-list">
                    {this.state.commodity.map((item,index) => {
                        return (<div className="active-item" key={index}
                            onClick={() => {
                                this.props.history.push(`/main/commodityDetail/${item.id}`)
                            }}
                        >
                            <img src={item.commodity_img} alt="img"/>
                            <div className="item-name">{item.commodity_name}</div>
                            <Price current_price={item.commodity_current_price}
                                   original_price={item.commodity_original_price} size={"normal"}/>
                        </div>)
                    })}
                </div>
            </div>
        )
    }
}

export default IndexActive;