/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: lj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 教学分析组件
 */
import React, { Fragment as F, useState, useEffect } from "react";
import ColorsPieEcharts from './../public/ColorsPieEcharts.js';
import WaveLine from './../public/waveLine';
import { getConfigData } from './../../../../config/actionConfig.js';
import NoDataAndLoading from './../public/noDataAndLoading';
import { getSchBehPie, getSchDesPie, getSchTypePie, getSchBehLine, getSchDesLine, getSchTypeLine } from './../../../../request/lj_scl_image_request';
let color = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137'];
export default function Jxfx (props) {
  //教师行为饼图数据
  // const [jsxwPie, setJsxwPie] = useState([]);

  //教师行为线图数据
  // const [jsxwLine, setJsxwLine] = useState({});

  //教学设计饼图数据
  const [jxsjPie, setJxsjPie] = useState([]);

  //教师设计线图数据
  const [jxsjLine, setJssjLine] = useState({});

  //课堂类型饼图数据
  const [ktlxPie, setKtlxPie] = useState([]);

  //课堂类型线图数据
  const [ktlxLine, setKtlxLine] = useState({});

  //教师行为饼图loading
  // const [jsxwPieLoading, setJsxwPieLoading] = useState(true);

  //教师行为线图loading
  // const [jsxwLineLoading, setJsxwLineLoading] = useState(true);

  //教学设计饼图loading
  const [jxsjPieLoading, setJxsjPieLoading] = useState(true);

  //教学设计线图loading
  const [jxsjLineLoading, setJxsjLineLoading] = useState(true);

  //课堂类型饼图loading
  const [ktlxPieLoading, setKtlxPieLoading] = useState(true);

  //课堂类型线图loading
  const [ktlxLineLoading, setKtlxLineLoading] = useState(true);


  useEffect(() => {
    // getSchBehPiea();
    getSchDesPiea();
    getSchTypePiea();
    // getSchBehLinea();
    getSchDesLinea();
    getSchTypeLinea();
  }, [props.params])

  //教师行为饼图
  const getSchBehPiea = () => {
    let params = {
      ...props.params
    }
    setJsxwPieLoading(true);
    getSchBehPie(params).then((res) => {
      setJsxwPieLoading(false)
      if (res.data.data && res.data.result) {
        if ((res.data.data.boardWrite || res.data.data.boardWrite == 0) &&
          (res.data.data.patrol || res.data.data.patrol == 0) &&
          (res.data.data.media || res.data.data.media == 0)
        ) {
          setJsxwPie([{
            name: '板书',
            prop: res.data.data.boardWrite,
          },
          {
            name: "巡视",
            prop: res.data.data.patrol,
          },
          {
            name: "多媒体",
            prop: res.data.data.media,
          }]);
        }

      } else {
        setJsxwPie([]);
      }
    })
  }
  //教学设计饼图
  const getSchDesPiea = () => {
    let params = {
      ...props.params
    }
    setJxsjPieLoading(true);
    getSchDesPie(params).then((res) => {
      setJxsjPieLoading(false);
      if (res.data.data && res.data.result) {
        if ((res.data.data.stuLearn || res.data.data.stuLearn == 0) &&
          (res.data.data.stuShow || res.data.data.stuShow == 0) &&
          (res.data.data.stuInteract || res.data.data.stuInteract == 0) &&
          (res.data.data.teaching || res.data.data.teaching == 0) &&
          (res.data.data.tsInteract || res.data.data.tsInteract == 0)
        ) {
          setJxsjPie([{
            name: '学生自习',
            prop: res.data.data.stuLearn
          },
          {
            name: "学生展示",
            prop: res.data.data.stuShow
          },
          {
            name: "生生互动",
            prop: res.data.data.stuInteract
          },
          {
            name: "教师讲授",
            prop: res.data.data.teaching
          },
          {
            name: "师生互动",
            prop: res.data.data.tsInteract
          }]);
        }

      } else {
        setJxsjPie([]);
      }
    })
  }
  //课堂类型饼图
  const getSchTypePiea = () => {
    let params = {
      ...props.params
    }
    setKtlxPieLoading(true);
    getSchTypePie(params).then((res) => {
      setKtlxPieLoading(false);
      if (res.data.data && res.data.result) {
        if ((res.data.data.teachingT || res.data.data.teachingT == 0) &&
          (res.data.data.exeT || res.data.data.exeT == 0) &&
          (res.data.data.mixT || res.data.data.mixT == 0) &&
          (res.data.data.chatT || res.data.data.chatT == 0)
        ) {
          setKtlxPie([{
            name: '讲授型',
            prop: res.data.data.teachingT
          },
          {
            name: "练习型",
            prop: res.data.data.exeT
          },
          {
            name: "混合型",
            prop: res.data.data.mixT
          },
          {
            name: "对话型",
            prop: res.data.data.chatT
          }]);
        }

      } else {
        setKtlxPie([]);
      }
    })
  }
  //教师行为线图
  const getSchBehLinea = () => {
    let params = {
      ...props.params
    }
    setJsxwLineLoading(true);
    getSchBehLine(params).then((res) => {
      setJsxwLineLoading(false);
      if (res.data.data && res.data.result) {
        setJsxwLine(getConfigData(res.data.data, 1));
      } else {
        setJsxwLine({})
      }
    })
  }
  //教师设计线图
  const getSchDesLinea = () => {
    let params = {
      ...props.params
    }
    setJxsjLineLoading(true);
    getSchDesLine(params).then((res) => {
      setJxsjLineLoading(false);
      if (res.data.data && res.data.result) {
        setJssjLine(getConfigData(res.data.data, 2));
      } else {
        setJssjLine({})
      }
    })
  }
  //课堂类型线图
  const getSchTypeLinea = () => {
    let params = {
      ...props.params
    }
    setKtlxLineLoading(true);
    getSchTypeLine(params).then((res) => {
      setKtlxLineLoading(false);
      if (res.data.data && res.data.result) {
        setKtlxLine(getConfigData(res.data.data, 3));
      } else {
        setKtlxLine({})
      }
    })
  }
  return (
    <div className="image_public jxfx">
      <div className='scl_jxfx'>
        {/* v1.21版本删除 */}
        {/* <div>
              <div>
                  <div className='header'>教师行为</div>
                  <div className='content'>
                      {
                          !jsxwPieLoading && jsxwPie && jsxwPie.length !== 0 ?
                              <ColorsPieEcharts
                                  title="人次"//title="人次" title="%"
                                  color={color}//每一个，对应scaleData对应下标的颜色
                                  type={1} //  1 2 不传type 3种样式
                                  scaleData={jsxwPie}
                              /> : <NoDataAndLoading loading={jsxwPieLoading} />
                      }
                  </div>
              </div>
        <div>
          {
            !jsxwLineLoading && jsxwLine && jsxwLine.boardWrite && jsxwLine.boardWrite.date.length !== 0 ?
              <WaveLine
                legend={['板书', '巡视', '多媒体']}
                lineColor={color}
                xData={jsxwLine.boardWrite.date}
                yData={[
                  jsxwLine.boardWrite.num,
                  jsxwLine.patrol.num,
                  jsxwLine.media.num,
                ]}
                type={props.params.timeType}
              /> : <NoDataAndLoading loading={jsxwLineLoading} />
          }
        </div>
      </div> */}
        <div>
          <div>
            <div className='header'>教学设计</div>
            <div className='content'>
              {
                !jxsjPieLoading && jxsjPie && jxsjPie.length !== 0 ?
                  <ColorsPieEcharts
                    title="人次"//title="人次" title="%"
                    color={color}//每一个，对应scaleData对应下标的颜色
                    type={1} //  1 2 不传type 3种样式
                    scaleData={jxsjPie}
                  /> : <NoDataAndLoading loading={jxsjPieLoading} />
              }
            </div>
          </div>
          <div>
            {
              !jxsjLineLoading && jxsjLine && jxsjLine.stuShow && jxsjLine.stuShow.date.length !== 0 ?
                <WaveLine
                  legend={['学生自习', '生生互动', '师生互动', '教师讲授', '学生展示']}
                  lineColor={color}
                  xData={jxsjLine.stuShow.date}
                  yData={[
                    jxsjLine.stuLearn.num,
                    jxsjLine.stuInteract.num,
                    jxsjLine.tsInteract.num,
                    jxsjLine.teaching.num,
                    jxsjLine.stuShow.num,
                  ]}
                  type={props.params.timeType}
                /> : <NoDataAndLoading loading={jxsjLineLoading} />
            }

          </div>
        </div>
        <div>
          <div>
            <div className='header'>课堂类型</div>
            <div className='content'>
              {
                !ktlxPieLoading && ktlxPie && ktlxPie.length !== 0 ?
                  <ColorsPieEcharts
                    title="人次"//title="人次" title="%"
                    color={color}//每一个，对应scaleData对应下标的颜色
                    type={1} //  1 2 不传type 3种样式
                    scaleData={ktlxPie}
                  /> : <NoDataAndLoading loading={ktlxPieLoading} />
              }
            </div>
          </div>
          <div>
            {
              !ktlxLineLoading && ktlxLine && ktlxLine.teachingT && ktlxLine.teachingT.date.length !== 0 ?
                <WaveLine
                  legend={['讲授型', '对话型', '混合型', '练习型']}
                  lineColor={color}
                  xData={ktlxLine.teachingT.date}
                  yData={[
                    ktlxLine.teachingT.num,
                    ktlxLine.chatT.num,
                    ktlxLine.mixT.num,
                    ktlxLine.exeT.num
                  ]}
                  type={props.params.timeType}
                /> : <NoDataAndLoading loading={ktlxLineLoading} />
            }
          </div>
        </div>
      </div>
    </div >
  );

}
