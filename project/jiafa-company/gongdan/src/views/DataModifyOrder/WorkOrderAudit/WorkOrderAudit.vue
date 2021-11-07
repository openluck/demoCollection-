<template>
  <div class="work-order-audit">
    <!-- 搜索/审阅操作 -->
    <div class="work-order-audit-search">
      <label for="“approvalStatus">审批状态：</label>
      <a-select
        id="approvalStatus"
        placeholder="请选择"
        style="width: 200px"
        v-model="wkListFilter.approvalStatus"
      >
        <a-select-option
          :value="item.code"
          v-for="item in auditTypeList"
          :key="item.code"
        >{{item.value}}</a-select-option>
      </a-select>
      <label for="examineeNameInput" style="margin-left:10px">考生姓名：</label>
      <a-input
        id="examineeNameInput"
        placeholder="请输入考生姓名"
        v-model="wkListFilter.examineeName"
        style="width: 200px;margin-left:10px"
      ></a-input>
      <a-button type="primary" style="margin-left:20px" @click="getAuditOrderList">
        <svg-icon icon-class="sousuo" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>搜索
      </a-button>
      <a-button
        class="batch-review-btn"
        type="primary"
        style="margin-left:20px"
        @click="batchReview"
      >
        <svg-icon icon-class="piliang" class="icon_item" style="margin-right:4px;font-size:12px"></svg-icon>批量审阅
      </a-button>
    </div>
    <!-- 表格 -->
    <div class="work-order-audit-table">
      <a-table
        :columns="columns"
        :loading="workOrderLoading"
        :data-source="wkList"
        :row-key="record=>record.id"
        :pagination="false"
        :row-selection="rowSelection"
        size="middle"
        :scroll="{ y: scrollHeight }"
        :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
            }
          "
      >
        <span slot="examineeName" slot-scope="text">
          <a-tooltip>
            <template slot="title">{{text}}</template>
            {{text}}
          </a-tooltip>
        </span>
        <span
          style="text-decoration: underline"
          slot="currentAuditDatum"
          slot-scope="text"
          @click="showPDF(text.fileUrl)"
        >{{ text.fileName }}</span>
        <span
          style="text-decoration: underline"
          slot="auditPerson"
          slot-scope="text"
          @click="showSign(text.imgUrl)"
        >{{ text.name }}</span>
        <span slot="auditStatus" slot-scope="text,record" style="padding:4px 8px">
          <a-tag :color="colorSwitch(text,record)">{{auditStatusSwitch(text)||"--"}}</a-tag>
        </span>
        <span slot="operation" slot-scope="text,record">
          <a-button @click="getDetail(record)" size="small">{{record.selectable===true?'审阅':'查看'}}</a-button>
        </span>
      </a-table>
      <!-- 已选择几个工单 -->
      <div class="table-selected-text">已选择{{selectedCount}}个工单</div>

      <!-- 分页 -->
      <a-pagination
        v-model="pagination.current"
        :page-size-options="pagination.pageSizeOptions"
        :total="pagination.total"
        show-size-changer
        showQuickJumper
        :page-size="pagination.pageSize"
        @change="pageChange"
        @showSizeChange="onShowSizeChange"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
          <span v-if="props.value === '50'">全部</span>
        </template>
      </a-pagination>
    </div>
    <pdf :pageUrl="pdfUrl" ref="pdfCon" style="width: 100%; height: 100%;" />
    <sign :pageUrl="signUrl" ref="sign" style="width: 100%; height: 100%;" />
  </div>
</template>
 
<script>
import { baseUrl } from "../../../Utils/global";
import pdf from "@/components/common/readPDF";
import sign from "@/components/common/readSign";
import { mapState } from "vuex";
const columns = [
  {
    title: "工单号",
    dataIndex: "workorder",
    key: "workorder"
  },
  {
    title: "考生数",
    dataIndex: "examinee",
    key: "examinee",
    width: 60
  },
  {
    title: "考生姓名",
    dataIndex: "examineeName",
    key: "examineeName",
    width: 120,
    ellipsis: true,
    scopedSlots: { customRender: "examineeName" }
  },
  {
    title: "提交机构",
    dataIndex: "submitOrg",
    key: "submitOrg",
    ellipsis: true
  },
  {
    title: "提交时间",
    dataIndex: "submitTime",
    key: "submitTime",
    ellipsis: true
  },
  {
    title: "汇报材料",
    dataIndex: "currentAuditDatum",
    key: "currentAuditDatum",
    ellipsis: true,
    scopedSlots: { customRender: "currentAuditDatum" }
  },
  {
    title: "经办人",
    dataIndex: "auditPerson",
    key: "auditPerson",
    ellipsis: true,
    scopedSlots: { customRender: "auditPerson" }
  },
  {
    title: "审核时间",
    dataIndex: "auditTime",
    key: "auditTime",
    ellipsis: true
  },
  {
    title: "审核状态",
    dataIndex: "auditStatus",
    width: 170,
    key: "auditStatus",
    scopedSlots: { customRender: "auditStatus" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 100,
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  name: "workOrderAudit",
  components: { pdf, sign },
  data() {
    return {
      baseUrl,
      auditTypeList: [],
      wkList: [],
      wkListFilter: {
        approvalStatus: "",
        examineeName: "",
        current: 1,
        pageSize: 20
      },
      columns,
      workOrderLoading: false,
      scrollHeight: 0,
      screenHeight: 0,
      selectedWkIds: [],
      selectedIndex: [],
      selectedRowKeys: [],
      selectedCount: 0,
      pagination: {
        pageSizeOptions: ["10", "20", "30"],
        current: 1,
        pageSize: 20,
        total: 0
      },
      headers: {
        token: sessionStorage.getItem("sjgdxgxt_token"),
        exId: sessionStorage.getItem("exId")
      },
      pdfUrl: "",
      signUrl: "",
      fileUrl: "",
      fileName: "",
      hasConfirm: false
    };
  },
  computed: {
    ...mapState("codeTable", ["returnCode", "auditType"]),
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          let arr = [];
          this.selectedCount = selectedRowKeys.length;
          selectedRows.forEach(item => {
            arr.push(item.wkId);
          });
          this.selectedWkIds = [...arr];
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.selectable === false, // Column configuration not to be checked
            name: record.name
          }
        })
      };
    }
  },
  mounted() {
    this.auditTypeList = this.auditType;
    this.getAuditOrderList();
    this.tableResize();
  },
  watch: {
    screenHeight(val) {
      this.screenHeight = val;
      this.scrollHeight = this.screenHeight - 100;
    }
  },
  methods: {
    /**
     * 批量审阅
     */
    batchReview() {
      if (this.selectedCount > 0) {
        this.$router.push({
          path: "/DataModifyOrder/BatchReview",
          query: {
            workOrderList: this.selectedWkIds
          }
        });
      } else {
        this.$message.error("请选择工单");
      }
    },
    /**
     * 审核状态转换
     */
    auditStatusSwitch(text) {
      let value;
      this.auditTypeList.forEach(item => {
        if (item.code === text) value = item.value;
      });
      return value;
    },
    /**
     * 审核状态颜色转换
     */
    colorSwitch(text, record) {
      if (record.selectable) {
        return "grey";
      } else {
        if (text === "40") {
          return "green";
        } else {
          return "blue";
        }
      }
    },
    /**
     * 获取审核工单列表
     */
    async getAuditOrderList() {
      this.workOrderLoading = true;
      const result = await this.$api.workOrderAudit.getAuditOrderList(
        this.wkListFilter
      );
      if (result.code === "200") {
        this.wkList = result.data.list;
        this.pagination.total = result.data.pagination.total;
        this.workOrderLoading = false;
      }
    },
    /**
     * 表格滚动自适应
     */
    tableResize() {
      this.screenHeight = document.body.clientHeight;
      window.onresize = () => {
        return (() => {
          this.screenHeight = document.body.clientHeight;
        })();
      };
    },
    /**
     * 表格选择切换回调
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      let arr = [];
      this.selectedCount = selectedRowKeys.length;
      selectedRows.forEach(item => {
        arr.push(item.wkId);
      });
      this.selectedWkIds = [...arr];
    },
    /**
     *  PDF预览弹窗
     */
    showPDF(record) {
      this.pdfUrl = record;
      this.$refs.pdfCon.showModal();
    },
    /**
     *  审核签名预览弹窗
     */
    showSign(fileUrl) {
      this.signUrl = fileUrl;
      this.$refs.sign.showModal();
    },

    /**
     * 点击详情跳转
     */
    getDetail(record) {
      sessionStorage.setItem("workOrder", record.workorder);
      this.$router.push({
        path: "/DataModifyOrder/WorkOrderDetail",
        query: { wkId: record.wkId, selectable: record.selectable }
      });
    },
    /********************************** 分页器方法 ***************************/
    pageChange(page) {
      this.pagination.current = page;
      this.wkListFilter.current = page;
      this.getAuditOrderList();
    },
    onShowSizeChange(current, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.wkListFilter.current = 1;
      this.wkListFilter.pageSize = pageSize;
      this.getAuditOrderList();
    }
  }
};
</script>
 
<style scoped lang = "less">
.work-order-audit {
  padding: 10px 10px 0 20px;
  .work-order-audit-search {
    .batch-review-btn {
      float: right;
    }
  }
  .work-order-audit-table {
    margin-top: 20px;
    /* 表格隔行变色 */
    /deep/ .even-row {
      background-color: #f7f8fa;
    }
    /deep/ a {
      text-decoration: underline;
    }
    /deep/ thead > tr > th {
      border-left: 1px solid #e6e8eb;
      border-top: 1px solid #e6e8eb;
      border-bottom: 1px solid #e6e8eb;
      &:last-child {
        border-right: 1px solid #e6e8eb;
      }
    }
    /deep/ .ant-table-pagination {
      text-align: left;
      .ant-pagination-total-text {
        margin-right: 15px;
      }
    }
  }
  .table-selected-text {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: darkgray;
  }
  .work-order-audit-upload {
    margin: 20px 0;
    .upload-control {
      display: inline-block;
      width: 480px;
    }
  }
}

/deep/.ant-upload-list-item-name {
  /* width: 300px; */
  /* overflow: hidden; */
  /* margin-right: 0px; */
  padding-right: 40px;
}
/deep/.ant-btn-sm {
  height: 24px;
  width: 80px;
  padding: 0 7px;
  font-size: 14px;
  border-radius: 4px;
}
</style>