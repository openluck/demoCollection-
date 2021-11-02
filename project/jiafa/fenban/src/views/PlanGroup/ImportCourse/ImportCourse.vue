<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-04-26 17:23:09
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-26 13:26:52
-->

<template>
  <div>
    <a-modal
      class="import-course"
      :visible="importCourseVisible"
      title="选课活动"
      width="700px"
      @cancel="CloseModel()"
      destroyOnClose
    >
      <div class="select-list">
        <!-- 切换导入方式按钮 1是手动 2是系统-->
        <a-button-group>
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
        </a-button-group>
        <!-- 查询 -->
        <div class="select-group">
          <!-- 有无人员名单 -->
          <a-select
            default-value="请选择人员名单"
            style="width: 140px"
            :headers="headers"
            @change="ChangeStuList"
            class="select-btn stu-select"
            v-show="showPeolpleList"
          >
            <a-select-option value="有人员名单">有人员名单</a-select-option>
            <a-select-option value="无人员名单">无人员名单</a-select-option>
          </a-select>
          <!-- 选择年级 -->
          <a-select
            :default-value="defaultNameValue"
            :defaultValue="defaultIdValue"
            style="width: 120px"
            class="select-btn grade-select"
            @change="handleChangeGrade"
            v-show="showSelect"
          >
            <a-select-option
              v-for="(item, index) in gradeList"
              :value="item.gradeId"
              :key="index"
              >{{ item.gradeName }}</a-select-option
            >
          </a-select>
        </div>
      </div>

      <!-- 切换的内容 -->
      <div class="change-content">
        <!-- 手动导入 -->
        <div v-show="importCon === 1">
          <a
            href="javascript:;"
            v-if="showErrorTem"
            class="error-tem"
            @click="uploadErrorTemplate"
            >下载错误信息模板</a
          >
          <!-- 上传文件 -->
          <a-upload-dragger
            class="upload-excel"
            name="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :multiple="false"
            :action="baseUrl + '/Common/uploadExcel'"
            :beforeUpload="beforeUpload"
            @change="uploadExcel"
            :fileList="fileList"
            :headers="headers"
          >
            <a href="javascript:;" @click.stop="uploadTemplate" class="upload-tem">下载模板</a>

            <p class="ant-upload-drag-icon">
              <svg-icon
                class="op_daoru"
                icon-class="xuanke_upload"
                style="font-size: 50px"
              ></svg-icon>
            </p>
            <p class="ant-upload-text">点击或将文件拖拽至框内上传</p>
            <!-- <p class="donwload-tem">下载模板</p> -->
            <p class="ant-upload-hint">支持扩展名: .xls，.xlsx</p>
          </a-upload-dragger>
        </div>
        <!-- 系统导入 -->
        <div v-show="importCon === 2">
          <a-table
            :columns="columns"
            ref="table"
            :row-selection="rowSelection"
            :pagination="pagination"
            :bordered="true"
            class="app"
            :data-source="dataSource"
            :rowKey="(row) => row.selCourseId"
          >
            <!-- 选课活动 -->
            <template slot="chooseClass" slot-scope="text">
              <div class="chooseClass">
                <span>{{ text }}</span>
                <!-- <div>(<span class="see-result">查看选课结果</span>)</div> -->
              </div>
            </template>
            <!-- 人员名单 -->
            <template slot="isPeople" slot-scope="text">{{
              text ? "有" : "无"
            }}</template>
          </a-table>
        </div>
      </div>
      <template slot="footer">
        <a-button class="themeBtn" @click="comfirmImport()">确定</a-button>
        <a-button @click="CloseModel()">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { downloadFile } from "../../../Utils/util";
import { baseUrl } from "../../../Utils/global";
// 表头的数据
const columns = [
  {
    title: "选课活动名称",
    dataIndex: "selCourseName",
    key: "sleCourseName",
    scopedSlots: { customRender: "chooseClass" },
    align: "left",
  },
  {
    title: "关联年级",
    dataIndex: "grade",
    key: "grade",
    align: "left",
  },
  {
    title: "有无人员名单",
    dataIndex: "isPeopleList",
    key: "isPeopleList",
    // scopedSlots: { customRender: "isPeople" },  这个是插槽的方式
    // 还有一种方式就直接函数
    customRender: function(text) {
      return "有";
    },
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
      importCon: 2, // 内容切换
      columns, // 表头数据
      pagination: {
        current: 1,
        defaultPageSize: 6,
        showTotal: (total, range) => `当前显示${range[1]}条，共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 页数切换
      },
      showSelect: true, // 年级框是否显示
      isActive: true, // 切换导入方式按钮
      showPeolpleList: false,
      showSelectTem: false,
      defaultNameValue: "",
      defaultIdValue: "",
      // gradeNameList: [], // 年级名称列表
      // gradeIdList: [], // 年级id列表
      gradeList: [], // 年级列表
      dataSource: [], // 年级表格数据
      tableCurrent: 1, // 表格默认页
      tablepageSize: 6, // 表格默认每页条数
      loading: false,
      templateKey: "", // 人员名单模板
      fileName: "", // 分班模板名字
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
    };
  },
  computed: {
    // 表格全选选择
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectGroupList = selectedRows.map((item) => item.selCourseId);
        },
      };
    },
  },
  mounted() {
    // 获取年级列表，以及年级对应的id
    this.getGradesListByOrganizationId();
    this.headers.token = sessionStorage.getItem("fenban_token");
  },
  methods: {
    /**
     * @desc 向父组件传递关闭弹窗事件
     */
    CloseModel() {
      this.$emit("CloseModel", this.importCourseVisible);
      this.showErrorTem = false;
      this.templateKey = "";
      this.fileName = "";
      this.isStuList = "";
    },

    /**
     * @desc 获取年级列表，以及年级对应的id
     */
    async getGradesListByOrganizationId() {
      let res =
        await this.$api.getDivideClassList.getGradesListByOrganizationId();
      if (res.code === "200") {
        this.gradeList = res.data;
        this.defaultNameValue = this.gradeList[0].gradeName;
        this.defaultIdValue = this.gradeList[0].gradeId;
        // this.gradeNameList = res.data.map((item) => item.gradeName);
        // this.gradeIdList = res.data.map((item) => item.gradeId);
      }
    },

    /**
     * @desc 获取表格数据
     * value 下拉框项
     */
    async getImportData(value) {
      this.loading = true;
      let data = {
        current: this.tableCurrent,
        pageSize: this.tablepageSize,
      };
      this.gradeValue = value;
      if (value) {
        // 年级与年级id对应
        // let index = this.gradeNameList.indexOf(value);
        // if (index >= 0) {
        // data.grade = this.gradeIdList[index];
        data.grade = value;
        // }
      } else {
        // 初始化grade
        data.grade = this.gradeList[0].gradeId;
      }
      const res = await this.$api.getDivideClassList.getCourseGroupList(data);
      if (res.code === "200") {
        this.dataSource = res.data.list;
        this.pagination.total = res.data.pagination.total;
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
    changeContent(index) {
      this.importCon = index;
      if (index === 1) {
        this.isActive = false;
        this.showPeolpleList = true;
        this.showSelect = false;
        // this.showSelectTem
        //   ? (this.showSelect = false)
        //   : (this.showSelect = true);
      } else {
        this.showSelect = true;
        this.isActive = true;
        this.showPeolpleList = false;
      }
    },
    selectedRowKeys() {},
    onSelectChange() {},

    /**
     * @desc 手动导入有无人员名单
     */
    ChangeStuList(value) {
      if (value === "有人员名单") {
        // this.showSelect = false;
        // this.showSelectTem = true;
        this.templateKey = "4a0a7d3dce3144ed94d4d6f1cf421fa6";
        this.fileName = "学生分班有人员名单模板";
        this.isStuList = "1";
      } else {
        // this.showSelect = true;
        // this.showSelectTem = false;
        this.templateKey = "4a0a7d3dce3144ed94d4d6f1cf421fa5";
        this.fileName = "学生分班无人员名单模板";
        this.isStuList = "0";
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
        this.$message.warning("请选择Excel文件！", 5);
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
          `${info.file.response.data.excelurl} 文件上传成功`, 5
        );
        this.excelurl = info.file.response.data.excelurl;
      } else if (status === "error") {
        this.$message.error(`${info.file.response.data.excelurl} 上传文件失败`, 5);
      } else if (status === "removed") {
        this.$message.success(`${info.file.response.data.excelurl} 删除成功`, 5);
        this.fileList = [];
        this.excelurl = "";
      }
    },

    /**
     * @desc 弹窗确定导入
     * importCon 是手动导入 2是系统导入
     */
    async comfirmImport() {
      if (this.importCon === 1) {
        if (this.isStuList === "") {
          this.$message.error("请选择人员名单", 5);
        } else if (this.fileList.length === 0) {
          this.$message.error("请上传文件", 5);
        } else {
          let data = {
            isStuList: this.isStuList,
            excelurl: this.excelurl,
          };
          const res = await this.$api.getDivideClassList.importNewCourseGroup(
            data
          );
          if (res.code === "200") {
            this.$message.success(res.message, 5);
            this.CloseModel();
            this.$parent.getPlanGroupList();
          } else if (res.code === "400") {
            // 下载错误信息
            this.$message.error(res.message, 5);
            if (res.data !== "") {
              this.showErrorTem = true;
              this.errorExcelurl = res.data;
            }
          } else {
            this.$message.error(res.message, 5);
          }
        }
      } else if (this.importCon === 2) {
        let data = {
          list: this.selectGroupList,
        };
        const res = await this.$api.getDivideClassList.importExistCourseGroup(
          data
        );
        if (res.code === "200") {
          this.$message.success(res.message, 5);
          this.CloseModel();
          this.$parent.getPlanGroupList();
          this.showErrorTem = false;
        }
      }
    },

    /**
     * @desc 下载模板
     */
    async uploadTemplate() {
      try {
        if (this.templateKey === "") {
          this.$message.error("请选择人员名单", 5);
        } else {
          const data = {
            key: this.templateKey,
          };
          const res = await this.$api.getDivideClassList.downExcelTep(data);
          downloadFile(res, this.fileName);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * @desc 下载错误信息模板
     */
    async uploadErrorTemplate() {
      let data = {
        isStuList: this.isStuList,
        excelurl: this.errorExcelurl,
      };
      const errorRes = await this.$api.getDivideClassList.downExcelError(data);
      downloadFile(errorRes, this.errorExcelurl);
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
    }
    .grade-select {
      right: 0;
    }
    .stu-select {
      right: 0;
    }

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
      position: relative;
      width: 100%;
      height: 430px;
      display: block;
      margin: 0 auto 0;
      .donwload-tem {
        color: #1ba4b3;
      }
    }

    .upload-tem {
      position: absolute;
      top: 53%;
      right: 23%;
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
}
</style>
