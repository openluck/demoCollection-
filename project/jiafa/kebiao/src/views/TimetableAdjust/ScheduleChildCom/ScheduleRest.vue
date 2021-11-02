<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-08-05 16:57:48
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-28 15:21:05
-->
<template>
  <div class="ScheduleRest">
    <div class="ScheduleRestT">
      <div class="conditionOrg">
        <!-- 学年 -->
        <div style="position: relative">
          <a-select
            v-model="search.schoolYearId"
            style="width: 180px"
            @change="changeSchoolYearList"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option
              v-for="item in schoolYearList"
              :key="item.schoolYearId"
              :value="item.schoolYearId"
            >
              {{ item.schoolYearName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <!-- 学期 -->
        <div style="position: relative">
          <a-select v-model="search.semesterId" style="width: 180px">
            <a-select-option
              v-for="item in semesterList"
              :key="item.semesterId"
              :value="item.semesterId"
              :getPopupContainer="(v) => v.parentNode"
            >
              {{ item.semesterName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg" @click="searchBtn">
        <a-button type="primary">搜索</a-button>
      </div>
    </div>
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.changeId"
        :pagination="false"
        :scroll="{ y: tableHeight }"
        :loading="tableLoading"
      >
        <template #createBy="text">
          {{ text ? text : "--" }}
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
const columns = [
  {
    title: "事件",
    dataIndex: "event",
    key: "event",
    width: "10%",
    ellipsis: true,
  },
  {
    title: "内容",
    dataIndex: "content",
    key: "content",
    width: "55%",
    ellipsis: true,
  },
  {
    title: "影响年级",
    dataIndex: "effectiveRange",
    key: "effectiveRange",
    width: "10%",
    ellipsis: true,
  },
  {
    title: "操作时间",
    dataIndex: "timestamp",
    key: "timestamp",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "操作人",
    dataIndex: "createBy",
    key: "createBy",
    width: "10%",
    ellipsis: true,
    scopedSlots: { customRender: "createBy" },
  },
];
export default {
  name: "ScheduleRest",
  components: { GloPagination },
  data() {
    return {
      columns,
      tableHeight: 0,
      tableLoading: false,
      dataList: [],
      search: {
        schoolYearId: null, //学年
        semesterId: null, //学期
        current: 1,
        pageSize: 10,
        changeType: "6",
      },
      semesterList: [],
      schoolYearList: [],
      gloTotal: 0,
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    // 初始化下拉框数据
    async init() {
      // 获取学年
      this.schoolYearList = JSON.parse(
        sessionStorage.getItem("schoolYearList")
      );
      this.schoolYearList.map((item, indexYear) => {
        if (item.isCurrentSchoolYear) {
          this.search.schoolYearId =
            this.schoolYearList[indexYear].schoolYearId;
          // 获取学期
          this.semesterList = this.schoolYearList[indexYear].semesterList;
          this.semesterList.map((item, indexSemester) => {
            if (item.isCurrentSchoolSemester) {
              this.search.semesterId =
                this.semesterList[indexSemester].semesterId;
            }
          });
        }
      });

      await this.getList();
    },
    // 通过学年获取学期
    getSemesterList(value) {
      this.schoolYearList.map((item) => {
        if (item.schoolYearId === value) {
          this.semesterList = item.semesterList;
        }
      });
      this.search.semesterId = this.semesterList[0].semesterId;
    },
    // 学年change事件
    changeSchoolYearList(value) {
      this.search.semesterId = null;
      this.getSemesterList(value);
    },
    // 判断下拉框有无值
    judgeHasValue() {
      if (this.search.schoolYearId === null) {
        this.$message.warning("请选择学年");
        return;
      }
      if (this.search.semesterId === null) {
        this.$message.warning("请选择学期");
        return;
      }
      return true;
    },

    // 获取表格数据
    async getList() {
      let pd = this.judgeHasValue();
      if (pd) {
        this.tableLoading = true;
        try {
          const res = await this.$api.common.getRecordList({
            ...this.search,
          });
          if (res.code === "200") {
            this.dataList = res.data.list;
            this.gloTotal = res.data.pagination.total;
          } else {
            this.$message.warning(res.message);
          }
        } catch (error) {
          this.$message.error("请求失败！" + error);
        } finally {
          this.tableLoading = false;
        }
      }
    },

    // 查询
    searchBtn() {
      this.onPageChange(1);
      this.$refs.gloPagination.initCurrent();
      // this.getClassHourStatisticList();
    },

    // 表格页面改变事件
    onPageChange(current, size) {
      this.search.current = current;
      this.idList = [];
      this.$refs.gloPagination.clearJumperValue();
      this.getList();
    },
    // 改变每页数量时更新显示
    sizeChange(current, size) {
      this.search.current = current;
      this.search.pageSize = size;
      this.getList();
    },
    // 快速切换页面
    pressEnter(outCurrent) {
      this.search.current = outCurrent;
      this.getList();
    },
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list");
      this.tableHeight = tableHeight.clientHeight - 55 - 50;
    },
  },
};
</script>

<style scoped lang="less">
.ScheduleRest {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px 24px;
  box-sizing: border-box;
  .ScheduleRestT {
    width: 100%;
    height: 34px;
    display: flex;
    margin-bottom: 20px;
    .conditionOrg {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
    .conditionOrgr {
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
  .list {
    flex-grow: 1;
    overflow-y: auto;
  }
  /deep/ .ant-table-row-cell-break-word {
    padding-left: 25px;
  }
  /deep/ .ant-table .ant-table-row-cell-break-word {
    background-color: inherit;
  }
  /deep/ .ant-table-thead {
    background-color: #fafbfc;
  }
}
</style>
