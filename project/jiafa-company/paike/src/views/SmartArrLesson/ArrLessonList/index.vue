<!--
 * @descripttion: 排课方案列表页面
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-27 11:26:12
-->
<template>
  <div class="arrLesson-list-wrap">
    <div class="breadcrumbs">智能排课/高考排课</div>
    <div class="head">
      <div class="plan-name">xxxx分班方案</div>
      <a-button type="primary">排课</a-button>
    </div>
    <div class="content">
      <div class="operation-zone">
        <a-space size="middle">
          <a-button type="primary" @click="publishPlan">发布排课方案</a-button>
          <a-button type="primary" @click="exportPlan">导出</a-button>
          <a-button type="primary" @click="comparisonPlan">方案对比</a-button>
          <a-button type="danger" @click="batchDelPlan">批量删除</a-button>
        </a-space>
      </div>
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="data"
          :rowKey="(row) => row.arrLessonId"
          :pagination="pagination"
          :loading="loading"
          :row-selection="rowSelection"
        >
          <span slot="status" slot-scope="text">{{ text }}</span>
          <span slot="action" slot-scope="text, record">
            <a-button type="link" @click="viewPlanDetails(record)"
              >方案报告</a-button
            >
            <a-button type="link">继续排课</a-button>
            <a-button type="link">查看排课结果</a-button>
            <a-button type="link">时间安排</a-button>
          </span>
        </a-table>
      </div>
    </div>
    <!-- 发布排课方案 -->
    <a-drawer
      title="发布课表"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
      width="520"
      :zIndex="1100"
    >
      <div style="font-size: 16px; margin-bottom: 10px">发布设置</div>
      <div class="setting">
        <label for="">应用学年学期：</label>
        <a-select
          v-model="selectValue"
          style="width: 320px"
          placeholder="请选择应用学年学期"
        >
          <a-select-opt-group label="2019-2020学年">
            <a-select-option value="jack">111</a-select-option>
            <a-select-option value="lucy">222</a-select-option>
          </a-select-opt-group>
          <a-select-opt-group label="2020-2021学年">
            <a-select-option value="jack1">111</a-select-option>
            <a-select-option value="lucy1">222</a-select-option>
          </a-select-opt-group>
        </a-select>
      </div>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button style="marginright: 8px" @click="onClose">取消</a-button>
        <a-button type="primary" @click="handleOk" :loading="publishLoading"
          >确定发布</a-button
        >
      </div>
    </a-drawer>
    <!-- 发布排课方案检测 -->
    <a-modal
      class="detection-modal"
      v-model="modalVisible"
      title="方案发布"
      :destroyOnClose="true"
      :width="520"
    >
      <div class="tips">
        {{ calcDetectionMsg.tips
        }}<a class="operation">{{ calcDetectionMsg.operation }}</a>
      </div>
      <div slot="footer">
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" v-if="result !== '1'" disabled>发布</a-button>
        <a-button type="primary" v-if="result === '1'" @click="pubilshModal"
          >仍要发布</a-button
        >
      </div>
    </a-modal>
  </div>
</template>
 
<script>
const columns = [
  {
    title: "排课方案编号",
    dataIndex: "number",
    key: "number",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
    align: "center",
  },
  {
    title: "最后一次编辑时间",
    dataIndex: "lastTime",
    key: "lastTime",
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

const data = [
  {
    key: "1",
    number: "1111",
    status: 1,
    arrLessonId: "1234534",
    lastTime: "2021-5-27 13:53:14",
  },
  {
    key: "2",
    number: "2222",
    status: 1,
    arrLessonId: "123452334",
    lastTime: "2021-5-27 13:53:14",
  },
  {
    key: "3",
    number: "3333",
    status: 1,
    arrLessonId: "12334534",
    lastTime: "2021-5-27 13:53:14",
  },
];
export default {
  name: "ArrLessonList",
  components: {},
  props: {},
  data() {
    return {
      data,
      columns,
      selectedRowKeys: [],
      loading: false,
      visible: false,
      publishLoading: false,
      selectValue: undefined,
      modalVisible: false,
      result: "1",
      requestParams: {
        current: 1,
        pageSize: 10,
      },
      pagination: {
        current: 1,
        size: "middle",
        defaultPageSize: 1,
        showQuickJumper: true, //是否可以快速跳转至某页
        total: 0, //总条数
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        // showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "20", "30", "40"],
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      arrLessonId: "",
    };
  },
  computed: {
    // table 多选框
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        // table select event
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        },
        // 多选框禁用
        getCheckboxProps: (record) => {
          return {
            props: {
              // 全部默认禁止选中
              disabled: record.disabled,
            },
          };
        },
      };
    },
    calcDetectionMsg() {
      const { result } = this;
      const deMsg = {};
      switch (result) {
        case "1":
          deMsg.tips = "检测到您该方案下存在校本课程，是否关联校本课程，";
          deMsg.operation = "去关联校本课程。";
          break;
        case "2":
          deMsg.tips = "检测到您该方案下的排课未完成，无法进行发布，";
          deMsg.operation = "去关联校本课程。";
          break;
        case "3":
          deMsg.tips =
            "检测到您该方案下的存在冲突，是否对该排课方案进行冲突调整，";
          deMsg.operation = "去手动调整冲突。";
          break;
        case "4":
          deMsg.tips =
            "检测到您该方案下未分配教室，，是否对该排课方案进行教室分配，";
          deMsg.operation = "去分配教室。";
          break;
        default:
          deMsg.tips = "啥也没有检测到...小主也不知道该怎么呢...。";
          deMsg.operation = "去联系管理员...";
          break;
      }
      return deMsg;
    },
  },
  watch: {
    "pagination.current"(newVal, oldVal) {
      console.log(newVal, oldVal);
      if (newVal !== oldVal) {
        window.sessionStorage.setItem("tableCurrentPage", newVal);
      }
    },
  },
  mounted() {
    this.arrLessonId = this.$route.query.arrLessonId;
    console.log(this.arrLessonId);
    this.keepTableCurrentPage();
    this.getArrLessonList();
  },
  beforeDestroy() {},
  methods: {
    // change page current event
    onPageChange(page) {
      this.pagination.current = page;
      this.requestParams.current = page;
      // this.getGroupStuList()
    },
    // change page size options event
    onShowSizeChangeMethod(i, pageSize) {
      this.requestParams.pageSize = pageSize;
      this.pagination.current = 1;
      this.requestParams.current = 1;
      // this.getGroupStuList()
    },
    onClose() {
      this.visible = false;
    },
    handleOk() {},
    async publishPlan() {
      const res = await this.calcOperationMsg("publish", 1);
      if (!res) {
        return;
      }
      const { result } = this;
      result === "0" ? (this.visible = true) : (this.modalVisible = true);
    },

    calcOperationMsg(type, count) {
      const { selectedRowKeys } = this;
      return new Promise((resolve, reject) => {
        if (!selectedRowKeys.length) {
          resolve(false);
          return this.$message.warn("请在表格左侧勾选至少一个方案！");
        } else {
          resolve(true);
        }

        if (selectedRowKeys.length > count) {
          resolve(false);
          return type === "publish"
            ? this.$message.warn("最多同时发布一个方案！")
            : type === "comparison"
            ? this.$message.warn("最多选择三个方案进行对比！")
            : type === "export"
            ? this.$message.warn("只能选择一个方案导出！")
            : "";
        } else {
          resolve(true);
        }
      });
    },
    keepTableCurrentPage() {
      const isGoBack = this.$route.params.isGoBack;
      console.log(isGoBack);
      console.log(this.$route);
      if (isGoBack) {
        let currentPage = window.sessionStorage.getItem("tableCurrentPage");
        if (currentPage) {
          currentPage = Number(currentPage);
          this.pagination.current = currentPage;
          this.requestParams.current = currentPage;
        }
      }
    },

    pubilshModal() {
      this.visible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
    // 导出
    async exportPlan() {
      const res = await this.calcOperationMsg("export", 1);
      if (!res) {
        return;
      }
      console.log(123);
      //
    },
    // 方案对比
    comparisonPlan() {
      this.calcOperationMsg("comparison", 3);
    },
    // 批量删除
    batchDelPlan() {
      this.calcOperationMsg(null, 3);
    },
    // 查看方案报告
    viewPlanDetails({ arrLessonId }) {
      this.$router.push({
        path: "/PlanReportorCompare",
        query: {
          arrLessonId,
        },
      });
    },
    /**
     * @name: 获取排课方案列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getArrLessonList() {
      let data = {
        planId: this.arrLessonId,
      };
      const res = await this.$api.ArrlessonList.getArrLessonList(data);
      console.log(res);
    },
  },
};
</script>
 
<style scoped lang="less">
.detection-modal {
  .operation {
    &:hover {
      text-decoration: underline;
    }
  }
}
.arrLesson-list-wrap {
  width: 100%;
  padding: 10px;
  background: white;
  .breadcrumbs {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .head {
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .plan-name {
      font-size: 28px;
      font-weight: 600;
    }
  }
  .content {
    margin-top: 20px;
    .operation-zone {
    }
    .table {
      margin-top: 20px;
    }
  }
}
</style>