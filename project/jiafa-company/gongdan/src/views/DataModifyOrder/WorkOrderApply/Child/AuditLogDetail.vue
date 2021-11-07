<template>
  <div class="audit-log-detail">
    <GlobalModal 
      :visible="visible" 
      title="工单退回详情" 
      :destroyOnClose="true"
      @cancel="closeModal" 
      :footer="null" 
      :width="500"
    >
      <div class="information-type">
        <label for="">退回意见类型：</label>
        <div>{{returnCode}}</div>
      </div>
      <div class="information-detail">
        <label for="">退回意见：</label>
        <a-textarea disabled v-model="returnRemarks" style="width:300px" name="" id="" cols="1" rows="4" />
      </div>
      <div>
      <h3>考生详情退回意见</h3>
      <a-table 
        class="information-table"
        :columns="auditDetailColumns" 
        :data-source="auditDetailData"
        :pagination="false"
        :loading="auditDetailLoading"
        :rowKey='row=>row.remarksId'
        :scroll="{ y: 260 }"
        :rowClassName="
          (record, index) => {
            return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
          }"
      >
        <span slot="remarkChild" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">{{text}}</template>
            <span>{{text || "--"}}</span>
          </a-tooltip>
        </span>
      </a-table>
      </div>
    </GlobalModal>
  </div>
</template>
 
<script>
/**
 * @description 工单退回意见详情
 * @date 2020-12-9 17:19:35
 */
import GlobalModal from "@/components/common/draggableModal";
const auditDetailColumns = [
  {
    title: "考生姓名",
    dataIndex: "name",
    key: "name",
    align: "left"
  },
  {
    title: "考生退回意见",
    dataIndex: "remarkChild",
    key: "remarkChild",
    ellipsis: true,
    scopedSlots: { customRender: "remarkChild" },
    align: "center"
  },
]
export default {
  name: "AuditLogDetail",
  components: { GlobalModal },
  data () {
    return {
      visible: false,
      auditDetailColumns,
      auditDetailData:[],
      auditDetailLoading:false,
      returnCode:"",
      returnRemarks:""
     }
  },
  computed: {
  
  },
  mounted() {
  
  },
  methods: {
     showModal(record) {
      const {returnList,returnRemarks,returnCode} = record
      this.auditDetailData = returnList;
      this.returnRemarks = returnRemarks;
      this.returnCode = returnCode;
      this.visible = true;
    },
    closeModal(){
      this.visible = false;
    }
  },
}
</script>
 
<style scoped lang="less">
/deep/.ant-modal-footer{
  display: none;
}
.information-type{
    display: flex;
    margin-left: 20px;
    label{
      width: 100px;
      text-align: right;
    }
  }
  .information-detail{
    display: flex;
    text-align: right;
    margin: 20px;
    label{
      width: 100px;
      text-align: right;
    }
  }
  h3{
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #e6ecf2;
    position: relative;
    padding-left: 10px;
    padding-bottom: 10px;
    margin-top:  40px;
    &::before{
      content: "";
      position: absolute;
      left: 0;
      top: 2px;
      width: 4px;
      height: 18px;
      background: #000;
    }
  }
  .information-table{
    margin-top: 20px;
    // 表格隔行变色
  /deep/ .even-row {
      background-color: #f7f8fa;
    }
  }
 .audit-log-detail{
  padding: 20px;
 }
</style>