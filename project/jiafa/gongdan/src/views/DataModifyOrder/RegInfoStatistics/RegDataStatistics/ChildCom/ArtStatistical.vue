<template>
  <div class="apply-art-statistical">
    <section>
      <div class="wrap">
        <!-- 搜索区 -->
        <div class="search">
          <label for="treeSelect">机构：</label>
          <a-tree-select
            id="treeSelect"
            :tree-data="affiliationList"
            tree-data-simple-mode
            :replaceFields="{children: 'children', title: 'title', key: 'key', value: 'value'}"
            v-model="fetchData.affiliationCode"
            @change="affiliationChange"
            style="width: 200px"
            :dropdownStyle="{ 'max-height': '60vh' }"
            placeholder="请选择机构"
          />
          <a-button type="primary" @click="handleSearch" style="margin-left:20px;">
            <svg-icon icon-class="sousuo" :scale="0.8" style="margin-right: 5px" />搜索
          </a-button>
        </div>
        <a-button type="primary" @click="exportExcel('2')" style="margin-left:20px;">
          <a-icon type="export" />导出Excel
        </a-button>
      </div>

      <!-- 面包屑 -->
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
    </section>
    <section>
      <!-- 表格 -->
      <a-table
        class="type-table"
        :pagination="false"
        :columns="columns"
        :loading="tableLoading"
        :data-source="dataSource"
        :row-key="(record) => Math.random()*10"
        size="middle"
        bordered
        :scroll="{ y: tableHeight }"
      >
        <!-- 机构名称 防止过长影响布局 -->
        <span slot="orgName" slot-scope="text">
          <a-tooltip>
            <template v-if="text" slot="title">{{text}}</template>
            {{text || '--'}}
          </a-tooltip>
        </span>
        <!-- 班级 -->
        <span slot="class" slot-scope="text">{{text || '--'}}</span>
        <!-- 合计 -->
        <template slot="footer">
          <div class="footer-wrap">
            <span>合计</span>
            <span>{{total.artArts}}</span>
            <span>{{total.artScience}}</span>
            <span>{{total.artSubtotal}}</span>
            <span>{{total.spArts}}</span>
            <span>{{total.spScience}}</span>
            <span>{{total.spSubtotal}}</span>
            <span>{{total.listTotal}}</span>
          </div>
        </template>
      </a-table>
    </section>
  </div>
</template>
 
<script>
/**
 * @description 艺体考生统计报表
 * @date 2021-1-26 16:43:42
 */
import { downloadFile } from "@/Utils/util";
const columns = [
  {
    title: "机构代码",
    dataIndex: "orgCode",
    key: "orgCode",
    width: "10%",
    align: "left"
  },
  {
    title: "机构名称",
    dataIndex: "orgName",
    key: "orgName",
    width: "20%",
    align: "left",
    ellipsis: true,
    scopedSlots: { customRender: "orgName" }
  },
  {
    title: "艺术考生",
    children: [
      {
        title: "艺术（文）",
        dataIndex: "artArts",
        key: "artArts",
        width: "10%",
        align: "right"
      },
      {
        title: "艺术（理）",
        dataIndex: "artScience",
        key: "artScience",
        width: "10%",
        align: "right"
      },
      {
        title: "小计",
        dataIndex: "artSubtotal",
        key: "artSubtotal",
        width: "10%",
        align: "right"
      }
    ]
  },
  {
    title: "体育",
    children: [
      {
        title: "体育（文）",
        dataIndex: "spArts",
        key: "spArts",
        width: "10%",
        align: "right"
      },
      {
        title: "体育（理）",
        dataIndex: "spScience",
        key: "spScience",
        width: "10%",
        align: "right"
      },
      {
        title: "小计",
        dataIndex: "spSubtotal",
        key: "spSubtotal",
        width: "10%",
        align: "right"
      }
    ]
  },
  {
    title: "总计",
    dataIndex: "listTotal",
    key: "listTotal",
    width: "10%",
    align: "right"
  }
];
export default {
  name: "ApplyArtStatistical",
  components: {},
  data() {
    return {
      affiliationList: [], // 所属机构列表
      columns,
      dataSource: [],
      total: {
        artArts: "0",
        listTotal: "0",
        spSubtotal: "0",
        spScience: "0",
        spArts: "0",
        artSubtotal: "0",
        artScience: "0"
      },
      fetchData: {
        affiliationId: "", //所属机构Id
        affiliationCode: "", //所属机构代码
        affiliationName: "", //所属机构名称
        affiliationType: ""
      },
      addrList: [],
      tableLoading: false,
      curUserOrgName: "",
      tableHeight: null,
      screenHeight: null
    };
  },
  watch: {
    // 当通过机构树下钻到学校时，第一列改为机构名称，第二列改为班级
    // "fetchData.affiliationType"(val){

    // }
    // 监听屏幕高度
    screenHeight(val) {
      this.screenHeight = val;
      this.tableHeight = this.screenHeight - 436;
    }
  },
  mounted() {
    this.screenHeight = document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight;
        this.screenHeight = window.screenHeight;
      })();
    };
    // 取出当前机构
    this.curUserOrgName = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).orgName;
    this.getAffiliationTree();
  },
  methods: {
    //点击面包屑事件
    backTo(item) {
      this.fetchData.affiliationId = item.orgId;
      this.fetchData.affiliationCode = item.orgCode;
      this.fetchData.affiliationType = item.orgType;
      this.fetchData.affiliationName = item.orgName;
      this.affiliationChange(item.orgCode, item.orgName, item);

      this.getApplyArtStaList();
    },
    // 递归调用，将后端返回的机构列表转化为树
    dealBread(orgCode) {
      const dealData = this.affiliationList.find(
        item => item.orgCode === orgCode
      );
      this.addrList.push(dealData);

      const accountName = JSON.parse(sessionStorage.getItem("userInfo"))
        .accountName;
      if (dealData && dealData.orgCode !== accountName) {
        this.dealBread(dealData.parentCode);
      }
    },
    // 所属机构改变事件
    affiliationChange(val, label, extra) {
      if (val) {
        this.orgName = label;
        if (extra.triggerNode) {
          this.fetchData.affiliationId = extra.triggerNode.dataRef.orgId;
          this.fetchData.affiliationName = label;
          this.fetchData.affiliationCode = val;
          this.fetchData.affiliationType = extra.triggerNode.dataRef.orgType;
        } else {
          this.fetchData.affiliationId = extra.orgId;
          this.fetchData.affiliationName = label;
          this.fetchData.affiliationCode = val;
          this.fetchData.affiliationType = extra.orgType;
        }
        this.addrList = [];
        this.dealBread(val);
        this.addrList = this.addrList.reverse();
      } else {
        this.addrList = [];
      }
    },
    // 搜索
    handleSearch() {
      this.isType4();
      this.getApplyArtStaList();
    },
    // 机构类型是否为学校
    isType4() {
      // 当通过机构树下钻到学校时，第一列改为机构名称，第二列改为班级
      let val = this.fetchData.affiliationType;
      if (val === "4") {
        this.columns[0] = {
          title: "机构名称",
          dataIndex: "orgName",
          key: "orgName",
          width: "20%",
          align: "left",
          ellipsis: true,
          scopedSlots: { customRender: "orgName" }
        };
        this.columns[1] = {
          title: "班级",
          dataIndex: "class",
          key: "class",
          width: "10%",
          align: "left",
          scopedSlots: { customRender: "class" }
        };

        console.log(this.columns);
      } else {
        this.columns[0] = {
          title: "机构代码",
          dataIndex: "orgCode",
          key: "orgCode",
          width: "10%",
          align: "left"
        };
        this.columns[1] = {
          title: "机构名称",
          dataIndex: "orgName",
          key: "orgName",
          width: "20%",
          align: "left",
          ellipsis: true,
          scopedSlots: { customRender: "orgName" }
        };
      }
    },
    // 初始化机构code
    initCode() {
      let curOrg = this.affiliationList[0];
      this.fetchData.affiliationId = curOrg.orgId;
      this.fetchData.affiliationCode = curOrg.orgCode;
      this.fetchData.affiliationName = curOrg.orgName;
      this.fetchData.affiliationType = curOrg.orgType;
      // 初始化orgCode之后再调接口获取列表数据
      this.getApplyArtStaList();
    },
    // 导出Excel
    async exportExcel(type) {
      // 导出接口为复用。 以type区分。
      // type 1. 报考类型统计报表 2. 艺体考生统计报表 3.对口职教考生统计报表
      const data = { ...this.fetchData, type };
      try {
        const res = await this.$api.ApplyDataStatistical.exportStatisticalList(
          data
        );
        downloadFile(res);
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 获取所属机构树
    async getAffiliationTree() {
      const res = await this.$api.ApplyDataSearch.getAffiliationTree();
      let data = res.data.list;
      if (res.code === "200") {
        data.map(item => {
          item["id"] = item["orgCode"];
          item["pId"] = item["parentCode"];
          item["title"] = `[${item["orgCode"]}] ${item["orgName"]}`;
          item["value"] = item["orgCode"];
        });
        this.affiliationList = [...data];
        this.initCode();
      } else {
        this.$message.error(res.message);
      }
    },
    // 获取报考类型统计报表列表
    async getApplyArtStaList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.ApplyDataStatistical.getApplyArtStatistical(
          this.fetchData
        );
        if (res.code === "200") {
          if (Object.keys(res.data).length) {
            this.dataSource = res.data.list;
            // 避免total返回为空对象 {} 而导致界面不渲染
            const total = res.data.total;
            Object.keys(total).length ? (this.total = total) : "";
            this.isType4();
          }
        } else {
          // this.$message.error(res.message);
          this.dataSource = [];
        }
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.tableLoading = false;
      }
    }
  }
};
</script>
 
<style scoped lang="less">
.apply-art-statistical {
  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .bread {
    margin: 20px 0px;
  }
  .type-table {
    /*     /deep/ thead > tr > th {
      border-left: 1px solid #e6e8eb;
      border-top: 1px solid #e6e8eb;
      border-bottom: 1px solid #e6e8eb;
      &[key="artArts"],
      &[key="artScience"],
      &[key="artSubtotal"],
      &[key="spArts"],
      &[key="spScience"],
      &[key="spSubtotal"] {
        border-top: 0;
      }
      &[key="spSubtotal"] {
        border-right: 0 !important;
      }
      &:last-child {
        border-right: 1px solid #e6e8eb;
      }
    } */
    /deep/.ant-table-footer {
      padding: 0;
    }
    .footer-wrap {
      height: 48px;
      display: flex;
      & > span {
        display: inline-block;
        height: 100%;
        line-height: 48px;
        &:not(:first-child) {
          width: 11%;
          text-align: right;
          padding-right: 5px;
        }
        &:first-child {
          width: 23%;
          text-align: center;
        }
      }
    }
  }
}
</style>