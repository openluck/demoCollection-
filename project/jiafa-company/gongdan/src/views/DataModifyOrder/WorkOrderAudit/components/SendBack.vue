<template>
  <div class="send-back">
    <a-modal v-model="sendBackVisible" :footer="null">
      <div class="sendback-modal-title" slot="title">工单退回</div>
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="退回意见类型">
          <a-select v-model="form.returnCode" placeholder="please select your zone">
            <a-select-option
              :value="item.code"
              v-for="item in returnCodeList"
              :key="item.code"
            >{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="退回意见">
          <a-input v-model="form.returnRemark" type="textarea" />
        </a-form-model-item>
      </a-form-model>
      <div class="sendback-modal-table-title">
        <span class="title-text">考生详细退回意见</span>
      </div>
      <div class="sendback-modal-table">
        <a-table
          :columns="backOpColumns"
          :data-source="backOptionList"
          :row-key="record=>record.id"
          :scroll="{ y: sendBackScrollHeight }"
          :pagination="false"
          :showHeader="false"
          size="middle"
          :bordered="false"
        ></a-table>
      </div>
      <div class="sendback-modal-footer">
        <a-button type="primary" @click="sendbackHandleOk">确定</a-button>
        <a-button style="margin-left:10px" @click="sendbankHandleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
 
<script>
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
import { mapState } from "vuex";
export default {
  name: "",
  components: {},
  props: {
    selectedWkIds: {
      type: Array,
      default: () => []
    },
    operaType: Number
  },
  data() {
    return {
      curWkId: "",
      sendBackVisible: false,
      backOpColumns,
      form: {
        returnCode: "",
        returnRemark: ""
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      returnCodeList: [],
      backOptionList: [],
      sendBackScrollHeight: 200
    };
  },
  computed: { ...mapState("codeTable", ["returnCode", "auditType"]) },
  mounted() {
    this.auditTypeList = this.auditType;
    this.returnCodeList = this.returnCode;
  },
  methods: {
    showModal(op) {
      this.curWkId = op;
      this.sendBackVisible = true;
      this.getBackOpinionList(op);
    },

    /**
     * 获取退回意见列表
     */
    async getBackOpinionList(op) {
      const result = await this.$api.workOrderAudit.getBackOpinionList({
        wkId: op
      });
      if (result.code === "200") {
        this.backOptionList = result.data.list;
      }
    },
    /**
     * 退回-退回工单确定操作
     */
    async sendbackHandleOk() {
      const filter = {
        wkId: this.curWkId,
        returnCode: this.form.returnCode,
        returnRemarks: this.form.returnRemark
      };
      if (this.operaType === 2) {
        const index = this.selectedWkIds.indexOf(this.curWkId);
        this.selectedWkIds.splice(index, 1);
      }

      const result = await this.$api.workOrderAudit.backupWorkOrder(filter);
      if (result.code === "200") {
        this.$message.success("退回成功");
        this.sendBackVisible = false;

        const exeeListFilter = {
          keywords: "",
          current: 1,
          pageSize: 20,
          type: "2",
          wkId: this.selectedWkIds
        };
        this.$parent.getExamineeList(exeeListFilter);
        if (this.selectedWkIds.length > 0) {
          this.$router.push({
            path: "/DataModifyOrder/BatchReview"
          });
        } else {
          this.$router.push({
            path: "/DataModifyOrder/workOrderAudit"
          });
        }
      }
    },
    sendbankHandleCancel() {
      this.sendBackVisible = false;
    }
  }
};
</script>
 
<style scoped lang = "less">
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
</style>