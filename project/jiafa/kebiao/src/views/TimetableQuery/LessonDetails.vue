<template>
  <div class="lesson-details">
    <div class="head">
      <div @click="goBack"
        style="width: 20px;">
        <svg-icon icon-class="com_back"
          class="ylc-back-icon" />
      </div>
      <span style="font-size: 18px; color: #303233; margin-left: 10px">课表详情</span>
    </div>
    <div class="ylc-info-content">
      <div class="info">
        <div class="ylc-info-item">
          <div class="ylc-info-title">时间</div>
          <div class="font-color-black">{{ info.dateDay }}</div>
        </div>
        <div class="ylc-info-item">
          <div class="ylc-info-title">节次</div>
          <div class="font-color-black">{{ info.lesSortName }}</div>
        </div>
        <div class="ylc-info-item">
          <div class="ylc-info-title">科目</div>
          <div class="font-color-black">{{ info.subjectName }}</div>
        </div>
        <div class="ylc-info-item">
          <div class="ylc-info-title">授课老师</div>
          <div class="font-color-black">{{ info.lesTeacher }}</div>
        </div>
        <div class="ylc-info-item">
          <div class="ylc-info-title">班级名称</div>
          <div class="font-color-black">{{ info.className }}</div>
        </div>
        <div class="ylc-info-item">
          <div class="ylc-info-title">授课地点</div>
          <div class="font-color-black">{{ info.lesPlace }}</div>
        </div>
        <div class="ylc-info-item">
          <div class="ylc-info-title">学生总人数</div>
          <div class="font-color-black">{{ total }}</div>
        </div>
      </div>
      <div class="ylc-export">
        <a-button class="ylc-export-btn"
          @click="exportLessDetail">
          <svg-icon iconClass="que_export"
            class="export-icon" />导出人员
        </a-button>
      </div>
      <!-- <div class="studentNum">
        <span>学生明细</span>
        <div class="draw">
          <div class="circle">
            <a-icon type="user" style="fontsize: 20px; color: #ffffff" />
          </div>
          <div class="ellipse">学生：{{ studentNum }}人</div>
        </div>
      </div> -->
      <div class="classInfo"
        v-for="item in classInfo"
        :key="item.classId">
        <template>
          <a-card :key="item.classId"
            :title="`${item.classType}:\u00A0\u00A0 ${item.className}\u00A0\u00A0\u00A0  ${item.classNum}人`"
            :bordered="false"
            style="width: 100%">
            <a-table class="stu-table"
              :columns="stuColumns"
              :data-source="item.studentList"
              :pagination="false"
              bordered
              :rowKey="(row,index) => index">
            </a-table>
          </a-card>
        </template>
      </div>
    </div>
  </div>
</template>
 
<script>
import { downloadFile } from "../../Utils/util";
import SvgIcon from '../../components/common/svgIcon.vue';
const stuColumns = [
  {
    title: "序号",
    dataIndex: "num",
    key: "num",
    width: 150
  },
  {
    title: "证件号",
    dataIndex: "idCard",
    key: "idCard",
    width: 250
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: 200
  }
];
export default {
  name: "",
  components: { SvgIcon },
  data() {
    return {
      infoLable: ["时间", "节次", "科目", "授课教师", "教学班", "授课地点"],
      info: {},
      classInfo: [],
      lesId: "",
      total: 0,
      studentNum: 50,
      stuColumns,
      stuTableLoading: false
    };
  },
  computed: {
    tableTitle() {
      return "行政班： 高三2020级1班 10人";
    }
  },
  created() {
    this.lesId = JSON.parse(this.$route.query.text);
    this.getTableInfo();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取课表详情
    async getTableInfo() {
      const res = await this.$api.MyTimetable.getLessonDetail({
        lesId: this.lesId
      });
      if (res.code === "200" || res.code === 200) {
        this.info = res.data.info;
        this.classInfo = res.data.classInfo;
        this.total = res.data.total
      } else {
        this.$message.warn(res.message);
        this.highSchoolTableLoading = false;
      }
    },
    // 导出课表详情
    async exportLessDetail() {
      const res = await this.$api.MyTimetable.exportLessDetail({
        lesId: this.lesId
      });

      downloadFile(res, "1", (message) => {
        this.$message.warning(message);
      });
    }
  }
};
</script>
 
<style scoped lang="less">
.lesson-details {
  background-color: #fff;
  .head {
    height: 56px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e1e3e5;
    padding: 0 24px;
    .ylc-back-icon {
      width: 22px;
      height: 22px;
      color: #919599;
    }
    & > span {
      font-size: 18px;
      color: #303233;
      margin-left: 10px;
    }
  }
  .ylc-info-content {
    padding: 23px 24px;
    .info {
      display: flex;
      justify-content: space-around;
      height: 96px;
      padding: 0 22px;
      background: #f7f8fa;
      .ylc-info-item {
        margin: auto 0;
        .ylc-info-title {
          color: #616366;
          font-size: 16px;
        }
        .font-color-black {
          color: #303233;
          font-size: 18px;
          margin-top: 8px;
        }
      }
    }
    .studentNum {
      height: 90px;
      display: flex;
      align-items: center;
      & > span {
        font-size: 16px;
        color: black;
      }
      .draw {
        height: 42px;
        display: flex;
        align-items: center;
        margin-left: 20px;
        position: relative;
        .circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2bc17d;
          border: 4px solid #dff6ec;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 1px;
        }
        .ellipse {
          width: 150px;
          height: 28px;
          background: #dff6ec;
          border-radius: 30px;
          color: #2bc17d;
          padding-left: 48px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  /deep/ .ant-table-thead > tr > th {
    padding-left: 24px;
  }
  /deep/ .ant-table-tbody > tr > td {
    padding-left: 24px;
  }
  .ylc-export {
    width: 100%;
    text-align: right;
    margin-top: 20px;
    position: relative;
    .ylc-export-btn {
      position: absolute;
      right: 0px;
      top: 0px;
      z-index: 1000;
      width: 112px;
      background-color: #2abf8e;
      color: #fff;
      .export-icon {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }
  }
  .classInfo {
    /deep/.ant-card {
      margin-bottom: 6px;
    }
    /deep/.ant-card-head {
      margin-top: 20px;
      min-height: 38px;
      padding: 0;
      border-bottom: none;
      margin-bottom: 5px;
      .ant-card-head-title {
        padding: 0;
        font-size: 16px;
        font-weight: bold;
        color: #303233;
      }
    }
    /deep/.ant-card-body {
      padding: 0;
    }
  }
  /deep/ .ant-table-tbody > tr > td {
    height: 48px;
    line-height: 48px;
  }
}
</style>