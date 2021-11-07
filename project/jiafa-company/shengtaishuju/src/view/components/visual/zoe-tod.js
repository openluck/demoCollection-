/*
 * @Author: zoe ღ
 * @Date: 2020-02-18 18:56:24
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-08 15:37:21
 */

import React, { Component } from "react";
import { GaugeEchart } from "../../components/visual/public/tj-common";
import DataPieEcharts from "./../../components/visual/public/DataPieEcharts";
import { connect } from "react-redux";
import { Spin } from "antd";
import G from './../../../config/g'
import SVG from "../../public/svg";
@connect(state => state.zoe_recInfo, {})
class ZoeTod extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      ResTodayMes,
      ResTodayOpen,
      ResTodayEff,
      ResTodayLeisure,
      ResTodayMesLoad,
      ResTodayOpenLoad,
      ResTodayEffLoad,
      ResTodayLeisureLoad
    } = this.props;
    return (
      <div className="zoe-tod-info">
        <div className="zoe-tod-head">今日概况</div>
        <div style={{ height: "calc(100% - 40px)" }}>
          <div className="zoe-tod-tea">
            {ResTodayMesLoad ? (
              <Spin />
            ) : (
              <div
                style={
                  G.ISCED_setInfo&&G.ISCED_setInfo.multimediaUse?
                  G.ISCED_setInfo.multimediaUse=='0'? 
                  {
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }:{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around"
                }
                :{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center"
                }
                }
              >
                <div className="zoe-address-item">
                  <div>
                    <p>授课</p>
                    <p>教师</p>
                  </div>
                  <div>
                    <p>{ResTodayMes.teachTeacher||'-'}</p>
                    <p>人</p>
                  </div>
                </div>
                {
                  G.ISCED_setInfo&&G.ISCED_setInfo.multimediaUse?
                  G.ISCED_setInfo.multimediaUse=='0'?null:
                  <div
                  className="zoe-address-item"
                  onClick={() => this.props.history.push("/home/img/org/dmtsy")}
                >
                  <div>
                    <p>多媒体</p>
                    <p>使用率</p>
                  </div>
                  <div id="zoe-media">
                    <p id="zoe-media-p">
                      {ResTodayMes.mediaUseProp}
                      <span>%</span>
                    </p>
                  </div>
                </div>
                :null
                }
              </div>
            )}
          </div>
          <div style={{ height: "77%" }}>
            <div
              className="zoe-ai-box"
              onClick={() => this.props.history.push("/home/img/org/jssy")}
            >
              <div className="zoe-ai-title">
                <span>教室开课率</span>
              </div>
              {ResTodayOpenLoad ? (
                <div className="zoe-spin">
                  <Spin />
                </div>
              ) : ResTodayOpen ? (
                <div className="zoe-ai-cont">
                  <div>
                    <p>AI录播教室</p>
                    <p>
                    {
                      
                      ResTodayOpen.aiRoom?
                      <DataPieEcharts
                        radius_border={["49", "51"]} //边线
                        radius={["39", "49"]} //环
                        bgColorb={"transparent"} //背景
                        center={["50%", "50"]}
                        color={[ResTodayOpen.aiRoom>50?"rgb(10,184,119)":'#ec7329', "transparent"]}
                        data={ResTodayOpen.aiRoom}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                  <div>
                    <p>常态录播教室</p>
                    <p>
                    {
                      ResTodayOpen.rdRoom?
                      <DataPieEcharts
                        radius_border={["49", "51"]} //边线
                        radius={["39", "49"]} //环
                        bgColorb={"transparent"} //背景
                        center={["50%", "50"]}
                        color={[ResTodayOpen.rdRoom>50?"rgb(10,184,119)":'#ec7329', "transparent"]}
                        data={ResTodayOpen.rdRoom}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                  <div>
                    <p>标考录播教室</p>
                    <p>
                    {
                      ResTodayOpen.plRoom?
                      <DataPieEcharts
                        radius_border={["49", "51"]} //边线
                        radius={["39", "49"]} //环
                        bgColorb={"transparent"} //背景
                        center={["50%", "50"]}
                        color={[ResTodayOpen.plRoom>50?"rgb(10,184,119)":'#ec7329', "transparent"]}
                        data={ResTodayOpen.plRoom}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                </div>
              ) : (
                <div className="zoe-nodata">
                  <SVG type="noData" width={100} height={100} />
                  <p style={{ color: "#9db8c5" }}>暂无数据</p>
                </div>
              )}
            </div>
            <div
              className="zoe-ai-box"
              onClick={() => this.props.history.push("/home/img/org/jssy")}
            >
              <div className="zoe-ai-title">
                <span>教室有效利用率</span>
              </div>
              {ResTodayEffLoad ? (
                <div className="zoe-spin">
                  <Spin />
                </div>
              ) : ResTodayEff ? (
                <div className="zoe-ai-cont">
                  <div>
                    <p>AI录播教室</p>
                    <p>
                    {
                      ResTodayEff.aiRoom?
                      <GaugeEchart
                        data={{
                          total: 100,
                          finished: ResTodayEff.aiRoom,
                          title: "利用率",
                          fontColor: ResTodayEff.aiRoom>50?"#00fefb":'#ec7329',
                          dataColor:ResTodayEff.aiRoom>50?"#03bd83":'#ec7329'
                        }}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                  <div>
                    <p>常态录播教室</p>
                    <p>
                    {
                      ResTodayEff.rdRoom?
                      <GaugeEchart
                        data={{
                          total: 100,
                          finished: ResTodayEff.rdRoom,
                          title: "利用率",
                          fontColor: ResTodayEff.rdRoom>50?"#00fefb":'#ec7329',
                          dataColor: ResTodayEff.rdRoom>50?"#03bd83":'#ec7329'
                        }}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                  <div>
                    <p>标考录播教室</p>
                    <p>
                    {
                      ResTodayEff.plRoom?
                      <GaugeEchart
                        data={{
                          total: 100,
                          finished: ResTodayEff.plRoom,
                          title: "利用率",
                          fontColor: ResTodayEff.plRoom>50?"rgb(10,184,119)":'#ec7329',
                          dataColor: ResTodayEff.plRoom>50?"rgb(10,184,119)":'#ec7329'
                        }}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                </div>
              ) : (
                <div className="zoe-nodata">
                  <SVG type="noData" width={100} height={100} />
                  <p style={{ color: "#9db8c5" }}>暂无数据</p>
                </div>
              )}
            </div>

            <div
              className="zoe-ai-box"
              onClick={() => this.props.history.push("/home/img/org/jssy")}
            >
              <div className="zoe-ai-title">
                <span>教室闲时使用率</span>
              </div>
              {ResTodayLeisureLoad ? (
                <div className="zoe-spin">
                  <Spin />
                </div>
              ) : ResTodayLeisure ? (
                <div className="zoe-ai-cont">
                  <div>
                    <p>AI录播教室</p>
                    <p>
                    {
                      ResTodayLeisure.aiRoom?
                      <DataPieEcharts
                        radius_border={["49", "51"]} //边线
                        radius={["39", "49"]} //环
                        bgColorb={"transparent"} //背景
                        center={["50%", "50"]}
                        color={[ResTodayLeisure.aiRoom>50?"rgb(10,184,119)":'#ec7329', "transparent"]}
                        data={ResTodayLeisure.aiRoom}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                  <div>
                    <p>常态录播教室</p>
                    <p>
                    {
                      ResTodayLeisure.rdRoom?
                      <DataPieEcharts
                        radius_border={["49", "51"]} //边线
                        radius={["39", "49"]} //环
                        bgColorb={"transparent"} //背景
                        center={["50%", "50"]}
                        color={[ResTodayLeisure.rdRoom>50?"rgb(10,184,119)":'#ec7329', "transparent"]}
                        data={ResTodayLeisure.rdRoom}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                      
                    </p>
                  </div>
                  <div>
                    <p>标考录播教室</p>
                    <p>
                    {
                      ResTodayLeisure.plRoom?
                      <DataPieEcharts
                        radius_border={["49", "51"]} //边线
                        radius={["39", "49"]} //环
                        bgColorb={"transparent"} //背景
                        center={["50%", "50"]}
                        color={[ResTodayLeisure.plRoom>50?"rgb(10,184,119)":'#ec7329', "transparent"]}
                        data={ResTodayLeisure.plRoom}
                      />
                      :<div className='tj-noData'><SVG type='noData' /></div>
                    }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="zoe-nodata">
                  <SVG type="noData" width={100} height={100} />
                  <p style={{ color: "#9db8c5" }}>暂无数据</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ZoeTod;
