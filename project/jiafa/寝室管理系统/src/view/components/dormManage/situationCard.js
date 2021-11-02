/*
 * @Author: luolei 
 * @Date: 2021-01-13 13:37:22 
 * @Last Modified by: luolei
 * @Last Modified time: 2021-03-02 16:31:16
 */

import React from "react"
import SVG from "../../public/public-component-svg"

export default function SituationCard({
    name, time, shouldSign, normalSign, notSign, earlySign, lateSign
}) {
    return <div className="ll-situationCard">
        <div className="ll-situationCard-first">
            <div className="ll-bigFont">{name}</div>
            <div className="ll-smallFont">{time ?? "--"}</div>
        </div>
        <div className="ll-situationCard-second">
            <div className="ll-card1">
                <div className="ll-cardText">
                    <span className="ll-bigFont">{shouldSign ?? "--"}</span>
                    <span className="ll-smallFont">人次</span>
                    <div className="ll-smallFont">应签</div>
                </div>
                <div className="ll-cardSVG">
                    <SVG
                        type="qiandaoben"
                        title="签到"
                        width={40}
                        height={40}
                    />
                </div>
            </div>
        </div>
        <div className="ll-situationCard-third">
            <div className="ll-situationCard-third-left">
                <div className="ll-card1"
                    style={{ marginBottom: 10 }}
                >
                    <div className="ll-cardText">
                        <span className="ll-bigFont">{normalSign ?? "--"}</span>
                        <span className="ll-smallFont">人次</span>
                        <div className="ll-smallFont">正常签</div>
                    </div>
                    <div className="ll-cardSVG">
                        <SVG
                            title="签到"
                            type="qiandaoben"
                            width={40}
                            height={40}
                        />
                    </div>
                </div>
                <div className="ll-card1">
                    <div className="ll-cardText">
                        <span className="ll-bigFont">{notSign ?? "--"}</span>
                        <span className="ll-smallFont">人次</span>
                        <div className="ll-smallFont">未签</div>
                    </div>
                    <div className="ll-cardSVG">
                        <SVG
                            title="异常签到"
                            type="yichangqiandao"
                            width={40}
                            height={40} />
                    </div>
                </div>
            </div>
            <div className="ll-situationCard-third-right">
                <div className="ll-error">异常</div>
                <div className="ll-errorbox">
                    <div className="ll-errorText">
                        <div className="ll-cardText">
                            <span className="ll-bigFont">{earlySign ?? "--"}</span>
                            <span className="ll-smallFont">人次</span>
                            <div className="ll-smallFont">早签</div>
                        </div>
                        <div className="ll-cardText" style={{
                            marginTop: 17
                        }}>
                            <span className="ll-bigFont">{lateSign ?? "--"}</span>
                            <span className="ll-smallFont">人次</span>
                            <div className="ll-smallFont">晚签</div>
                        </div>
                    </div>
                    <div className="ll-errorSvg">
                        <div style={{
                            height: 40,
                            width: 40
                        }}>
                            <SVG
                                title="早签"
                                type="zaoqian"
                                width={40}
                                height={40} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}