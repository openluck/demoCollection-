<template>
  <div class="studentApplication">
    <div class="top" style="margin-bottom: 15px">
      <a-select
        style="width: 120px; margin-right: 15px"
        placeholder="请选择"
        allowClear
        v-model="search.affirmStatus"
      >
        <a-select-option value="0"> 全部 </a-select-option>
        <a-select-option value="1"> 已确认 </a-select-option>
        <a-select-option value="2"> 未确认 </a-select-option>
      </a-select>
      <a-button type="primary" @click="searchList()" style="margin-right: 15px"
        >查询</a-button
      >
      <a-button type="primary" @click="printNote()">打印告知书</a-button>
    </div>

    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.uid"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: tableHeight }"
        size="middle"
      >
        <span slot="serialNum" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="hasAffirm" slot-scope="text">
          {{ text === 1 ? '已确认' : text === 0 ? '未确认' : '-'}}
        </span>
      </a-table>
    </div>

    <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>
  </div>
</template>
 
<script>
const columns = [
  {
    title: "序号",
    dataIndex: "serialNum",
    align: "center",
    key: "serialNum",
    width: 80,
    scopedSlots: { customRender: "serialNum" },
  },
  {
    title: "机构",
    dataIndex: "orgName",
    key: "orgName",
    width: "20%"
  },
  {
    title: "姓名",
    dataIndex: "examName",
    align: "center",
    key: "examName",
    width: 100
  },
  {
    title: "性别",
    dataIndex: "sex",
    align: "center",
    key: "sex",
    width: 100
  },
  {
    title: "身份证号",
    dataIndex: "idnum",
    key: "idnum",
    width: 160
  },
  {
    title: "考生号",
    dataIndex: "examNum",
    key: "examNum",
    width: 160
  },
  {
    title: "残疾类型",
    dataIndex: "disabilityType",
    align: "center",
    key: "disabilityType",
    width: 160
  },
  {
    title: "申请内容",
    dataIndex: "applyContent",
    key: "applyContent",
    width: "30%"
  },
  {
    title: "申请项数",
    dataIndex: "applyCount",
    align: "center",
    key: "applyCount",
    width: 100
  },
  {
    title: "告知书生成时间",
    dataIndex: "createdTime",
    align: "center",
    key: "createdTime",
    width: 160
  },
  {
    title: "考生是否确认",
    dataIndex: "hasAffirm",
    align: "center",
    key: "hasAffirm",
    width: 120,
    scopedSlots: { customRender: "hasAffirm" },
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      tableHeight: 0,

      columns,
      dataList: [],
      tableLoading: false,

      stripTotal: null, //查询列表总条数

      search: {
        affirmStatus: "0", //确认状态
        current: 1, //当前页
        pageSize: 20, //每页条数
        token: "",
        userName: ""
      },
    };
  },
  computed: {},
  created() {
    },
  mounted() {
    this.search.token = sessionStorage.getItem('temporaryV1.20_token')
    this.search.userName = sessionStorage.getItem('temporaryV1.20_userName')

    this.getList();
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list");
      this.tableHeight = tableHeight.clientHeight - 47 - 21;
    },

    //点击-打印告知书 '1a', 'Customer'
    printNote() {
      let report = "ReportSckstjkPd";
      // let data = "Customer";
      const { href } = this.$router.resolve({
        path: "/printNote",
        query: {
          report,
          // data,
        },
      });
      window.open(href, "_blank");
    },

    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.studentApplication.getList({
          ...this.search,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list;
          this.stripTotal = res.data.pagination.total;
          this.isMounted = true;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    //查询
    async searchList() {
      this.$refs.page.pagination.current = 1;
      this.search.current = 1;

      await this.getList();
      this.$refs.page.returnPageTotal();
    },
  },
};
</script>
 
<style lang = "less">
.studentApplication {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .list {
    flex-grow: 1;
    overflow-y: auto;
  }
}
</style>

