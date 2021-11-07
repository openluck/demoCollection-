import { Component, Prop } from 'vue-property-decorator';
// import Echarts from '@helpers/Echarts';
import BaseVue, { BaseRef } from '@helpers/BaseVue';
import RadarChartHelper, { IDrawData, IRadarChartOptions } from '@/helpers/RadarChartHelper';

interface IRefs extends BaseRef {
  chartBox: HTMLElement;
}

@Component
export default class RadarChart extends BaseVue<IRefs, {}> {
  @Prop({ required: true, default: null })
  public data!: IWeaponParams;

  mounted() {
    this.$nextTick(() => {
      this.initEchart();
      // this.initHighChart();
    });
  }

  public initEchart() {
    const el = this.$refs.chartBox as HTMLCanvasElement;
    const options = this.getOwnChartOptions();
    const chart = new RadarChartHelper(el, options);
    chart.draw();
    // const chartInstance = Echarts.init(this.$refs.chartBox as HTMLCanvasElement);
    // const options = this.getChartOptions();
    // chartInstance.setOption(options);
  }

  private getOwnChartOptions(): IRadarChartOptions {
    const data: IDrawData[] = [
      { label: '伤害', max: 100, value: 0 },
      { label: '射速', max: 100, value: 0 },
      { label: '精准度', max: 100, value: 0 },
      { label: '控制', max: 100, value: 0 },
      { label: '射程', max: 100, value: 0 },
      { label: '机动性', max: 100, value: 0 },
    ];
    const list = this.getData();
    for (let i = 0; i < list.length; i++) {
      data[i].value = list[i];
    }
    return {
      mData: data,
      mColorLines: '#5a626b',
      mColorPolygon: 'rgba(255,255,255,0.5)',
      mRegionColor: '#f9e655',
      mPointColor: '#f9e655',
    };
  }

  private getData() {
    const { wqszshAd, wqszss17, wqszjzD0, wqszydxD9, wqszscB6, wqszkz60 } = this.data;
    return [wqszshAd, wqszss17, wqszjzD0, wqszkz60, wqszscB6, wqszydxD9].map(parseFloat);
  }

  // private getChartOptions() {
  //   const value = this.getData();
  //   return {
  //     radar: [
  //       {
  //         nameGap: 1, // 图中工艺等字距离图的距离
  //         splitNumber: 5, // 网格线的个数
  //         center: ['50%', '50%'], // 图的位置
  //         indicator: [
  //           { text: '伤害', max: 120 },
  //           { text: '射速', max: 120 },
  //           { text: '精准度', max: 120 },
  //           { text: '机动性', max: 120 },
  //           { text: '射程', max: 120 },
  //           { text: '控制', max: 120 },
  //         ],
  //         name: {
  //           textStyle: {
  //             color: '#fff',
  //             fontSize: 8,
  //           },
  //         },
  //         axisLine: {
  //           // 坐标轴线
  //           show: true, // 默认显示，属性show控制显示与否
  //           lineStyle: {
  //             // 属性lineStyle控制线条样式
  //             color: '#5a626b',
  //             width: 1,
  //             type: 'solid',
  //           },
  //         },
  //         splitArea: {
  //           show: true,
  //           areaStyle: {
  //             shadowColor: 'rgba(255, 255, 255, 0.3)',
  //             shadowBlur: 10,
  //             color: [
  //               'rgba(255, 255, 255, 0.1)',
  //               'rgba(255, 255, 255, 0.2)',
  //               'rgba(255, 255, 255, 0.2)',
  //               'rgba(255, 255, 255, 0.3)',
  //               'rgba(255, 255, 255, 0.4)'], // 图表背景网格的颜色
  //           },
  //         },
  //         splitLine: {
  //           show: true,
  //           lineStyle: {
  //             width: 1,
  //             color: '#5a626b', // 图表背景网格线的颜色
  //           },
  //         },
  //       },
  //     ],
  //     series: [
  //       {
  //         type: 'radar',
  //         symbol: 'none', // 去掉图表中各个图区域的边框线拐点
  //         // itemStyle: {
  //         //   normal: {
  //         //     lineStyle: {
  //         //       color: 'rgba(255,255,255,0.5)', // 图表中各个图区域的边框线颜色
  //         //     },
  //         //     areaStyle: {
  //         //       type: 'default',
  //         //     },
  //         //   },
  //         // },
  //         data: [
  //           {
  //             value,
  //             areaStyle: {
  //               color: '#f9e655', // 里面的雷达图颜色
  //             },
  //             lineStyle: {
  //               color: '#f9e655', // 里面的雷达图颜色
  //             },
  //             name: '',
  //           },
  //         ],
  //       },
  //     ],
  //   };
  // }
}
