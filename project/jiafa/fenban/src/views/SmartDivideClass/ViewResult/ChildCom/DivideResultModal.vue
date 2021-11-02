<template>
  <a-modal
    :title="className"
    width="1040px"
    wrapClassName="mj-drm-content"
    :destroyOnClose="true"
    :visible="visible"
    :footer="null"
    @cancel="modalCancel"
  >
    <a-input-search
      placeholder="请输入学生姓名"
      class="mj-drm-search"
      @search="inputSearch"
    >
      <a-button slot="enterButton" class="themeBtn">搜索</a-button>
    </a-input-search>

    <div class="mj-drm-table">
      <a-table
        rowKey="stuId"
        :bordered="true"
        :scroll="{ y: 492 }"
        :columns="columns"
        :loading="loading"
        :data-source="dataSource"
        :pagination="pagination"
        class="app"
      ></a-table>
    </div>
  </a-modal>
</template>

<script>
// 行政班表格
const adminDetColumns = [
  {
    title: "学生姓名",
    dataIndex: "stuName",
    key: "stuName",
    align: "center",
    width: "10%",
    ellipsis: true
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    align: "center",
    width: "8%",
    ellipsis: true
  },
  {
    title: "选考组合",
    dataIndex: "selectCom",
    key: "selectCom",
    align: "center",
    width: "15%",
    ellipsis: true
  },
  {
    title: "选考走班科目",
    dataIndex: "selectWalkCom",
    key: "selectWalkCom",
    align: "center",
    width: "26%",
    ellipsis: true
  },
  {
    title: "学考组合",
    dataIndex: "studyCom",
    key: "studyCom",
    align: "center",
    width: "15%",
    ellipsis: true
  },
  {
    title: "学考走班科目",
    dataIndex: "studyWalkCom",
    key: "studyWalkCom",
    align: "center",
    width: "26%",
    ellipsis: true
  }
];
// 教学班表格
const teachDetColumns = [
  {
    title: "学生姓名",
    dataIndex: "stuName",
    key: "stuName",
    align: "center",
    width: "10%",
    ellipsis: true
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    align: "center",
    width: "8%",
    ellipsis: true
  },
  {
    title: "选考组合",
    dataIndex: "selectCom",
    key: "selectCom",
    align: "center",
    width: "33%",
    ellipsis: true
  },
  {
    title: "来源行政班",
    dataIndex: "orignClass",
    key: "orignClass",
    align: "center",
    width: "16%",
    ellipsis: true
  },
  {
    title: "学考组合",
    dataIndex: "studyCom",
    key: "studyCom",
    align: "center",
    width: "33%",
    ellipsis: true
  }
];

export default {
  name: "",
  props: [],
  data() {
    return {
      visible: false, //modal控制
      lineData: {}, //父页面传参
      columns: adminDetColumns,
      dataSource: [], //表格数据
      pagination: {
        //分页
        current: 1,
        pageSize: 20,
        total: 0,
        size: "middle",
        showTotal: (total, range) => {
          const size = range[1] - range[0] + 1;
          return `当前显示${size}条，共${total}条数据`;
        },
        onChange: (pageIndex) => {
          this.pageIndex = pageIndex;
          this.pagination.current = pageIndex;
          this.getDetailList({ current: pageIndex, search: this.inputVal });
        }
      },
      loading: false,
      pageIndex: 1,
      // total: 0, //数据总数
      inputVal: "", //搜索框值
      className: "" //班级名称
    };
  },
  mounted() {},
  computed: {},
  methods: {
    /**
     * @desc 获取列表数据
     * item:接口所需入参
     * type:区分是不是首次加载
     */
    async getDetailList(item, type) {
      this.loading = true;

      let data = {};
      if (type === 1) {
        this.lineData = item;
        data = item;
      } else {
        data = { ...this.lineData, ...item };
      }
      this.columns =
        this.lineData.classType === 1 ? adminDetColumns : teachDetColumns;

      let res = await this.$api.viewResult.getResultDetailList(data);
      if (res.code === "200" && res.data) {
        const data = res.data;
        if (data.list) {
          this.dataSource = data.list;
        } else {
          this.dataSource = [];
        }
        if (data.pagination) {
          this.pagination.total = data.pagination.total;
        }
      } else this.$message.info(res.message,5);

      this.loading = false;
    },
    /**
     * @desc 输入框搜索
     * value 搜索值
     */
    inputSearch(value) {
      if (this.inputVal !== value) {
        this.getDetailList({ current: 1, search: value });
        this.inputVal = value;
        this.pageIndex = 1;
        this.pagination.current = 1;
      }
    },
    /**
     * @desc 模态框关闭
     */
    modalCancel() {
      this.pageIndex = 1;
      this.inputVal = "";
      this.visible = false;
      this.dataSource = [];
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .mj-drm-content {
  .ant-modal-title {
    text-align: left;
  }
  .ant-modal-body {
    padding: 16px 32px;
  }
  .ant-input-group-wrapper {
    width: 300px;
  }
  .mj-drm-table {
    margin-top: 16px;
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 12px 16px;
    }
    .ant-table-thead > tr > th {
      color: #797c80;
      background-color: #f7f9fa;
    }
    .ant-table-tbody > tr > td {
      color: #494a4d;
    }
    .ant-table-pagination {
      width: 100%;
      text-align: right;
    }
    .ant-pagination-total-text {
      text-align: left;
    }
  }
}
</style>
