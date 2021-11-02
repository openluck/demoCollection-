<template>
<!-- 体检情况统计  -->
  <div id="physicalConditionStatistics">

    <div class="top" style="margin-bottom: 20px">
      <div class="topSearch">
        <div>
          <span class="name">机构：</span>
          <a-tree-select
            v-model="search.orgCode"
            style="width: 180px;margin-right:20px"
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
          <span class="name">体检日期：</span>
          <a-date-picker
            style="width:120px;margin-right:15px"
            v-model="search.physicalDate"
            :showToday="false"
            placeholder="请选择"
          >
          <template slot="dateRender" slot-scope="current, today">
              <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </div>

        <a-button type="primary" @click="searchList" style="margin-right:15px;">查询</a-button>

        <a-button type="primary" @click="allExport">
          <svg-icon icon-class="daochu" :scale="0.8" style="margin-right:5px;" />
          导出Excel
        </a-button>
      </div>
      <!-- <div class="topExport" style="margin-top:15px">
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

    <!-- 体检情况统计列表 -->
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
        <span slot="operation" slot-scope="text,record">
          <a-button @click="details(record)">详情</a-button>
        </span>
      </a-table>
      <!-- 体检情况统计列表合计 -->
      <div v-if="String(presentType) === '3'" class="listFooter" style="display:flex;background-color:#FAFAFA;height:46px;align-items: center;border:1px solid #e8e8e8;border-top:0;padding-right:5px;">
        <div class="text"  style="width:23%;text-align:center;">总计</div>
        <div class="joinNum" style="width:10.5%;text-align:center;">{{getArrayObjAdd(dataList,'joinNum')}}</div>
        <div class="confirmNum" style="width:13.5%;text-align:center;">{{getArrayObjAdd(dataList,'confirmNum')}}</div>
        <div class="ophthalmology" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'ophthalmology')}}</div>
        <div class="medicine" style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'medicine')}}</div>
        <div class="surgery" style="width:7.5%;text-align:center;">{{getArrayObjAdd(dataList,'surgery')}}</div>
        <div class="stomatology" style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'stomatology')}}</div>
        <div class="ent" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'ent')}}</div>
        <div class="xray" style="width:8%;text-align:center;">{{getArrayObjAdd(dataList,'xray')}}</div>
        <div class="liver" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'liver')}}</div>
      </div>
      <div v-else class="listFooter" style="display:flex;background-color:#FAFAFA;height:46px;align-items:center;border:1px solid #e8e8e8;border-top:0;padding-right:5px;">
        <div class="text"  style="width:21%;text-align:center;">总计</div>
        <div class="joinNum" style="width:10%;text-align:center;">{{getArrayObjAdd(dataList,'joinNum')}}</div>
        <div class="confirmNum" style="width:12%;text-align:center;">{{getArrayObjAdd(dataList,'confirmNum')}}</div>
        <div class="ophthalmology" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'ophthalmology')}}</div>
        <div class="medicine" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'medicine')}}</div>
        <div class="surgery" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'surgery')}}</div>
        <div class="stomatology" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'stomatology')}}</div>
        <div class="ent" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'ent')}}</div>
        <div class="xray" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'xray')}}</div>
        <div class="liver" style="width:7%;text-align:center;">{{getArrayObjAdd(dataList,'liver')}}</div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { getArrayObjAdd, timestampToTime, downloadFile } from "@/utils/util.js"
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
    title: "体检日期",
    dataIndex: "physicalDate",
    width: "9%",
    align: "center",
    key: "physicalDate"
  },
  {
    title: "当日参加体检人数",
    dataIndex: "joinNum",
    width: "10%",
    align: "center",
    key: "joinNum"
  },
  {
    title: "当日常规五项已完成人数",
    dataIndex: "confirmNum",
    width: "12%",
    align: "center",
    key: "confirmNum"
  },
  {
    title: "各科室完成体检人数",
    children: [
      {
        title: '眼科',
        dataIndex: 'ophthalmology',
        width: "7%",
        align: "center",
        key: 'ophthalmology'
      },
      {
        title: '内科',
        dataIndex: 'medicine',
        width: "7%",
        align: "center",
        key: 'medicine'
      },
      {
        title: '外科',
        dataIndex: 'surgery',
        width: "7%",
        align: "center",
        key: 'surgery'
      },
      {
        title: '口腔',
        dataIndex: 'stomatology',
        width: "7%",
        align: "center",
        key: 'stomatology'
      },
      {
        title: '耳鼻喉',
        dataIndex: 'ent',
        width: "7%",
        align: "center",
        key: 'ent'
      },
      {
        title: '胸透',
        dataIndex: 'xray',
        width: "7%",
        align: "center",
        key: 'xray'
      },
      {
        title: '肝功',
        dataIndex: 'liver',
        width: "7%",
        align: "center",
        key: 'liver'
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

      physicalDateList: [], // 有效体检日期

      columns, // 查询列表结构
      dataList: [], // 查询列表数据
      tableLoading: false,

      search: {
        orgCode: null, //机构id
        orgType: null,
        physicalDate: '' //体检日期
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
    this.getAmendDate()

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

    // 可选日期样式
    getCurrentStyle(current, today) {
      const style = {};
      if (this.physicalDateList.includes(current.format("YYYY-MM-DD "))) {
        style.border = '1px solid #1890ff';
        style.borderRadius = "50%";
      }
      return style;
    },
    // 获取体检日期
    async getAmendDate() {
      try {
        const res = await this.$api.init.getAmendDate({
          orgCode: this.search.orgCode
        });
        if (res.code === "200" || res.code === 200) {
          let Datelist = res.data.Datelist
          //体检日期转换
          this.physicalDateList = Datelist.map(item => timestampToTime(item, 1));
          console.log(this.physicalDateList)
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 点击面包屑导航
    changeOrg(item) {
      console.log(item)
      this.search.orgCode = item.orgCode
      this.search.orgType = item.orgType
      this.presentType = item.orgCode
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

      this.getAmendDate()
      
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

    // 详情下钻
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
      console.log(this.orgList)
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
      this.getAmendDate()

      this.presentType = this.temporaryType 
      console.log(this.presentType)
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
        console.log(222222)
      } 
      console.log(this.temporaryOrgList)
      this.orgList = this.temporaryOrgList
    },
    // 获取列表
    async getList() {
      this.tableLoading = true;
      let { physicalDate } = this.search
      physicalDate = physicalDate ? physicalDate.format("YYYY-MM-DD") : ""
      try {
        const res = await this.$api.PhyExamQueryStat.physicalConditionList({
          ...this.search,
          physicalDate
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
      let { physicalDate } = this.search
      physicalDate = physicalDate ? physicalDate.format("YYYY-MM-DD") : ""
      try {
        const res = await this.$api.PhyExamQueryStat.allExport({
          ...this.search,
          physicalDate,
          excelType: '8'
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
 #physicalConditionStatistics{
    height: 100%;
    display: flex;
    flex-direction: column;

   .topSearch{
     display: flex;
   }
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