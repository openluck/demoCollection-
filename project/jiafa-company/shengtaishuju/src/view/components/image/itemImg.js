/*
 * @Author: wangsong 
 * @Date: 2020-02-26 10:10:12 
 * @Last Modified by:   wangsong 
 * @Last Modified time: 2020-02-26 10:10:12 
 * 画像中心块容器组件
 */
import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
class ItemImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params:{},
            loadNum:0
        };
    }
    componentWillReceiveProps(props){
        //条件改变
        if(Object.getOwnPropertyNames(props.params).length && JSON.stringify(props.params) !== JSON.stringify(this.state.params)){
            this.setState({
                params:props.params,
                loadNum:this.state.loadNum + 1
            });
        };
    }
    
    render() {
        let { id,className,title,height,children } = this.props;
        let { params,loadNum } = this.state;
        return (
            <div className={`ws-itemImg ${className ? className : ""}`} id={id} style={{ height }}>
                <div className="ws-img-header"><span>{title}</span></div>
                <LazyLoad 
                key={id + loadNum}
                height={height} 
                overflow={true} 
                debounce={false} //检查功能仅在用户停止滚动后才触发
                throttle={50}   //防止由于scroll事件的持续触发而导致性能问题，在用户滚动时设置较小的超时，进行节流直到用户停止。默认值是250毫秒
                once={true} 
                offset={300}
                // offset={height / 2} //预加载-距离xx像素才加载下一个组件
                placeholder={
                    <div style={{height : `calc(${height}px - 60px)`}} className="ws-img-placeholder">
                        <img src={require("../../../media/picture/img_load.png")} />
                    </div>
                }>
                    {children}
                </LazyLoad>
            </div>
        );
    }
}

export default ItemImg;
