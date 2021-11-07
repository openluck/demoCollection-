<template>
  <div class="RefuseAdmitQuery">
    <div class="RefuseAdmitQueryT">
      <div class="conditionOrg">
        <div>机构 ：</div>
        <div>
         <a-select v-model="search.orgCode"  style="width: 180px">
           <a-select-option value="">全部</a-select-option>
            <a-select-option
              v-for="(item, index) in orgList"
              :key="index"
              :value="item.orgCode"
              :title="item.orgName"
            >
              {{ item.orgName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="searchBtn">
        <a-button type="primary" @click="orgFilter"> 查 询 </a-button>
      </div>
      <div class="conditionOrgr">
        <div class="conditionOrg">
          <div></div>
          <div>
            <a-input placeholder="考生号/姓名/身份证号" allow-clear v-model='search.keyword' style="width: 180px" />
          </div>
        </div>
        <div class="searchBtn">
          <a-button type="primary" @click="keyWordChange"> 搜 索 </a-button>
        </div>
      </div>
    </div>
    <div class="export"><a-button @click="getExport" type="primary"><svg-icon icon-class="daochu" :scale="0.8" style="margin-right: 5px"></svg-icon> 导出Excel </a-button></div>
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.examNum"
        bordered
        :pagination="false"
        :scroll="{ y: tableHeight }"
        :loading="tableLoading"
      >
       <!-- 不予录取原因 -->
        <span slot="unadmitReason" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">
              {{ text }}
            </template>
            <span type="primary">{{ text }}</span>
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <template style="magin-bottom:20px" v-if="isMounted">
      <Page style="magin-bottom:20px" v-show="dataList.length" @getList="getList" ref="page" />
    </template>
  </div>
</template>

<script>
import { downloadFile } from "@/utils/util.js";
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    key: "examNum",
    width: 150,
    align: "center",
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    key: "examName",
    width: "10%",
    align: "center",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    width: "10%",
    align: "center",
  },
  {
    title: "身份证号",
    dataIndex: "idnum",
    key: "idnum",
    width: 160,
    align: "center",
  },
    {
    title: "报名点名称",
    dataIndex: "assignsName",
    key: "assignsName",
    width: "15%",
    align: "center",
  },
    {
    title: "体检医院名称",
    dataIndex: "hospitalName",
    key: "hospitalName",
    width: "15%",
    align: "center",
  },
    {
    title: "不予录取原因",
    dataIndex: "unadmitReason",
    key: "unadmitReason",
    width: "30%",
    align: "center",
    scopedSlots: { customRender: "unadmitReason" },
    ellipsis: true
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      stripTotal: null, //查询列表总条数
      tableHeight: 0, //table高度
      tableLoading: false,
      columns,
      orgList: [],
      dataList: [],
      search: {
        keyword: "", //关键词
        orgCode: "", //机构代码
        type: '',
        current: 1, //当前页
        pageSize: 20, //每页条数
      },
    };
  },
  created() {
    this.orgList = JSON.parse(localStorage.getItem("hospitalOrgList"));
  },
  computed: {},
  mounted() {
    this.getList();
    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 55 - 21 - 20;
    },
    async keyWordChange() {
      this.search.orgCode = ''
      this.search.type = '2'
      this.$refs.page.pagination.current = 1
      this.search.current = 1;
      await this.getList();
      this.$refs.page.returnPageTotal()
    },
    async orgFilter() {
      this.search.keyword = ''
      this.search.type = '1'
       this.$refs.page.pagination.current = 1
      this.search.current = 1;
      await this.getList();
      this.$refs.page.returnPageTotal()
    },
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.RefuseAdmitQuery.getList({
          ...this.search,
        });
        if (res.code === 200) {
          this.dataList = res.data.list;
          this.stripTotal = res.data.pagination.total
          this.isMounted = true
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },
    async getExport() {
       this.$store.state.app.exportSpinLoading = true;
      const data = {
        excelType: '3',
        keyword: this.search.keyword,
        orgCode: this.search.orgCode,
      }
      try {
        const res = await this.$api.PhyExamStatusStat.allExport(data);
        if (res) {
          downloadFile(res)
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.RefuseAdmitQuery {
  height: 100%;
  display: flex;
  flex-direction: column;
  .RefuseAdmitQueryT {
    width: 100%;
    height: 34px;
    margin-bottom: 10px;
    display: flex;
    .conditionOrg {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
    .searchBtn {
      height: 100%;
      // width: 100px;
      display: flex;
      align-items: center;
    }
    .conditionOrgr{
      display: flex;
      height: 100%;
      width: 100px;
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
  .export{
    margin-bottom: 20px;
  }
  .list{
    flex-grow: 1;
    overflow-y: auto;
  }
}
</style>
