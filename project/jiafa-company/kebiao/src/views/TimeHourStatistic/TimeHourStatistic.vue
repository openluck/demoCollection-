<template>
  <div class="time-hour">
    <h3 class="title">课时统计</h3>
    <div class="condition">
      <a-form layout="inline">
        <!-- 学段 -->
        <a-form-item style="position: relative">
          <a-select
            style="width: 120px"
            v-model="fetchData.secId"
            @change="secChange"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option
              v-for="item in secList"
              :key="item.secId"
              :value="item.secId"
              >{{ item.secName }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <!-- 科目 -->
        <a-form-item style="position: relative">
          <a-select
            style="width: 120px"
            v-model="fetchData.subject"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option :value="'All'">全部科目</a-select-option>
            <a-select-option
              v-for="item in subjectList"
              :key="item.subject"
              :value="item.subject"
              >{{ item.subjectName }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item style="position: relative">
          <a-range-picker
            @change="onDateChange"
            :disabled-date="disabledDate"
            :allowClear="false"
            :getCalendarContainer="(v) => v.parentNode"
            :default-value="[
              moment(nowSemesterStartDate),
              moment(nowSemesterEndDate),
            ]"
          >
            <template #suffixIcon>
              <svg-icon icon-class="com_calendar" style="margin-top: -8px" />
            </template>
          </a-range-picker>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="请输入姓名"
            class="input-name"
            @change="inputChange"
            :maxLength="30"
          />
        </a-form-item>
        <a-form-item>
          <a-button class="read-btn" type="primary" @click="searchBtn">
            <svg-icon icon-class="kstj-mss" class="mss" />
            查询
          </a-button>
        </a-form-item>
      </a-form>
      <span class="export">
        <a-button type="primary" @click="exportExcel">
          <svg-icon icon-class="kstj-mdc" class="mss" />导出表格</a-button
        >
      </span>
    </div>
    <div class="content">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="tableLoading"
        :row-key="(record) => record.personId"
      >
        <template v-slot:idcardNo="text">
          <!-- {{ text ? (text | idcardNo) : "--" }} -->
          {{ text | idcardNoFormat }}
        </template>
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
      <glo-pagination
        :total="gloTotal"
        @onChange="onPageChange"
        ref="gloPagination"
        @onSizeChange="sizeChange"
        @pressEnter="pressEnter"
      ></glo-pagination>
    </div>
  </div>
</template>
<script>
import GloPagination from "@/components/common/GloPagination";
import moment from "moment";
// import { downloadFile } from "@/Utils/util";
const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: "30%",
    ellipsis: true,
  },
  {
    title: "证件号码",
    dataIndex: "idcardNo",
    key: "idcardNo",
    width: "30%",
    ellipsis: true,
    scopedSlots: { customRender: "idcardNo" },
  },
  // {
  //   title: "工号",
  //   dataIndex: "workNum",
  //   key: "workNum",
  //   width: "20%",
  //   ellipsis: true,
  // },
  {
    title: "科目",
    dataIndex: "subject",
    key: "subject",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "总课时数",
    dataIndex: "classHourTotal",
    key: "classHourTotal",
    width: "20%",
    ellipsis: true,
  },
];
export default {
  name: "TimeHourStatic",
  components: { GloPagination },
  data() {
    return {
      keyWords: "",
      secList: [], // 学段列表
      subjectList: [], // 科目列表
      fetchData: {
        current: 1,
        pageSize: 10,
        secId: null,
        subject: null,
        searchValue: "",
        endDate: "",
        endDate: "",
        startDate: "",
      },
      columns,
      tableData: [],
      gloTotal: null,
      tableLoading: false,
      currentSchoolYear: {
        schoolYearStartTime: null,
        schoolYearEndTime: null,
      },
      nowSemesterEndDate: "",
      nowSemesterStartDate: "",
    };
  },
  filters: {
    idcardNoFormat: (text) => {
      if (!text) return "--";
      // 保留头尾四位，中间为*
      if (text) {
        let reg = /^(.{4})(?:\d+)(.{4})$/;
        let str = text.replace(reg,"$1**********$2");
        return str;
      }
    },
  },
  async mounted() {
    //获取当前学期结束时间

    // 在sessionStorage获取学段
    this.secList = JSON.parse(sessionStorage.getItem("secList"));
    this.fetchData.secId = this.secList[0].secId;
    // 根据默认学段获取科目
    await this.getSubjecByStudySec(this.fetchData.secId);
    await this.getClassHourStatisticList();
  },
  created() {
    // 默认时间
    this.nowSemesterStartDate = JSON.parse(
      sessionStorage.getItem("nowSemester")
    ).semesterStartTime;
    this.nowSemesterEndDate = JSON.parse(
      sessionStorage.getItem("nowSemester")
    ).semesterEndTime;
    // 获取学年学期、学段年级
    this.getBasicList();
    // 时间参数
    this.fetchData.startDate = moment(this.nowSemesterStartDate).format(
      "YYYY-MM-DD"
    );
    this.fetchData.endDate = moment(this.nowSemesterEndDate).format(
      "YYYY-MM-DD"
    );
  },
  methods: {
    /**
     * @name: 名字查询
     * @msg:
     * @param {*} e
     * @return {*}
     */
    inputChange(e) {
      this.fetchData.searchValue = e.target.value;
    },
    //日期范围选择事件
    onDateChange(date) {
      if (date.length !== 0) {
        this.fetchData.startDate = date[0].format("YYYY-MM-DD");
        this.fetchData.endDate = date[1].format("YYYY-MM-DD");
      } else {
        this.fetchData.startDate = null;
        this.fetchData.endDate = null;
      }
    },
    //学段change事件，置空年级
    secChange(value) {
      this.fetchData.subject = null;
      this.subjectList = [];
      this.getSubjecByStudySec(value);
    },
    /**
     * @name: 根据学段获取科目
     * @msg:
     * @param {*} secId
     * @return {*}
     */
    async getSubjecByStudySec(secId) {
      try {
        const res = await this.$api.common.getSubjecByStudySec({ secId });
        if (res.code === "200") {
          // this.subjectList = res.data;
          this.subjectList = JSON.parse(
            JSON.stringify(res.data).replace(/subjectId/g, "subject")
          ); //data为数组，title为修改前，name为修改后
          // 课时统计 全部为All
          this.fetchData.subject = "All";
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.warning(error);
      }
    },

    /**
     * @name:  获取学年学期、学段年级，
     * @msg:
     * @param {*}
     * @return {*}
     */
    getBasicList() {
      let schoolYearList = JSON.parse(sessionStorage.getItem("schoolYearList"));
      schoolYearList.map((item) => {
        if (item.isCurrentSchoolYear) {
          this.currentSchoolYear.schoolYearStartTime = moment(
            item.schoolYearStartTime
          );
          this.currentSchoolYear.schoolYearEndTime = moment(
            item.schoolYearEndTime
          );
        }
      });
    },
    moment,
    /**
     * @name:  限制选择的时间
     * @msg: 通过当前学年来判断可以选择的时间，当前学年的开始时间，结束时间
     * @param {*} current 当前时间
     * @return {*}
     */
    disabledDate(current) {
      return (
        this.currentSchoolYear.schoolYearEndTime < current ||
        current < this.currentSchoolYear.schoolYearStartTime
      );
    },
    // 导出Excel
    async exportExcel() {
      if (this.tableData.length !== 0) {
        const res = await this.$api.TimeHourStatistic.exportClassStatisticExcel(
          {
            ...this.fetchData,
          }
        );
        if (res) {
          let fileName = "课时统计";
          this.downloadFile(res, fileName);
        } else {
          this.$message.warning(res.message);
        }
      } else {
        this.$message.warning("数据为空,无法导出表格");
      }
    },

    //下载文件
    downloadFile(res, fileName) {
      let BLOB = new Blob([res.blob], {
        type: "application/vnd.ms-excel",
      });
      // let fileName = res.headers["content-disposition"]
      //   .split(";")[2]
      //   .split("=")[1]
      //   .split("''")[1];
      // fileName = getCharFromUtf8(fileName);
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(BLOB);

      link.download = fileName;

      const uA = window.navigator.userAgent;
      const isIE =
        /msie\s|trident\/|edge\//i.test(uA) &&
        !!(
          "uniqueID" in document ||
          "documentMode" in document ||
          "ActiveXObject" in window ||
          "MSInputMethodContext" in window
        );
      if (isIE) {
        navigator.msSaveBlob(new Blob([res.blob]), fileName);
      } else {
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    },
    // 查询
    searchBtn() {
      this.onPageChange(1);
      this.$refs.gloPagination.initCurrent();
      // this.getClassHourStatisticList();
    },
    // 获取统计列表数据
    async getClassHourStatisticList() {
      this.tableLoading = true;
      let res = await this.$api.TimeHourStatistic.getClassHourStatisticList({
        ...this.fetchData,
      });
      try {
        if (res.code === "200") {
          this.tableData = res.data.list;
          this.gloTotal = res.data.pagination.total;
        } else {
          this.tableData = [];
          this.gloTotal = 0;
          this.$message.warning(res.message);
        }
        this.tableLoading = false;
      } catch (error) {
        this.$message.warning("请求失败", error);
      }
    },
    // 表格页面改变事件
    onPageChange(current) {
      this.fetchData.current = current;
      this.$refs.gloPagination.clearJumperValue();
      this.getClassHourStatisticList();
    },
    // 改变每页数量时更新显示
    sizeChange(current, size) {
      this.fetchData.current = current;
      this.fetchData.pageSize = size;
      this.getClassHourStatisticList();
    },
    pressEnter(outCurrent) {
      this.fetchData.current = outCurrent;
      this.getClassHourStatisticList();
    },
  },
};
</script>
 
<style scoped lang = "less">
.time-hour {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 15px 24px 8px 24px;
  .condition {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .export {
      margin-right: 24px;
    }
  }
  .content {
    margin-top: 16px;
    /deep/ .even-row {
      background-color: #f7f8fa;
    }
  }
  .mss {
    vertical-align: -0.3em;
    margin-right: 6px;
  }
  .input-name {
    width: 168px;
  }
  .title {
    color: #303233;
    font-size: 18px;
    font-weight: normal;
    margin: 0 0 10px;
  }
  /deep/ .ant-table-row-cell-break-word {
    padding-left: 25px;
  }
  /deep/ .ant-table-row-cell-break-word {
    background-color: inherit;
  }
  /deep/ .ant-table-thead {
    background-color: #fafbfc;
  }
}
</style>