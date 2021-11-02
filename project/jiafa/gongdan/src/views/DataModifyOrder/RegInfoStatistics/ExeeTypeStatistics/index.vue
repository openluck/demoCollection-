<template>
  <!-- 考生类型统计 -->
  <div class="exeetype-statistics">
    <div class="org-filter">
      <label for>机构：</label>
      <a-tree-select
        :tree-data="affiliationList"
        tree-data-simple-mode
        :allowClear="true"
        :replaceFields="{
          children: 'children',
          title: 'title',
          key: 'key',
          value: 'value',
        }"
        v-model="filter.affiliationCode"
        @change="affiliationChange"
        style="width: 200px"
        :dropdownStyle="{ 'max-height': '60vh' }"
        placeholder="请选择~"
      />
      <a-button type="primary" @click="orgFilter()" style="margin-left:20px">
        <svg-icon
          icon-class="sousuo"
          class="icon_item"
          style="margin-right:6px;font-size:12px"
        ></svg-icon
        >搜索
      </a-button>
    </div>
    <div class="bread">
      <a-breadcrumb v-if="addrList.length">
        <a-breadcrumb-item v-for="item in addrList" :key="item.orgId">
          <a @click="backTo(item)">{{ item.orgName }}</a>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <a-breadcrumb v-else>
        <a-breadcrumb-item>{{ curUserOrgName }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="statistics-table">
      <a-table
        v-if="filter.affiliationType === '4' && isGetRes === true"
        :columns="columnsSchool"
        :data-source="tableData"
        bordered
        size="middle"
        :pagination="false"
        :scroll="{ y: tableHeight }"
      >
        <div class="tableFooter" slot="footer" slot-scope="currentPageData">
          <span style="width:28%;text-align:center;">合计</span>
          <span style="width:7%;text-align:center;">{{getArrayObjAdd(currentPageData,"cityExee")}}</span>
          <span style="width:7%;text-align:center;">{{getArrayObjAdd(currentPageData,"ruralExee")}}</span>

          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'previousExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'presentExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'EnglishExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'minorityLangExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'juniorClassExee')
          }}</span>
          <span style="width:10%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'specialEduExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'ethnicMinoritiesExee')
          }}</span>
        </div>
      </a-table>
      <a-table
        v-else
        :columns="columns"
        :data-source="tableData"
        bordered
        size="middle"
        :pagination="false"
        :scroll="{ y: tableHeight }"
      >
        <div class="tableFooter" slot="footer" slot-scope="currentPageData">
          <span style="width:26%;text-align:center;">合计</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'cityExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'ruralExee')
          }}</span>

          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'previousExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'presentExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'EnglishExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'minorityLangExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'juniorClassExee')
          }}</span>
          <span style="width:10%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'specialEduExee')
          }}</span>
          <span style="width:8%;text-align:center;">{{
            getArrayObjAdd(currentPageData, 'ethnicMinoritiesExee')
          }}</span>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getArrayObjAdd } from '../../../../Utils/util'
const columns = [
  {
    title: '机构代码',
    dataIndex: 'orgCode',
    key: 'orgCode',
    align: 'center',
    width: '8%',
  },
  {
    title: "机构名称",
    dataIndex: "orgName",
    key: "orgName",
    align: "center",
    ellipsis: true,
    width: "18%"
  },
  {
    title: '户籍性质',
    children: [
      {
        title: '城市考生',
        dataIndex: 'cityExee',
        key: 'cityExee',
        align: 'center',
        width: '8%',
      },
      {
        title: '农村考生',
        dataIndex: 'ruralExee',
        key: 'ruralExee',
        align: 'center',
        width: '8%',
      },
    ],
  },
  {
    title: '应往届',
    children: [
      {
        title: '往届考生',
        dataIndex: 'previousExee',
        key: 'previousExee',
        align: 'center',
        width: '8%',
      },
      {
        title: '应届考生',
        dataIndex: 'presentExee',
        key: 'presentExee',
        align: 'center',
        width: '8%',
      },
    ],
  },
  {
    title: '应试外语考生',
    children: [
      {
        title: '英语考生',
        dataIndex: 'EnglishExee',
        key: 'EnglishExee',
        align: 'center',
        width: '8%',
      },
      {
        title: '小语种考生',
        dataIndex: 'minorityLangExee',
        key: 'minorityLangExee',
        align: 'center',
        width: '8%',
      },
    ],
  },
  {
    title: '考生特征',
    children: [
      {
        title: '少年班考生',
        dataIndex: 'juniorClassExee',
        key: 'juniorClassExee',
        align: 'center',
        width: '8%',
      },
      {
        title: '特殊教育单考考生',
        dataIndex: 'specialEduExee',
        key: 'specialEduExee',
        align: 'center',
        width: '10%',
      },
    ],
  },
  {
    title: '少数民族考生',
    dataIndex: 'ethnicMinoritiesExee',
    key: 'ethnicMinoritiesExee',
    align: 'center',
    width: '8%',
  },
]
const columnsSchool = [
  {
    title: "机构名称",
    dataIndex: "orgName",
    key: "orgName",
    align: "center",
    ellipsis: true,
    width: "20%"
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    align: 'center',
    width: '8%',
  },
  {
    title: '户籍性质',
    children: [
      {
        title: "城市考生",
        dataIndex: "cityExee",
        key: "cityExee",
        align: "center",
        width: "7%"
      },
      {
        title: "农村考生",
        dataIndex: "ruralExee",
        key: "ruralExee",
        align: "center",
        width: "7%"
      }
    ]
  },
  {
    title: '应往届',
    children: [
      {
        title: '往届考生',
        dataIndex: 'previousExee',
        key: 'previousExee',
        align: 'center',
        width: '8%',
      },
      {
        title: '应届考生',
        dataIndex: 'presentExee',
        key: 'presentExee',
        align: 'center',
        width: '8%',
      },
    ],
  },
  {
    title: '应试外语考生',
    children: [
      {
        title: '英语考生',
        dataIndex: 'EnglishExee',
        key: 'EnglishExee',
        align: 'center',
        width: '8%',
      },
      {
        title: '小语种考生',
        dataIndex: 'minorityLangExee',
        key: 'minorityLangExee',
        align: 'center',
        width: '8%',
      },
    ],
  },
  {
    title: '考生特征',
    children: [
      {
        title: '少年班考生',
        dataIndex: 'juniorClassExee',
        key: 'juniorClassExee',
        align: 'center',
        width: '8%',
      },
      {
        title: '特殊教育单考考生',
        dataIndex: 'specialEduExee',
        key: 'specialEduExee',
        align: 'center',
        width: '10%',
      },
    ],
  },
  {
    title: '少数民族考生',
    dataIndex: 'ethnicMinoritiesExee',
    key: 'ethnicMinoritiesExee',
    align: 'center',
    width: '8%',
  },
]
export default {
  name: '',
  components: {},
  data() {
    return {
      columns,
      columnsSchool,
      isGetRes: false,
      affiliationList: [], // 所属机构列表
      filter: {
        affiliationId: '', //所属机构Id
        affiliationCode: '', //所属机构代码
        affiliationName: '', //所属机构代码
        affiliationType: '',
      },

      addrList: [], //面包屑地址数组
      curUserOrgName: '',
      tableData: [],
      tableHeight: null,
      screenHeight: null,
    }
  },
  watch: {
    // 监听屏幕高度
    screenHeight(val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 340
      
    },
  },
  computed: {},
  created() {
    this.curUserOrgId = JSON.parse(sessionStorage.getItem('userInfo')).orgId
    this.curUserOrgName = JSON.parse(sessionStorage.getItem('userInfo')).orgName
  },
  mounted() {
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    this.getAffiliationTree()
  },
  methods: {
    getArrayObjAdd,
    initCode() {
      let curOrg = this.affiliationList[0]
      this.filter.affiliationId = curOrg.orgId
      this.filter.affiliationCode = curOrg.orgCode
      this.filter.affiliationName = curOrg.orgName
      this.filter.affiliationType = curOrg.orgType
      this.getExeeTypeStaList()
    },
    // 获取所属机构树
    async getAffiliationTree() {
      const res = await this.$api.ApplyDataSearch.getAffiliationTree()
      let data = res.data.list
      if (res.code === '200') {
        data.map((item) => {
          item['id'] = item['orgCode']
          item['pId'] = item['parentCode']
          item['title'] = `[${item['orgCode']}] ${item['orgName']}`
          item['value'] = item['orgCode']
        })
        this.affiliationList = [...data]
        this.initCode()
      } else {
        this.$message.error(res.message)
      }
    },
    // 所属机构改变事件
    affiliationChange(val, label, extra) {
      this.isGetRes = false
      if (val) {
        // this.orgName = extra.triggerNode.dataRef.orgName
        this.orgName = label
        if (extra.triggerNode) {
          this.filter.affiliationId = extra.triggerNode.dataRef.orgId
          this.filter.affiliationName = label
          this.filter.affiliationCode = val
          this.filter.affiliationType = extra.triggerNode.dataRef.orgType
        } else {
          this.filter.affiliationId = extra.orgId
          this.filter.affiliationName = label
          this.filter.affiliationCode = val
          this.filter.affiliationType = extra.orgType
        }

        this.addrList = []
        this.dealBread(val)
        this.addrList = this.addrList.reverse()
      } else {
        this.addrList = []
      }
    },
    /**
     * 机构搜索
     */
    orgFilter() {
      this.getExeeTypeStaList()
    },
    //点击面包屑事件
    backTo(item) {
      this.filter.affiliationId = item.orgId
      this.filter.affiliationCode = item.orgCode
      this.filter.affiliationType = item.orgType
      this.filter.affiliationName = item.orgName
      this.affiliationChange(item.orgCode, item.orgName, item)
      this.getExeeTypeStaList()
    },
    dealBread(orgCode) {
      let a = this.affiliationList.find((item) => item.orgCode === orgCode)
      this.addrList.push(a)
      let accountName = JSON.parse(sessionStorage.getItem('userInfo'))
        .accountName
      if (a.orgCode !== accountName) {
        this.dealBread(a.parentCode)
      }
    },

    async getExeeTypeStaList() {
      this.isGetRes = true
      const result = await this.$api.exeeTypeStatistics.getExeeTypeStaList(
        this.filter
      )
      if (result.code === '200') {
        this.tableData = result.data.list
      }
    },
  },
}
</script>

<style scoped lang="less">
.exeetype-statistics {
  .org-filter {
    height: 60px;
    line-height: 60px;
    margin: 0 10px;
  }
  .bread {
    margin-left: 10px;
  }
  .statistics-table {
    margin: 10px 10px 0 10px;
  }
  /deep/.ant-table-footer {
    width: 100%;
    padding: 16px 0;
    background-color: #fafafa;
    background-origin: border-box;
    position: absolute;
    /* bottom: 0; */
  }
  .tableFooter {
    width: calc(100%);
    font-size: 0px;
    span {
      font-size: 14px;
      display: inline-block;
      text-align: center;
    }
  }
}
</style>
