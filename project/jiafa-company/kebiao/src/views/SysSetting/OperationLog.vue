<template>
  <div class="time-hour">
    <h3 class="title">操作日志</h3>
    <div class="condition">
      <a-form-model layout="inline">
        <a-form-model-item style="position: relative">
          <a-range-picker
            @change="onDateChange"
            :disabled-date="disabledDate"
            :getCalendarContainer="(v) => v.parentNode"
          >
            <template #suffixIcon>
              <svg-icon icon-class="com_calendar" style="margin-top: -8px" />
            </template>
          </a-range-picker>
        </a-form-model-item>
        <a-form-model-item>
          <a-form-model-item style="position: relative">
            <a-select
              default-value="all"
              style="width: 140px"
              v-model="operationItem"
              :getPopupContainer="(v) => v.parentNode"
            >
              <a-select-option
                v-for="item in operationItemList"
                :key="item.id"
                :value="item.id"
                >{{ item.title }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-item>
            <a-input
              placeholder="请输入操作人姓名"
              class="input-name"
              @change="inputChange"
              :maxLength="30"
            />
          </a-form-item>
        </a-form-model-item>

        <a-form-item>
          <a-button class="read-btn" type="primary" @click="searchBtn">
            <svg-icon icon-class="kstj-mss" class="mss" />
            查询
          </a-button>
        </a-form-item>
      </a-form-model>
    </div>
    <div class="content">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="tableLoading"
        :pagination="false"
        :row-key="(record) => record.id"
      >
        <template #operator="text">
          {{ text ? text : "--" }}
        </template>
        <template #name="text">
          <span>{{ text }}</span>
        </template>
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
const columns = [
  {
    title: "操作人",
    dataIndex: "operator",
    key: "operator",
    width: "10%",
    ellipsis: true,
    scopedSlots: { customRender: "operator" }
  },
  {
    title: "操作项",
    dataIndex: "operationItem",
    key: "operationItem",
    width: "10%",
    align: "left",
    ellipsis: true
  },
  {
    title: "操作内容",
    dataIndex: "operationContent",
    key: "operationContent",
    width: "65%",
    ellipsis: true
  },
  {
    title: "操作时间",
    dataIndex: "operationTime",
    key: "operationTime",
    width: "15%",
    ellipsis: true
  }
];
export default {
  name: "",
  components: {
    GloPagination
  },
  data() {
    return {
      keyWords: "",
      operationItemList: [
        { id: "0", title: "全部操作项" },
        { id: "1", title: "课表导入管理" },
        { id: "2", title: "课表调整" },
        { id: "3", title: "节次管理" }
      ],
      operationItem: "0",
      fetchData: {
        current: 1,
        pageSize: 10
      },
      rangeDate: {
        start: "",
        end: ""
      },
      /*  表格相关字段  */
      tableLoading: false,
      columns,
      tableData: [],
      gloTotal: 0,
      searchOperator: ""
    };
  },
  computed: {},
  mounted() {
    this.getOperationLogList();
  },
  methods: {
    // 导出Excel
    exportExcel() {
      this.$api.OperationLog.exportOperationLog().then((res) => {
        if (res.code === "200") {
          let BLOB = new Blob([res], {
            type: "application/vnd.ms-excel"
          });
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(BLOB);
          link.download = "课时统计表.xls";
          link.click();
          //释放内存
          window.URL.revokeObjectURL(link.href);
        }
      });
    },
    //日期范围选择事件
    onDateChange(date) {
      if (date.length !== 0) {
        this.rangeDate.start = date[0].format("YYYY-MM-DD");
        this.rangeDate.end = date[1].format("YYYY-MM-DD");
      } else {
        this.rangeDate.start = null;
        this.rangeDate.end = null;
      }
    },
    /**
     * @name: 名字查询
     * @msg:
     * @param {*} e
     * @return {*}
     */
    inputChange(e) {
      this.searchOperator = e.target.value;
    },
    //操作项改变
    operationItemChange() {
      this.getOperationLogList();
    },
    /**
     * @name:  查询
     * @msg:
     * @param {*}
     * @return {*}
     */
    searchBtn() {
      // this.getOperationLogList();
      this.onPageChange(1);
      this.$refs.gloPagination.initCurrent();
    },
    // 获取统计列表数据
    async getOperationLogList() {
      let data = {
        startTime: this.rangeDate.start,
        endTime: this.rangeDate.end,
        operationItem: this.operationItem,
        searchOperator: this.searchOperator,
        current: this.fetchData.current,
        pageSize: this.fetchData.pageSize
      };
      this.tableLoading = true;
      let res = await this.$api.OperationLog.getOperationLogList(data);
      if (res.code === "200") {
        this.tableLoading = false;
        this.tableData = res.data.list;
        this.gloTotal = res.data.pagination.total;
      } else {
        this.$message.error(res.message);
        this.tableLoading = fasle;
      }
    },
    // 表格页面改变事件
    onPageChange(current) {
      this.fetchData.current = current;
      this.$refs.gloPagination.clearJumperValue();
      this.getOperationLogList();
    },
    // 改变每页数量时更新显示
    sizeChange(current, size) {
      this.fetchData.current = current;
      this.fetchData.pageSize = size;
      this.getOperationLogList();
    },
    pressEnter(outCurrent) {
      this.fetchData.current = outCurrent;
      this.getOperationLogList();
    },
    moment,
    /**
     * @name:  日期限制
     * @msg:  限制条件为一年，当前时间到去年的当前时间
     * @param {*} current 当前时间
     * @return {*}
     */
    disabledDate(current) {
      // 获取去年得今天,格式以YYYY-MM-DD显示
      return (
        current <= moment().subtract(1, "year").subtract(1, "days") ||
        current > moment().endOf("day")
      );
    }
  }
};
</script>

<style scoped lang="less">
.time-hour {
  height: 100%;
  width: 100%;
  background-color: #fff;
  // padding: 8px;
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
  .title {
    color: #303233;
    font-size: 18px;
    font-weight: normal;
    margin: 0 0 10px;
  }
  /deep/ .ant-table-row-cell-break-word {
    padding-left: 25px;
  }
  // /deep/ .ant-table-row {
  //   background-color: #fff !important;
  // }
  // #fafbfc
  /deep/ .ant-table .ant-table-row-cell-break-word {
    background-color: inherit;
  }
  /deep/ .ant-table-thead {
    background-color: #fafbfc;
  }
}
</style>
