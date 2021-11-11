<template>
  <div ref="chartDom"></div>
</template>

<script>
import echarts from "echarts";
import { addListener, removeListener } from "resize-detector";
import debounce from "lodash/debounce";
export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.resize = debounce(this.resize, 300); //resize防抖
  },
  mounted() {
    this.renderChart();
    addListener(this.$refs.chartDom, this.resize);
    // 指定图表的配置项和数据
  },
  watch: {
    option(val) {
      this.chart.setOption(val)
    }
    // option:{
    //   handler(val){
    //     this.chart.setOption(val);
    //   },
    //   deep:true
    // }
  },
  methods: {
    resize() {
      this.chart.resize();
    },
    renderChart() {
      this.chart = echarts.init(this.$refs.chartDom);
      this.chart.setOption(this.option);
    }
  },
  beforeDestroy() {
    removeListener(this.$refs.chartDom, this.resize);
    this.chart.dispose();
    this.chart = null;
  }
};
</script>

<style>
</style>