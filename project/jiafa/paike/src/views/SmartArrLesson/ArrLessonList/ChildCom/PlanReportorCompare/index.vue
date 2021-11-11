<!--
 * @descripttion: 方案报告与对比页面
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-28 09:57:54
-->
<template>
  <div class="plan-reportor-compare">
    <div class="head">
      <div class="head-title">方案对比</div>
      <div class="operation">
        <a-space>
          <a-button type="primary">导出排课方案报告</a-button>
          <a-button @click="goBack">返回</a-button>
        </a-space>
      </div>
    </div>
    <div class="add-plan">
      <a-button type="primary">添加方案</a-button>
    </div>
    <div class="container">
      <div class="plan" v-for="i in 3" :key="i">
        <div class="plan-name">
          排课方案名称一
          <span class="del-icon" @click="handleDelPlan">
            <a-icon type="minus-circle" theme="filled" style="color: #ff6464" />
          </span>
        </div>
        <!-- 教师分析 -->
        <div class="teacher-analyse">
          <div class="title">教师分析</div>
          <div class="content">
            <div class="teacher-count">
              所需教师<span class="num">25</span> 人
            </div>
            <div class="teacer-use-rate">教师利用率</div>
            <ul class="subject">
              <li class="subject-item" v-for="i in 23" :key="i">
                <div class="sub-name">语文</div>
                <div class="sub-rate"><span class="num">23</span> %</div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 规则分析 -->
        <div class="rule-analyse">
          <div class="title">规则分析</div>
          <div class="content">
            <div class="top">
              <div class="rule-total">
                规则总数 <span class="num">43</span>条
              </div>
              <div class="rule-conflict">
                规则冲突
                <span class="num" style="color: #ff6d25">9</span>条
              </div>
            </div>
            <div class="conflict-details">规则冲突详情</div>
            <ul class="rule-list">
              <li class="rule-item" v-for="i in 23" :key="i">
                <div class="rule-text">天内集中</div>
                <div class="rule-num">2</div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 学科老师占比 -->
        <div class="teacher-rate">
          <div class="title">学科老师占比</div>
          <div class="pie-wrap">
            <div class="pie" id="pie"></div>
          </div>
        </div>
        <!-- 所需教室 -->
        <div class="need-classroom">
          <div class="title">所需教室</div>
          <div class="line-wrap">
            <div class="line" id="line"></div>
          </div>
        </div>
        <!-- 所需教师 -->
        <div class="need-teacher">
          <div class="title">所需教师</div>
          <div class="teacher-list">
            <div class="total">总节数：<span class="num">18</span>节</div>
            <ul class="sub-list">
              <li class="sub-info" v-for="i in 32" :key="i">
                <div class="sub-name sub-base">语文</div>
                <div class="sub-count sub-base">
                  <span class="num">6</span> 人
                </div>
                <div class="lesson-count sub-base">
                  <span class="num">6</span> 节
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import * as echarts from "echarts";
export default {
  name: "PlanReportorCompare",
  components: {},
  props: {},
  data() {
    return {
      pieCharts: null,
      lineCharts: null,
      scrollTop: 0,
      goTopShow: false,
    };
  },
  computed: {},
  watch: {
    scrollTop(val) {
      console.log(val);
      if (this.scrollTop > 500) {
        this.goTopShow = true;
      } else {
        this.goTopShow = false;
      }
    },
  },
  mounted() {
    const _this = this;

    setTimeout(() => {
      this.initEcharts();
    }, 100);
    window.onresize = () => {
      _this.pieCharts.resize();
      _this.lineCharts.resize();
    };
  },
  destroyed() {},
  methods: {
    initEcharts() {
      const pieDom = document.getElementById("pie");
      const lineDom = document.getElementById("line");
      const pieCharts = echarts.init(pieDom);
      const lineCharts = echarts.init(lineDom);
      pieCharts.resize();
      lineCharts.resize();
      this.pieCharts = pieCharts;
      this.lineCharts = lineCharts;
      const pieOptions = {
        title: {
          text: "总人数：27人",
          left: "left",
          textStyle: {
            fontWeight: "normal",
            color: "#303233",
            fontSize: 18,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          top: "bottom",
          data: [
            "rose1",
            "rose2",
            "rose3",
            "rose4",
            "rose5",
            "rose6",
            "rose7",
            "rose8",
          ],
        },
        toolbox: { show: false },
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: [20, 110],
            center: ["55%", "60%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 5,
            },
            data: [
              { value: 30, name: "rose 1" },
              { value: 28, name: "rose 2" },
              { value: 26, name: "rose 3" },
              { value: 24, name: "rose 4" },
              { value: 22, name: "rose 5" },
              { value: 20, name: "rose 6" },
              { value: 18, name: "rose 7" },
              { value: 16, name: "rose 8" },
            ],
          },
        ],
      };
      const lineOptions = {
        title: {
          text: "明德楼：24间",
          left: "left",
          // subtext: '利用百分比',
          textStyle: {
            fontWeight: "normal",
            color: "#303233",
            fontSize: 18,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          x: 60,
          x2: 40,
          y: 80,
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: "#919599",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "利用百分比",
          axisLine: {
            lineStyle: {
              color: "#919599",
            },
          },
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            // smooth: true,
            symbolSize: 8,
            itemStyle: {
              normal: {
                borderColor: "#409FFF",
                lineStyle: {
                  width: 5,
                  color: "#409FFF",
                },
                label: {
                  show: true,
                  textStyle: {
                    color: "#409FFF",
                  },
                },
              },
            },
          },
        ],
      };
      pieCharts.setOption(pieOptions);
      lineCharts.setOption(lineOptions);
    },
    handleDelPlan() {
      this.$confirm({
        title: "确定删除该排课方案？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          // this.conflictLoading = true;
          // this.cancleOpration();
        },
      });
    },
    goBack() {
      this.$router.push({
        name: "排课方案列表",
        params: {
          isGoBack: true,
        },
      });
    },
  },
};
</script>
 
<style scoped lang="less">
.plan-reportor-compare {
  background: #f2f5f7;
  .head {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    .head-title {
      color: #242526;
      font-size: 26px;
    }
  }
  .add-plan {
    height: 48px;
    display: flex;
    align-items: center;
  }
  .container {
    display: flex;
    justify-content: space-between;
    .plan {
      width: 32.8%;
      .plan-name {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        font-size: 16px;
        color: #303233;
        position: relative;
        .del-icon {
          cursor: pointer;
          position: absolute;
          right: -7px;
          top: -10px;
        }
      }
      .teacher-analyse {
        .content {
          background: white;
          padding: 16px;
          .teacher-count {
            .num {
              vertical-align: baseline;
              margin: 0 5px;
              font-size: 36px;
              font-weight: 600;
              color: #303233;
            }
          }
          .teacer-use-rate {
            margin: 5px 0;
            height: 40px;
            line-height: 40px;
          }
          .subject {
            display: grid;
            grid-template-columns: repeat(auto-fill, 106px);
            gap: 10px;
            .subject-item {
              height: 40px;
              border: 1px solid #edf0f2;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px;
              color: #303233;
              .sub-name {
                font-size: 16px;
              }
              .sub-rate {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #969a9e;
                .num {
                  font-size: 16px;
                  font-weight: 600;
                  color: #303233;
                }
              }
            }
          }
        }
      }
      .rule-analyse {
        .content {
          padding: 16px;
          background: white;
          .top {
            height: 56px;
            display: flex;
            .rule-total {
              width: 200px;
            }
            .rule-conflict {
              color: #ff6d25;
            }
            .num {
              margin: 0 5px;
              font-size: 36px;
              font-weight: 600;
              color: #303233;
            }
          }
          .conflict-details {
            margin: 15px 0;
          }
          .rule-list {
            display: grid;
            // grid-template-columns: repeat(4, 1fr);
            grid-template-columns: repeat(auto-fill, 106px);
            gap: 10px;
          }
          .rule-item {
            height: 40px;
            border: 1px solid #edf0f2;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            color: #303233;
            .rule-text {
              font-size: 16px;
            }
            .rule-num {
              font-size: 16px;
              font-weight: 600;
              color: #303233;
            }
          }
        }
      }
      .teacher-rate {
        .pie-wrap {
          background: white;
          padding: 16px;
          .pie {
            width: 100%;
            height: 400px;
          }
        }
      }
      .need-classroom {
        .line-wrap {
          background: white;
          padding: 16px;
          .line {
            width: 100%;
            height: 400px;
          }
        }
      }
      .need-teacher {
        .teacher-list {
          padding: 16px;
          background: white;
          .total {
            font-size: 18px;
            color: #303233;
            .num {
              font-weight: 600;
            }
          }
          .sub-list {
            margin-top: 20px;
            .sub-info {
              list-style: none;
              height: 48px;
              margin-bottom: 15px;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              color: #303233;
              .sub-base {
                border-radius: 5px;
                background: #f0f2f5;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #303233;
              }
              .sub-count {
                .num {
                  font-weight: 600;
                }
              }
              .lesson-count {
                .num {
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }
  }
  .title {
    height: 72px;
    display: flex;
    align-items: center;
    font-size: 24px;
    color: #303233;
  }
  .back-top {
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: fixed;
    right: 60px;
    bottom: 40px;
    z-index: 10;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
</style>