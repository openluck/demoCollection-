<template>
  <div class="PhyExamProgressStat">
    <div class="PhyExamProgressStatT">
      <div class="conditionOrg">
        <div >机构 ：</div>
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
        <a-button type="primary" @click="filterList"> 查 询 </a-button>
      </div>
      <div class="export"><a-button @click="getExport" type="primary"> 导出Excel </a-button></div>
    </div>
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.orgCode"
        bordered
        :pagination="false"
         :scroll="{ y: tableHeight }"
         :loading="tableLoading"
      >
      </a-table>
       <div class="addRow">
        <div class="addItem" style="width:20%;">总计</div>
        <div class="addItem" style="width:10%;">{{getArrayObjAdd(dataList,'physicalSum')}}</div>
        <div class="addItem" style="width:10%;">{{getArrayObjAdd(dataList,'noDetected')}}</div>
        <div class="addItem" style="width:10%;">{{getArrayObjAdd(dataList,'detected')}}</div>
        <div class="addItem" style="width:10%;">{{getArrayObjAdd(dataList,'undetected')}}</div>
        <div class="addItem" style="width:10%;">{{getArrayObjAdd(dataList,'lossDetected')}}</div>
        <div class="addItem" style="width:10%;">{{getArrayObjAdd(dataList,'missDetected')}}</div>
        <div class="addItem" style="width:10%;">{{getArrayObjAdd(dataList,'collected')}}</div>
        <div style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'perorate')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArrayObjAdd, downloadFile } from "@/utils/util.js";
const columns = [
  {
    title: "机构名称",
    dataIndex: "orgName",
    key: "orgName",
    width: "20%",
    align: "center",
  },
  {
    title: "考生总数（人）",
    dataIndex: "physicalSum",
    key: "physicalSum",
    width: "10%",
    align: "center",
  },
  {
    title: "不参检考生（人）",
    dataIndex: "noDetected",
    key: "noDetected",
    width: "10%",
    align: "center",
  },
  {
    title: "参检考生（人）",
    dataIndex: "detected",
    key: "detected",
    width: "10%",
    align: "center",
  },

  {
    title: "体检过程人数统计（人）",
    children: [
      {
        title: "未检",
        dataIndex: "undetected",
        key: "undetected",
        width: "10%",
        align: "center",
      },
      {
        title: "漏检",
        dataIndex: "lossDetected",
        key: "lossDetected",
        width: "10%",
        align: "center",
      },
      {
        title: "缺检",
        dataIndex: "missDetected",
        key: "missDetected",
        width: "10%",
        align: "center",
      },
      {
        title: "已收表",
        dataIndex: "collected",
        key: "collected",
        width: "10%",
        align: "center",
      },
      {
        title: "已下结论",
        dataIndex: "perorate",
        key: "perorate",
        width: "10%",
        align: "center",
      },
    ],
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      columns,
      orgList: [],
      dataList: [],
      tableHeight: 0, //table高度
      tableLoading: false,
      search: {
        orgCode: "", //机构代码
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
    getArrayObjAdd,
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 109 - 47;
    },
    filterList() {
      this.getList()
    },
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.PhyExamProgressStat.getList({
          ...this.search,
        });
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
      this.$store.state.app.exportSpinLoading = true;
      const data = {
        excelType: '2',
        orgCode: this.search.orgCode,
        type: '1'
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
.PhyExamProgressStat {
  height: 100%;
  display: flex;
  flex-direction: column;
  .PhyExamProgressStatT {
    width: 100%;
    height: 34px;
    margin-bottom: 20px;
    display: flex;
    .conditionOrg {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
    .searchBtn {
      height: 100%;
      width: 100px;
      display: flex;
      align-items: center;
    }
    .export {
      height: 100%;
      width: 100px;
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
   .list{
     flex-grow: 1;
     overflow-y: auto;
    .addRow{
      display:flex;
      background-color:#FAFAFA;
      height:46px;
      padding-right: 8px;
      align-items: center;
      justify-content: space-around;
      border: 1px solid #e8e8e8;
      border-top: 0;
      .addItem{
        text-align:center;
      }
    }
  }
}
</style>
