<template>
  <div class="work-order-audit">
    <div class="work-order-audit-title">
      <span v-if="this.fetchData.auditStatus === '2'" class="title">工单合计</span>
      <span v-if="this.fetchData.auditStatus === '1'" class="title">已审核工单</span>
      <span v-if="this.fetchData.auditStatus === '0'" class="title">待审核工单</span>
      <a-button @click="back">
        <svg-icon icon-class="返回" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>返回
      </a-button>
    </div>
    <a-divider />
    <div class="work-order-audit-search">
      <a-form layout="inline">
        <a-form-item label="提交日期">
          <a-date-picker
            dropdownClassName="filterNameAuthData"
            style="width:120px;"
            v-model="commitDate"
            :disabled-date="disabledStartDate"
            :showToday="false"
            :allowClear="true"
            format="YYYY-MM-DD"
            placeholder="提交日期"
          />
        </a-form-item>
        <a-form-item label="审核日期">
          <a-date-picker
            dropdownClassName="filterNameAuthData"
            style="width:120px;"
            v-model="auditDate"
            :disabled-date="disabledEndDate"
            :showToday="false"
            :allowClear="true"
            format="YYYY-MM-DD"
            placeholder="审核日期"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search('time')">
            <svg-icon icon-class="sousuo" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>查询
          </a-button>
        </a-form-item>
        <a-form-item label="工单号" style="margin-left:32px;">
          <a-input v-model="wkId" placeholder="请输入工单号"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search('wkId')">
            <svg-icon icon-class="sousuo" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>搜索
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 表格 -->
    <div class="work-order-audit-table">
      <a-table
        :columns="columns"
        :data-source="wkList"
        :loading="tableLoading"
        :row-key="(record) => record.id"
        :pagination="pagination"
        :rowClassName="
          (record, index) => {
            return index % 2 === 1 ? 'even-row' : ''
          }
        "
      >
        <span
          slot="currentAuditDatum"
          style="text-decoration: underline"
          slot-scope="text"
          @click="showPDF(text.fileUrl)"
        >
          <a-tooltip>
            <template slot="title">{{ text.fileName }}</template>
            {{ text.fileName }}
          </a-tooltip>
        </span>
        <span
          slot="auditPerson"
          style="text-decoration: underline"
          slot-scope="text"
          @click="showSign(text.imgUrl)"
        >
          <a-tooltip>
            <template slot="title">{{ text.name }}</template>
            {{ text.name }}
          </a-tooltip>
        </span>
        <!-- 审核状态 -->

        <span slot="auditStatus" slot-scope="text" style="padding:4px 8px">
          <a-tag :color="colorSwitch(text,record)">{{ changeCodeTable(text) || '--' }}</a-tag>
        </span>
        <span slot="operation" slot-scope="text, record">
          <a-button @click="getDetail(record)">查看</a-button>
        </span>
      </a-table>
    </div>
    <pdf :pageUrl="pageUrl" ref="pdf" />
    <sign :pageUrl="signUrl" ref="sign" />
  </div>
</template>

<script>
import moment from "moment";
import pdf from "@/components/common/readPDF";
import sign from "@/components/common/readSign";
import { mapState } from "vuex";
const columns = [
  {
    title: "工单号",
    dataIndex: "workorder",
    key: "workorder",
    align: "center"
  },
  {
    title: "考生数",
    dataIndex: "examinee",
    key: "examinee",
    width: 80,
    align: "right"
  },
  {
    title: "提交机构",
    dataIndex: "submitOrg",
    key: "submitOrg",
    ellipsis: true,
    align: "center"
  },
  {
    title: "提交时间",
    dataIndex: "submitTime",
    key: "submitTime",
    ellipsis: true,
    align: "center"
  },
  {
    title: "审核状态",
    dataIndex: "auditStatus",
    key: "auditStatus",
    align: "center",
    scopedSlots: { customRender: "auditStatus" }
  },
  {
    title: "汇报材料",
    dataIndex: "currentAuditDatum",
    key: "currentAuditDatum",
    ellipsis: true,
    align: "center",
    scopedSlots: { customRender: "currentAuditDatum" }
  },
  {
    title: "经办人",
    dataIndex: "auditPerson",
    key: "auditPerson",
    ellipsis: true,
    align: "center",
    scopedSlots: { customRender: "auditPerson" }
  },
  {
    title: "审核时间",
    dataIndex: "auditTime",
    key: "auditTime",
    align: "center",
    ellipsis: true
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  name: "",
  components: { pdf, sign },
  data() {
    return {
      wkList: [],
      auditTypeList: [], //审核状态列表
      columns,
      tableLoading: false,
      commitDate: "",
      auditDate: "",
      wkId: "",
      fetchData: {
        current: 1,
        pageSize: 20,
        auditStatus: "0", //工单审核状态 0,待审核 1,已审核
        commitDate: "",
        auditDate: "",
        wkId: "",
        commitOrgId: "" //提交机构Id
      },
      pagination: {
        current: 1,
        defaultPageSize: 20,
        showSizeChanger: false, // 显示可改变每页数量
        showQuickJumper: false, // 是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), // 点击页码事件
        total: 0, // 总条数
        size: "middle",
        pageSizeOptions: ["2", "5", "10", "20", "50"], // 每页数量选项
        buildOptionText: pageSizeOptions => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      }, // table的分页器
      pageParams: {},
      pageUrl: "", // pdf文件地址
      signUrl: ""
    };
  },
  computed: { ...mapState("codeTable", ["auditType"]) },
  created() {
    this.pageParams = Object.assign({}, this.$route.query);
    // this.fetchData.auditStatus =
    //   this.pageParams.type === 'auditedWorkOrder' ? '1' : '0'
    switch (this.pageParams.type) {
      case "toAuditWorkOrder":
        this.fetchData.auditStatus = "0";
        break;
      case "auditedWorkOrder":
        this.fetchData.auditStatus = "1";
        break;
      case "workOrderTotal":
        this.fetchData.auditStatus = "2";
        break;
    }
    this.fetchData.commitOrgId = this.pageParams.commitOrgId;
  },
  mounted() {
    // 初始化提交日期 and 审核日期
    // this.commitDate = moment().subtract('weeks', 1)
    this.commitDate = moment();
    this.auditDate = moment();
    // 获取码表-审核状态列表
    this.auditTypeList = [...this.auditType];
    // this.getCodeTable()
    this.getAuditOrderList();
  },
  methods: {
    // 查询---时间查询和工单号查询
    search(t) {
      if (t === "time") {
        this.fetchData.auditDate = this.auditDate
          ? moment(this.auditDate).format("YYYY-MM-DD")
          : "";
        this.fetchData.commitDate = this.commitDate
          ? moment(this.commitDate).format("YYYY-MM-DD")
          : "";
        this.fetchData.wkId = "";
        this.getAuditOrderList();
      } else if (t === "wkId") {
        this.fetchData.auditDate = "";
        this.fetchData.commitDate = "";
        this.fetchData.wkId = this.wkId;
        this.getAuditOrderList();
      }
    },
    // 返回上一页
    back() {
      window.history.go(-1);
    },
    // 预览PDF
    showPDF(text) {
      // 处理fileUrl,需要处理成完整路径:基础路径+路径
      this.pageUrl = text;
      this.$refs.pdf.showModal();
    },
    // 预览签名
    showSign(text) {
      this.signUrl = text;
      this.$refs.sign.showModal();
    },
    // 获取码表
    async getCodeTable() {
      try {
        const res = await this.$api.WorkOrderApply.getCodeTable({
          type: "shgdzt"
          // auditType: '2',
        });
        if (res.code === "200") {
          this.auditTypeList = res.data.list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    colorSwitch(status) {
      switch (status) {
        // case "40": //审核通过
        //   return "green";
        // case "10": //区县审核中
        //   return "blue";
        // case "11": //上级已退回，区县审核中
        //   return { color: "#4CC2EE" };
        // case "20": //地市审核中
        //   return { color: "#4CC2EE" };
        // case "21": //上级已退回，地市审核中
        //   return { color: "#4CC2EE" };
        // case "30": //省级审核中
        //   return { color: "#4CC2EE" };
        // case "00": //省级审核中
        //   return { color: "#FF6600" };
        // case "01": //省级审核中
        //   return { color: "#FF6600" };
        // default:
        //   return "normal";
        case "40": //审核通过
          return "green";
        case "10": //区县审核中
          return "blue";
        case "11": //上级已退回，区县审核中
          return "blue";
        case "20": //地市审核中
          return "blue";
        case "21": //上级已退回，地市审核中
          return "blue";
        case "30": //省级审核中
          return "blue";
        case "00": //省级审核中
          return { color: "#FF6600" };
        case "01": //省级审核中
          return { color: "#FF6600" };
        default:
          return "normal";
      }
    },
    // 根据审核状态判断显示颜色
    auditStatusToClassName(status) {
      switch (status) {
        case "40": //审核通过
          return { color: "#98FA1C" };
        case "10": //区县审核中
          return { color: "#4CC2EE" };
        case "11": //上级已退回，区县审核中
          return { color: "#4CC2EE" };
        case "20": //地市审核中
          return { color: "#4CC2EE" };
        case "21": //上级已退回，地市审核中
          return { color: "#4CC2EE" };
        case "30": //省级审核中
          return { color: "#4CC2EE" };
        case "00": //省级审核中
          return { color: "#FF6600" };
        case "01": //省级审核中
          return { color: "#FF6600" };
        default:
          return "normal";
      }
    },
    // 根据code转换码表
    changeCodeTable(code) {
      let value;
      for (let i = 0; i < this.auditTypeList.length; i++) {
        if (code === this.auditTypeList[i].code) {
          value = this.auditTypeList[i].value;
        }
      }
      return value;
    },
    auditStatusSwitch(text) {
      let value;
      this.auditTypeList.forEach(item => {
        if (item.code === text) value = item.value;
      });
      return value;
    },

    onChangeDate() {},
    // 详情
    getDetail(record) {
      // 传工单号    ---->WorkOrderDetail
      this.$router.push({
        path: "/DataModifyOrder/WorkOrderDetail",
        query: { wkId: record.wkId, selectable: false }
      });
    },
    //  获取审核工单列表
    async getAuditOrderList() {
      // this.fetchData.auditDate = moment(this.auditDate).format('YYYY-MM-DD')
      // this.fetchData.commitDate = moment(this.commitDate).format('YYYY-MM-DD')
      this.tableLoading = true;
      const res = await this.$api.ModifyStatistic.getAlterAuditOrderList(
        this.fetchData
      );
      if (res.code === "200") {
        this.wkList = res.data.list;
        this.tableLoading = false;
      } else {
        this.$message.error(res.message);
        this.tableLoading = false;
      }
    },
    // 禁选开始日期
    disabledStartDate(startValue) {
      const endValue = this.fetchData.endTime;
      if (!startValue || !endValue) {
        return startValue >= moment();
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    // 禁选结束日期
    disabledEndDate(endValue) {
      const startValue = this.fetchData.startTime;
      if (!endValue || !startValue) {
        return endValue >= moment();
      }
      return (
        startValue.valueOf() >= endValue.valueOf() ||
        endValue.valueOf() >= moment()
      );
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.current = 1;
    }
  }
};
</script>

<style scoped lang="less">
.work-order-audit {
  padding: 10px;
  .work-order-audit-title {
    height: 30px;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .work-order-audit-search {
  }
  .work-order-audit-table {
    margin-top: 20px;
    /deep/ .even-row {
      background-color: #f7f8fa;
    }
    /deep/ .ant-table-pagination {
      text-align: left;
    }
  }
  .table-selected-text {
    margin-top: 20px;
  }
  .work-order-audit-upload {
    margin: 20px 0;
    .upload-control {
      display: inline-block;
      width: 200px;
    }
  }
}
.tip-modal-title {
  width: 100%;
  text-align: left;
  font-size: 14px;
}
.tip-modal-content-list {
  display: inline-block;
  width: 100%;
  height: 16px;
  line-height: 16px;
  text-align: center;
}
.tip-modal-content-confirm {
  text-align: center;
  margin: 20px 0;
}
.tip-modal-footer {
  text-align: center;
  margin: 0 auto;
}
</style>
