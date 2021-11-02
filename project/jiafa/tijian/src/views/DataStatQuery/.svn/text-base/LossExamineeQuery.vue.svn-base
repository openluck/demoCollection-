<template>
  <div class="LossExamineeQuery">
    <div class="LossExamineeQueryT">
      <div class="conditionOrg">
        <div >机构 ：</div>
        <div>
          <a-select v-model="search.orgCode" style="width: 180px">
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
      <div class="conditionOrg">
        <div >漏检科室 ：</div>
        <div>
          <a-select v-model="search.lossDetectedDesk" style="width: 120px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option
              v-for="(item, index) in getDepartmentsList"
              :key="index"
              :value="item.deskId"
            >
              {{ item.deskName }}
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
        :scroll="{ x: 2400, y: tableHeight }"
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
    width: 200,
    align: "center",
    fixed: "left",
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    key: "examName",
    width: 200,
    align: "center",
    fixed: "left",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    width: 100,
    align: "center",
  },
  {
    title: "身份证号",
    dataIndex: "idnum",
    key: "idnum",
    width: 200,
    align: "center",
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    key: "assignsName",
    width: 300,
    align: "center",
  },
  {
    title: "眼科",
    dataIndex: "ophthalmology",
    key: "ophthalmology",
    width: 800,
    align: "center",
    children: [
      {
        title: '裸眼视力',
        dataIndex: 'ucva',
        key: 'ucva',
        width: 200,
        align: "center",
      },
      {
        title: '矫正视力',
        dataIndex: 'cva',
        key: 'cva',
        width: 200,
        align: "center",
      },
      {
        title: '色觉',
        dataIndex: 'colorVision',
        key: 'colorVision',
        width: 200,
        align: "center",
      },
      {
        title: '眼病',
        dataIndex: 'eyeDisease',
        key: 'eyeDisease',
        width: 200,
        align: "center",
      },
    ],
  },
  {
    title: "内科",
    dataIndex: "medicine",
    key: "medicine",
    width: 400,
    align: "center",
    children: [
      {
        title: '血压',
        dataIndex: 'bloodPressure',
        key: 'bloodPressure',
        width: 200,
        align: "center",
      },
      {
        title: '其他内科检查',
        dataIndex: 'otherMedical',
        key: 'otherMedical',
        width: 200,
        align: "center",
      },
    ],
  },
  {
    title: "外科",
    dataIndex: "surgery",
    key: "surgery",
    width: 400,
    align: "center",
    children: [
      {
        title: '身高&体重',
        dataIndex: 'heightAndWeight',
        key: 'heightAndWeight',
        width: 200,
        align: "center",
      },
      {
        title: '其他外科检查',
        dataIndex: 'otherSurgery',
        key: 'otherSurgery',
        width: 200,
        align: "center",
      }
    ],
  },

  {
    title: "耳鼻喉科",
    dataIndex: "ent",
    key: "ent",
    width: 600,
    align: "center",
    children: [
      {
        title: '听力',
        dataIndex: 'ear',
        key: 'ear',
        width: 200,
        align: "center",
      },
      {
        title: '嗅觉',
        dataIndex: 'smell',
        key: 'smell',
        width: 200,
        align: "center",
      },
      {
        title: '耳鼻咽喉',
        dataIndex: 'ent',
        key: 'ent',
        width: 200,
        align: "center",
      },
    ],
  },
  {
    title: "口腔科",
    dataIndex: "stomatology",
    key: "stomatology",
    width: 200,
    align: "center",
  },
  {
    title: "胸透",
    dataIndex: "xray",
    key: "xray",
    width: 200,
    align: "center",
  },
  {
    title: "转氨酶",
    dataIndex: "transaminase",
    key: "transaminase",
    width: 200,
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
      getDepartmentsList: [], //体检卡科室数组
      tableHeight: 0, //table高度
      tableLoading: false,
      dataList: [],
      search: {
        orgCode: "", //机构代码
        lossDetectedDesk: "", //漏检科室id
        keyword: "", //关键词
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "", //类型
      },
      stripTotal: null,
     
    };
  },
  created() {
    this.orgList = JSON.parse(localStorage.getItem("hospitalOrgList"));
  },
  computed: {},
  mounted() {
    this.getList();
    this.getDepartments();
    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 109 - 21 - 20;
    },
    async keyWordChange() {
      this.search.orgCode = ''
      this.search.lossDetectedDesk = ''
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
        const res = await this.$api.LossExamineeQuery.getList({
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
    async getDepartments() {
      try {
        const res = await this.$api.init.getDepartments();
        if (res.code === 200) {
          this.getDepartmentsList = res.data.list;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getExport() {
      this.$store.state.app.exportSpinLoading = true;
      const data = {
        excelType: '4',
        lossDetectedDesk: this.search.lossDetectedDesk,
        orgCode: this.search.orgCode,
        keyword: this.search.keyword,
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
.LossExamineeQuery {
  height: 100%;
  display: flex;
  flex-direction: column;
  .LossExamineeQueryT {
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
