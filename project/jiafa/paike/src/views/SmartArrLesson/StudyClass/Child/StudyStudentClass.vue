<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-08 10:57:38
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 16:04:26
-->
<template>
  <div class="divide-class">
    <div>
      <!-- 周次 -->
      <a-select
        style="width: 350px"
        v-model="selectData.weekSort"
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
        style="width: 350px"
        v-model="selectData.sort"
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
      <!-- 班级 -->
      <a-select
        style="width: 350px"
        v-model="selectData.classId"
        @change="handleClassChange"
      >
        <a-select-option :value="''">==请选择==</a-select-option>
        <a-select-option
          :value="item"
          v-for="item in studyClassClass"
          :key="item"
          >{{ item }}</a-select-option
        >
      </a-select>
      <a-input
        placeholder="请输入学生名称"
        style="width: 150px; margin-right: 15px"
        v-model="fatchData.stuName"
      />
      <a-button type="primary" @click="search">查询</a-button>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :rowKey="() => Math.random().toString()"
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
    title: "姓名",
    dataIndex: "stuName",
    key: "stuName",
    align: "center",
    width: "10%",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    align: "center",
  },
  {
    title: "自习班",
    dataIndex: "className",
    key: "className",
    align: "center",
  },
  {
    title: "行政班",
    dataIndex: "adjClassName",
    key: "adjClassName",
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
        weekSort: 0,
        sort: 0,
        classId: "",
      },
      fatchData: {
        weekSort: 0,
        sort: 0,
        classId: "",
        planId: this.$route.query.planId,
        stuName: "",
      },
      studyClassWeekList: {}, // 周次对象
      studyClassSectionList: {}, // 节次对象
      studyClassClass: {}, // 班级对象
    };
  },
  async mounted() {
    // 获取周次
    await this.getStudyClassWeek();
    // 根据周次获取节次
    await this.getStudyClassSection();
    // 根据周次,节次获取班级
    await this.getStudyClassClass();
    // 获取表格数据
    await this.getStudyClassStuPaging();
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
      this.getStudyClassStuPaging();
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
      this.getStudyClassStuPaging();
    },
    /**
     * @name: 查询按钮
     * @msg:
     * @param {*}
     * @return {*}
     */
    search() {
      this.getStudyClassStuPaging();
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
    async getStudyClassStuPaging() {
      this.loading = true;
      let data = {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        planId: this.fatchData.planId,
        weekSort: this.fatchData.weekSort,
        sort: this.fatchData.sort,
        classId: this.fatchData.classId,
        stuName: this.fatchData.stuName,
      };
      try {
        const res = await this.$api.ArrlessonList.getStudyClassStuPaging(data);
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
     * @name: 根据周次，节次获取班级
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getStudyClassClass() {
      let data = {
        planId: this.fatchData.planId,
        weekSort: this.fatchData.weekSort,
        sectionSort: this.fatchData.sort,
      };
      try {
        const res = await this.$api.ArrlessonList.GetStudyClassClass(data);
        if (res.code === "200") {
          this.studyClassClass = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    /**
     * @name: 周次下拉框事件
     * @msg:
     * @param {*} value
     * @return {*}
     */
    async handleWeekChange(value) {
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
      this.selectData.classId = "";
      this.fatchData.classId = "";
      await this.getStudyClassSection();
      await this.getStudyClassClass();
    },
    /**
     * @name: 节次下拉框事件
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
      this.selectData.classId = "";
      this.fatchData.classId = "";
      this.getStudyClassClass();
    },
    /**
     * @name: 班级下拉框事件
     * @msg:
     * @param {*} value
     * @return {*}
     */
    handleClassChange(value) {
      if (value === "") {
        this.fatchData.classId = "";
      } else {
        let obj = this.studyClassClass;
        for (const key in obj) {
          if (obj[key] === value) {
            this.fatchData.classId = key;
          }
        }
      }
    },
    /**
     * @name: 刷新页面
     * @msg:
     * @param {*}
     * @return {*}
     */
    async refreshStudentPage() {
      this.pagination.current = 1;
      this.selectData.weekSort = 0;
      this.selectData.sort = 0;
      this.selectData.classId = "";
      this.fatchData.weekSort = 0;
      this.fatchData.sort = 0;
      this.fatchData.classId = "";
      this.fatchData.stuName = "";
      // 获取周次
      await this.getStudyClassWeek();
      // 根据周次获取节次
      await this.getStudyClassSection();
      // 根据周次,节次获取班级
      await this.getStudyClassClass();
      // 获取表格数据
      await this.getStudyClassStuPaging();
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