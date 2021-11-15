<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-05-17 10:19:09
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-05-17 15:40:38
-->
<template>
  <div class="publish">
    <a-input-search
      class="publish-input"
      placeholder="请输入发布的积分"
      enter-button="发布"
      size="large"
      type="number"
      @search="onSearch"
    />
    <div id="main" style="width: 90%; height: 400px"></div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      dataSource: [],
      pubOrgPointes: "",
      pubRemainPointes: "",
    };
  },
  mounted() {
    this.findPointes();
    this.drawChart();
  },
  methods: {
    onSearch(value) {
      this.pubOrgPointes = parseInt(value);
      this.pubRemainPointes =
        this.dataSource[0].orgPointes - this.pubOrgPointes;
      if (this.pubOrgPointes > this.dataSource[0].orgPointes) {
        this.$message.error("发布的不能大于原本积分数");
      } else {
        this.$http({
          method: "post",
          url: this.$util.baseUrl + "users/publishPointes",
          data: {
            // orgPointes: ,
            remainPointes: this.pubRemainPointes,
          },
        }).then((res) => {
          if (res.data.code === "200") {
            this.$message.success(res.data.mess);
            this.findPointes();
            this.drawChart();
          } else {
            this.$message.error(res.data.mess);
          }
        });
      }
    },
    drawChart() {
      // 使用刚指定的配置项和数据显示图表。
      setTimeout(() => {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("main"));
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: "积分数",
            // subtext: "纯属虚构",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          series: [
            {
              name: "积分数",
              type: "pie",
              radius: "50%",
              data: [
                { value: this.dataSource[0].orgPointes, name: "原本积分数" },
                { value: this.dataSource[0].remainPointes, name: "剩余积分数" },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
        myChart.setOption(option);
        console.log(
          "this.dataSource.outpointes:",
          this.dataSource[0].getpointes
        );
      }, 500);
    },
    // 获取积分数
    findPointes() {
      this.$http({
        method: "get",
        url: this.$util.baseUrl + "users/findPointes",
      }).then((res) => {
        if (res.data.code === "200") {
          this.dataSource = res.data.data;
          console.log(this.dataSource);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.publish {
  width: 100%;
  height: 80vh;

  .publish-input {
    width: 50%;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  #main {
    margin-top: 50px;
  }
}
</style>