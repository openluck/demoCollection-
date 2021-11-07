<template>
  <div class="DK-statistical">
    <section>
      <div class="wrap">
        <!-- 搜索区 -->
        <div class="search">
          <label for="treeSelect">机构：</label>
          <a-tree-select
            id="treeSelect"
            :tree-data="affiliationList"
            tree-data-simple-mode
            :replaceFields="{
              children: 'children',
              title: 'title',
              key: 'key',
              value: 'value',
            }"
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
        <a-button type="primary" @click="exportExcel('3')" style="margin-left:20px;">
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
        :row-key="(record) => record.id"
        size="middle"
        bordered
        :scroll="{x: 100, y:1200 }"
      ></a-table>
    </section>
  </div>
</template>

<script>
/**
 * @description 对口职教考生统计报表
 * @date 2021-1-26 16:43:42
 */
import { downloadFile } from "@/Utils/util";
export default {
  name: "ApplyDKStatistical",
  components: {},
  data() {
    const columns = [
      {
        title: "机构代码",
        dataIndex: "orgCode",
        width: 120,
        fixed: "left",
        key: "orgCode",
        align: "center",
        customRender: (text, row, index) => {
          if (this.dataSource.length - 2 > 0) {
            if (index < this.dataSource.length - 2) {
              return {
                children: <span>{text}</span>
              };
            }
          }
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: 2
            }
          };
        }
      },
      {
        title: "机构名称",
        dataIndex: "orgName",
        width: 320,
        fixed: "left",
        key: "orgName",
        align: "left",
        ellipsis: true,
        scopedSlots: { customRender: "orgName" },
        customRender: (text, row, index) => {
          if (this.dataSource.length - 2 > 0) {
            if (index < this.dataSource.length - 2) {
              return {
                children: (
                  <span>
                    <a-tooltip>
                      <template slot="title">{text}</template>
                      {text}
                    </a-tooltip>
                  </span>
                )
              };
            }
          }
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: 0
            }
          };
        }
      },
      {
        title: "农林牧鱼类",
        dataIndex: "nlmy",
        width: 120,
        key: "nlmy",
        align: "right",
        customRender: (text, row, index) => {
          if (this.dataSource.length - 1 > 0) {
            if (index < this.dataSource.length - 1) {
              return {
                children: <span>{text}</span>
              };
            }
          }
          return {
            children: <span>{text || "--"}</span>,
            attrs: {
              className:
                text.substr(0, 1) === "+"
                  ? "add"
                  : text.substr(0, 1) === "-"
                  ? "reduce"
                  : ""
            }
          };
        }
      },
      {
        title: "土木水利类",
        dataIndex: "tmsl",
        width: 120,
        key: "tmsl",
        align: "right",
        customRender: (text, row, index) => {
          if (this.dataSource.length - 1 > 0) {
            if (index < this.dataSource.length - 1) {
              return {
                children: <span>{text}</span>
              };
            }
          }

          return {
            children: <span>{text}</span>,
            attrs: {
              className:
                text.substr(0, 1) === "+"
                  ? "add"
                  : text.substr(0, 1) === "-"
                  ? "reduce"
                  : ""
            }
          };
        }
      },
      {
        title: "财经商贸类",
        dataIndex: "cjsm",
        width: 120,
        key: "cjsm",
        align: "right"
      },
      {
        title: "信息技术一类",
        dataIndex: "xxjs1",
        width: 140,
        key: "xxjs1",
        align: "right"
      },
      {
        title: "信息技术二类",
        dataIndex: "xxjs2",
        width: 140,
        key: "xxjs2",
        align: "right"
      },
      {
        title: "加工制造类",
        dataIndex: "jgzz",
        width: 120,
        key: "jgzz",
        align: "right"
      },
      {
        title: "公共管理与服务类",
        dataIndex: "glyfw",
        width: 140,
        key: "glyfw",
        align: "right"
      },
      {
        title: "文化艺术类",
        dataIndex: "whys",
        width: 120,
        key: "whys",
        align: "right"
      },
      {
        title: "旅游服务一类",
        dataIndex: "lyfw1",
        width: 140,
        key: "lyfw1",
        align: "right"
      },
      {
        title: "旅游服务二类",
        dataIndex: "lyfw2",
        width: 140,
        key: "lyfw2",
        align: "right"
      },
      {
        title: "轻纺食品类",
        dataIndex: "qfsp",
        width: 120,
        key: "qfsp",
        align: "right"
      },
      {
        title: "医药卫生类",
        dataIndex: "yyws",
        width: 120,
        key: "yyws",
        align: "right"
      },
      {
        title: "材料类",
        dataIndex: "cl",
        width: 120,
        key: "cl",
        align: "right"
      },
      {
        title: "教育类",
        dataIndex: "jy",
        width: 120,
        key: "jy",
        align: "right"
      },
      {
        title: "汽车类",
        dataIndex: "qc",
        width: 120,
        key: "qc",
        align: "right"
      },
      {
        title: "总计",
        dataIndex: "listTotal",
        width: 120,
        key: "listTotal",
        align: "right",
        fixed: "right"
      }
    ];
    return {
      tableHeight: null,
      screenHeight: null,
      affiliationList: [], // 所属机构列表
      columns,
      dataSource: [],
      total: {
        nlmy: "0",
        xxjs1: "0",
        cjsm: "0",
        tmsl: "0",
        cl: "0",
        yyws: "0",
        qfsp: "0",
        lyfw2: "0",
        lyfw1: "0",
        xxjs2: "0",
        whys: "0",
        glyfw: "0",
        jgzz: "0",
        qc: "0",
        jy: "0",
        listTotal: "0"
      },
      addReduce: {
        nlmy: "0",
        xxjs1: "0",
        cjsm: "0",
        tmsl: "0",
        cl: "0",
        yyws: "0",
        qfsp: "0",
        lyfw2: "0",
        lyfw1: "0",
        xxjs2: "0",
        whys: "0",
        glyfw: "0",
        jgzz: "0",
        qc: "0",
        jy: "0"
      },
      fetchData: {
        affiliationId: "", //所属机构Id
        affiliationCode: "", //所属机构代码
        affiliationName: "", //所属机构名称
        affiliationType: ""
      },
      addrList: [],
      tableLoading: false,
      curUserOrgName: ""
    };
  },
  watch: {
    // 监听屏幕高度
    screenHeight(val) {
      this.screenHeight = val;
      console.log(val);
      this.tableHeight = this.screenHeight - 400;
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

      this.getApplyDKStaList();
    },
    // 递归调用，将后端返回的机构列表转化为树
    dealBread(orgCode) {
      const dealData = this.affiliationList.find(
        item => item.orgCode === orgCode
      );
      this.addrList.push(dealData);

      const accountName = JSON.parse(sessionStorage.getItem("userInfo"))
        .accountName;
      if (dealData.orgCode !== accountName) {
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
      this.getApplyDKStaList();
    },
    isType4() {
      // 当通过机构树下钻到学校时，第一列改为机构名称，第二列改为班级
      let val = this.fetchData.affiliationType;
      if (val === "4") {
        this.total["orgName"] = "合计";
        this.addReduce["orgName"] = "增减";

        this.columns[0] = {
          title: "机构名称",
          dataIndex: "orgName",
          width: 320,
          fixed: "left",
          key: "orgName",
          align: "left",
          ellipsis: true,
          scopedSlots: { customRender: "orgName" },
          customRender: (text, row, index) => {
            if (this.dataSource.length - 2 > 0) {
              if (index < this.dataSource.length - 2) {
                return {
                  children: (
                    <span>
                      <a-tooltip>
                        <template slot="title">{text}</template>
                        {text}
                      </a-tooltip>
                    </span>
                  )
                };
              }
            }
            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: 2
              }
            };
          }
        };
        this.columns[1] = {
          title: "班级",
          dataIndex: "classdm",
          width: 120,
          fixed: "left",
          key: "classdm",
          align: "left",
          ellipsis: true,
          scopedSlots: { customRender: "classdm" },
          customRender: (text, row, index) => {
            if (this.dataSource.length - 2 > 0) {
              if (index < this.dataSource.length - 2) {
                return {
                  children: (
                    <span>
                      <a-tooltip>
                        <template slot="title">{text}</template>
                        {text || "--"}
                      </a-tooltip>
                    </span>
                  )
                };
              }
            }
            return {
              children: <span>{text || "--"}</span>,
              attrs: {
                colSpan: 0
              }
            };
          }
        };
      } else {
        this.total["orgCode"] = "合计";
        this.total["orgName"] = "--";
        this.addReduce["orgCode"] = "增减";
        this.addReduce["orgName"] = "--";

        this.columns[0] = {
          title: "机构代码",
          dataIndex: "orgCode",
          width: 120,
          fixed: "left",
          key: "orgCode",
          align: "center",
          customRender: (text, row, index) => {
            if (this.dataSource.length - 2 > 0) {
              if (index < this.dataSource.length - 2) {
                return {
                  children: <span>{text}</span>
                };
              }
            }

            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: 2
              }
            };
          }
        };
        this.columns[1] = {
          title: "机构名称",
          dataIndex: "orgName",
          width: 320,
          fixed: "left",
          key: "orgName",
          align: "left",
          ellipsis: true,
          scopedSlots: { customRender: "orgName" },
          customRender: (text, row, index) => {
            if (this.dataSource.length - 2 > 0) {
              if (index < this.dataSource.length - 2) {
                return {
                  children: (
                    <span>
                      <a-tooltip>
                        <template slot="title">{text}</template>
                        {text}
                      </a-tooltip>
                    </span>
                  )
                };
              }
            }
            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: 0
              }
            };
          }
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
      this.getApplyDKStaList();
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
    async getApplyDKStaList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.ApplyDataStatistical.getApplyDKStatistical(
          this.fetchData
        );
        if (res.code === "200") {
          // 没有数据时，接口返回的是 {} 空对象，做了判断，否则报错
          if (Object.keys(res.data).length) {
            this.dataSource = res.data.list;
            // this.dataSource[0].orgName = "四川省广元市剑阁县竹园镇哈哈哈中学高一年级"
            const total = res.data.total;
            const addReduce = res.data.addReduce;
            if (total) {
              Object.keys(total).length ? (this.total = total) : "";
            }
            if (addReduce) {
              Object.keys(addReduce).length ? (this.addReduce = addReduce) : "";
            }
            let val = this.fetchData.affiliationType;
            if (val === "4") {
              this.total["orgName"] = "合计";
              this.addReduce["orgName"] = "增减";
            } else {
              this.total["orgCode"] = "合计";
              this.total["orgName"] = "--";
              this.addReduce["orgCode"] = "增减";
              this.addReduce["orgName"] = "--";
            }
            this.isType4();
            const result = this.dataSource.map(item => item.orgCode === "合计");
            const result1 = this.dataSource.map(
              item => item.orgCode === "增减"
            );

            if (!result.includes(true) || !result1.includes(true)) {
              this.dataSource.push(this.total);
              this.dataSource.push(this.addReduce);
            }
          } else {
            this.dataSource = [];
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.tableLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ant-table-body {  //样式穿透
      overflow-x: auto !important;
}
.DK-statistical {
  overflow-y: auto;
  /* 滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 15px;
    background-color: #eff3f5;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: #eff3f5;
  }
  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 0px;
    // background-color: #25b6ff;
    background-color: #c1c1c1;
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    // background: #25b6ff;
    background: #a8a8a8;
  }
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
    /deep/.ant-table-footer {
      padding: 0;
    }

    /deep/ tbody > tr {
      &:last-child,
      &:nth-last-child(2) {
        background-color: #fafafa;
      }
    }
    /* /deep/ tbody > tr:last-child td[classname="add"]{
      color: green;
    }
    /deep/ tbody > tr:last-child td[classname="reduce"]{
      color: red;
    } */
  }
}
</style>
