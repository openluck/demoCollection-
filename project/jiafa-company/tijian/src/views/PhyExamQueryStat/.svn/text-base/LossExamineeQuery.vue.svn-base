<template>
  <!-- 漏检考生查询  -->
  <div id="lossExamineeQuery">
    <div class="top" style="margin-bottom: 20px">
      <div class="topSearch">
        <div class="query">
          <div>
            <span class="name">机构：</span>
            <a-tree-select
              v-model="search.orgCode"
              style="width: 180px; margin-right: 20px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择"
              :tree-default-expand-all="false"
              :treeDefaultExpandedKeys="[search.orgCode]"
              :replaceFields="replaceFields"
              @select="onSelect"
            >
            </a-tree-select>
          </div>

          <div>
            <span class="name">体检医院：</span>
            <a-select
              style="width: 120px; margin-right: 20px"
              placeholder="请选择"
              allowClear
              v-model="search.tjzdm"
            >
              <a-select-option value> 全部 </a-select-option>
              <a-select-option
                :title="item.hospitalName"
                :value="item.hospitalCode"
                v-for="item in medicalHospitalList"
                :key="item.hospitalCode"
              >
                {{ item.hospitalName }}
              </a-select-option>
            </a-select>
          </div>

          <div>
            <span class="name">漏检科室：</span>
            <a-select
              style="width: 120px; margin-right: 15px"
              placeholder="请选择"
              allowClear
              v-model="search.lossDetectedDesk"
            >
              <a-select-option value> 全部 </a-select-option>
              <a-select-option
                :value="item.deskId"
                v-for="item in deskList"
                :key="item.deskId"
              >
                {{ item.deskName }}
              </a-select-option>
            </a-select>
          </div>
          <a-button type="primary" @click="searchList('1')">查询</a-button>
        </div>
        <div class="search">
          <a-input
            placeholder="考生号/姓名/身份证号"
            allowClear
            v-model="search.keyword"
            style="width: 180px; margin-right: 15px"
          />
          <a-button type="primary" @click="searchList('2')">搜索</a-button>
        </div>
      </div>
      <div class="topExport" style="margin-top: 15px">
        <a-button type="primary" @click="allExport">
          <svg-icon
            icon-class="daochu"
            :scale="0.8"
            style="margin-right: 5px"
          />
          导出Excel
        </a-button>
      </div>
    </div>

    <!-- 漏检考生查询列表 -->
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.id"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ x: 100, y: tableHeight }"
        size="middle"
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
// 查询列表结构
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    width: 200,
    key: "examNum",
    fixed: 'left'
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    width: 150,
    align: "center",
    key: "examName",
    fixed: 'left'
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: 100,
    align: "center",
    key: "sex"
  },
  {
    title: "身份证号",
    dataIndex: "idnum",
    width: 200,
    key: "idnum"
  },
  {
    title: "区县名称",
    dataIndex: "countyName",
    width: 250,
    key: "countyName"
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    width: 250,
    key: "assignsName"
  },
  {
    title: "体检医院名称",
    dataIndex: "hospitalName",
    width: 300,
    key: "hospitalName"
  },
  /* {
    title: "眼科",
    dataIndex: "ophthalmology",
    width: 100,
    align: "center",
    key: "ophthalmology"
  }, */
  {
    title: "眼科",
    children: [
      {
        title: "裸眼视力",
        dataIndex: "ucva",
        width: 100,
        align: "center",
        key: "ucva"
      },
      {
        title: "矫正视力",
        dataIndex: "cva",
        width: 100,
        align: "center",
        key: "cva"
      },
      {
        title: "色觉",
        dataIndex: "colorVision",
        width: 100,
        align: "center",
        key: "colorVision"
      },
      {
        title: "眼病",
        dataIndex: "eyeDisease",
        width: 100,
        align: "center",
        key: "eyeDisease"
      },
    ]
  },
  /* {
    title: "内科",
    dataIndex: "medicine",
    width: 100,
    align: "center",
    key: "medicine"
  }, */
  {
    title: "内科",
    children: [
      {
        title: "血压",
        dataIndex: "bloodPressure",
        width: 100,
        align: "center",
        key: "bloodPressure"
      },
      {
        title: "其他内科检查",
        dataIndex: "otherMedical",
        width: 120,
        align: "center",
        key: "otherMedical"
      },
    ]
  },
  /* {
    title: "外科",
    dataIndex: "surgery",
    width: 100,
    align: "center",
    key: "surgery"
  }, */
  {
    title: "外科",
    children: [
      {
        title: "身高&体重",
        dataIndex: "heightAndWeight",
        width: 100,
        align: "center",
        key: "heightAndWeight"
      },
      {
        title: "其他外科检查",
        dataIndex: "otherSurgery",
        width: 120,
        align: "center",
        key: "otherSurgery"
      },
    ]
  },
  /* {
    title: "耳鼻喉科",
    dataIndex: "ent",
    width: 100,
    align: "center",
    key: "ent"
  }, */
  {
    title: "耳鼻喉科",
    children: [
      {
        title: "听力",
        dataIndex: "ear",
        width: 100,
        align: "center",
        key: "ear"
      },
      {
        title: "嗅觉",
        dataIndex: "smell",
        width: 100,
        align: "center",
        key: "smell"
      },
      {
        title: "耳鼻咽喉",
        dataIndex: "ent",
        width: 100,
        align: "center",
        key: "ent"
      },
    ]
  },
  {
    title: "口腔科",
    dataIndex: "stomatology",
    width: 100,
    align: "center",
    key: "stomatology"
  },
  {
    title: "胸透",
    dataIndex: "xray",
    width: 100,
    align: "center",
    key: "xray"
  },
  {
    title: "转氨酶",
    dataIndex: "transaminase",
    width: 100,
    align: "center",
    key: "transaminase"
  }
];
export default {
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      tableHeight: 0, //table高度

      treeData: [], // 机构树数据
      replaceFields: {
        children: 'children',
        title: 'orgName',
        key: 'orgCode',
        value: 'orgCode',
      }, //替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段

      medicalHospitalList: [], // 体检医院
      deskList: [], //体检科室

      columns, // 查询列表结构
      dataList: [], // 查询列表数据
      tableLoading: false,
      stripTotal: null, //查询列表总条数

      search: {
        orgCode: null, //机构id
        tjzdm: '', //体检医院
        lossDetectedDesk: '', // 漏检科室
        keyword: "", //输入框内容
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "1" // 查询或搜索
      }
    }
  },
  mounted() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.search.orgCode = userInfo.orgCode
    this.treeData = JSON.parse(sessionStorage.getItem('treeData'))
    this.getList()
    this.getMedicalHospital()
    this.getDepartments()

    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {

    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 93 - 21 - 20;
    },

    // 机构树选择
    onSelect(selectedKeys, e) {
      console.log('onSelect', selectedKeys, e);
      this.search.orgCode = selectedKeys
      this.getMedicalHospital()
    },

    // 获取医院数据
    async getMedicalHospital() {
      try {
        const res = await this.$api.init.getMedicalHospital({
          orgCode: this.search.orgCode
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res.data.hospitalList);
          this.medicalHospitalList = res.data.hospitalList
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    // 获取体检科室
    async getDepartments() {
      try {
        const res = await this.$api.init.getDepartments({});
        if (res.code === "200" || res.code === 200) {
          console.log(res.data.list);
          this.deskList = res.data.list
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.PhyExamQueryStat.lossExamineeList({
          ...this.search
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list
          this.stripTotal = res.data.pagination.total
          this.isMounted = true
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 查询或搜索列表内容
    async searchList(type) {
      console.log(type)
      this.search.type = type
      this.$refs.page.pagination.current = 1
      this.search.current = 1;

      if (type === "1") {
        this.search.keyword = ""
      } else if (type === "2") {
        this.search.orgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgCode
        this.search.tjzdm = ''
        this.search.lossDetectedDesk = ''

        this.getMedicalHospital()
      }

      await this.getList()
      this.$refs.page.returnPageTotal()
    },

    // 导出
    async allExport() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        const res = await this.$api.PhyExamQueryStat.allExport({
          ...this.search,
          excelType: '6'
        });
        downloadFile(res)
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    }
  }
}
</script>
 
<style lang = "less">
#lossExamineeQuery {
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    .topSearch {
      display: flex;
      justify-content: space-between;
      .query {
        display: flex;
        width: 70%;
        flex-wrap: wrap;
      }
      .search {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
      }
    }
  }

  .list {
    flex-grow: 1;
    overflow-y: auto;
  }
}
</style>