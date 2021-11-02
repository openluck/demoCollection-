<template>
  <!-- 跨地区考生查询 -->
  <div id="transRegionalExamineeQuery">
    <div class="top" style="margin-bottom: 15px">
      <div class="topSearch">
        <div class="query">
          <div>
            <span class="name">考籍所在地：</span>
            <a-tree-select
              v-model="search.examMembershipLocation"
              style="width: 180px; margin-right: 20px"
              allowClear
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="examTreeData"
              placeholder="请选择"
              :tree-default-expand-all="false"
              :replaceFields="examReplaceFields"
            >
            </a-tree-select>
          </div>

          <div>
            <span class="name">体检所在地：</span>
            <a-tree-select
              v-model="search.phyExamLocation"
              style="width: 180px; margin-right: 15px"
              allowClear
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="phyTreeData"
              placeholder="请选择"
              :tree-default-expand-all="false"
              :replaceFields="phyReplaceFields"
            >
            </a-tree-select>
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

    <!-- 跨地区考生查询列表 -->
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.examineeId"
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

function filterArray(data, parentCode) {
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parentCode === parentCode) {
      var obj = data[i];
      temp = filterArray(data, data[i].orgCode);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}

// 查询列表结构
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    width: 180,
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
    dataIndex: "examGender",
    width: 100,
    align: "center",
    key: "examGender"
  },
  {
    title: "身份证号",
    dataIndex: "IDNum",
    width: 180,
    key: "IDNum"
  },
  {
    title: "考籍地区名称",
    dataIndex: "cityName",
    width: 200,
    key: "cityName"
  },
  {
    title: "考籍区县名称",
    dataIndex: "countyName",
    width: 200,
    key: "countyName"
  },
  {
    title: "考籍报名点名称",
    dataIndex: "assignsName",
    width: 300,
    key: "assignsName"
  },
  {
    title: "考籍班级代码",
    dataIndex: "classCode",
    width: 200,
    key: "classCode"
  },
  {
    title: "体检地区名称",
    dataIndex: "phyExamCityName",
    width: 200,
    key: "phyExamCityName"
  },
  {
    title: "体检区县名称",
    dataIndex: "phyExamCountyName",
    width: 200,
    key: "phyExamCountyName"
  },
  {
    title: "体检报名点名称",
    dataIndex: "phyExamAssignsName",
    width: 300,
    key: "phyExamAssignsName"
  },
  {
    title: "体检班级代码",
    dataIndex: "phyExamClassCode",
    width: 200,
    key: "phyExamClassCode"
  }
];
export default {
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      tableHeight: 0, //table高度

      orgCode: '', // 机构code
      examTreeData: [], // 考籍所在地树
      examReplaceFields: {
        children: 'children',
        title: 'examMemLocalName',
        key: 'examMemLocalCode',
        value: 'examMemLocalCode'
      }, //替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段
      phyTreeData: [], // 体检所在地树
      phyReplaceFields: {
        children: 'children',
        title: 'phyExamLocalName',
        key: 'phyExamLocalCode',
        value: 'phyExamLocalCode'
      }, //替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段

      columns, // 查询列表结构
      dataList: [], // 查询列表数据
      tableLoading: false,
      stripTotal: null, //查询列表总条数

      search: {
        examMembershipLocation: null, //考籍所在地
        phyExamLocation: null, //体检所在地
        keyword: "", //输入框内容
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "1" //查询或搜索
      }
    }
  },
  mounted() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.orgCode = userInfo.orgCode

    this.getExamMemLocationTree()
    this.getPhyExamLocationTree()
    this.getList()

    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    filterArray,

    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 47 - 21 - 20;
    },

    // 获取考籍所在地树
    async getExamMemLocationTree() {
      try {
        const res = await this.$api.applyDetail.examMemLocationTree({});
        if (res.code === "200" || res.code === 200) {
          console.log(res.data)
          if (res.data.length) {
            const tempArr = res.data.map(item => ({ ...item, orgCode: item.examMemLocalCode }))
            this.examTreeData = this.filterArray(
              tempArr,
              res.data[0].parentCode
            );
            console.log(this.examTreeData)
          }
        }
      } catch (error) {
        this.$message.error("请求失败," + error);
      }
    },
    // 获取体检所在地树
    async getPhyExamLocationTree() {
      try {
        const res = await this.$api.applyDetail.phyExamLocationTree({});
        if (res.code === "200" || res.code === 200) {
          console.log(res.data)
          if (res.data.length) {
            const tempArr = res.data.map(item => ({ ...item, orgCode: item.phyExamLocalCode }))
            this.phyTreeData = this.filterArray(
              tempArr,
              res.data[0].parentCode
            );
            console.log(this.phyTreeData)
          }
        }
      } catch (error) {
        this.$message.error("请求失败," + error);
      }
    },
    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        let { examMembershipLocation, phyExamLocation } = this.search
        if (examMembershipLocation === null) examMembershipLocation = ""
        if (phyExamLocation === null) phyExamLocation = ""

        const res = await this.$api.PhyExamQueryStat.TransRegionalExamineeList({
          ...this.search, examMembershipLocation, phyExamLocation
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
        this.search.examMembershipLocation = null
        this.search.phyExamLocation = null
      }

      await this.getList()
      this.$refs.page.returnPageTotal()
    },
    // 导出
    async allExport() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        let { examMembershipLocation, phyExamLocation } = this.search
        if (examMembershipLocation === null) examMembershipLocation = ""
        if (phyExamLocation === null) phyExamLocation = ""
        const res = await this.$api.PhyExamQueryStat.allExport({
          ...this.search,
          examMembershipLocation,
          phyExamLocation,
          excelType: '1'
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
#transRegionalExamineeQuery {
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