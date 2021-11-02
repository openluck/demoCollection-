<template>
  <div class="PhyExamStatusStat">
    <div class="PhyExamStatusStatT">
      <div class="conditionOrg">
        <div >机构 ：</div>
        <div>
          <a-select v-model="search.orgCode"  @change="orgChange"  style="width: 180px">
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
      <div class="conditionDate">
        <div>体检日期 ：</div>
        <div>
          <a-date-picker v-model="search.physicalDate" style="width: 120px" >  
            <template slot="dateRender" slot-scope="current, today">
              <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </div>
      </div>
      <div class="searchBtn">
        <a-button @click="filterList" type="primary"> 查 询 </a-button>
      </div>
      <div class="export"><a-button @click="getExport" type="primary"><svg-icon icon-class="daochu" :scale="0.8" style="margin-right: 5px"></svg-icon> 导出Excel </a-button></div>
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
        <div class="addItem" style="width:21%;">总计</div>
        <div class="addItem" style="width:11%;">{{getArrayObjAdd(dataList,'joinNum')}}</div>
        <div class="addItem" style="width:12%;">{{getArrayObjAdd(dataList,'confirmNum')}}</div>
        <div class="addItem" style="width:8%;">{{getArrayObjAdd(dataList,'ophthalmology')}}</div>
        <div class="addItem" style="width:8%;">{{getArrayObjAdd(dataList,'medicine')}}</div>
        <div class="addItem" style="width:8%;">{{getArrayObjAdd(dataList,'surgery')}}</div>
        <div class="addItem" style="width:8%;">{{getArrayObjAdd(dataList,'stomatology')}}</div>
        <div class="addItem" style="width:8%;">{{getArrayObjAdd(dataList,'ent')}}</div>
        <div class="addItem" style="width:8%;">{{getArrayObjAdd(dataList,'xray')}}</div>
        <div style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'liver')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArrayObjAdd, downloadFile } from "@/utils/util.js";
import moment from "moment";
const columns = [
  {
    title: "机构名称",
    dataIndex: "orgName",
    key: "orgName",
    width: "10%",
    align: "center",
  },
  {
    title: "体检日期",
    dataIndex: "physicalDate",
    key: "physicalDate",
    width: "11%",
    align: "center",
  },
  {
    title: "当日参加体检人数",
    dataIndex: "joinNum",
    key: "joinNum",
    width: "11%",
    align: "center",
  },
  {
    title: "当日常规五项已确定人数",
    dataIndex: "confirmNum",
    key: "confirmNum",
    width: "12%",
    align: "center",
  },

  {
    title: "各科室确定体检人数",
    children: [
      {
        title: "眼科",
        dataIndex: "ophthalmology",
        key: "ophthalmology",
        width: "8%",
        align: "center",
      },
      {
        title: "内科",
        dataIndex: "medicine",
        key: "medicine",
        width: "8%",
        align: "center",
      },
      {
        title: "外科",
        dataIndex: "surgery",
        key: "surgery",
        width: "8%",
        align: "center",
      },
      {
        title: "口腔",
        dataIndex: "stomatology",
        key: "stomatology",
        width: "8%",
        align: "center",
      },
      {
        title: "耳鼻喉",
        dataIndex: "ent",
        key: "ent",
        width: "8%",
        align: "center",
      },
      {
        title: "胸透",
        dataIndex: "xray",
        key: "xray",
        width: "8%",
        align: "center",
      },
      {
        title: "肝功",
        dataIndex: "liver",
        key: "liver",
        width: "8%",
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
      tableHeight: 0, //table高度
      tableLoading: false,
      orgList: [],
      dataList: [],
      dateList: [], //体检日期
      search: {
        physicalDate: null, //日期
        orgCode: "", //机构代码
      },
      userCode: '',

    };
  },
  created() {
    this.orgList = JSON.parse(localStorage.getItem("hospitalOrgList"));
    this.userCode = JSON.parse(sessionStorage.getItem('userInfo')).orgCode 
    this.search.physicalDate = moment()
    this.getDate(this.userCode)
  },
  computed: {},
  mounted() {
    this.getList();
    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    moment,
    getArrayObjAdd,
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 109 - 47 - 15;
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (this.dateList.includes(current.format("YYYY-MM-DD"))) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      }
      return style;
    },
    orgChange(value) {
      // console.log(value);
      this.search.orgCode = value
      this.getDate(this.search.orgCode)
    },
    filterList() {
      this.getList()
    },
    async getList() {
      let { physicalDate } = this.search;
        if (physicalDate) {
          physicalDate = moment(physicalDate).format("YYYY-MM-DD");
        }
       this.tableLoading = true;
      try {
        const res = await this.$api.PhyExamStatusStat.getList({
          ...this.search, physicalDate
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
    async getDate(code) {
      const data = {
        orgCode: code
      }
      try {
        const res = await this.$api.PhyExamStatusStat.getMedicalDate(data);
        if (res.code === 200) {
         this.dateList = res.data.Datelist
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getExport() {
       this.$store.state.app.exportSpinLoading = true;
      const data = {
        excelType: '1',
        date: this.search.date,
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
    }
  },
};
</script>

<style scoped lang="less">
.PhyExamStatusStat {
  height: 100%;
  display: flex;
  flex-direction: column;
  .PhyExamStatusStatT {
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
    .conditionDate {
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
      padding-right: 5px;
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
