<template>
  <div class="log-detail">
    <!-- 审核日志详情弹出框 -->
    <drag-modal :visible="logDetailVisible" @cancel="()=>{logDetailVisible=false}" :footer="null">
      <div class="logdetail-modal-title" slot="title">工单退回意见详情</div>
      <a-form-model :model="logDetailForm" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="退回意见类型">
          <a-input v-model="logDetailForm.returnCode"></a-input>
        </a-form-model-item>
        <a-form-model-item label="退回意见">
          <a-input v-model="logDetailForm.returnRemark" type="textarea" />
        </a-form-model-item>
      </a-form-model>
      <div class="logdetail-modal-table-title sendback-modal-table-title">
        <span class="title-text">考生详细退回意见</span>
      </div>
      <div class="logdetail-modal-table">
        <a-table
          :columns="logDetailColumns"
          :data-source="logBackOptionList"
          :row-key="record=>record.time"
          :scroll="{ y: logDetailScrollHeight }"
          :pagination="false"
          :showHeader="false"
          size="middle"
          :bordered="false"
        ></a-table>
      </div>
    </drag-modal>
  </div>
</template>
 
<script>
const logDetailColumns = [
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
import DragModal from "@/components/common/draggableModal";
export default {
  name: "",
  components: { DragModal },
  data() {
    return {
      //审核日志详情弹框数据
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      logDetailVisible: false,
      logDetailForm: {
        returnCode: "",
        returnRemark: ""
      },
      logDetailColumns,
      logBackOptionList: [],
      logDetailScrollHeight: 200
    };
  },
  computed: {},
  mounted() {},
  methods: {
    /**
     * 获取审核日志详情
     */
    getAuditLogDetails(record) {
      if (record.remark) {
        let remarks = record.remark;
        this.logDetailForm.returnCode = this.filterReOption(remarks.returnCode);
        this.logDetailForm.returnRemark = remarks.returnRemarks;
        this.logBackOptionList = remarks.examineeDetailAdvice;
      }
      this.logDetailVisible = true;
    },
    filterReOption(op) {
      let reOptionType = "";
      switch (op) {
        case "00":
          reOptionType = "证明材料不合规";
          break;
        case "01":
          reOptionType = "修改项录入不合规";
          break;
        case "02":
          reOptionType = "其他";
          break;
        default:
      }
      return reOptionType;
    }
  }
};
</script>
 
<style scoped lang = "less">
</style>