<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-08 18:04:05
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-13 10:51:32
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
      <!-- 切换的内容 -->
      <div class="change-content">
        <!-- 手动导入 -->
        <div>
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
      </div>
      <template slot="footer">
        <a-button @click="CloseModel()">取消</a-button>
        <a-button
          class="themeBtn"
          :loading="bloading"
          @click="debounceHandleOk()"
          >确定</a-button
        >
      </template>
    </a-modal>
  </div>
</template>
<script>
// import { downloadFile, debounce } from "../../../../Utils/util";
import { downloadFile, debounce } from "../../../../../Utils/util";
import { baseUrl } from "../../../../../Utils/global";
export default {
  name: "ImportBaseData",
  props: {},
  data() {
    return {
      importCourseVisible: false, // 弹窗显示
      showSelect: true, // 年级框是否显示
      isActive: true, // 切换导入方式按钮
      showPeolpleList: false,
      showSelectTem: false,
      defaultNameValue: "",
      gradeList: [], // 年级列表
      dataSource: [], // 年级表格数据
      tableCurrent: 1, // 表格默认页
      tablepageSize: 6, // 表格默认每页条数
      loading: false,
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
  mounted() {},
  methods: {
    /**
     * @desc 向父组件传递关闭弹窗事件
     */
    CloseModel() {
      this.importCourseVisible = false;
    },
    /**
     * @desc 向父组件传递关闭弹窗事件
     */
    showModel() {
      this.importCourseVisible = true;
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
