<template>
  <div class="ScheduleTipsay">
    <div class="ScheduleTipsayT">
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
        <!-- 学科 -->
        <div style="position: relative">
          <a-select
            v-model="search.subjectId"
            style="width: 180px"
            @change="changeSubject"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option :value="''">全部科目</a-select-option>
            <a-select-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :value="item.subjectId"
            >
              {{ item.subjectName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <!-- 教师 -->
        <div style="position: relative">
          <a-select
            v-model="search.personId"
            style="width: 180px"
            show-search
            :filter-option="filterOption"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option :value="''">全部教师</a-select-option>
            <a-select-option
              v-for="item in teacherList"
              :key="item.personId"
              :value="item.personId"
            >
              {{ item.teacherName }}
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
    title: "被代课教师",
    dataIndex: "changeObject",
    key: "changeObject",
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
    title: "影响周次",
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
import GloPagination from "@/components/common/GloPagination";
export default {
  name: "ScheduleTipsay",
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
        subjectId: null, // 学科id
        personId: null, // 老师id
        current: 1,
        pageSize: 10,
        changeType: "3",
      },
      schoolYearList: [], // 学年列表
      semesterList: [], // 学期列表
      secList: [], // 学段列表
      subjectList: [], // 课目列表
      teacherList: [], // 教师列表
      gloTotal: 0,
    };
  },
  created() {},
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
      // 获取学段
      this.secList = JSON.parse(sessionStorage.getItem("secList"));
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
      } else {
        this.search.secId = this.secList[0].secId;
      }

      // 获取学科
      await this.getSubjecByStudySec(this.search.secId);
      this.search.subjectId = "";
      // 获取教师
      await this.getTeacherBySubject();
      this.search.personId = "";
      this.getList();
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
      debugger;
      this.search.semesterId = null;
      this.getSemesterList(value);
    },
    // 学段change事件
    changeSecList(value) {
      this.getSubjecByStudySec(value);
    },
    // 通过学段获取学科
    async getSubjecByStudySec(value) {
      let data = {
        secId: value,
      };
      try {
        const res = await this.$api.common.getSubjecByStudySec(data);
        if (res.code === "200") {
          this.subjectList = res.data;
          this.search.subjectId = "";
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.warning("请求失败", error);
      }
      this.getTeacherBySubject();
    },
    // 学科change事件
    changeSubject() {
      this.search.personId = null;
      this.getTeacherBySubject();
    },
    // 通过学科获取教师
    async getTeacherBySubject() {
      // debugger;
      let data = {
        secId: this.search.secId,
        subjectId: this.search.subjectId,
      };
      try {
        const res = await this.$api.common.getTeacherBySub(data);
        if (res.code === "200") {
          this.teacherList = res.data;
          // this.teacherList.map(item=>{return {: item.teacherId,personId:item.personId}})
          this.teacherList = JSON.parse(
            JSON.stringify(this.teacherList).replace(/teacherId/g, "personId")
          ); //data为数组，title为修改前，name为修改后
          this.search.personId = "";
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.warning("请求失败", error);
      }
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
      if (this.search.subjectId === null) {
        this.$message.warning("请选择科目");
        return false;
      }
      if (this.search.personId === null) {
        this.$message.warning("请选择教师");
        return false;
      }
      return true;
    },

    // 获取表格数据
    async getList() {
      let pd = this.judgeHasValue();
      if (pd) {
        this.tableLoading = true;
        let data = {
          schoolYearId: this.search.schoolYearId, //学年id
          semesterId: this.search.semesterId, //学期id
          secId: this.search.secId, // 学段id
          subjectId: this.search.subjectId, // 学科id
          personId: this.search.personId, // 老师id
          current: this.search.current,
          pageSize: this.search.pageSize,
          changeType: "3",
        };
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
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
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
.ScheduleTipsay {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px 24px;
  box-sizing: border-box;
  .ScheduleTipsayT {
    width: 100%;
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
