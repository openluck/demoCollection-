<template>
  <!-- <a-spin tip="数据校验中..." :spinning="spin" wrapperClassName="spin-loading"> -->
  <div id="checkoutDataManage">
    <div class="top" style="margin-bottom: 15px">
      <div class="topSearch">
        <div class="query">
          <div>
            <span class="name">机构：</span>
            <a-select
              style="width: 180px; margin-right: 15px"
              placeholder="请选择"
              v-model="search.orgCode"
            >
              <a-select-option value=""> 全部 </a-select-option>
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
        <a-button
          type="primary"
          @click="resultCheck"
          style="margin-right: 15px"
        >
          <svg-icon
            icon-class="jiaoyan"
            :scale="0.8"
            style="margin-right: 5px"
          />
          {{ buttonName }}
        </a-button>
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

    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.ksh"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: tableHeight }"
        size="middle"
      >
        <!-- 校验结果 -->
        <span slot="jyjg" slot-scope="text">
          <p
            v-for="(item, index) in text.split(';')"
            :key="index"
            style="margin-bottom: 2px"
          >
            {{ item }}
          </p>
          <!-- <a-tooltip placement="topLeft">
              <template slot="title">
                {{ text }}
              </template>
              <span type="primary">{{ text }}</span>
            </a-tooltip> -->
        </span>
        <span slot="checkTime" slot-scope="text">
          {{ text.split(".")[0] }}
        </span>
        <!-- 编辑 -->
        <span slot="operation" slot-scope="text, record">
          <a-button @click="edit(record)"> 编辑 </a-button>
        </span>
      </a-table>
    </div>

    <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>

    <div v-if="spin" class="example">
      <a-spin
        tip="正在校验，由于数据量大，校验可能需要3-15分钟，请耐心等待..."
        :spinning="spin"
      />
    </div>
  </div>
  <!-- </a-spin> -->
</template>
 
<script>
import { downloadFile } from "@/utils/util.js";
const columns = [
  {
    title: "考生号",
    dataIndex: "ksh",
    width: 120,
    key: "ksh"
  },
  {
    title: "考生姓名",
    dataIndex: "xm",
    width: "6%",
    align: "center",
    key: "xm"
  },
  {
    title: "性别",
    dataIndex: "xb",
    width: "6%",
    align: "center",
    key: "xb"
  },
  {
    title: "身份证号",
    dataIndex: "sfzh",
    width: 130,
    key: "sfzh"
  },
  {
    title: "报名点名称",
    dataIndex: "bmdmc",
    width: "14%",
    key: "bmdmc"
  },
  {
    title: "校验结果",
    dataIndex: "jyjg",
    width: "20%",
    key: "jyjg",
    scopedSlots: { customRender: "jyjg" }
  },
  {
    title: "最后校验时间",
    dataIndex: "checkTime",
    width: "12%",
    key: "checkTime",
    scopedSlots: { customRender: "checkTime" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "6%",
    align: "center",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  name: "",
  components: {},
  data() {
    return {
      buttonName: "体检结果校验",
      isMounted: false, //第一次不渲染Page组件
      tableHeight: 0, //table高度

      columns, // 查询列表结构
      tableLoading: false,
      // 查询列表数据
      dataList: [],
      orgList: [], // 机构列表

      search: {
        orgCode: '', //机构id
        keyword: "", //输入框内容
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "1" //查询或搜索
      },
      spin: false,
      stripTotal: null,
    };
  },
  computed: {},
  created() {
    this.orgList = JSON.parse(localStorage.getItem("hospitalOrgList"));
    this.getList()

    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  mounted() {

  },
  methods: {

    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 47 - 21 - 20;
    },
    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.CheckoutDataManage.getList({
          ...this.search
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.stripTotal = res.data.pagination.total
          console.log(123, this.stripTotal);
          this.dataList = res.data.list
          // this.$refs.page.returnPageTotal()
          this.isMounted = true
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },
    // 搜索
    async searchList(type) {
      console.log(type)
      this.search.type = type
      this.$refs.page.pagination.current = 1
      this.search.current = 1;

      if (type === "1") {
        this.search.keyword = ""
      } else if (type === "2") {
        this.search.orgCode = ""
      }

      await this.getList()
      this.$refs.page.returnPageTotal()
    },
    // 编辑
    edit(record) {
      console.log(record)
      window.open(`${record.url}`, "_blank", `toolbar=yes, width=${window.screen.width}, height=${window.screen.height}`);
    },
    // 结果校验
    async resultCheck() {
      this.spin = true
      this.buttonName = "数据校验中..."
      try {
        const res = await this.$api.CheckoutDataManage.check({
          orgCode: this.search.orgCode
        });
        if (res.code === "200" || res.code === 200) {
          this.$message.success(`校验完成，计划校验人数${res.data.planCheckCount}，实际校验人数${res.data.factCheckCount}，校验通过人数${res.data.successCount}，校验未通过人数${res.data.failCount}`, [5]);
        } else {
          this.$message.error('校验失败');
        }
        this.buttonName = "体检结果校验"
      } catch (error) {
        this.$message.error("系统异常，请稍后再试！");
        this.buttonName = "体检结果校验"
      } finally {
        this.spin = false;
        this.buttonName = "体检结果校验"
      }
    },
    // 导出
    async allExport() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        const res = await this.$api.CheckoutDataManage.exportExcel({
          orgCode: this.search.orgCode,
          keyword: this.search.keyword,
          type: this.search.type,
        });
        downloadFile(res)
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    }
  },
};
</script>
 
<style lang = "less">
#checkoutDataManage {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
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
.spin-loading {
  height: 100%;
  .ant-spin-container {
    height: 100%;
  }
}
.example {
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  padding-top: 200px;
  /* margin-top: 200px; */
  background: rgba(256, 256, 256, 0.25);
  /* border-radius: 4px; */
  /* margin-bottom: 20px; */
  /* padding: 30px 50px; */
  /* margin: 20px 0; */
}
</style>