<template>
<!-- 体检受限统计  -->
  <div id="physicalLimitationStatistics">
    <div class="top" style="margin-bottom: 20px">
      <div class="topSearch">
        <span class="name">机构：</span>
        <!-- 机构树 -->
        <a-tree-select
          v-model="search.orgCode"
          style="width: 180px;margin-right:15px"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          placeholder="请选择"
          :tree-default-expand-all="false"
          :treeDefaultExpandedKeys="[search.orgCode]"
          :replaceFields="replaceFields"
          @select="onSelect"
        >
        </a-tree-select>

        <a-button type="primary" @click="searchList" style="margin-right:15px;">查询</a-button>

        <a-button type="primary" @click="allExport">
          <svg-icon icon-class="daochu" :scale="0.8" style="margin-right:5px;" />
          导出Excel
        </a-button>
      </div>
      <!-- <div class="topExport" style="margin-top: 15px">
        <div class="left">
          <a-button type="primary" @click="allExport">
            <svg-icon icon-class="daochu" :scale="0.8" style="margin-right:5px;" />
            导出Excel
          </a-button>
        </div>
        <div class="right">
          <a-breadcrumb>
            <a-breadcrumb-item v-for="item in orgList" :key="item.orgCode"><a @click="changeOrg(item)">{{item.orgName}}</a></a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div> -->
      <div class="breadcrumb" style="margin-top:15px">
        <a-breadcrumb>
          <a-breadcrumb-item v-for="item in orgList" :key="item.orgCode"><a @click="changeOrg(item)">{{item.orgName}}</a></a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>

    <!-- 体检受限统计列表（省市区） -->
    <div v-if="presentType != '4' || presentType != 4" class="provinces list">
      <a-table
        :columns="columns" 
        :data-source="dataList"
        :rowKey="row => row.id"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: tableHeight }"
        size="middle"
      >
        <span slot="operation" slot-scope="text, record">
          <a-button @click="details(record)">详情</a-button>
        </span>
      </a-table>
      <!-- 体检受限统计列表（省市区）合计 -->
      <div class="listFooter" style="display:flex;background-color:#FAFAFA;height:46px;line-height:46px;align-items:center;border:1px solid #e8e8e8;border-top:0;padding-right:5px;">
        <div class="text"  style="width:10%;text-align:center;">总计</div>
        <div class="physicalSum" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'physicalSum')}}</div>
        <div class="limitationSum" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'limitationSum')}}</div>
        <div class="normalSum" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'normalSum')}}</div>
        <div class="schoolClass" style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'schoolClass')}}</div>
        <div class="schoolPerson" style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'schoolPerson')}}</div>
        <div class="majorClass" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'majorClass')}}</div>
        <div class="majorPerson" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'majorPerson')}}</div>
        <div class="unsuitableClass" style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'unsuitableClass')}}</div>
        <div class="unsuitablePerson" style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'unsuitablePerson')}}</div>
      </div>
    </div>
    
    <!-- 体检受限统计列表（学校） -->
    <div v-if="presentType == '4' || presentType == 4" class="school list">
      <a-table
        :columns="columns2" 
        :data-source="dataList"
        :rowKey="row => row.id"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: tableHeight2 }"
        size="middle"
      >
      </a-table>
    </div>

    <template v-if="isMounted && (presentType == '4' || presentType == 4)">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>
  </div>
</template>
 
<script>
import { getArrayObjAdd, downloadFile } from "@/utils/util.js"
/**
   * 获取这个节点的父级及祖先节点
   * node：节点对象 
   * tree：树形数组
   * 例：树形结构（全国的树形结构，知道成都市的对象，返回全国，四川省的对象数组）
   **/
function findAllParent(node, tree, parentNodes = [], index = 0) {
  if (!node || node.parentCode === 0) {
      return
  }
  findParent(node, parentNodes, tree)
  let parentNode = parentNodes[index]
  findAllParent(parentNode, tree, parentNodes, ++index)
  return parentNodes
}
function findParent(node, parentNodes, tree) {
  for (let i = 0; i < tree.length; i++) {
      let item = tree[i]
      if (item.orgCode === node.parentCode) {
          parentNodes.push(item)
          return
      }
      if (item.children && item.children.length > 0) {
          findParent(node, parentNodes, item.children)
      }
  }
}

// 查询列表结构（省市区）
const columns = [
  {
    title: "机构名称",
    dataIndex: "orgName",
    width: "10%",
    key: "orgName"
  },
  {
    title: "体检考生总数（人）",
    dataIndex: "physicalSum",
    width: "10%",
    align: "center",
    key: "physicalSum"
  },
  {
    title: "受限考生总数（人）",
    dataIndex: "limitationSum",
    width: "10%",
    align: "center",
    key: "limitationSum"
  },
  {
    title: "体检正常考生数（人）",
    dataIndex: "normalSum",
    width: "10%",
    align: "center",
    key: "normalSum"
  },
  {
    title: "学校可以不予录取（人）",
    children: [
      {
        title: '按类统计',
        dataIndex: 'schoolClass',
        width: "8%",
        align: "center",
        key: 'schoolClass'
      },
      {
        title: '按人统计',
        dataIndex: 'schoolPerson',
        width: "8%",
        align: "center",
        key: 'schoolPerson'
      }
    ]
  },
  {
    title: "有关专业可以不予录取（人）",
    children: [
      {
        title: '按类统计',
        dataIndex: 'majorClass',
        width: "10%",
        align: "center",
        key: 'majorClass'
      },
      {
        title: '按人统计',
        dataIndex: 'majorPerson',
        width: "10%",
        align: "center",
        key: 'majorPerson'
      }
    ]
  },
  {
    title: "不宜就读专业（人）",
    children: [
      {
        title: '按类统计',
        dataIndex: 'unsuitableClass',
        width: "8%",
        align: "center",
        key: 'unsuitableClass'
      },
      {
        title: '按人统计',
        dataIndex: 'unsuitablePerson',
        width: "8%",
        align: "center",
        key: 'unsuitablePerson'
      }
    ]
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "8%",
    key: "operation",
    align: "center",
    scopedSlots: { customRender: "operation" }
  }
];
// 查询列表结构（学校）
const columns2 = [
  {
    title: "考生号",
    dataIndex: "examNum",
    width: "14%",
    key: "examNum"
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    width: "12%",
    align: "center",
    key: "examName"
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: "10%",
    align: "center",
    key: "sex",
    scopedSlots: { customRender: "sex" }
  },
  {
    title: "身份证号",
    dataIndex: "IDNum",
    width: "16%",
    key: "IDNum"
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    width: "22%",
    key: "assignsName"
  },
  {
    title: "班级代码",
    dataIndex: "classNum",
    width: "16%",
    key: "classNum"
  },
  {
    title: "受限代码",
    dataIndex: "limitationNum",
    width: "10%",
    key: "limitationNum"
  }
]
export default {
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      tableHeight: 0, //table高度
      tableHeight2: 0, //table高度

      treeData: [], // 机构树数据
      replaceFields: {
        children: 'children', 
        title: 'orgName', 
        key: 'orgCode', 
        value: 'orgCode',
        type: 'orgType',
      }, //替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段

      columns, // 查询列表结构（省市区）
      columns2, // 查询列表结构（学校）
      dataList: [], // 查询列表数据
      tableLoading: false,

      search: {
        orgCode: null, //机构id
        orgType: null,
        current: 1, //当前页
        pageSize: 20, //每页条数
      },
      stripTotal: null, //查询列表总条数

      presentOrg: {
        orgCode: '',
        orgName: '',
        orgType: ''
      }, //当前机构
      presentType: '', //当前机构层级
      temporaryType: '', // 暂存
      orgList: [],
      temporaryOrgList: [] // 暂存
    }
  },
  mounted() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.search.orgCode = userInfo.orgCode
    this.search.orgType = userInfo.orgTypeId
    this.treeData = JSON.parse(sessionStorage.getItem('treeData'))

    this.presentOrg.orgCode = userInfo.orgCode
    this.presentOrg.orgName = userInfo.orgName
    this.presentOrg.orgType = userInfo.orgTypeId
    this.orgList.push(this.presentOrg)
    this.temporaryOrgList.push(this.presentOrg)
    
    this.presentType = userInfo.orgTypeId 
    this.getList()

    this.$nextTick(() => {
      if (String(this.presentType) !== '4') {
        this.getTableHeight();
      } else if (String(this.presentType) === '4') {
        this.getTableHeight2();
      }
    })
  },
  methods: {
    getArrayObjAdd,
    findAllParent,
    findParent,

    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 93 - 47 - 4;
    },
    // 获取表格高度
    getTableHeight2() {
      let tableHeight2 = window.document.querySelector(".list")
      this.tableHeight2 = tableHeight2.clientHeight - 47 - 21 - 20;
    },

    // 点击面包屑导航
    changeOrg(item) {
      console.log(item)
      this.search.orgCode = item.orgCode
      this.search.orgType = item.orgType
      this.presentType = item.orgType

      this.getList()

      let arr = []
      let arrr = this.findAllParent(item, this.treeData, arr).reverse()
      console.log(arrr)
      arrr.push(item)
      this.orgList = arrr

      this.$nextTick(() => {
        if (String(this.presentType) !== '4') {
          this.getTableHeight();
        } else if (String(this.presentType) === '4') {
          this.getTableHeight2();
        }
      })
    },

    // 机构树选择
    onSelect(selectedKeys, e) {
      console.log('onSelect', selectedKeys, e);
      this.search.orgCode = selectedKeys
      this.search.orgType = e.$vnode.data.props.orgType
      // this.presentType = e.$vnode.data.props.orgType
      this.temporaryType = e.$vnode.data.props.orgType

      let org = {
        orgCode: e.$vnode.data.props.orgCode,
        orgName: e.$vnode.data.props.orgName,
        orgType: e.$vnode.data.props.orgType,
        parentCode: e.$vnode.data.props.parentCode
      }
      let arr = []
      let arrr = this.findAllParent(org, this.treeData, arr).reverse()
      arrr.push(org)
      // this.orgList = arrr
      this.temporaryOrgList = arrr

      this.$nextTick(() => {
        if (String(this.presentType) !== '4') {
          this.getTableHeight();
        } else if (String(this.presentType) === '4') {
          this.getTableHeight2();
        }
      })
    },

    // 详情
    details(record) {
      console.log(record)
      this.presentType = record.orgType
      this.temporaryType = record.orgType
      let org = {
        orgCode: record.orgCode,
        orgName: record.orgName.split("]")[1],
        orgType: record.orgType,
        parentCode: record.parentCode
      }
      this.orgList.push(org)

      this.search.orgCode = record.orgCode
      this.search.orgType = record.orgType
      this.presentType = record.orgType
      console.log(this.presentType)
      this.getList()

      this.$nextTick(() => {
        if (String(this.presentType) !== '4') {
          this.getTableHeight();
        } else if (String(this.presentType) === '4') {
          this.getTableHeight2();
        }
      })
    },

    // 查询列表内容
    async searchList() {
      this.presentType = this.temporaryType 
      this.orgList = this.temporaryOrgList
      if (String(this.presentType) !== '4') {
        await this.getList()
      } else if (String(this.presentType) === '4') {
        await this.getList()
        this.$refs.page.pagination.current = 1
        this.search.current = 1;
        this.$refs.page.returnPageTotal()
      }
    },
    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.PhyExamQueryStat.physicalLimitationList({
          ...this.search
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list

          if (String(this.presentType) === '4') {
            console.log(res.data.pagination.total)
            this.stripTotal = res.data.pagination.total
            this.isMounted = false
            this.$nextTick(() => {
              this.isMounted = true
            })
          }
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 导出
    async allExport() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        const res = await this.$api.PhyExamQueryStat.allExport({
          ...this.search,
          excelType: '10'
        });
        downloadFile(res)
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    }
  },
  watch: {
  }
}
</script>
 
<style lang = "less">
 #physicalLimitationStatistics{
    height: 100%;
    display: flex;
    flex-direction: column; 

   /* .topExport{
     display: flex;
     .right{
       margin-left: 30px;
       .ant-breadcrumb{
         line-height: 32px;
       }
     }
   } */

   .list{
     flex-grow: 1;
     overflow-y: auto;
   }
 }
</style>