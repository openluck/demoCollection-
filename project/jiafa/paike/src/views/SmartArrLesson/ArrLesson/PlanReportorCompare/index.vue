<!--
 * @descripttion: 方案报告与对比页面
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-28 09:57:54
-->
<template>
  <div class="plan-reportor-compare">
    <a-spin :spinning="spinning">
      <div class="spin-content">
        <div class="head">
          <div class="head-title">方案对比</div>
          <div class="operation">
            <a-space>
              <a-button type="primary" @click="createPdf"
                >导出排课方案报告</a-button
              >
              <a-button @click="goBack">返回</a-button>
            </a-space>
          </div>
        </div>
        <div class="add-plan">
          <a-button type="primary" @click="addArrLesson">添加方案</a-button>
        </div>
        <div class="container">
          <div class="plan" v-for="(item1, index) in dataSrouce" :key="index">
            <div class="plan-name">
              {{ item1.arrLessonCode }}
              <span class="del-icon" @click="handleDelPlan(item1.arrLessonId)">
                <a-icon
                  type="minus-circle"
                  theme="filled"
                  style="color: #ff6464"
                />
              </span>
            </div>
            <!-- 教师分析 -->
            <div class="teacher-analyse">
              <div class="title">教师分析</div>
              <div class="content" ref="teacherAnalyse">
                <div class="teacher-count">
                  所需教师<span class="num">
                    {{ item1.teacherAnalysis.needTeacherNum }}</span
                  >
                  人
                </div>
                <div class="teacer-use-rate">教师利用率</div>
                <ul class="subject">
                  <li
                    class="subject-item"
                    v-for="(item2, index) in item1.teacherAnalysis.teacherRate"
                    :key="index"
                  >
                    <div class="sub-name">{{ item2.project }}</div>
                    <div class="sub-rate">
                      <span class="num"> {{ item2.projectRate }} </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 规则分析 -->
            <div class="rule-analyse">
              <div class="title">规则分析</div>
              <div class="content" ref="ruleAnalyse">
                <div class="top">
                  <div class="rule-total">
                    规则总数
                    <span class="num"> {{ item1.ruleAnalysis.ruleTotal }} </span
                    >条
                  </div>
                  <!-- <div class="rule-conflict">
                    规则冲突
                    <span class="num" style="color: #ff6d25">
                      {{ item1.ruleAnalysis.ruleConflicts }} </span
                    >条
                  </div> -->
                </div>
                <div class="conflict-details">规则详情</div>
                <ul class="rule-list">
                  <li
                    class="rule-item"
                    v-for="(item3, index) in item1.ruleAnalysis.ruleTableData"
                    :key="index"
                  >
                    <div class="rule-text">{{ item3.ruleConflictsName }}</div>
                    <div class="rule-num">{{ item3.ruleConflictsNum }}</div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 学科老师占比 -->
            <div class="teacher-rate" ref="teacherRate">
              <div class="title">学科老师占比</div>
              <div class="pie-wrap">
                <div class="pie" :id="forPieId(index)"></div>
              </div>
            </div>
            <!-- 所需教室 -->
            <div class="need-classroom">
              <div class="title">所需教室</div>
              <div class="line-wrap">
                <ul class="building-ul" ref="needClassroom">
                  <li
                    v-for="(itemb, index) in item1.needClassroom"
                    :key="index"
                    class="building-li"
                  >
                    <span class="">
                      {{ itemb.buildingName }}:
                      {{ itemb.buildingNum }}
                    </span>
                  </li>
                </ul>
                <div class="line" :id="forLineId(index)"></div>
              </div>
            </div>
            <!-- 所需教师 -->
            <div class="need-teacher">
              <div class="title">所需教师</div>
              <div class="teacher-list">
                <div class="total">
                  总节数：<span class="num">
                    {{ item1.needTeacher.count }} </span
                  >节
                </div>
                <ul class="sub-list" ref="teacherList">
                  <li
                    class="sub-info"
                    v-for="(item5, index) in item1.needTeacher.tableData"
                    :key="index"
                  >
                    <div class="sub-name sub-base">{{ item5.project }}</div>
                    <div class="sub-count sub-base">
                      <span class="num"> {{ item5.needTeacherNum }} </span> 人
                    </div>
                    <div class="lesson-count sub-base">
                      <span class="num"> {{ item5.projectArrLesson }} </span> 节
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>

    <!-- :compareList="dataSrouce.length" -->
    <AddArrLesson
      :addArrlessonVisible="addArrlessonVisible"
      @CloseDialogModel="CloseDialogModel"
      :compareList="dataSrouce.length"
      :arrLessonParentIdList="arrLessonIdList"
      @getPlanReportorCompare="getPlanReportorCompare"
      ref="AddArrLesson"
    ></AddArrLesson>
  </div>
</template>
 
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as echarts from "echarts";
import AddArrLesson from "./ChildCom/addArrLesson.vue";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
export default {
  name: "PlanReportorCompare",
  data() {
    return {
      pieCharts: null,
      lineCharts: null,
      scrollTop: 0,
      goTopShow: false,
      addArrlessonVisible: false,
      getPieId: [],
      getLineId: [],
      dataSrouce: [],
      arrLessonIdList: [],
      spinning: false,
    };
  },
  computed: {},
  watch: {
    scrollTop(val) {
      if (this.scrollTop > 500) {
        this.goTopShow = true;
      } else {
        this.goTopShow = false;
      }
    },
  },
  components: {
    AddArrLesson,
  },
  async mounted() {
    // setTimeout(() => {
    //   this.initEcharts();
    // }, 100);
    let routeArrLessonIdList = this.$route.query.arrLessonIdList;
    if (typeof routeArrLessonIdList == "string") {
      this.arrLessonIdList.push(routeArrLessonIdList);
    } else {
      this.arrLessonIdList = routeArrLessonIdList;
    }
    // this.arrLessonIdList = this.$route.query.arrLessonIdList;
    await this.getPlanReportorCompare();
    // await this.$nextTick(() => {
    //   this.initEcharts();
    // });
  },
  computed: {
    // ...mapState("stateList", ["arrLessonCompareIdList"]),
  },
  destroyed() {},
  methods: {
    forPieId: function (index) {
      return "pie" + index;
    },
    forLineId: function (index) {
      return "line" + index;
    },
    /**
     * @name: 初始化echarts
     * @msg:
     * @param {*}
     * @return {*}
     */
    initEcharts() {
      // this.$nextTick(function () {
      // 动态设置样式高度
      let teacherAnalyseHeightArr = [];
      let ruleAnalyseHeightArr = [];
      let teacherListHeightArr = [];
      let needClassroomHeightArr = [];
      let teacherAnalyseMaxHeight = 0;
      let ruleAnalyseMaxHeight = 0;
      let teacherListMaxHeight = 0;
      let needClassroomMaxHeight = 0;
      let getPieId = [];
      let getLineId = [];
      let teacherAnalyseHeight = 0;
      let ruleAnalyseHeight = 0;
      let teacherListHeight = 0;
      let needClassroomHeight = 0;

      for (let i = 0; i < this.dataSrouce.length; i++) {
        //获取id放入数组中，以便下面渲染echart仪表盘使用
        getPieId.push(echarts.init(document.getElementById("pie" + i)));
        getLineId.push(echarts.init(document.getElementById("line" + i)));
        const pieOptions = {
          title: {
            // text: "总人数：27人",
            left: "left",
            textStyle: {
              fontWeight: "normal",
              color: "#303233",
              fontSize: 18,
            },
          },
          // tooltip: {
          //   trigger: "item",
          //   formatter: "{a} <br/>{b} : {c} ({d}%)",
          // },
          // legend: {
          //   left: "center",
          //   top: "bottom",
          //   // data: [
          //   //   "语文",
          //   //   "数学",
          //   //   "体育",
          //   //   "科学",
          //   //   "化学",
          //   //   "生物",
          //   //   "地理",
          //   //   "英语",
          //   // ],
          // },
          toolbox: { show: false },
          series: [
            {
              // name: "科目占比",
              type: "pie",
              radius: [20, 110],
              center: ["50%", "50%"],
              roseType: "area",
              itemStyle: {
                borderRadius: 5,
              },
              // data: [
              //   // 饼图数据-学科老师占比
              //   { value: 33.3, name: "语文 1" },
              //   { value: 13.3, name: "数学 2" },
              //   { value: 213.3, name: "体育 3" },
              // ],
            },
          ],
        };

        // 渲染饼图
        // let test = [33.3, 33.3, 33.3]
        pieOptions.series[0].data =
          this.dataSrouce[i].subjectTeacherRatio.pieData;
        let peopleNum = this.dataSrouce[i].subjectTeacherRatio.total;
        pieOptions.title.text = `总人数：${peopleNum} 人`;
        let nameData = [];
        this.dataSrouce[i].subjectTeacherRatio.pieData.map((item) => {
          nameData.push(item.name);
        });
        // pieOptions.legend.data = nameData;

        // 渲染折线图
        const lineOptions = {
          title: {
            text: "",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            // data: [
            //   "邮件营销",
            //   "联盟广告",
            //   "视频广告",
            //   "直接访问",
            //   "搜索引擎",
            // ],
          },
          grid: {
            left: "7%",
            right: "5%",
            bottom: "1%",
            top: '25%',
            containLabel: true,
          },
          toolbox: {
            // feature: {
            //   saveAsImage: {},
            // },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
          yAxis: {
            type: "value",
            name: "利用百分比%",
            min: 0,
            max: 100,
          },
          series: [
            // {
            //   name: "10号楼",
            //   type: "line",
            //   stack: "总量",
            //   data: [12.3, 13.4, 10.4, 13, 9, 23, 21],
            //   // 显示数值
            //   itemStyle: { normal: { label: { show: true } } },
            // },
          ],
        };
        // 渲染折线图
        let legendData = [];
        this.dataSrouce[i].needClassroom.map((item) => {
          legendData.push(item.buildingName);
        });
        lineOptions.legend.data = legendData;
        let seriesData = [...this.dataSrouce[i].needClassroom];
        // this.dataSrouce[i].needClassroom.map(item => {
        //     item.type = 'line',
        //     item.stack = "总量",
        //     item.data =
        // })
        seriesData.map((item) => {
          item.type = "line";
          // item.stack = "总量";
          item.itemStyle = { normal: { label: { show: true } } };
          item.data = item.xData;
          item.name = item.buildingName;
          delete item.buildingName;
          delete item.buildingNum;
          delete item.xData;
        });

        lineOptions.series = seriesData;
        getPieId[i].clear();
        getLineId[i].clear();

        getPieId[i].setOption(pieOptions);
        getLineId[i].setOption(lineOptions);

        // 动态设置样式高度
        teacherAnalyseHeight = this.$refs.teacherAnalyse[i].clientHeight;
        teacherAnalyseHeightArr.push(teacherAnalyseHeight);

        ruleAnalyseHeight = this.$refs.ruleAnalyse[i].clientHeight;
        ruleAnalyseHeightArr.push(ruleAnalyseHeight);

        teacherListHeight = this.$refs.teacherList[i].clientHeight;
        teacherListHeightArr.push(teacherListHeight);

        needClassroomHeight = this.$refs.needClassroom[i].clientHeight;
        needClassroomHeightArr.push(needClassroomHeight);
      }
      teacherAnalyseMaxHeight = Math.max(...teacherAnalyseHeightArr);
      ruleAnalyseMaxHeight = Math.max(...ruleAnalyseHeightArr);
      teacherListMaxHeight = Math.max(...teacherListHeightArr);
      needClassroomMaxHeight = Math.max(...needClassroomHeightArr);
      for (let i = 0; i < this.dataSrouce.length; i++) {
        this.$refs.teacherAnalyse[i].style.height =
          teacherAnalyseMaxHeight + "px";
        this.$refs.ruleAnalyse[i].style.height = ruleAnalyseMaxHeight + "px";
        this.$refs.teacherList[i].style.height = teacherListMaxHeight + "px";
        this.$refs.needClassroom[i].style.height =
          needClassroomMaxHeight + "px";
      }

      // });
    },

    /**
     * @name: 删除排课方案提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    handleDelPlan(arrLessonId) {
      this.$confirm({
        title: "确定删除该排课方案？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.DelPlan(arrLessonId);
        },
      });
    },

    /**
     * @name: 删除排课方案
     * @msg:
     * @param {*}
     * @return {*}
     */
    async DelPlan(arrLessonId) {
      let arrLessonIdListTem = [];
      arrLessonIdListTem.push(arrLessonId);
      this.arrLessonIdList = this.arrLessonIdList.filter((items) => {
        if (!arrLessonIdListTem.includes(items)) return items;
      });
      arrLessonIdListTem = [];
      this.getPlanReportorCompare();
    },
    /**
     * @name: 返回上一页
     * @msg:
     * @param {*}
     * @return {*}
     */
    goBack() {
      this.$router.push({
        name: "排课方案列表",
        params: {
          isGoBack: true,
        },
      });
    },
    /**
     * @name: 获取排课方案
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getPlanReportorCompare(arrLessonChildIdList) {
      this.spinning = true;
      let data = {
        arrLessonId: this.arrLessonIdList,
      };
      if (arrLessonChildIdList) {
        this.arrLessonIdList =
          this.arrLessonIdList.concat(arrLessonChildIdList);
        data.arrLessonId = this.arrLessonIdList;
      }
      try {
        const res = await this.$api.ArrLessonSetting.getPlanReportorCompare(
          data
        );
        if (res.code === "200") {
          this.spinning = false;
          this.dataSrouce = res.data;
          this.$nextTick(() => {
            this.initEcharts();
          });
        } else {
          this.spinning = false;
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败", +error);
      }
    },

    /**
     * @name: 添加排课方案
     * @msg:
     * @param {*}
     * @return {*}
     */
    addArrLesson() {
      this.addArrlessonVisible = true;
      // this.$refs.AddArrLesson.getArrLessonList(this.arrLessonIdList)
      this.$refs.AddArrLesson.getArrLessonList();
    },
    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    CloseDialogModel(addArrlessonVisible) {
      this.addArrlessonVisible = !addArrlessonVisible;
    },

    /**
     * @desc 导出分班方案报告
     */
    createPdf() {
      this.deleteShow = false;
      setTimeout(() => {
        let shareContent = document.getElementsByClassName("container")[0], //需要截图的包裹的（原生的）DOM 对象
          width = shareContent.clientWidth, //获取dom 宽度
          height = shareContent.clientHeight, //获取dom 高度
          canvas = document.createElement("canvas"), //创建一个canvas节点
          scale = 1; //定义任意放大倍数 支持小数
        canvas.width = width * scale; //定义canvas 宽度 * 缩放
        canvas.height = height * scale; //定义canvas高度 *缩放
        canvas.style.width = shareContent.clientWidth * scale + "px";
        canvas.style.height = shareContent.clientHeight * scale + "px";
        canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
        let opts = {
          scale: scale, // 添加的scale 参数
          canvas: canvas, //自定义 canvas
          logging: false, //日志开关，便于查看html2canvas的内部执行流程
          width: width, //dom 原始宽度
          height: height,
          useCORS: true, // 【重要】开启跨域配置
        };

        html2canvas(shareContent, opts).then(() => {
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;
          //一页pdf显示html页面生成的canvas高度;
          var pageHeight = (contentWidth / 592.28) * 841.89;
          //未生成pdf的html页面高度
          var leftHeight = contentHeight;
          //页面偏移
          var position = 0;
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          var imgWidth = 595.28;
          var imgHeight = (592.28 / contentWidth) * contentHeight;
          var pageData = canvas.toDataURL("image/jpeg", 1.0);
          var PDF = new JsPDF("", "pt", "a4");
          this.deleteShow = true;
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                PDF.addPage();
              }
            }
          }
          PDF.save("排课方案报告对比" + ".pdf"); // 这里是导出的文件名
        });
      }, 1);
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
    // justify-content: space-between;
    .plan {
      width: 32.8%;
      margin-right: 20px;
      &:nth-of-type(3) {
        margin-right: 0px;
      }
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
          // min-height: 200px;
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
            // display: grid;
            // grid-template-columns: repeat(auto-fill, 106px);
            // gap: 10px;
            display: flex;
            flex-wrap: wrap;
            .subject-item {
              height: 40px;
              // width: 22%;
              border: 1px solid #edf0f2;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px;
              color: #303233;
              margin-right: 18px;
              margin-bottom: 10px;

              &:nth-child(4n + 4) {
                margin-right: 0px;
              }
              .sub-name {
                font-size: 16px;
                margin-right: 10px;
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
          // min-height: 193px;
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
          // min-height: 432px;
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
            // height: 400px;
            min-height: 400px;
          }
        }
      }
      .need-teacher {
        .teacher-list {
          padding: 16px;
          background: white;
          // min-height: 331px;
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
  .building-ul {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .building-li {
    list-style: none;
    span {
      font-size: 18px;
      margin-right: 10px;
      color: #000;
    }
  }
  ol,
  ul,
  dl {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>