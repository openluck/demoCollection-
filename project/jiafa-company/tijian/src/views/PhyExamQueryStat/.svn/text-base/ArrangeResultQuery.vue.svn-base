<template>
<!-- 编排结果查询  -->
  <div id="arrangeResultQuery">
    <div class="top" style="margin-bottom: 15px">
      <div class="topSearch">

        <div class="query">
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
            <span class="name">体检医院：</span>
            <a-select
              style="width: 120px;margin-right:20px" 
              placeholder="请选择"
              allowClear
              v-model="search.tjzdm"
            >
              <a-select-option value>
                全部
              </a-select-option>
              <a-select-option :title = item.hospitalName :value = item.hospitalCode v-for="item in medicalHospitalList" :key = item.hospitalCode>
                {{ item.hospitalName }}
              </a-select-option>
            </a-select>
          </div>

          <div>
            <span class="name">体检日期：</span>
            <a-date-picker
              style="width:120px;margin-right:20px"
              v-model="search.physicalDate"
              placeholder="请选择"
              :showToday="false"
            >
              <template slot="dateRender" slot-scope="current, today">
                <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                  {{ current.date() }}
                </div>
              </template>
            </a-date-picker>
          </div>

          <div>
            <span class="name">午别：</span>
            <a-select
              style="width: 120px;margin-right:15px" 
              placeholder="请选择"
              allowClear
              v-model="search.middayDistinction"
            >
              <a-select-option value>全部</a-select-option>
              <a-select-option value="AM">上午</a-select-option>
              <a-select-option value="PM">下午</a-select-option>
            </a-select>
          </div>
          <a-button type="primary" @click="searchList('1')">查询</a-button>
        </div>

        <div class="search">
          <a-input placeholder="考生号/姓名/身份证号" allowClear v-model="search.keyword" style="width: 180px;margin-right:15px" />
          <a-button type="primary" @click="searchList('2')">搜索</a-button>
        </div>
      </div>

      <div class="topExport" style="margin-top: 15px">
        <div class="left">
          <a-button type="primary" @click="allExport">
            <svg-icon icon-class="daochu" :scale="0.8" style="margin-right:5px;" />
            导出Excel
          </a-button>
        </div>
        <div class="right">
          <label>总参检考生数：<span>{{pandect.physicalSum}}人</span></label>
          <label>总分组数：<span>{{pandect.groupSum}}组</span></label>
          <label>男生参检人数：<span>{{pandect.physicalBoy}}人</span></label>
          <label>男生分组数：<span>{{pandect.groupBoy}}组</span></label>
          <label>女生参检人数：<span>{{pandect.physicalGirl}}人</span></label>
          <label>女生分组数：<span>{{pandect.groupGirl}}组</span></label>
        </div>
      </div>
    </div>

    <!-- 编排结果查询列表 -->
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
      </a-table>
    </div>

    <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>
  </div>
</template>
 
<script>
// 机构树
import { filterArray, timestampToTime, downloadFile } from "@/utils/util.js";

// 查询列表结构
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    width: 150,
    key: "examNum"
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    width: "8%",
    align: "center",
    key: "examName"
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: "6%",
    align: "center",
    key: "sex"
  },
  {
    title: "身份证号",
    dataIndex: "IDNum",
    width: 150,
    key: "IDNum"
  },
  {
    title: "区县名称",
    dataIndex: "countyName",
    width: "12%",
    key: "countyName"
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    width: "13%",
    key: "assignsName"
  },
  {
    title: "体检医院名称",
    dataIndex: "hospitalName",
    width: "13%",
    key: "hospitalName"
  },
  {
    title: "体检日期",
    dataIndex: "physicalDate",
    width: "8%",
    align: "center",
    key: "physicalDate"
  },
  {
    title: "午别",
    dataIndex: "middayDistinction",
    width: "6%",
    align: "center",
    key: "middayDistinction"
  },
  {
    title: "组号",
    dataIndex: "groupNum",
    width: "6%",
    align: "center",
    key: "groupNum"
  },
  {
    title: "组内序号",
    dataIndex: "intraclassNum",
    width: "8%",
    align: "center",
    key: "intraclassNum"
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
      physicalDateList: [], // 有效体检日期

      columns, // 查询列表结构
      dataList: [], // 查询列表数据
      tableLoading: false,
      pandect: {
        physicalSum: "", // 总参检考生人数
        groupSum: "", // 总分组数
        physicalBoy: "", // 男生参检数
        groupBoy: "", // 男生分组数
        physicalGirl: "", // 女生参检数
        groupGirl: "" // 女生分组数
      }, //数据总览
      stripTotal: null, //查询列表总条数

      search: {
        orgCode: null, //机构id
        tjzdm: '', //体检医院代码
        physicalDate: '', //体检日期
        middayDistinction: '', //午别
        keyword: "", //输入框内容
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "1" //查询或搜索
      }
    }
  },
  mounted() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.search.orgCode = userInfo.orgCode
    this.treeData = JSON.parse(sessionStorage.getItem('treeData'))

    this.getList()
    this.getMedicalHospital()
    this.getMedicalDate()

    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    filterArray,

    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 47 - 21 - 20 - 10;
    },

    // 机构树选择
    onSelect(selectedKeys, e) {
      console.log('onSelect', selectedKeys, e);
      this.search.orgCode = selectedKeys
      
      this.getMedicalHospital()
      this.getMedicalDate()
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
    async getMedicalDate() {
      try {
        const res = await this.$api.init.getMedicalDate({
          orgCode: this.search.orgCode
        });
        if (res.code === "200" || res.code === 200) {
          let Datelist = res.data.Datelist
          //体检日期转换
          this.physicalDateList = Datelist.map(item => timestampToTime(item, 1));
          console.log(this.physicalDateList)
        }
      } catch (error) {
        
      }
    },

    // 获取列表
    async getList() {
      this.tableLoading = true;
      let { physicalDate } = this.search
      physicalDate = physicalDate ? physicalDate.format("YYYY-MM-DD") : ""
      try {
        const res = await this.$api.PhyExamQueryStat.arrangeResultList({
          ...this.search, 
          physicalDate
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list
          this.pandect = res.data.pandect
          this.stripTotal = res.data.pagination.total
          this.isMounted = true
        }
      } catch (error) {
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
        this.search.physicalDate = ''
        this.search.middayDistinction = ''

        this.getMedicalHospital()
        this.getMedicalDate()
      }

      await this.getList()
      this.$refs.page.returnPageTotal()
    },

    // 导出
    async allExport() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        let { physicalDate } = this.search
        physicalDate = physicalDate ? physicalDate.format("YYYY-MM-DD") : ""
        const res = await this.$api.PhyExamQueryStat.allExport({
          ...this.search,
          physicalDate,
          excelType: '2'
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
 #arrangeResultQuery{
    height: 100%;
    display: flex;
    flex-direction: column;

   .top{
     .topSearch{
       display: flex;
       justify-content:space-between;
       .query{
         display: flex;
         width: 70%;
         flex-wrap: wrap;
       }
       .search{
          display: flex;
          flex-grow: 1;
          justify-content: flex-end;
       }
     }
     .topExport{
       display: flex;
       justify-content:space-between;
       .right{
         label{
           padding-left: 20px;
           span{
             font-weight: bold;
           }
         }
       }
     }
   }

   .list{
     flex-grow: 1;
     overflow-y: auto;
   }
 }
</style>