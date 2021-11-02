<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-08 18:04:05
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-13 10:17:19
-->

<template>
  <div>
    <a-modal
      class="import-course"
      :visible="importCourseVisible"
      title="导入分班方案"
      width="700px"
      @cancel="CloseModel()"
      destroyOnClose
    >
      <div class="select-list">
        <!-- 切换导入方式按钮 1是手动 2是系统-->
        <!-- <a-button-group>
          <a-button
            class="hand-import-btn"
            :class="{ themeBtn: !isActive }"
            @click="changeContent(1)"
            >手动导入</a-button
          >
          <a-button
            class="sys-import-btn"
            :class="{ themeBtn: isActive }"
            @click="changeContent(2)"
            >系统导入</a-button
          >
        </a-button-group>-->
        <span>导入方式：</span>
        <a-radio-group v-model="radioValue" @change="changeContent">
          <a-radio :value="1">手动导入</a-radio>
          <a-radio :value="2">系统导入</a-radio>
        </a-radio-group>
        <!-- 查询 -->
        <div class="select-group">
          <!-- 选择年级 -->
          <a-select
            style="width: 120px"
            class="select-btn grade-select"
            @change="handleChangeGrade"
            v-show="importCon === 2"
            v-model="gradeValue"
          >
            <a-select-option
              v-for="(item, index) in gradeList"
              :value="item.gradeId"
              :key="index"
              >{{ item.gradeName }}</a-select-option
            >
          </a-select>
          <!-- 下载模板 -->
          <div v-show="importCon === 1" class="select-btn">
            <!-- <a-icon type="vertical-align-bottom" /> -->
            <svg-icon
              class="xtdr"
              icon-class="drpk"
              style="color: #40a9ff"
            ></svg-icon>
            <a href="javascript:;" @click="uploadTemplate">下载模板</a>
            <a
              href="javascript:;"
              v-if="showErrorTem"
              class="error-tem"
              @click="uploadErrorTemplate"
              >下载错误信息模板</a
            >
          </div>
        </div>
      </div>

      <!-- 切换的内容 -->
      <div class="change-content">
        <!-- 手动导入 -->
        <div v-show="importCon === 1">
          <!-- <div v-show="true"> -->

          <!-- 上传文件 -->
          <a-upload-dragger
            class="upload-excel"
            name="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :multiple="false"
            :action="baseUrl + 'Common/uploadExcel'"
            :beforeUpload="beforeUpload"
            @change="uploadExcel"
            :fileList="fileList"
            :headers="headers"
          >
            <p class="ant-upload-drag-icon">
              <!-- <a-icon type="excelsc" /> -->
              <svg-icon
                class="excelsc"
                icon-class="excelsc"
                style="color: #40a9ff"
              ></svg-icon>
            </p>
            <p class="ant-upload-text">将选定文件拖拽至框内上传</p>
            <p class="ant-upload-text">点击上传</p>
            <!-- <p class="donwload-tem">下载模板</p> -->
            <!-- <p class="ant-upload-hint">支持扩展名: .excel</p> -->
          </a-upload-dragger>
        </div>
        <!-- 系统导入 -->
        <div v-show="importCon === 2">
          <!-- <div v-show="true"> -->
          <a-table
            :columns="columns"
            ref="table"
            :row-selection="rowSelection"
            :pagination="pagination"
            class="app"
            :data-source="dataSource"
            :rowKey="(row) => row.planId"
            :row-class-name="rowClassName"
            :scroll="{ y: 350 }"
            :loading="loading"
          >
            <!-- 选课活动 -->
            <template slot="chooseClass" slot-scope="text">
              <div class="chooseClass">
                <span>{{ text }}</span>
                <!-- <div>(<span class="see-result">查看选课结果</span>)</div> -->
              </div>
            </template>
            <!-- 人员名单 -->
            <!-- <template slot="isPeople" slot-scope="text">
              {{
              text ? "有" : "无"
              }}
            </template>-->
          </a-table>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="CloseModel()">取消</a-button>
        <a-button
          class="themeBtn"
          :loading="bloading"
          @click="debounceHandleOk()"
          >确定</a-button
        >
        <!-- :loading="bloading" -->
      </template>
    </a-modal>
  </div>
</template>
<script>
import { downloadFile, debounce } from "../../../../Utils/util";
import { baseUrl } from "../../../../Utils/global";
// 表头的数据
const columns = [
  {
    title: "分班方案",
    dataIndex: "divideScheName",
    key: "divideScheName",
    scopedSlots: { customRender: "chooseClass" },
    align: "left",
  },
  {
    title: "关联选课方案",
    dataIndex: "selCourse",
    key: "selCourse",
    align: "left",
  },
  {
    title: "关联年级",
    dataIndex: "selGrade",
    key: "selGrade",
    align: "left",
  },
];
export default {
  name: "ImportCourse",
  props: {
    importCourseVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      radioValue: 1,
      importCon: 1, // 内容切换
      columns, // 表头数据
      pagination: {
        current: 1,
        defaultPageSize: 6,
        // 当前显示${range[1]}条，
        showTotal: (total, range) => `共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 页数切换
      },
      showSelect: true, // 年级框是否显示
      isActive: true, // 切换导入方式按钮
      showPeolpleList: false,
      showSelectTem: false,
      defaultNameValue: "",
      // defaultIdValue: "",
      // gradeNameList: [], // 年级名称列表
      // gradeIdList: [], // 年级id列表
      gradeList: [], // 年级列表
      dataSource: [], // 年级表格数据
      tableCurrent: 1, // 表格默认页
      tablepageSize: 6, // 表格默认每页条数
      loading: false,
      // templateKey: "", // 人员名单模板
      // fileName: "", // 分班模板名字
      headers: {
        // 上传文件需要的token
        token: "",
      },
      fileList: [], // 上传时的文件列表
      excelurl: "", // 导入文件成功的地址
      baseUrl,
      selectGroupList: [], // 手动导入-导入选课活动id
      isStuList: "", // 手动导入有无学生名单
      showErrorTem: false, // 错误信息模板是否显示
      errorExcelurl: "", // 错误信息文件
      gradeValue: "",
      bloading: false,
    };
  },
  computed: {
    // 表格全选选择
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectGroupList = selectedRows.map((item) => item.planId);
        },
      };
    },
  },
  mounted() {
    // 获取年级列表，以及年级对应的id
    // this.getGradesListByOrganizationId();
    this.headers.token = sessionStorage.getItem("paike_token");
  },
  methods: {
    /**
     * @desc 向父组件传递关闭弹窗事件
     */
    CloseModel() {
      this.$emit("CloseModel", this.importCourseVisible);
      this.showErrorTem = false;
      this.clearFileList();
    },

    /**
     * @desc 获取年级列表，以及年级对应的id
     */
    async getGradesListByOrganizationId() {
      let res = await this.$api.DivideClassList.getGradesListByOrganizationId();
      if (res.code === "200") {
        this.gradeList = res.data;
        // this.$nextTick(() => {
        // this.defaultNameValue = this.gradeList[0].gradeName;
        this.gradeValue = this.gradeList[0].gradeName;
        this.defaultIdValue = this.gradeList[0].gradeId;
        this.getImportData(this.defaultIdValue);
        // });
      } else {
        this.$message.error(error);
      }
    },

    /**
     * @desc 获取表格数据
     * value 下拉框年级项
     */
    async getImportData(value) {
      this.loading = true;
      let data = {
        current: this.tableCurrent,
        pageSize: this.tablepageSize,
      };
      this.gradeValue = value;
      try {
        if (value) {
          data.grade = value;
        } else {
          // 初始化grade
          data.grade = this.gradeList[0].gradeId;
        }
        const res = await this.$api.DivideClassList.getDivideClassesListDialog(
          data
        );
        if (res.code === "200") {
          this.dataSource = res.data.list;
          this.pagination.total = res.data.pagination.total;
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
      this.loading = false;
    },

    /**
     * @desc 系统导入的下拉框-获取表格中对应的数据
     * value 下拉框每项内容
     */
    handleChangeGrade(value) {
      this.pagination.current = 1;
      this.tableCurrent = 1;
      this.getImportData(value);
    },

    /**
     * @desc 翻页改变事件
     * page 页数
     */
    onPageChange(page) {
      this.tableCurrent = page;
      this.pagination.current = page;
      this.getImportData(this.gradeValue);
    },

    /**
     * @desc 切换导入方式内容
     * index 1是手动导入 2是系统导入
     */
    changeContent(e) {
      // this.importCon = index;
      let index = parseInt(e.target.value);
      this.importCon = index;
      if (index === 1) {
        this.isActive = false;
        this.showPeolpleList = true;
        this.showSelect = false;
      } else {
        this.showSelect = true;
        this.isActive = true;
        this.showPeolpleList = false;
      }
    },

    /**
     * @desc 清空上传文件列表
     */
    clearFileList() {
      this.fileList = [];
      this.excelurl = "";
    },

    /**
     * @desc 上传文件之前
     */
    beforeUpload(file, fileList) {
      const isXLSX =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        "application/vnd.ms-excel";
      if (!isXLSX) {
        this.$message.warning("请选择Excel文件！");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(new Error("出错了"));
        });
      }
      this.fileList = [file];
    },
    /**
     * @desc 上传文件
     */
    uploadExcel(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.$message.success(
          `${info.file.response.data.excelurl} 文件上传成功`
        );
        this.excelurl = info.file.response.data.excelurl;
      } else if (status === "error") {
        this.$message.error(`${info.file.response.data.excelurl} 上传文件失败`);
      } else if (status === "removed") {
        this.$message.success(`${info.file.response.data.excelurl} 删除成功`);
        this.fileList = [];
        this.excelurl = "";
      }
    },

    /**
     * @desc 弹窗确定导入
     * importCon 是手动导入 2是系统导入
     */
    debounceHandleOk: debounce(
      function () {
        this.comfirmImport();
      },
      2000,
      true
    ),
    comfirmImport() {
      this.importCon === 1 ? this.importNewCourseGroup() : this.sysImport();
    },

    /**
     * @name: 确定系统导入-系统导入
     * @msg:
     * @param {*}
     * @return {*}
     */
    async sysImport() {
      this.bloading = true;
      try {
        if (this.selectGroupList.length === 0) {
          return this.$message.warning("请选择添加项");
        }
        let data = {
          planId: this.selectGroupList,
        };
        const res = await this.$api.DivideClassList.sysImport(data);
        if (res.code === "200") {
          this.$message.success("添加成功");
          this.CloseModel();
          this.$parent.getPlanGroupList();
          this.showErrorTem = false;
          this.bloading = false;
        } else {
          // this.CloseModel();
          this.$message.error(res.message);
          this.bloading = false;
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
        this.bloading = false;
      }
    },
    /**
     * @name: 确定文件上传-手动导入
     * @msg:
     * @param {*}
     * @return {*}
     */
    async importNewCourseGroup() {
      this.bloading = true;
      if (this.excelurl !== "") {
        let data = {
          excelurl: this.excelurl,
        };
        const res = await this.$api.DivideClassList.handleImport(data);
        if (res.code === "200") {
          this.$message.success(res.message);
          this.CloseModel();
          this.$parent.getPlanGroupList();
          this.bloading = false;
        } else if (res.code === "500") {
          // 下载错误信息
          this.$message.error(res.message);
          this.showErrorTem = true;
          this.errorExcelurl = res.message;
          this.bloading = false;
        } else {
          this.$message.error(res.message);
          this.bloading = false;
        }
      } else {
        this.$message.warning("请上传文件");
        this.bloading = false;
      }
    },

    /**
     * @desc 下载模板
     */
    async uploadTemplate() {
      try {
        const data = {
          key: "33df7a08a2f744d2ab7f59ab9ebc7b77",
        };
        const res = await this.$api.DivideClassList.downExcelTep(data);
        // let filename = "学生分班模板";
        downloadFile(res);
      } catch (error) {
        console.log("请求失败！+", error);
      }
    },

    /**
     * @desc 下载错误信息模板
     */
    async uploadErrorTemplate() {
      try {
        let data = {
          excelurl: this.errorExcelurl,
        };
        const errorRes = await this.$api.DivideClassList.downExcelError(data);
        downloadFile(errorRes);
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    /**
     * @name: 表格隔行变色
     * @msg:
     * @param {*} record
     * @param {*} index
     * @return {*}
     */
    rowClassName(record, index) {
      let className = "";
      if (index % 2 === 1) className = "gray";
      return className;
    },
  },
};
</script>

<style lang="less" scoped>
.import-course {
  /deep/ .ant-modal-header {
    text-align: left;
  }
  /deep/ .ant-modal-close-icon {
    color: #000;
  }
  /deep/ .ant-modal-body {
    padding: 10px 24px 24px;
  }
  .select-list {
    margin-bottom: 20px;
    position: relative;

    .select-btn {
      position: absolute;
      top: 0;
      right: 0;

      .error-tem {
        color: red;
        margin-left: 20px;
      }
    }
    // .grade-select {
    //   right: 0;
    // }
    // .stu-select {
    //   right: 0;
    // }

    .hand-import-btn {
      border-top-left-radius: 13px;
      border-bottom-left-radius: 13px;
    }
    .sys-import-btn {
      border-top-right-radius: 13px;
      border-bottom-right-radius: 13px;
    }
  }
  .change-content {
    position: relative;
    height: 460px;

    .people-list {
      margin-left: 120px;
    }
    .upload-excel {
      width: 100%;
      height: 430px;
      display: block;
      margin: 0 auto 0;
      .donwload-tem {
        color: #1ba4b3;
      }
    }

    .error-tem {
      position: absolute;
      right: 0;
      color: red;
    }
  }

  /deep/ .ant-modal-footer {
    text-align: center;
  }
  /deep/ .gray {
    background-color: #fafafa;
  }
  /deep/ .anticon {
    color: rgba(0, 0, 0, 0.65);
  }
  /deep/ .xtdr {
    color: #40a9ff !important;
  }
  .xtdr {
    color: #40a9ff;
  }
  .excelsc {
    font-size: 45px;
  }
  /deep/ .ant-upload-text {
    color: #919599 !important;
  }
}
</style>
