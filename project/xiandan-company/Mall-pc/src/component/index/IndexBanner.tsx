import React, {Component} from 'react';
import '../../sass/index/IndexBanner.scss';
import axios from '../../axios';
import Tide from './Tide';
import Optimization from "./Optimization";
import IndexActive from './IndexActive';

interface IndexBannerProps {
    history:{
        push:Function,
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

interface IndexBannerState {
    list:[{
        id:number,
        plate_img:string,
        plate_title:string,
        desc_img: string,
        title: string,
        title_img: string | null,
    }],
}

class IndexBanner extends Component<IndexBannerProps, IndexBannerState> {
    constructor(props:any) {
        super(props);
        this.state = {
            list:[{
                id:0,
                plate_img:"",
                plate_title:"",
                desc_img: "",
                title: "",
                title_img: null,
            }],
        };
    }

    componentDidMount(): void {
        axios.get("/api/plates?type=1")
            .then((res) =>{
                this.setState({list:res.data});
            })
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="index-banner">
                {this.state.list.map((item,index) => {
                    if(index === 0) {
                        return <Tide history={this.props.history} text={this.props.text} key={index} plate={item}/>
                    } if(index === 1) {
                        return <Optimization history={this.props.history}
                                             text={this.props.text} key={index} plate={item}
                        />
                    } else {
                        return <IndexActive history={this.props.history} plate={item}
                                            text={this.props.text} key={index}
                        />
                    }
                })}
                {/*<IndexActive history={this.props.history} text={this.props.text} plate={this.state.list[0]}/>*/}
            </div>
        )
    }
}

export default IndexBanner;