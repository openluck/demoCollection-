<template>
  <div class="exee-detail">
    <div class="exee-detail-header">
      <span class="header-title">考生数据详情</span>
      <span class="exee-detail-goback">
        <a-button class="exee-detail-goback-btn" @click="exeeDetailGoback" icon="left">返回</a-button>
      </span>
    </div>
    <div class="exee-info">
      <span class="info-item">考生身份证号：{{exeeInfo.idNumber}}</span>
      <span class="info-item">姓名：{{exeeInfo.name}}</span>
      <span class="info-item">性别：{{exeeInfo.gender===1?'男':'女'}}</span>
      <span class="info-item">报名号：{{exeeInfo.bmh}}</span>
    </div>
    <div class="exee-datum">
      <span class="datum-item" v-if="exeeInfo.assignsAuditDatum.fileUrl">
        报名点申请材料：
        <a
          @click="showPDF(exeeInfo.assignsAuditDatum.fileUrl)"
        >{{showName(exeeInfo.assignsAuditDatum.fileName)}}</a>
      </span>
      <span class="datum-item" v-if="exeeInfo.countyAuditDatum.fileUrl">
        区县审核材料：
        <a
          @click="showPDF(exeeInfo.countyAuditDatum.fileUrl)"
        >{{showName(exeeInfo.countyAuditDatum.fileName)}}</a>
      </span>
      <span class="datum-item" v-if="exeeInfo.citiesAuditDatum.fileUrl">
        地市审核材料：
        <a
          @click="showPDF(exeeInfo.citiesAuditDatum.fileUrl)"
        >{{showName(exeeInfo.countyAuditDatum.fileName)}}</a>
      </span>
      <span class="datum-item" v-if="exeeInfo.provincialAuditDatum.fileUrl">
        省级审核材料：
        <a
          @click="showPDF(exeeInfo.provincialAuditDatum.fileUrl)"
        >{{showName(exeeInfo.countyAuditDatum.fileName)}}</a>
      </span>
      <a-button class="complete-info" @click="alterExamineeRegInfo">完整信息</a-button>
    </div>
    <!-- 变更项表格 -->
    <div class="chang-item-table">
      <a-table
        :columns="cgItemColumns"
        :data-source="cgItemList"
        :row-key="record=>record.id"
        :pagination="false"
        size="middle"
        bordered
        :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
            }
          "
      >
        <span slot="remark" slot-scope="text,record">
          {{text}}
          <a @click="getAuditLogDetails(record)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- 录入退回意见 -->
    <div class="enter-reoption" v-if="showReOption">
      <p>录入[{{exeeInfo.name}}]考生退回意见</p>
      <a-input type="textarea" placeholder="请输入" style="height:60px" v-model="reOption"></a-input>
      <a-button icon="check" type="primary" @click="saveReOption" style="margin-top:10px">保存</a-button>
    </div>
    <!-- 信息变更日志  -->
    <div class="cglog-table-title">
      <span class="title-text">信息修改变更日志</span>
    </div>
    <div class="cglog-tablel-table">
      <a-table
        :columns="cglogColumns"
        :data-source="cglogList"
        :row-key="record=>record.id"
        :pagination="false"
        size="middle"
        bordered
        :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
            }
          "
      >
        <span slot="operateType" slot-scope="text">{{text==="1"?"删除":"录入"}}</span>
      </a-table>
    </div>
    <pdf :pageUrl="pdfUrl" ref="pdfCon" style="width: 100%; height: 100%;" />
  </div>
</template>
 
<script>
import pdf from "@/components/common/readPDF";
const cgItemColumns = [
  {
    title: "变更项",
    dataIndex: "key",
    key: "key",
    width: 120,
    ellipsis: true
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
    title: "操作机构",
    dataIndex: "operateAgency",
    key: "operateAgency",
    width: 200,
    ellipsis: true
  },
  {
    title: "操作人",
    dataIndex: "operatePerson",
    key: "operatePerson",
    width: 120,
    ellipsis: true
  }
];
const cglogColumns = [
  {
    title: "操作时间",
    dataIndex: "operateTime",
    key: "operateTime",
    width: 160,
    ellipsis: true
  },
  {
    title: "操作",
    dataIndex: "operateType",
    key: "operateType",
    width: 80,
    ellipsis: true,
    scopedSlots: { customRender: "operateType" }
  },
  {
    title: "变更项",
    dataIndex: "key",
    key: "key"
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
    title: "操作机构",
    dataIndex: "operateAgency",
    key: "operateAgency",
    width: 200,
    ellipsis: true
  },
  {
    title: "操作人",
    dataIndex: "operatePerson",
    key: "operatePerson",
    width: 120,
    ellipsis: true
  }
];
export default {
  name: "",
  components: { pdf },
  data() {
    return {
      cgItemColumns,
      cglogColumns,
      exeeInfo: {
        idNumber: "",
        gender: "",
        bmh: "",
        name: "",
        assignsAuditDatum: {
          fileName: "",
          fileUrl: ""
        },
        countyAuditDatum: {
          fileName: "",
          fileUrl: ""
        },

        citiesAuditDatum: {
          fileName: "",
          fileUrl: ""
        },
        provincialAuditDatum: {
          fileName: "省级审核的材料",
          fileUrl: ""
        }
      },
      cgItemFilter: {
        current: 1,
        pageSize: 10,
        wkId: "",
        bmh: ""
      },

      pdfUrl: "",
      cgItemList: [],
      cglogList: [],
      reOption: "",
      subWkId: ""
    };
  },
  computed: {
    operateAble() {
      return JSON.parse(sessionStorage.getItem("selectable"));
    },
    showReOption() {
      return JSON.parse(sessionStorage.getItem("showReOption"));
    }
  },
  created() {
    this.initInfo();
    this.cgItemFilter.wkId = sessionStorage.getItem("curWkId");
    this.cgItemFilter.bmh = sessionStorage.getItem("curbmh");
    this.reOption = sessionStorage.getItem("curRemark");
    this.getChangeItemList();
    this.getChangeLogList();
  },
  mounted() {},
  methods: {
    /**
     * 初始化考生信息
     */
    initInfo() {
      const curbmh = this.$route.query.bmh;
      const curWkId = this.$route.query.wkId;
      // const curRemark = this.$route.query.remark;
      const showReOption = this.$route.query.showReOption;
      if (curbmh || curWkId) {
        sessionStorage.setItem("curbmh", curbmh);
        sessionStorage.setItem("curWkId", curWkId);
        // sessionStorage.setItem("curRemark", curRemark);
        sessionStorage.setItem("showReOption", showReOption);
      }
    },
    /**
     * 返回
     */
    exeeDetailGoback() {
      this.$router.go(-1);
    },
    /**
     *  PDF预览弹窗
     */
    showPDF(fileUrl) {
      this.pdfUrl = fileUrl;
      this.$refs.pdfCon.showModal();
    },
    showName(op) {
      try {
        if (Object.getOwnPropertyNames(op).length !== 0) {
          return op;
        } else {
          return "--";
        }
      } catch (error) {
        return "--";
      }
    },
    /**
     * 获取变更项列表
     */
    async getChangeItemList() {
      const result = await this.$api.workOrderAudit.getChangeItemList(
        this.cgItemFilter
      );
      if (result.code === "200") {
        if (Object.getOwnPropertyNames(result.data).length !== 0) {
          this.exeeInfo = JSON.parse(JSON.stringify(result.data.examineeInfo));
          this.subWkId = result.data.examineeInfo.wk_id;
          this.cgItemList = result.data.changeList;
        }
      }
    },
    /**
     * 保存考生退回意见
     */
    async saveReOption() {
      sessionStorage.setItem("curRemark", this.reOption);
      const filter = {
        returnRemarks: this.reOption,
        ...this.cgItemFilter
      };
      const result = await this.$api.workOrderAudit.saveReOption(filter);
      if (result.code === "200") {
        this.$message.success("保存成功");
      }
    },
    /**
     * 获取变更日志列表
     */
    async getChangeLogList() {
      const result = await this.$api.workOrderAudit.getChangeLogList(
        this.cgItemFilter
      );
      if (result.code === "200") {
        this.cglogList = result.data.list;
      }
    },
    // 数据变更
    alterExamineeRegInfo() {
      const bmh = sessionStorage.getItem("curbmh");
      this.$router.push({
        path: "/WorkOrderApply/ExamineeRegInfo",
        query: {
          bmh,
          wkId: this.subWkId,
          status: true,
          type: "look"
        }
      });
    }
  }
};
</script>
 
<style scoped lang = "less">
.exee-detail {
  padding-left: 10px;
  .exee-detail-header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .header-title {
      display: inline-block;
      width: 100px;
      height: 60px;
    }
    .exee-detail-goback {
      position: absolute;
      right: 10px;
    }
  }
  .exee-info {
    margin: 20px 0 10px 10px;
    display: flex;
    .info-item {
      display: inline-block;
      width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
    }
  }
  .exee-datum {
    margin: 20px 0 10px 10px;
    display: flex;
    height: 50px;
    line-height: 50px;
    position: relative;
    .datum-item {
      display: inline-block;
      width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
      a {
        color: darkgrey;
        text-decoration: underline;
      }
    }
    .complete-info {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .chang-item-table {
    margin: 10px 10px 0;
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
  }
  .enter-reoption {
    margin: 10px 10px 0;
  }
  .cglog-table-title {
    margin: 10px 10px 0;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    vertical-align: middle;
  }
  .cglog-table-title::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 20px;
    vertical-align: middle;
    margin-right: 6px;
    background: rgba(0, 0, 0, 1);
  }
  .cglog-tablel-table {
    margin: 20px 0 0 10px;
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
  }
}
</style>