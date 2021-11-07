import React, {Component} from 'react';
import axios from '../../axios';
import { Swiper, BlockLoading } from "zent";
import '../../sass/index/IndexCarousel.scss';


interface IndexCarouselProps {
    history:{
        push:Function,
    }
}

interface IndexCarouselState {
    imgList: [{
        img_url: string,
        redirect_url: string,
        title: string,
    }],
    isLoading: boolean,
}

class IndexCarousel extends Component<IndexCarouselProps, IndexCarouselState> {
    constructor(props:any) {
        super(props);
        this.state = {
            imgList: [{
                img_url: "",
                redirect_url: "",
                title: "",
            }],
            isLoading: true,
        }
    }

    componentDidMount(): void {
        axios.get(`/api/banners?type=1`)
            .then((res) => {
                this.setState({imgList: res.data});
                this.setState({isLoading: false});
            })
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="carousel">
                <BlockLoading loading={this.state.isLoading} icon="circle"  iconSize={64} iconText="loading..."
                              className="loading"
                />
                <Swiper
                    transitionDuration={1000}
                    dotsColor="#333333"
                    dotsSize="normal"
                    arrows
                    autoplay
                    className="index-carousel"
                >
                    {
                        this.state.imgList.map((item, index) => {
                            return <div key={index} className="carousel-item">
                                <img src={item.img_url} alt="#"/>
                            </div>
                        })
                    }
                </Swiper>
            </div>
        )
    }
}

export default IndexCarousel;