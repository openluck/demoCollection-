<template>
  <div class="batch-review">
    <a-alert message="请先上传审核材料，再提交审核。未签字提交的上传材料，系统不会保存，页面刷新后需重新上传！" banner closable />
    <div class="batch-header">
      <span class="batch-header-title">审阅页面</span>
      <!-- PDF上传 -->
      <span class="batch-header-back">
        <a-button @click="baReviewGoback" icon="left">返回</a-button>
      </span>
    </div>

    <!-- 材料上传及审核 -->
    <div class="work-order-audit-upload">
      <datum-audit :selectedWkIds="selectedWkIds"></datum-audit>
    </div>

    <!-- 工单表格 -->
    <div class="batch-review-content">
      <div class="batch-review-table" v-for="(item,index) in tableList" :key="index">
        <div class="batch-review-wkinfo">
          <span>工单号：{{wkInfo(index).workorder}}</span>
          <span>提交机构：{{wkInfo(index).org_name}}</span>
          <span>提交时间：{{wkInfo(index).submitTime}}</span>
          <!-- <a-button type="primary" class="look-log" @click="showLogModal(wkInfo(index).wkId)">
            <svg-icon
              icon-class="xiangqing"
              class="icon_item"
              :color="svgColor"
              style="margin-right:6px;font-size:12px;"
            ></svg-icon>查看工单日志
          </a-button> -->
          <a-button class="send-back" @click="sendBack(wkInfo(index).wkId)">
            <svg-icon
              icon-class="tuihui"
              class="icon_item"
              style="margin-right:6px;font-size:12px;"
            ></svg-icon>退回
          </a-button>
        </div>
        <a-table
          v-if="isLoad"
          :columns="columns"
          :data-source="curTableData(index)"
          :row-key="record=>record.time"
          :pagination="false"
          size="middle"
          :bordered="false"
        ></a-table>
      </div>
    </div>

    <!-- 工单日志弹窗 -->
    <a-modal v-model="logVisible" :width="1000" :footer="null">
      <div class="tip-modal-title" slot="title">流转日志</div>
      <log-table ref="logTable" :showHeader="false" :curWkId="logWkid"></log-table>
    </a-modal>

    <!-- 退回弹窗 -->
    <send-back ref="sendBack" :selectedWkIds="selectedWkIds" :operaType="2"></send-back>
    <pdf :pageUrl="pdfUrl" ref="pdfCon" style="width: 100%; height: 100%;" />
  </div>
</template>
 
<script>
import pdf from "@/components/common/readPDF";
import { mergeCellKey, mergeCellKey2 } from "@/Utils/util";
import LogTable from "../components/LogTable";
import SendBack from "../components/SendBack";
import DatumAudit from "../components/DatumAudit";
export default {
  name: "",
  components: { pdf, LogTable, SendBack, DatumAudit },
  data() {
    const columns = [
      {
        title: "报名号",
        dataIndex: "idNumber",
        key: "bmh",
        width: 160,
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
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.curTableData(myIndex),
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
        width: "15%",
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : "",
            attrs: {}
          };
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.curTableData(myIndex),
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
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : "",
            attrs: {}
          };
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.curTableData(myIndex),
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
        key: "oldValue",
        ellipsis: true
      },
      {
        title: "变更值",
        dataIndex: "newValue",
        key: "newValue",
        ellipsis: true
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
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey(
            text,
            this.curTableData(myIndex),
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
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey(
            text,
            this.curTableData(myIndex),
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
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey(
            text,
            this.curTableData(myIndex),
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
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : "",
            attrs: {}
          };
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.curTableData(myIndex),
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
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <a-button
                  onclick={() => {
                    this.reviewExaminee(text, record);
                  }}
                >
                  {text.text}
                </a-button>
              ) : (
                ""
              ),
            attrs: {}
          };
          let wkNum = record.examineeName.wkNum;
          let myIndex = 0;
          this.tableList.forEach((item, index) => {
            if (item.cgItemList[0].examineeName.wkNum === wkNum) {
              myIndex = index;
            }
          });
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.curTableData(myIndex),
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
      tableList: [],
      selectedWkIds: [],
      columns,
      isLoad: false,
      exeeListFilter: {
        keywords: "",
        current: "",
        pageSize: "",
        type: "2",
        wkId: []
      },
      pdfUrl: "",
      logVisible: false,
      logWkid: "",
      svgColor: "#ffffff"
    };
  },
  computed: {
    confirmText() {
      const orgLevel = JSON.parse(sessionStorage.getItem("userInfo")); //判断省级还是区县
      if (orgLevel === "1") {
        return "已录入退回意见，是否确认审核通过并进行数据修改";
      } else {
        return "已录入退回意见，是否确认审核通过";
      }
    },
    switchComfName() {
      const curOrgLevel = JSON.parse(sessionStorage.getItem("userInfo"))
        .orgTypeId;
      if (curOrgLevel === "1") {
        return "签字确认修改";
      } else {
        return "签字确认";
      }
    }
  },
  created() {
    this.initWkId();
    this.getExamineeList(this.exeeListFilter);
  },
  mounted() {},
  methods: {
    /**
     * 表格数据
     * @param {Number} index 表格v-for循环渲染的索引
     */
    curTableData(index) {
      return this.tableList[index].cgItemList;
    },
    /**
     * 工单信息
     *  @param {Number} index 表格v-for循环渲染的索引
     */
    wkInfo(index) {
      return this.tableList[index].wkInfo;
    },
    /**
     * 返回
     */
    baReviewGoback() {
      this.$router.go(-1);
    },

    /*********************************查看工单日志********************/

    /**
     * 查看工单日志
     *  @param {String} op 工单Id
     */
    showLogModal(op) {
      this.logVisible = true;
      this.$nextTick(() => {
        this.$refs.logTable.getAuditLogList(op);
      });
    },
    /**
     * 退回工单
     * @param {String} op 工单Id
     */
    sendBack(op) {
      this.$refs.sendBack.showModal(op);
    },

    /********************************表格渲染************************/

    /**
     * 初始化考生信息
     */
    initWkId() {
      let recordWkId = JSON.parse(
        JSON.stringify(this.$route.query.workOrderList)
      );
      if (typeof recordWkId === "string") {
        recordWkId = recordWkId.split();
      }

      // debugger
      if (recordWkId) {
        sessionStorage.setItem("curWkIdList", JSON.stringify(recordWkId));
        this.exeeListFilter.wkId.length = 0;
        this.exeeListFilter.wkId = JSON.parse(
          JSON.stringify(JSON.parse(sessionStorage.getItem("curWkIdList")))
        );

        this.selectedWkIds = JSON.parse(
          JSON.stringify(JSON.parse(sessionStorage.getItem("curWkIdList")))
        );
      }
    },
    /**
     * 获取数据列表（返回的数据项是变更项）
     */
    async getExamineeList(filter) {
      this.isLoad = false;
      const result = await this.$api.workOrderAudit.getExamineeList(filter);
      if (result.code === "200") {
        this.tableList = result.data.wkList;
        this.isLoad = true;
      }
    },
    /**
     * 跳转到考生审阅
     */
    reviewExaminee(text, record) {
      this.$router.push({
        path: "/DataModifyOrder/examineeDetail",
        query: {
          wkId: record.wkId,
          bmh: record.bmh,
          remark: record.returnRemarks.text,
          showReOption: true
        }
      });
    },
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
    showPDF(record) {
      this.pdfUrl = record;
      this.$refs.pdfCon.showModal();
    }
  }
};
</script>
 
<style scoped lang = "less">
.batch-review {
  padding-left: 10px;
  .batch-header {
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .batch-header-title {
      font-weight: bolder;
    }
    .batch-header-back {
      position: absolute;
      right: 10px;
    }
  }
  .work-order-audit-upload {
    display: inline-block;
    width: 100%;
    height: 60px;
    line-height: 60px;
    .upload-control {
      display: inline-block;
      width: 480px;
    }
  }
  .batch-review-content {
    width: 100%;
    height: 70vh;
    overflow-y: scroll;
    .batch-review-table {
      .batch-review-wkinfo {
        position: relative;
        width: 100%;
        height: 60px;
        line-height: 60px;
        span {
          margin-right: 20px;
        }
        .look-log {
          position: absolute;
          right: 100px;
          top: 10px;
        }
        .send-back {
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
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
/* 二维码弹框 */
.QR-submit-wk-modal {
  .QR-code {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    text-align: center;
    margin-top: 10px;
  }
}
/deep/ .ant-upload-list {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  zoom: 1;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
}
/deep/.ant-upload-list-item-name {
  /* width: 300px; */
  /* overflow: hidden; */
  /* margin-right: 0px; */
  padding-right: 40px;
}
/deep/.ant-upload-list-item {
  position: relative;
  height: 100%;
  font-size: 14px;
}
</style>