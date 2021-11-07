/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: lj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 学生听讲反馈组件
 */
import React, { Fragment as F, useState, useEffect } from "react";
import ColorsPieEcharts from './../public/ColorsPieEcharts.js';
import PreBar from './../public/preBar';
import Tea_btm_cont from './../public/tea_btm_cont';
import SVG from './../../../public/svg.js';
import CollegeComDashEcharts from './../college_image/collegeComDashEcharts.js';
import WaveLine from './../public/waveLine';
import { Select, message, Spin } from "antd";
import { getConfigData } from './../../../../config/actionConfig.js';
import NoDataAndLoading from './../public/noDataAndLoading';
import Radar from './../tea_image/radar'
import { getSchStuBehPie, getSchStuFacPie, getSchStuZhRade, getSchStuBehLine, getSchStuFacLine, getSchStuZhLine } from './../../../../request/lj_scl_image_request';
const { Option } = Select;
let color = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137'];
export default function Tjfk(props) {
    //学生行为饼图数据
    const [xsxwPie, setXsxwPie] = useState([]);

    //学生行为线图数据
    const [xsxwLine, setXsxwLine] = useState({});

    //学生表情饼图数据
    const [xsbqPie, setXsbqPie] = useState([]);

    //学生表情线图数据
    const [xsbqLine, setXsbqLine] = useState({});

    //综合情况雷达图数据
    const [zhqkPie, setZhqkPie] = useState([]);

    //综合情况线图数据
    const [zhqkLine, setZhqkLine] = useState({});

    //学生行为饼图loading
    const [xsxwPieLoading, setXsxwPieLoading] = useState(true);

    //学生行为线图loading
    const [xsxwLineLoading, setXsxwLineLoading] = useState(true);

    //学生表情饼图loading
    const [xsbqPieLoading, setXsbqPieLoading] = useState(true);

    //学生表情线图loading
    const [xsbqLineLoading, setXsbqLineLoading] = useState(true);

    //综合情况雷达图loading
    const [zhqkPieLoading, setZhqkPieLoading] = useState(true);

    //综合情况线图数据loading
    const [zhqkLineLoading, setZhqkLineLoading] = useState(true);

    useEffect(() => {
        getSchStuBehPiea();
        getSchStuFacPiea();
        getSchStuZhRadea();
        getSchStuBehLinea();
        getSchStuFacLinea();
        getSchStuZhLinea();
    }, [props.params])

    //学生行为饼图
    const getSchStuBehPiea = () => {
        let params = {
            ...props.params
        }
        setXsxwPieLoading(true);
        getSchStuBehPie(params).then((res) => {
            setXsxwPieLoading(false);
            if (res.data.data && res.data.result) {
                if (
                    (res.data.data.read || res.data.data.read == 0) &&
                    (res.data.data.write || res.data.data.write == 0) &&
                    (res.data.data.listen || res.data.data.listen == 0) &&
                    (res.data.data.handUp || res.data.data.handUp == 0) &&
                    (res.data.data.standUp || res.data.data.standUp == 0) &&
                    (res.data.data.playPhone || res.data.data.playPhone == 0) &&
                    (res.data.data.onTable || res.data.data.onTable == 0)
                ) {
                    setXsxwPie([{
                        name: '阅读',
                        prop: res.data.data.read,
                    },
                    {
                        name: "书写",
                        prop: res.data.data.write,
                    },
                    {
                        name: "听讲",
                        prop: res.data.data.listen,
                    },
                    {
                        name: "举手",
                        prop: res.data.data.handUp,
                    },
                    {
                        name: "起立",
                        prop: res.data.data.standUp,
                    },
                    {
                        name: "玩手机",
                        prop: res.data.data.playPhone,
                    },
                    {
                        name: "趴桌子",
                        prop: res.data.data.onTable,
                    }]);
                } else {
                    setXsxwPie([]);
                }

            } else {
                setXsxwPie([]);
            }
        })
    }
    //学生表情饼图
    const getSchStuFacPiea = () => {
        let params = {
            ...props.params
        }
        setXsbqPieLoading(true);
        getSchStuFacPie(params).then((res) => {
            setXsbqPieLoading(false);
            if (res.data.data && res.data.result) {
                if (
                    (res.data.data.happy || res.data.data.happy == 0) &&
                    (res.data.data.scare || res.data.data.scare == 0) &&
                    (res.data.data.neuter || res.data.data.neuter == 0) &&
                    (res.data.data.amzed || res.data.data.amzed == 0) &&
                    (res.data.data.anger || res.data.data.anger == 0) &&
                    (res.data.data.sad || res.data.data.sad == 0) &&
                    (res.data.data.detest || res.data.data.detest == 0)
                ) {
                    setXsbqPie([{
                        name: '高兴',
                        prop: res.data.data.happy
                    },
                    {
                        name: "害怕",
                        prop: res.data.data.scare
                    },
                    {
                        name: "中性",
                        prop: res.data.data.neuter
                    },
                    {
                        name: "惊讶",
                        prop: res.data.data.amzed
                    },
                    {
                        name: "愤怒",
                        prop: res.data.data.anger
                    },
                    {
                        name: "难过",
                        prop: res.data.data.sad
                    },
                    {
                        name: "厌恶",
                        prop: res.data.data.detest
                    }]);
                } else {
                    setXsbqPie([]);
                }

            } else {
                setXsbqPie([]);
            }
        })
    }
    //综合情况雷达图
    const getSchStuZhRadea = () => {
        let params = {
            ...props.params
        }
        setZhqkPieLoading(true);
        getSchStuZhRade(params).then((res) => {
            setZhqkPieLoading(false);
            if (res.data.data && res.data.result) {
                if (
                    (res.data.data.involvement || res.data.data.involvement == 0) &&
                    (res.data.data.concentration || res.data.data.concentration == 0) &&
                    (res.data.data.activation || res.data.data.activation == 0) &&
                    (res.data.data.distrust || res.data.data.distrust == 0)
                ) {
                    setZhqkPie([
                        res.data.data.involvement,
                        res.data.data.concentration,
                        res.data.data.activation,
                        res.data.data.distrust]);
                } else {
                    setZhqkPie([]);
                }

            } else {
                setZhqkPie([]);
            }
        })
    }
    //学生行为线图
    const getSchStuBehLinea = () => {
        let params = {
            ...props.params
        }
        setXsxwLineLoading(true);
        getSchStuBehLine(params).then((res) => {
            setXsxwLineLoading(false);
            if (res.data.data && res.data.result) {
                setXsxwLine(getConfigData(res.data.data, 4));
            } else {
                setXsxwLine({})
            }
        })
    }
    //学生表情线图
    const getSchStuFacLinea = () => {
        let params = {
            ...props.params
        }
        setXsbqLineLoading(true);
        getSchStuFacLine(params).then((res) => {
            setXsbqLineLoading(false);
            if (res.data.data && res.data.result) {
                setXsbqLine(getConfigData(res.data.data, 5));
            } else {
                setXsbqLine({});
            }
        })
    }
    //课堂类型线图
    const getSchStuZhLinea = () => {
        let params = {
            ...props.params
        }
        setZhqkLineLoading(true);
        getSchStuZhLine(params).then((res) => {
            setZhqkLineLoading(false);
            if (res.data.data && res.data.result) {
                setZhqkLine(getConfigData(res.data.data, 6));
            } else {
                setZhqkLine({});
            }
        })
    }
    return (
        <div className="image_public jxfx">
            <div className='scl_jxfx'>
                <div>
                    <div>
                        <div className='header'>学生行为</div>
                        <div className='content'>
                            {
                                !xsxwPieLoading && xsxwPie.length !== 0 ?
                                    <ColorsPieEcharts
                                        title="人次"//title="人次" title="%"
                                        color={color}//每一个，对应scaleData对应下标的颜色
                                        type={4} //  1 2 不传type 3种样式
                                        scaleData={xsxwPie}
                                    /> : <NoDataAndLoading loading={xsxwPieLoading} />
                            }
                        </div>

                    </div>
                    <div>
                        {
                            !xsxwLineLoading && xsxwLine && xsxwLine.read && xsxwLine.read.date.length !== 0 ?
                                <WaveLine
                                    legend={['阅读', '书写', '听讲', '举手', '起立', '玩手机', '趴桌子']}
                                    lineColor={color}
                                    xData={xsxwLine.read.date}
                                    yData={[
                                        xsxwLine.read.num,
                                        xsxwLine.write.num,
                                        xsxwLine.listen.num,
                                        xsxwLine.handUp.num,
                                        xsxwLine.standUp.num,
                                        xsxwLine.playPhone.num,
                                        xsxwLine.onTable.num
                                    ]}
                                    type={props.params.timeType}
                                /> : <NoDataAndLoading loading={xsxwLineLoading} />
                        }
                    </div>
                </div>
                <div>
                    <div>
                        <div className='header'>学生表情</div>
                        <div className='content'>
                            {
                                !xsbqPieLoading && xsbqPie.length !== 0 ?
                                    <ColorsPieEcharts
                                        title=""//title="人次" title="%"
                                        color={color}//每一个，对应scaleData对应下标的颜色
                                        type={4} //  1 2 不传type 3种样式
                                        scaleData={xsbqPie}
                                    /> : <NoDataAndLoading loading={xsbqPieLoading} />
                            }

                        </div>

                    </div>
                    <div>
                        {
                            !xsbqLineLoading && xsbqLine && xsbqLine.happy && xsbqLine.happy.date.length !== 0 ?
                                <WaveLine
                                    legend={['高兴', '害怕', '中性', '惊讶', '愤怒', '难过', '厌恶']}
                                    lineColor={color}
                                    xData={xsbqLine.happy.date}
                                    yData={[
                                        xsbqLine.happy.num,
                                        xsbqLine.scare.num,
                                        xsbqLine.neuter.num,
                                        xsbqLine.amzed.num,
                                        xsbqLine.anger.num,
                                        xsbqLine.sad.num,
                                        xsbqLine.detest.num
                                    ]}
                                    type={props.params.timeType}
                                /> : <NoDataAndLoading loading={xsbqLineLoading} />
                        }

                    </div>
                </div>
                <div>
                    <div>
                        <div className='header'>综合情况</div>
                        <div className='content'>
                            {
                                !zhqkPieLoading && zhqkPie.length !== 0 ?
                                    <Radar
                                        height={210}
                                        data={{
                                            legend: [
                                                { name: '参与度', max: 100 },
                                                { name: '专注度', max: 100 },
                                                { name: '活跃度', max: 100 },
                                                { name: '疑惑度', max: 100 }
                                            ],
                                            data: zhqkPie
                                        }} />
                                    : <NoDataAndLoading loading={zhqkPieLoading} />
                            }

                        </div>

                    </div>
                    <div>
                        {
                            !zhqkLineLoading && zhqkLine && zhqkLine.involvement && zhqkLine.involvement.date.length !== 0 ?
                                <WaveLine
                                    legend={['参与度', '专注度', '活跃度', '疑惑度']}
                                    lineColor={color}
                                    xData={zhqkLine.involvement.date}
                                    yData={[
                                        zhqkLine.involvement.num,
                                        zhqkLine.concentration.num,
                                        zhqkLine.activation.num,
                                        zhqkLine.distrust.num,
                                    ]}
                                    type={props.params.timeType}
                                /> : <NoDataAndLoading loading={zhqkLineLoading} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );

}
