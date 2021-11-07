import React, {Component} from 'react';
import CommodityList from "./commodity/CommodityList";
import CommodityNone from "./commodity/CommodityNone";
import axios from '../axios';
import '../sass/SearchResult.scss';
import {I18nReceiver as Receiver, I18nLocalCommodity} from '../i18n';
import {BlockLoading} from "zent";

// 父类props
interface CommodityProps{
    history:{
        push:Function,
        replace:Function,
    },
    match:{
        params:{
            keys:string
        }
    },
    location:{
        state:{}
    }
}
// 父类state
interface CommodityState{
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
    lastPage: number,
    page: number,
    sort: null|string,
    searchCount:number|null,
    keys:string,
    total:number,
    isLoading: boolean,
}


class SearchResult extends Component<CommodityProps, CommodityState> {
    constructor(props:any) {
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
            lastPage: 0,
            page:1,
            sort: null,
            searchCount:null,
            keys:"",
            total:0,
            isLoading: true,
        }
    }

    componentDidMount(): void {
        window.scrollTo(0, 0);
        this.setState({keys:this.props.match.params.keys});
        const params = {
            keys: this.props.match.params.keys,
            size: 30,
        }
        axios.get("/api/commodities/search", {params: params})
            .then((res) => {
                this.setState({commodityList:res.data.data});
                this.setState({lastPage:res.data.meta.last_page});
                this.setState({total:res.data.meta.total});
                this.setState({isLoading: false});
            })
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        // 获取数据
        const getCommodityList = () => {
            if(this.state.keys !== "") {
                this.setState({isLoading: true});
                const keys = this.state.keys;
                const params = {
                    sort: this.state.sort,
                    keys: keys,
                    page: this.state.page,
                    size: 30,
                }
                axios.get("/api/commodities/search", {params: params})
                    .then((res) => {
                        this.setState({commodityList:res.data.data});
                        this.setState({lastPage:res.data.meta.last_page});
                        this.setState({total:res.data.meta.total});
                        this.setState({isLoading: false});
                    })
            }
        }

        // 改变搜索关键字
        const getKeys = (value:string) => {
            this.setState({keys:value})
        }
        // 跳转搜索结果
        const getSearchList = () => {
            if(this.state.keys !== "") {
                getCommodityList();
            }
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

        // 跳转分页
        const changePage = (i:number) => {
            this.setState({page:i}, () => {
                getCommodityList();
            })
        }
        // 上一页 下一页
        const onePage = (n:number) => {
            const page = this.state.page + n;
            if(page > 0 && page <= this.state.lastPage) {
                this.setState({page:page}, () => {
                    getCommodityList();
                })
            }
        }

        // 改变排序方式
        const changeSort = (sort: string|null) => {
            this.setState({sort: sort},()=>{
                getCommodityList();
            });
        }

        return (
            <Receiver componentName="Commodity">
                {(i18n:I18nLocalCommodity) => (
                    <div className="search-result">
                        <div className='search'>
                            <div className='search-result-area'>
                            <span className='iconfont iconlogo' onClick={() => {
                                this.props.history.replace("/main")
                            }}/>
                                <div className='search-result-input'>
                                    <input type='text'
                                           value={this.state.keys}
                                           onChange={(e) => {getKeys(e.target.value)}}
                                           onKeyPress={(e) => {
                                               if(e.charCode === 13){
                                                   getSearchList()
                                               }
                                           }}
                                    />
                                    <button onClick={() => {getSearchList()}}>{i18n.search}</button>
                                </div>
                                {/*一期暂时隐藏加入购物车图标*/}
                                {/*<button className='to-cart'>*/}
                                {/*    <span className='iconfont iconcart'/>*/}
                                {/*    <span>{i18n.cart}</span>*/}
                                {/*</button>*/}
                            </div>
                        </div>
                        <BlockLoading loading={this.state.isLoading} icon="circle"  iconSize={64} iconText="loading..."
                                      className="loading"
                        />
                        <div className="target-bar">
                            {this.state.total === 0 ? i18n.none :
                                i18n.result1+this.state.total+i18n.result2}
                        </div>
                        <div className="sort-list">
                            <div className={this.state.sort === null ? "active" : "sort-item"}
                                 onClick={() => {
                                     changeSort(null)
                                 }}
                            >
                                {i18n.comprehensiveSort}
                            </div>
                            <div className={this.state.sort === "priceUp" ? "active" : "sort-item"}
                                 onClick={() => {
                                     changeSort("priceUp")
                                 }}
                            >
                                {i18n.sortLowest}
                            </div>
                            <div className={this.state.sort === "priceDown" ? "active" : "sort-item"}
                                 onClick={() => {
                                     changeSort("priceDown")
                                 }}
                            >
                                {i18n.sortHighest}
                            </div>
                        </div>
                        {this.state.commodityList.length < 1 ? <CommodityNone none={i18n.searchNone}/> :
                            <CommodityList commodityList={this.state.commodityList}
                                           history={this.props.history}/>}
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
                )}
            </Receiver>
        );
    }
}

export default SearchResult;