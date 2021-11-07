<template>
  <div class="MissingExamineeQuery">
    <div class="MissingExamineeQueryT">
      <div class="conditionOrg">
        <div>机构 ：</div>
        <div>
          <a-select v-model="search.orgCode" style="width:180px">
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
        <a-button type="primary" @click="filterList"> 查 询 </a-button>
      </div>
      <div class="conditionOrgr">
        <div class="conditionOrg">
          
          <div>
            <a-input placeholder="考生号/姓名/身份证号" allow-clear v-model='search.keyword' style="width:180px" />
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
      </a-table>
    </div>
     <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
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
    title: "体检时间",
    dataIndex: "physicalDate",
    key: "physicalDate",
    width: "15%",
    align: "center",
  },
  {
    title: "午别",
    dataIndex: "middayDistinction",
    key: "middayDistinction",
    width: "10%",
    align: "center",
  },
  {
    title: "组号",
    dataIndex: "groupNum",
    key: "groupNum",
    width: "10%",
    align: "center",
  },

  {
    title: "组内序号",
    dataIndex: "intraclassNum",
    key: "intraclassNum",
    width: "10%",
    align: "center",
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      columns,
      orgList: [],
      dataList: [],
      tableHeight: 0, //table高度
      tableLoading: false,
      search: {
        current: 1, //当前页
        pageSize: 20, //每页条数
        orgCode: "", //机构代码
        keyword: "",
        type: '',
      },
      stripTotal: null,
    };
  },
  created() {
    this.orgList = JSON.parse(localStorage.getItem("hospitalOrgList"));
  },
  computed: {},
  mounted() {
    this.getList()
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
    async filterList() {
      this.search.keyword = ''
      this.search.type = '1'
      this.$refs.page.pagination.current = 1
      this.search.current = 1;
      await this.getList()
      this.$refs.page.returnPageTotal()
    },
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.MissingExamineeQuery.getList({
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
        excelType: '5',
        date: this.search.date,
        orgCode: this.search.orgCode,
        keyword: this.search.keyword
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
.MissingExamineeQuery {
  height: 100%;
  display: flex;
  flex-direction: column;
  .MissingExamineeQueryT {
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
    .conditionOrgr {
      display: flex;
      height: 100%;
      width: 100px;
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
  .export {
    margin-bottom: 20px;
  }
  .list{
    flex-grow: 1;
    overflow-y: auto;
  }
}
</style>
