<template>
  <div class="cro-area-audit">
    <div class="cro-area-audit-header">
      <div>
        <div>
          <span>申请机构：</span>
          <a-select
            v-model="search.applyOrgCode"
            style="width: 120px"
            placeholder="请选择"
            allowClear
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option
              v-for="item of applyOrgCodeTree"
              :key="item.orgcode"
              :value="item.orgcode"
              :title="item.orgName"
            >
              {{ item.orgName }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <span>申请日期：</span>
          <a-date-picker
            v-model="search.applyDate"
            :showToday="false"
            style="width: 120px"
          >
            <template slot="dateRender" slot-scope="current, today">
              <div
                class="ant-calendar-date"
                :style="getApplyDateStyle(current, today)"
              >
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </div>
        <div>
          <span>审核日期：</span>
          <a-date-picker v-model="search.auditDate" style="width: 120px">
            <template slot="dateRender" slot-scope="current, today">
              <div
                class="ant-calendar-date"
                :style="getAuditDateStyle(current, today)"
              >
                {{ current.date() }}
              </div>
            </template>
          </a-date-picker>
        </div>
        <div>
          <span>审核状态：</span>
          <a-select v-model="search.applyStatus" style="width: 120px">
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option :value="0"> 待审核 </a-select-option>
            <a-select-option :value="1"> 审核通过 </a-select-option>
            <a-select-option :value="2"> 审核不通过 </a-select-option>
          </a-select>
        </div>
        <a-button type="primary" @click="query()">查询</a-button>
      </div>
      <a-button type="primary" @click="exportExcel()">
        <svg-icon
          icon-class="daochu"
          :scale="0.85"
          style="margin-right: 5px"
        ></svg-icon>
        导出Excel</a-button
      >
    </div>

    <!-- 表格 -->
    <div class="cro-area-audit-table">
      <a-table
        bordered
        :pagination="false"
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :rowKey="(row) => row.applyId"
        :scroll="{ x: 950, y: tableHeight }"
        size="middle"
      >
        <span slot="applyStatus" slot-scope="text" :class="statusColor(text)">{{
          text ? text : "--"
        }}</span>
        <span slot="notPassReason" slot-scope="text">{{
          text ? text : "--"
        }}</span>
        <div
          slot="handle"
          slot-scope="text, row"
          class="handle-button"
          style="padding-right: 10px"
        >
          <a-button style="margin-right: 10px" @click="auditLook(row)">{{
            row.applyStatus === "待审核" ? "审核" : "查看"
          }}</a-button>
          <a-button @click="toDetail(row)" style="margin-right: 10px"
            >详情</a-button
          >
        </div>
      </a-table>
    </div>

    <template v-if="isMounted">
      <Page v-show="data.length" @getList="getList" ref="page" />
    </template>

    <a-modal
      v-model="auditModalVisible"
      title=" 考生跨地区分配审核 "
      :footer="null"
      :maskClosable="false"
      :destroyOnClose="true"
      wrapClassName="cor-area-examinee-dis-audit-modal"
    >
      <p><span class="label-text">申请机构：</span>{{ form.applyOrgCode }}</p>
      <p><span class="label-text">接收机构：</span>{{ form.receiveOrgCode }}</p>
      <p>
        <span class="label-text">申请考生数：</span>{{ form.examineeCount }}
      </p>

      <a-form-model
        :model="form"
        :rules="rules"
        ref="ruleForm"
        :labelCol="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- <a-form-model-item label="申请机构">
          <span>{{form.applyOrgCode}}</span>
        </a-form-model-item>
        <a-form-model-item label="接收机构">
          <span>{{form.receiveOrgCode}}</span>
        </a-form-model-item>
        <a-form-model-item label="申请考生数">
          <span>{{form.examineeCount}}</span>
        </a-form-model-item> -->
        <a-form-model-item label="审核意见" prop="applyStatus">
          <a-select
            v-model="form.applyStatus"
            placeholder="请选择"
            :disabled="!isAudit"
          >
            <a-select-option :value="1"> 审核通过 </a-select-option>
            <a-select-option :value="2"> 审核不通过 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.applyStatus === 2"
          label="原因"
          prop="notPassReason"
        >
          <a-textarea
            v-model="form.notPassReason"
            :disabled="!isAudit"
            :rows="3"
          />
        </a-form-model-item>
      </a-form-model>
      <div class="footer" v-if="isAudit">
        <a-button type="primary" @click="comfirm" :loading="comfirmLoading">
          <svg-icon
            icon-class="queren"
            :scale="0.85"
            style="margin-right: 5px"
          ></svg-icon
          >确认</a-button
        >
        <a-button @click="cancel">
          <svg-icon
            icon-class="quxiao"
            :scale="0.7"
            style="margin-right: 5px"
          ></svg-icon
          >取消</a-button
        >
      </div>
    </a-modal>
  </div>
</template>

<script>
import { downloadFile } from "../../utils/util";

const columns = [
  {
    title: "申请日期",
    dataIndex: "applyDate",
    width: 90,
    key: "applyDate",
  },
  {
    title: "申请机构",
    dataIndex: "applyOrgCode",
    width: 180,
    key: "applyOrgCode",
  },
  {
    title: "接收机构",
    dataIndex: "receiveOrgCode",
    width: 180,
    key: "receiveOrgCode",
  },
  {
    // title: "考生人数",
    title: "跨地区分配考生人数",
    dataIndex: "examineeCount",
    width: 150,
    key: "examineeCount",
  },
  {
    title: "审核日期",
    dataIndex: "auditDate",
    width: 90,
    key: "auditDate",
  },
  {
    title: "审核状态",
    dataIndex: "applyStatus",
    width: 100,
    key: "applyStatus",
    scopedSlots: { customRender: "applyStatus" },
  },
  {
    title: "审核不通过原因",
    dataIndex: "notPassReason",
    width: 130,
    ellipsis: true,
    key: "notPassReason",
    scopedSlots: { customRender: "notPassReason" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "handle" },
    width: 160,
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      tableHeight: 0, //table高度
      isMounted: false,
      comfirmLoading: false,
      columns,
      data: [],
      applyOrgCodeTree: [], //申请机构树
      applyDateList: [], //接收日期数组
      auditDateList: [], //接收日期数组
      replaceFields: {},
      search: {
        applyOrgCode: "",
        applyDate: null,
        auditDate: null,
        applyStatus: "",
        current: 1,
        pageSize: 20,
      },
      stripTotal: null, //查询列表总条数
      tableLoading: false,
      isAudit: false, //审核还是查看
      auditModalVisible: false, //对话框显隐
      form: {
        applyId: null,
        applyStatus: null,
        notPassReason: "",
      },
      rules: {
        applyStatus: [{ required: true, message: "请选择审核意见" }],
      },
    };
  },
  computed: {
    statusColor(text) {
      return (text) => {
        if (text === "待审核") {
          return "colOrange";
        } else if (text === "审核通过") {
          return "colGreen";
        } else if (text === "审核不通过") {
          return "colRed";
        } else {
          return "colGray";
        }
      };
    },
  },
  async mounted() {
    await this.getList();
    this.getApplyOrgCodeTree();
    this.getApplyDateList();
    this.getAuditDateList();
    this.isMounted = true;
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".cro-area-audit-table");
      this.tableHeight = tableHeight.clientHeight - 47;
    },
    //查询
    async query() {
      this.$refs.page.pagination.current = 1;
      this.search.current = 1;
      await this.getList();
      this.$refs.page.returnPageTotal();
    },

    //导出Excel
    exportExcel() {
      // console.log("导出Excel");
      this.exportApply();
    },

    //点击审核查看
    auditLook(row) {
      this.auditModalVisible = true;
      this.form = { ...row };
      if (row.applyStatus === "待审核") {
        this.isAudit = true;
        this.form.applyStatus = undefined;
      } else {
        this.form.applyStatus = row.applyStatus === "审核通过" ? 1 : 2;
        this.isAudit = false;
      }
    },

    //点击-详情
    toDetail(row) {
      // console.log("toDetail", row);
      this.$router.push({
        path: "/phyExamAuditManage/auditDetail",
        query: { applyId: row.applyId },
      });
    },
    //申请日期和审核日期高亮显示
    getApplyDateStyle(current, today) {
      const style = {};
      if (this.applyDateList.includes(current.format("YYYY-MM-DD"))) {
        style.border = "1px solid #1890ff";
        style.borderRadius = "50%";
      }
      return style;
    },
    getAuditDateStyle(current, today) {
      const style = {};
      if (this.auditDateList.includes(current.format("YYYY-MM-DD"))) {
        style.border = "1px solid #1890ff";
        style.borderRadius = "50%";
      }
      return style;
    },

    //弹框事件
    //弹框 --确认
    comfirm() {
      // console.log(this.form);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const { applyId, applyStatus, notPassReason } = this.form;
          this.audit({
            applyId,
            auditStatus: applyStatus,
            reason: notPassReason,
          });
        } else {
          return false;
        }
      });
    },
    //弹框 --取消
    cancel() {
      this.auditModalVisible = false;
    },

    // 跨地区分配审核 - 获取审核列表
    async getList() {
      this.tableLoading = true;
      let { applyDate, auditDate } = this.search;
      applyDate = applyDate ? applyDate.format("YYYY-MM-DD") : "";
      auditDate = auditDate ? auditDate.format("YYYY-MM-DD") : "";
      try {
        const res = await this.$api.croAreaAudit.getAuditList({
          ...this.search,
          applyDate,
          auditDate,
        });
        // console.log("getList res", res);
        if (res.code === "200" || res.code === 200) {
          this.data = res.data.list;
          this.stripTotal = res.data.pagination.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 跨地区分配审核 - 获取申请机构树
    async getApplyOrgCodeTree() {
      this.tableLoading = true;
      try {
        const res = await this.$api.croAreaAudit.getApplyOrgCodeTree({});
        // console.log("getList res", res);
        if (res.code === "200" || res.code === 200) {
          this.applyOrgCodeTree = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 跨地区分配审核 - 获取申请日期
    async getApplyDateList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.croAreaAudit.applyDateList({});
        // console.log("getList res", res);
        if (res.code === "200" || res.code === 200) {
          this.applyDateList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 跨地区分配审核 - 获取审核日期
    async getAuditDateList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.croAreaAudit.auditDateList({});
        // console.log("getList res", res);
        if (res.code === "200" || res.code === 200) {
          this.auditDateList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 跨地区分配审核 - 审核
    async audit(data) {
      this.$message.loading({
        content: "审核中...",
        key: "audit",
        duration: 0
      });
      this.comfirmLoading = true
      try {
        // console.log("getList res", data);
        const res = await this.$api.croAreaAudit.audit(data);
        // console.log("getList res", data);
        if (res.code === "200" || res.code === 200) {
          this.$message.success({
            content: "审核成功",
            key: "audit",
          });
          this.auditModalVisible = false;
          this.getList();
        } else {
          this.$message.error({
            content: res.message,
            key: "audit",
          });
        }
      } catch (error) {
        console.log(error);
        this.$message.error({
          content: "请求失败" + error,
          key: "audit",
        });
      } finally {
        this.comfirmLoading = false
      }
    },

    // 跨地区分配审核 - 导出
    async exportApply() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        const res = await this.$api.croAreaAudit.exportApply(this.search);
        // console.log("getList res", res);
        downloadFile(res);
      } catch (error) {
        // console.log(error);
        this.$message.error("请求失败！" + error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    },
  },
};
</script>

<style lang="less">
.cro-area-audit {
  height: 100%;
  display: flex;
  flex-direction: column;
  .cro-area-audit-header {
    margin-bottom: 15px;
    & > div {
      margin-bottom: 15px;
      display: flex;
      & > * {
        margin-right: 15px;
      }
    }
  }

  .cro-area-audit-table {
    flex-grow: 1;
    overflow-y: auto;

    .colOrange {
      color: #ff9b3a;
    }
    .colGray {
      color: #ababab;
    }
    .colGreen {
      color: #4cca75;
    }
    .colRed {
      color: #ff6262;
    }
  }

  .ant-table td {
    white-space: nowrap;
  }
}

.cor-area-examinee-dis-audit-modal {
  .label-text {
    display: inline-block;
    width: 100px;
    text-align: right;
    color: rgba(0, 0, 0, 0.85);
  }
  .footer {
    margin-top: 20px;
    text-align: center;
    & > * {
      margin-right: 15px;
    }
  }
}
</style>
