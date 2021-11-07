import React, {Component} from 'react';
import {I18nReceiver as Receiver, I18nLocalPlatform} from '../../i18n';
import CommonBanner from "../common/CommonBanner";
import '../../sass/company/Platform.scss';
import {Radio,Upload,Sweetalert,Notify} from'zent';

interface PlatformProps {
    history: {
        push: Function,
        replace: Function,
    }
}

interface PlatformState {
    licenseImg: string,
    fileList:any[],
    person: string,
    phone: string,
    email: string,
    scoped: string,
    sellNumber: string,
    sellTotal:string,
    isECommerce: boolean,

}

class Platform extends Component<PlatformProps, PlatformState> {
    constructor(props:any) {
        super(props);
        this.state = {
            isECommerce: true,
            licenseImg: "",
            fileList:[],
            person: "",
            phone: "",
            email: "",
            scoped: "",
            sellNumber: "",
            sellTotal:"",
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const RadioGroup = Radio.Group;
        const {fileList} =this.state;
        //是否为跨境电商
        const changeECommerce = (value:any) => {
            this.setState({isECommerce: value});
        }
        // 触发input选择图片事件
        const chooseImg = () => {
            const input = document.getElementsByClassName("img-input")[0];
            input.dispatchEvent(new MouseEvent('click'));
        }
        // 联系人
        const changePerson = (value:string) => {
            this.setState({person:value});
        }
        // 联系电话
        const changePhone = (value:string) => {
            const reg = /^1[3456789]\d{9}$/;
            if(!reg.test(value)) {
                Notify.warn("手机号有误");
                this.setState({phone:""})
            } else {
                this.setState({phone:value});
            }
        }
        // 邮箱
        const changeEmail = (value:string) => {
            const reg =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            if(!reg.test(value)) {
                Notify.warn("邮箱格式有误");
            } else {
                this.setState({email:value});
            }
        }
        //主营项目
        const changeScoped = (value:string) =>{
            this.setState({scoped:value})
        }
        //sku数目
        const changeNumber = (value:string) => {
            const reg = /^[1-9]([0-9])*$/;
            if(!reg.test(value)) {
                Notify.warn("请输入正整数");
            } else {
                this.setState({sellNumber:value});
            }
        }
        //预计销售额
        const changeTotal = (value:string) => {
            const reg = /^[1-9]([0-9])*$/;
            if(!reg.test(value)) {
                Notify.warn("请输入正整数");
            } else {
                this.setState({sellTotal:value});
            }
        }
        //提交申请
        const submitPlatform = (i18n:{photo: string,person: string,phone: string,email: string,scope: string,sellNumber: string,
            sellTotal: string,uploadText: string,succeed: string,after: string,please: string,}) => {
            if (this.state.licenseImg === "") {
                Notify.warn(i18n.photo);
                return;
            }
            if(this.state.person === "") {
                Notify.warn(i18n.please + i18n.person);
                return;
            }
            if(this.state.phone === "") {
                Notify.warn(i18n.please + i18n.phone);
                return;
            }
            if(this.state.email === "") {
                Notify.warn(i18n.please + i18n.email);
                return;
            }
            if(this.state.scoped === "") {
                Notify.warn(i18n.please + i18n.scope);
                return;
            }
            if (this.state.sellNumber === "") {
                Notify.warn(i18n.please + i18n.sellNumber);
                return;
            }
            if(this.state.sellTotal === "") {
                Notify.warn(i18n.please + i18n.sellTotal);
                return;
            }
            if(this.state.isECommerce && this.state.fileList.length === 0) {
                Notify.warn(i18n.uploadText);
                return;
            }
            Sweetalert.alert({
                closeBtn:true,
                content:<div className="alert-text">
                    <p className="succeed-text">{i18n.succeed}</p>
                    <p>{i18n.after}</p>
                </div>,
                onConfirm: () =>{
                    this.props.history.replace("/main");
                }
            })
        }
        return (
            <Receiver componentName="Platform">
                {(i18n:I18nLocalPlatform) => (
                    <div>
                        <CommonBanner history={this.props.history}/>
                        <div className="platform">
                            <div className="platform-name">
                                <p>{i18n.name}</p>
                            </div>
                            <div className="platform-container">
                                <p className="platform-title">{i18n.title}</p>
                                <input type="file" accept="image/*"
                                       className="img-input"
                                       onChange={(e) => {
                                           if (!e.target.files) {
                                           } else {
                                               if (e.target.files[0]) {
                                                   const img = window.URL.createObjectURL(e.target.files[0]);
                                                   this.setState({licenseImg: img});
                                               }
                                           }
                                       }}
                                />
                                <div className="upload-license">{
                                    this.state.licenseImg === "" ?
                                        <div className="no-img">
                                            <span className="iconfont iconUpload upload-icon"
                                                  onClick={() => {chooseImg()}}/>
                                            <p>{i18n.photo}</p>
                                        </div> :
                                        <img src={this.state.licenseImg} alt="img" onClick={() =>{chooseImg()}}/>
                                }</div>
                                <div className="contacts-info">
                                    <input type="text" placeholder={i18n.person}
                                        onBlur={(e) => {changePerson(e.target.value)}}
                                    />
                                    <input type="text" placeholder={i18n.phone}
                                        onBlur={(e) => {changePhone(e.target.value)}}
                                    />
                                </div>
                                <input type="text" placeholder={i18n.email} className="contact-email"
                                    onBlur={(e)=>{changeEmail(e.target.value)}}
                                />
                                <textarea placeholder={i18n.scope} className="company-scope"
                                          onChange={(e)=>{changeScoped(e.target.value)}}/>
                                <p className="sell-title">{i18n.sellTitle}</p>
                                <div className="company-info">
                                    <input type="text" placeholder={i18n.sellNumber}
                                        onBlur={(e)=>{changeNumber(e.target.value)}}
                                    />
                                    <input type="text" placeholder={i18n.sellTotal}
                                        onBlur={(e)=>{changeTotal(e.target.value)}}
                                    />
                                </div>
                                <div className="choose-type">
                                    <span className="title">{i18n.isECommerce}</span>
                                    <RadioGroup className="check-radio" value={this.state.isECommerce}
                                                onChange={(e) =>{changeECommerce(e.target.value)}}>
                                        <Radio value={true} className="yes">
                                            {i18n.yes}
                                        </Radio>
                                        <Radio value={false} className="no">
                                            {i18n.no}
                                        </Radio>
                                    </RadioGroup>
                                    <span className="upload-reminder">
                                        {this.state.isECommerce ? i18n.upload : ""}
                                    </span>
                                </div>
                                <div className="cross-border">
                                    {this.state.isECommerce ? <Upload
                                        className="license-img"
                                        fileList={fileList}
                                        maxAmount={1}
                                        multiple
                                        sortable
                                        manualUpload
                                        tips={i18n.uploadText}
                                        onChange={(files, detail) => {
                                            this.setState({
                                                fileList: files,
                                            });
                                        }}
                                    /> : ""}
                                </div>
                                <button className="submit-platform"
                                    onClick={() => {submitPlatform(i18n)}}
                                >{i18n.submit}</button>
                            </div>
                        </div>
                    </div>
                )}
            </Receiver>
        )
    }
}

export default Platform;