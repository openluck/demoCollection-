import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalSearch} from '../../i18n';
import '../../sass/common/Search.scss';
import {Link} from 'react-router-dom';
import enter from '../../assets/images/enter.png';

// 父类props
interface CommodityProps{
    history: {
        replace: Function,
        push:Function,
    }
}
// 父类state
interface CommodityState{
    keys:string
}

class Search extends Component<CommodityProps, CommodityState > {
    constructor(props:any) {
        super(props);
        this.state = {
            keys:"",
        }
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        // 改变搜索关键字
        const getKeys = (value:string) => {
            this.setState({keys:value})
        }
        // 跳转搜索结果
        const getResult = () => {
            if(this.state.keys !== "") {
                this.props.history.push(`/searchResult/${this.state.keys}`);
            }
        }

        return (
            <Receiver componentName='Search'>
                {(i18n:I18nLocalSearch) => (
                    <div className='search'>
                        <div className='search-area'>
                            <span className='iconfont iconlogo' onClick={() => {
                                this.props.history.replace("/main")
                            }}/>
                            <div className='search-input'>
                                <input type='text' placeholder={i18n.placeHolder}
                                       onChange={(e) => {getKeys(e.target.value)}}
                                       onKeyPress={(e) => {
                                           if(e.charCode === 13) {
                                               getResult();
                                           }
                                       }}
                                />
                                <button onClick={() => {getResult()}}>{i18n.search}</button>
                            </div>
                            {/*一期暂时没有购物车*/}
                            {/*<button className='to-cart'>*/}
                            {/*    <span className='iconfont iconcart'/>*/}
                            {/*    <span>{i18n.cart}</span>*/}
                            {/*</button>*/}
                            <Link to="/platform">
                                <img src={enter} alt="img" className="enter"/>
                            </Link>
                        </div>
                    </div>
                )}
            </Receiver>
        );
    }
}

export default Search;