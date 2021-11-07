<template>
<!-- 体检进度统计  -->
  <div id="physicalProgressStatistics">

    <div class="top" style="margin-bottom: 20px">
      <div class="topSearch">
        <span class="name">机构：</span>
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

    <!-- 体检进度统计列表 -->
    <div class="list">
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
      <!-- 体检进度统计列表合计 -->
      <div v-if="String(presentType) === '3'" class="listFooter" style="display:flex;background-color:#FAFAFA;height:46px;align-items:center;border:1px solid #e8e8e8;border-top:0;padding-right:5px;">
        <div class="text"  style="width:13%;text-align:center;">总计</div>
        <div class="physicalSum" style="width:11%;text-align:center;">{{getArrayObjAdd(dataList,'physicalSum')}}</div>
        <div class="noDetected" style="width:11%;text-align:center;">{{getArrayObjAdd(dataList,'noDetected')}}</div>
        <div class="detected" style="width:10.5%;text-align:center;">{{getArrayObjAdd(dataList,'detected')}}</div>
        <div class="undetected" style="width:11.5%;text-align:center;">{{getArrayObjAdd(dataList,'undetected')}}</div>
        <div class="lossDetected" style="width:10.5%;text-align:center;">{{getArrayObjAdd(dataList,'lossDetected')}}</div>
        <div class="missDetected" style="width:11%;text-align:center;">{{getArrayObjAdd(dataList,'missDetected')}}</div>
        <div class="collected" style="width:11%;text-align:center;">{{getArrayObjAdd(dataList,'collected')}}</div>
        <div class="perorate" style="width:11%;text-align:center;">{{getArrayObjAdd(dataList,'perorate')}}</div>
      </div>
      <div v-else class="listFooter" style="display:flex;background-color:#FAFAFA;height:46px;align-items:center;border:1px solid #e8e8e8;border-top:0;padding-right:5px;">
        <div class="text"  style="width:12%;text-align:center;">总计</div>
        <div class="physicalSum" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'physicalSum')}}</div>
        <div class="noDetected" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'noDetected')}}</div>
        <div class="detected" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'detected')}}</div>
        <div class="undetected" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'undetected')}}</div>
        <div class="lossDetected" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'lossDetected')}}</div>
        <div class="missDetected" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'missDetected')}}</div>
        <div class="collected" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'collected')}}</div>
        <div class="perorate" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'perorate')}}</div>
      </div>
    </div>
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

// 查询列表结构
const columns = [
  {
    title: "机构名称",
    dataIndex: "orgName",
    width: "12%",
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
    title: "不参检考生（人）",
    dataIndex: "noDetected",
    width: "10%",
    align: "center",
    key: "noDetected"
  },
  {
    title: "参检考生（人）",
    dataIndex: "detected",
    width: "10%",
    align: "center",
    key: "detected"
  },
  {
    title: "体检过程考生统计考生（人）",
    children: [
      {
        title: '未检',
        dataIndex: 'undetected',
        width: "10%",
        align: "center",
        key: 'undetected'
      },
      {
        title: '漏检',
        dataIndex: 'lossDetected',
        width: "10%",
        align: "center",
        key: 'lossDetected'
      },
      {
        title: '缺检',
        dataIndex: 'missDetected',
        width: "10%",
        align: "center",
        key: 'missDetected'
      },
      {
        title: '已收表',
        dataIndex: 'collected',
        width: "10%",
        align: "center",
        key: 'collected'
      },
      {
        title: '已下结论',
        dataIndex: 'perorate',
        width: "10%",
        align: "center",
        key: 'perorate'
      }
    ]
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "8%",
    align: "center",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  data() {
    return {
      tableHeight: 0, //table高度
      treeData: [], // 机构树数据
      replaceFields: {
        children: 'children', 
        title: 'orgName', 
        key: 'orgCode', 
        value: 'orgCode',
        type: 'orgType',
      }, //替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段

      columns, // 查询列表结构
      dataList: [], // 查询列表数据
      tableLoading: false,

      search: {
        orgCode: null, //机构id
        orgType: null
      },

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

    
    if (this.columns.length < 6) {
      this.columns.push(
        {
          title: "操作",
          dataIndex: "operation",
          width: "8%",
          align: "center",
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      )
    }
    if (this.presentType >= '3') {
      if (this.columns.length >= 6) {
        this.columns.pop()
      }
    }
    this.getList()

    this.$nextTick(() => {
      this.getTableHeight();
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

    // 点击面包屑导航
    changeOrg(item) {
      console.log(item, this.treeData)
      this.search.orgCode = item.orgCode
      this.search.orgType = item.orgType
      this.presentType = item.orgType
      if (this.columns.length < 6) {
        this.columns.push(
          {
            title: "操作",
            dataIndex: "operation",
            width: "8%",
            align: "center",
            key: "operation",
            scopedSlots: { customRender: "operation" }
          }
        )
      }
      this.getList()

      let arr = []
      let arrr = this.findAllParent(item, this.treeData, arr).reverse()
      console.log(arrr)
      arrr.push(item)
      this.orgList = arrr
    },
    // 机构树选择
    onSelect(selectedKeys, e) {
      console.log('onSelect', selectedKeys, e);
      this.search.orgCode = selectedKeys
      this.search.orgType = e.$vnode.data.props.orgType
      // this.presentType = e.$vnode.data.props.orgType
      this.temporaryType = e.$vnode.data.props.orgType
      
      /* if (this.columns.length < 6) {
        this.columns.push(
          {
            title: "操作",
            dataIndex: "operation",
            width: "8%",
            align: "center",
            key: "operation",
            scopedSlots: { customRender: "operation" }
          }
        )
      } */
      /* if (this.presentType >= '4') {
        this.columns.pop()
      } */

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
      this.getList()

      if (this.presentType >= '3') {
        if (this.columns.length >= 6) {
          this.columns.pop()
        }
      }
    },

    // 查询列表内容
    searchList() {
      console.log(1111)
      this.getList()

      this.presentType = this.temporaryType 
      if (this.columns.length < 6) {
        this.columns.push(
          {
            title: "操作",
            dataIndex: "operation",
            width: "8%",
            align: "center",
            key: "operation",
            scopedSlots: { customRender: "operation" }
          }
        )
      }
      if (this.presentType >= '3') {
        this.columns.pop()
      } 
      this.orgList = this.temporaryOrgList
    },
    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.PhyExamQueryStat.physicalProgressList({
          ...this.search
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list
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
          excelType: '9'
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
 #physicalProgressStatistics{
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