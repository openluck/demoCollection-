import React, { Component } from 'react';
import WaveLine from './../public/waveLine';
import NoDataAndLoading from './../public/noDataAndLoading';
import Radar from './../tea_image/radar'
export default class CollageZhqk extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        let color = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137'];
        let { zhqkPieLoading, zhqkPie, zhqkLineLoading, zhqkLine, params } = this.props;
        return (

            <div className='col_jskq'>
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
                                    type={params.timeType}
                                /> : <NoDataAndLoading loading={zhqkLineLoading} />
                        }
                    </div>
                </div>
            </div>

        )
    }
}