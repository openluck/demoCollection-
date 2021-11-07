<template>
  <div class="disabledStudents">
    <div class="disabledStudentsT">
      <div class="searchBtn">
        <a-popconfirm
          title="请确认是否生成告知书！"
          ok-text="确定"
          cancel-text="取消"
          @confirm="label"
        >
          <a-button type="primary"> 生成告知书 </a-button>
        </a-popconfirm>
      </div>
      <div class="export">
        <a-button @click="getExport" type="primary"> 导出申请便利考生名单 </a-button>
      </div>
    </div>
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.uid"
        bordered
        :pagination="false"
        :scroll="{ y: tableHeight }"
        :loading="tableLoading"
        :row-selection="{ selectedRowKeys: selectedRowKeys ,onChange: onSelectChange }"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
import { downloadFile } from "@/utils/util.js";
const columns = [
  {
    title: "地区",
    dataIndex: "orgName",
    key: "orgName",
    width: "20%",
    align: "center",
  },
  {
    title: "已上报残疾考生数",
    dataIndex: "reportedCount",
    key: "reportedCount",
    width: "20%",
    align: "center",
  },
  {
    title: "已生成报告考生数",
    dataIndex: "createdReportCount",
    key: "createdReportCount",
    width: "15%",
    align: "center",
  },
  {
    title: "未成报告考生数",
    dataIndex: "noCreatedCount",
    key: "noCreatedCount",
    width: "20%",
    align: "center",
  },
  {
    title: "已确认考生数",
    dataIndex: "affirmedCount",
    key: "affirmedCount",
    width: "15%",
    align: "center",
  },
  {
    title: "未确认考生数",
    dataIndex: "noAffirmedCount",
    key: "noAffirmedCount",
    width: "20%",
    align: "center",
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      columns,
      tableHeight: 0, //table高度
      tableLoading: false,
      dataList: [], // 查询列表数据
      search: {
        token: '',
        userName: ''
      },
      selectedRowKeys: [],

    };
  },
  created() {
    this.search.token = sessionStorage.getItem('temporaryV1.20_token')
    this.search.userName = sessionStorage.getItem('temporaryV1.20_userName')
  },
  computed: {},
  mounted() {
    this.getList();
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list");
      this.tableHeight = tableHeight.clientHeight - 47 - 15;
    },
    //生成告知书
    label() {
      this.createNote();
    },
     onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.disabledStudents.getList(this.search);
        if (res.code === 200) {
          this.dataList = res.data.list;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },
    async getExport() {
      try {
        const res = await this.$api.disabledStudents.exportExcel(this.search);
        if (res) {
          downloadFile(res);
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async createNote() {
      const data = {
        token: this.search.token,
        userName: this.search.userName,
        idList: this.selectedRowKeys
      };
      try {
        const res = await this.$api.disabledStudents.createNote(data);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.selectedRowKeys = []
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.disabledStudents {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .disabledStudentsT {
    width: 100%;
    height: 34px;
    margin-bottom: 20px;
    display: flex;
    .searchBtn {
      margin-right: 20px;
    }
  }
  .list {
    flex-grow: 1;
    overflow-y: auto;
    .addRow {
      display: flex;
      background-color: #fafafa;
      height: 46px;
      padding-right: 8px;
      align-items: center;
      justify-content: space-around;
      border: 1px solid #e8e8e8;
      border-top: 0;
      .addItem {
        text-align: center;
      }
    }
  }
}
</style>
