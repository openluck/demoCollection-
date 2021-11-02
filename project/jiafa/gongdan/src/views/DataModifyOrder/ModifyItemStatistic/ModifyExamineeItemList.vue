<template>
  <div class="work-order-audit">
    <div class="work-order-audit-title">
      <span class="title">{{ pageTitle }}</span>
      <a-button @click="back">
        <svg-icon icon-class="返回" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>返回
      </a-button>
    </div>
    <a-divider />
    <div class="work-order-audit-search">
      <a-form layout="inline">
        <a-form-item label="搜索">
          <a-input v-model="fetchData.keywords" placeholder="姓名、身份证号"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">
            <svg-icon icon-class="sousuo" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>搜索
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 表格 -->
    <div class="work-order-audit-table">
      <a-table
        :columns="columns"
        :data-source="examineeList"
        :loading="tableLoading"
        :row-key="(record) => record.bmh"
        :pagination="pagination"
        bordered
        :rowClassName="
          (record, index) => {
            return index % 2 === 1 ? 'even-row' : ''
          }
        "
      >
        <span slot="changeitem" slot-scope="text">
          <a-tooltip>
            <template slot="title">{{ text }}</template>
            {{ text }}
          </a-tooltip>
        </span>
        <span slot="oldValue" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">{{ text }}</template>
            {{ text }}
          </a-tooltip>
        </span>
        <span slot="newValue" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">{{ text }}</template>
            {{ text }}
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
  </div>
</template>
<script>
import { mergeCellKey2 } from "@/Utils/util";
import { mapState } from "vuex";
// const
export default {
  name: "",
  components: {},
  data() {
    const columns = [
      {
        title: "报名号",
        dataIndex: "bmh",
        key: "bmh",
        align: "center",
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text}</span> : "",
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey2(
            text,
            this.examineeList,
            "bmh",
            "bmh",
            index
          );
          return obj;
        }
      },
      {
        title: "考生姓名",
        dataIndex: "examineeName",
        key: "examineeName",
        align: "center",
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
          return obj;
        }
      },
      {
        title: "证件号",
        dataIndex: "IdNumber",
        key: "IdNumber",
        align: "center",
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : "",
            attrs: {}
          };
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            "IdNumber",
            "bmh",
            index
          );
          return obj;
        }
      },
      {
        title: "变更项",
        dataIndex: "changeItem",
        key: "changeItem",
        align: "center",
        ellipsis: true,
        scopedSlots: { customRender: "changeitem" }
      },
      {
        title: "原始值",
        dataIndex: "oldValue",
        key: "oldValue",
        align: "center",
        ellipsis: "true",
        scopedSlots: { customRender: "oldValue" }
      },
      {
        title: "变更值	",
        dataIndex: "newValue",
        key: "newValue",
        align: "center",
        ellipsis: "true",
        scopedSlots: { customRender: "newValue" }
      },
      {
        title: "状态",
        dataIndex: "auditStatus",
        key: "auditStatus",
        align: "center",
        // ellipsis: 'true',
        scopedSlots: { customRender: "auditStatus" }
      },
      {
        title: "最终修改时间",
        dataIndex: "finalModifyTime",
        key: "finalModifyTime",
        align: "center",
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
          return obj;
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        align: "center",
        // scopedSlots: { customRender: 'operation' },
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <a-button
                  onclick={() => {
                    this.getDetail(record);
                  }}
                >
                  {text.text}
                </a-button>
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
          return obj;
        }
      }
    ];
    return {
      examineeList: [],
      auditTypeList: [], //审核状态列表
      columns,
      tableLoading: false,
      fetchData: {
        current: 1, // 当前请求页数，从1开始
        pageSize: 20, // 每页数据条数
        keywords: "",
        changeItemType: "", //变更项类型
        updateKey: "", //变更项key值
        commitOrgId: "" //提交机构Id
      },
      pagination: {
        current: 1,
        defaultPageSize: 20,
        showSizeChanger: false, // 显示可改变每页数量
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        total: 0, //总条数
        size: "middle",
        pageSizeOptions: ["2", "5", "10", "20", "50"], // 每页数量选项
        buildOptionText: pageSizeOptions => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      }, // table的分页器
      pageParams: {}, // 页面参数
      pageTitle: ""
    };
  },
  computed: { ...mapState("codeTable", ["auditType"]) },
  created() {
    // 获取路由参数
    this.pageParams = Object.assign({}, this.$route.query);
    this.filterTitle();
    this.fetchData.commitOrgId = this.pageParams.commitOrgId;
    this.fetchData.changeItemType = this.pageParams.type;
    this.fetchData.updateKey = this.pageParams.updateKey;
  },
  mounted() {
    this.auditTypeList = [...this.auditType];
    this.getAuditOrderList();
  },
  methods: {
    search() {
      this.getAuditOrderList();
    },
    // 返回上一页
    back() {
      window.history.go(-1);
    },
    filterTitle() {
      switch (this.pageParams.type) {
        case "1":
          this.pageTitle = "变更项申请总次数";
          break;
        case "2":
          this.pageTitle = "已修改变更项申请次数";
          break;
        case "3":
          this.pageTitle = "待修改变更项申请次数";
          break;
        case "4":
          this.pageTitle = "待审核变更项次数";
          break;

        default:
          break;
      }
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.current = page;
      this.getAuditOrderList();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.current = 1;
    },

    async getAuditOrderList() {
      this.tableLoading = true;
      const res = await this.$api.ModifyItemStatistic.getExamineeChangeItemList(
        this.fetchData
      );
      if (res.code === "200") {
        this.examineeList = res.data.list;
        this.pagination.total = res.data.pagination.total;
        this.tableLoading = false;
      } else {
        this.$message.error(res.message);
        this.tableLoading = false;
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
    getDetail(record) {
      this.$router.push({
        path: "/DataModifyOrder/examineeDetail",
        query: { bmh: record.bmh, wkId: record.wk_id, showReOption: false }
      });
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
