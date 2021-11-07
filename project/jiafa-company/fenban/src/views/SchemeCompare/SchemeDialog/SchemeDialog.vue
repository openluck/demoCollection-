<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-04-19 12:48:34
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-26 13:27:53
-->
<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-04-19 12:48:34
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-30 13:11:43
-->
<template>
  <div class="dialog">
    <a-modal
      class="import-course"
      :visible="chemeDialogVisible"
      title="添加分班方案"
      width="800px"
      @cancel="CloseModel()"
      @ok="confirm()"
    >
      <a-input-search
        placeholder="请输入分班方案编号"
        size="large"
        @search="onSearch"
        style="width: 330px; margin-bottom: 20px"
      >
        <a-button slot="enterButton" class="themeBtn">搜索</a-button>
      </a-input-search>
      <!-- 表格 -->
      <a-table
        :rowKey="(row) => row.divideSchemId"
        :pagination="pagination"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
        class="app divide-class-list"
        :bordered="true"
        :loading="loading"
      >
        <!-- 发布状态 -->
        <template slot="inputState" slot-scope="text">
          <div class="input-state">
            <div v-if="text" class="can-input">可发布</div>
            <div v-else class="no-finish">未完成</div>
          </div>
        </template>

        <!-- 发布结果 -->
        <template slot="inputResult" slot-scope="text">
          <div class="input-result">
            <div v-if="text" class="has-input">已发布</div>
            <div v-else class="no-input">未发布</div>
          </div>
        </template>

        <!-- 最后一次修改时间 -->
        <template slot="lastInputTime" slot-scope="text">
          <div class="last-input-time">
            {{ text }}
          </div>
        </template>

        <!-- 操作 -->
        <template slot="operate" slot-scope="text, record">
          <div class="divide-class">
            <div>
              <span
                v-if="record.inputResult && record.inputState"
                class="report"
              >
                <a-icon type="play-circle" /> 方案报告
              </span>
              <span v-else class="no-report">
                <a-icon type="play-circle" /> 方案报告
              </span>
            </div>
            <div>
              <span
                v-if="record.inputResult && record.inputState"
                class="see-result"
              >
                <a-icon type="play-circle" /> 查看结果
              </span>
              <span
                v-else
                class="has-dicide"
                style="cursor: pointer"
                @click="countineDivide(record.divideSchemId)"
              >
                <a-icon type="play-circle" /> 继续分班
              </span>
            </div>
          </div>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
// 表头
const columns = [
  {
    title: "分班方案编号",
    dataIndex: "divideSchemeNum",
    align: "left",
    width: 250,
  },
  {
    title: "状态",
    dataIndex: "inputState",
    scopedSlots: { customRender: "inputState" },
    align: "left",
  },
  {
    title: "发布结果",
    dataIndex: "inputResult",
    scopedSlots: { customRender: "inputResult" },
    align: "left",
  },
  {
    title: "最后一次修改时间",
    dataIndex: "lastInputTime",
    scopedSlots: { customRender: "lastInputTime" },
    align: "left",
  },
];
export default {
  name: "schemeDialog",
  props: {
    // 弹窗是否显示
    chemeDialogVisible: {
      type: Boolean,
      default: false,
    },
    // 分组id
    planGroupId: {
      type: String,
      default: "",
    },
    // 已经对比的个数
    compareList: {
      type: Number,
      default: 0,
    },
    // 分班方案对比
    divideSchemIdFilterList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dataSource: [], // 表格数据
      columns, // 表格头数据
      pagination: {
        // 表格分页
        current: 1,
        defaultPageSize: 5,
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 改变每页条数
      },
      loading: false,
      divideSchemIdList: [], // 表格选择项-id
      selectInputState: [], // 表格选择项中的发布状态
      pageCurrent: 1, // 当前请求页数，从1开始
      pageSize: 5, // 每页数据条数
      searchValue: "", // 搜索参数
      selectedRowKeys: [], // 已经选择的key
    };
  },
  computed: {
    // 表格选项
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          // 方案id
          this.divideSchemIdList = selectedRows.map(
            (item) => item.divideSchemId
          );
          // 选择项的发布状态
          this.selectInputState = selectedRows.map((item) => item.inputState);
        },
      };
    },
  },
  methods: {
    /**
     * @desc 向父组件传递关闭弹窗事件
     */
    CloseModel() {
      this.$emit("CloseModel", this.chemeDialogVisible);
      this.selectedRowKeys = [];
    },

    /**
     * @desc 获取分班方案表格数据
     * searchValue 查询参数
     */
    async getDivideClassTable(searchValue) {
      this.loading = true;
      const data = {
        planGroupId: this.planGroupId,
        current: this.pageCurrent,
        pageSize: this.pageSize,
        divideSchemeNum: searchValue,
        hasContrastIdList: this.divideSchemIdFilterList,
        type: "1",
      };
      let res = await this.$api.getDivideClassList.getDivideSchemList(data);
      if (res.code === "200") {
        // let arr = [];
        // let data = res.data.list;
        // data.forEach((item) => {
        //   // this.divideSchemIdFilterList[item.divideSchemId] && arr.push(item);
        //   this.divideSchemIdFilterList[item.divideSchemId] ? "" : arr.push(item);
        // });
        // arr = data.filter((item) => {
        //   if (!this.divideSchemIdFilterList[item.divideSchemId]) {
        //     return arr.push(item);
        //   }
        // });
        this.dataSource = res.data.list;
        this.pagination.total = res.data.pagination.total;
      } else {
        this.$message.error(res.message,5);
      }
      this.pageCurrent = 1;
      this.loading = false;
    },

    /**
     * @desc 分页
     * page 表格页数
     */
    onPageChange(page) {
      this.pageCurrent = page;
      this.pagination.current = page;
      this.getDivideClassTable();
    },

    /**
     * @desc 搜索分班方案编号
     * searchValue 查询参数
     */
    onSearch(searchValue) {
      // 需要判断searchValue  有哪几种形式，后面进行具体的判断
      // if (searchValue === "") {
      //   this.$message.error("请输入分班方案编号");
      // } else if (!new RegExp(/^[0-9]*$/).test(parseInt(searchValue))) {
      //   this.$message.error("分班方案编号为数字");
      // }
      this.getDivideClassTable(searchValue);
    },

    /**
     * @desc 确定
     */
    confirm() {
      // 弹窗中的选项个数
      let selectLenth = this.divideSchemIdList.length;
      // 已经对比的个数
      let hasCompareLength = this.compareList;
      // 获取选择中有未完成的方案，不能进行对比
      let canCompare = this.selectInputState.some((item) => item === false);
      if (selectLenth > 3) {
        this.$message.error("最多只能选择三项！",5);
      } else if (hasCompareLength === 3) {
        this.$message.error(
          "已经对比了三项，最多只能对比三项，如果还想对比，请删除一项"
        ,5);
      } else if (hasCompareLength + selectLenth > 3) {
        this.$message.error("最多只能对比三项",5);
      } else if (canCompare) {
        this.$message.error("选择对比项中，有未完成的方案，请重新选择",5);
      } else {
        this.$emit("getSchemeReportList", this.divideSchemIdList);
        this.CloseModel();
        this.selectedRowKeys = [];
      }
    },
  },
};
</script>

<style lang="" scoped>
</style>
