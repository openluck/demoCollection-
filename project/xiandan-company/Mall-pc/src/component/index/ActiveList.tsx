import React, {Component} from "react";
import CommodityList from '../commodity/CommodityList';
import '../../sass/index/ActiveList.scss';
import axios from '../../axios';
import {I18nReceiver as Receiver, I18nLocalCommodity} from '../../i18n';
import {BlockLoading} from "zent";

// 父类props
interface ActiveListProps {
    location:{
        state:{
            plate_img:string
        }
    },
    history:{
        push:Function,
        replace:Function,
    },
    match:{
        params:{
            id:string
        }
    },
}

// 父类state
interface ActiveListState {
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
    sort: string|null;
    lastPage: number,
    page:number,
    total:number,
    isLoading: boolean,
}

class ActiveList extends Component<ActiveListProps, ActiveListState> {
    constructor(props:any) {
        super(props);
        this.state = {
            commodityList:[{
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
            sort: null,
            lastPage: 0,
            page:1,
            total:0,
            isLoading: true,
        }
    }

    componentDidMount(): void {
        window.scrollTo(0, 0);
        axios.get("/api/commodities/all",{params:{category_id:this.props.match.params.id,size:30}})
            .then((res) => {
                this.setState({commodityList:res.data.data});
                this.setState({lastPage:res.data.meta.last_page});
                this.setState({total:res.data.meta.total});
                this.setState({isLoading: false});
            })
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const getCommodityList = () => {
            const url = "/api/commodities/all";
            const sort = this.state.sort;
            const page = this.state.page;
            const category_id = this.props.match.params.id;
            const params ={
                category_id,
                sort,
                page,
                size: 30,
            }
            axios.get(url,{params:params}).then((res) => {
                this.setState({commodityList: res.data.data});
                this.setState({lastPage: res.data.meta.last_page});
            })
        }
        // 改变排序方式
        const changeSort = (sort: string|null) => {
            this.setState({sort: sort},()=>{
                getCommodityList();
            });
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
        return (
            <Receiver componentName="Commodity">
                {(i18n:I18nLocalCommodity) => (
                    <div className="active-container">
                        <BlockLoading loading={this.state.isLoading} icon="circle"  iconSize={64} iconText="loading..."
                                      className="loading"
                        />
                        <div className="target-bar">
                            {this.state.total === 0 ? i18n.none : i18n.result1+this.state.total+i18n.result2}
                        </div>
                        <div className="active-img">
                            <img src={this.props.location.state.plate_img} alt={"img"}/>
                        </div>
                        <div className="active-list">
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
                            <CommodityList commodityList={this.state.commodityList} history={this.props.history}/>
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

export default ActiveList;