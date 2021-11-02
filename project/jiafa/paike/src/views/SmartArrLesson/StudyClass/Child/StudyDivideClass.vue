<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-08 10:57:38
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-12 15:22:17
-->
<template>
  <div class="divide-class">
    <div>
      <!-- 周次 -->
      <a-select
        v-model="selectData.weekSort"
        style="width: 350px"
        @change="handleWeekChange"
      >
        <a-select-option :value="0">==请选择==</a-select-option>
        <a-select-option
          :value="item"
          v-for="item in studyClassWeekList"
          :key="item"
          >{{ item }}</a-select-option
        >
      </a-select>
      <!-- 节次 -->
      <a-select
        v-model="selectData.sort"
        style="width: 350px"
        @change="handleSectionChange"
      >
        <a-select-option :value="0">==请选择==</a-select-option>
        <a-select-option
          :value="item"
          v-for="item in studyClassSectionList"
          :key="item"
          >{{ item }}</a-select-option
        >
      </a-select>
      <a-input
        placeholder="请输入班级名称"
        style="width: 150px; margin-right: 15px"
        v-model="fatchData.className"
      />
      <a-button type="primary" @click="search">查询</a-button>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :rowKey="(row) => row.arrLessonId"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ y: 'calc(100vh - 400px)' }"
      >
        <!-- :row-selection="{
          selectedRowKeys: selectIdList,
          onChange: onSelectChange,
        }" -->
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: "班级名称",
    dataIndex: "studyClassName",
    key: "studyClassName",
    align: "center",
    width: "10%",
  },
  {
    title: "班级总人数",
    dataIndex: "number",
    key: "number",
    align: "center",
  },
  {
    title: "星期",
    dataIndex: "weekName",
    key: "weekName",
    align: "center",
  },
  {
    title: "节次",
    dataIndex: "sectionName",
    key: "sectionName",
    align: "center",
  },
  // {
  //   title: "授课教室",
  //   dataIndex: "studyClassName",
  //   key: "studyClassName",
  //   align: "center",
  // },
  // {
  //   title: "教室容量",
  //   dataIndex: "number",
  //   key: "number",
  //   align: "center",
  // },
];
export default {
  data() {
    return {
      columns,
      loading: false,
      selectIdList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total) => `共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 页数切换
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      tableData: [],
      selectData: {
        // model绑定
        weekSort: 0,
        sort: 0,
      },
      fatchData: {
        // 参数
        weekSort: 0,
        sort: 0,
        className: "",
        planId: this.$route.query.planId,
      },
      studyClassWeekList: {},
      studyClassSectionList: {},
    };
  },
  async mounted() {
    // 获取周次
    await this.getStudyClassWeek();
    // 根据周次获取节次
    await this.getStudyClassSection();
    // 获取表格数据
    await this.getClassListPaging();
  },
  methods: {
    /**
     * @name: 切换页数
     * @msg:
     * @param {*} page 切换到的页数
     * @param {*} pageSize
     * @return {*}
     */
    onPageChange(page) {
      this.pagination.current = page;
      this.getClassListPaging();
      this.selectIdList = [];
    },
    /**
     * @name: 切换页面数据条数
     * @msg:
     * @param {*} page 切换到的页数
     * @param {*} pageSize
     * @return {*}
     */
    onShowSizeChangeMethod(page, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.selectIdList = [];
      this.getClassListPaging();
    },
    /**
     * @name: 查询按钮
     * @msg:
     * @param {*}
     * @return {*}
     */
    search() {
      this.getClassListPaging();
    },
    /**
     * @name: 表格选择框
     * @msg:
     * @param {*}
     * @return {*}
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
    },
    /**
     * @name: 获取表格列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getClassListPaging() {
      this.loading = true;
      let data = {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        planId: this.fatchData.planId,
        weekSort: this.fatchData.weekSort,
        sort: this.fatchData.sort,
        className: this.fatchData.className,
      };
      try {
        const res = await this.$api.ArrlessonList.getClassListPaging(data);
        if (res.code === "200") {
          this.tableData = res.data.list;
          this.pagination.total = res.data.pagination.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.loading = false;
      }
    },
    /**
     * @name: 周次下拉框
     * @msg:
     * @param {*} value
     * @return {*}
     */
    handleWeekChange(value) {
      // 传入的value 为字符串，所以请选择  应该判断为 字符串0
      // weekSort参数 为 Number
      if (value === 0) {
        this.fatchData.weekSort = 0;
      } else {
        let obj = this.studyClassWeekList;
        for (const key in obj) {
          if (obj[key] === value) {
            this.fatchData.weekSort = Number(key);
          }
        }
      }
      this.selectData.sort = 0;
      this.fatchData.sort = 0;
      this.getStudyClassSection();
    },
    /**
     * @name: 节次下拉框
     * @msg:
     * @param {*} value
     * @return {*}
     */
    handleSectionChange(value) {
      if (value === 0) {
        this.fatchData.sort = 0;
      } else {
        let obj = this.studyClassSectionList;
        for (const key in obj) {
          if (obj[key] === value) {
            this.fatchData.sort = Number(key);
          }
        }
      }
    },
    /**
     * @name: 获取周次列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getStudyClassWeek() {
      let data = {
        planId: this.fatchData.planId,
      };
      try {
        const res = await this.$api.ArrlessonList.GetStudyClassWeek(data);
        if (res.code === "200") {
          // 返回的位一个对象
          this.studyClassWeekList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    /**
     * @name: 根据周次获取节次
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getStudyClassSection() {
      let data = {
        planId: this.fatchData.planId,
        weekSort: this.fatchData.weekSort,
      };
      try {
        const res = await this.$api.ArrlessonList.GetStudyClassSection(data);
        if (res.code === "200") {
          this.studyClassSectionList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    /**
     * @name: 刷新页面
     * @msg:
     * @param {*}
     * @return {*}
     */
    async refreshDividePage() {
      this.pagination.current = 1;
      this.selectData.weekSort = 0;
      this.selectData.sort = 0;
      this.fatchData.weekSort = 0;
      this.fatchData.sort = 0;
      this.fatchData.className = "";
      // this.getClassListPaging();
      // 获取周次
      await this.getStudyClassWeek();
      // 根据周次获取节次
      await this.getStudyClassSection();
      // 获取表格数据
      await this.getClassListPaging();
    },
  },
};
</script>

<style lang="less" scoped>
.divide-class {
  .table {
    margin-top: 10px;
  }
}
</style>