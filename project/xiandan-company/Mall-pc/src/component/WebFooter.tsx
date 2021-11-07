import React, { Component } from 'react';
import '../sass/WebFooter.scss';
import {I18nReceiver as Receiver, I18nLocalWebFooter} from '../i18n';
import code from '../assets/images/code.jpg';


class WebFooter extends Component {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const getTop = (arr:any[]) => {
            const topBar = [];
            for(let i = 0;i<arr.length;i++) {
                topBar.push(<div className='top-item' key={i}>
                    <div className='left-icon'>{arr[i].icon}</div>
                    <div className='right-text'>
                        <p className='text-title'>{arr[i].title}</p>
                        <p className='right-info'>{arr[i].info}</p>
                    </div>
                </div>)
            }
            return topBar;
        }

        return (
            <Receiver componentName='WebFooter'>
                {(i18n: I18nLocalWebFooter)=>
                    (<div className='web-footer'>
                        <div className='footer-top'>
                            {getTop(i18n.specialty)}
                        </div>
                        <div className='footer-middle'>
                            <div className='right-logo'>
                                <span className='iconfont iconlogo'></span>
                            </div>
                            <div className='link-list'>
                                {i18n.nav.map((item,index) => {
                                        const list = [];
                                        for(let i = 0;i<item.length; i++) {
                                            list.push(
                                                <li className="link-info" key={`${index}${i}`}>
                                                    <a href={item[i].path} key={i}>{item[i].name}</a>
                                                </li>
                                            )
                                        }
                                        return (<ul key={index} className="link-item">
                                            {list}
                                        </ul>)
                                    }
                                )}
                            </div>
                            <div className='right-qr'>
                                <img src={code} alt="img"/>
                                <p>{i18n.code}</p>
                            </div>
                        </div>
                        <div className='footer-bottom'>
                            <p className='bottom-desc'>{i18n.desc}</p>
                            <div className='rule-list'>{
                                i18n.rules.map((item,index) => {
                                    return <a href={item.path} key={index}>{item.name}</a>
                                })
                            }</div>
                            <p>{i18n.companyName}</p>
                        </div>
                    </div>)
                }
            </Receiver>
        )
    }
}

export default WebFooter;