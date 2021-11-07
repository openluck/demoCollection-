import React, {ChangeEvent, Component} from 'react';
import CommodityList from './commodity/CommodityList';
import {I18nReceiver as Receiver, I18nLocalCommodity} from '../i18n';
import '../sass/commodity.scss';
import axios from '../axios';
import { Notify } from 'zent';
import CommodityNone from "./commodity/CommodityNone";
import TargetBar from "./common/TargetBar";

// 父类props
interface CommodityProps {
    location:{},
    history:{
        push:Function,
        replace:Function,
    },
    match:{}
}

// 父类state
interface CommodityState {
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
    }];
    activeCountry: number;
    activeType: number;
    sortWay: string|null;
    topic: number;
    code: number;
    priceFrom: number;
    priceTo: number,
    countries: [{
        name:string,
        code:number,
    }],
    types: [{
        topic_title:string,
        id:number
    }],
    lastPage: number,
    page:number,
}


class Commodity extends Component<CommodityProps, CommodityState> {

    constructor(props: any) {
        super(props);
        this.state = {
            commodityList: [{
                id:0,
                commodity_current_price:0,
                commodity_img:"",
                commodity_name:"",
                commodity_number:"",
                commodity_original_price:0,
                commodity_stock_number:0,
                commodity_country:"",
                source:"",
            }],
            activeCountry: -1,
            activeType: -1,
            sortWay: null,
            topic: 0,
            code: 0,
            priceFrom: 0,
            priceTo: 0,
            countries: [{
                code:0,
                name:""
            }],
            types: [{
                id:0,
                topic_title:""
            }],
            lastPage:1,
            page:1,
        }
    }

    componentDidMount(): void {
        //获取全部商品
        axios.get('/api/commodities/all',{params:{size:20}})
            .then((res) => {
                this.setState({commodityList: res.data.data});
                this.setState({lastPage: res.data.meta.last_page});
            })
        //获取分类列表
        axios.get("/api/topics")
            .then((res)=>{
               this.setState({types:res.data})
            })
        axios.get("/api/countries")
            .then((res)=>{
                this.setState({countries:res.data});
            })
    }



    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        // 获取筛选之后的商品列表
        const getList = (isChangePage:boolean) => {
            const url = "/api/commodities/all";
            const topic = this.state.topic > 0 ? this.state.topic : null;
            const sort = this.state.sortWay;
            const country = this.state.code > 0 ? this.state.code : null;
            const priceTo = this.state.priceTo > 0 ? this.state.priceTo : null;
            const priceFrom = this.state.priceFrom > 0 ? this.state.priceFrom : null;
            const page = isChangePage ? this.state.page : 1;
            if(!isChangePage) {
                this.setState({page:1});
            }
            const params ={
                topic,
                sort,
                country,
                "price-from":priceFrom,
                "price-to":priceTo,
                page,
                size: 20,
            }
            axios.get(url,{params:params}).then((res) => {
                this.setState({commodityList: res.data.data});
                this.setState({lastPage: res.data.meta.last_page});
            })
        }

        // 筛选国家
        const countryCategory = (code: number) => {
            this.setState({code:code},() => {
                getList(false);
            })
        }
        // 筛选商品种类
        const commodityCategory = (id: number, i: number) => {
            this.setState({activeType:i});
            this.setState({topic:id},() => {
                getList(false);
            })
        };
        // 改变排序方式
        const changeSort = (sort: string|null) => {
            this.setState({sortWay: sort},()=>{
                getList(false);
            });
        }
        // 改变价格区间
        const changePriceFrom = (e:ChangeEvent<HTMLInputElement>,warn:string) => {
            const value = e.target.value;
            const  flag = new RegExp("^[0-9]([0-9])*$").test(value);
            if(!flag) {
                if(value.length>0)Notify.warn(warn);
                this.setState({priceFrom:0});
            } else{
                this.setState({priceFrom:parseInt(e.target.value)})
            }
        }
        const changePriceTo = (e:ChangeEvent<HTMLInputElement>,warn:string) => {
            const value = e.target.value;
            const  flag = new RegExp("^[0-9]([0-9])*$").test(value);
            if(!flag) {
                if(value.length>0)Notify.warn(warn);
                this.setState({priceTo:0});
            } else {
                this.setState({priceTo:parseInt(value)});
            }
        }
        // 跳转分页
        const changePage = (i:number) => {
            this.setState({page:i}, () => {
                getList(true);
            })
        }
        // 上一页 下一页
        const onePage = (n:number) => {
            const page = this.state.page + n;
            if(page > 0 && page <= this.state.lastPage) {
                this.setState({page:page}, () => {
                    getList(true);
                })
            }
        }

        // 国家分类栏
        const getFiltrateList = (active: number) => {
            const sortList = [];
            for (let i = 0; i < this.state.countries.length; i++) {
                sortList.push(<div className={this.state.code === this.state.countries[i].code ? "active" : "filtrate-item"} key={i}
                                   onClick={() => {
                                       countryCategory(this.state.countries[i].code);
                                   }}
                >
                    {this.state.countries[i].name}
                </div>)
            }
            return sortList;
        }
        // 商品种类分类栏
        const category = (active: number) => {
            const sortList = [];
            for (let i = 0; i < this.state.types.length; i++) {
                sortList.push(<div className={active === i ? "active" : "filtrate-item"}
                                   key={i}
                                   onClick={() => {
                                       commodityCategory(this.state.types[i].id, i)
                                   }}
                >
                    {this.state.types[i].topic_title}
                </div>)
            }
            return sortList;
        }
        // 分页列表
        const pageList = () => {
            const pages = [];
            for(let i = 1 ; i <= this.state.lastPage ; i++) {
                pages.push(
                    <span className={i === this.state.page ? "active" : "page-item"}
                        onClick={() => {changePage(i)}}
                        key={i}
                    >{i}</span>
                )
            }
            return pages;
        }

        return (
            <Receiver componentName="Commodity">
                {(i18n: I18nLocalCommodity) => (
                    <div>
                        <TargetBar active={"all"}/>
                        <div className="commodity-container">
                            <div className="filtrate-list">
                                <div className="filtrate-title">{i18n.countries}</div>
                                <div className="filtrate-items">
                                    {getFiltrateList(this.state.activeCountry)}
                                </div>
                            </div>
                            <div className="filtrate-list">
                                <div className="filtrate-title">{i18n.types}</div>
                                <div className="filtrate-items">
                                    {category(this.state.activeType)}
                                </div>
                            </div>
                            <div className="sort-list">
                                <div className={this.state.sortWay === null ? "active" : "sort-item"}
                                     onClick={() => {
                                         changeSort(null)
                                     }}
                                >
                                    {i18n.comprehensiveSort}
                                </div>
                                <div className={this.state.sortWay === "priceUp" ? "active" : "sort-item"}
                                     onClick={() => {
                                         changeSort("priceUp")
                                     }}
                                >
                                    {i18n.sortLowest}
                                </div>
                                <div className={this.state.sortWay === "priceDown" ? "active" : "sort-item"}
                                     onClick={() => {
                                         changeSort("priceDown")
                                     }}
                                >
                                    {i18n.sortHighest}
                                </div>
                                <div className="sort-item sort-price">
                                    <input placeholder={i18n.price}
                                           onChange={(e)=>{
                                               changePriceFrom(e,i18n.priceWarn);
                                           }}
                                           value={this.state.priceFrom === 0?"" : this.state.priceFrom}/>
                                    <div></div>
                                    <input placeholder={i18n.price}
                                           onChange={(e)=>{
                                               changePriceTo(e,i18n.priceWarn)
                                           }}
                                           value={this.state.priceTo === 0? "" : this.state.priceTo}/>
                                    <button
                                        onClick={()=>{
                                            getList(false);
                                        }}
                                    >{i18n.sure}</button>
                                </div>
                            </div>
                            <CommodityList commodityList={this.state.commodityList} history={this.props.history}/>
                            {this.state.commodityList.length < 1 ? <CommodityNone none={i18n.commodityNone}/> : ""}
                            <div className="page-list">
                                <span className="pre-item"
                                    onClick={() => {onePage(-1)}}
                                >{i18n.pre}</span>
                                {pageList()}
                                <span className="next-item"
                                    onClick={() => {onePage(1)}}
                                >{i18n.next}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Receiver>
        )
    }
}
export default Commodity;