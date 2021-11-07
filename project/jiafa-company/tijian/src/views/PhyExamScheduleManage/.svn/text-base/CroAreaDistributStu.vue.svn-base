<template>
  <div class="cro-area-audit">
    <div class="cro-area-audit-header">
      <div class="cro-area-audit-header-first">
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
          <span>接收机构：</span>
          <a-select
            v-model="search.receiveOrgCode"
            style="width: 120px"
            placeholder="请选择"
            allowClear
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option
              v-for="item of receiveOrgCodeList"
              :key="item.orgcode"
              :value="item.orgcode"
              :title="item.orgName"
            >
              {{ item.orgName }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <span>申请状态：</span>
          <a-select v-model="search.applyStatus" style="width: 120px">
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option :value="0"> 待审核 </a-select-option>
            <a-select-option :value="1"> 审核通过 </a-select-option>
            <a-select-option :value="2"> 审核不通过 </a-select-option>
          </a-select>
        </div>

        <a-button type="primary" @click="query()">查询</a-button>
      </div>
      <div class="cro-area-audit-header-first">
        <a-button type="primary" @click="openModal()">
          <svg-icon
            icon-class="shenqing"
            :scale="0.85"
            style="margin-right: 5px"
          ></svg-icon>
          发起申请</a-button
        >
        <a-button type="primary" @click="exportExcel()">
          <svg-icon
            icon-class="daochu"
            :scale="0.85"
            style="margin-right: 5px"
          ></svg-icon>
          导出Excel</a-button
        >
      </div>
    </div>

    <!-- 表格 -->
    <div class="cro-area-audit-table">
      <a-table
        :pagination="false"
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :rowKey="(row) => row.applyId"
        :scroll="{ y: tableHeight }"
        size="middle"
        bordered
      >
        <span slot="applyStatus" slot-scope="text" :class="statusColor(text)">{{
          text ? text : "--"
        }}</span>
        <span slot="notPassReason" slot-scope="text">{{
          text ? text : "--"
        }}</span>
        <div slot="handle" slot-scope="text, row" class="handle-button">
          <a-button @click="toDetail(row)">详情</a-button>
        </div>
      </a-table>
    </div>

    <template v-if="isMounted">
      <Page v-show="data.length" @getList="getList" ref="page" />
    </template>

    <a-modal
      v-model="importModalVisible"
      title=" 跨地区分配导入 "
      :maskClosable="false"
      :footer="null"
    >
      <a-spin tip="数据导入中..." :spinning="importSpinLoading">
      <a-spin tip="下载中..." :spinning="downloadSpinLoading">
        <a-steps direction="vertical" :initial="0" :current="currentStep">
          <a-step title="下载模板">
            <template #description>
              <div
                @click="download"
                style="
                  color: #b6e7a7;
                  text-decoration: underline;
                  cursor: pointer;
                "
              >
                <svg-icon
                  icon-class="wenjian"
                  :scale="0.85"
                  style="margin-right: 5px"
                ></svg-icon>
                <span>跨地区分配导入模板.xls</span>
              </div>
            </template>
          </a-step>
          <a-step title="选择文件" status="wait">
            <template #description>
              <a-upload
                accept=".xls,.xlsx"
                :beforeUpload="beforeUpload"
                :fileList="fileList"
                :remove="removeFile"
              >
                <a-button> 选择文件 </a-button>
              </a-upload>
            </template>
          </a-step>
          <a-step title="上传文件">
            <template #description>
              <a-button type="primary" @click="uploadExcel">上传</a-button>
            </template>
          </a-step>
        </a-steps>
        <div>
          导入说明
          <p>*请勿更改模板文件格式，仅支持上传03版本的 Excel 文件</p>
          <p>*智能导入方式：导入数据重复导入时，覆盖导入。</p>
        </div>
      </a-spin>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import { baseUrl } from "@/utils/global";
import {
  timestampToTime,
  getCharFromUtf8,
  downloadFile,
} from "../../utils/util";
function filterArray(data, parentCode) {
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parentCode === parentCode) {
      var obj = data[i];
      temp = filterArray(data, data[i].orgcode);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}

const columns = [
  {
    title: "申请日期",
    dataIndex: "applyDate",
    key: "applyDate",
  },
  {
    title: "申请机构",
    dataIndex: "applyOrgCode",
    key: "applyOrgCode",
  },
  {
    title: "接收机构",
    dataIndex: "receiveOrgCode",
    key: "receiveOrgCode",
  },
  {
    // title: "考生人数",
    title: "跨地区分配考生人数",
    width: 150,
    dataIndex: "examineeCount",
    key: "examineeCount",
  },
  {
    title: "申请状态",
    dataIndex: "applyStatus",
    key: "applyStatus",
    scopedSlots: { customRender: "applyStatus" },
  },
  {
    title: "未通过原因",
    width: 150,
    ellipsis: true,
    dataIndex: "notPassReason",
    key: "notPassReason",

    scopedSlots: { customRender: "notPassReason" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "handle" },
    width: 100,
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      importSpinLoading: false,
      downloadSpinLoading: false,
      tableHeight: 0, //table高度
      isMounted: false,
      columns,
      data: [],
      receiveOrgCodeList: [], //接收机构树
      applyDateList: [], //接收日期数组
      replaceFields: {},
      search: {
        receiveOrgCode: "",
        applyDate: null,
        applyStatus: "",
        current: 1,
        pageSize: 20,
      },
      stripTotal: 0, //查询列表总条数
      tableLoading: false,
      importModalVisible: false, //导入弹框显隐
      currentStep: 0, //当前步骤
      fileList: [], //已经上传的文件列表
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
  watch: {
    "fileList.length"(newValue) {
      if (newValue === 1) {
        this.$nextTick(() => {
          this.currentStep = 1;
          this.currentStep = 2;
        });
      } else {
        this.currentStep = 1;
      }
    },
  },
  async mounted() {
    await this.getList();
    this.getReceiveOrgCodeTree();
    this.getApplyDateList();
    this.isMounted = true;
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  methods: {
    filterArray,
    timestampToTime,
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".cro-area-audit-table");
      this.tableHeight = tableHeight.clientHeight - 47;
    },
    //点击查询
    async query() {
      this.$refs.page.pagination.current = 1;
      this.search.current = 1;
      await this.getList();
      this.$refs.page.returnPageTotal();
    },
    //点击导入按钮
    openModal() {
      this.importModalVisible = true;
    },
    //导入对话框里面的事件
    download() {
      this.downloadTemplate();
    },
    beforeUpload(file, fileList) {
      this.fileList = fileList;
      // await
      // this.currentStep = 2
      return false;
    },
    //删除文件
    removeFile(file) {
      // this.currentStep = 1
      this.fileList = [];
    },

    //点击-考生详情
    toDetail(row) {
      this.$router.push({
        path: "/phyExamScheduleManage/applyDetail",
        query: { applyId: row.applyId },
      });
    },

    // 跨地区分配审核 - 获取审核列表
    async getList() {
      this.tableLoading = true;
      try {
        let { applyDate } = this.search;
        applyDate = applyDate ? applyDate.format("YYYY-MM-DD") : "";
        const res = await this.$api.croAreaDistributStu.getApplyList({
          ...this.search,
          applyDate,
        });
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

    // 跨地区分配审核 - 获取接收机构 树
    async getReceiveOrgCodeTree() {
      try {
        const res = await this.$api.croAreaDistributStu.receiveOrgCodeTree({});
        if (res.code === "200" || res.code === 200) {
          this.receiveOrgCodeList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
      }
    },

    // 跨地区分配审核 - 获取申请日期
    async getApplyDateList() {
      try {
        const res = await this.$api.croAreaDistributStu.applyDateList({});
        if (res.code === "200" || res.code === 200) {
          this.applyDateList = res.data;
          // this.applyDateList = res.data.map(item => timestampToTime(item, 1));
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
      }
    },

    // 考生跨地区分配-导入-下载模板
    async downloadTemplate() {
        this.downloadSpinLoading = true
      try {
        const res = await this.$api.croAreaDistributStu.downloadTemplate({});
        downloadFile(res);
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.downloadSpinLoading = false
      }
    },

    // 考生跨地区分配-导入-上传文件
    async uploadExcel() {
      this.importSpinLoading = true
      const that = this;
      try {
        let form = new FormData();
        let file = this.fileList[0];
        form.append("file", file);
        const res = await axios.post(
          baseUrl + "croAreaDistributStu/uploadExcel",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              token: sessionStorage.getItem("token"),
            },
            responseType: "blob",
          }
        );
        // const res = await this.$api.croAreaDistributStu.uploadExcel(form);
        let fileReader = new FileReader();
        fileReader.onload = function() {
          let errorObj = {};
          try {
            let str = this.result;
            const startIndex = this.result.indexOf('{"result');
            const endIndex = this.result.lastIndexOf("}");
            if (startIndex > -1 && endIndex > -1) {
              let targetStr = str.slice(startIndex, endIndex + 1);
              // console.log("targetStr", targetStr);
              errorObj = JSON.parse(targetStr);
            }
            let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
            if (jsonData.code === "200" || jsonData.code === 200) {
              that.$success({
                title: "导入提示",
                okText: "确定",
                content: jsonData.message,
              });
              that.getList();
            } else {
              that.$error({
                title: "导入提示",
                okText: "确定",
                content: "数据导入失败！" + jsonData.message,
              });
            }
          } catch (err) {
            // console.log("errrr", err);
            // 解析成对象失败，说明是正常的文件流 数据导入失败！详情请通过以下链接查看
            that.$error({
              title: "导入提示",
              okText: "确定",
              content: errorObj.message,
            });

            let BLOB = new Blob([res.data], {
              type: "application/vnd.ms-excel",
            });

            let fileName = res.headers["content-disposition"]
              .split(";")[1]
              .split("=")[1];
            fileName = getCharFromUtf8(fileName);
            // console.log(fileName);

            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(BLOB);
            // console.log("link.href", link);
            link.download = fileName;

            const uA = window.navigator.userAgent;
            const isIE =
              /msie\s|trident\/|edge\//i.test(uA) &&
              !!(
                "uniqueID" in document ||
                "documentMode" in document ||
                "ActiveXObject" in window ||
                "MSInputMethodContext" in window
              );
            // console.log("isIE", isIE);
            if (isIE) {
              navigator.msSaveBlob(new Blob([res.data]), fileName);
            } else {
              link.click();
              window.URL.revokeObjectURL(link.href);
            }
          }
        };
        await fileReader.readAsText(res.data);
        this.importModalVisible = false;
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.importSpinLoading = false
      }
    },

    // 考生跨地区分配-导出Excel
    async exportExcel() {
      this.$store.state.app.exportSpinLoading = true
      try {
        const res = await this.$api.croAreaDistributStu.exportExcel(
          this.search
        );
        downloadFile(res);
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.$store.state.app.exportSpinLoading = false
      }
    },

    getApplyDateStyle(current, today) {
      const style = {};
      if (this.applyDateList.includes(current.format("YYYY-MM-DD"))) {
        style.border = "1px solid #1890ff";
        style.borderRadius = "50%";
      }
      return style;
    },
  },
};
</script>

<style scoped lang="less">
.cro-area-audit {
  height: 100%;
  display: flex;
  flex-direction: column;
  .cro-area-audit-header-first {
    display: flex;
    margin-bottom: 15px;
    & > * {
      margin-right: 15px;
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
}
</style>
