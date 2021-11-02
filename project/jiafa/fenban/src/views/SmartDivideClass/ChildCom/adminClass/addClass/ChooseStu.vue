<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-14 09:31:21
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-28 13:21:43
-->

<template>
  <div class="choose-stu">
    <div class="head">
      <div class="title">{{ combination.combinationName }}人员选择</div>
      <div class="upload-btn">
        已选择人数：<span class="choosed-num">{{
          selectedRowKeys.length || value
        }}</span
        >人
      </div>
    </div>
    <div class="content">
      <div class="top">
        <!-- 进入班级人数 -->
        <div class="choose-num">
          <label for="inputNumber">进入班级人数：</label>
          <a-tooltip v-if="inputDisabled">
            <template slot="title">
              你已经选择了学生或选中了成绩筛选条件，不可输入人数。
            </template>
            <a-input-number
              id="inputNumber"
              v-model="value"
              @focus="inputFocus"
              @blur="inputBlur"
              :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
              :parser="(value) => value"
              :disabled="inputDisabled"
              :min="0"
              :max="maxStuNum"
            />
          </a-tooltip>
          <a-input-number
            v-else
            id="inputNumber"
            v-model="value"
            :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
            :parser="(value) => value"
            @focus="inputFocus"
            @blur="inputBlur"
            @change="insertInputChange"
            :disabled="inputDisabled"
            :min="0"
            :max="maxStuNum"
          />
        </div>
        <!-- 筛选条件 -->
        <div class="search">
          <div class="search-course">
            <div class="acj" style="margin-right: 10px">
              <span>按成绩：</span>
              <!-- :default-value="performanceArr[0].id" -->
              <!-- default-value="" -->
              <a-select
                style="width: 120px"
                @change="handleChange"
                allowClear
                v-model="fetchData2.isPerformance"
                :disabled="newDisables.acjDisabled"
              >
                <a-select-option
                  v-for="item in performanceArr"
                  v-model="item.id"
                  :key="item.id"
                >
                  {{ item.optionName }}
                </a-select-option>
              </a-select>
            </div>

            <div class="cjqu" style="margin-right: 10px">
              <span>成绩区间：</span>
              <a-input-number
                id="inputNumber1"
                :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
                :parser="(value) => value"
                v-model="fetchData2.performanceSection.startSection"
                :min="0"
                :max="1000"
                @change="onChangeStart"
                @blur="inputStartBlur"
                @focus="inputStartFocus"
                :disabled="newDisables.cjStartDisabled"
                style="width: 80px"
              />
              <span>--</span>
              <a-input-number
                id="inputNumber2"
                :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
                :parser="(value) => value"
                v-model="fetchData2.performanceSection.endSection"
                :min="0"
                :max="1000"
                :disabled="newDisables.cjEndDisabled"
                @change="onChangeEnd"
                @blur="inputEndBlur"
                @focus="inputEndFocus"
                style="width: 80px"
                :class="{ endSectionclass: pdEndSection }"
              />
            </div>
          </div>
          <!-- @pressEnter="pressEnter" -->
          <a-input-search
            v-model="fetchData2.search"
            :disabled="disabled"
            @change="inputDelChange"
            @search="handleSearch"
            enter-button="搜 索"
            :loading="loading"
            allowClear
            placeholder="输入姓名进行查询"
            style="width: 240px"
          />
          <a-button
            :disabled="disabled"
            type="primary"
            @click="resetBtn"
            style="margin-left: 10px"
            >重置</a-button
          >
        </div>
      </div>
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="data"
          :loading="tableLoading"
          :pagination="pagination"
          :rowKey="(row) => row.stuId"
          size="middle"
          @change="handleTableChange"
          :row-selection="rowSelection"
          :scroll="{ y: '400px' }"
          :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
            }
          "
        >
          <span slot="sex" slot-scope="text">{{ text }}</span>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @description 选择学生列表
 * @date 2021-4-2 09:23:33
 */
const columns = [
  {
    title: "班级",
    dataIndex: "className",
    key: "className",
    align: "left",
  },
  {
    title: "姓名",
    dataIndex: "stuName",
    key: "stuName",
    width: 80,
    align: "center",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    align: "center",
    scopedSlots: { customRender: "sex" },
  },
  {
    title: "语数外总分",
    dataIndex: "total",
    key: "total",
    align: "center",
    sorter: true,
    sortOrder: false,
  },
  {
    title: "选课总分",
    dataIndex: "selResult",
    key: "selResult",
    align: "center",
    sorter: true,
  },
];
export default {
  name: "ChooseStu",
  components: {},
  props: {
    combination: {
      type: Object,
      require: true,
      default: () => ({}),
    },
    groupId: {
      type: String,
      require: true,
      default: "",
    },
  },
  data() {
    return {
      data: [],
      columns,
      disabled: false,
      inputDisabled: false,
      tableLoading: false,
      value: 0,
      selectedRowKeys: [], // 选中id
      selectedRowKeysTem: [],
      toggle: false,
      toggleStart: false,
      toggleEnd: false,
      loading: false,
      maxStuNum: 200, // 最大输入人数
      fetchData: {
        // search: "",
        pageSize: 10,
        current: 1,
        sortFilter: {
          totalSort: "",
          selResultSort: "",
        },
        // isPerformance: "", // 成绩下拉框
        // performanceSection: {
        //   // 分数
        //   startSection: null, // 默认为null
        //   endSection: null, // 默认为null
        // },
      },
      fetchData2: {
        search: "",
        isPerformance: "", // 成绩下拉框
        performanceSection: {
          // 分数
          startSection: null, // 默认为null
          endSection: null, // 默认为null
        },
      },

      pagination: {
        current: 1,
        size: "middle",
        defaultPageSize: 10,
        showQuickJumper: true, //是否可以快速跳转至某页
        total: 0, //总条数
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        // showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "20", "30", "40"],
        // showTotal: (total, range) =>
        // `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      performanceArr: [
        {
          optionName: "语数外总分",
          id: "1",
        },
        {
          optionName: "选课总分",
          id: "2",
        },
      ], // 按成绩下拉框
      pdEndSection: false,
      newDisables: {
        cjStartDisabled: false, // 成绩开始禁止
        cjEndDisabled: false, // 成绩结束禁止
        acjDisabled: false, // 按成绩下拉框禁止
      },
      isSearchBtn: false,
    };
  },

  computed: {
    // 是否选择学生列表
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    // 是否输入过进入人数
    hasInputed() {
      return this.value > 0;
    },
    // table 多选框
    rowSelection() {
      // const { selectedRowKeys } = this;
      return {
        selectedRowKeys: this.selectedRowKeys,
        // table select event
        onChange: async (selectedRowKeys) => {
          this.inputDisabled = true;
          if (
            !selectedRowKeys.length &&
            this.fetchData2.isPerformance === "" &&
            this.fetchData2.performanceSection.startSection === null &&
            this.fetchData2.performanceSection.endSection === null
          ) {
            this.inputDisabled = false;
          }
          this.selectedRowKeys = selectedRowKeys;
          // 将选择的值传递给父组件。选择了具体的人员，传递人员ids。
          this.$emit("handleChooseStuNum", this.selectedRowKeys);
          // 清空输入的人数
          this.value = 0;
        },
        // 多选框禁用
        getCheckboxProps: (record) => {
          return {
            props: {
              // 全部默认禁止选中
              disabled: record.disabled,
              // 点击搜索之后默认全选
              defaultChecked: record.id == 0,
            },
          };
        },
      };
    },
  },
  watch: {
    value(val) {
      /**
       * 需求：当输入了人数时候，表格多选框禁用，
       * 当选择了表格多选框时候，输入人数input禁用
       */
      val > 0
        ? (this.data = this.data.map((item) => ({ ...item, disabled: true })))
        : val <= 0
        ? (this.data = this.data.map((item) => ({ ...item, disabled: false })))
        : "";
    },
    deep: true,
  },
  created() {},
  mounted() {
    this.getGroupStuList();
  },
  methods: {
    // 下一页
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.current = page;
      this.getGroupStuList();
    },
    // 切换页数
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.current = 1;
      this.getGroupStuList();
    },
    // 按照语数外总分排序 0降序 1 升序
    handleTableChange(pagination, filters, sorter) {
      if (sorter.field === "total") {
        this.fetchData.sortFilter.totalSort = "";
        this.fetchData.sortFilter.selResultSort = "";
        const { sortOrder } = this.columns[3];
        delete this.columns[4].sortOrder;
        if (sortOrder === "descend") {
          this.columns[3].sortOrder = "ascend";
          this.fetchData.sortFilter.totalSort = "1";
          this.getGroupStuList();
        } else {
          this.columns[3].sortOrder = "descend";
          this.fetchData.sortFilter.totalSort = "0";
          this.getGroupStuList();
        }
        // 按照选科的分数排序 0降序 1 升序
      } else if (sorter.field === "selResult") {
        this.fetchData.sortFilter.totalSort = "";
        this.fetchData.sortFilter.selResultSort = "";
        const { sortOrder } = this.columns[4];
        delete this.columns[3].sortOrder;
        if (sortOrder === "descend") {
          this.columns[4].sortOrder = "ascend";
          this.fetchData.sortFilter.selResultSort = "1";
          this.getGroupStuList();
        } else {
          this.columns[4].sortOrder = "descend";
          this.fetchData.sortFilter.selResultSort = "0";
          this.getGroupStuList();
        }
      }
    },

    // 输入人数输入框 focus 聚焦事件
    inputFocus() {
      this.toggle = true;
    },
    // 输入人数输入框 change 事件
    insertInputChange() {
      let { value } = this;
      if (value !== 0) {
        this.newDisables.cjStartDisabled = true;
        this.newDisables.cjEndDisabled = true;
        this.newDisables.acjDisabled = true;
        this.fetchData2.search = "";
        this.disabled = true;
      } else if (value === 0) {
        this.newDisables.cjStartDisabled = false;
        this.newDisables.cjEndDisabled = false;
        this.newDisables.acjDisabled = false;
        this.disabled = false;
      }
      if (value !== null) {
        // 将选择的值传递给父组件。只传递输入的人数。
        this.$emit("handleChooseStuNum", value);
        // 清空table多选框
        this.selectedRowKeys = [];
      }
    },
    // 输入人数输入框 blur 失焦事件
    inputBlur() {
      this.toggle = false;
      let { value } = this;
      // 用户删除输入的人数之后input显示为空，手动设置为0，提升用户体验。
      if (value === null || value === "") {
        this.value = 0;
      }
      // 判断 禁止
      if (this.value !== 0) {
        this.newDisables.cjStartDisabled = true;
        this.newDisables.cjEndDisabled = true;
        this.newDisables.acjDisabled = true;
        this.disabled = true;
      } else if (this.value === 0) {
        this.newDisables.cjStartDisabled = false;
        this.newDisables.cjEndDisabled = false;
        this.newDisables.acjDisabled = false;
        this.disabled = false;
      }
    },
    // 重置规则
    resetBtn() {
      // 如果没有选中 清空按成绩条件
      this.fetchData2.isPerformance = "";
      this.fetchData2.performanceSection.startSection = null;
      this.fetchData2.performanceSection.endSection = null;
      this.fetchData2.search = "";
      // 删除按成绩请求的参数
      delete this.fetchData.search;
      delete this.fetchData.isPerformance;
      delete this.fetchData.performanceSection;
      delete this.fetchData.search;
      this.fetchData.current = 1;
      this.pagination.current = 1;
      this.selectedRowKeysTem = [];
      this.selectedRowKeys = [];
      this.maxStuNum = 0;
      this.inputDisabled = false;
      this.$emit("handleChooseStuNum", this.selectedRowKeys);
      this.getGroupStuList();
    },
    // 搜索按钮 搜索
    async handleSearch() {
      if (this.value === 0) {
        this.newDisables.cjStartDisabled = false;
        this.newDisables.cjEndDisabled = false;
        this.newDisables.acjDisabled = false;
      }
      // 有成绩筛选条件
      if (
        this.fetchData2.isPerformance !== "" ||
        this.fetchData2.performanceSection.startSection !== null ||
        this.fetchData2.performanceSection.endSection !== null
      ) {
        this.data = [];
        this.pagination.total = 0;
        this.maxStuNum = 0;
        this.selectedRowKeysTem = [];
        if (this.fetchData2.isPerformance === "") {
          this.$message.warning("请选择成绩总分类型");
          return;
        }
        if (this.fetchData2.performanceSection.startSection === null) {
          this.$message.warning("请输入成绩开始区间");
          return;
        }
        if (this.fetchData2.performanceSection.endSection === null) {
          this.$message.warning("请输入成绩结束区间");
          return;
        }
        // 如果成绩结束大于成绩开始
        if (this.judgeSection()) {
          this.data = [];
          this.pagination.total = 0;
          this.maxStuNum = 0;
          this.selectedRowKeysTem = [];
          return;
        }

        this.pdEndSection = false;
        this.pagination.current = 1;
        this.fetchData.current = 1;
        // 做为参数
        this.fetchData.search = this.fetchData2.search;
        this.fetchData.isPerformance = this.fetchData2.isPerformance;
        this.fetchData.performanceSection = {
          ...this.fetchData2.performanceSection,
        };
        await this.getGroupStuList();
        await this.allSelectOpr();
        return;
      }
      // 如果没有成绩筛选条件
      this.pagination.current = 1;
      this.fetchData.current = 1;
      this.selectedRowKeys = [];
      // delete this.fetchData.search;
      this.fetchData.search = this.fetchData2.search;
      delete this.fetchData.isPerformance;
      delete this.fetchData.performanceSection;
      await this.getGroupStuList();
      this.selectedRowKeysTem = [];
      await this.allSelectOpr();
      this.inputDisabled = false;
    },
    // 表格全选的操作
    allSelectOpr() {
      this.selectedRowKeys = [...this.selectedRowKeysTem];
      this.inputDisabled = true;
      if (
        this.fetchData2.isPerformance === "" ||
        this.fetchData2.performanceSection.startSection === null ||
        this.fetchData2.performanceSection.endSection === null
      ) {
        this.inputDisabled = false;
      }
      // 将选择的值传递给父组件。选择了具体的人员，传递人员ids。
      this.$emit("handleChooseStuNum", this.selectedRowKeys);
    },
    // 搜索时，点击清除图标自动调用接口
    inputDelChange(e) {
      if (e.type === "click") {
        this.pagination.current = 1;
        this.fetchData.current = 1;
        this.getGroupStuList();
      }
    },
    // 判断成绩选择区间
    judgeSection() {
      if (
        this.fetchData2.performanceSection.endSection <
        this.fetchData2.performanceSection.startSection
      ) {
        this.pdEndSection = true;
        this.$message.warning("成绩结束区间，应大于成绩开始区间");
        return true;
      }
    },
    // 获取表格数据
    async getGroupStuList() {
      try {
        this.tableLoading = true;
        let search = this.fetchData2.search;
        search = search.replace(/(^\s*)|(\s*$)/g, "");
        this.fetchData2.search = search;
        const params =
          {
            // 正常传入
            ...this.fetchData,
            combinationId: this.combination.combinationId,
            groupId: this.groupId,
          } || {};
        const res = await this.$api.adminClass.getStuListInCombination(params);
        if (res.code === "200") {
          this.data = res.data.list;
          // 点击下一页 表格选项禁止
          if (this.value > 0) {
            this.data = this.data.map((item) => ({
              ...item,
              disabled: true,
            }));
          }
          this.pagination.total = res.data.pagination.total;
          this.maxStuNum = res.data.pagination.total;
          this.selectedRowKeysTem = res.data.selectedRowKeys;
        }
      } catch (error) {
        this.$message.error(error, 5);
      } finally {
        this.tableLoading = false;
      }
    },
    // 按成绩下拉框
    handleChange(value) {
      if (typeof value === "undefined") {
        this.fetchData2.isPerformance = "";
        this.pdCjAndInputNum();
      } else {
        this.fetchData2.isPerformance = value;
        this.pdCjAndInputNum();
      }
    },
    // 成绩区间 chang事件
    onChangeStart(value) {
      this.fetchData2.performanceSection.startSection = value;
      this.pdCjAndInputNum();
    },
    onChangeEnd(value) {
      this.fetchData2.performanceSection.endSection = value;
      this.pdCjAndInputNum();
    },
    // 成绩区间 聚焦事件
    inputStartFocus() {
      this.toggleStart = true;
    },
    inputEndFocus() {
      this.toggleEnd = true;
    },
    // 成绩区间 失焦事件
    inputStartBlur() {
      this.toggleStart = false;
      this.pdCjAndInputNum();
    },
    inputEndBlur() {
      this.toggleEnd = false;
      this.pdCjAndInputNum();
    },
    // 成绩与输入人数互斥
    pdCjAndInputNum() {
      if (
        this.fetchData2.isPerformance !== "" ||
        this.fetchData2.performanceSection.startSection !== null ||
        this.fetchData2.performanceSection.endSection !== null ||
        this.selectedRowKeys.length !== 0
      ) {
        this.inputDisabled = true;
      } else {
        this.inputDisabled = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.choose-stu {
  width: 100%;
  .head {
    height: 30px;
    line-height: 30px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 16px;
      color: #000;
    }
    .choosed-num {
      font-size: 16px;
      font-style: oblique;
      font-weight: 600;
    }
  }
  .content {
    border-top: 1px solid #e8e8e8;
    padding-top: 15px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .search {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border: 1px solid #e8e8e8;
        padding: 5px;
        .search-course {
          display: flex;
          margin-right: 5px;
        }
      }
    }
  }
  .endSectionclass {
    border: 1px solid red;
  }
}
.table {
  margin-top: 15px;
  // 表格隔行变色
  /deep/ .even-row {
    background-color: #f7f8fa;
  }
  /deep/ .ant-table-pagination {
    text-align: left;
    .ant-pagination-total-text {
      margin-right: 15px;
    }
  }
}
</style>
