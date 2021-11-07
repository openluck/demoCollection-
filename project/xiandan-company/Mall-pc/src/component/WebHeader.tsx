import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalWebHeader} from '../i18n';
import '../sass/WebHeader.scss';

interface WebHeaderProps {
    
}

interface WebHeaderState {
    needFixed: boolean,
}

class WebHeader extends Component<WebHeaderProps,WebHeaderState> {
    constructor(props:any) {
        super(props);
        this.state= {
            needFixed: false,
        }
    }

    componentDidMount(): void {
        //  创建监听页面中的滚动高度，如果页面的offsetTop大于header的高度则将header固定；
        const header = document.getElementById("header");
        if(header) {
            // ts需要判断是否有获取到元素，不做判断直接调用元素的属性则被视为有风险，不允许执行
            const fixedTop = header.offsetHeight;
            window.onscroll = () => {
                let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                if (scrollTop >= fixedTop) {
                    this.setState({ needFixed: true })
                } else if (scrollTop < fixedTop) {
                    this.setState({ needFixed: false })
                }
            }
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        return (
            <Receiver componentName="WebHeader">
                {
                    (i18n: I18nLocalWebHeader) => (
                        <div className={this.state.needFixed ? 'fixed-header' : 'web-header'}
                             id="header"
                        >
                            <div>{i18n.title}</div>
                            <div className='right-bar'>
                                {/*<span>{i18n.nav[1]}</span>*/}
                                <a href="/information">{i18n.nav[2]}</a>
                                {/*<span>{i18n.nav[3]}</span>*/}
                                <a href="/companyresume">{i18n.nav[4]}</a>
                                <a href='/information/notification'>{i18n.nav[5]}</a>
                                {/*<span>{i18n.nav[6]}</span>*/}
                            </div>
                        </div>)
                }
            </Receiver>
        )
    }
}

export default WebHeader;