<template>
  <div class="log-table">
    <!-- 审核日志表格 -->
    <div class="audit-log-table">
      <a-table
        class="audit-log-table-content"
        :columns="logColumns"
        :showHeader="showHeader"
        :data-source="auditLogList"
        :row-key="record=>record.id"
        :pagination="false"
        size="middle"
        :scroll="{ y: logScrollHeight }"
        :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
            }
          "
      >
        <span slot="status" slot-scope="text,record">
          <a-tag :color="colorSwitch(text,record)">{{auditStatusSwitch(text)||'--'}}</a-tag>
        </span>
        <div class="remark" slot="remark" slot-scope="text,record">
          <span v-if="text.returnCode">
            <span class="exee-item">
              【{{filterReOption(text.returnCode)}}】：{{text.returnRemarks}}
              <span
                v-for="(item,index) in text.examineeDetailAdvice"
                :key="index"
              >
                <a @click="getDetail()">{{item.name}}</a>
                {{item.remark}}、
              </span>
            </span>

            <a class="exee-detail" @click="getAuditLogDetails(record)">详情</a>
          </span>
          <span v-else>--</span>
        </div>
      </a-table>
    </div>
    <log-detail ref="logDetail"></log-detail>
  </div>
</template>
 
<script>
const logColumns = [
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 160
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 160,
    scopedSlots: { customRender: "status" }
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
    width: "50%",
    scopedSlots: { customRender: "remark" }
  },
  {
    title: "操作机构",
    dataIndex: "actionAgency",
    key: "actionAgency",
    width: "25%"
  }
];
import LogDetail from "./LogDetail";
import { mapState } from "vuex";
export default {
  name: "",
  components: { LogDetail },
  props: {
    curWkId: String,
    showHeader: Boolean
  },
  data() {
    return {
      logColumns,
      logVisible: false,
      auditLogList: [],
      logScrollHeight: 200,
      auditTypeList: []
    };
  },
  computed: { ...mapState("codeTable", ["returnCode", "auditType"]) },
  mounted() {
    this.auditTypeList = this.auditType;
  },
  methods: {
    /**
     * 获取审核日志
     */
    async getAuditLogList(op) {
      const result = await this.$api.workOrderAudit.getAuditLogList({
        wkId: op
      });
      if (result.code === "200") {
        this.auditLogList = result.data.list;
      }
    },
    auditStatusSwitch(text) {
      let value;
      this.auditTypeList.forEach(item => {
        if (item.code === text) value = item.value;
      });
      return value;
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
    },
    /**
     * 点击考生详情
     */
    getDetail(record) {
      this.$router.push({
        path: "/DataModifyOrder/examineeDetail",
        query: {
          wkId: record.wkId,
          bmh: record.bmh,
          remark: record.remark,
          showReOption: true
        }
      });
    },
    /**
     * 获取审核日志详情
     */
    getAuditLogDetails(record) {
      this.$nextTick(() => {
        this.$refs.logDetail.getAuditLogDetails(record);
      });
    },
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
    }
  }
};
</script>
 
<style scoped lang = "less">
</style>