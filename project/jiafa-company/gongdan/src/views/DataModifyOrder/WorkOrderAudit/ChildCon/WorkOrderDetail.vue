<template>
  <div class="wk-detail">
    <a-alert message="请先上传审核材料，再提交审核。未签字提交的上传材料，系统不会保存，页面刷新后需重新上传！" banner closable />
    <div class="wk-detail-header">
      <span class="current-wkId">工单：{{curWorkOrder}}</span>
      <span class="wk-detail-goback">
        <a-button class="wk-detail-goback-btn" @click="wkDetailGoback" icon="left">返回</a-button>
      </span>
    </div>
    <!-- 搜索 -->
    <div class>
      <div class="wk-detail-search">
        <label for>搜索：</label>
        <a-input placeholder="姓名，身份证号" v-model="keywords" style="width: 170px" allow-clear></a-input>
        <a-button type="primary" style="margin-left:20px" @click="searchExaminee">
          <svg-icon icon-class="sousuo" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>搜索
        </a-button>

        <datum-audit class="datum_audit" v-if="operateAble" :selectedWkIds="childCurWkId"></datum-audit>

        <span>
          <a-button
            v-if="operateAble"
            class="send-back"
            icon="minus-circle"
            @click="showSendBackModal"
          >退回</a-button>
        </span>
      </div>
    </div>
    <!-- 考生表格 -->
    <div class="wk-detail-table">
      <a-table
        :columns="columns"
        :data-source="examineeList"
        :row-key="record=>record.id"
        :pagination="pagination"
        :loading="exeeLoading"
        size="middle"
        bordered
        :scroll="{ y: exeeScrollHeight }"
        :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
            }
          "
      >
        <span
          slot="provincialAuditDatum"
          slot-scope="text"
          @click="showPDF(text.fileUrl)"
        >{{ text.fileName ||"--"}}</span>
        <span
          slot="citiesAuditDatum"
          slot-scope="text"
          @click="showPDF(text.fileUrl)"
        >{{ text.fileName ||"--"}}</span>
        <span
          slot="countyAuditDatum"
          slot-scope="text"
          @click="showPDF(text.fileUrl)"
        >{{ text.fileName ||"--" }}</span>
        <span
          slot="assignsAuditDatum"
          slot-scope="text"
          @click="showPDF(text.fileUrl)"
        >{{ text.fileName ||"--"}}</span>
      </a-table>
    </div>
    <!-- 考生退回意见弹窗 -->
    <a-modal
      :visible="enReOpvisible"
      @ok="handleOk"
      :footer="null"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <h4 slot="title">退回意见录入</h4>
      <a-textarea :rows="4" placeholder="请录入考生退回意见" v-modal="exeeReOption"></a-textarea>
      <div class="modal_footer" style="text-align:center;margin-top:10px">
        <a-button type="primary" @click="saveReOption(record)">保存</a-button>
        <a-button type="default" @click="handleCancel" style="margin-left:40px">取消</a-button>
      </div>
    </a-modal>
    <!-- 审核日志表格 -->
    <!-- <div class="audit-log-table">
      <log-table ref="logTable" :showHeader="true" :curWkId="curWkId"></log-table>
    </div>-->
    <send-back ref="sendBack" :operaType="1"></send-back>
    <pdf :pageUrl="pdfUrl" ref="pdfCon" style="width: 100%; height: 100%;" />
  </div>
</template>

<script>
import pdf from "@/components/common/readPDF";
import SendBack from "../components/SendBack";
import DatumAudit from "../components/DatumAudit";
// import LogTable from "../components/LogTable";
import { mergeCellKey, mergeCellKey2 } from "@/Utils/util";
import { mapState } from "vuex";
const logColumns = [
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: "15%"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: "10%",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "备注",
    dataIndex: "remarks",
    key: "remarks",
    width: "55%",
    scopedSlots: { customRender: "remarks" }
  },
  {
    title: "操作机构",
    dataIndex: "actionAgency",
    key: "actionAgency",
    width: "20%"
  }
];
const backOpColumns = [
  {
    title: "名字",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark"
  }
];

export default {
  name: "",
  components: { pdf, SendBack, DatumAudit },
  data() {
    const columns = [
      {
        title: "报名号",
        dataIndex: "idNumber",
        key: "bmh",
        width: 140,
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <span
                  style="cursor:pointer;color:#36b4f3"
                  onclick={() => {
                    this.alterExamineeRegInfo(
                      record.bmh,
                      record.assignsAuditDatum.wkId
                    );
                  }}
                >
                  {text.bmh}
                </span>
              ) : (
                ""
              ),
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            "idNumber",
            "bmh",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "证件号",
        dataIndex: "idNumber",
        key: "idNumber",
        width: 160,
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : "",
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            "idNumber",
            "bmh",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "考生姓名",
        dataIndex: "examineeName",
        key: "examineeName",
        width: 100,
        ellipsis: true,
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : "",
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            "examineeName",
            "bmh",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "变更项",
        dataIndex: "changeitem",
        key: "changeitem"
      },
      {
        title: "原始值",
        dataIndex: "oldValue",
        key: "oldValue"
      },
      {
        title: "变更值",
        dataIndex: "newValue",
        key: "newValue"
      },
      {
        title: "省级审核材料",
        dataIndex: "provincialAuditDatum",
        key: "provincialAuditDatum",
        ellipsis: true,
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <span
                  style="text-decoration: underline"
                  onclick={() => {
                    this.showPDF(text.fileUrl);
                  }}
                >
                  {text.fileName}
                </span>
              ) : (
                ""
              ),
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey(
            text,
            this.examineeList,
            "provincialAuditDatum",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "地市级审核材料",
        dataIndex: "citiesAuditDatum",
        key: "citiesAuditDatum	",
        ellipsis: true,
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <span
                  style="text-decoration: underline"
                  onclick={() => {
                    this.showPDF(text.fileUrl);
                  }}
                >
                  {text.fileName}
                </span>
              ) : (
                ""
              ),
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey(
            text,
            this.examineeList,
            "citiesAuditDatum",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "区县级审核材料",
        dataIndex: "countyAuditDatum",
        key: "countyAuditDatum",
        ellipsis: true,
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <span
                  style="text-decoration: underline"
                  onclick={() => {
                    this.showPDF(text.fileUrl);
                  }}
                >
                  {text.fileName}
                </span>
              ) : (
                ""
              ),
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey(
            text,
            this.examineeList,
            "countyAuditDatum",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "报名点审核材料",
        dataIndex: "assignsAuditDatum",
        key: "assignsAuditDatum",
        ellipsis: true,
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <span
                  style="text-decoration: underline"
                  onclick={() => {
                    this.showPDF(text.fileUrl);
                  }}
                >
                  {text.fileName}
                </span>
              ) : (
                ""
              ),
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey(
            text,
            this.examineeList,
            "assignsAuditDatum",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "退回意见",
        dataIndex: "returnRemarks",
        key: "returnRemarks",
        ellipsis: true,
        scopedSlots: { customRender: "returnRemarks" },
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : "",
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            "returnRemarks",
            "bmh",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 110,
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <span
                  style="cursor:pointer;color:#36b4f3"
                  onclick={() => {
                    this.entyyReOp(record);
                  }}
                >
                  {"录入退回意见"}
                </span>
              ) : (
                ""
              ),
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            "operation",
            "bmh",
            index
          );
          // obj.attrs.rowSpan = 1;
          return obj;
        }
      }
    ];
    return {
      examineeList: [],
      columns,
      logColumns,
      backOpColumns,
      exeeScrollHeight: 300,
      logScrollHeight: 300,
      sendBackScrollHeight: 200,
      logDetailScrollHeight: 100,
      screenHeight: 0,
      exeeLoading: false,
      enReOpvisible: false,
      exeeReOption: "",
      pdfUrl: "",
      pagination: {
        //分页相关
        current: 1,
        defaultPageSize: 10,
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: current => {
          //页码切换
          this.pagination.current = current;
          this.exeeListFilter.current = current;
          this.getExamineeList();
        },
        onShowSizeChange: (current, pageSize) => {
          //每页显示条数切换
          this.pagination.current = 1;
          this.exeeListFilter.current = 1;
          this.exeeListFilter.pageSize = pageSize;
          this.getExamineeList();
        }
      },
      exeeListFilter: {
        keywords: "",
        current: 1,
        pageSize: 10,
        type: "1",
        wkId: []
      },
      keywords: "",
      auditLogList: [],
      //退回弹框数据
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {
        returnCode: "",
        returnRemark: ""
      },
      auditTypeList: [],
      returnCodeList: []
    };
  },
  computed: {
    ...mapState("codeTable", ["returnCode", "auditType"]),
    /**
     * 当前工单id
     */
    curWkId() {
      return sessionStorage.getItem("curWkId");
    },
    /**
     * 当前工单id（转为数组传到子组件）
     */
    childCurWkId() {
      let arr = [];
      arr.push(this.curWkId);
      return arr;
    },
    /**
     * 当前工单号
     */
    curWorkOrder() {
      return sessionStorage.getItem("workOrder");
    },
    /**
     * 是否可编辑
     */
    operateAble() {
      return JSON.parse(sessionStorage.getItem("selectable"));
    }
  },
  created() {
    this.initWkId();
    this.examineeList = [];
  },
  mounted() {
    this.auditTypeList = this.auditType;
    this.returnCodeList = this.returnCode;
    this.getExamineeList();
    this.getAuditLogList();
    // this.$refs.logTable.getAuditLogList(this.curWkId);
  },
  methods: {
    /**
     * 初始化考生信息
     */
    initWkId() {
      const recordWkId = this.$route.query.wkId;
      const selectable = this.$route.query.selectable;
      if (recordWkId) {
        sessionStorage.setItem("curWkId", recordWkId);
        sessionStorage.setItem("selectable", selectable);
        this.exeeListFilter.wkId.length = 0;
        this.exeeListFilter.wkId.push(sessionStorage.getItem("curWkId"));
        this.exeeListFilter.keywords = this.keywords;
      }
    },
    /**
     * 返回
     */
    wkDetailGoback() {
      this.$router.go(-1);
    },

    /**
     * 搜索
     */
    searchExaminee() {
      this.exeeListFilter.keywords = this.keywords;
      this.getExamineeList();
    },
    /**
     * 显示退回弹框
     */
    showSendBackModal() {
      this.$refs.sendBack.showModal(this.curWkId);
    },
    /**
     * 获取考生列表
     */
    async getExamineeList() {
      this.exeeLoading = true;
      const result = await this.$api.workOrderAudit.getExamineeList(
        this.exeeListFilter
      );
      if (result.code === "200") {
        this.examineeList = result.data.wkList[0].cgItemList;
        this.pagination.total = result.data.wkList[0].pagination.total;
        this.exeeLoading = false;
      }
    },
    /**
     * 跳转考试详情信息页面
     */
    alterExamineeRegInfo(bmh, wkId) {
      this.$router.push({
        path: "/WorkOrderApply/ExamineeRegInfo",
        query: {
          bmh,
          wkId,
          status: true,
          type: "look"
        }
      });
    },
    /**
     *  PDF预览弹窗
     */
    showPDF(fileUrl) {
      this.pdfUrl = fileUrl;
      this.$refs.pdfCon.showModal();
    },
    /**
     * 录入考生退回意见
     */
    entyyReOp(op) {
      this.enReOpvisible = true;
      sessionStorage.setItem("curbmh", op.bmh);
    },
    /**
     * 保存考生退回意见
     */
    async saveReOption() {
      const cgItemFilter = {
        current: 1,
        pageSize: 10,
        wkId: sessionStorage.getItem("curWkId"),
        bmh: sessionStorage.getItem("curbmh")
      };
      sessionStorage.setItem("curRemark", this.reOption);
      const filter = {
        returnRemarks: this.exeeReOption,
        ...cgItemFilter
      };
      const result = await this.$api.workOrderAudit.saveReOption(filter);
      if (result.code === "200") {
        this.$message.success("保存成功");
        this.enReOpvisible = false;
        this.getExamineeList();
      }
    },
    handleCancel() {
      this.enReOpvisible = false;
    },
    /**
     * 获取审核日志
     */
    async getAuditLogList() {
      const result = await this.$api.workOrderAudit.getAuditLogList({
        wkId: this.curWkId
      });
      if (result.code === "200") {
        this.auditLogList = result.data.list;
      }
    }
  }
};
</script>
 
<style scoped lang = "less">
.wk-detail {
  padding-left: 10px;
  .wk-detail-header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .current-wkId {
      display: inline-block;
      width: 100%;
      height: 60px;
    }
    .wk-detail-goback {
      position: absolute;
      right: 10px;
    }
  }
  .wk-detail-search {
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    position: relative;
    .datum_audit {
      display: inline-block;
      width: 700px;
      /* background: cornflowerblue; */
    }
    .send-back {
      display: inline-block;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .wk-detail-table {
    padding-left: 10px;
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
    /deep/.ant-btn-sm {
      height: 24px;
      width: 80px;
      padding: 0 7px;
      font-size: 14px;
      border-radius: 4px;
    }
  }
  .audit-log-table {
    padding-left: 10px;
    .audit-log-table-content {
      .remark {
        .exee-item {
          width: 90%;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
        .exee-detail {
        }
      }
    }
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
}
.sendback-modal-table-title {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  vertical-align: middle;
}
.sendback-modal-table-title::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 20px;
  vertical-align: middle;
  margin-right: 6px;
  background: rgba(0, 0, 0, 1);
}
.sendback-modal-footer {
  width: 100%;
  text-align: center;
  margin-top: 10px;
}
.wk-detail-table .audit-log-table {
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
</style>