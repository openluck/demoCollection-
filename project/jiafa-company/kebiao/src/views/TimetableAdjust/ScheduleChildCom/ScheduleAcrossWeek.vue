<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-08-05 17:13:02
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-12 17:18:15
-->
<template>
  <div class="ScheduleStudent">
    <div class="ScheduleStudentT">
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
          <a-select
            v-model="search.semesterId"
            style="width: 180px"
            @change="chaneSemester"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option
              v-for="item in semesterList"
              :key="item.semesterId"
              :value="item.semesterId"
            >
              {{ item.semesterName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <!-- 学段 -->
        <div style="position: relative">
          <a-select
            v-model="search.secId"
            style="width: 180px"
            @change="changeSecList"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option
              v-for="item in secList"
              :key="item.secId"
              :value="item.secId"
            >
              {{ item.secName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <!-- 年级 -->
        <div style="position: relative">
          <a-select
            v-model="search.gradeId"
            style="width: 180px"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option :value="''">全部年级</a-select-option>
            <a-select-option
              v-for="item in gradeList"
              :key="item.gradeId"
              :value="item.gradeId"
            >
              {{ item.gradeName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <!-- 班级名称 -->
        <div style="position: relative">
          <a-select
            v-model="search.classId"
            show-search
            :filter-option="filterOption"
            style="width: 180px"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option :value="''">全部班级</a-select-option>
            <a-select-option
              v-for="item in classList"
              :key="item.classId"
              :value="item.classId"
            >
              {{ item.className }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <a-button type="primary" @click="searchBtn">搜索</a-button>
      </div>
    </div>
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.changeId"
        :pagination="false"
        :loading="tableLoading"
      >
        <!-- <template v-slot:createBy="text"> -->
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
const columns = [
  {
    title: "调换课班级",
    dataIndex: "changeObject",
    key: "changeObject",
    ellipsis: true,
    width: "10%",
  },
  {
    title: "内容",
    dataIndex: "content",
    key: "content",
    ellipsis: true,
    width: "55%",
  },
  {
    title: "影响周次",
    dataIndex: "effectiveRange",
    key: "effectiveRange",
    ellipsis: true,
    width: "10%",
  },
  {
    title: "操作时间",
    dataIndex: "timestamp",
    key: "timestamp",
    ellipsis: true,
    width: "15%",
  },
  {
    title: "操作人",
    dataIndex: "createBy",
    key: "createBy",
    ellipsis: true,
    width: "10%",
    scopedSlots: { customRender: "createBy" },
  },
];
import GloPagination from "@/components/common/GloPagination";
export default {
  name: "ScheduleStudent",
  components: { GloPagination },
  data() {
    return {
      columns,
      tableLoading: false,
      dataList: [],
      search: {
        schoolYearId: null, //学年id
        semesterId: null, //学期id
        secId: null, // 学段id
        gradeId: null, //年级id
        classId: null, //班级id
        current: 1,
        pageSize: 10,
        changeType: "2",
      },
      secList: [], // 学段列表
      gradeList: [], // 年级列表
      schoolYearList: [], // 学年列表
      semesterList: [], // 学期列表
      classList: [], // 班级
      gloTotal: 0,
    };
  },
  computed: {},
  created() {},
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

      // this.search.semesterId = this.semesterList[0].semesterId;
      // 通过学年学期获取学段，班级，学生，
      await this.getGradeList();
      // 初始化获取url中的secId
      let secId = this.$route.query.secId;
      if (secId) {
        this.search.secId = secId;
        this.secList.map((item) => {
          if (item.secId === secId) {
            this.gradeList = item.gradeList;
            this.classList = this.gradeList[0].classList;
          }
        });
      }
      // 年级默认全部
      this.search.gradeId = "";
      // 班级默认全部
      this.search.classId = "";
      this.getList();
    },
    // 学年change事件 清空学期，学段，班级，学生
    changeSchoolYearList(value) {
      this.search.semesterId = null;
      this.semesterList = [];
      this.search.gradeId = null;
      this.gradeList = [];
      this.search.secId = null;
      this.secList = [];
      this.search.classId = null;
      this.classList = [];
      // 通过学年获取学期
      this.schoolYearList.map((item) => {
        if (item.schoolYearId === value) {
          this.semesterList = item.semesterList;
        }
      });
      this.search.semesterId = this.semesterList[0].semesterId;
      this.getGradeList();
    },
    // 通过学年,学期获取学段，班级，学生，
    async getGradeList() {
      const { schoolYearId, semesterId } = this.search;
      try {
        const res = await this.$api.common.getGradeList({
          schoolYearId,
          semesterId,
          appId: sessionStorage.getItem("appId")
        });
        if (res.code === "200") {
          // 学段列表
          this.secList = res.data;
          //
          let secId = this.$route.query.secId;
          if (secId) {
            this.search.secId = secId;
          } else {
            this.search.secId = this.secList[0].secId;
          }
          //
          // this.search.secId = this.secList[0].secId;
          // 年级列表 -默认为全部-空字符串
          this.gradeList = this.secList[0].gradeList;
          this.search.gradeId = "";
          this.classList = this.gradeList[0].classList;
          this.search.classId = "";
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 学期事件
    chaneSemester() {
      this.getGradeList();
    },
    // 学段change事件 改变学段 获取年级
    changeSecList(value) {
      this.search.gradeId = null;
      this.gradeList = [];
      this.search.classId = null;
      this.classList = [];
      this.secList.map((item, index) => {
        if (item.secId === value) {
          // 年级 "" 为全部
          this.gradeList = this.secList[index].gradeList;
          this.search.gradeId = "";
          // 班级 "" 为全部
          this.classList = this.gradeList[0].classList;
          this.search.classId = "";
        }
      });
    },

    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 判断下拉框有无值
    judgeHasValue() {
      if (this.search.schoolYearId === null) {
        this.$message.warning("请选择学年");

        return false;
      }
      if (this.search.semesterId === null) {
        this.$message.warning("请选择学期");

        return false;
      }
      if (this.search.secId === null) {
        this.$message.warning("请选择学段");

        return false;
      }
      if (this.search.gradeId === null) {
        this.$message.warning("请选择年级");

        return false;
      }
      if (this.search.classId === null) {
        this.$message.warning("请选择班级");

        return false;
      }
      return true;
    },

    // 获取表格数据
    async getList() {
      let pd = this.judgeHasValue();
      if (pd) {
        this.tableLoading = true;

        // 不传学段字段
        let data = {};
        for (var i in this.search) {
          data[i] = this.search[i];
        }
        // delete data.secId;
        try {
          const res = await this.$api.common.getRecordList(data);
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
  },
};
</script>

<style scoped lang="less">
.ScheduleStudent {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px 24px;
  box-sizing: border-box;
  .ScheduleStudentT {
    width: 100%;
    // height: 34px;
    display: flex;
    height: auto;
    flex-wrap: wrap;
    .conditionOrg {
      // height: 100%;
      margin-right: 20px;
      margin-bottom: 20px;
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
