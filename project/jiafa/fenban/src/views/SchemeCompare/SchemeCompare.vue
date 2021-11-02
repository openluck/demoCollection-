<template>
  <div class="scheme-compare">
    <!-- <a-spin :spinning="showLoading" class="show-loading" size="large"> -->
    <div class="head-title">
      <span class="title">分班方案对比</span>
      <div class="head-btn">
        <a-button class="themeBtn" @click="createPdf()">
          <svg-icon class="op_daoru" icon-class="fblist_daochu"></svg-icon>
          导出分班方案报告
        </a-button>
        <a-button class="btn-style" @click="cancelCompare"
          ><a-icon type="close" /> 取消对比
        </a-button>
      </div>
    </div>
    <div class="scheme-table">
      <a-button class="btn-style themeBtn" @click="addgroup"
        ><a-icon type="plus" /> 添加方案
      </a-button>
      <div class="divide-class-name" style="margin-top: 0">开班情况</div>
      <div class="pdf-comtainer">
        <!-- 分班方案表格 -->
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="(row) => row.schemeName"
          :bordered="true"
          :pagination="false"
          class="app"
        >
          <template slot="delete" slot-scope="record">
            <div v-show="deleteShow">
              <a href="javascript:;" @click="deleteItem(record)">
                <svg-icon class="op_daoru" icon-class="xuanke_del"></svg-icon>
                删除
              </a>
            </div>
          </template>
        </a-table>
        <div class="divide-class-name">教学班数量</div>
        <!-- 分班方案编号 -->
        <div
          class="divide-num-list"
          v-for="(item, index) in schemeCourseList"
          :key="index"
        >
          <span class="name">分班方案编号: {{ item.divideClassCode }}</span>
          <ul class="divide-ul">
            <li
              class="divide-li"
              v-for="(item, index) in item.divideClassList"
              :key="index"
            >
              <span>{{ item.courseName }}：</span>
              <span>{{ item.courseNum }}个班</span>
            </li>
          </ul>
        </div>
        <!-- 学生走动率 -->
        <div class="student-walk">
          <span class="name" v-show="dataSource.length !== 0">学生走动率</span>
          <ul class="walk-ul">
            <li
              class="walk-li"
              v-for="(item, index) in stuWalkList"
              :key="index"
            >
              <span class="scheme-name">{{ item.reportName }}</span>
              <span class="stu-walk">学生走动率</span>
              <div class="stu-walk-pro">
                <a-progress
                  :percent="item.stuWalkPercent"
                  strokeColor="#1ba4b3"
                />
              </div>
              <div class="stu-walk-num">
                <div>
                  <span class="walk-class">走动班级：</span>
                  <span class="class-num">{{ item.walkClassNum }}个班</span>
                </div>
                <div>
                  <span class="walk-stu">走动学生：</span>
                  <span class="stu-num">{{ item.walkStuNum }}人</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- </a-spin> -->
    <SchemeDialog
      :chemeDialogVisible="chemeDialogVisible"
      @CloseModel="CloseModel"
      ref="SchemeDialog"
      :planGroupId="planGroupId"
      :compareList="dataSource.length"
      :divideSchemIdFilterList="divideSchemIdFilterList"
      @getSchemeReportList="getSchemeReportList"
    ></SchemeDialog>
    <!-- loading -->
    <a-spin :spinning="showLoading" class="show-loading" size="large" />
  </div>
</template>

<script>
import SchemeDialog from "./SchemeDialog/SchemeDialog";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
// 表头的数据
const columns = [
  {
    title: "分班方案名称",
    dataIndex: "schemeName",
    key: "schemeName", // 这个key可能会有问题，必须是唯一标识符，
    align: "left",
  },
  {
    title: "行政班数",
    dataIndex: "admClassNum",
    key: "admClassNum",
    align: "left",
  },
  {
    title: "选考班数",
    dataIndex: "chooseClassNum",
    key: "chooseClassNum",
    align: "left",
  },
  {
    title: "选考走班数量",
    dataIndex: "chooseWalkNum",
    key: "chooseWalkNum",
    align: "left",
  },
  {
    title: "学考班数",
    dataIndex: "studyClassNum",
    key: "studyClassNum",
    align: "left",
  },
  {
    title: "学考班走班数",
    dataIndex: "studyWalkNum",
    key: "studyWalkNum",
    align: "left",
  },
  // {
  //   title: "所需教室",
  //   dataIndex: "needClassNum",
  //   key: "needClassNum",
  //   align: "left",
  // },
  {
    title: "操作",
    scopedSlots: { customRender: "delete" },
    align: "left",
    width: 200,
    // colSpan:0,
    // className: "",
    // filterDropdownVisible: false,
  },
];
export default {
  name: "SchemeCompare",
  components: {
    SchemeDialog,
  },
  data() {
    return {
      dataSource: [], // 表格数据
      columns, // 表头数据
      schemeCourseList: [], // 分班课程列表
      stuWalkList: [], // 学生走读
      chemeDialogVisible: false, // 弹窗是否显示
      planGroupId: "", // 方案id
      divideSchemeList: [], // 分班方案id列表
      divideSchemIdFilterList: [], // 方案对比课程id
      showLoading: false,
      deleteShow: true, // 删除是否显示
    };
  },
  async mounted() {
    // 获取planGroupId
    this.planGroupId = this.$route.query.planGroupId;
    // 分班方案id列表
    this.divideSchemeList = JSON.parse(this.$route.query.divideSchemeList);
    // 获取方案报告对比
    await this.getSchemeReportList();
  },

  methods: {
    /**
     * @desc 获取方案报告对比
     */
    async getSchemeReportList(divideSchemIdList) {
      this.showLoading = true;
      let data = {};
      data.divideSchemeList = this.divideSchemeList.map((item) => item);
      if (divideSchemIdList) {
        this.divideSchemeList = this.divideSchemeList.concat(divideSchemIdList);
        // concat 返回一个新的数组，重新赋值给data.divideSchemeList
        // data.divideSchemeList = data.divideSchemeList.concat(divideSchemIdList);
        data.divideSchemeList = this.divideSchemeList.map((item) => item);
      }
      const res = await this.$api.getDivideClassList.getSchemeReportList(data);
      if (res.code === "200") {
        this.dataSource = res.data.schemeClassList;
        this.schemeCourseList = res.data.schemeCourseList;
        this.stuWalkList = res.data.stuWalkList;
        // let obj = {};
        // res.data.schemeClassList.forEach((item) => {
        //   obj = { ...obj, [item.divideSchemId]: true };
        // });
        this.divideSchemIdFilterList = res.data.schemeClassList.map(
          (item) => item.divideSchemId
        );
      }
      this.showLoading = false;
    },

    /**
     * @desc  删除-前端不显示
     * schemeName  方案id
     */
    deleteItem(record) {
      let { divideSchemId } = record;
      this.divideSchemeList = this.divideSchemeList.filter(
        (item) => item !== divideSchemId
      );
      this.getSchemeReportList();
    },

    /**
     * @desc 添加分组
     */
    addgroup() {
      this.chemeDialogVisible = true;
      this.$refs.SchemeDialog.getDivideClassTable();
    },

    /**
     * @desc 关闭弹窗
     */
    CloseModel(chemeDialogVisible) {
      this.chemeDialogVisible = !chemeDialogVisible;
    },

    /**
     * @desc 取消对比
     */
    cancelCompare() {
      this.$router.go(-1);
    },

    /**
     * @desc 导出分班方案报告
     */
    createPdf() {
      this.deleteShow = false;
      setTimeout(() => {
        let shareContent = document.getElementsByClassName("pdf-comtainer")[0], //需要截图的包裹的（原生的）DOM 对象
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
          PDF.save("分班方案报告对比" + ".pdf"); // 这里是导出的文件名
        });
      }, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.scheme-compare {
  // margin-top: 20px;
  width: 100%;
  // height: 100%;
  height: calc(100% - 100px);
  // overflow: hidden;
  // padding-bottom: 60px;
  box-sizing: border-box;
  position: relative;

  .head-title {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    height: 72px;
    align-items: center;
    padding: 10px 20px;
    box-sizing: border-box;

    .title {
      font-size: 28px;
    }
    .btn-style {
      margin-left: 13px;
    }
  }
  .scheme-table {
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: #fff;
    margin-top: 20px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    .btn-style {
      margin-bottom: 15px;
    }
  }
  .divide-class-name {
    color: #1ba4b3;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .divide-num-list {
    border: 1px solid #e8e8e8;
    margin-bottom: 10px;
    .name {
      // color: #1ba4b3;
      // font-size: 20px;
      font-size: 16px;
      margin-bottom: 10px;
      padding: 8px 0 0 8px;
      display: inline-block;
    }
    .divide-ul {
      display: flex;
      flex-wrap: wrap;
      background: #fafafa;
      width: 100%;
      height: auto;
      padding: 15px 10px 0;
      box-sizing: border-box;
      .divide-li {
        list-style: none;
        width: 15%;
        margin-bottom: 10px;
      }
    }
  }
  .student-walk {
    margin-top: 20px;
    .name {
      color: #1ba4b3;
      font-size: 20px;
      margin-bottom: 10px;
      display: inline-block;
      // font-weight: bold;
    }
    .walk-ul {
      display: flex;
      // justify-content: space-between;
      .walk-li {
        width: 32%;
        list-style: none;
        height: auto;
        padding: 10px 10px 16px;
        box-sizing: border-box;
        border: 1px solid #e8e8e8;
        margin-right: 70px;

        &:nth-of-type(3) {
          margin-right: 0px;
        }

        .scheme-name {
          font-size: 18px;
          display: block;
        }
        .stu-walk {
          display: block;
        }
        .stu-walk-pro {
          position: relative;
          height: 60px;
          /deep/ .ant-progress {
            height: 100%;
            .ant-progress-outer {
              position: absolute;
              top: 45%;
            }
          }
          /deep/ .ant-progress-text {
            color: #1ba4b3;
            font-size: 25px;
            top: 0;
            left: 0;
            position: absolute;
          }
        }
        .stu-walk-num {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  /deep/ td.notshow {
    display: none;
  }
  /deep/ th.notshow.ant-table-align-left.ant-table-row-cell-last {
    display: none;
  }
  .show-loading {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // background-color: #e6f7ff;
    // opacity: 0.5;
    /deep/ .ant-spin-dot {
      top: 50%;
    }
  }
  /deep/ .ant-progress-outer {
    margin-right: 0 !important;
    padding-right: 0 !important;
  }
  .op_daoru {
    margin-bottom: 1px;
    margin-right: 4px;
  }
}
</style>