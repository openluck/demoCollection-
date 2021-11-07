import React, {Component} from 'react';
import QRCode from 'qrcode.react';
import {I18nReceiver as Receiver, I18nLocalCommodityDetail} from '../../i18n';
import "../../sass/CommodityDetail.scss";
import axios from '../../axios';
import { Notify, Sweetalert, BlockLoading } from 'zent';

// 父类props
interface CommodityProps{
    location:object,
    match:{
        params:{
            id:string
        }
    },
    history:object,
}
// 父类state
interface CommodityState{
    commodity:{
        commodity_base_info:string,
        commodity_country:string,
        commodity_country_icon:string,
        commodity_country_name:string,
        commodity_current_price:number,
        commodity_detail_info: string,
        commodity_img:string,
        commodity_name:string,
        commodity_number:string,
        commodity_original_price:number,
        commodity_sold_number:number,
        commodity_spec:string,
        commodity_stock_number:number,
        commodity_tax_rate:number,
        discount_end:null|string,
        id:number,
        is_collected:number,
        is_discount:boolean,
        source:number,
        warehouse:string,
    },
    sellCount:number,
    imgList: string[],
    activeImg: number,
    isLoading: boolean,
}

class CommodityDetail extends Component<CommodityProps, CommodityState > {
    constructor(props: any) {
        super(props);
        this.state = {
            commodity:{
                commodity_base_info:"",
                commodity_country:"",
                commodity_country_icon:"",
                commodity_country_name:"",
                commodity_current_price:0,
                commodity_detail_info:"",
                commodity_img:"",
                commodity_name:"",
                commodity_number:"",
                commodity_original_price:0,
                commodity_sold_number:0,
                commodity_spec:"",
                commodity_stock_number:0,
                commodity_tax_rate:0,
                discount_end:null,
                id:0,
                is_collected:0,
                is_discount:false,
                source:1,
                warehouse:"",
            },
            sellCount: 1,
            imgList: [],
            activeImg: 0,
            isLoading: true,
        }
    }

    componentDidMount(): void {
        // 保证以history方法从其他路由跳转至详情页之后，依然处于页面顶部
        window.scrollTo(0, 0);
        const id = this.props.match.params.id;
        axios.get(`/api/commodity/${id}`)
            .then((res)=>{
                this.setState({commodity:res.data.message},() => {
                    const imgList = [
                        this.state.commodity.commodity_img,
                        this.state.commodity.commodity_img,
                        this.state.commodity.commodity_img,
                        this.state.commodity.commodity_img,
                    ]
                    this.setState({imgList:imgList});
                    this.setState({isLoading: false});
                });
            });
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        // 修改商品数量
        const addSellCount = (n:number) => {
            this.setState({sellCount:this.state.sellCount + n});
        }
        const changeSellCount = (value:string,warnInt:string,warnMost:string) => {
            const  flag = new RegExp("^[1-9]([0-9])*$").test(value);
            if(!flag) {
                Notify.warn(warnInt);
                this.setState({sellCount:1})
            } else {
                const count = parseInt(value);
                if(count>this.state.commodity.commodity_stock_number) {
                    Notify.warn(warnMost);
                    this.setState({sellCount:this.state.commodity.commodity_stock_number});
                } else {
                    this.setState({sellCount:count});
                }
            }
        }
        // 收藏&取消收藏
        // const collection = () => {
        //     const id = this.props.match.params.id;
        //     axios.post(`/api/commodity/${id}/collect`)
        //         .then((res)=>{
        //             console.log(res);
        //         })
        // }
        // const disCollection = () => {
        //     const id = this.props.match.params.id;
        //     axios.delete(`/api/commodity/${id}/collect`)
        //         .then((res)=>{
        //             console.log(res);
        //         })
        // }
        //
        const code = () => {
            Sweetalert.alert({
                content:<div className="go-weixin">
                    {/*<img src={codeImg} alt="img"/>*/}
                    <QRCode value={`https://www.xiandanmall.com/mall/${this.props.match.params.id}/commodity`}/>
                    <p>顾客您好，感谢您选择闲蛋商城，目前闲蛋商城PC端购买功能暂未开放，您可以使用手机微信扫描二维码登录闲蛋商城客户端进行购买。祝您购物愉快！</p>
                </div>,
                closeBtn: true,
                maskClosable: true,
                className: "alert-area",
                confirmText: "确定"
            })
        }
        // 改变商品图片
        const changeImg = (n:number) => {
            const number = this.state.activeImg + n;
            if(number >= 0 && number < this.state.imgList.length) {
                this.setState({activeImg:number});
            }
        }

        return (
            <Receiver componentName='CommodityDetail'>
                {(i18n:I18nLocalCommodityDetail)=>(
                    <div className="commodity-detail">
                        <BlockLoading loading={this.state.isLoading} icon="circle"  iconSize={64} iconText="loading..."
                                      className="loading"
                        />
                        <div className="detail-container">
                            <div className="detail-left">
                                <div className="commodity-img">
                                    {this.state.imgList.map((item,index) => {
                                        if(index === this.state.activeImg) {
                                            return<img src={item} alt="img"
                                                       key={index}
                                            />
                                        } else {
                                            return "";
                                        }
                                    })}
                                </div>
                                <div className="img-list">
                                    <span className="icon iconfont iconleft"
                                        onClick={() => {changeImg(-1)}}
                                    />
                                    {this.state.imgList.map((item,index) => {
                                        return (
                                          <img src={item} alt="img" key={index}
                                               className={index === this.state.activeImg ? "active-img" : "img-item"}
                                            onMouseEnter={() => {
                                                this.setState({activeImg:index})
                                            }}
                                          />
                                        )
                                    })}
                                    <span className="icon iconfont iconright"
                                        onClick={() => {changeImg(1)}}
                                    />
                                </div>
                            </div>
                            <div className="commodity-right">
                                <div className="detail-icon">
                                    <div className="country-icon">
                                        <img src={this.state.commodity.commodity_country_icon} alt=""/>
                                    </div>
                                    <span className="warehouse">{this.state.commodity.warehouse}</span>
                                </div>
                                <div className="commodity-name">{this.state.commodity.commodity_name}</div>
                                <div className="price">
                                    <span className="title">{i18n.price}</span>
                                    <span className="sold-price">
                                        &yen;{this.state.commodity.commodity_current_price}
                                    </span>
                                    <s className="original-price">
                                        &yen;{this.state.commodity.commodity_original_price}
                                    </s>
                                </div>
                                <div className="carriage">
                                    <span className="title">{i18n.carriage}</span>
                                    <span className="carriage-info">{i18n.carriageInfo}</span>
                                </div>
                                <div className="count">
                                    <span className="title">{i18n.count}</span>
                                    <div className="steeper">
                                        <button
                                            disabled={this.state.sellCount <= 1}
                                            onClick={() => {addSellCount(-1)}}
                                        >-</button>
                                        <input type="text" value={this.state.sellCount}
                                            onChange={(e) => {
                                                changeSellCount(e.target.value,i18n.warnInt,i18n.warnMost)
                                            }}
                                        />
                                        <button
                                            disabled={this.state.sellCount >= this.state.commodity.commodity_stock_number}
                                            onClick={()=>{addSellCount(1)}}
                                        >+</button>
                                    </div>
                                    {/*一期暂时不做收藏功能*/}
                                    {/*<span className="collection">{i18n.collection}</span>*/}
                                    {/*<span className={this.state.commodity.is_collected === 0 ?*/}
                                    {/*    "iconfont iconcollection uncollection":*/}
                                    {/*    "iconfont iconcollection collectioned"}*/}
                                    {/*    onClick={() => {*/}
                                    {/*        this.state.commodity.is_collected === 0 ? collection() : disCollection()*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*</span>*/}
                                </div>
                                <div className="btn">
                                    <button className="sell-btn" onClick={() => {code()}}>{i18n.sell}</button>
                                    {/*<button className="add-btn" onClick={() => {code()}}>{i18n.add}</button>*/}
                                </div>
                            </div>
                        </div>
                        <div className="img-area">
                            <div className="title">
                                {i18n.detail}
                            </div>
                            {/* 将axios返回的字符串的html代码进行解析 */}
                            <div dangerouslySetInnerHTML={{__html:this.state.commodity.commodity_detail_info}}/>
                        </div>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default CommodityDetail;