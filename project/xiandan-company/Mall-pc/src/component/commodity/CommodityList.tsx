import React, {Component} from "react";
import {I18nReceiver as Receiver, I18nLocalCommodityList} from '../../i18n';
import '../../sass/commodity/CommodityList.scss';

// 父类props
interface CommodityProps{
    commodityList:[{
        id:number,
        commodity_current_price:number,
        commodity_img:string,
        commodity_name:string,
        commodity_number:string,
        commodity_original_price:number,
        commodity_stock_number:number,
        commodity_country:string,
        source:string,
    }],
    history:{
        push:Function,
        replace:Function,
    },

}

// 父类state
interface CommodityState{

}

class CommodityList extends Component<CommodityProps, CommodityState > {
    constructor(props:any) {
        super(props);
        this.state = {

        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        // 商品列表
        const getCommodityList = (list: any[], sellCount: string, source:string[]) => {
            const commodityList = [];
            for (let i = 0; i < list.length; i++) {
                commodityList.push(
                    <div className={i % 5 === 0 ? 'commodity-item0' : 'commodity-item'} key={i}
                        onClick={() => {
                            this.props.history.push(`/main/commodityDetail/${list[i].id}`)
                        }}
                    >
                        <img src={list[i].commodity_img} alt="" className="commodity-img"/>
                        <div className="commodity-source">
                            {source[list[i].source]}
                        </div>
                        <div className="commodity-price">
                            <span className="current-price">&yen;{list[i].commodity_current_price}</span>
                            <s className="original-price">&yen;{list[i].commodity_original_price}</s>
                        </div>
                        <div className="commodity-name">{list[i].commodity_name}</div>
                        <div className="sell-count">{list[i].commodity_sold_number}{sellCount}</div>
                    </div>
                )
            }
            return commodityList;
        }

        return (
            <Receiver componentName="CommodityList">
                {(i18n:I18nLocalCommodityList) => (
                    <div className="commodity-list">
                        {getCommodityList(this.props.commodityList,i18n.sellCount,i18n.source)}
                    </div>
                )}
            </Receiver>
        );
    }
}

export default CommodityList;